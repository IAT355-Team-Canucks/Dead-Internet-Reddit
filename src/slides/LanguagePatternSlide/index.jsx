
import { InfoCard } from "../../components/InfoCard";
import { useState, useEffect } from 'react';
import { ScatterPlot } from "../../components/ScatterPlot";
import { useViewport } from "../../context/ViewportContext";
import { AnnotationNav } from "../../components/AnnotationNav";

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

export const LanguagePatternSlide = () => {
    const [canAnimate, setCanAnimate] = useState(true);
    const [visible, setVisible] = useState(false);
    const [annotationToggle, setAnnotationToggle] = useState(0);

    const { xlg, med } = useViewport();

    const annotationsTable = [
        {
            xValue: 3.87,
            yValue: 25000,
            dx: 100,
            dy: 100,
            type: "callout",
            subjectShape: "box",
            note: {
                title: "User Karma",
                label: "The total amount of 'likes' a user has across all their posts. This can be synonymous with engagement and visibility.",
            },
            boxWidth: "2%",
            boxHeight: "20%",
            pointAt: "center",
            focus: true
        },
        {
            xValue: 5.75,
            yValue: -3000,
            dx: 0,
            dy: 100,
            type: "callout",
            subjectShape: "box",
            note: {
                title: "Average Word Length",
                label: "The average amount of letters (characters) per word in a particular post.",
            },
            boxWidth: "15%",
            boxHeight: "5%",
            pointAt: "center",
            focus: true
        },
 
        {
            xValue: 4.75,
            yValue: 25000,
            dx: 75,
            dy: 100,
            type: "callout",
            subjectShape: "box",
            note: {
                title: "Humans Keep it Simple",
                label: "Human posts tend to use fewer characters per word on average.",
            },
            boxWidth: "40%",
            boxHeight: "80%",
            pointAt: "center",
            focus: true,
        },
        {
            xValue: 6.75,
            yValue: 25000,
            dx: -50,
            dy: 100,
            type: "callout",
            subjectShape: "box",
            note: {
                title: "Bots Sound Smart?",
                label: "Bots tend to use larger words on average in their posts.",
            },
            boxWidth: "40%",
            boxHeight: "80%",
            pointAt: "center",
            focus: true,
        },
        {
            xValue: 5.75,
            yValue: 25000,
            dx: 100,
            dy: 100,
            type: "callout",
            subjectShape: "box",
            note: {
                title: "Overlap",
                label: "There exists an overlap between humans and bots of ~5.75 words",
            },
            boxWidth: "15%",
            boxHeight: "80%",
            pointAt: "center",
            focus: true,
        },
    ];

    const currentAnnotation = [annotationsTable[annotationToggle]];

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    const handleAnnotationChange = (newIndex) => {
        setAnnotationToggle(newIndex);
    
        if (canAnimate) {
          setCanAnimate(false);
        }
      };
    
      const handleNext = () => {
        setAnnotationToggle((prev) => (prev + 1) % annotationsTable.length);
    
        if (canAnimate) {
          setCanAnimate(false);
        }
      };

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
                    opacity: visible ? 1 : 0.01,
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
                        Language Patterns
                    </h1>
                    
                    <h2 style={{
                        fontSize: "clamp(1rem, 6.5vw, 1.5rem)",
                        lineHeight: "1",
                        color: "#f5e6c8",
                        margin: 0,
                        marginTop: "2rem",
                        marginBottom: "0.65rem",
                        fontWeight: "700",
                        maxWidth: xlg ? "80%" : "100%",
                        textAlign: "left"
                    }}>
                        So, what?
                    </h2>
                    <p style={{
                        textAlign: "left",
                        fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
                        lineHeight: "1.75",
                        color: "#EAC46A",
                        maxWidth: xlg ? "60%" : "100%",
                        margin: "0 0 40px 0",
                        letterSpacing: "0.2px",
                    }}>
                        Bot accounts demonstrate a clear preference for longer, more complex vocabulary, averaging 6.8 characters per word compared to humans' 4.2. This linguistic formality may be programmed to convey authority or credibility.                    </p>
                </div>

                {/* Chart area */}


                <div
                    style={{
                        border: "1.5px dashed #3D2810",
                        borderRadius: "4px",
                        padding: "40px",
                        marginBottom: "28px",
                        display: "flex",
                        flexDirection: "column",
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
                    {/*  67-0 HAHA GET IT, 6-7 */}
                    <ScatterPlot dotSize={10}
                        xKey={"avg_word_length"}
                        yKey={"user_karma"}
                        xLabel={"Average Word Length"}
                        canAnimate={canAnimate}
                        annotations={currentAnnotation}
                    />

                    {/* <div style={{ textAlign: "left" }}>
                        <div style={{
                            transition: "opacity 0.3s, transform 0.3s",
                            opacity: 1,
                        }}> 
                        
                        </div>
                    </div> */}
                    
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    
                <AnnotationNav
                        annotations={annotationsTable}
                        currentIndex={annotationToggle}
                        onChange={handleAnnotationChange}
                    />
                    {/* <button onClick={handleNext}>Cycle Annotation</button> */}

                    {/* <div style={{ color: "#fff" }}>
                        <p>Current title: {currentAnnotation[0]?.note?.title}</p>
                        <p>Current label: {currentAnnotation[0]?.note?.label}</p>
                    </div> */}
                    </div>
                </div>


                {/* Stat cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: med ? "1fr 1fr" : "1fr",
                    gap: "16px",
                    opacity: visible ? 1 : 0.01,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.6s 0.5s, transform 0.6s 0.5s",
                }}>
                    {/* Human card */}
                    <div style={{
                        borderStyle: "dashed",
                        borderColor: "var(--human-colour)"
                    }}>
                        <InfoCard Icon={HumanIcon} title={"5.049"} subtitle={"Average Characters Per Word"} text={"Conversational, natural Language"} round={false} />
                    </div>
                    {/* Bot card */}
                    <div style={{
                        borderStyle: "dashed",
                        borderColor: "var(--bot-colour)"
                    }}>
                        <InfoCard Icon={BotIcon} title={"6.438"} subtitle={"Average Characters Per Word"} text={"Formal, calculated vocabulary"} round={false} />
                    </div>


                </div>
            </main>
        </section>
    )
}