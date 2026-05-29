"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, Sun, Linkedin, Instagram, Mail } from "lucide-react";
import CCAILogo from "@/components/brand/CCAILogo";
import DarkAurora from "@/components/effects/DarkAurora";
import ElegantParticles from "@/components/effects/ElegantParticles";
import ComponentErrorBoundary from "@/components/effects/ErrorBoundary";

// LAUNCH DATE: May 30, 2026 at 3:00 PM IST (09:30 UTC)
const TARGET_DATE = new Date("2026-05-30T09:30:00.000Z").getTime();

export default function LaunchPage() {
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const hypePhrases = [
    "AI-DRIVEN COURSE CREATION...",
    "ADAPTIVE LEARNING PATHS...",
    "PERSONALIZED AI TUTORING...",
    "The premium learning experience awaits."
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    
    const textInterval = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % hypePhrases.length);
    }, 3500);
    
    // Check and set initial theme
    const savedTheme = localStorage.getItem('cc-ai-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        clearInterval(interval);
        // The time has come! Trigger the launch sequence
        setIsLaunching(true);
        // Wait 3 seconds for the dramatic exit animation, then enter the app
        setTimeout(() => {
          // A full window redirect ensures the middleware freshly evaluates the server time
          window.location.href = "/";
        }, 1500);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [router]);

  if (!isMounted) return <div style={{ background: "var(--pearl)", minHeight: "100vh" }} />;

  const pad = (num: number) => num.toString().padStart(2, "0");

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('cc-ai-theme', newTheme);
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100dvh",
        background: "var(--pearl)", // Uses theme background
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        overflowY: "auto",
        padding: "40px 0",
        color: "var(--ink)",
      }}
    >
      <style>{`
        .launch-logo-container {
          transform: scale(1.8);
          transform-origin: center;
          margin-bottom: 32px;
          margin-top: 16px;
        }
        .launch-timer-container {
          display: flex;
          gap: clamp(12px, 3vw, 24px);
          align-items: center;
        }
        .time-unit-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: clamp(70px, 20vw, 120px);
          padding: clamp(20px, 5vw, 32px) 0;
          border-radius: 24px;
          backdrop-filter: blur(30px);
          position: relative;
          overflow: hidden;
        }
        .time-unit-value {
          font-family: var(--font-display, sans-serif);
          font-size: clamp(36px, 10vw, 64px);
          font-weight: 700;
          line-height: 1;
        }
        .launch-action-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
          z-index: 20;
          width: 100%;
          max-width: 600px;
          padding: 0 16px;
        }
        .launch-button {
          padding: 16px 36px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 54px;
        }
        .launch-social-pill {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 24px;
          height: 54px;
          backdrop-filter: blur(20px);
          border-radius: 100px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        /* Tablet/Mobile Breakpoint */
        @media (max-width: 768px) {
          .launch-logo-container {
            transform: scale(1.3);
            margin-bottom: 24px;
            margin-top: 40px;
          }
          .launch-timer-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            max-width: 320px;
            width: 100%;
          }
          .time-unit-card {
            width: 100%;
            padding: 24px 0;
          }
          .time-unit-value {
            font-size: 48px;
          }
          .launch-action-container {
            flex-direction: column;
            max-width: 320px;
          }
          .launch-social-pill {
            width: 100%;
            justify-content: center;
          }
        }

        /* Small Phone Breakpoint */
        @media (max-width: 480px) {
          .launch-logo-container {
            transform: scale(1.2);
            margin-bottom: 32px;
            margin-top: 30px;
          }
          .launch-logo-container svg {
            width: 50px !important;
            height: 50px !important;
          }
          .launch-timer-container {
            gap: 12px;
            max-width: 100%;
            padding: 0 16px;
          }
          .time-unit-card {
            padding: 20px 0;
            border-radius: 20px;
          }
          .time-unit-value {
            font-size: 40px;
          }
          .launch-action-container {
            max-width: 100%;
          }
          .launch-button {
            padding: 0 24px;
            font-size: 16px;
          }
        }
      `}</style>
      {/* Cinematic Backgrounds */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: isLaunching ? 0 : 1, transition: "opacity 2s ease" }}>
        {/* Dynamic Grid Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(to right, var(--border-light) 1px, transparent 1px),
                            linear-gradient(to bottom, var(--border-light) 1px, transparent 1px)`,
          backgroundSize: "4rem 4rem",
          maskImage: "radial-gradient(circle at center, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 80%)",
          opacity: theme === 'dark' ? 0.4 : 0.8
        }} />
        <ComponentErrorBoundary>
          <DarkAurora />
          <ElegantParticles count={100} />
        </ComponentErrorBoundary>
      </div>

      {/* Live Network Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          position: "absolute",
          top: "clamp(20px, 4vw, 40px)",
          left: "clamp(20px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 50,
        }}
      >
        <motion.div 
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--jade, #00C896)", boxShadow: "0 0 10px var(--jade, #00C896)" }}
        />
        <div style={{ 
          fontFamily: "var(--font-mono, monospace)", 
          fontSize: "10px", 
          color: theme === 'dark' ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", 
          letterSpacing: "0.2em", 
          textTransform: "uppercase" 
        }}>
          SYSTEM STANDBY
        </div>
      </motion.div>

      {/* Theme Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(139, 128, 249, 0.15)' }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "absolute",
          top: "clamp(20px, 4vw, 40px)",
          right: "clamp(20px, 4vw, 40px)",
          backgroundColor: 'rgba(139, 128, 249, 0)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink)',
          cursor: 'pointer',
          zIndex: 50,
          transition: 'background-color 0.3s ease'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ y: 20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {!isLaunching && (
          <motion.div
            key="countdown-ui"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "48px",
            }}
          >
            {/* Branding */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
            >
              <div className="launch-logo-container">
                <CCAILogo size={80} />
              </div>

            </motion.div>

            {/* The Timer */}
            <div className="launch-timer-container">
              <TimeUnit value={pad(timeLeft.days)} label="Days" />
              <TimeUnit value={pad(timeLeft.hours)} label="Hours" />
              <TimeUnit value={pad(timeLeft.minutes)} label="Minutes" />
              <TimeUnit value={pad(timeLeft.seconds)} label="Seconds" highlight />
            </div>

            {/* Bottom Content Group (Hype, Progress, Buttons) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <div style={{ height: "48px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "16px", marginBottom: "8px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.8 }}
                    style={{
                      fontFamily: phraseIndex === hypePhrases.length - 1 ? "var(--font-display, serif)" : "var(--font-mono, monospace)",
                      fontSize: phraseIndex === hypePhrases.length - 1 ? "clamp(20px, 4.5vw, 28px)" : "clamp(12px, 2.5vw, 16px)",
                      letterSpacing: phraseIndex === hypePhrases.length - 1 ? "0.02em" : "0.2em",
                      textAlign: "center",
                      maxWidth: "600px",
                      lineHeight: 1.4,
                      color: phraseIndex === hypePhrases.length - 1 ? "var(--ink)" : "var(--mist)",
                      fontWeight: phraseIndex === hypePhrases.length - 1 ? 500 : 600,
                      fontStyle: phraseIndex === hypePhrases.length - 1 ? "italic" : "normal"
                    }}
                  >
                    {hypePhrases[phraseIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Launch Progress Line */}
              <div style={{ 
                width: "100%", maxWidth: "200px", height: "2px", 
                background: "var(--border-light)", borderRadius: "2px", 
                overflow: "hidden", marginBottom: "32px", position: "relative" 
              }}>
                <motion.div 
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                  style={{ 
                    position: "absolute", top: 0, width: "50%", height: "100%", 
                    background: "linear-gradient(90deg, transparent, var(--violet), transparent)", 
                    boxShadow: "0 0 10px var(--violet)" 
                  }}
                />
              </div>

              <div className="launch-action-container" style={{ marginTop: "12px" }}>
                <Link href="/preview" style={{ textDecoration: 'none', width: '100%', display: 'flex' }}>
                  <motion.button
                    className="launch-button"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 128, 249, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: theme === 'dark' ? 'var(--violet)' : 'var(--violet-pale)', 
                      color: theme === 'dark' ? '#FFFFFF' : 'var(--violet)',
                      border: theme === 'dark' ? 'none' : '1px solid rgba(139, 128, 249, 0.3)',
                      cursor: 'pointer', backdropFilter: 'blur(12px)',
                      transition: 'all 0.3s ease',
                      boxShadow: theme === 'dark' ? "0 10px 25px rgba(139, 128, 249, 0.25)" : "0 10px 20px rgba(139, 128, 249, 0.15)",
                      fontFamily: "var(--font-body, sans-serif)"
                    }}
                  >
                    Explore Platform Features
                  </motion.button>
                </Link>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
                  className="launch-social-pill"
                  style={{
                    background: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", paddingRight: "8px", whiteSpace: "nowrap" }}>
                    Join Community
                  </div>
                  {[
                    { href: "https://www.linkedin.com/company/collegecircleai/", icon: <Linkedin size={20} /> },
                    { href: "https://www.instagram.com/college.circle.ai/", icon: <Instagram size={20} /> },
                    { 
                      href: "https://x.com/AICollegeCircle", 
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ) 
                    }
                  ].map((social, i) => (
                    <Link key={i} href={social.href} target="_blank" rel="noopener noreferrer">
                      <motion.div
                        whileHover={{ scale: 1.2, color: "var(--violet)", y: -2 }}
                        style={{ color: "var(--ink)", transition: "color 0.2s ease", cursor: "pointer", display: "flex" }}
                      >
                        {social.icon}
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimeUnit({ value, label, highlight = false }: { value: string; label: string; highlight?: boolean }) {
  return (
    <motion.div 
      className="time-unit-card"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ 
        background: highlight ? "rgba(0, 200, 150, 0.03)" : "rgba(255, 255, 255, 0.01)",
        border: highlight ? "1px solid rgba(0, 200, 150, 0.3)" : "1px solid var(--border)",
        boxShadow: highlight 
          ? "0 20px 40px rgba(0,200,150,0.15), inset 0 0 20px rgba(0,200,150,0.05)" 
          : "0 20px 40px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.02)",
      }}
    >
      {/* Premium Glass Shimmer Reflection */}
      <div style={{
        position: "absolute", top: 0, left: "-50%", width: "200%", height: "100%",
        background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
        transform: "translateX(-100%)",
        animation: "cardShimmer 6s infinite ease-in-out"
      }} />
      <style>{`
        @keyframes cardShimmer {
          0% { transform: translateX(-100%); }
          20% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div
        className="time-unit-value"
        style={{
          color: highlight ? "var(--jade, #00C896)" : "var(--ink)",
          textShadow: highlight ? "0 0 40px rgba(0,200,150,0.5)" : "none",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "clamp(8px, 2.5vw, 11px)",
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: highlight ? "rgba(0, 200, 150, 0.8)" : "var(--mist)",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
