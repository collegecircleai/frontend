'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Builder {
  name: string
  role: string
  description: string
  image?: string
  initials?: string
  frameStyle?: 'arch' | 'pill'
}

const BUILDERS: Builder[] = [
  {
    name: 'Radhey Mohan Gupta (RMG)',
    role: 'FOUNDER & CEO',
    description: 'Building the vision and the product.',
    image: '/team/radhey.jpg',
    initials: 'R',
    frameStyle: 'arch',
  },
  {
    name: 'Samarth',
    role: 'CO-FOUNDER & CTO',
    description: 'Building the technology behind it.',
    image: '/team/samarth.jpg',
    initials: 'S',
    frameStyle: 'arch',
  },
  {
    name: 'Ayotakshi',
    role: 'FOUNDER OFFICE',
    description: 'Working closely with the founder and team to move things forward.',
    image: '/team/ayotakshi.jpg',
    initials: 'A',
    frameStyle: 'pill',
  },
  {
    name: 'Sahil',
    role: 'ENGINEERING',
    description: 'Building the product with the team.',
    image: '/team/sahil.jpg',
    initials: 'S',
    frameStyle: 'pill',
  },
  {
    name: 'Richard',
    role: 'TECH BUILDER',
    description: 'Building and improving the product.',
    image: '/team/richard.jpg',
    initials: 'R',
    frameStyle: 'arch',
  },
  {
    name: 'Bikash',
    role: 'TECH CO-BUILDER',
    description: 'Working across technology and product.',
    image: '/team/bikash.jpg',
    initials: 'B',
    frameStyle: 'pill',
  },
  {
    name: 'Praveen',
    role: 'GROWTH',
    description: 'Helping more students discover College Circle AI.',
    image: '/team/praveen.jpg',
    initials: 'P',
    frameStyle: 'arch',
  },
  {
    name: 'Riya',
    role: 'GROWTH & FINANCE',
    description: 'Working across growth and finance.',
    image: '/team/riya.png',
    initials: 'R',
    frameStyle: 'pill',
  },
  {
    name: 'Manasvi',
    role: 'FOUNDER OFFICE',
    description: 'Helping turn plans into action.',
    image: '/team/manasvi.jpg',
    initials: 'M',
    frameStyle: 'arch',
  },
  {
    name: 'Maitree',
    role: 'MARKETING',
    description: 'Building our presence among students.',
    image: '/team/maitree.jpg',
    initials: 'M',
    frameStyle: 'pill',
  },
  {
    name: 'Jahnavi',
    role: 'OPERATIONS',
    description: 'Keeping things moving and organised.',
    image: '/team/jahnavi.jpg',
    initials: 'J',
    frameStyle: 'arch',
  },
  {
    name: 'Amulya',
    role: 'PEOPLE & CULTURE',
    description: 'Helping build a team where people can learn and grow.',
    image: '/team/amulya.jpg',
    initials: 'A',
    frameStyle: 'pill',
  },
]

