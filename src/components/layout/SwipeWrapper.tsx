"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const NAV_ORDER = [
  "/dashboard",
  "/course",
  "/assignment-solver",
  "/classroom",
  "/dashboard/analytics",
  "/settings",
];

export default function SwipeWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !isSwiping || !isMobile) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    const deltaX = currentX - touchStartRef.current.x;
    const deltaY = currentY - touchStartRef.current.y;

    // Only allow horizontal swiping if they drag mostly horizontally
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      // e.preventDefault(); // Optional: prevents vertical scroll while swiping horizontally
      setTranslateX(deltaX);
    } else {
      setIsSwiping(false); // Cancel swipe if it's mostly vertical
      setTranslateX(0);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !isMobile) return;
    
    const threshold = 100; // pixels
    const currentIndex = NAV_ORDER.indexOf(pathname === "/" ? "/dashboard" : pathname);

    if (translateX > threshold && currentIndex > 0) {
      // Swiped Right -> Go to Previous
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);
      setTranslateX(window.innerWidth); // Animate all the way off screen
      setTimeout(() => {
        router.push(NAV_ORDER[currentIndex - 1]);
        setTranslateX(0);
      }, 200);
    } else if (translateX < -threshold && currentIndex >= 0 && currentIndex < NAV_ORDER.length - 1) {
      // Swiped Left -> Go to Next
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);
      setTranslateX(-window.innerWidth);
      setTimeout(() => {
        router.push(NAV_ORDER[currentIndex + 1]);
        setTranslateX(0);
      }, 200);
    } else {
      // Snap back if threshold not met
      setTranslateX(0);
    }
    
    touchStartRef.current = null;
    setIsSwiping(false);
  };

  if (!isMobile) return <>{children}</>;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isSwiping ? "none" : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
        willChange: "transform",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        background: "transparent",
      }}
    >
      {children}
    </div>
  );
}
