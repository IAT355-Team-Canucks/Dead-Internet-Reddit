import { useRef, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import "../../App.css";
import { useCsvData } from "../../context/CsvDataContext";

export const RadarChart = ({
  options = {},
  title = "",
  width = 300,
  height = 300
}) => {
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [containerWidth, setContainerWidth] = useState(600);
  const { data: rawData } = useCsvData();

  const size = Math.max(260, Math.min(containerWidth, 700));

  const cfg = useMemo(
    () => ({
      w: size,
      h: size,
      margin: { top: 90, right: 100, bottom: 90, left: 100 },
      levels: 5,
      maxValue: 1,
      labelFactor: 1.18,
      wrapWidth: Math.max(60, size * 0.16),
      opacityArea: 0.35,
      dotRadius: 4,
      opacityCircles: 0.05,
      strokeWidth: 2,
      roundStrokes: false,
      topNSubreddits: 8,
      color: d3.scaleOrdinal().range(["var(--human-colour)", "var(--bot-colour)"]),
      ...options,
    }),
    [size, options]
  );

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(entry.contentRect.width);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Animate only when chart enters viewport
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
        threshold: 0.35,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !rawData?.length || !shouldAnimate) return;

    // Count bots/humans per subreddit
    const subredditMap = d3.rollup(
      rawData,
      (rows) => ({
        total: rows.length,
        bots: rows.filter((d) => d.is_bot_flag === "True").length,
        humans: rows.filter((d) => d.is_bot_flag === "False").length,
      }),
      (d) => d.subreddit
    );

    const subredditStats = Array.from(subredditMap, ([subreddit, stats]) => ({
      subreddit,
      ...stats,
    }))
      .sort((a, b) => d3.descending(a.total, b.total))
      .slice(0, cfg.topNSubreddits);

    const axes = subredditStats.map((d) => d.subreddit);

    const botSeries = subredditStats.map((d) => ({
      axis: d.subreddit,
      value: d.total === 0 ? 0 : d.bots / d.total,
      rawValue: d.bots,
      proportion: d.total === 0 ? 0 : d.bots / d.total,
      group: "Bot",
    }));

    const humanSeries = subredditStats.map((d) => ({
      axis: d.subreddit,
      value: d.total === 0 ? 0 : d.humans / d.total,
      rawValue: d.humans,
      proportion: d.total === 0 ? 0 : d.humans / d.total,
      group: "Human",
    }));

    const data = [humanSeries, botSeries];

    const total = axes.length;
    const radius = Math.min(cfg.w / 2, cfg.h / 2);
    const angleSlice = (Math.PI * 2) / total;
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, cfg.maxValue]);

    d3.select(containerRef.current).select("svg").remove();

    const fullWidth = cfg.w + cfg.margin.left + cfg.margin.right;
    const fullHeight = cfg.h + cfg.margin.top + cfg.margin.bottom;

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${fullWidth} ${fullHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto");

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${cfg.w / 2 + cfg.margin.left}, ${cfg.h / 2 + cfg.margin.top})`
      );

    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const axisGrid = g.append("g").attr("class", "axisWrapper");

    function wrap(text, width) {
      text.each(function () {
        const textSel = d3.select(this);
        const words = textSel.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.4;
        const y = textSel.attr("y");
        const x = textSel.attr("x");
        const dy = parseFloat(textSel.attr("dy"));
        let tspan = textSel
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", `${dy}em`);

        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = textSel
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", `${++lineNumber * lineHeight + dy}em`)
              .text(word);
          }
        }
      });
    }

    axisGrid
      .selectAll(".gridCircle")
      .data(d3.range(1, cfg.levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", 0)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", cfg.opacityCircles)
      .style("filter", "url(#glow)")
      .transition()
      .duration(800)
      .delay((_, i) => i * 120)
      .attr("r", (d) => (radius / cfg.levels) * d);

    axisGrid
      .selectAll(".axisLabel")
      .data(d3.range(1, cfg.levels + 1).reverse())
      .enter()
      .append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", (d) => (-d * radius) / cfg.levels)
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .style("stroke", "#fff")
      .attr("fill", "#737373")
      .style("opacity", 0)
      .text((d) => `${Math.round((d / cfg.levels) * 100)}%`)
      .transition()
      .duration(500)
      .delay(700)
      .style("opacity", 1);

    const axis = axisGrid
      .selectAll(".axis")
      .data(axes)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", 0)
      .style("stroke", "#999")
      .style("strokeWidth", "1px")
      .transition()
      .duration(700)
      .delay(400)
      .attr("x2", (_, i) => rScale(cfg.maxValue * 1.05) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (_, i) => rScale(cfg.maxValue * 1.05) * Math.sin(angleSlice * i - Math.PI / 2));

    axis
      .append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .style("stroke", "#fff")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (_, i) => rScale(cfg.maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (_, i) => rScale(cfg.maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("opacity", 0)
      .text((d) => d)
      .call(wrap, cfg.wrapWidth)
      .transition()
      .duration(500)
      .delay(900)
      .style("opacity", 1);

    const radarLine = d3
      .lineRadial()
      .curve(cfg.roundStrokes ? d3.curveCardinalClosed : d3.curveLinearClosed)
      .radius((d) => rScale(d.value))
      .angle((_, i) => i * angleSlice);

    const radarLineCollapsed = d3
      .lineRadial()
      .curve(cfg.roundStrokes ? d3.curveCardinalClosed : d3.curveLinearClosed)
      .radius(() => 0)
      .angle((_, i) => i * angleSlice);

    const blobWrapper = g
      .selectAll(".radarWrapper")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "radarWrapper");

    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", (d) => radarLineCollapsed(d))
      .style("fill", (_, i) => cfg.color(i))
      .style("fill-opacity", 0)
      .on("mouseover", function () {
        g.selectAll(".radarArea").transition().duration(200).style("fill-opacity", 0.1);
        d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function () {
        g.selectAll(".radarArea")
          .transition()
          .duration(200)
          .style("fill-opacity", cfg.opacityArea);
      })
      .transition()
      .duration(1000)
      .delay((_, i) => 1000 + i * 200)
      .attr("d", (d) => radarLine(d))
      .style("fill-opacity", cfg.opacityArea);

    blobWrapper
      .append("path")
      .attr("class", "radarStroke")
      .attr("d", (d) => radarLineCollapsed(d))
      .style("strokeWidth", `${cfg.strokeWidth}px`)
      .style("stroke", (_, i) => cfg.color(i))
      .style("fill", "none")
      .style("filter", "url(#glow)")
      .transition()
      .duration(1000)
      .delay((_, i) => 1000 + i * 200)
      .attr("d", (d) => radarLine(d));

    // TOOL TIP STYLING
    const tooltip = g
      .append("text")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("stroke", "#fff");


    blobWrapper.each(function (seriesData, seriesIndex) {
      d3.select(this)
        .selectAll(".radarCircle")
        .data(seriesData)
        .enter()
        .append("circle")
        .attr("class", "radarCircle") .on("mouseover", function (event, d) {
          const x = +d3.select(this).attr("cx") + 8;
          const y = +d3.select(this).attr("cy") - 8;

          tooltip
          .attr("x", x)
          .attr("y", y)
          .text(`${d.group} in ${d.axis}: ${(d.proportion * 100).toFixed(1)}%`)
          .transition()
          .duration(150)
          .style("opacity", 1);

        }).on("mouseout", function () {
          tooltip.transition().duration(150).style("opacity", 0);
        })

        .attr("r", 0)
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill", cfg.color(seriesIndex))
        .style("fill-opacity", 0.8)
        .transition()
        .duration(400)
        .delay((_, i) => 1800 + i * 80 + seriesIndex * 120)
        .style("pointer-events", "all")
        .attr("r", cfg.dotRadius);
    });


  }, [cfg, rawData, shouldAnimate]);

  return (
    <div style={{ width: "100%" }}>
      <h2>{title}</h2>
      <div ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
};