export default function Builders() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [maxScrollDistance, setMaxScrollDistance] = useState(0)

  // Measure track scroll length on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (trackRef.current) {
        const totalWidth = trackRef.current.scrollWidth
        const viewportWidth = window.innerWidth
        // calculate how far the track must translate to reveal every card
        setMaxScrollDistance(Math.max(0, totalWidth - viewportWidth + 120))
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Hook into window vertical scroll over this pinned section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Smooth out scroll progression
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  })

  // Map 0 -> 1 progress to 0px -> -maxScrollDistance
  const x = useTransform(smoothProgress, [0, 1], [0, -maxScrollDistance])

  return (
    <section
      id="builders"
      ref={sectionRef}
      className="builders-scroll-wrapper"
      style={{
        position: 'relative',
        height: '340vh', // 3.4 screens tall: user scrolls vertically and drives the horizontal team showcase
      }}
    >
      <style jsx global>{`
        .builders-sticky-container {
          position: sticky;
          top: clamp(104px, 12.5vh, 120px);
          height: calc(100vh - clamp(104px, 12.5vh, 120px));
          width: 100%;
          display: flex;
          flex-direction: column;
          justifyContent: flex-start;
          overflow: hidden;
          background-color: transparent;
          padding-top: clamp(14px, 2vh, 24px);
          padding-bottom: clamp(12px, 2vh, 28px);
          box-sizing: border-box;
        }

        .builders-tag {
          font-family: var(--font-body), sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(90, 85, 105, 0.85);
          font-weight: 600;
          margin-bottom: 8px;
        }
        [data-theme='dark'] .builders-tag {
          color: rgba(185, 175, 235, 0.85);
        }

        .builders-main-heading {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-weight: 400;
          font-size: clamp(23px, 2.5vw, 36px);
          line-height: 1.15;
          letter-spacing: -0.015em;
          color: #1a1a22;
          margin: 0 0 8px 0;
        }
        [data-theme='dark'] .builders-main-heading {
          color: #faf8f5;
          text-shadow: 0 2px 24px rgba(255, 255, 255, 0.05);
        }

        .builders-intro-p {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: clamp(13.5px, 1.05vw, 16.5px);
          font-weight: 400;
          line-height: 1.45;
          color: rgba(26, 26, 34, 0.82);
          max-width: 780px;
          margin: 0 0 4px 0;
        }
        [data-theme='dark'] .builders-intro-p {
          color: rgba(230, 226, 242, 0.84);
        }

        .builders-sub-tagline {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: clamp(14.5px, 1.1vw, 18px);
          font-style: italic;
          font-weight: 400;
          color: #5b4af7;
        }
        [data-theme='dark'] .builders-sub-tagline {
          color: #a59bff;
        }

        /* Progress line indicator */
        .builders-progress-track {
          width: 140px;
          height: 3px;
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.08);
          overflow: hidden;
          position: relative;
        }
        [data-theme='dark'] .builders-progress-track {
          background: rgba(255, 255, 255, 0.1);
        }
        .builders-progress-bar {
          height: 100%;
          background: var(--violet, #5b4af7);
          border-radius: 2px;
          transform-origin: left center;
        }

        /* Card Track: Generous breathing room between builder portraits */
        .builders-track {
          display: flex;
          align-items: flex-start;
          gap: clamp(36px, 3.8vw, 54px);
          padding: clamp(14px, 2vh, 24px) clamp(24px, 6vw, 96px) 12px;
          will-change: transform;
          margin-top: auto;
          margin-bottom: auto;
        }

        /* Builder Card Base */
        .builder-card {
          flex: 0 0 clamp(190px, 16vw, 228px);
          display: flex;
          flex-direction: column;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Subtle Staggered Rhythm (Alternating Up & Down) */
        .builder-card-up {
          margin-top: 0px;
        }
        .builder-card-down {
          margin-top: clamp(14px, 2.2vh, 24px);
        }

        .builder-card:hover {
          transform: translateY(-8px);
        }

        /* Photo Box */
        .builder-photo-box {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 4.7;
          overflow: hidden;
          background: #ebe6db;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 34px -10px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.07);
          transition: border-color 0.35s ease, box-shadow 0.35s ease;
        }

        /* Modern Architectural Rounded Squircle Framing (Applied to all builders) */
        .builder-photo-box {
          border-radius: 32px;
        }
        .frame-arch,
        .frame-pill {
          border-radius: 32px;
        }

        [data-theme='dark'] .builder-photo-box {
          background: #171625;
          box-shadow: 0 16px 42px -10px rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .builder-card:hover .builder-photo-box {
          box-shadow: 0 20px 48px -10px rgba(91, 74, 247, 0.22);
          border-color: rgba(91, 74, 247, 0.4);
        }
        [data-theme='dark'] .builder-card:hover .builder-photo-box {
          box-shadow: 0 22px 52px -10px rgba(0, 0, 0, 0.85), 0 0 28px rgba(165, 155, 255, 0.25);
          border-color: rgba(165, 155, 255, 0.45);
        }

        /* Watermark Monogram */
        .builder-initial-watermark {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: 96px;
          font-weight: 300;
          font-style: italic;
          color: rgba(80, 75, 95, 0.28);
          user-select: none;
          line-height: 1;
        }
        [data-theme='dark'] .builder-initial-watermark {
          color: rgba(220, 215, 245, 0.24);
        }

        /* Typography */
        .builder-name {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: 20px;
          font-weight: 500;
          color: #1a1a24;
          margin: 0 0 4px 0;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }
        [data-theme='dark'] .builder-name {
          color: #FAF8F5;
        }

        .builder-role {
          font-family: var(--font-body), sans-serif;
          font-size: 9.5px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          color: #5b4af7;
          margin-bottom: 6px;
        }
        [data-theme='dark'] .builder-role {
          color: #a297ff;
        }

        .builder-desc {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: 14.5px;
          line-height: 1.45;
          color: rgba(26, 26, 36, 0.72);
          margin: 0;
        }
        [data-theme='dark'] .builder-desc {
          color: rgba(225, 222, 238, 0.76);
        }

        .builders-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        .builders-scroll-indicator {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        @media (max-width: 768px) {
          .builders-scroll-wrapper {
            height: 320vh !important;
            padding-top: 0 !important;
          }
          .builders-sticky-container {
            position: sticky !important;
            top: 86px !important;
            height: calc(100vh - 86px) !important;
            padding-top: 10px !important;
            padding-bottom: 12px !important;
            justifyContent: flex-start !important;
            overflow: hidden !important;
          }
          .builders-main-heading {
            font-size: 23px !important;
            line-height: 1.18 !important;
            margin-bottom: 6px !important;
          }
          .builders-intro-p {
            font-size: 13px !important;
            line-height: 1.4 !important;
            margin-bottom: 4px !important;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .builders-sub-tagline {
            font-size: 14px !important;
            margin-bottom: 0 !important;
          }
          .builders-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
          .builders-scroll-indicator {
            align-items: flex-start !important;
            width: 100% !important;
            margin-top: 2px !important;
          }
          .builders-track {
            padding: 10px 16px 8px !important;
            gap: 20px !important;
            margin-top: auto !important;
            margin-bottom: auto !important;
          }
          .builder-card {
            flex: 0 0 170px !important;
          }
          .builder-card-down {
            margin-top: 14px !important;
          }
          .builder-photo-box {
            border-radius: 26px !important;
            margin-bottom: 8px !important;
          }
          .builder-name {
            font-size: 16px !important;
            margin-bottom: 2px !important;
          }
          .builder-role {
            font-size: 8.5px !important;
            margin-bottom: 4px !important;
          }
          .builder-desc {
            font-size: 12.5px !important;
            line-height: 1.35 !important;
          }
        }
      `}</style>

      {/* Pinned Viewport Container */}
      <div className="builders-sticky-container">
        {/* Header content pinned on top */}
        <div style={{ maxWidth: '1320px', width: '100%', margin: '0 auto', padding: '0 clamp(24px, 6vw, 96px)' }}>
          <div className="builders-header-row">
            <div>
              <div className="builders-tag">The Builders</div>
              <h2 className="builders-main-heading">
                Different people. One thing we’re building together.
              </h2>
              <p className="builders-intro-p">
                College Circle AI is still being built. Different people bring different strengths — technology, growth, operations, marketing, finance and people. What connects us is the problem we want to solve and the curiosity to keep building.
              </p>
              <div className="builders-sub-tagline">
                We’re building together.
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="builders-scroll-indicator">
              <span
                style={{
                  fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: 'rgba(90, 85, 105, 0.7)',
                }}
              >
                Scroll down to meet the team &rarr;
              </span>
              <div className="builders-progress-track">
                <motion.div
                  className="builders-progress-bar"
                  style={{ scaleX: smoothProgress }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Staggered Carousel driven automatically by downward scroll */}
        <motion.div
          ref={trackRef}
          className="builders-track"
          style={{ x }}
        >
          {BUILDERS.map((builder, idx) => {
            const isStaggeredDown = idx % 2 === 1
            const frameClass = builder.frameStyle === 'arch' ? 'frame-arch' : 'frame-pill'

            return (
              <div
                key={builder.name}
                className={`builder-card ${isStaggeredDown ? 'builder-card-down' : 'builder-card-up'}`}
              >
                {/* Photo Box with Architectural Framing */}
                <div className={`builder-photo-box ${frameClass}`}>
                  {builder.image ? (
                    <Image
                      src={builder.image}
                      alt={builder.name}
                      fill
                      sizes="270px"
                      style={{ objectFit: 'cover' }}
                      priority={idx < 4}
                    />
                  ) : (
                    <div className="builder-initial-watermark">
                      {builder.initials || builder.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Information */}
                <h3 className="builder-name">{builder.name}</h3>
                <div className="builder-role">{builder.role}</div>
                <p className="builder-desc">{builder.description}</p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
