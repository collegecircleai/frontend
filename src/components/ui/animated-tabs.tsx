"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);
  const [hovering, setHovering] = useState(false);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Tab Buttons Track */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          background: "var(--cream, #F8F7F4)",
          padding: "6px",
          borderRadius: "18px",
          border: "1px solid var(--border, rgba(0,0,0,0.08))",
          marginBottom: "56px",
          position: "relative",
          zIndex: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
      >
        {propTabs.map((tab, idx) => {
          const isActive = active.value === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                moveSelectedTabToTop(idx);
              }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              style={{
                position: "relative",
                padding: "12px 28px",
                borderRadius: "12px",
                border: "none",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                background: isActive ? "transparent" : "var(--deep, #FFFFFF)",
                color: isActive ? "#FFFFFF" : "var(--ink, #1a1a2e)",
                boxShadow: isActive ? "none" : "0 4px 15px rgba(0,0,0,0.02)",
                transition: "color 0.2s ease, transform 0.15s ease",
                outline: "none",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="clickedbutton"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--violet, #4D3FFF)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(77, 63, 255, 0.3)",
                    zIndex: 1,
                  }}
                />
              )}

              <span style={{ position: "relative", zIndex: 2 }}>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Stacked Content Cards */}
      <FadeInDiv
        tabs={tabs}
        active={active}
        key={active.value}
        hovering={hovering}
      />
    </div>
  );
};

export const AnimatedTabs = Tabs;

export const FadeInDiv = ({
  tabs,
  hovering,
}: {
  className?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "900px",
        minHeight: "560px",
        perspective: "1000px",
      }}
    >
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            position: "absolute",
            left: 0,
            width: "100%",
            transformOrigin: "top center",
            scale: 1 - idx * 0.04,
            top: hovering ? idx * -25 : idx * -6,
            zIndex: tabs.length - idx,
            opacity: idx < 3 ? 1 - idx * 0.18 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 20, 0] : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 24,
          }}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
