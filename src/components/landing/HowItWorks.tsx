'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import CCAILogo from '../brand/CCAILogo'

interface CardData {
  num: string
  title: string
  items: string[]
  accent: string
}

const CARDS: CardData[] = [
  {
    num: '01',
    title: 'UPLOAD',
    items: [
      'Drop your Syllabus PDF',
      'Automatic Topic Extraction',
      'Unit & Subtopic Breakdown'
    ],
    accent: '#4D3FFF'
  },
  {
    num: '02',
    title: 'MAP',
    items: [
      'Smart Knowledge Graph',
      'Visual Learning Roadmaps',
      'Topic Relationship Engine'
    ],
    accent: '#4D3FFF'
  },
  {
    num: '03',
    title: 'LEARN',
    items: [
      'Concept Deep-Dives',
      'Interactive AI Guidance',
      'Self-Paced Mastery Modules'
    ],
    accent: '#4D3FFF'
  },
  {
    num: '04',
    title: 'ADAPT',
    items: [
      'Dynamic Progress Tracking',
      'Weak-Area Diagnostics',
      'Personalized Study Path'
    ],
    accent: '#4D3FFF'
  }
]

// Phase 1: Initial Compact Stack
const STACK_CONFIG = [
  { x: -4, y: 4, r: -1.0, s: 0.94 },
  { x: -1, y: 2, r: -0.5, s: 0.96 },
  { x: 1,  y: -1, r: 0.5, s: 0.98 },
  { x: 4,  y: -2, r: 1.0, s: 1.0 },
]

// Phase 2: In-place Twist & Turn (Shuffled Deck)
const TWIST_STACK_CONFIG = [
  { x: -32, y: 8, r: -11.0, s: 0.94 },
  { x: -11, y: 3, r: -5.5,  s: 0.96 },
  { x: 9,   y: -3, r: 4.5,  s: 0.98 },
  { x: 28,  y: 4,  r: 9.5,  s: 1.0 },
]

// Phase 3: Wide Arc Fan (Scaled for large cards)
const WIDE_FAN_CONFIG = [
  { x: -510, y: 26, r: -13 },
  { x: -170, y: -6, r: -4 },
  { x: 170,  y: -6, r: 4 },
  { x: 510,  y: 26, r: 13 },
]

// Phase 4 & 5: Horizontal Grid Row (Scaled for 315px cards + 28px gaps)
const GRID_CONFIG = [
  { x: -515, y: 0, r: 0 },
  { x: -172, y: 0, r: 0 },
  { x: 172,  y: 0, r: 0 },
  { x: 515,  y: 0, r: 0 },
]

const MOBILE_STEPS = [
  {
    num: '01',
    title: 'Upload your syllabus',
    desc: 'Drop your PDF. We extract every unit, topic, and subtopic instantly.',
    label: 'Upload Interface',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--logo-accent, #6366F1)' }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    )
  },
  {
    num: '02',
    title: 'AI maps everything',
    desc: 'Our engine creates a complete knowledge graph of your entire course.',
    label: 'Knowledge Graph',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--logo-accent, #6366F1)' }}>
        <rect x="9" y="3" width="6" height="5" rx="1" />
        <rect x="3" y="16" width="6" height="5" rx="1" />
        <rect x="15" y="16" width="6" height="5" rx="1" />
        <path d="M12 8v4M6 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      </svg>
    )
  },
  {
    num: '03',
    title: 'Pick any topic, start learning',
    desc: 'Click any topic. Get notes, visuals, quizzes, and practice instantly.',
    label: 'Topic Selection',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--logo-accent, #6366F1)', transform: 'rotate(45deg)' }}>
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    )
  },
  {
    num: '04',
    title: 'The system learns with you',
    desc: 'As you study, we track progress and adapt to your learning style.',
    label: 'Analytics',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--logo-accent, #6366F1)' }}>
        <path d="M3 3v18h18" />
        <path d="M7 16l5-5 4 4 6-8" />
      </svg>
    )
  }
]

