
import { useEffect, useState } from "react";
import { useViewport } from "../../context/ViewportContext";

export const TableChart = ({
    title = "Dataset Variables",
    subtitle = "An overview of the variables used to compare behavioural patterns between bots and human Reddit accounts.",
    data = variableData,
  }) => {
    const [visible, setVisible] = useState(false);
    const { xlg, med, sm } = useViewport();
  
    useEffect(() => {
      const t = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(t);
    }, []);
  
    const isCompact = med || sm;
  
    return (
      <section>
        <main
          style={{
            flex: 1,
            paddingLeft: "3rem",
            paddingRight: "3rem",
            maxWidth: "100%",
            position: "relative",
            boxSizing: "border-box",
            height: "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              opacity: visible ? 1 : 0.01,
              transform: visible ? "translateY(0)" : "translateY(-16px)",
              transition: "opacity 0.6s 0.1s, transform 0.6s 0.1s",
            }}
          >
            <h1
              style={{
                textAlign: "left",
                fontSize: "clamp(48px, 5vw, 68px)",
                fontWeight: "800",
                color: "#F0E2C8",
                margin: "0 0 20px 0",
                letterSpacing: "-0.5px",
                lineHeight: 1,
                fontFamily: "'Georgia', serif",
              }}
            >
              {title}
            </h1>
  
            <p
              style={{
                textAlign: "left",
                fontSize: "clamp(0.8rem, 1.8vw, 1rem)",
                lineHeight: "1.75",
                color: "#FFF",
                maxWidth: xlg ? "65%" : "100%",
                margin: "0 0 32px 0",
                letterSpacing: "0.2px",
              }}
            >
              {subtitle}
            </p>
          </div>
  
          {/* Table container */}
          <div
            style={{
              border: "1.5px dashed #3D2810",
              borderRadius: "4px",
              padding: isCompact ? "18px" : "28px",
              position: "relative",
              backgroundColor: "rgba(255,255,255,0.01)",
              opacity: visible ? 1 : 0.01,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s 0.3s, transform 0.6s 0.3s",
              overflowX: "auto",
            }}
          >
            {/* Corner accents */}
            {[
              { top: -1, left: -1, borders: { borderTopWidth: 2, borderLeftWidth: 2 } },
              { top: -1, right: -1, borders: { borderTopWidth: 2, borderRightWidth: 2 } },
              { bottom: -1, left: -1, borders: { borderBottomWidth: 2, borderLeftWidth: 2 } },
              { bottom: -1, right: -1, borders: { borderBottomWidth: 2, borderRightWidth: 2 } },
            ].map((corner, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  ...corner,
                  width: 12,
                  height: 12,
                  borderColor: "var(--bot-colour, #C4622D)",
                  borderStyle: "solid",
                  borderWidth: 0,
                  ...corner.borders,
                }}
              />
            ))}
  
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: isCompact ? "720px" : "900px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(234,196,106,0.25)" }}>
                  {["Variable", "Type", "Description", "Why It Matters"].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: isCompact ? "14px 12px" : "16px 14px",
                        color: "#F0E2C8",
                        fontSize: isCompact ? "0.88rem" : "0.95rem",
                        fontWeight: 700,
                        letterSpacing: "0.4px",
                        textTransform: "uppercase",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
  
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={row.variable}
                    style={{
                      borderBottom:
                        index === data.length - 1
                          ? "none"
                          : "1px solid rgba(255,255,255,0.06)",
                      backgroundColor:
                        index % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: isCompact ? "14px 12px" : "18px 14px",
                        verticalAlign: "top",
                        color: "#EAC46A",
                        fontWeight: 700,
                        fontSize: isCompact ? "0.9rem" : "0.98rem",
                        lineHeight: 1.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.variable}
                    </td>
  
                    <td
                      style={{
                        padding: isCompact ? "14px 12px" : "18px 14px",
                        verticalAlign: "top",
                        color: "#FFF",
                        fontSize: isCompact ? "0.88rem" : "0.95rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {row.type}
                    </td>
  
                    <td
                      style={{
                        padding: isCompact ? "14px 12px" : "18px 14px",
                        verticalAlign: "top",
                        color: "#FFF",
                        fontSize: isCompact ? "0.88rem" : "0.95rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {row.description}
                    </td>
  
                    <td
                      style={{
                        padding: isCompact ? "14px 12px" : "18px 14px",
                        verticalAlign: "top",
                        color: "#FFF",
                        fontSize: isCompact ? "0.88rem" : "0.95rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {row.purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </section>
    );
  };