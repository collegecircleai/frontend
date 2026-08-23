'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

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
  const [, forceUpdate] = useState(0);

  // Trigger re-render after mount so refs are available
  useEffect(() => {
    forceUpdate(1);
  }, []);

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ padding: '40px 0 80px' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          overflowX: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: `${gap}px`,
          paddingLeft: '50vw',
          paddingRight: '50vw',
          paddingTop: '20px',
          paddingBottom: '40px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          boxSizing: 'border-box',
        }}
      >
        <style>{`
          .skewed-carousel-container::-webkit-scrollbar { display: none; }
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
  index,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  inactiveScale: number;
  perspective: number;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [transforms, setTransforms] = useState({
    scale: 1,
    rotateY: 0,
    opacity: 1,
    zIndex: 1,
  });

  const updateTransforms = useCallback(() => {
    const container = containerRef.current;
    const item = itemRef.current;
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    const containerCenter = containerRect.left + containerRect.width / 2;
    const itemCenter = itemRect.left + itemRect.width / 2;

    const distance = itemCenter - containerCenter;
    const maxDistance = itemRect.width + 40;

    const normalizedDistance = Math.max(-1, Math.min(1, distance / maxDistance));
    const absNorm = Math.abs(normalizedDistance);

    const newScale = Math.max(inactiveScale, 1 - absNorm * (1 - inactiveScale));
    // Cards on left (negative dist) tilt right (positive rotateY), cards on right tilt left
    const newRotateY = -normalizedDistance * 50;
    const newOpacity = 1 - absNorm * 0.25;
    const newZIndex = Math.round(100 - absNorm * 100);

    setTransforms({
      scale: newScale,
      rotateY: newRotateY,
      opacity: newOpacity,
      zIndex: newZIndex,
    });
  }, [containerRef, inactiveScale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Run immediately
    updateTransforms();

    // Listen to native scroll event on the container element
    container.addEventListener('scroll', updateTransforms, { passive: true });
    window.addEventListener('resize', updateTransforms, { passive: true });

    return () => {
      container.removeEventListener('scroll', updateTransforms);
      window.removeEventListener('resize', updateTransforms);
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
      const scrollTarget = container.scrollLeft + (itemCenter - containerCenter);
      container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
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
        transform: `perspective(${perspective}px) rotateY(${transforms.rotateY}deg) scale(${transforms.scale})`,
        opacity: transforms.opacity,
        zIndex: transforms.zIndex,
        transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
