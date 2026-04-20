import * as d3 from "d3";


function resolveSize(value, chartSize, fallback) {
  if (typeof value === "function") return value(chartSize);
  if (typeof value === "string" && value.endsWith("%")) {
    return (parseFloat(value) / 100) * chartSize;
  }
  if (typeof value === "number" && value > 0 && value <= 1) {
    return value * chartSize;
  }
  return value ?? fallback;
}

function getScalePosition(scale, value, align = "center") {
  if (value == null) return null;

  const scaled = scale(value);
  if (scaled == null || Number.isNaN(scaled)) return null;

  // band scales: center/start/end support
  if (typeof scale.bandwidth === "function") {
    const bw = scale.bandwidth();

    if (align === "start") return scaled;
    if (align === "end") return scaled + bw;
    return scaled + bw / 2; // default center
  }

  return scaled;
}

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
    highlightPadding = 0,
    duration = 1200,
    delayStep = 150,
    defaultXAlign = "center",
    defaultYAlign = "center",
    animate = true,
  } = {}
) {
  if (!annotations?.length) return;
  if (!chartWidth || !chartHeight) {
    console.warn("AnnotationLayer requires chartWidth and chartHeight.");
    return;
  }

  const xlg = chartWidth >= 1920;
  const med = chartWidth >= 768;


  chart.selectAll(".annotation-layer").remove();
  chart.selectAll(".annotation-defs").remove();

  const layer = chart.append("g").attr("class", "annotation-layer");
  const defs = chart.append("defs").attr("class", "annotation-defs");

  const maskId = `annotation-mask-${Math.random().toString(36).slice(2, 9)}`;

  const mask = defs
    .append("mask")
    .attr("id", maskId)
    .attr("maskUnits", "userSpaceOnUse");

  mask
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", chartWidth * 1.25)
    .attr("height", chartHeight * 1.25)
    .attr("fill", "white");

  const cutoutGroup = mask.append("g").attr("class", "annotation-cutouts");

  const preparedAnnotations = annotations
    .map((a, i) => {
      if (!a) return;

      const x = getScalePosition(xScale, a.xValue, a.xAlign ?? defaultXAlign);
      const y = getScalePosition(yScale, a.yValue, a.yAlign ?? defaultYAlign);

      if (x == null || y == null) {
        console.warn("Invalid annotation", {
          annotation: a,
          xValue: a.xValue,
          yValue: a.yValue,
          scaledX: x,
          scaledY: y,
          xDomain: typeof xScale.domain === "function" ? xScale.domain() : null,
          yDomain: typeof yScale.domain === "function" ? yScale.domain() : null,
        });
        return null;
      }

      const preferredDx = (a.dx ?? 40) * scaleFactor;
      const preferredDy = (a.dy ?? -30) * scaleFactor;

      // Flip label inward if it would overflow right edge
      const shouldFlipX = x + preferredDx > chartWidth - 120;
      const dx = shouldFlipX ? -Math.abs(preferredDx) : preferredDx;

      // Push label upward if too close to bottom
      const shouldFlipY = y + preferredDy > chartHeight - 40;
      const dy = shouldFlipY ? -Math.abs(preferredDy) : preferredDy;

      const boxWidth =
        resolveSize(a.boxWidth, chartWidth, 80) * scaleFactor;
      const boxHeight =
        resolveSize(a.boxHeight, chartHeight, 50) * scaleFactor;
      const radius =
        resolveSize(a.radius, Math.min(chartWidth, chartHeight), 5) * scaleFactor;

      return {
        ...a,
        _index: i,
        _x: x,
        _y: y,
        _dx: dx,
        _dy: dy,
        _boxWidth: boxWidth,
        _boxHeight: boxHeight,
        _radius: radius,
      };
    })
    .filter(Boolean);

  if (!preparedAnnotations.length) return;

  // Animated cutouts
  preparedAnnotations.forEach((a) => {
    const startDelay = a._index * delayStep;

    if (a.subjectShape === "circle") {
      const finalR = a._radius + highlightPadding;

      const circle = cutoutGroup
        .append("circle")
        .attr("cx", a._x)
        .attr("cy", a._y)
        .attr("r", animate ? 0 : finalR)
        .attr("fill", "black");

      if (animate) {
        circle
          .transition()
          .delay(startDelay)
          .duration(duration)
          .attr("r", finalR);
      }
    } else if (a.subjectShape === "box") {
      const finalX = a._x - a._boxWidth / 2 - highlightPadding;
      const finalY = a._y - a._boxHeight / 2 - highlightPadding;
      const finalW = a._boxWidth + highlightPadding * 2;
      const finalH = a._boxHeight + highlightPadding * 2;

      const rect = cutoutGroup
        .append("rect")
        .attr("x", animate ? a._x : finalX)
        .attr("y", animate ? a._y : finalY)
        .attr("width", animate ? 0 : finalW)
        .attr("height", animate ? 0 : finalH)
        .attr("fill", "black");

      if (animate) {
        rect
          .transition()
          .delay(startDelay)
          .duration(duration)
          .attr("x", finalX)
          .attr("y", finalY)
          .attr("width", finalW)
          .attr("height", finalH);
      }
    }
  });

  if (preparedAnnotations[0]?.focus) {
    const overlay = layer
      .append("rect")
      .attr("class", "annotation-dim-overlay")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .attr("fill", "black")
      .attr("opacity", animate ? 0 : overlayOpacity)
      .attr("mask", `url(#${maskId})`)
      .style("pointer-events", "none");

    if (animate) {
      overlay
        .transition()
        .duration(400)
        .attr("opacity", overlayOpacity);
    }
  }

  preparedAnnotations.forEach((a) => {
    const startDelay = a._index * delayStep;

    const g = layer
      .append("g")
      .attr("class", "annotation")
      .attr("transform", `translate(${a._x}, ${a._y})`);

    let lineStartX = 0;
    let lineStartY = 0;

    if (a.subjectShape === "circle") {
      g.append("circle")
        .attr("r", animate ? 0 : a._radius + 4)
        .attr("fill", "white")
        .attr("opacity", 0.08)
        .call((sel) => {
          if (animate) {
            sel.transition()
              .delay(startDelay)
              .duration(duration)
              .attr("r", a._radius + 4);
          }
        });

      g.append("circle")
        .attr("r", animate ? 0 : a._radius)
        .attr("fill", a.fill ?? "none")
        .attr("opacity", 0.01)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .call((sel) => {
          if (animate) {
            sel.transition()
              .delay(startDelay)
              .duration(duration)
              .attr("opacity", a.opacity ?? 1)
              .attr("r", a._radius);
          }
        });
    } else if (a.subjectShape === "box") {
      lineStartX = a.pointAt === "corner" ? -a._boxWidth / 2 : 0;
      lineStartY = a.pointAt === "corner" ? -a._boxHeight / 2 : 0;

      g.append("rect")
        .attr(
          "x",
          animate ? 0 : -a._boxWidth / 2 - 4
        )
        .attr(
          "y",
          animate ? 0 : -a._boxHeight / 2 - 4
        )
        .attr("width", animate ? 0 : a._boxWidth + 8)
        .attr("height", animate ? 0 : a._boxHeight + 8)
        .attr("fill", "white")
        .attr("opacity", 0.08)
        .call((sel) => {
          if (animate) {
            sel.transition()
              .delay(startDelay)
              .duration(duration)
              .attr("x", -a._boxWidth / 2 - 4)
              .attr("y", -a._boxHeight / 2 - 4)
              .attr("width", a._boxWidth + 8)
              .attr("height", a._boxHeight + 8);
          }
        });

      g.append("rect")
        .attr("x", animate ? 0 : -a._boxWidth / 2)
        .attr("y", animate ? 0 : -a._boxHeight / 2)
        .attr("width", animate ? 0 : a._boxWidth)
        .attr("height", animate ? 0 : a._boxHeight)
        .attr("fill", a.fill ?? "none")
        .attr("opacity", a.opacity ?? 1)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .call((sel) => {
          if (animate) {
            sel.transition()
              .delay(startDelay)
              .duration(duration)
              .attr("x", -a._boxWidth / 2)
              .attr("y", -a._boxHeight / 2)
              .attr("width", a._boxWidth)
              .attr("height", a._boxHeight);
          }
        });
    }

    const line = g
      .append("line")
      .attr("x1", lineStartX)
      .attr("y1", lineStartY)
      .attr("x2", animate ? lineStartX : a._dx)
      .attr("y2", animate ? lineStartY : a._dy)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    if (animate) {
      line
        .transition()
        .delay(startDelay + duration * 0.7)
        .duration(duration)
        .attr("x2", a._dx)
        .attr("y2", a._dy);
    }

    const anchor = a._dx < 0 ? "end" : "start";

    const textGroup = g
      .append("g")
      .attr(
        "transform",
        animate
          ? `translate(${a._dx}, ${a._dy + 8})`
          : `translate(${a._dx}, ${a._dy})`
      )
      .style("opacity", animate ? 0 : 1)
      .attr("text-anchor", anchor);

    if (a.note?.title) {
      textGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "#fff")
        .style("font-weight", "bold")
        .style("font-size", "clamp(0.75rem, 6.5vw, 1rem)")
        .text(a.note.title);
    }

    if (a.note?.label) {
      textGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 16 * scaleFactor)
        .attr("fill", "#fff")
        .style("font-size", "clamp(0.5rem, 6.5vw, 0.75rem)")
        .text(a.note.label);
    }

    if (animate) {
      textGroup
        .transition()
        .delay(startDelay + duration + 100)
        .duration(400)
        .attr("transform", `translate(${a._dx}, ${a._dy})`)
        .style("opacity", 1);
    }
  });
}