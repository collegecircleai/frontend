"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, BookOpen, Zap, Mic, BarChart2, Settings } from "lucide-react";

/* ── Mobile Bottom Nav Items ── */
const MOBILE_NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/course", label: "Courses", icon: BookOpen },
  { href: "/assignment-solver", label: "Solver", icon: Zap },
  { href: "/classroom", label: "Live", icon: Mic },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  // Smart Hide-on-Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Tactile Haptic Feedback + Icon Bounce
  const triggerHaptic = (index: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    setTappedIndex(index);
    setTimeout(() => setTappedIndex(null), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* Gradient Glow Line along the curved top edge */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "2px",
              borderRadius: "2px",
              background: "linear-gradient(90deg, transparent 0%, #4D3FFF 20%, #6366F1 40%, #06B6D4 60%, #4D3FFF 80%, transparent 100%)",
              opacity: 0.5,
              filter: "blur(0.5px)",
              zIndex: 2,
            }}
          />

          {/* Nav bar body */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              height: "68px",
              background: "rgba(var(--header-bg), 0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.08)",
            }}
          >
            {MOBILE_NAV_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              const isBouncing = tappedIndex === index;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => triggerHaptic(index)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                    textDecoration: "none",
                    color: active ? "var(--violet)" : "var(--mist)",
                    fontSize: "10px",
                    fontFamily: "var(--font-body)",
                    fontWeight: active ? 600 : 400,
                    transition: "color 0.2s ease",
                    padding: "4px 0",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <div style={{
                    position: "relative",
                    padding: "6px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1px",
                    /* Icon Bounce on Tap */
                    transform: isBouncing ? "scale(1.25)" : "scale(1)",
                    transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}>
                    {/* Sliding Round Pill Indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeBottomNav"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "100px",
                          background: "var(--violet)",
                          opacity: 0.12,
                        }}
                      />
                    )}
                    <Icon size={22} strokeWidth={active ? 2.2 : 1.6} style={{ position: "relative", zIndex: 1 }} />
                  </div>
                  
                  <span style={{ letterSpacing: active ? "0.02em" : "0" }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
