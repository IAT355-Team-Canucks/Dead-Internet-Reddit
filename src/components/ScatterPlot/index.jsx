import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const ScatterPlot = ({
  width = 980,
  height = 600,
  xKey = "avg_word_length",
  yKey = "user_karma",
  xLabel = "Average Word Length",
  yLabel = "User Karma",
  csvPath = `${import.meta.env.BASE_URL}data/reddit_dead_internet_analysis.csv`
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
        threshold: 0.3,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // D3 Graphing
  useEffect(() => {
    if (!shouldAnimate) return;

    const margin = { top: 10, right: 30, bottom: 50, left: 70 };
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

    d3.csv(csvPath, d3.autoType)
      .then(data => {
        const cleanData = data.filter(
          d =>
            typeof d[xKey] === "number" &&
            typeof d[yKey] === "number" &&
            !Number.isNaN(d[xKey]) &&
            !Number.isNaN(d[yKey])
        );

        const xExtent = d3.extent(cleanData, d => d[xKey]);
        const yExtent = d3.extent(cleanData, d => d[yKey]);

        const x = d3.scaleLinear()
          .domain([0, 0])
          .range([0, innerWidth]);

        const y = d3.scaleLinear()
          .domain([0, 0])
          .range([innerHeight, 0]);

        const color = d3.scaleOrdinal()
          .domain(["false", "true"])
          .range(["#00BA38", "#619CFF"]);

        chart.append("g")
          .attr("class", "myXaxis")
          .attr("transform", `translate(0, ${innerHeight})`)
          .attr("opacity", 0)
          .attr("stroke", "#fff")
          .call(d3.axisBottom(x));

        chart.append("g")
          .attr("class", "myYaxis")
          .attr("opacity", 0)
          .attr("stroke", "#fff")
          .call(d3.axisLeft(y));

        chart.append("text")
          .attr("x", innerWidth / 2)
          .attr("y", innerHeight + 40)
          .attr("text-anchor", "middle")
          .attr("fill", "#fff")
          .text(xLabel);

        chart.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -innerHeight / 2)
          .attr("y", -45)
          .attr("text-anchor", "middle")
          .attr("fill", "#fff")
          .text(yLabel);

        chart.append("g")
          .selectAll("circle")
          .data(cleanData)
          .enter()
          .append("circle")
          .attr("cx", 0)
          .attr("cy", innerHeight)
          .attr("r", 2)
          .style("fill", d => color(String(d.is_bot_flag)));

        x.domain(xExtent).nice();
        y.domain(yExtent).nice();

        chart.select(".myXaxis")
          .transition()
          .duration(2000)
          .attr("opacity", 1)
          .call(d3.axisBottom(x));

        chart.select(".myYaxis")
          .transition()
          .duration(2000)
          .attr("opacity", 1)
          .call(d3.axisLeft(y));

        chart.selectAll("circle")
          .transition()
          .delay((d, i) => i * 3)
          .duration(2000)
          .attr("cx", d => x(d[xKey]))
          .attr("cy", d => y(d[yKey]));
      })
      .catch(err => console.error(err));
  }, [shouldAnimate, width, height, xKey, yKey, xLabel, yLabel, csvPath]);

  return (
    <div>
      <h2>ScatterPlot Component</h2>
      <div ref={containerRef} />
    </div>
  );
};