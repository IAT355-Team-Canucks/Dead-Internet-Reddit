
import { InfoCard } from "../../components/InfoCard";
import { useState, useEffect } from 'react';
import { HorizontalStackedBarChart } from "../../components/HorizontalStackedBarChart";
import { useViewport } from "../../context/ViewportContext";

export const LinkBehaviourSlide = () => {
    const [chartMode, setChartMode] = useState("bar");
    const { isDesktop } = useViewport();
    const [visible, setVisible] = useState(false);

    // Animation clear out
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);


    return (
        <section>
            <main style={{
                flex: 1,
                paddingLeft: isDesktop? "3rem": "3rem",
                paddingRight: isDesktop? "3rem" : "3rem",
                maxWidth: "100%",
                position: "relative",
                boxSizing: "border-box",
                height: "auto",
            }}>
                {/* Header */}
                <div style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(-16px)",
                    transition: "opacity 0.6s 0.1s, transform 0.6s 0.1s",
                }}>
                    <h1 style={{
                        textAlign: "left",
                        fontSize: "clamp(48px, 5vw, 68px)",
                        fontWeight: "800",
                        color: "#F0E2C8",
                        margin: "0 0 20px 0",
                        letterSpacing: "-0.5px",
                        lineHeight: 1,
                        fontFamily: "'Georgia', serif",
                    }}>
                        Linking Behaviour
                    </h1>
                    <p style={{
                        textAlign: "left",
                        fontSize: "22px",
                        lineHeight: "1.75",
                        color: "#EAC46A",
                        maxWidth: isDesktop? "60%" : "100%",
                        margin: "0 0 40px 0",
                        letterSpacing: "0.2px",
                    }}>
                        Posts containing links are a perfect indicator of bot activity in this dataset, as 100% of link posts were made by bots with no human involvement. In contrast, human users only appear in posts without links and make up roughly 70% of that category. However, bots are not limited to posting links—they also generate a significant portion of normal text-only posts, meaning the absence of a link does not guarantee a human author. Overall, while filtering for links is highly effective with no false positives, it still misses a substantial number of bots that blend in through link-free content.                    </p>
                </div>

                {/* Chart area */}
                <div
                    onClick={() => setChartMode(m => m === "pie" ? "bar" : "pie")}
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
                        opacity: visible ? 1 : 0,
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
                    <HorizontalStackedBarChart
                        width={1280}
                        height={350}
                        xKey={"contains_links"}
                        title={"Posts That Contain Links"}
                        xLabel={"Number of Posts"}

                        yLabel={"Contains a Link?"}
                    />

                    {/* <div style={{ textAlign: "left" }}>
                        <div style={{
                            transition: "opacity 0.3s, transform 0.3s",
                            opacity: 1,
                        }}>


                        </div>
                    </div> */}

                </div>
                <div style={{
                    border: "1px solid #8a6a3a",
                    borderRadius: "6px",
                    padding: "20px 24px",
                    marginTop: "2rem",
                    width: isDesktop ? "50%" : "90%",
                    background: "rgba(139, 90, 43, 0.08)",
                    transition: "opacity 0.7s ease, transform 0.7s ease",
                }}>
                    <div style={{
                        fontFamily: "Arial",
                        fontSize: "2rem",
                        fontWeight: "700",
                        paddingBottom: "0.5em",
                        paddingTop: "0.5em",
                        color: "#c8a96e",
                        letterSpacing: "0.15em",
                        marginBottom: "10px",
                        textAlign: "left",
                    }}>KEY INSIGHT</div>
                    <p style={{
                        fontFamily: "'Georgia', serif",
                        fontSize: "22px",
                        lineHeight: "1.6",
                        color: "#f5e6c8",
                        margin: 0,
                        textAlign: "left"
                    }}>
If we were to build a filter for this Reddit data, simply flagging any post with a link would catch a significant portion of bots with zero "collateral damage" to human users. However, we'd still miss the bots that post plain text to blend in.                    </p>
                </div>
            </main>
        </section>
    )
}