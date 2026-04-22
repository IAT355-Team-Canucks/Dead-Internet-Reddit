import React from "react";

export function AnnotationNav({
  annotations = [],
  currentIndex = 0,
  onChange,
  showDetails = false,
}) {
  if (!annotations.length) return null;

  const current = annotations[currentIndex];

  const goPrev = () => {
    const nextIndex =
      currentIndex === 0 ? annotations.length - 1 : currentIndex - 1;
    onChange?.(nextIndex);
  };

  const goNext = () => {
    const nextIndex = (currentIndex + 1) % annotations.length;
    onChange?.(nextIndex);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "0.5rem",
        gap: "0.75rem",
        padding: "0 0.9rem 0.7rem 0.9rem",
        borderRadius: "12px",
        background: "none",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "#fff",
        maxWidth: "100%",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        
      </div>

      {/* Step indicators */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={goPrev}
          style={buttonStyle}
        >
          Prev
        </button>

        {/* <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            textAlign: "center",
            flex: 1,
            minWidth: "120px",
          }}
        >
          Annotation {currentIndex + 1} / {annotations.length}
        </div> */}


        {annotations.map((annotation, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              key={index}
              onClick={() => onChange?.(index)}
              aria-label={`Go to annotation ${index + 1}`}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "999px",
                border: isActive
                  ? "2px solid #fff"
                  : "1px solid rgba(255,255,255,0.25)",
                background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {index + 1}
            </button>
          );
        })}
                <button
          onClick={goNext}
          style={buttonStyle}
        >
          Next
        </button>
      </div>

      {/* Current annotation details */}
      {showDetails && (
        <div
          style={{
            padding: "0.75rem",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>
            {current?.note?.title || `Annotation ${currentIndex + 1}`}
          </div>
          <div style={{ fontSize: "0.9rem", opacity: 0.85 }}>
            {current?.note?.label || "No description provided."}
          </div>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "0.55rem 0.9rem",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};