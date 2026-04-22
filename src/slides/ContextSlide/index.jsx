

export const ContextSlide = () => {
    
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
                    <p style={{fontSize: "clamp(0.75rem, 6.5vw, 1.25rem)", color: "#EAC46A"}}>So, what’s the big deal?</p>
                    <h1 style={{lineHeight: "1.1", marginTop: "1.25rem", marginBottom: "1.25rem", fontFamily: "'Georgia', serif", color: "#FAF3E0", fontSize: "clamp(1rem, 6.5vw, 3.5rem)"}}>Bot-saturated platforms are often flooded with copied popular posts to build accounts for resale, while also being used to spread division and influence politics.</h1>
                    <p style={{fontSize: "clamp(0.5rem, 6.5vw, 1rem)", color: "#EAC46A", marginBottom: "0.75rem", lineHeight: "1.1"}}>This means bots both shape and degrade both our real & digital world. In doing so, they recycle the same content until originality disappears and platforms become overrun, creating a “dead internet.”</p>
                    <p style={{fontSize: "clamp(0.5rem, 6.5vw, 1rem)", maxWidth: "100vw", wordBreak: "break-all"}}>See here: https://www.nytimes.com/2026/04/17/business/media/artificial-intelligence-trump-social-media.html</p>
                </div>
            </main>
        </section>
    )
}