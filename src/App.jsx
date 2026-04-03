import { useEffect, useRef, useState } from "react";

import { Navbar } from "./components/Navbar";

import { LandingSlide } from "./slides/LandingSlide";
import { DatasetCompositionSlide } from "./slides/DatasetCompositionSlide";
import { EmotionalRangeSlide } from "./slides/EmotionalRangeSlide";
import { LanguagePatternSlide } from "./slides/LanguagePatternSlide";
import { EngagementVelocitySlide } from "./slides/EngagementVelocitySlide";

import { DemoSlide } from "./slides/DemoSlide";

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
    component: DatasetCompositionSlide,
  },
  {
    id: "emotion",
    num: "02",
    label: "Emotional Range",
    component: EmotionalRangeSlide,
  },
  {
    id: "language",
    num: "03",
    label: "Language Patterns",
    component: LanguagePatternSlide,
  },
  {
    id: "engagement",
    num: "04",
    label: "Language Patterns",
    component: EngagementVelocitySlide,
  },
  // {
  //   id: "demo",
  //   num: "02",
  //   label: "Demo Slides",
  //   component: DemoSlide,
  // },
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
    // Scrolling based off CENTER of slides, navbar renders
    // whatever is closest based off center slide
    const container = contentRef.current;
    if (!container) return;

    const sectionEls = Array.from(container.querySelectorAll(".section"));

    const updateActiveSection = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestSection = null;
      let closestDistance = Infinity;

      sectionEls.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(containerCenter - sectionCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      });

      if (closestSection) {
        setActiveId(closestSection.id);
      }
    };

    updateActiveSection();

    container.addEventListener("scroll", updateActiveSection);
    window.addEventListener("resize", updateActiveSection);

    return () => {
      container.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const scrollTo = (id) => {
    // Toggles snap
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#1A120F",
        fontFamily: "'Courier New', monospace",
      }}
    >

      <Navbar sections={sections} activeId={activeId} scrollTo={scrollTo} />

      {/* Scrollable content */}
      <div
        ref={contentRef}
        style={{
          marginLeft: 300,
          flex: 1,
          overflowY: "scroll",
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
                minHeight: "100vh",
                height: "auto",
                scrollSnapAlign: "start",
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
                marginBottom: "8rem"
              }}
            >
              <div style={{ width: "100%", minHeight: "100%" }}>
                <SlideComponent />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}