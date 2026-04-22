import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ViewportProvider } from "./context/ViewportContext";
import { Navbar } from "./components/Navbar";
import { CsvDataProvider } from "./context/CsvDataContext";

const LandingSlide = lazy(() =>
  import("./slides/LandingSlide").then((m) => ({
    default: m.LandingSlide,
  }))
);

const BackgroundSlide = lazy(() =>
  import("./slides/BackgroundSlide").then((m) => ({
    default: m.BackgroundSlide,
  }))
);

const ContextSlide = lazy(() =>
  import("./slides/ContextSlide").then((m) => ({
    default: m.ContextSlide,
  }))
);

const ImpactSlide = lazy(() =>
  import("./slides/ImpactSlide").then((m) => ({
    default: m.ImpactSlide,
  }))
);

const DatasetCompositionSlide = lazy(() =>
  import("./slides/DatasetCompositionSlide").then((m) => ({
    default: m.DatasetCompositionSlide,
  }))
);

// const CategoryBreakdownSlide = lazy(() =>
//   import("./slides/CategoryBreakdownSlide").then((m) => ({
//     default: m.CategoryBreakdownSlide,
//   }))
// );


const EmotionalRangeSlide = lazy(() =>
  import("./slides/EmotionalRangeSlide").then((m) => ({
    default: m.EmotionalRangeSlide,
  }))
);

const LanguagePatternSlide = lazy(() =>
  import("./slides/LanguagePatternSlide").then((m) => ({
    default: m.LanguagePatternSlide,
  }))
);

const EngagementVelocitySlide = lazy(() =>
  import("./slides/EngagementVelocitySlide").then((m) => ({
    default: m.EngagementVelocitySlide,
  }))
);

const PostDistributionSlide = lazy(() =>
  import("./slides/PostDistributionSlide").then((m) => ({
    default: m.PostDistributionSlide,
  }))
);

const LinkBehaviourSlide = lazy(() =>
  import("./slides/LinkBehaviourSlide").then((m) => ({
    default: m.LinkBehaviourSlide,
  }))
);

const ResponseTimingSlide = lazy(() =>
  import("./slides/ResponseTimingSlide").then((m) => ({
    default: m.ResponseTimingSlide,
  }))
);

const ConclusionSlide = lazy(() =>
  import("./slides/ConclusionSlide").then((m) => ({
    default: m.ConclusionSlide,
  }))
);



// import { DemoSlide } from "./slides/DemoSlide";

const sections = [
  {
    id: "intro",
    num: "00",
    label: "Introduction",
    component: LandingSlide,
    hasChart: false
  },
  {
    id: "background",
    num: "01",
    label: "What are Bots?",
    component: BackgroundSlide,
    hasChart: false
  },
  {
    id: "context",
    num: "02",
    label: "The Big Idea",
    component: ContextSlide,
    hasChart: false
  },
  {
    id: "impact",
    num: "03",
    label: "Bots on Reddit",
    component: ImpactSlide,
    hasChart: true
  },
  {
    id: "dataset",
    num: "04",
    label: "Dataset Overview",
    component: DatasetCompositionSlide,
    hasChart: true
  },
  // {
  //   id: "breakdown",
  //   num: "05",
  //   label: "Catgeory Breakdown",
  //   component: CategoryBreakdownSlide,
  //   hasChart: false
  // },
  {
    id: "emotion",
    num: "05",
    label: "Emotional Range",
    component: EmotionalRangeSlide,
    hasChart: true
  },

  {
    id: "language",
    num: "06",
    label: "Language Patterns",
    component: LanguagePatternSlide,
    hasChart: true
  },
  {
    id: "engagement",
    num: "07",
    label: "Engagement Velocity",
    component: EngagementVelocitySlide,
    hasChart: true
  },
  {
    id: "distribution",
    num: "08",
    label: "Post Distribution",
    component: PostDistributionSlide,
    hasChart: true
  },
  {
    id: "link",
    num: "09",
    label: "Link Behaviour",
    component: LinkBehaviourSlide,
    hasChart: true
  },
  {
    id: "response",
    num: "10",
    label: "Response Timing",
    component: ResponseTimingSlide,
    hasChart: true
  },
  {
    id: "conclusion",
    num: "11",
    label: "Conclusion",
    component: ConclusionSlide,
    hasChart: false
  },

  // {
  //   id: "demo",
  //   num: "XX",
  //   label: "Demo Slides",
  //   component: DemoSlide,
  // },
];

export default function App() {
  const [activeId, setActiveId] = useState("intro");
  const contentRef = useRef(null);

  const [isSmall, setIsSmall] = useState(window.innerWidth < 800);
  const CSV_PATH = `${import.meta.env.BASE_URL}data/reddit_dead_internet_analysis.csv`;

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <ViewportProvider>
      <CsvDataProvider csvPath={CSV_PATH}>

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
              marginLeft: !isSmall ? "12.5rem" : "0",
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
                    marginBottom: "12rem"
                  }}
                >
                  <div style={{ width: "100%", minHeight: "100%" }}>
                    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#1A120F" }} />}>
                      <SlideComponent />
                    </Suspense>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CsvDataProvider>

    </ViewportProvider>

  );
}