'use client';

import React, { useRef, useEffect, useCallback } from 'react';

export interface SkewedCarouselProps {
  children: React.ReactNode[];
  perspective?: number;
  inactiveScale?: number;
  gap?: number;
  className?: string;
}

export function SkewedCarousel({
  children,
  perspective = 1400,
  inactiveScale = 0.85,
  gap = 24,
  className = ''
}: SkewedCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative w-full ${className}`} style={{ padding: '40px 0 80px' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          overflowX: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: `${gap}px`,
          paddingLeft: 'calc(50% - clamp(140px, 40vw, 170px))',
          paddingRight: 'calc(50% - clamp(140px, 40vw, 170px))',
          paddingTop: '60px',
          paddingBottom: '80px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          boxSizing: 'border-box',
        }}
      >
        <style>{`
          .skewed-carousel-wrap::-webkit-scrollbar { display: none; }
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
      </div>
    </div>
  );
}

function CarouselItem({
  children,
  containerRef,
  inactiveScale,
  perspective,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  inactiveScale: number;
  perspective: number;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  const updateTransforms = useCallback(() => {
    const container = containerRef.current;
    const item = itemRef.current;
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const containerCenter = containerRect.left + containerRect.width / 2;
    const itemCenter = itemRect.left + itemRect.width / 2;
    const distance = itemCenter - containerCenter;
    const maxDistance = item.offsetWidth + 40;
    const norm = Math.max(-1, Math.min(1, distance / maxDistance));
    const absNorm = Math.abs(norm);

    const maxScale = 1.08;
    const scale = Math.max(inactiveScale, maxScale - absNorm * (maxScale - inactiveScale));
    const rotateY = -norm * 50;
    const opacity = 1 - absNorm * 0.25;
    const zIndex = Math.round(100 - absNorm * 100);

    // Apply transforms directly to the DOM to bypass React re-renders for 60fps performance
    item.style.transform = `perspective(${perspective}px) rotateY(${rotateY}deg) scale(${scale})`;
    item.style.opacity = opacity.toString();
    item.style.zIndex = zIndex.toString();
  }, [containerRef, inactiveScale, perspective]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Run on mount
    requestAnimationFrame(updateTransforms);

    // Use requestAnimationFrame loop on scroll for butter-smooth performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTransforms();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [updateTransforms]);

  const handleClickCapture = (e: React.MouseEvent) => {
    const container = containerRef.current;
    const item = itemRef.current;
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const itemCenter = itemRect.left + itemRect.width / 2;

    if (Math.abs(itemCenter - containerCenter) > 50) {
      e.preventDefault();
      e.stopPropagation();
      container.scrollTo({
        left: container.scrollLeft + (itemCenter - containerCenter),
        behavior: 'smooth',
      });
    }
  };

  return (
    <div 
      ref={itemRef} 
      onClickCapture={handleClickCapture} 
      style={{
        flexShrink: 0,
        scrollSnapAlign: 'center',
        cursor: 'pointer',
        willChange: 'transform',
        // Removed transition: 'transform...' as it fights with the scroll event and causes shivering
      }}
    >
      {children}
    </div>
  );
}
