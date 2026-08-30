'use client';

import { useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import Lenis from 'lenis';

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

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : window.innerHeight
      };
    }
  }, [useWindowScroll]);

  // Measure initial base positions without active transforms to avoid layout thrashing
  const measureBasePositions = useCallback(() => {
    if (!cardsRef.current.length) return;

    if (useWindowScroll) {
      cardBaseTopsRef.current = cardsRef.current.map(card => {
        let top = 0;
        let el: HTMLElement | null = card;
        while (el) {
          top += el.offsetTop;
          el = el.offsetParent as HTMLElement;
        }
        return top;
      });

      const endElement = document.querySelector('.scroll-stack-end') as HTMLElement;
      if (endElement) {
        let top = 0;
        let el: HTMLElement | null = endElement;
        while (el) {
          top += el.offsetTop;
          el = el.offsetParent as HTMLElement;
        }
        endElementTopRef.current = top;
      }
    } else {
      cardBaseTopsRef.current = cardsRef.current.map(card => card.offsetTop);
      const endElement = scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement;
      endElementTopRef.current = endElement ? endElement.offsetTop : 0;
    }
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    const { scrollTop, containerHeight } = getScrollData();
    if (scrollTop === lastScrollTopRef.current) return;
    lastScrollTopRef.current = scrollTop;

    isUpdatingRef.current = true;

    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElementTop = endElementTopRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    let globalTopCardIndex = 0;
    const cardTops = cardBaseTopsRef.current;

    for (let j = 0; j < cardsRef.current.length; j++) {
      const jCardTop = cardTops[j] || 0;
      const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
      if (scrollTop >= jTriggerStart) {
        globalTopCardIndex = j;
      }
    }

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardTops[i] || 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      let opacity = 1;
      if (i < globalTopCardIndex) {
        const depthInStack = globalTopCardIndex - i;
        if (blurAmount && !isMobile) {
          blur = Math.max(0, depthInStack * blurAmount);
        }
        opacity = Math.max(0.3, 1 - depthInStack * 0.25);
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const transform = `translate3d(0, ${Math.round(translateY * 10) / 10}px, 0) scale(${Math.round(scale * 1000) / 1000}) rotate(${rotation}deg)`;
      card.style.transform = transform;
      if (blur > 0) {
        card.style.filter = `blur(${blur}px)`;
      } else if (card.style.filter) {
        card.style.filter = '';
      }
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
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData
  ]);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(updateCardTransforms);
  }, [updateCardTransforms]);

  const setupScrollListener = useCallback(() => {
    if (useWindowScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', measureBasePositions, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', measureBasePositions);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
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
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-top: 5vh !important;
            padding-bottom: 25rem !important;
          }
          .scroll-stack-card {
            padding: 0 !important;
            height: auto !important;
            min-height: 250px !important;
            border-radius: 24px !important;
            margin-top: 16px !important;
            margin-bottom: 40px !important;
          }
          .scroll-stack-card-inner {
            padding: 28px 20px !important;
            border-radius: 24px !important;
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
