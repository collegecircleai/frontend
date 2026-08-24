"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { IconFolder, IconFolderOpen } from "@tabler/icons-react";

export interface FolderCard {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface AnimatedFolderProps {
  title: string;
  subtitle?: string;
  openSubtitle?: string;
  cards: FolderCard[];
}

export function AnimatedFolder({
  title,
  subtitle = "Hover to peek inside",
  openSubtitle = "Explore the challenges",
  cards,
}: AnimatedFolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  // Only trigger when 85% of the folder container is visible — user must fully reach the section
  const isInView = useInView(containerRef, { amount: 0.85, once: false });

  // Auto-open only when user scrolls down and reaches this section
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isInView) {
      timeout = setTimeout(() => setIsOpen(true), 1800);
    } else {
      setIsOpen(false);
    }
    return () => clearTimeout(timeout);
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-end w-full max-w-4xl mx-auto cursor-pointer select-none"
      style={{ minHeight: "400px", perspective: "1400px", marginTop: "20px" }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setHoveredIndex(null);
      }}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      {/* Folder Back Base / Tab */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "360px",
          height: "220px",
          borderRadius: "24px 36px 24px 24px",
          background: "linear-gradient(145deg, #2A245C, #181438)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 24px 48px -12px rgba(18, 14, 45, 0.4)",
          zIndex: 10,
        }}
      >
        {/* Subtle Tab on top-left of back cover */}
        <div
          style={{
            position: "absolute",
            top: "-14px",
            left: "20px",
            width: "110px",
            height: "20px",
            borderRadius: "10px 10px 0 0",
            background: "#2A245C",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderBottom: "none",
          }}
        />
      </div>

      {/* Floating Project / Reality Cards */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          height: "380px",
          zIndex: 20,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <AnimatePresence>
          {cards.map((card, i) => {
            // When closed: all stacked inside folder
            // When open: spread horizontally into 3 distinct clear columns
            const total = cards.length;
            const spreadX = (i - (total - 1) / 2) * 290; // generous spacing so no text overlap
            const spreadRotate = (i - (total - 1) / 2) * 6; // subtle natural tilt
            const spreadY = -120 - Math.abs(i - (total - 1) / 2) * -15;

            const isHovered = hoveredIndex === i;

            return (
              <motion.div
                key={card.id}
                initial={{
                  y: 60,
                  x: 0,
                  opacity: 0,
                  rotate: 0,
                  scale: 0.75,
                }}
                animate={{
                  y: isOpen ? (isHovered ? spreadY - 30 : spreadY) : 60,
                  x: isOpen ? (isHovered ? spreadX : spreadX) : 0,
                  opacity: isOpen ? 1 : 0,
                  rotate: isOpen ? (isHovered ? 0 : spreadRotate) : 0,
                  scale: isOpen ? (isHovered ? 1.05 : 1) : 0.75,
                  zIndex: isHovered ? 60 : 20 + i,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 24,
                  delay: isOpen ? i * 0.06 : (total - 1 - i) * 0.04,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`folder-card ${isHovered ? "hovered" : ""}`}
                style={{
                  position: "absolute",
                  width: "270px",
                  borderRadius: "20px",
                  padding: "24px",
                  cursor: "pointer",
                  transformOrigin: "bottom center",
                  textAlign: "left",
                }}
              >
                {/* Card Icon Container */}
                {card.icon && (
                  <div
                    className="folder-card-icon"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    {card.icon}
                  </div>
                )}

                {/* Card Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    marginBottom: "8px",
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>

                {/* Card Description */}
                {card.description && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      color: "var(--mist)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {card.description}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Folder Front Cover (3D Flap) */}
      <motion.div
        animate={{
          rotateX: isOpen ? -38 : 0,
          y: isOpen ? 12 : 0,
          scale: isOpen ? 0.98 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 22,
        }}
        style={{
          position: "relative",
          width: "360px",
          height: "200px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #4D3FFF 0%, #6E61FF 50%, #897EFF 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.4)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: isOpen
            ? "0 30px 60px -15px rgba(77, 63, 255, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)"
            : "0 20px 45px -10px rgba(77, 63, 255, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
          transformOrigin: "bottom center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "#FFFFFF",
          zIndex: 30,
        }}
      >
        {/* Subtle glowing reflection line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            width: "70%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
          }}
        />

        <motion.div
          animate={{
            scale: isOpen ? 1.08 : 1,
            y: isOpen ? -3 : 0,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
          }}
        >
          {isOpen ? (
            <IconFolderOpen size={30} strokeWidth={2} color="#FFFFFF" />
          ) : (
            <IconFolder size={30} strokeWidth={2} color="#FFFFFF" />
          )}
        </motion.div>

        <div style={{ textAlign: "center", marginTop: "2px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              display: "block",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "rgba(255, 255, 255, 0.8)",
              marginTop: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>{isOpen ? openSubtitle : subtitle}</span>
          </span>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .folder-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 18px 40px -10px rgba(20, 16, 50, 0.12), 0 4px 12px rgba(0,0,0,0.04);
        }
        .folder-card.hovered {
          border: 1px solid var(--violet);
          box-shadow: 0 28px 60px -12px rgba(77, 63, 255, 0.25), 0 12px 24px -6px rgba(0,0,0,0.08);
        }
        .folder-card-icon {
          background: var(--violet-pale);
          color: var(--violet);
        }

        [data-theme='dark'] .folder-card {
          background: #0A0A1E;
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 18px 40px -10px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(139, 92, 246, 0.05);
        }
        [data-theme='dark'] .folder-card.hovered {
          border: 1px solid var(--violet-light);
          box-shadow: 0 28px 60px -12px rgba(139, 92, 246, 0.4), inset 0 2px 4px rgba(139, 92, 246, 0.1);
        }
        [data-theme='dark'] .folder-card-icon {
          background: rgba(139, 92, 246, 0.15);
          color: var(--violet-light);
        }
      `}} />
    </div>
  );
}

