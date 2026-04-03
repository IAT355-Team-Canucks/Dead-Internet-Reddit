import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const HorizontalStackedBarChart = ({
  title = "Horizontal Stacked Bar Chart",
  width = 680,
  height = 600,
  xKey = "subreddit",       // main group
  yKey = "is_bot_flag",     // stacked subgroup
  xLabel = "Count",
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

  // Render chart
  useEffect(() => {
    if (!containerRef.current || !shouldAnimate) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 100 };
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
      // Get all unique stack keys
      const stackKeys = Array.from(
        new Set(data.map((d) => String(d[yKey])))
      );

      // Count occurrences of xKey grouped by yKey
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

      // Sort by total count
      stackedData.sort((a, b) => a.total - b.total);

      const yDomain = stackedData.map((d) => d.category);

      const x = d3
        .scaleLinear()
        .domain([0, d3.max(stackedData, (d) => d.total)])
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

      // Create groups for each stack layer
      const layer = chart
        .selectAll(".layer")
        .data(series)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", (d) => color(d.key));

      // Draw animated stacked segments
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

      // X Axis
      chart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .attr("stroke", "#fff")
        .call(d3.axisBottom(x));

      // Y Axis
      chart
        .append("g")
        .attr("stroke", "#fff")
        .call(d3.axisLeft(y));

      // X Axis Label
      chart
        .append("text")
        .attr("stroke", "#fff")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 45)
        .attr("text-anchor", "middle")
        .text(xLabel);

      // Y Axis Label
      chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("stroke", "#fff")
        .attr("x", -innerHeight / 2)
        .attr("y", -80)
        .attr("text-anchor", "middle")
        .text(yLabel);

      // Legend
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