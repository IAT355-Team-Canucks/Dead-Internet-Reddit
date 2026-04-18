


import { useEffect, useState } from "react";

const BotIcon = () => (
  <svg width="248" height="248" viewBox="0 0 248 248" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M124 82.6667V41.3334H82.6665" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M186 82.6666H62.0002C50.5863 82.6666 41.3335 91.9194 41.3335 103.333V186C41.3335 197.414 50.5863 206.667 62.0002 206.667H186C197.414 206.667 206.667 197.414 206.667 186V103.333C206.667 91.9194 197.414 82.6666 186 82.6666Z" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.6665 144.667H41.3332" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M206.667 144.667H227.333" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M155 134.333V155" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M93 134.333V155" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BotIconFixed = () => (
  <svg width="248" height="248" viewBox="0 0 248 248" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }} >
    <path d="M124 82.6667V41.3334H82.6665" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M186 82.6666H62.0002C50.5863 82.6666 41.3335 91.9194 41.3335 103.333V186C41.3335 197.414 50.5863 206.667 62.0002 206.667H186C197.414 206.667 206.667 197.414 206.667 186V103.333C206.667 91.9194 197.414 82.6666 186 82.6666Z" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.6665 144.667H41.3332" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M206.667 144.667H227.333" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M155 134.333V155" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M93 134.333V155" stroke="#D97757" strokeWidth="20.6667" strokeLinecap="round" strokeLinejoin="round" />
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
        flex: 1,
        height: "100vh",
        display: "flex"
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
          paddingLeft: "3rem",
          paddingRight: "3rem",
          paddingBottom: "6rem",
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
              marginBottom: "1rem"
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