import { useEffect, useState } from "react";

import { useViewport } from "../../context/ViewportContext";

const ConclusionCard = ({ title, children }) => (
  <div
    style={{
      flex: 1,
      minHeight: "320px",
      border: "1px solid rgba(255, 229, 184, 0.18)",
      borderRadius: "18px",
      padding: "2rem",
      background: "rgba(255,255,255,0.02)",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.02)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      gap: "1rem",
      backdropFilter: "blur(8px)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#D97757",
        }}
      />
      <h2
        style={{
          color: "#E5C68A",
          fontSize: "1.1rem",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          margin: 0,
          fontWeight: 600,
          textAlign: "left"
        }}
      >
        {title}
      </h2>
    </div>

    <p
      style={{
        color: "#F7EFE2",
        fontSize: "1rem",
        lineHeight: 1.8,
        textAlign: "left",
        margin: 0,
        opacity: 0.92,
      }}
    >
      {children}
    </p>
  </div>
);

export const ConclusionSlide = () => {
  const [visible, setVisible] = useState(false);
  const {xlg, sm} = useViewport();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      style={{
        flex: 1,
        paddingLeft: "3rem",
        paddingRight: "3rem",
        paddingTop: "7rem",
        paddingBottom: "4rem",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "1200px",
      }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0.01,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <h1
          style={{
            color: "#F0E2C8",
            fontSize: "clamp(3rem, 5vw, 5.25rem)",
            fontWeight: 700,
            margin: "0 0 1.5rem 0",
            letterSpacing: "-0.05em",
            lineHeight: 1.05,
            fontFamily: "'Georgia', serif",
            maxWidth: "16ch",
            textAlign: "left"
          }}
        >
          So what does this mean?
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: !sm ? "1fr 1fr" : "1fr",
          gap: "2rem",
        }}
      >
        <ConclusionCard title="Implications">
          Understanding these patterns has practical applications for platform moderation,
          content authenticity verification, and user trust systems. As bot technology
          becomes more sophisticated, identifying these behavioral signatures becomes
          increasingly crucial for maintaining authentic online communities.
        </ConclusionCard>

        <ConclusionCard title="Future Research">
          Future research could explore how these patterns evolve as bot algorithms
          improve or examine whether these findings generalize to other social media
          platforms beyond Reddit. A broader view will help build more resilient
          detection systems and preserve genuine engagement.
        </ConclusionCard>
      </div>
    </section>
  );
};
