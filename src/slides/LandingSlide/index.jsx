

import styles from "./LandingSlide.module.css";


import { useEffect, useState } from "react";

const BotIcon = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    {/* Antenna */}
    <rect x="52" y="8" width="16" height="6" rx="3" fill="#D4633A" />
    <rect x="58" y="14" width="4" height="12" fill="#D4633A" />
    {/* Head */}
    <rect x="18" y="26" width="84" height="64" rx="12" fill="#D4633A" />
    {/* Eyes */}
    <rect x="36" y="46" width="14" height="16" rx="4" fill="#1a1008" />
    <rect x="70" y="46" width="14" height="16" rx="4" fill="#1a1008" />
    {/* Mouth line */}
    <rect x="40" y="74" width="40" height="4" rx="2" fill="#1a1008" />
    {/* Left arm */}
    <rect x="2" y="48" width="16" height="8" rx="4" fill="#D4633A" />
    {/* Right arm */}
    <rect x="102" y="48" width="16" height="8" rx="4" fill="#D4633A" />
  </svg>
);

const BotIconFixed = () => (
  <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    {/* Antenna top */}
    <rect x="50" y="0" width="20" height="8" rx="4" fill="#D4633A" />
    {/* Antenna stem */}
    <rect x="57" y="8" width="6" height="14" fill="#D4633A" />
    {/* Head */}
    <rect x="14" y="22" width="92" height="70" rx="14" fill="#D4633A" />
    {/* Eyes */}
    <rect x="32" y="42" width="16" height="20" rx="5" fill="#1C1007" />
    <rect x="72" y="42" width="16" height="20" rx="5" fill="#1C1007" />
    {/* Left arm */}
    <rect x="0" y="46" width="14" height="10" rx="5" fill="#D4633A" />
    {/* Right arm */}
    <rect x="106" y="46" width="14" height="10" rx="5" fill="#D4633A" />
  </svg>
);

export const LandingSlide = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#1A120F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        padding: "0",
        margin: "0",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          position: "relative",
          background: "#1A120F",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "6% 7%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Main Heading */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <h1
            style={{
              color: "#D97757",
              fontSize: "clamp(2.5rem, 7vw, 6.5rem)",
              fontWeight: "300",
              letterSpacing: "0.01em",
              lineHeight: "1.05",
              margin: "0 0 clamp(0.8rem, 2vw, 1.8rem) 0",
              textTransform: "uppercase",
              fontFamily: "StyreneA, Helvetica, Arial, sans-serif",
              textAlign: "left"
            }}
          >
            Are Bots
            <br />
            Taking
            <br />
            Over
            <br />
            Reddit?
          </h1>
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            maxWidth: "650px",
          }}
        >
          <p
            style={{
              color: "#F7EFDD",
              fontSize: "clamp(1.5rem, 1.3vw, 2.5rem)",
              fontWeight: "400",
              lineHeight: "1.3",
              margin: "0",
              textAlign: "left",
              opacity: 0.85,
            }}
          >
            Exploring how automated accounts differ from genuine users through
            sentiment, language patterns, engagement metrics, and community
            distribution
          </p>
        </div>

        {/* Bot Icon - bottom right */}
        <div
          style={{
            position: "absolute",
            right: "6%",
            bottom: "6%",
            width: "clamp(80px, 14vw, 360px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
          }}
        >
          <BotIconFixed />
        </div>

        {/* Down arrow - bottom center */}
        <div
          style={{
            position: "absolute",
            bottom: "3%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#D4633A",
            fontSize: "clamp(4rem, 2vw, 6rem)",
            opacity: visible ? 0.7 : 0,
            transition: "opacity 0.7s ease 0.5s",
          }}
        >
          ↓
        </div>
      </div>
    </div>
  );
}