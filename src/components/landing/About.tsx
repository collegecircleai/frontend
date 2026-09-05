'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import LearningCycle from './LearningCycle'

interface AboutProps {
  imageSrc?: string
  darkImageSrc?: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
}

const About = memo(function About({
  imageSrc = '/about-illustration.jpg',
  darkImageSrc = '/about-illustration-dark.png',
}: AboutProps) {
  return (
    <section
      id="about"
      className="about-page-bg"
      style={{
        position: 'relative',
        padding: 'clamp(28px, 4vw, 48px) clamp(24px, 6vw, 96px) clamp(64px, 8vw, 100px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
        }}
      >
        {/* Main 2-column layout */}
        <div
          className="responsive-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.18fr)',
            gap: 'clamp(36px, 5vw, 72px)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Narrative Content */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={fadeIn}
            viewport={{ once: true, margin: '-60px' }}
          >
            {/* Tag */}
            <div
              style={{
                fontFamily: "var(--font-body), 'EB Garamond', Georgia, serif",
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--violet, #4D3FFF)',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              About
            </div>

            {/* Main Headline */}
            <h1
              className="about-headline"
              style={{
                fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
                fontSize: 'clamp(38px, 4.4vw, 62px)',
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
                margin: '0 0 16px 0',
                fontWeight: 400,
              }}
            >
              Every student learns{' '}
              <span
                className="about-highlight-differently"
                style={{
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                differently.
              </span>
            </h1>

            {/* Secondary Italic Line */}
            <p
              className="about-subheadline"
              style={{
                fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
                fontSize: 'clamp(21px, 1.9vw, 27px)',
                fontStyle: 'italic',
                lineHeight: 1.35,
                margin: '0 0 32px 0',
                fontWeight: 400,
              }}
            >
              Education should be able to understand that.
            </p>

            {/* Narrative Body Blocks */}
            <div
              className="about-body-flow"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
                fontSize: 'clamp(18px, 1.25vw, 21.5px)',
                lineHeight: 1.6,
                maxWidth: '560px',
              }}
            >
              <p style={{ margin: 0 }}>
                One student understands a concept in class.
              </p>
              <p style={{ margin: 0 }}>
                Another needs to hear it twice.
              </p>
              <p style={{ margin: 0 }}>
                Someone else goes home, revises at midnight, asks a question, practises again — and only then does it click.
              </p>

              {/* Callout quote */}
              <div className="about-callout-card">
                The classroom moves at one pace. Learning doesn’t.
              </div>

              <p style={{ margin: '8px 0 0 0' }}>
                Teachers do everything they can, but no teacher can personally track every question, every gap, every attempt and every change in learning across a room full of students.
              </p>

              <p
                className="about-strong-text"
                style={{
                  margin: '4px 0 0 0',
                  fontSize: 'clamp(19px, 1.3vw, 22.5px)',
                }}
              >
                That is the space we are building for.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Artwork / Interactive Graphic */}
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={fadeIn}
            viewport={{ once: true, margin: '-60px' }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {imageSrc ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '680px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: 'translateY(clamp(-24px, -2vw, 0px))',
                }}
              >
                {/* Clean, seamless illustration container */}
                <div
                  className="about-illustration-box"
                  style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'transparent',
                  }}
                >
                  {/* Light mode artwork */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt="Every student learns differently illustration - CC>AI Light"
                    className="about-img-light"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />

                  {/* Dark mode artwork */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={darkImageSrc}
                    alt="Every student learns differently illustration - CC>AI Dark"
                    className="about-img-dark"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Blank Image Container Slot */
              <div
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  minHeight: '440px',
                  borderRadius: '28px',
                  border: '2px dashed var(--violet)',
                  background:
                    'linear-gradient(145deg, rgba(77, 63, 255, 0.03) 0%, rgba(0, 200, 150, 0.03) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 24px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Subtle decorative background watermark */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, rgba(77, 63, 255, 0.08) 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                    pointerEvents: 'none',
                    opacity: 0.7,
                  }}
                />

                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'rgba(77, 63, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--violet)',
                    marginBottom: '18px',
                    zIndex: 1,
                  }}
                >
                  <ImageIcon size={30} strokeWidth={1.75} />
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: 'var(--violet)',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    zIndex: 1,
                  }}
                >
                  Artwork Slot
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--mist)',
                    textAlign: 'center',
                    maxWidth: '300px',
                    margin: 0,
                    zIndex: 1,
                  }}
                >
                  Image container ready. Pass your illustration here.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Full-width Narrative Expansion */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={fadeIn}
          viewport={{ once: true, margin: '-40px' }}
          style={{
            marginTop: 'clamp(52px, 6.5vw, 80px)',
            maxWidth: '100%',
          }}
        >
          <p
            className="about-body-flow"
            style={{
              fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
              fontSize: 'clamp(19px, 1.45vw, 23.5px)',
              lineHeight: 1.74,
              margin: '0 0 26px 0',
              maxWidth: '100%',
            }}
          >
            <strong className="about-strong-text">
              College Circle AI is building personalized learning around the
              learner.
            </strong>{' '}
            We connect a student's syllabus, classroom, questions, learning
            activity and progress to build a deeper picture of how they are
            learning.
          </p>

          <p
            className="about-strong-text"
            style={{
              fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
              fontSize: 'clamp(21px, 1.7vw, 26px)',
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            AI is the foundation. <br />
            The learner stays at the centre.
          </p>
        </motion.div>

        {/* Bottom Centered Philosophy Banner */}
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={fadeIn}
          viewport={{ once: true, margin: '-40px' }}
          className="about-divider-line"
          style={{
            marginTop: 'clamp(64px, 8vw, 100px)',
            paddingTop: '48px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p
            className="about-philosophy-lead"
            style={{
              fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
              fontSize: 'clamp(22px, 2.6vw, 32px)',
              fontWeight: 400,
              margin: '0 0 8px 0',
              lineHeight: 1.3,
            }}
          >
            Because every learner has a different path.
          </p>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <p
              className="about-philosophy-core"
              style={{
                fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
                fontSize: 'clamp(24px, 3.1vw, 38px)',
                fontStyle: 'italic',
                fontWeight: 400,
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              We're building the intelligence to understand it.
            </p>

            {/* Hand-drawn style teal/mint accent underline */}
            <svg
              className="about-teal-underline"
              viewBox="0 0 360 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '420px',
                height: '12px',
                margin: '6px auto 0',
                transition: 'filter 0.3s ease',
              }}
            >
              <path
                d="M4 10C80 3.5 240 2 356 9"
                stroke="var(--jade)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* Cyclical Learning Workflow Diagram */}
        <LearningCycle />
      </div>
    </section>
  )
})

export default About

