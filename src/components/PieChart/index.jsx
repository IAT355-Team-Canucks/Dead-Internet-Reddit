import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const PieChart = ({
    title = "",
    data = [
        { label: "Humans", value: 300 },
        { label: "Bots", value: 200 },
    ],
    width = 600,
    height = 600,
    innerRadius = 0,
    threshold = 1,
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
                threshold,
                rootMargin: "0px 0px -15% 0px",
            }
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [threshold]);

    // Render pie chart
    useEffect(() => {
        if (!containerRef.current || !shouldAnimate) return;

        d3.select(containerRef.current).selectAll("*").remove();

        const radius = Math.min(width, height) / 2;

        const svg = d3
            .select(containerRef.current)
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("width", "100%")
            .style("height", "auto")
            .style("display", "block");

        const chart = svg
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);


        const myColors = ["var(--bot-colour)", "var(--human-colour)"]


        // color scale
        const color = d3.scaleOrdinal()
            .domain(data.map((d) => d.label))
            .range(myColors);


        const pie = d3
            .pie()
            .sort(null)
            .value((d) => +d.value);

        const pieData = pie(data);

        const arc = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(radius - 10);

        const labelArc = d3
            .arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius * 0.6);

        const slices = chart
            .selectAll(".slice")
            .data(pieData)
            .enter()
            .append("g")
            .attr("class", "slice");

        slices
            .append("path")
            .attr("fill", (d) => color(d.data.label))
            .attr("stroke", "none")
            .attr("stroke-width", 2)
            .transition()
            .duration(1800)
            .attrTween("d", function (d) {
                const interpolate = d3.interpolate(
                    { startAngle: 0, endAngle: 0 },
                    d
                );
                return function (t) {
                    return arc(interpolate(t));
                };
            });

        slices
            .append("text")
            .text((d) => d.data.label)
            .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("fill", "#fff")
            .style("font-size", "1rem")
            .style("font-weight", "700")
            .style("opacity", 0)
            .transition()
            .delay(1200)
            .duration(500)
            .style("opacity", 1);
    }, [data, width, height, innerRadius, shouldAnimate]);

    return (
        <div style={{ width: "100%" }}>
            {title && <h2>{title}</h2>}
            <div ref={containerRef} />
        </div>
    );
};