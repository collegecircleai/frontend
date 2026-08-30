'use client';

import { useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import Lenis from 'lenis';
import { useLenis } from 'lenis/react';

export const ScrollStackItem = ({ children, itemClassName = '' }: { children: React.ReactNode; itemClassName?: string }) => (
  <div
    className={`scroll-stack-card relative w-full h-[272px] my-8 p-12 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}: {
  children: React.ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<any>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardBaseTopsRef = useRef<number[]>([]);
  const endElementTopRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(-1);
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const measureBasePositions = useCallback(() => {
    if (!cardsRef.current.length || !scrollerRef.current) return;

    if (useWindowScroll) {
      const containerRect = scrollerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top + window.scrollY;

      cardBaseTopsRef.current = cardsRef.current.map(card => containerTop + card.offsetTop);

      const endElement = document.querySelector('.scroll-stack-end') as HTMLElement;
      if (endElement) {
        endElementTopRef.current = containerTop + endElement.offsetTop;
      }
    } else {
      cardBaseTopsRef.current = cardsRef.current.map(card => card.offsetTop);
      const endElement = scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement;
      endElementTopRef.current = endElement ? endElement.offsetTop : 0;
    }
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback((explicitScrollTop?: number) => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const containerHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const scrollTop = typeof explicitScrollTop === 'number' 
      ? explicitScrollTop 
      : (useWindowScroll ? window.scrollY : (scrollerRef.current?.scrollTop || 0));

    if (Math.abs(scrollTop - lastScrollTopRef.current) < 0.05) return;
    lastScrollTopRef.current = scrollTop;

    isUpdatingRef.current = true;

    const currentStackPos = isMobile ? '14%' : stackPosition;
    const currentScaleEnd = isMobile ? '8%' : scaleEndPosition;
    const currentStackDistance = isMobile ? 22 : itemStackDistance;
    const currentBaseScale = isMobile ? 0.88 : baseScale;
    const currentItemScale = isMobile ? 0.03 : itemScale;

    const stackPositionPx = parsePercentage(currentStackPos, containerHeight);
    const scaleEndPositionPx = parsePercentage(currentScaleEnd, containerHeight);
    const endElementTop = endElementTopRef.current;

    let globalTopCardIndex = 0;
    const cardTops = cardBaseTopsRef.current;

    for (let j = 0; j < cardsRef.current.length; j++) {
      const jCardTop = cardTops[j] || 0;
      const jTriggerStart = jCardTop - stackPositionPx - currentStackDistance * j;
      if (scrollTop >= jTriggerStart) {
        globalTopCardIndex = j;
      }
    }

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardTops[i] || 0;
      const triggerStart = cardTop - stackPositionPx - currentStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = currentBaseScale + i * currentItemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let opacity = 1;
      if (i < globalTopCardIndex) {
        const depthInStack = globalTopCardIndex - i;
        opacity = Math.max(0.4, 1 - depthInStack * 0.2);
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + currentStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + currentStackDistance * i;
      }

      const transform = `translate3d(0, ${Math.round(translateY * 10) / 10}px, 0) scale(${Math.round(scale * 1000) / 1000}) rotate(${rotation}deg)`;
      card.style.transform = transform;
      card.style.opacity = String(opacity);

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    useWindowScroll
  ]);

  // Connect smoothly to global Lenis smooth scrolling
  useLenis((lenisInstance) => {
    if (useWindowScroll && lenisInstance) {
      updateCardTransforms(lenisInstance.scroll);
    }
  });

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupScrollListener = useCallback(() => {
    if (useWindowScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', measureBasePositions, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', measureBasePositions);
      };
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return () => {};

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      
      return () => {
        lenis.destroy();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [handleScroll, useWindowScroll, measureBasePositions]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];

    cardsRef.current = cards;

    cards.forEach((card, i) => {
      card.style.zIndex = String(10 + i);
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, opacity';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      (card.style as any).webkitTransform = 'translateZ(0)';
    });

    measureBasePositions();
    const cleanupScroll = setupScrollListener();
    updateCardTransforms();

    return () => {
      cleanupScroll();
      stackCompletedRef.current = false;
      cardsRef.current = [];
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    useWindowScroll,
    setupScrollListener,
    updateCardTransforms,
    measureBasePositions
  ]);

  // Container styles based on scroll mode
  const containerStyles: React.CSSProperties = useWindowScroll
    ? {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)'
      }
    : {
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'scroll-position'
      };

  const containerClassName = useWindowScroll
    ? `relative w-full ${className}`.trim()
    : `relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim();

  return (
    <div className={containerClassName} ref={scrollerRef} style={containerStyles}>
      <style>{`
        @media (max-width: 768px) {
          .scroll-stack-inner {
            padding-left: 12px !important;
            padding-right: 12px !important;
            padding-top: 6vh !important;
            padding-bottom: 25rem !important;
          }
          .scroll-stack-card {
            padding: 0 !important;
            height: auto !important;
            min-height: 240px !important;
            border-radius: 24px !important;
            margin-top: 0 !important;
            margin-bottom: 70px !important;
            box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.35) !important;
          }
          .scroll-stack-card-inner {
            padding: 26px 20px !important;
            border-radius: 24px !important;
            min-height: 240px !important;
          }
        }
      `}</style>
      <div className="scroll-stack-inner pt-[20vh] px-20 pb-[50rem] min-h-screen">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
