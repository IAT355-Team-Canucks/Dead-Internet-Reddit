import { useState, useEffect, useRef } from "react";

import { VerticalBoxPlot } from "../../components/VerticalBoxPlot";
import { useViewport } from "../../context/ViewportContext";
import { AnnotationNav } from "../../components/AnnotationNav";

export const EmotionalRangeSlide = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [annotationToggle, setAnnotationToggle] = useState(0);
  const [canAnimate, setCanAnimate] = useState(true)

  const { xlg, med } = useViewport();

  const handleAnnotationChange = (newIndex) => {
    setAnnotationToggle(newIndex);

    if (canAnimate) {
      setCanAnimate(false);
    }
  };

  const annotationsTable = [
    {
      xValue: "Engagement Farmer",
      yValue: 0.6,
      dx: 0,
      dy: 120,
      subjectShape: "circle",
      radius: "70",
      pointAt: "center",
      focus: true,
      note: {
        title: "Positive Bots?",
        label: "Bot posts tend to appear more positive overall."
      }
    },
    {
      xValue: "None (Human)",
      yValue: -0.5,
      dx: -90,
      dy: -40,
      subjectShape: "circle",
      radius: "70",
      pointAt: "center",
      focus: true,
      note: {
        title: "Human posts are more negative",
        label: "We see that humans tends to create more negative posts."
      }
    },
    {
      xValue: "Reprint Bot",
      yValue: 0.175,
      dx: -100,
      dy: -30,
      subjectShape: "box",
      boxWidth: "18%",
      boxHeight: "10%",
      pointAt: "center",
      focus: true,
      note: {
        title: "Spreading Positivity...?",
        label: "Repost Bots tend to favour reposting positive-feeling posts."
      }
    }
  ];

  const currentAnnotation = [annotationsTable[annotationToggle]];


  // Trying out in file styling
  const styles = {
    page: {
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: med ? "1fr 1fr" : "1fr",
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
      maxHeight: "100%",
      position: "relative",
    },
    vizInner: {
      height: "100%",
      position: "relative",
    },
    chartContainer: {
      padding: "0",
      display: "flex",
      flexDirection: "column",
      gap: "0",
      marginBottom: xlg ? "0rem" : "2rem"
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
    subHeader: {
      fontSize: "clamp(1rem, 6.5vw, 1.5rem)",
      lineHeight: "1",
      color: "#f5e6c8",
      margin: 0,
      marginBottom: "-0.4rem",
      fontWeight: "700",
      maxWidth: xlg ? "80%" : "100%",
      textAlign: "left"
    },
    body: {
      fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
      lineHeight: "1.65",
      color: "#EAC46A",
      margin: 0,
      maxWidth: xlg ? "80%" : "100%",
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
      fontSize: "clamp(0.75rem, 6.5vw, 1.25rem)",
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
      fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
      lineHeight: "1.6",
      color: "#f5e6c8",
      margin: 0,
      textAlign: "left"
    },
  };

  return (
    <div style={styles.page}>
      {/* LEFT: Visualization */}
      <div style={styles.vizWrapper}>
        <VerticalBoxPlot 
        title={"Emotional Range of Posters"} 
        annotations={currentAnnotation}
        canAnimate={canAnimate}
        
        />
        <AnnotationNav
          annotations={annotationsTable}
          currentIndex={annotationToggle}
          onChange={handleAnnotationChange}
      />
      </div>

      {/* RIGHT: Text */}
      <div style={styles.rightCol}>
        <h1 style={styles.heading}>Emotional Range</h1>
        <h2 style={styles.subHeader}>
          What am I looking At?
        </h2>
        <p style={styles.body}>
        <span style={{color: "#fff", fontWeight: "700"}}>Sentiment Scores</span> represent how emotionally negative or positive the comment is perceived to be.
          These are then categorized by what type of posters. Bots are defined as either an <span style={{color: "#fff", fontWeight: "700"}}> AI Summarizer, Engagement Farmer,
          or a Reprint Bot </span>.
        </p>
        <h2 style={styles.subHeader}>
          What's the Takeaway?
        </h2>
        <p style={styles.body}>
          
          Genuine human users express a far more diversive spectrum of emotions in their
          posts, which concentrates on either deeply negative or highly positive. Bots, by
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