export default function HowItWorks() {
  return (
    <>
      {/* Mobile Version (< 768px): Dedicated Clean Vertical Step Workflow */}
      <div className="block md:hidden">
        <HowItWorksMobile />
      </div>

      {/* Desktop / Laptop Version (>= 768px): Untouched 3D Tarot Card Scroll Experience */}
      <div className="hidden md:block">
        <HowItWorksDesktop />
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  MOBILE VERSION: Clean Vertical Step Workflow for Phones           */
/* ------------------------------------------------------------------ */
function HowItWorksMobile() {
  return (
    <section
      id="how-it-works-mobile"
      style={{
        padding: '70px 20px 80px',
        background: 'var(--pearl, #F7F5F0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px', maxWidth: '440px', width: '100%' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--logo-accent, #4D3FFF)',
            letterSpacing: '0.15em',
            marginBottom: '8px',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={12} />
          HOW IT WORKS
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '30px',
            fontWeight: 800,
            color: 'var(--ink, #1a1a2e)',
            lineHeight: 1.2,
            margin: 0
          }}
        >
          We turn your syllabus into<br />
          your <span style={{ color: 'var(--logo-accent, #4D3FFF)', fontStyle: 'italic', fontWeight: 700 }}>entire</span> learning system.
        </h2>
      </div>

      {/* Vertical Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', width: '100%', maxWidth: '440px' }}>
        {MOBILE_STEPS.map((step) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Number & Title */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--logo-accent, #4D3FFF)',
                  letterSpacing: '0.04em'
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--ink, #111827)',
                  lineHeight: 1.25,
                  margin: 0
                }}
              >
                {step.title}
              </h3>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14.5px',
                color: 'var(--mist, #888899)',
                lineHeight: 1.55,
                margin: '0 0 16px 0',
                paddingLeft: '24px'
              }}
            >
              {step.desc}
            </p>

            {/* Mockup Card Box */}
            <div
              style={{
                background: 'var(--hiw-front-bg, rgba(14, 16, 38, 0.7))',
                border: '1px solid var(--hiw-front-border, rgba(123, 112, 255, 0.2))',
                borderRadius: '22px',
                padding: '36px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: 'var(--hiw-front-shadow, 0 12px 30px rgba(0,0,0,0.25))'
              }}
            >
              {step.icon}
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  color: 'var(--mist, #94A3B8)',
                  letterSpacing: '0.01em'
                }}
              >
                {step.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  DESKTOP VERSION: Untouched 3D Pinned Tarot Deck for Laptops       */
/* ------------------------------------------------------------------ */
function HowItWorksDesktop() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [spreadMult, setSpreadMult] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w < 1024) {
        setSpreadMult(0.66)
      } else if (w < 1280) {
        setSpreadMult(0.84)
      } else if (w < 1440) {
        setSpreadMult(0.94)
      } else {
        setSpreadMult(1.0)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  /*
   * 6-STAGE SCROLL TIMELINE:
   * 0.00 -> 0.08: Compact stacked deck
   * 0.08 -> 0.22: In-place twisted turn (Shuffle)
   * 0.22 -> 0.44: Wide Arc spread across screen
   * 0.44 -> 0.68: Staggered 3D Flip (rotateY 0° -> 180°)
   * 0.68 -> 0.88: Full Front Reveal & Reading Hold (aligned grid row)
   * 0.88 -> 1.00: Release into next section
   */
  const timeline = [0, 0.08, 0.22, 0.44, 0.68, 0.88, 1.0]

  // Card 1
  const x1 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[0].x,
    STACK_CONFIG[0].x,
    TWIST_STACK_CONFIG[0].x,
    WIDE_FAN_CONFIG[0].x * spreadMult,
    GRID_CONFIG[0].x * spreadMult,
    GRID_CONFIG[0].x * spreadMult,
    GRID_CONFIG[0].x * spreadMult
  ])
  const y1 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[0].y,
    STACK_CONFIG[0].y,
    TWIST_STACK_CONFIG[0].y,
    WIDE_FAN_CONFIG[0].y * spreadMult,
    0,
    0,
    0
  ])
  const rot1 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[0].r,
    STACK_CONFIG[0].r,
    TWIST_STACK_CONFIG[0].r,
    WIDE_FAN_CONFIG[0].r,
    0,
    0,
    0
  ])
  const flip1 = useTransform(scrollYProgress, [0, 0.44, 0.56, 1.0], [0, 0, 180, 180])

  // Card 2
  const x2 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[1].x,
    STACK_CONFIG[1].x,
    TWIST_STACK_CONFIG[1].x,
    WIDE_FAN_CONFIG[1].x * spreadMult,
    GRID_CONFIG[1].x * spreadMult,
    GRID_CONFIG[1].x * spreadMult,
    GRID_CONFIG[1].x * spreadMult
  ])
  const y2 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[1].y,
    STACK_CONFIG[1].y,
    TWIST_STACK_CONFIG[1].y,
    WIDE_FAN_CONFIG[1].y * spreadMult,
    0,
    0,
    0
  ])
  const rot2 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[1].r,
    STACK_CONFIG[1].r,
    TWIST_STACK_CONFIG[1].r,
    WIDE_FAN_CONFIG[1].r,
    0,
    0,
    0
  ])
  const flip2 = useTransform(scrollYProgress, [0, 0.48, 0.60, 1.0], [0, 0, 180, 180])

  // Card 3
  const x3 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[2].x,
    STACK_CONFIG[2].x,
    TWIST_STACK_CONFIG[2].x,
    WIDE_FAN_CONFIG[2].x * spreadMult,
    GRID_CONFIG[2].x * spreadMult,
    GRID_CONFIG[2].x * spreadMult,
    GRID_CONFIG[2].x * spreadMult
  ])
  const y3 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[2].y,
    STACK_CONFIG[2].y,
    TWIST_STACK_CONFIG[2].y,
    WIDE_FAN_CONFIG[2].y * spreadMult,
    0,
    0,
    0
  ])
  const rot3 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[2].r,
    STACK_CONFIG[2].r,
    TWIST_STACK_CONFIG[2].r,
    WIDE_FAN_CONFIG[2].r,
    0,
    0,
    0
  ])
  const flip3 = useTransform(scrollYProgress, [0, 0.52, 0.64, 1.0], [0, 0, 180, 180])

  // Card 4
  const x4 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[3].x,
    STACK_CONFIG[3].x,
    TWIST_STACK_CONFIG[3].x,
    WIDE_FAN_CONFIG[3].x * spreadMult,
    GRID_CONFIG[3].x * spreadMult,
    GRID_CONFIG[3].x * spreadMult,
    GRID_CONFIG[3].x * spreadMult
  ])
  const y4 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[3].y,
    STACK_CONFIG[3].y,
    TWIST_STACK_CONFIG[3].y,
    WIDE_FAN_CONFIG[3].y * spreadMult,
    0,
    0,
    0
  ])
  const rot4 = useTransform(scrollYProgress, timeline, [
    STACK_CONFIG[3].r,
    STACK_CONFIG[3].r,
    TWIST_STACK_CONFIG[3].r,
    WIDE_FAN_CONFIG[3].r,
    0,
    0,
    0
  ])
  const flip4 = useTransform(scrollYProgress, [0, 0.56, 0.68, 1.0], [0, 0, 180, 180])

  const cardTransforms = [
    { x: x1, y: y1, rotate: rot1, rotateY: flip1, baseScale: STACK_CONFIG[0].s, zIndex: 1 },
    { x: x2, y: y2, rotate: rot2, rotateY: flip2, baseScale: STACK_CONFIG[1].s, zIndex: 2 },
    { x: x3, y: y3, rotate: rot3, rotateY: flip3, baseScale: STACK_CONFIG[2].s, zIndex: 3 },
    { x: x4, y: y4, rotate: rot4, rotateY: flip4, baseScale: STACK_CONFIG[3].s, zIndex: 4 },
  ]

  const cardWidth = 315
  const cardHeight = 440

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      style={{
        position: 'relative',
        height: '300vh',
        background: 'var(--pearl, #F7F5F0)'
      }}
    >
      {/* Pinned Sticky Stage */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '75px',
          paddingBottom: '20px',
          paddingLeft: '16px',
          paddingRight: '16px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Section Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '28px',
            zIndex: 10,
            flexShrink: 0
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--logo-accent, #4D3FFF)',
              letterSpacing: '0.15em',
              marginBottom: '8px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={12} />
            HOW IT WORKS
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3.4vw, 40px)',
              fontWeight: 800,
              color: 'var(--ink, #1a1a2e)',
              lineHeight: 1.2,
              margin: 0,
              maxWidth: '750px'
            }}
          >
            We turn your syllabus into<br />
            your <span style={{ color: 'var(--logo-accent, #4D3FFF)', fontStyle: 'italic', fontWeight: 700 }}>entire</span> learning system.
          </h2>
        </div>

        {/* 3D Canvas */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1440px',
            height: cardHeight + 35,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1600px',
            transformStyle: 'preserve-3d',
            zIndex: 20,
            flexShrink: 0
          }}
        >
          {CARDS.map((card, idx) => (
            <CleanMockupCard
              key={card.num}
              index={idx}
              data={card}
              x={cardTransforms[idx].x}
              y={cardTransforms[idx].y}
              rotate={cardTransforms[idx].rotate}
              rotateY={cardTransforms[idx].rotateY}
              baseScale={cardTransforms[idx].baseScale}
              defaultZIndex={cardTransforms[idx].zIndex}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              isMobile={false}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Double-Sided 3D Card (Clean Tarot Editorial List Front + Blue Back)*/
/* ------------------------------------------------------------------ */
function CleanMockupCard({
  index,
  data,
  x,
  y,
  rotate,
  rotateY,
  baseScale,
  defaultZIndex,
  cardWidth,
  cardHeight,
  isMobile
}: {
  index: number
  data: CardData
  x: MotionValue<number>
  y: MotionValue<number>
  rotate: MotionValue<number>
  rotateY: MotionValue<number>
  baseScale: number
  defaultZIndex: number
  cardWidth: number
  cardHeight: number
  isMobile: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: cardWidth,
        height: cardHeight,
        marginTop: -(cardHeight / 2),
        marginLeft: -(cardWidth / 2),
        x,
        y,
        rotate,
        rotateY,
        scale: isHovered ? (isMobile ? 1.02 : 1.05) : baseScale,
        zIndex: isHovered ? 50 : defaultZIndex,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        cursor: 'pointer',
        willChange: 'transform'
      }}
      transition={{
        scale: { type: 'spring', stiffness: 400, damping: 26 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle Ambient Levitation */}
      <motion.div
        animate={{
          y: [-2.5, 2.5, -2.5],
          rotateZ: [-0.35, 0.35, -0.35]
        }}
        transition={{
          repeat: Infinity,
          duration: 3.8 + index * 0.4,
          ease: 'easeInOut',
          delay: index * 0.2
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* ========================================================= */}
        {/* BACK FACE (Clean Luminous Geometric Emblem Design)         */}
        {/* ========================================================= */}
        <div
          className="tarot-card-back"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '28px',
            background: 'var(--hiw-back-bg, linear-gradient(150deg, #FFFFFF 0%, #F5F7FF 100%))',
            boxShadow: isHovered
              ? 'var(--hiw-back-shadow-hover, 0 32px 80px rgba(43, 27, 245, 0.22))'
              : 'var(--hiw-back-shadow, 0 20px 55px rgba(43, 27, 245, 0.12))',
            border: '1.5px solid var(--hiw-back-border, rgba(77, 63, 255, 0.18))',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          {/* Vector Geometric Accents & Center Emblem */}
          <svg
            viewBox="0 0 280 400"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <defs>
              {/* Radial Center Ambient Glow */}
              <radialGradient id={`centerGlow-${index}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--hiw-back-outer-stroke, #2B1BF5)" stopOpacity="0.16" />
                <stop offset="45%" stopColor="var(--hiw-back-outer-stroke, #4D3FFF)" stopOpacity="0.06" />
                <stop offset="100%" stopColor="var(--hiw-back-outer-stroke, #2B1BF5)" stopOpacity="0" />
              </radialGradient>

              {/* Luxury Geometric Diamond Lattice Pattern */}
              <pattern id={`diamondLattice-${index}`} width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 16 8 L 8 16 L 0 8 Z" fill="none" stroke="var(--hiw-back-lattice-stroke, rgba(77, 63, 255, 0.065))" strokeWidth="0.75" />
                <circle cx="8" cy="8" r="0.8" fill="var(--hiw-back-lattice-dot, rgba(77, 63, 255, 0.18))" />
              </pattern>

              {/* Precise Card Corner Boundary Clip */}
              <clipPath id={`cardClip-${index}`}>
                <rect x="10" y="10" width="260" height="380" rx="18" />
              </clipPath>
            </defs>

            {/* Background Geometric Diamond Lattice Fill */}
            <rect x="10" y="10" width="260" height="380" rx="18" fill={`url(#diamondLattice-${index})`} />

            {/* Clipped Corner Graphics (Guarantees zero bleed / perfect rounded edge finishing) */}
            <g clipPath={`url(#cardClip-${index})`}>
              {/* Top-Left Corner: Solid Royal Blue Wedge & Radii */}
              <path d="M 10 10 L 10 75 A 65 65 0 0 1 75 10 Z" fill="var(--hiw-back-wedge, #2B1BF5)" />
              <path d="M 10 95 A 85 85 0 0 1 95 10" fill="none" stroke="var(--hiw-back-wedge-radii-1, #2B1BF5)" strokeWidth="1.2" />
              <path d="M 10 115 A 105 105 0 0 1 115 10" fill="none" stroke="var(--hiw-back-wedge-radii-2, rgba(77, 63, 255, 0.3))" strokeWidth="0.8" strokeDasharray="2 3" />
              <path d="M 10 135 A 125 125 0 0 1 135 10" fill="none" stroke="var(--hiw-back-wedge-radii-3, rgba(77, 63, 255, 0.18))" strokeWidth="0.8" />
              {/* Top-Left subtle diagonal highlight */}
              <line x1="16" y1="36" x2="36" y2="16" stroke="var(--hiw-back-wedge-highlight, rgba(255,255,255,0.35))" strokeWidth="1.2" />

              {/* Bottom-Right Corner: Solid Royal Blue Wedge & Radii */}
              <path d="M 270 390 L 270 325 A 65 65 0 0 1 205 390 Z" fill="var(--hiw-back-wedge, #2B1BF5)" />
              <path d="M 270 305 A 85 85 0 0 1 185 390" fill="none" stroke="var(--hiw-back-wedge-radii-1, #2B1BF5)" strokeWidth="1.2" />
              <path d="M 270 285 A 105 105 0 0 1 165 390" fill="none" stroke="var(--hiw-back-wedge-radii-2, rgba(77, 63, 255, 0.3))" strokeWidth="0.8" strokeDasharray="2 3" />
              <path d="M 270 265 A 125 125 0 0 1 145 390" fill="none" stroke="var(--hiw-back-wedge-radii-3, rgba(77, 63, 255, 0.18))" strokeWidth="0.8" />
              {/* Bottom-Right subtle diagonal highlight */}
              <line x1="254" y1="374" x2="234" y2="394" stroke="var(--hiw-back-wedge-highlight, rgba(255,255,255,0.35))" strokeWidth="1.2" />

              {/* Top-Right Corner: Emerald Green Arcs */}
              <path d="M 205 10 A 65 65 0 0 1 270 75" fill="none" stroke="var(--hiw-back-emerald-1, #10B981)" strokeWidth="3.5" />
              <path d="M 185 10 A 85 85 0 0 1 270 95" fill="none" stroke="var(--hiw-back-emerald-2, rgba(16, 185, 129, 0.45))" strokeWidth="1.5" />
              <path d="M 165 10 A 105 105 0 0 1 270 115" fill="none" stroke="var(--hiw-back-emerald-3, rgba(77, 63, 255, 0.2))" strokeWidth="0.8" strokeDasharray="2 3" />
              {/* Emerald Accent Corner Dot Trio */}
              <circle cx="248" cy="32" r="2.2" fill="var(--hiw-back-emerald-1, #10B981)" />
              <circle cx="238" cy="42" r="1.8" fill="var(--hiw-back-emerald-1, #10B981)" />
              <circle cx="228" cy="52" r="1.4" fill="var(--hiw-back-emerald-1, #10B981)" />

              {/* Bottom-Left Corner: Emerald Green Arcs */}
              <path d="M 10 325 A 65 65 0 0 1 75 390" fill="none" stroke="var(--hiw-back-emerald-1, #10B981)" strokeWidth="3.5" />
              <path d="M 10 305 A 85 85 0 0 1 95 390" fill="none" stroke="var(--hiw-back-emerald-2, rgba(16, 185, 129, 0.45))" strokeWidth="1.5" />
              <path d="M 10 285 A 105 105 0 0 1 115 390" fill="none" stroke="var(--hiw-back-emerald-3, rgba(77, 63, 255, 0.2))" strokeWidth="0.8" strokeDasharray="2 3" />
              {/* Emerald Accent Corner Dot Trio */}
              <circle cx="32" cy="368" r="2.2" fill="var(--hiw-back-emerald-1, #10B981)" />
              <circle cx="42" cy="358" r="1.8" fill="var(--hiw-back-emerald-1, #10B981)" />
              <circle cx="52" cy="348" r="1.4" fill="var(--hiw-back-emerald-1, #10B981)" />

              {/* Radial Celestial Starburst Rays (from 140, 200) */}
              <g stroke="var(--hiw-back-rays, rgba(77, 63, 255, 0.16))" strokeWidth="0.8" strokeDasharray="4 6">
                {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => (
                  <line
                    key={deg}
                    x1="140"
                    y1="200"
                    x2={140 + 130 * Math.cos((deg * Math.PI) / 180)}
                    y2={200 + 130 * Math.sin((deg * Math.PI) / 180)}
                  />
                ))}
              </g>
            </g>

            {/* Precision Concentric Inset Border Frames */}
            <rect x="10" y="10" width="260" height="380" rx="18" fill="none" stroke="var(--hiw-back-outer-stroke, #2B1BF5)" strokeWidth="2" />
            <rect x="16" y="16" width="248" height="368" rx="12" fill="none" stroke="var(--hiw-back-mid-stroke, rgba(77, 63, 255, 0.25))" strokeWidth="0.8" strokeDasharray="3 3" />
            <rect x="22" y="22" width="236" height="356" rx="8" fill="none" stroke="var(--hiw-back-inner-stroke, rgba(77, 63, 255, 0.12))" strokeWidth="0.8" />

            {/* Center Halo & Emerald Ring */}
            <circle cx="140" cy="200" r="54" fill="var(--hiw-back-halo-fill, #FFFFFF)" stroke="var(--hiw-back-halo-stroke, #10B981)" strokeWidth="2.2" />

            {/* Top & Bottom Micro Heraldic Accents */}
            <g fill="var(--hiw-back-accents, #2B1BF5)" stroke="var(--hiw-back-accents, #2B1BF5)">
              {/* Top Accent */}
              <circle cx="140" cy="30" r="2.5" stroke="none" />
              <line x1="120" y1="30" x2="132" y2="30" strokeWidth="1" />
              <line x1="148" y1="30" x2="160" y2="30" strokeWidth="1" />
              <path d="M 140 22 L 143 25 L 140 28 L 137 25 Z" stroke="none" />

              {/* Bottom Accent */}
              <circle cx="140" cy="370" r="2.5" stroke="none" />
              <line x1="120" y1="370" x2="132" y2="370" strokeWidth="1" />
              <line x1="148" y1="370" x2="160" y2="370" strokeWidth="1" />
              <path d="M 140 372 L 143 375 L 140 378 L 137 375 Z" stroke="none" />
            </g>

            {/* Center Official Logo Vectors - Mathematically Centered at (140, 200) */}
            <g transform="translate(96.3, 154) scale(1.15)">
              <circle cx="32" cy="40" r="28" fill="#4D3FFF" />
              <circle cx="52" cy="32" r="20" fill="white" />
              <circle cx="52" cy="32" r="14" fill="white" />
              <circle cx="52" cy="32" r="9" fill="#00D28E" />
              <circle cx="32" cy="40" r="10" fill="white" />
              <circle cx="52" cy="32" r="4" fill="white" />
            </g>
          </svg>
        </div>

        {/* ========================================================= */}
        {/* FRONT FACE (Editorial Tarot List with Upside-down Foot)   */}
        {/* ========================================================= */}
        <div
          className="tarot-card-face"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '28px',
            background: 'var(--hiw-front-bg, #FFFFFF)',
            border: '1.5px solid var(--hiw-front-border, rgba(0, 0, 0, 0.08))',
            boxShadow: isHovered
              ? 'var(--hiw-front-shadow-hover, 0 32px 80px rgba(0, 0, 0, 0.14))'
              : 'var(--hiw-front-shadow, 0 20px 50px rgba(0, 0, 0, 0.06))',
            padding: isMobile ? '22px 18px' : '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            boxSizing: 'border-box',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
            borderColor: isHovered ? 'var(--hiw-front-border-hover, rgba(77, 63, 255, 0.35))' : 'var(--hiw-front-border, rgba(0, 0, 0, 0.08))'
          }}
        >
          {/* Custom Unique Geometric Watermarks per Card */}
          <CardWatermark index={index} />

          {/* Top Bar: Title + Geometric Letter Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 2
            }}
          >
            <h3
              style={{
                fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: isMobile ? '19px' : '23px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: 'var(--hiw-front-title, #000000)',
                margin: 0,
                textTransform: 'uppercase'
              }}
            >
              {data.title}
            </h3>

            {/* Geometric Cutout Letter Icon */}
            <BlockLetterIcon letter={data.title[0]} />
          </div>

          {/* Middle: 3 Concise Points with Bullet Dots and Dotted Blue Dividers */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              flex: 1,
              padding: isMobile ? '12px 0' : '20px 0',
              zIndex: 2
            }}
          >
            {data.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: isMobile ? '10px' : '15px' }}>
                  <span style={{ color: 'var(--hiw-front-bullet, #4D3FFF)', fontSize: '18px', lineHeight: '1.1', flexShrink: 0, userSelect: 'none' }}>•</span>
                  <span
                    style={{
                      fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: isMobile ? '13.5px' : '17px',
                      fontWeight: 500,
                      color: 'var(--hiw-front-item-text, #111827)',
                      lineHeight: 1.35
                    }}
                  >
                    {item}
                  </span>
                </div>

                {/* Dotted Divider matching reference image 2 */}
                {idx < data.items.length - 1 && (
                  <svg width="100%" height="4" style={{ display: 'block', overflow: 'hidden', opacity: 0.95 }}>
                    <line
                      x1="2"
                      y1="2"
                      x2="100%"
                      y2="2"
                      stroke="var(--hiw-front-divider, #BAC8FF)"
                      strokeWidth="3.2"
                      strokeDasharray="0.001 10.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Bar: Geometric Letter Icon + Upside-Down Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 2
            }}
          >
            {/* Geometric Cutout Letter Icon */}
            <BlockLetterIcon letter={data.title[0]} />

            {/* Upside-down Playing Card / Tarot Title */}
            <span
              style={{
                fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: isMobile ? '19px' : '23px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: 'var(--hiw-front-title, #000000)',
                textTransform: 'uppercase',
                transform: 'rotate(180deg)'
              }}
            >
              {data.title}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Geometric Block Letter Icons (U, M, L, A in stencil/cutout style) */
/* ------------------------------------------------------------------ */
function BlockLetterIcon({ letter }: { letter: string }) {
  switch (letter.toUpperCase()) {
    case 'U':
      return (
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" style={{ display: 'block' }}>
          <rect width="22" height="26" rx="3" fill="var(--hiw-front-stencil-bg, #000000)" />
          <rect x="6.5" y="0" width="9" height="17.5" rx="1" fill="var(--hiw-front-stencil-cutout, #FFFFFF)" />
        </svg>
      )
    case 'M':
      return (
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" style={{ display: 'block' }}>
          <rect width="22" height="26" rx="3" fill="var(--hiw-front-stencil-bg, #000000)" />
          <rect x="5.5" y="8" width="3.5" height="18" fill="var(--hiw-front-stencil-cutout, #FFFFFF)" />
          <rect x="13" y="8" width="3.5" height="18" fill="var(--hiw-front-stencil-cutout, #FFFFFF)" />
          <rect x="9" y="0" width="4" height="5.5" fill="var(--hiw-front-stencil-cutout, #FFFFFF)" />
        </svg>
      )
    case 'L':
      return (
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" style={{ display: 'block' }}>
          <rect width="22" height="26" rx="3" fill="var(--hiw-front-stencil-bg, #000000)" />
          <rect x="7" y="0" width="15" height="18" fill="var(--hiw-front-stencil-cutout, #FFFFFF)" />
        </svg>
      )
    case 'A':
      return (
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" style={{ display: 'block' }}>
          <rect width="22" height="26" rx="3" fill="var(--hiw-front-stencil-bg, #000000)" />
          <rect x="6.5" y="6" width="9" height="5.5" fill="var(--hiw-front-stencil-cutout, #FFFFFF)" />
          <rect x="6.5" y="16" width="9" height="10" fill="var(--hiw-front-stencil-cutout, #FFFFFF)" />
        </svg>
      )
    default:
      return (
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" style={{ display: 'block' }}>
          <rect width="22" height="26" rx="3" fill="var(--hiw-front-stencil-bg, #000000)" />
          <rect x="0" y="8" width="11" height="4" fill="var(--hiw-front-stencil-cutout, #FFFFFF)" />
          <rect x="11" y="14" width="11" height="4" fill="var(--hiw-front-stencil-cutout, #FFFFFF)" />
        </svg>
      )
  }
}

/* ------------------------------------------------------------------ */
/*  Unique Vector Watermarks / Geometric BG for Each Card             */
/* ------------------------------------------------------------------ */
function CardWatermark({ index }: { index: number }) {
  if (index === 0) {
    // 01 UPLOAD: Concentric radar arcs top-left, dot matrix bottom-left
    return (
      <svg viewBox="0 0 280 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {/* Top-Left Concentric Radar Arcs */}
        <path d="M 0 22 A 22 22 0 0 1 22 0" fill="none" stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.2" />
        <path d="M 0 38 A 38 38 0 0 1 38 0" fill="none" stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.2" />
        <path d="M 0 54 A 54 54 0 0 1 54 0" fill="none" stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.2" />
        <path d="M 0 70 A 70 70 0 0 1 70 0" fill="none" stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.2" />
        <path d="M 0 86 A 86 86 0 0 1 86 0" fill="none" stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.2" />
        
        {/* Bottom-Left Dot Matrix */}
        <g fill="var(--hiw-front-watermark-1, #BAC8FF)">
          {[0, 1, 2, 3, 4].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <circle key={`${row}-${col}`} cx={16 + col * 10} cy={285 + row * 10} r="1.4" />
            ))
          )}
        </g>
      </svg>
    )
  }

  if (index === 1) {
    // 02 MAP: Dot grid top-center/right, isometric circuit/hex lines bottom-left
    return (
      <svg viewBox="0 0 280 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {/* Top-Right Dot Grid (positioned safely between MAP and M icon) */}
        <g fill="var(--hiw-front-watermark-1, #BAC8FF)">
          {[0, 1, 2, 3, 4].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <circle key={`${row}-${col}`} cx={155 + col * 11} cy={16 + row * 11} r="1.4" />
            ))
          )}
        </g>

        {/* Bottom-Left Isometric / Angled Contour Lines (wrapping around M icon) */}
        <path d="M -5 295 L 35 295 L 75 335 L 75 405" fill="none" stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.4" />
        <path d="M -5 315 L 25 315 L 55 345 L 55 405" fill="none" stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.4" />
        <path d="M -5 335 L 15 335 L 35 355 L 35 405" fill="none" stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.4" />
      </svg>
    )
  }

  if (index === 2) {
    // 03 LEARN: Isometric diagonal hatching top-left
    return (
      <svg viewBox="0 0 280 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {/* Top-Left Isometric Mesh (tucked cleanly in corner above LEARN) */}
        <g stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.2" fill="none">
          <path d="M 0 0 L 40 24 L 40 44 L 0 20 Z" />
          <path d="M 12 0 L 52 24 L 52 44 L 12 20 Z" />
          <path d="M 0 10 L 52 41" />
          <path d="M 0 0 L 0 20" />
          <path d="M 20 0 L 0 12" />
          <path d="M 40 0 L 0 24" />
        </g>
      </svg>
    )
  }

  // 04 ADAPT (index === 3): Dotted arc top-right, organic topographic elevation lines bottom-right
  return (
    <svg viewBox="0 0 280 400" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {/* Top-Right Dotted Arc (positioned cleanly to curve inside corner without crossing A) */}
      <path d="M 225 0 A 45 45 0 0 0 280 45" fill="none" stroke="var(--hiw-front-watermark-2, #7B8FFF)" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" />
      <path d="M 200 0 A 70 70 0 0 0 280 70" fill="none" stroke="var(--hiw-front-watermark-2, #7B8FFF)" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />

      {/* Bottom-Right Topographic Elevation Curves (nestled in corner below ADAPT) */}
      <g stroke="var(--hiw-front-watermark-1, #BAC8FF)" strokeWidth="1.2" fill="none">
        <path d="M 285 305 C 245 315, 230 345, 235 405" />
        <path d="M 285 325 C 255 332, 242 355, 248 405" />
        <path d="M 285 345 C 265 348, 255 368, 260 405" />
        <path d="M 285 365 C 275 368, 268 380, 272 405" />
        <path d="M 285 285 C 235 298, 215 335, 222 405" />
      </g>
    </svg>
  )
}
