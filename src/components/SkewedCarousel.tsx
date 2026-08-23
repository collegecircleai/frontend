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
  inactiveScale = 0.8,
  gap = 0,
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
          padding: '40px calc(50vw - clamp(140px, 40vw, 170px)) 80px calc(50vw - clamp(140px, 40vw, 170px))', // Centers the first and last items
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          marginBottom: '-40px'
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
  const x = useMotionValue(0);
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
      // Use the item's width as the max influence distance for tight overlap
      const maxDistance = itemRect.width + 40; 
      
      // Normalized distance (-1 to 1)
      const normalizedDistance = Math.max(-1, Math.min(1, distance / maxDistance));
      
      // Absolute distance for scaling and z-index
      const absoluteNormalized = Math.abs(normalizedDistance);
      
      // 1. Scale: 1 at center, drops to inactiveScale at edges
      const newScale = 1 - absoluteNormalized * (1 - inactiveScale);
      
      // 2. RotateY: 
      // If item is on the left (negative distance), rotate right (positive degrees).
      // If item is on the right (positive distance), rotate left (negative degrees).
      const maxRotation = 55; // Steep rotation like Apple Coverflow
      const newRotateY = normalizedDistance * maxRotation;
      
      // 3. Translate X (Overlap):
      // Push items toward the center to create the overlapping coverflow effect
      // If on left (negative distance), push right (positive X).
      // If on right (positive distance), push left (negative X).
      const overlapStrength = 0; // Removed artificial overlap to give them space
      const newTranslateX = -normalizedDistance * overlapStrength;
      
      // 4. Z-Index: Center item gets highest Z
      const newZIndex = Math.round(100 - absoluteNormalized * 100);

      // 5. Opacity: Slightly fade out edge items
      const newOpacity = 1 - absoluteNormalized * 0.2;
      
      // Apply the values to MotionValues directly
      scale.set(Math.max(inactiveScale, newScale));
      rotateY.set(newRotateY);
      x.set(newTranslateX);
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
          e.stopPropagation(); // Prevent the child's onClick (modal) from firing
          
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
        x,
        zIndex,
        opacity,
        transformPerspective: perspective,
        transformStyle: 'preserve-3d',
        flexShrink: 0,
        scrollSnapAlign: 'center',
        // Optional: add a slight transition so snapping feels smooth when you release the drag
        transition: 'all 0.15s ease-out',
        cursor: 'pointer'
      }}
    >
      {children}
    </motion.div>
  );
}
