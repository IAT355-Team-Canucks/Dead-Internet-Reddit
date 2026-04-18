import { useState, useEffect, useRef } from "react";

import { VerticalBarChart } from "../../components/VerticalBarChart";
import { VerticalBoxPlot } from "../../components/VerticalBoxPlot";

const MAX_VAL = 80;

export const EmotionalRangeSlide = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [insightVisible, setInsightVisible] = useState(false);
  const vizRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = vizRef.current;
    if (!el) return;

    const handleScroll = (e) => {
      e.preventDefault();
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) return;
      el.scrollTop = Math.min(Math.max(el.scrollTop + e.deltaY * 0.5, 0), scrollable);
      const progress = el.scrollTop / scrollable;
      setScrollProgress(progress);
      if (progress >= 0.98) setInsightVisible(true);
    };

    el.addEventListener("wheel", handleScroll, { passive: false });
    return () => el.removeEventListener("wheel", handleScroll);
  }, []);

  // Touch support
  useEffect(() => {
    const el = vizRef.current;
    if (!el) return;
    let startY = 0;
    const onTouchStart = (e) => { startY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      e.preventDefault();
      const dy = startY - e.touches[0].clientY;
      startY = e.touches[0].clientY;
      const scrollable = el.scrollHeight - el.clientHeight;
      el.scrollTop = Math.min(Math.max(el.scrollTop + dy, 0), scrollable);
      const progress = el.scrollTop / scrollable;
      setScrollProgress(progress);
      if (progress >= 0.98) setInsightVisible(true);
    };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Trying out in file styling
  const styles = {
    page: {
      background: "#1a1208",
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#f5e6c8",
                      paddingLeft: "3rem",
                paddingRight: "3rem",
      gap: "48px",
      boxSizing: "border-box",
    },
    leftCol: {
      display: "flex",
      flexDirection: "column",
    },
    vizWrapper: {
      border: "1.5px dashed #6b4f2a",
      borderRadius: "4px",
      flex: 1,

      position: "relative",
      cursor: "ns-resize",
      minHeight: "520px",
    },
    vizInner: {
      height: "100%",

      position: "relative",
    },
    scrollArea: {
      height: "200%",
      width: "100%",
      pointerEvents: "none",
    },
    chartContainer: {
      position: "absolute",
      inset: 0,
      padding: "0",
      display: "flex",
      flexDirection: "column",
      gap: "0",
    },
    scrollHint: {
      position: "absolute",
      bottom: "12px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "#FFF",
      fontSize: "1rem",
      letterSpacing: "0.1em",
      fontFamily: "'Courier New', monospace",
      opacity: scrollProgress > 0.05 ? 0 : 1,
      transition: "opacity 0.5s ease",
      whiteSpace: "nowrap",
    },
    rightCol: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      paddingTop: "8px",
    },
    heading: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(36px, 5vw, 64px)",
      fontWeight: "700",
      color: "#f5e6c8",
      lineHeight: 1.05,
      letterSpacing: "-0.01em",
      margin: 0,
      textAlign: "left",
      maxWidth: "100%"
    },
    body: {
      fontSize: "22px",
      lineHeight: "1.65",
      color: "#EAC46A",
      margin: 0,
      maxWidth: "80%",
      textAlign: "left"
    },
    spacer: { flex: 1 },
    insightBox: {
      border: "1px solid #8a6a3a",
      borderRadius: "6px",
      padding: "20px 24px",
      background: "rgba(139, 90, 43, 0.08)",
      transition: "opacity 0.7s ease, transform 0.7s ease",
    },
    insightLabel: {
      fontFamily: "Arial",
      fontSize: "32px",
      fontWeight: "700",
      paddingBottom: "0.5em",
      paddingTop: "0.5em",
      color: "#c8a96e",
      letterSpacing: "0.15em",
      marginBottom: "10px",
      textAlign: "left",
    },
    insightText: {
      fontFamily: "'Georgia', serif",
      fontSize: "22px",
      lineHeight: "1.6",
      color: "#f5e6c8",
      margin: 0,
      textAlign: "left"
    },
  };

  return (
    <div style={styles.page}>
      {/* LEFT: Visualization */}
      <div style={styles.leftCol}>
        <div
          style={styles.vizWrapper}
          ref={vizRef}
        >
          <div style={styles.chartContainer}>
            {/* <ChartArea scrollProgress={scrollProgress} /> */}
            {/* <VerticalBarChart width={500} height={1000} 
            xKey={"bot_type_label"} yKey={"sentiment_score"}
            title={"Emotional Range of Posters"}
            xLabel={"Poster Type"}
            aggr={false}
            /> */}
            <VerticalBoxPlot title={"Emotional Range of Posters"} height={950}/>
          </div>
        </div>
      </div>

      {/* RIGHT: Text */}
      <div style={styles.rightCol}>
        <h1 style={styles.heading}>Emotional Range</h1>
        <p style={styles.body}>
          Genuine human users express a far wider spectrum of emotions in their
          posts, which range from deeply negative to highly positive. Bots, by
          contrast, tend to cluster around neutral sentiment, rarely venturing
          into emotional extremes.
        </p>
        <div style={styles.spacer} />
        <div style={styles.insightBox}>
          <div style={styles.insightLabel}>KEY INSIGHT</div>
          <p style={styles.insightText}>
            The diversity in human emotional expression serves as a crucial
            differentiator. Bots maintain calculated neutrality, avoiding the
            emotional peaks and valleys that characterize authentic human
            interaction.
          </p>
        </div>
      </div>
    </div>
  );
}
