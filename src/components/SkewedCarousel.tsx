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
  // Start with identity transforms to avoid SSR/CSR mismatch
  const [style, setStyle] = useState<React.CSSProperties>({
    flexShrink: 0,
    scrollSnapAlign: 'center',
    cursor: 'pointer',
    willChange: 'transform',
    transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
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
    const norm = Math.max(-1, Math.min(1, distance / maxDistance));
    const absNorm = Math.abs(norm);

    const scale = Math.max(inactiveScale, 1 - absNorm * (1 - inactiveScale));
    const rotateY = -norm * 50;
    const opacity = 1 - absNorm * 0.25;
    const zIndex = Math.round(100 - absNorm * 100);

    setStyle({
      flexShrink: 0,
      scrollSnapAlign: 'center',
      cursor: 'pointer',
      willChange: 'transform',
      transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
      transform: `perspective(${perspective}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    });
  }, [containerRef, inactiveScale, perspective]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateTransforms();

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
      container.scrollTo({
        left: container.scrollLeft + (itemCenter - containerCenter),
        behavior: 'smooth',
      });
    }
  };

  return (
    <div ref={itemRef} onClickCapture={handleClickCapture} style={style}>
      {children}
    </div>
  );
}
