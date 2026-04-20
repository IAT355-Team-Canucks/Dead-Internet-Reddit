import { useViewport } from "../../context/ViewportContext"
import { useEffect, useState, useRef } from "react"
import { PieChart } from "../../components/PieChart"

export const ImpactSlide = () => {

  const { xlg } = useViewport()
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Guarding
  const target = 891817510;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          let start = 0;
          const duration = 2450; // ms
          const startTime = performance.now();

          const animate = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);

            // apply easing
            const eased = 1 - Math.pow(1 - progress, 4); // eased dramatic :D
            const value = Math.round(Math.round(eased * target * 100) / 100);

            setCount(value);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 } // trigger when 50% visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [target]);

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
        <div
          ref={ref}
          style={{
            display: "flex",
            maxWidth: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap", // important
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              margin: 0,
              gap: 0,
              justifyContent: "center",
              height: "auto",
              flex: "1 1 500px", // flexible text column
              minWidth: 0, // important in flex layouts
            }}
          >
            <p
              style={{
                fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
                color: "#EAC46A",
                maxWidth: xlg ? "90%" : "100%",
              }}
            >
              According to Reddit’s Transparency Report (2025), close to 6 billion
              pieces of content was shared on the platform.
            </p>

            <h1
              style={{
                lineHeight: "1.1",
                marginTop: "0rem",
                marginBottom: "1.25rem",
                fontFamily: "'Georgia', serif",
                color: "#FAF3E0",
                fontSize: "clamp(4.2rem, 6.25vw, 8rem)",
                wordBreak: "break-word",
              }}
            >
              {numberWithCommas(count)}
            </h1>

            <p
              style={{
                fontSize: "clamp(0.5rem, 6.5vw, 1rem)",
                color: "#EAC46A",
                marginBottom: "0.75rem",
                lineHeight: "1.1",
              }}
            >
              of those pieces are suspected to be from bots.
            </p>

            <p style={{ marginTop: "6rem" }}>
              In this experience, we seek to investigate the behaviours of bots on
              Reddit that separate them from humans.
            </p>
          </div>

          <div
            style={{
              flex: "1 1 400px",
              minWidth: "300px",
              maxWidth: "600px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PieChart
              data={[
                { label: "Bot Posts [15%]", value: target },
                { label: "Human Posts [85%]", value: 5053632554 },
              ]}
              width={600}
              height={600}
            />
          </div>
        </div>
      </main>
    </section>
  )
}