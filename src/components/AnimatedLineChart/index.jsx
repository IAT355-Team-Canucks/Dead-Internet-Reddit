import React, { useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";
import * as d3 from "d3";

export const AnimatedLineChart = () => {
  const data = [
    { x: 0, y: 20 },
    { x: 1, y: 35 },
    { x: 2, y: 25 },
    { x: 3, y: 50 },
    { x: 4, y: 40 },
    { x: 5, y: 65 },
  ];

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const chartRef = useRef(null);

  const isInView = useInView(chartRef, {
    once: true,
    amount: 0.8,
    margin: "0px 0px -40px 0px",
  });



  const { xScale, yScale, linePath, xTicks, yTicks } = useMemo(() => {
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .nice()
      .range([innerHeight, 0]);

    // Basic tick values
    const xTicks = xScale.ticks(6);
    const yTicks = yScale.ticks(5);

    // Lines
    const lineGenerator = d3
      .line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    return {
      xScale,
      yScale,
      linePath: lineGenerator(data),
      xTicks,
      yTicks
    };
  }, [data, innerWidth, innerHeight]);

  return (
    <div style={{ minHeight: "200vh", padding: "40px" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", height: "100vh", color: "white" }}>
        <h1>Scroll down</h1>
        <p>Say something dramatic</p>
      </div>

      <svg
        ref={chartRef}
        width={width}
        height={height}
        style={{ background: "#1a1a1a", borderRadius: "12px", overflow: "visible" }}
      >

        {/* Y Axis */}
        {yTicks.map((tick) => (
          <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
            <line x1={0} x2={innerWidth} y1={0} y2={0} stroke="#333" />
            <text
              x={-10}
              y={4}
              textAnchor="end"
              fill="#aaa"
              fontSize="12"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* X Axis */}
        {xTicks.map((tick) => (
          <g key={tick} transform={`translate(${xScale(tick)}, ${innerHeight})`}>
            <line y1={0} y2={6} stroke="#aaa" />
            <text
              y={20}
              textAnchor="middle"
              fill="#aaa"
              fontSize="12"
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Axis lines */}
        <line x1={0} x2={0} y1={0} y2={innerHeight} stroke="#aaa" />
        <line x1={0} x2={innerWidth} y1={innerHeight} y2={innerHeight} stroke="#aaa" />
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <motion.path
            d={linePath}
            fill="none"
            stroke="#4cc9f0"
            strokeWidth={3}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />

          {data.map((point, i) => (
            <motion.circle
              key={i}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r={5}
              fill="#f72585"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ delay: isInView ? 0.8 + i * 0.12 : 0, duration: 0.3 }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}