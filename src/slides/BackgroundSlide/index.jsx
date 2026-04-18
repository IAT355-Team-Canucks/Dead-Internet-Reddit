

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
                    height: "auto"

                    }}>
                    <p style={{fontSize: "1.5rem", color: "#EAC46A"}}>What’s a bot?</p>
                    <h1 style={{lineHeight: "1.1", marginTop: "1.25rem", marginBottom: "1.25rem", fontFamily: "'Georgia', serif", color: "#FAF3E0", fontSize: "3.25rem"}}>“A bot (short for robot) is a program that is programmed to automatically read the comments on Reddit and respond accordingly, or automatically make posts on Reddit.”</h1>
                    <p style={{fontSize: "1.5rem", color: "#EAC46A", marginBottom: "0.75rem"}}>-- u/Schuntzel</p>
                    <p>https://www.reddit.com/r/NoStupidQuestions/comments/15h3034/please_explain_exactly_what_is_a_bot_on_reddit/</p>
                </div>
            </main>
        </section>
    )
}