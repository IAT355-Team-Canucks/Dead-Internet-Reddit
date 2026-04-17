import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../../App.css";

export const VerticalBoxPlot = ({
  title = "Box Plot Component",
  height = 600,
  xKey = "sentiment_score",
  yKey = "bot_type_label",
  xLabel = "Category",
  yLabel = "sentiment_score",
  csvPath = `${import.meta.env.BASE_URL}data/reddit_dead_internet_analysis.csv`,
}) => {
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [containerWidth, setContainerWidth] = useState(900);

  // Track container width
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const width = entry.contentRect.width;
      if (width > 0) {
        setContainerWidth(width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Observer for animation
  useEffect(() => {
    if (!containerRef.current || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setShouldAnimate(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !shouldAnimate || containerWidth <= 0) return;

    const width = containerWidth;
    const margin = {
      top: 20,
      right: 30,
      bottom: 80,
      left: containerWidth < 600 ? 70 : 120,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(containerRef.current).select("svg").remove();

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto")
      .style("display", "block");

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv(csvPath, d3.autoType).then((data) => {
      const filtered = data.filter(
        (d) =>
          d[xKey] != null &&
          d[yKey] != null &&
          !Number.isNaN(+d[xKey])
      );

      if (!filtered.length) return;

      const categories = Array.from(
        new Set(filtered.map((d) => String(d[yKey])))
      ).sort(d3.ascending);

      const grouped = d3.groups(filtered, (d) => String(d[yKey]));

      const stats = grouped.map(([category, values]) => {
        const sorted = values
          .map((d) => +d[xKey])
          .sort(d3.ascending);

        const q1 = d3.quantileSorted(sorted, 0.25);
        const median = d3.quantileSorted(sorted, 0.5);
        const q3 = d3.quantileSorted(sorted, 0.75);
        const min = d3.min(sorted);
        const max = d3.max(sorted);
        const iqr = q3 - q1;

        const lowerFence = q1 - 1.5 * iqr;
        const upperFence = q3 + 1.5 * iqr;

        const whiskerMin = d3.min(sorted.filter((v) => v >= lowerFence)) ?? min;
        const whiskerMax = d3.max(sorted.filter((v) => v <= upperFence)) ?? max;

        return {
          category,
          values,
          q1,
          median,
          q3,
          whiskerMin,
          whiskerMax,
        };
      });

      const xExtent = d3.extent(filtered, (d) => +d[xKey]);

      const x = d3
        .scaleBand()
        .domain(categories)
        .range([0, innerWidth])
        .padding(containerWidth < 600 ? 0.2 : 0.35);

      const y = d3
        .scaleLinear()
        .domain(xExtent)
        .nice()
        .range([innerHeight, 0]);

      const color = d3
        .scaleSequential(d3.interpolatePlasma)
        .domain(xExtent);

      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y);

      const xAxisGroup = chart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis);

      const yAxisGroup = chart.append("g").call(yAxis);

      xAxisGroup.selectAll("text")
        .attr("fill", "white")
        .style("font-size", containerWidth < 600 ? "10px" : "12px")
        .attr("transform", containerWidth < 600 ? "rotate(-25)" : null)
        .style("text-anchor", containerWidth < 600 ? "end" : "middle");

      yAxisGroup.selectAll("text")
        .attr("fill", "white")
        .style("font-size", containerWidth < 600 ? "10px" : "12px");

      xAxisGroup.selectAll("path, line").attr("stroke", "white");
      yAxisGroup.selectAll("path, line").attr("stroke", "white");

      chart
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + (containerWidth < 600 ? 60 : 50))
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .text(xLabel);

      chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", containerWidth < 600 ? -50 : -80)
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .text(yLabel);

      stats.forEach((d) => {
        const xPos = x(d.category);
        const centerX = xPos + x.bandwidth() / 2;
        const boxWidth = x.bandwidth() * 0.75;
        const jitterAmount = boxWidth * 0.85;

        chart
          .selectAll(`.dot-${CSS.escape(d.category)}`)
          .data(d.values)
          .enter()
          .append("circle")
          .attr("cx", (_, i) => {
            const t = Math.sin((i + 1) * 999);
            return centerX + t * (jitterAmount / 2);
          })
          .attr("cy", (p) => y(+p[xKey]))
          .attr("r", 0)
          .attr("fill", (p) => color(+p[xKey]))
          .attr("stroke", "black")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.9)
          .transition()
          .duration(1200)
          .delay((_, i) => i * 8)
          .attr("r", containerWidth < 600 ? 3.5 : 6);

        chart
          .append("line")
          .attr("x1", centerX)
          .attr("x2", centerX)
          .attr("y1", y(d.whiskerMin))
          .attr("y2", y(d.whiskerMax))
          .attr("stroke", "orange")
          .attr("stroke-width", 2);

        chart
          .append("rect")
          .attr("x", centerX - boxWidth / 2)
          .attr("y", y(d.q3))
          .attr("width", boxWidth)
          .attr("height", 0)
          .attr("fill", "#9eb8b2")
          .attr("fill-opacity", 0.6)
          .attr("stroke", "#7f8c8d")
          .attr("stroke-width", 1.5)
          .transition()
          .duration(1000)
          .attr("height", y(d.q1) - y(d.q3));

        chart
          .append("line")
          .attr("x1", centerX - boxWidth / 2)
          .attr("x2", centerX + boxWidth / 2)
          .attr("y1", y(d.median))
          .attr("y2", y(d.median))
          .attr("stroke", "orange")
          .attr("stroke-width", 3);
      });
    });
  }, [csvPath, containerWidth, height, xKey, yKey, xLabel, yLabel, shouldAnimate]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        margin: 0,
      }}
    >
      <h2>{title}</h2>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          minWidth: 0,
        }}
      />
    </div>
  );
};