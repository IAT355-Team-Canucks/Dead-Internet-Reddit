import { createContext, useContext, useState, useEffect } from "react";

const ViewportContext = createContext();

export function ViewportProvider({ children }) {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ViewportContext.Provider
      value={{
        width,
        isMobile: width < 800,
        isDesktop: width >= 800,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
}

// helper hook (cleaner usage)
export function useViewport() {
  return useContext(ViewportContext);
}