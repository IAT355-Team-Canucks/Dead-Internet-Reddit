import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { hexbin as d3Hexbin } from "d3-hexbin";
import "../../App.css";
import { AnnotationLayer } from "../AnnotationLayer";
import { useViewport } from "../../context/ViewportContext";
import { useCsvData } from "../../context/CsvDataContext";

export const HexbinPlot = ({
  height = 400,
  width = 980,
  title = "",
  xKey = "avg_word_length",
  yKey = "user_karma",
  xLabel = "Average Word Length",
  yLabel = "User Karma",
  hexRadius = 12,
  annotations = [],
  canAnimate = true,
}) => {
  const { xlg, sm } = useViewport();
  const aspectRatio = width / height;
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const { data: rawData, loading } = useCsvData();

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [dimensions, setDimensions] = useState({
    width,
    height,
  });

  // Responsive sizing
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const newWidth = entry.contentRect.width;

      if (!newWidth) return;

      const newHeight = xlg ? newWidth / aspectRatio : 600;

      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [aspectRatio, xlg]);

  // Trigger animation once when plot enters viewport
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

  useEffect(() => {
    if (!shouldAnimate) return;
    if (loading) return;
    if (!dimensions.width || !dimensions.height || !rawData?.length) return;

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

    const xTicks = x.ticks();
    const yTicks = y.ticks();

    const xAxis = d3.axisBottom(x).tickValues(
      sm ? xTicks.filter((_, i) => i % 2 === 0) : xTicks
    );

    const yAxis = d3.axisLeft(y).tickValues(
      sm ? yTicks.filter((_, i) => i % 2 === 0) : yTicks
    );

    chart
      .append("g")
      .attr("class", "myXaxis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    chart.append("g").attr("class", "myYaxis").call(yAxis);

    chart.selectAll(".myXaxis text, .myYaxis text").attr("fill", "#fff");
    chart
      .selectAll(".myXaxis path, .myXaxis line, .myYaxis path, .myYaxis line")
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

    // Map raw data to screen coordinates for hexbin layout
    const points = cleanData.map((d) => [x(d[xKey]), y(d[yKey]), d]);

    const responsiveHexRadius =
      width < 480 ? Math.max(8, hexRadius - 2) : hexRadius;

    const hexbinGenerator = d3Hexbin()
      .x((d) => d[0])
      .y((d) => d[1])
      .radius(responsiveHexRadius)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ]);

    const bins = hexbinGenerator(points);

    if (!bins.length) return;

    const maxBinCount = d3.max(bins, (d) => d.length) || 1;

    const color = d3
      .scaleSequential()
      .domain([0, maxBinCount])
      .interpolator(d3.interpolateYlOrRd);

    const hexGroup = chart.append("g").attr("class", "hexbin-layer");

    const hexes = hexGroup
      .selectAll("path")
      .data(bins)
      .enter()
      .append("path")
      .attr("d", hexbinGenerator.hexagon(responsiveHexRadius * 0.95))
      .attr(
        "transform",
        canAnimate
          ? `translate(${innerWidth / 2}, ${innerHeight / 2})`
          : (d) => `translate(${d.x}, ${d.y})`
      )
      .attr("fill", (d) => color(d.length))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.6)
      .attr("opacity", canAnimate ? 0 : 0.9);

    if (canAnimate) {
      hexes
        .transition()
        .delay((d, i) => i * 8)
        .duration(900)
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
        .attr("opacity", 0.9);
    }

    // Optional tooltip
    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("background", "rgba(0,0,0,0.85)")
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("opacity", 0);

    hexes
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("stroke-width", 1.4);

        tooltip
          .style("opacity", 1)
          .html(`Count: ${d.length}`);
      })
      .on("mousemove", function (event) {
        const bounds = containerRef.current.getBoundingClientRect();

        tooltip
          .style("left", `${event.clientX - bounds.left + 12}px`)
          .style("top", `${event.clientY - bounds.top - 12}px`);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("stroke-width", 0.6);
        tooltip.style("opacity", 0);
      });

    AnnotationLayer(chart, annotations, x, y, {
      titleSize: xlg ? 22 : 26,
      labelSize: xlg ? 18 : 20,
      scaleFactor: Math.max(0.6, Math.min(1, innerWidth / 700)),
      chartWidth: width,
      chartHeight: height,
    });

    return () => {
      tooltip.remove();
    };
  }, [
    shouldAnimate,
    loading,
    rawData,
    dimensions,
    xKey,
    yKey,
    xLabel,
    yLabel,
    hexRadius,
    annotations,
    canAnimate,
    sm,
    xlg,
  ]);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <h2>{title}</h2>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          minHeight: "300px",
          position: "relative",
        }}
      />
    </div>
  );
};