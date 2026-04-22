
import { InfoCard } from "../../components/InfoCard";
import { useState, useEffect } from 'react';
import { ScatterPlot } from "../../components/ScatterPlot";

import { useViewport } from "../../context/ViewportContext";
import { AnnotationNav } from "../../components/AnnotationNav";


export const ResponseTimingSlide = () => {
    const [visible, setVisible] = useState(false);
    const [canAnimate, setCanAnimate] = useState(true)
    const [annotationToggle, setAnnotationToggle] = useState(0)
    const { xlg } = useViewport();

    const handleAnnotationChange = (newIndex) => {
        setAnnotationToggle(newIndex);

        if (canAnimate) {
            setCanAnimate(false);
        }
    };

    const annotationsTable = [
        {
            xValue: -80,
            yValue: 25000,
            dx: 100,
            dy: 100,
            type: "callout",
            subjectShape: "box",
            note: {
                title: "User Karma",
                label: "The total amount of 'likes' a user has across all their posts. This can be synonymous with engagement and visibility.",
            },
            boxWidth: "7%",
            boxHeight: "5%",
            pointAt: "center",
            focus: true
        },
        {
            xValue: 2000,
            yValue: -1000,
            dx: 100,
            dy: 100,
            type: "callout",
            subjectShape: "box",
            note: {
                title: "Response Speed",
                label: "How fast it took for the user to respond to a post as a comment.",
            },
            boxWidth: "7%",
            boxHeight: "4%",
            pointAt: "center",
            focus: true
        },
        {
            xValue: 2000,
            yValue: 25000,
            dx: 75,
            dy: 100,
            type: "callout",
            subjectShape: "box",
            note: {
                title: "Humans Take Time",
                label: "Human accounts generally take longer to reply",
            },
            boxWidth: "90%",
            boxHeight: "90%",
            pointAt: "center",
            focus: true
        },
        {
            xValue: 5,
            yValue: 25000,
            dx: 100,
            dy: 100,
            type: "callout",
            subjectShape: "box",
            note: {
                title: "Another High Bot Cluster",
                label: "Bots reply fast and nearly immediately.",
            },
            boxWidth: "3%",
            boxHeight: "90%",
            pointAt: "center",
            focus: true
        },
    ]

    const currentAnnotation = [annotationsTable[annotationToggle]];
    // Animation clear out
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    const handleClick = () => {
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
                        Response Timing & Engagement
                    </h1>
                    <p style={{
                        textAlign: "left",
                        fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
                        lineHeight: "1.75",
                        color: "#EAC46A",
                        maxWidth: xlg ? "60%" : "100%",
                        margin: "0 0 40px 0",
                        letterSpacing: "0.2px",
                    }}> An interesting pattern emerges when we observe bots' response times. Bots cluster at near-instant reply times, regardless of their karma, responding almost immediately. Human users, on the other hand, are more spread out, taking longer and more varied amounts of time to respond.               </p>
                <p style={{
                        textAlign: "left",
                        fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
                        lineHeight: "1.75",
                        color: "#EAC46A",
                        maxWidth: xlg ? "60%" : "100%",
                        margin: "0 0 40px 0",
                        letterSpacing: "0.2px",
                    }}> 
                    So while karma/engagement varies for both groups, but timing makes the difference clearer. Bots respond quickly and consistently, while humans are slower and less predictable.   </p>
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
                        xKey={"reply_delay_seconds"}
                        yKey={"user_karma"}
                        xLabel={"Response Speed (in Seconds)"}
                        annotations={currentAnnotation}
                        canAnimate={canAnimate}
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

            </main>
        </section>
    )
}