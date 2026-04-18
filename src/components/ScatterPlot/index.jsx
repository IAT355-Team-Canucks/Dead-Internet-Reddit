import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../../App.css";
import { AnnotationLayer } from "../AnnotationLayer";
import { useViewport } from "../../context/ViewportContext";
import { useCsvData } from "../../context/CsvDataContext";

export const ScatterPlot = ({
  height = 400,
  width = 980,
  title = "",
  xKey = "avg_word_length",
  yKey = "user_karma",
  xLabel = "Average Word Length",
  yLabel = "User Karma",
  dotSize = 2,
  annotations = [],
  canAnimate
}) => {
  const { xlg, sm } = useViewport();
  const aspectRatio = width / height;
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const { data: rawData, loading } = useCsvData();

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: width,
    height: height,
  });

  if (sm) {
    dotSize = 4;

  }

  // Measure container width responsively
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;

      if (!width) return;

      const height = xlg ? width / aspectRatio : 600;

      setDimensions({
        width,
        height,
      });
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [aspectRatio]);

  // Trigger animation once when component enters viewport
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
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // D3 rendering
  useEffect(() => {
    if (!shouldAnimate) return;
    if (!dimensions.width || !dimensions.height || !rawData.length) return;

    const { width, height } = dimensions;

    const margin = {
      top: 10,
      right: sm ? 20 : 30,
      bottom: sm ? 60 : 50,
      left: sm ? 55 : 70,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    if (innerWidth <= 0 || innerHeight <= 0) return;

    d3.select(containerRef.current).selectAll("*").remove();

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("display", "block")
      .style("max-width", "100%")
      .style("height", "auto");

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);



    const cleanData = rawData.filter(
      (d) =>
        typeof d[xKey] === "number" &&
        typeof d[yKey] === "number" &&
        !Number.isNaN(d[xKey]) &&
        !Number.isNaN(d[yKey])
    );

    if (!cleanData.length) return;

    const xExtent = d3.extent(cleanData, (d) => d[xKey]);
    const yExtent = d3.extent(cleanData, (d) => d[yKey]);

    const x = d3
      .scaleLinear()
      .domain(xExtent)
      .nice()
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain(yExtent)
      .nice()
      .range([innerHeight, 0]);

    const color = d3
      .scaleOrdinal()
      .domain(["false", "true"])
      .range(["var(--human-colour)", "var(--bot-colour)"]);

    const xTicks = x.ticks(); // default ticks

    // Skip ticks for smaller viewport
    const xAxis = d3.axisBottom(x).tickValues(
      sm ? xTicks.filter((_, i) => i % 2 === 0) : xTicks
    );

    const yTicks = y.ticks(); // default ticks

    // Skip ticks for smaller viewport
    const yAxis = d3.axisLeft(y).tickValues(
      sm ? yTicks.filter((_, i) => i % 2 === 0) : yTicks
    );

    // const yAxis = d3.axisLeft(y);

    chart
      .append("g")
      .attr("class", "myXaxis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .attr("opacity", 0)
      .call(xAxis);

    chart
      .append("g")
      .attr("class", "myYaxis")
      .attr("opacity", 0)
      .call(yAxis);

    // Axis text styling
    chart.selectAll(".myXaxis text, .myYaxis text").attr("fill", "#fff");
    chart.selectAll(".myXaxis path, .myXaxis line, .myYaxis path, .myYaxis line")
      .attr("stroke", "#fff");

    chart
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + (width < 640 ? 45 : 40))
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-size", width < 640 ? "12px" : "14px")
      .text(xLabel);

    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", width < 640 ? -40 : -50)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-size", width < 640 ? "12px" : "14px")
      .text(yLabel);

    const responsiveDotSize =
      width < 480 ? Math.max(1.5, dotSize - 0.5) : dotSize;

    chart
      .append("g")
      .selectAll("circle")
      .data(cleanData)
      .enter()
      .append("circle")
      .attr("cx", 0)
      .attr("cy", innerHeight)
      .attr("r", responsiveDotSize)
      .style("fill", (d) => color(String(d.is_bot_flag)))
      .style("opacity", 0.8);

    chart
      .select(".myXaxis")
      .transition()
      .duration(1200)
      .attr("opacity", 1)
      .call(xAxis);

    chart
      .select(".myYaxis")
      .transition()
      .duration(1200)
      .attr("opacity", 1)
      .call(yAxis);

    // Re-apply axis styles after transition
    chart.selectAll(".myXaxis text, .myYaxis text").attr("fill", "#fff");
    chart.selectAll(".myXaxis path, .myXaxis line, .myYaxis path, .myYaxis line")
      .attr("stroke", "#fff");

    if (canAnimate) {
      chart
        .selectAll("circle")
        .transition()
        .delay((d, i) => i * 2)
        .duration(1400)
        .attr("cx", (d) => x(d[xKey]))
        .attr("cy", (d) => y(d[yKey]));
    } else {
      chart
        .selectAll("circle")
        .attr("cx", (d) => x(d[xKey]))
        .attr("cy", (d) => y(d[yKey]));
    }

    AnnotationLayer(chart, annotations, x, y, {
      titleSize: xlg ? 22 : 26,
      labelSize: xlg ? 18 : 20,
      scaleFactor: Math.max(0.6, Math.min(1, innerWidth / 700)),
      chartWidth: innerWidth,
      chartHeight: innerHeight,
    });

  }, [
    shouldAnimate,
    dimensions,
    xKey,
    yKey,
    xLabel,
    yLabel,
    dotSize,
    annotations
  ]);

  return (
    <div style={{ width: "100%" }}>
      <h2>{title}</h2>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          minHeight: "300px",
        }}
      />
    </div>
  );
};