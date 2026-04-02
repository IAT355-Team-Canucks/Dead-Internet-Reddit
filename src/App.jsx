import { useEffect, useRef, useState } from "react";
import { LandingSlide } from "./slides/LandingSlide";
import { DemoSlide } from "./slides/DemoSlide";
import { Navbar } from "./components/Navbar";

const sections = [
  {
    id: "intro",
    num: "00",
    label: "Introduction",
    component: LandingSlide,
  },
  {
    id: "dataset",
    num: "01",
    label: "Dataset Overview",
    component: DemoSlide,
  },
  // {
  //   id: "network",
  //   num: "06",
  //   label: "Network Graph",
  //   component: GraphSlide,
  // },
];

export default function App() {
  const [activeId, setActiveId] = useState("intro");
  const contentRef = useRef(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { root: container, threshold: 0.5 }
    );

    const sectionEls = container.querySelectorAll(".section");
    sectionEls.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#1A120F",
        fontFamily: "'Courier New', monospace",
      }}
    >
      
      <Navbar sections={sections} activeId={activeId}/>

      {/* Scrollable content */}
      <div
        ref={contentRef}
        style={{
          marginLeft: 300,
          flex: 1,
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          height: "100vh",
        }}
      >
        {sections.map((s) => {
          const SlideComponent = s.component;

          return (
            <div
              key={s.id}
              id={s.id}
              className="section"
              style={{
                height: "100vh",
                scrollSnapAlign: "start",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "100%", height: "100%" }}>
                <SlideComponent />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}