import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import "../../App.css";
import { AnnotationLayer } from "../AnnotationLayer";
import { useViewport } from "../../context/ViewportContext";
import { useCsvData } from "../../context/CsvDataContext";

export const HorizontalStackedBarChart = ({
  title = "Horizontal Stacked Bar Chart",
  height = 600,
  xKey = "subreddit",
  yKey = "is_bot_flag",
  xLabel = "Count",
  yLabel = "Category",
  canAnimate,
  annotations = [],
}) => {
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [containerWidth, setContainerWidth] = useState(680);

  const { data: rawData } = useCsvData();
  const { xlg } = useViewport();

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

  // Trigger animation once when entering viewport
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

  // Preprocess data once
  const { stackedData, stackKeys } = useMemo(() => {
    if (!rawData.length) {
      return { stackedData: [], stackKeys: [] };
    }

    const stackKeys = Array.from(new Set(rawData.map((d) => String(d[yKey]))));

    const grouped = d3.rollup(
      rawData,
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
    })).sort((a, b) => a.total - b.total);

    return { stackedData, stackKeys };
  }, [rawData, xKey, yKey]);

  useEffect(() => {
    if (!containerRef.current || !stackedData.length || containerWidth <= 0) return;

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
        "var(--human-colour)",
        "var(--bot-colour)",
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

    const segments = layer
      .selectAll("g.segment")
      .data((d) => d)
      .enter()
      .append("g")
      .attr("class", "segment");

    const rects = segments
      .append("rect")
      .attr("y", (d) => y(d.data.category))
      .attr("x", (d) => Math.min(x(d[0]), x(d[1])))
      .attr("opacity", 0.01)
      .attr("height", y.bandwidth());

    // Animate only once, otherwise render at final width
    if (canAnimate && shouldAnimate) {
      rects.attr("width", 0)
        .transition()
        .duration(1800)
        .attr("opacity", 1)
        .attr("width", (d) => Math.max(0, x(d[1]) - x(d[0])));
    } else {
      if (!canAnimate) {
        rects.attr("width", 0)
        .attr("opacity", 1)
        .attr("width", (d) => Math.max(0, x(d[1]) - x(d[0])));
      }
    }


    const labels = segments
      .append("text")
      .attr("x", (d) => (x(d[0]) + x(d[1])) / 2)
      .attr("y", (d) => (y(d.data.category) ?? 0) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("opacity", 0.01)
      .style("font-size", xlg ? "24px" : "12px")
      .style("font-weight", "700")
      .style("pointer-events", "none")
      .text((d) => {
        const value = d[1] - d[0];
        return value > 0 ? value : "";
      })
      .filter((d) => x(d[1]) - x(d[0]) > 24);

    if (canAnimate && shouldAnimate) {
      labels
        .style("opacity", 0.01)
        .transition()
        .delay(1800)
        .duration(300)
        .style("opacity", 1);
    } else {
      if (!canAnimate) {
        labels.style("opacity", 1);
      }
      
    }

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

      // idr why I needed to wrap this when scatterplot didn't lord help me
      if (shouldAnimate) {
        AnnotationLayer(chart, annotations, x, y, {
          titleSize: xlg ? 22 : 26,
          labelSize: xlg ? 18 : 20,
          scaleFactor: Math.max(0.6, Math.min(1, innerWidth / 700)),
          chartWidth: innerWidth,
          chartHeight: innerHeight,
        });
    
      }

  }, [
    stackedData,
    stackKeys,
    annotations,
    containerWidth,
    height,
    xLabel,
    yLabel,
    shouldAnimate,
    xlg,
  ]);

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