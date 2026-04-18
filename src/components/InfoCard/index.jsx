import { useEffect, useRef, useState } from "react";
import "../../App.css";

export const InfoCard = ({ Icon, title, subtitle, text, round=true }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  // Guarding
  const target = Number(title) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          let start = 0;
          const duration = 1200; // ms
          const startTime = performance.now();

          const animate = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);

            // apply easing
            const eased = 1 - Math.pow(1 - progress, 4); // eased dramatic :D
            let value;
            if (round) {
              value = Math.round(Math.round(eased * target * 100) / 100);
            } else {
              value = Math.round(eased * target * 100) / 100;
            }
            

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
    <div
      ref={ref}
      style={{
        backgroundColor: "#1E1005",
        border: "1px solid #2E1A08",
        borderRadius: "6px",
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div style={{ height: "100px", width: "100px" }}>
        <Icon />
      </div>

      <div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: "800",
            color: "#EAC46A",
            lineHeight: 1,
            fontFamily: "'Georgia', serif",
            textAlign: "left",
          }}
        >
          {count}
        </div>

        <div
          style={{
            fontSize: "22px",
            letterSpacing: "2px",
            color: "#FAF3E0",
            marginTop: "4px",
            textAlign: "left",
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            fontSize: "20px",
            color: "#EAC46A",
            marginTop: "3px",
            letterSpacing: "0.5px",
            textAlign: "left",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};