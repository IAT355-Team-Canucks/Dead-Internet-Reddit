

export const BackgroundSlide = () => {
    
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
                <div style={{
                    display: "flex", 
                    flexDirection: "column", 
                    textAlign: "left",
                    margin: "0",
                    gap: "0",
                    justifyContent: "center",
                    height: "auto",
                    marginBottom: "4rem"

                    }}>
                    <p style={{fontSize: "clamp(0.75rem, 6.5vw, 1.25rem)", color: "#EAC46A"}}>What’s a bot?</p>
                    <h1 style={{lineHeight: "1.1", marginTop: "1.25rem", marginBottom: "1.25rem", fontFamily: "'Georgia', serif", color: "#FAF3E0", fontSize: "clamp(1rem, 6.5vw, 3.5rem)"}}>“A bot (short for robot) is a program that is programmed to automatically read the comments on Reddit and respond accordingly, or automatically make posts on Reddit.”</h1>
                    <p style={{fontSize: "clamp(0.5rem, 6.5vw, 1rem)", color: "#EAC46A", marginBottom: "0.75rem"}}>-- u/Schuntzel</p>
                    <p style={{fontSize: "clamp(0.5rem, 6.5vw, 1rem)", maxWidth: "100vw", wordBreak: "break-all"}}>https://www.reddit.com/r/NoStupidQuestions/comments/15h3034/please_explain_exactly_what_is_a_bot_on_reddit/</p>
                </div>

                <div style={{
                    display: "flex", 
                    flexDirection: "column", 
                    textAlign: "left",
                    margin: "0",
                    gap: "0",
                    justifyContent: "center",
                    height: "auto"

                    }}>
                    <h2 style={{fontSize: "clamp(0.75rem, 6.5vw, 1.25rem)", color: "#EAC46A"}}>In this experience, we will categorize bots as the following:</h2>
                    <ul style={{fontSize: "clamp(0.75rem, 6.5vw, 1.25rem)", color: "#FAF3E0", marginBottom: "0.75rem"}}>
                        <li><span style={{fontWeight: "700"}}>AI Summarizer</span> - Auto-summarizes by aggregating comments or posts</li>
                        <li><span style={{fontWeight: "700"}}>Engagement Farmer</span> - Create emotionally charged posts to bait user interaction</li>
                        <li><span style={{fontWeight: "700"}}>Reprint Bot</span> - Find popular posts, copies them, and reposts them.</li>
                    </ul>
                </div>
            </main>
        </section>
    )
}