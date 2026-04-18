
import { InfoCard } from "../../components/InfoCard";
import { useState, useEffect } from 'react';
import { ScatterPlot } from "../../components/ScatterPlot";
import { RadarChart } from "../../components/RadarChart";
import { HorizontalStackedBarChart } from "../../components/HorizontalStackedBarChart";
import { useViewport } from "../../context/ViewportContext";


export const ResponseTimingSlide = () => {
    const [chartMode, setChartMode] = useState("bar");
    const [visible, setVisible] = useState(false);
    const { sm } = useViewport();

    // Animation clear out
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);


    return (
        <section>
            <main style={{
                display: "grid",
                gridTemplateColumns: sm ? "1fr" : "1fr 1fr",
                paddingLeft: "3rem",
                paddingRight: "3rem",
                maxWidth: "100%",
                position: "relative",
                boxSizing: "border-box",
                height: "auto",
            }}>
                {/* Header */}
                <div style={{
                    opacity: visible ? 1 : 0.01,
                    transform: visible ? "translateY(0)" : "translateY(-16px)",
                    transition: "opacity 0.6s 0.1s, transform 0.6s 0.1s",
                }}>
                    <h1 style={{
                        textAlign: "left",
                        fontSize: "clamp(48px, 5vw, 68px)",
                        fontWeight: "800",
                        color: "#F0E2C8",
                        margin: "0 0 40px 0",
                        letterSpacing: "-0.5px",
                        lineHeight: 1,
                        fontFamily: "'Georgia', serif",
                    }}>
                        Response Timing
                        & Sentiment
                    </h1>
                    <p style={{
                        textAlign: "left",
                        fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
                        lineHeight: "1.75",
                        color: "#EAC46A",
                        maxWidth: "90%",
                        margin: "0 0 20px 0",
                        letterSpacing: "0.2px",
                    }}>

                        Sentiment doesn’t show a clear pattern on its own. But when paired with reply timing, a stronger difference appears.
                    </p>
                    <p style={{
                        textAlign: "left",
                        fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
                        lineHeight: "1.75",
                        color: "#EAC46A",
                        maxWidth: "90%",
                        margin: "0 0 40px 0",
                        letterSpacing: "0.2px",
                    }}>
                        Bots cluster at near-instant reply times, responding almost immediately. Human users, on the other hand, are more spread out, taking longer and more varied amounts of time to respond.
                    </p>
                </div>

                {/* Stack container */}
                <div>
                    {/* Chart area  */}
                    <div
                        style={{
                            border: "1.5px dashed #3D2810",
                            borderRadius: "4px",
                            padding: "40px",
                            marginBottom: "28px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "clamp(300px, 40vh, 620px)",
                            position: "relative",
                            backgroundColor: "rgba(255,255,255,0.01)",
                            opacity: visible ? 1 : 0.01,
                            transition: "opacity 0.6s 0.3s, background-color 0.2s",
                            userSelect: "none",
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(196,98,45,0.04)"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.01)"}
                    >
                        {/* Corner accents */}
                        {[["top:0,left:0", "borderTop", "borderLeft"],
                        ["top:0,right:0", "borderTop", "borderRight"],
                        ["bottom:0,left:0", "borderBottom", "borderLeft"],
                        ["bottom:0,right:0", "borderBottom", "borderRight"]].map(([pos], idx) => {
                            const positions = [
                                { top: -1, left: -1 }, { top: -1, right: -1 },
                                { bottom: -1, left: -1 }, { bottom: -1, right: -1 }
                            ];
                            return (
                                <div key={idx} style={{
                                    position: "absolute",
                                    ...positions[idx],
                                    width: 12, height: 12,
                                    borderColor: "var(--bot-colour)",
                                    borderStyle: "solid",
                                    borderWidth: 0,
                                    ...(idx === 0 ? { borderTopWidth: 2, borderLeftWidth: 2 } : {}),
                                    ...(idx === 1 ? { borderTopWidth: 2, borderRightWidth: 2 } : {}),
                                    ...(idx === 2 ? { borderBottomWidth: 2, borderLeftWidth: 2 } : {}),
                                    ...(idx === 3 ? { borderBottomWidth: 2, borderRightWidth: 2 } : {}),
                                }} />
                            );
                        })}
                        <ScatterPlot dotSize={5} xKey={"reply_delay_seconds"} xLabel={"Average Response Time (in Seconds)"} />



                    </div>
                    <div>
                        <p style={{
                            textAlign: "left",
                            color: "#D97656",
                            fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
                            lineHeight: 1.35
                        }}>
                            So sentiment varies for both groups, but timing makes the difference clearer. Bots respond quickly and consistently, while humans are slower and less predictable.
                        </p>
                    </div>
                </div>

            </main>
        </section>
    )
}