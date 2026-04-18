import * as d3 from "d3";

const resolveSize = (value, chartSize, fallback) => {
    if (typeof value === "function") return value(chartSize);
    if (typeof value === "string" && value.endsWith("%")) {
      return (parseFloat(value) / 100) * chartSize;
    }
    if (typeof value === "number" && value > 0 && value <= 1) {
      return value * chartSize; // treat 0–1 as ratio
    }
    return value ?? fallback;
  };

export function AnnotationLayer(
  chart,
  annotations,
  xScale,
  yScale,
  {
    titleSize = 18,
    labelSize = 12,
    scaleFactor = 1,
    chartWidth,
    chartHeight,
    overlayOpacity = 0.35,
    highlightPadding = 8,
    duration = 1200,
    delayStep = 150,
  } = {}
) {
  if (!annotations?.length) return;
  if (!chartWidth || !chartHeight) {
    console.warn("AnnotationLayer requires chartWidth and chartHeight.");
    return;
  }

  chart.selectAll(".annotation-layer").remove();
  chart.selectAll(".annotation-defs").remove();

  const layer = chart.append("g").attr("class", "annotation-layer");
  const defs = chart.append("defs").attr("class", "annotation-defs");

  const maskId = `annotation-mask-${Math.random().toString(36).slice(2, 9)}`;

  const mask = defs
    .append("mask")
    .attr("id", maskId)
    .attr("maskUnits", "userSpaceOnUse");

  // White = keep overlay visible
  mask
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .attr("fill", "white");

  // Create animated cutout shapes in the mask
  const cutoutGroup = mask.append("g").attr("class", "annotation-cutouts");

  annotations.forEach((a, i) => {
    const x = xScale(a.xValue);
    const y = yScale(a.yValue);
    const startDelay = i * delayStep;

    if (a.subjectShape === "circle") {
      const finalR = ((a.radius ?? 5) + highlightPadding) * scaleFactor;

      cutoutGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .attr("fill", "black")
        .transition()
        .delay(startDelay)
        .duration(duration)
        .attr("r", finalR);

    } else if (a.subjectShape === "box") {
        const boxWidth =
        resolveSize(a.boxWidth, chartWidth, 80) * scaleFactor;
      
      const boxHeight =
        resolveSize(a.boxHeight, chartHeight, 50) * scaleFactor;

      // centered box
      cutoutGroup
        .append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", 0)
        .attr("height", 0)
        .attr("fill", "black")
        .transition()
        .delay(startDelay)
        .duration(duration)
        .attr("x", x - boxWidth / 2 - highlightPadding)
        .attr("y", y - boxHeight / 2 - highlightPadding)
        .attr("width", boxWidth + highlightPadding * 2)
        .attr("height", boxHeight + highlightPadding * 2);
    }
  });

  // Dark overlay fades in
  if (annotations[0]?.focus) {
    layer
    .append("rect")
    .attr("class", "annotation-dim-overlay")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .attr("fill", "black")
    .attr("opacity", 0)
    .attr("mask", `url(#${maskId})`)
    .style("pointer-events", "none")
    .transition()
    .duration(400)
    .attr("opacity", overlayOpacity);
  }


  // Draw annotations on top
  annotations.forEach((a, i) => {
    const x = xScale(a.xValue);
    const y = yScale(a.yValue);

    const dx = (a.dx ?? 40) * scaleFactor;
    const dy = (a.dy ?? -30) * scaleFactor;

    const startDelay = i * delayStep;

    const g = layer
      .append("g")
      .attr("class", "annotation")
      .attr("transform", `translate(${x}, ${y})`);

    let subject;
    let lineStartX = 0;
    let lineStartY = 0;

    if (a.subjectShape === "circle") {
      const finalR = (a.radius ?? 5) * scaleFactor;
      lineStartX = 0;
      lineStartY = 0;

      // soft glow
      g.append("circle")
        .attr("r", 0)
        .attr("fill", "white")
        .attr("opacity", 0.08)
        .transition()
        .delay(startDelay)
        .duration(duration)
        .attr("r", finalR + 4);

      subject = g
        .append("circle")
        .attr("r", 0)
        .attr("fill", a.fill ?? "none")
        .attr("opacity", a.opacity ?? 1)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

      subject
        .transition()
        .delay(startDelay)
        .duration(duration)
        .attr("r", finalR);

    } else if (a.subjectShape === "box") {
      const boxWidth = (a.boxWidth ?? 10) * scaleFactor;
      const boxHeight = (a.boxHeight ?? 10) * scaleFactor;

      lineStartX = a.pointAt === "corner" ? -boxWidth / 2 : 0;
      lineStartY = a.pointAt === "corner" ? -boxHeight / 2 : 0;

      g.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 0)
        .attr("height", 0)
        .attr("fill", "white")
        .attr("opacity", 0.08)
        .transition()
        .delay(startDelay)
        .duration(duration)
        .attr("x", -boxWidth / 2 - 4)
        .attr("y", -boxHeight / 2 - 4)
        .attr("width", boxWidth + 8)
        .attr("height", boxHeight + 8);

      subject = g
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 0)
        .attr("height", 0)
        .attr("fill", a.fill ?? "none")
        .attr("opacity", a.opacity ?? 1)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

      subject
        .transition()
        .delay(startDelay)
        .duration(duration)
        .attr("x", -boxWidth / 2)
        .attr("y", -boxHeight / 2)
        .attr("width", boxWidth)
        .attr("height", boxHeight);
    }

    const line = g
      .append("line")
      .attr("x1", lineStartX)
      .attr("y1", lineStartY)
      .attr("x2", lineStartX)
      .attr("y2", lineStartY)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    line
      .transition()
      .delay(startDelay + duration * 0.7)
      .duration(duration)
      .attr("x2", dx)
      .attr("y2", dy);

    const textGroup = g
      .append("g")
      .attr("transform", `translate(${dx}, ${dy + 8})`)
      .style("opacity", 0);

    if (a.note?.title) {
      textGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "#fff")
        .style("font-weight", "bold")
        .style("font-size", `${titleSize * scaleFactor}px`)
        .text(a.note.title);
    }

    if (a.note?.label) {
      textGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 16 * scaleFactor)
        .attr("fill", "#fff")
        .style("font-size", `${labelSize * scaleFactor}px`)
        .text(a.note.label);
    }

    textGroup
      .transition()
      .delay(startDelay + duration + 100)
      .duration(400)
      .attr("transform", `translate(${dx}, ${dy})`)
      .style("opacity", 1);
  });
}