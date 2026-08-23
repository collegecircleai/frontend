'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useMotionValue } from 'framer-motion';

export interface SkewedCarouselProps {
  children: React.ReactNode[];
  perspective?: number;
  inactiveScale?: number;
  gap?: number;
  className?: string;
}

export function SkewedCarousel({
  children,
  perspective = 1000,
  inactiveScale = 0.85,
  gap = 24,
  className = ''
}: SkewedCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className={`relative w-full py-10 overflow-hidden ${className}`}
    >
      <motion.div
        className="w-full overflow-x-auto flex items-center hide-scroll-bar"
        ref={containerRef}
        style={{
          paddingLeft: '50vw', // so first card can be centered
          paddingRight: '50vw', // so last card can be centered
          paddingTop: '40px',
          paddingBottom: '80px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          gap: `${gap}px`,
        }}
      >
        <style>{`
          .hide-scroll-bar::-webkit-scrollbar { display: none; }
          .hide-scroll-bar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        
        {children.map((child, index) => (
          <CarouselItem 
            key={index} 
            containerRef={containerRef} 
            inactiveScale={inactiveScale}
            perspective={perspective}
            index={index}
          >
            {child}
          </CarouselItem>
        ))}
      </motion.div>
    </div>
  );
}

// Separate component for each item so we can track its position individually relative to the viewport
function CarouselItem({ 
  children, 
  containerRef,
  inactiveScale,
  perspective,
  index
}: { 
  children: React.ReactNode; 
  containerRef: React.RefObject<HTMLDivElement>;
  inactiveScale: number;
  perspective: number;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the container
  const { scrollX } = useScroll({ container: containerRef });
  
  // Use MotionValues for 60fps animations without React re-renders
  const scale = useMotionValue(1);
  const rotateY = useMotionValue(0);
  const zIndex = useMotionValue(1);
  const opacity = useMotionValue(1);

  useEffect(() => {
    if (!containerRef.current || !itemRef.current) return;
    
    const updateTransforms = () => {
      if (!containerRef.current || !itemRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = itemRef.current.getBoundingClientRect();
      
      const containerCenter = containerRect.left + containerRect.width / 2;
      const itemCenter = itemRect.left + itemRect.width / 2;
      
      // Calculate signed distance from center (negative = left of center, positive = right of center)
      const distance = itemCenter - containerCenter;
      // Use the item's width as the max influence distance
      const maxDistance = itemRect.width + 40; 
      
      // Normalized distance (-1 to 1)
      const normalizedDistance = Math.max(-1, Math.min(1, distance / maxDistance));
      
      // Absolute distance for scaling and z-index
      const absoluteNormalized = Math.abs(normalizedDistance);
      
      // 1. Scale: 1 at center, drops to inactiveScale at edges
      const newScale = 1 - absoluteNormalized * (1 - inactiveScale);
      
      // 2. RotateY (Coverflow inward tilt):
      // Left cards (negative distance) tilt right (positive Y).
      // Right cards (positive distance) tilt left (negative Y).
      const maxRotation = 50;
      const newRotateY = -normalizedDistance * maxRotation;
      
      // 3. Z-Index: Center item gets highest Z
      const newZIndex = Math.round(100 - absoluteNormalized * 100);

      // 4. Opacity: Slightly fade out edge items
      const newOpacity = 1 - absoluteNormalized * 0.25;
      
      // Apply the values to MotionValues directly
      scale.set(Math.max(inactiveScale, newScale));
      rotateY.set(newRotateY);
      zIndex.set(newZIndex);
      opacity.set(newOpacity);
    };

    // Initial update
    updateTransforms();
    
    // Update on scroll and resize
    const unsubscribe = scrollX.on('change', updateTransforms);
    window.addEventListener('resize', updateTransforms);
    
    return () => {
      unsubscribe();
      window.removeEventListener('resize', updateTransforms);
    };
  }, [scrollX, inactiveScale]);

  return (
    <motion.div
      ref={itemRef}
      onClickCapture={(e) => {
        if (!containerRef.current || !itemRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const itemRect = itemRef.current.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        const itemCenter = itemRect.left + itemRect.width / 2;
        
        // If it's more than 50px away from center, it's not the active card
        if (Math.abs(itemCenter - containerCenter) > 50) {
          e.preventDefault();
          e.stopPropagation();
          
          // Scroll the container so this item moves to the center
          const scrollTarget = containerRef.current.scrollLeft + (itemCenter - containerCenter);
          containerRef.current.scrollTo({
            left: scrollTarget,
            behavior: 'smooth'
          });
        }
      }}
      style={{
        scale,
        rotateY,
        zIndex,
        opacity,
        transformPerspective: perspective,
        transformStyle: 'preserve-3d',
        flexShrink: 0,
        scrollSnapAlign: 'center',
        cursor: 'pointer'
      }}
    >
      {children}
    </motion.div>
  );
}
