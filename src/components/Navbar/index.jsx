
import {useState, useEffect } from 'react';
import { useViewport } from '../../context/ViewportContext';


export const Navbar = ({sections, activeId, scrollTo}) => {
  const { isDesktop } = useViewport();

    return(
      isDesktop && <nav
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "10%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "40px",
        zIndex: 100
      }}
    >
      {sections?.map((s) => {
        const active = activeId === s.id;
        if (s.id === "_") return;
        return (
          <div
            key={s.id}
            onClick={() => scrollTo(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                height: 1.5,
                width: active ? 30 : 14,
                background: active ? "#c0614a" : "#5a4a38",
                flexShrink: 0,
                transition: "width 0.4s ease, background 0.4s ease",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: active ? "#c0614a" : "#5a4a38",
                minWidth: 24,
                transition: "color 0.4s ease",
              }}
            >
              {s.num}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#f0ebe4",
                opacity: active ? 1 : 0,
                transform: active ? "translateX(0)" : "translateX(-8px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </nav>
    )
}