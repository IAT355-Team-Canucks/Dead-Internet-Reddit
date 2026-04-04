import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const HorizontalStackedBarChart = ({
  title = "Horizontal Stacked Bar Chart",
  height = 600,
  xKey = "subreddit",
  yKey = "is_bot_flag",
  xLabel = "Count",
  yLabel = "Category",
  csvPath = `${import.meta.env.BASE_URL}data/reddit_dead_internet_analysis.csv`,
}) => {
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [containerWidth, setContainerWidth] = useState(680);

  // Watch container size
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const newWidth = entry.contentRect.width;
      if (newWidth > 0) {
        setContainerWidth(newWidth);
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
        rootMargin: "0px 0px -15% 0px",
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Render chart
  useEffect(() => {
    if (!containerRef.current || !shouldAnimate || containerWidth <= 0) return;

    const width = containerWidth;
    const margin = { top: 20, right: 30, bottom: 60, left: 100 };
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
      const stackKeys = Array.from(new Set(data.map((d) => String(d[yKey]))));

      const grouped = d3.rollup(
        data,
        (rows) => {
          const obj = { total: rows.length };

          stackKeys.forEach((key) => {
            obj[key] = rows.filter((d) => String(d[yKey]) === key).length;
          });

          return obj;
        },
        (d) => String(d[xKey])
      );

      const stackedData = Array.from(grouped, ([category, values]) => ({
        category,
        ...values,
      }));

      stackedData.sort((a, b) => a.total - b.total);

      const yDomain = stackedData.map((d) => d.category);

      const x = d3
        .scaleLinear()
        .domain([0, d3.max(stackedData, (d) => d.total) || 0])
        .nice()
        .range([0, innerWidth]);

      const y = d3
        .scaleBand()
        .domain(yDomain)
        .range([innerHeight, 0])
        .padding(0.2);

      const color = d3
        .scaleOrdinal()
        .domain(stackKeys)
        .range([
          "#619CFF",
          "#00BA38",
          "#F8766D",
          "#C77CFF",
          "#FFB000",
          "#00BFC4",
        ]);

      const stack = d3.stack().keys(stackKeys);
      const series = stack(stackedData);

      const layer = chart
        .selectAll(".layer")
        .data(series)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", (d) => color(d.key));

      layer
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("y", (d) => y(d.data.category))
        .attr("x", (d) => x(d[0]))
        .attr("height", y.bandwidth())
        .attr("width", 0)
        .transition()
        .duration(1800)
        .attr("width", (d) => x(d[1]) - x(d[0]));

      chart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .attr("stroke", "#fff")
        .call(d3.axisBottom(x));

      chart
        .append("g")
        .attr("stroke", "#fff")
        .call(d3.axisLeft(y));

      chart
        .append("text")
        .attr("stroke", "#fff")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 45)
        .attr("text-anchor", "middle")
        .text(xLabel);

      chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("stroke", "#fff")
        .attr("x", -innerHeight / 2)
        .attr("y", -80)
        .attr("text-anchor", "middle")
        .text(yLabel);

      const legend = svg
        .append("g")
        .attr("transform", `translate(${width - 140}, 20)`);

      stackKeys.forEach((key, i) => {
        const row = legend
          .append("g")
          .attr("transform", `translate(0, ${i * 22})`);

        row
          .append("rect")
          .attr("width", 14)
          .attr("height", 14)
          .attr("fill", color(key));

        row
          .append("text")
          .attr("x", 20)
          .attr("y", 11)
          .attr("fill", "#fff")
          .style("font-size", "12px")
          .text(key);
      });
    });
  }, [csvPath, containerWidth, height, xKey, yKey, xLabel, yLabel, shouldAnimate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        margin: 0,
      }}
    >
      <h2>{title}</h2>
      <div
        ref={containerRef}
        style={{
          width: "100%",
        }}
      />
    </div>
  );
};