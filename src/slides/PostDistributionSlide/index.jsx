import { useState, useEffect } from "react";
import { RadarChart } from "../../components/RadarChart";
import { HorizontalStackedBarChart } from "../../components/HorizontalStackedBarChart";
import { useViewport } from "../../context/ViewportContext";

export const PostDistributionSlide = () => {
  const [canAnimate, setCanAnimate] = useState(true);
  const [visible, setVisible] = useState(false);
  const { xlg, med } = useViewport();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const chartCardStyle = {
    border: "1.5px dashed #3D2810",
    borderRadius: "4px",
    padding: med ? "24px" : "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "clamp(300px, 40vh, 620px)",
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.01)",
    transition: "background-color 0.2s",
    userSelect: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const renderCorners = () => {
    const positions = [
      { top: -1, left: -1 },
      { top: -1, right: -1 },
      { bottom: -1, left: -1 },
      { bottom: -1, right: -1 },
    ];

    return positions.map((pos, idx) => (
      <div
        key={idx}
        style={{
          position: "absolute",
          ...pos,
          width: 12,
          height: 12,
          borderColor: "var(--bot-colour)",
          borderStyle: "solid",
          borderWidth: 0,
          ...(idx === 0 ? { borderTopWidth: 2, borderLeftWidth: 2 } : {}),
          ...(idx === 1 ? { borderTopWidth: 2, borderRightWidth: 2 } : {}),
          ...(idx === 2 ? { borderBottomWidth: 2, borderLeftWidth: 2 } : {}),
          ...(idx === 3 ? { borderBottomWidth: 2, borderRightWidth: 2 } : {}),
        }}
      />
    ));
  };

  return (
    <section>
      <main
        style={{
          flex: 1,
          paddingLeft: "3rem",
          paddingRight: xlg ? "3rem" : "0rem",
          maxWidth: "100%",
          position: "relative",
          boxSizing: "border-box",
          height: "auto",
        }}
      >
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
            Post Distribution Across Subreddits
          </h1>

          <p
            style={{
              textAlign: "left",
              fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
              lineHeight: "1.75",
              color: "#EAC46A",
              maxWidth: xlg ? "60%" : "90%",
              margin: "0 0 40px 0",
              letterSpacing: "0.2px",
            }}
          >
            The distribution shows that bots contribute a smaller, yet
            consistent proportion of posts across all subreddits. Despite
            differences in overall activity levels, no single subreddit exhibits
            a disproportionate concentration of bot activity.
          </p>
        </div>

        {/* One shared chart area */}
        <div
          style={{
            width: "100%",
            opacity: visible ? 1 : 0.01,
            transition: "opacity 0.6s 0.3s",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: med ? "1fr 1fr" : "1fr",
              gap: "2rem",
              width: "100%",
              alignItems: "stretch",
            }}
          >
            {/* Chart 1 */}
            <div
              style={chartCardStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(196,98,45,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.01)")
              }
            >
              {renderCorners()}
              <div style={{ width: "100%", height: "100%" }}>
                <HorizontalStackedBarChart
                  xKey="subreddit"
                  title="Bot vs Human Distribution by Subreddit"
                  canAnimate={canAnimate}
                />
              </div>
            </div>

            {/* Chart 2 */}
            <div
              style={chartCardStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(196,98,45,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.01)")
              }
            >
              {renderCorners()}
              <div style={{ width: "100%", height: "100%" }}>
                <RadarChart canAnimate={canAnimate} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};