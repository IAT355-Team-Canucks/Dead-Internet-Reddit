
import { InfoCard } from "../../components/InfoCard";
import { useState, useEffect } from 'react';
import { VerticalBarChart } from "../../components/VerticalBarChart";
import { HorizontalBarChart } from "../../components/HorizontalBarChart";
import "../../App.css";
import { useViewport } from "../../context/ViewportContext";

const BotIcon = () => {
    return (
        <svg width="100%" viewBox="0 0 36 36" fill="none">
            <rect x="6" y="14" width="24" height="18" rx="3" stroke="var(--bot-colour)" strokeWidth="1.8" fill="none" />
            <rect x="12" y="19" width="4" height="4" rx="1" fill="var(--bot-colour)" />
            <rect x="20" y="19" width="4" height="4" rx="1" fill="var(--bot-colour)" />
            <line x1="13" y1="28" x2="23" y2="28" stroke="var(--bot-colour)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="14" x2="18" y2="8" stroke="var(--bot-colour)" strokeWidth="1.8" />
            <circle cx="18" cy="6" r="2.5" stroke="var(--bot-colour)" strokeWidth="1.5" fill="none" />
            <line x1="6" y1="22" x2="2" y2="22" stroke="var(--bot-colour)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="30" y1="22" x2="34" y2="22" stroke="var(--bot-colour)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

const HumanIcon = () => {
    return (
        <svg width="100%" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="11" r="6" stroke="var(--human-colour)" strokeWidth="1.8" fill="none" />
            <path d="M4 32c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="var(--human-colour)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
    )
}

export const DatasetCompositionSlide = () => {
    const [chartMode, setChartMode] = useState("bar");
    const { isDesktop } = useViewport()
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
                paddingLeft: "3rem",
                paddingRight: "3rem",
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
                        Dataset Composition
                    </h1>
                    <p style={{
                        textAlign: "left",
                        fontSize: "22px",
                        lineHeight: "1.75",
                        color: "#EAC46A",
                        maxWidth: isDesktop ? "60%" : "100%",
                        margin: "0 0 40px 0",
                        letterSpacing: "0.2px",
                    }}>
                        Our analysis examines 500 Reddit accounts, carefully balanced to compare behavioural patterns between automated bots and genuine human users. This foundation enables meaningful insights across multiple dimensions of online behaviour.
                    </p>
                </div>

                {/* Chart area */}
                <div
                    // onClick={() => setChartMode(m => m === "pie" ? "bar" : "pie")}
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
                // onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(196,98,45,0.04)"}
                // onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.01)"}
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
                    <HorizontalBarChart
                        height={300}
                        title={"Bots vs Humans"}
                        xLabel={"Number of Accounts"}
                        yLabel={"Are They A Bot?"}
                    />
                </div>
                {/* Stat cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
                    gap: "16px",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.6s 0.5s, transform 0.6s 0.5s",
                }}>
                    {/* Human card */}
                    <div style={{
                        borderStyle: "dashed",
                        borderColor: "var(--human-colour)"
                    }}>
                        <InfoCard Icon={HumanIcon} title={"282"} subtitle={"Human Accounts"} text={"56.4% of total dataset"} />
                    </div>

                    <div style={{
                        borderStyle: "dashed",
                        borderColor: "var(--bot-colour)"
                    }}>
                        <InfoCard Icon={BotIcon} title={"218"} subtitle={"Bot Accounts"} text={"43.6% of total dataset"} />
                    </div>
                    {/* Bot card */}

                </div>
            </main>
        </section>
    )
}