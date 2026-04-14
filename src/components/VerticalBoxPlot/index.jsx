import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const VerticalBoxPlot = ({
  title = "Box Plot Component",
  width = 900,
  height = 600,
  xKey = "sentiment_score",
  yKey = "bot_type_label",
  xLabel = "sentiment_score",
  yLabel = "Category",
  csvPath = `${import.meta.env.BASE_URL}data/reddit_dead_internet_analysis.csv`,
}) => {
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

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
        threshold: 1,
        rootMargin: "0px 0px -15% 0px",
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !shouldAnimate) return;

    const margin = { top: 20, right: 40, bottom: 70, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(containerRef.current).selectAll("*").remove();

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv(csvPath, d3.autoType).then((data) => {
      // Keep only rows with valid values
      const filtered = data.filter(
        (d) =>
          d[xKey] != null &&
          d[yKey] != null &&
          !Number.isNaN(+d[xKey])
      );

      if (!filtered.length) return;

      // Convert grouping values to strings for categorical scale
      const categories = Array.from(
        new Set(filtered.map((d) => String(d[yKey])))
      );

      // Match the bar chart style: bottom category first, top category last
      categories.sort(d3.ascending);

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

        // optional whisker rule
        const lowerFence = q1 - 1.5 * iqr;
        const upperFence = q3 + 1.5 * iqr;

        const whiskerMin = d3.min(sorted.filter((v) => v >= lowerFence)) ?? min;
        const whiskerMax = d3.max(sorted.filter((v) => v <= upperFence)) ?? max;

        return {
          category,
          values,
          sorted,
          q1,
          median,
          q3,
          min,
          max,
          whiskerMin,
          whiskerMax,
        };
      });

      const xExtent = d3.extent(filtered, (d) => +d[xKey]);

      const x = d3
        .scaleBand()
        .domain(categories)
        .range([0, innerWidth])
        .padding(0.35);

        const y = d3
        .scaleLinear()
        .domain(xExtent)
        .nice()
        .range([innerHeight, 0]); // IMPORTANT: inverted

      // Optional continuous color based on x value
      const color = d3
        .scaleSequential(d3.interpolatePlasma)
        .domain(xExtent);

      // Draw axis
      chart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .attr("stroke", "#fff")
        .call(d3.axisBottom(x));

        chart
        .append("g")
        .attr("stroke", "#fff")
        .call(d3.axisLeft(y));

      // Axis labels
      chart
        .append("text")
        .attr("stroke", "#fff")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 50)
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

      // Draw one boxplot row per category
      stats.forEach((d) => {
        const xPos = x(d.category);
        const centerX = xPos + x.bandwidth() / 2;
        const boxWidth = x.bandwidth() * 0.75;
      
        // Jittered dots (vertical now)
        const jitterAmount = boxWidth * 0.85;
      
        chart
          .selectAll(`.dot-${CSS.escape(d.category)}`)
          .data(d.values)
          .enter()
          .append("circle")
          .attr("class", `dot-${d.category}`)
          .attr("cx", (_, i) => {
            const t = Math.sin((i + 1) * 999);
            return centerX + t * (jitterAmount / 2);
          })
          .attr("cy", (p) => y(+p[xKey]))
          .attr("r", 0)
          .attr("fill", (p) => color(+p[xKey]))
          .attr("stroke", "black")
          .attr("stroke-width", 0.5)
          .attr("opacity", 1)
          .transition()
          .duration(1400)
          .delay((_, i) => i * 10)
          .attr("r", 6);
      
        // Whisker line (vertical now)
        chart
          .append("line")
          .attr("x1", centerX)
          .attr("x2", centerX)
          .attr("y1", y(d.whiskerMin))
          .attr("y2", y(d.whiskerMax))
          .attr("stroke", "orange")
          .attr("stroke-width", 2);
      
        // Box
        const box = chart
          .append("rect")
          .attr("x", centerX - boxWidth / 2)
          .attr("y", y(d.q3))
          .attr("width", boxWidth)
          .attr("height", 0)
          .attr("fill", "#9eb8b2")
          .attr("fill-opacity", 0.6)
          .attr("stroke", "#7f8c8d")
          .attr("stroke-width", 1.5);
      
        box
          .transition()
          .duration(1200)
          .attr("height", y(d.q1) - y(d.q3));
      
        // Median line
        chart
          .append("line")
          .attr("x1", centerX - boxWidth / 2)
          .attr("x2", centerX + boxWidth / 2)
          .attr("y1", y(d.median))
          .attr("y2", y(d.median))
          .attr("stroke", "orange")
          .attr("stroke-width", 4);
      });
    });
  }, [csvPath, width, height, xKey, yKey, xLabel, yLabel, shouldAnimate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        margin: 0,
      }}
    >
      <h2>{title}</h2>
      <div ref={containerRef}></div>
    </div>
  );
};