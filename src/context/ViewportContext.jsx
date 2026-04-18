import { createContext, useContext, useState, useEffect } from "react";

const ViewportContext = createContext();

// // Small devices (landscape phones, 576px and up)
// @media (min-width: 576px) { ... }

// // Medium devices (tablets, 768px and up)
// @media (min-width: 768px) { ... }

// // Large devices (desktops, 992px and up)
// @media (min-width: 992px) { ... }

// // X-Large devices (large desktops, 1200px and up)
// @media (min-width: 1200px) { ... }

// // XX-Large devices (larger desktops, 1400px and up)
// @media (min-width: 1400px) { ... }

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
        xlg: width >= 1200,
        lg: width < 992,
        med: width < 768,
        sm: width < 600
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