import React, { useEffect, useRef, useState, useMemo } from "react";
import "../../App.css";
import * as d3 from "d3";
import { useViewport } from "../../context/ViewportContext";
import { useCsvData } from "../../context/CsvDataContext";

export const HorizontalBarChart = ({
  title = "Horizontal Bar Chart Component",
  height = 600,
  xKey = "is_bot_flag",
  yKey = "user_karma", // still unused here
  xLabel = "Count",
  yLabel = "Category",
}) => {
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const { xlg, sm} = useViewport();
  const { data: rawData } = useCsvData();  

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
        threshold: 1,
        rootMargin: "0px 0px -15% 0px",
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Preprocess once when data or key changes
  const counts = useMemo(() => {
    if (!rawData.length) return [];

    return Array.from(
      d3.rollup(
        rawData,
        (v) => v.length,
        (d) => String(d[xKey])
      ),
      ([key, value]) => ({
        category: key,
        count: value,
      })
    ).sort((a, b) => a.count - b.count);
  }, [rawData, xKey]);

  // Draw chart on resize using cached data
  useEffect(() => {
    if (
      !containerRef.current ||
      !shouldAnimate ||
      !counts.length ||
      containerWidth <= 0
    ) {
      return;
    }

    const width = Math.max(containerWidth, 0);
    const margin = { top: 20, right: 30, bottom: 60, left: 100 };
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, height - margin.top - margin.bottom);

    if (innerWidth === 0 || innerHeight === 0) {
      d3.select(containerRef.current).select("svg").remove();
      return;
    }

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

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d.count) || 0])
      .nice()
      .range([0, innerWidth]);

    const y = d3
      .scaleBand()
      .domain(counts.map((d) => d.category))
      .range([innerHeight, 0])
      .padding(0.2);

    const bars = chart
      .selectAll(".bar")
      .data(counts)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", (d) =>
        d.category === "True"
          ? "var(--bot-colour)"
          : "var(--human-colour)"
      )
      .attr("x", 0)
      .attr("y", (d) => y(d.category))
      .attr("height", y.bandwidth())
      .attr("width", 0);

    bars
      .transition()
      .duration(1800)
      .attr("width", (d) => Math.max(0, x(d.count)));

    const xTicks = x.ticks(); // default ticks
    
    // Skip ticks for smaller viewport
    const xAxis = d3.axisBottom(x).tickValues(
      sm ? xTicks.filter((_, i) => i % 2 === 0) : xTicks
    );

    chart
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .attr("stroke", "#fff")
      .call(xAxis);

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
      .attr("y", -70)
      .attr("text-anchor", "middle")
      .text(yLabel);
  }, [counts, containerWidth, height, xLabel, yLabel, shouldAnimate]);

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
      <div ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
};