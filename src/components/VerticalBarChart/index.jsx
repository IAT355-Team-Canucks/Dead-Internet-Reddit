import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const VerticalBarChart = ({
    title = "Bar Chart Component",
    width = 1080,
    height = 200,
    xKey = "is_bot_flag",
    yKey = "user_karma",
    xLabel = "Sample X-Axis Label",
    yLabel = "Sample Y-Axis Label",
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

    // Actual rendering of D3 graph
    useEffect(() => {
        if (!containerRef.current || !shouldAnimate) return;

        const margin = { top: 20, right: 30, bottom: 60, left: 30 };
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

            const counts = Array.from(
                d3.rollup(
                    data,
                    v => v.length,        // count rows
                    d => String(d[xKey])  // group by category
                ),
                ([key, value]) => ({
                    category: key,
                    count: value
                })
            );
            counts.sort((a, b) => a.count - b.count);

            const x = d3.scaleBand()
                .domain(counts.map(d => d.category))
                .range([0, innerWidth])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain(d3.extent(counts.map(d => d.count)))
                .nice()
                .range([innerHeight, 0]);

            const bars = chart
                .selectAll(".bar")
                .data(counts)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("fill", d => d.category === "True" ? "#00BA38" : "#619CFF")
                .attr("x", d => x(d.category))
                .attr("width", x.bandwidth())
                .attr("y", innerHeight)
                .attr("height", 0);

            if (shouldAnimate) {
                bars
                bars.transition()
                    .duration(1800)
                    .attr("y", d => y(d.count))
                    .attr("height", d => innerHeight - y(d.count));
            } else {
                bars
                    .attr("y", (d) => y(d.count))
                    .attr("height", (d) => innerHeight - y(d.count));
            }

            chart.append("g")
                .attr("transform", `translate(0, ${innerHeight})`)
                .attr("stroke", "#fff")
                .call(d3.axisBottom(x));

            chart.append("g")
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
                .attr("y", -50)
                .attr("text-anchor", "middle")
                .text(yLabel);
        });
    }, [csvPath, width, height, xKey, yKey, xLabel, yLabel, shouldAnimate]);

    return (
        <div>
            <h2>{title}</h2>
            <div ref={containerRef}></div>
        </div>
    );
};