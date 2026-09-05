'use client'

import React from 'react'
import { motion } from 'framer-motion'

// 7 core stages forming a natural, self-sustaining loop from LEARN to RECOMMEND back to LEARN
const STAGES = [
  { id: 'learn', label: 'LEARN' },
  { id: 'ask', label: 'ASK' },
  { id: 'practise', label: 'PRACTISE' },
  { id: 'track', label: 'TRACK' },
  { id: 'understand', label: 'UNDERSTAND' },
  { id: 'personalize', label: 'PERSONALIZE' },
  { id: 'recommend', label: 'RECOMMEND' },
]

export default function LearningCycle() {
  return (
    <section
      className="learning-cycle-section"
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(48px, 6vw, 90px) clamp(16px, 4vw, 40px)',
        overflow: 'hidden',
      }}
    >
      <style jsx global>{`
        .learning-cycle-container {
          max-width: 1040px;
          margin: 0 auto;
          position: relative;
        }

        /* Ambient subtle background glow */
        .learning-cycle-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 540px;
          height: 380px;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(
            circle at center,
            rgba(139, 128, 249, 0.08) 0%,
            rgba(139, 128, 249, 0.02) 50%,
            transparent 70%
          );
          filter: blur(40px);
          transition: all 0.3s ease;
        }

        [data-theme='dark'] .learning-cycle-glow {
          background: radial-gradient(
            circle at center,
            rgba(165, 155, 255, 0.16) 0%,
            rgba(139, 128, 249, 0.04) 50%,
            transparent 75%
          );
          filter: blur(55px);
        }

        /* Continuous subtle organic arc line */
        .cycle-arc-path {
          stroke: rgba(130, 118, 215, 0.5);
          transition: stroke 0.3s ease, filter 0.3s ease;
        }

        [data-theme='dark'] .cycle-arc-path {
          stroke: #d0c7fc;
          filter: drop-shadow(0 0 5px rgba(208, 199, 252, 0.4));
        }

        /* Node Text Styling */
        .cycle-node-text {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: #1a1a24;
          transition: color 0.3s ease, transform 0.2s ease, text-shadow 0.3s ease;
          user-select: none;
          white-space: nowrap;
        }

        [data-theme='dark'] .cycle-node-text {
          color: #f3effc;
          text-shadow: 0 0 16px rgba(255, 255, 255, 0.12);
        }

        .cycle-node-card:hover .cycle-node-text {
          color: #6b52f5;
        }

        [data-theme='dark'] .cycle-node-card:hover .cycle-node-text {
          color: #ded7ff;
          text-shadow: 0 0 20px rgba(200, 189, 252, 0.7);
        }

        /* Center Mark Box */
        .cycle-center-box {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          text-decoration: none;
        }

        .cycle-center-mark {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          width: auto;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-theme='dark'] .cycle-center-mark {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        .cycle-center-mark:hover {
          transform: scale(1.1);
        }

        [data-theme='dark'] .cycle-center-mark:hover {
          transform: scale(1.1);
        }

        /* Responsive Switch */
        @media (max-width: 740px) {
          .desktop-orbital-layout {
            display: none !important;
          }
          .mobile-cyclic-layout {
            display: flex !important;
          }
        }

        @media (min-width: 741px) {
          .desktop-orbital-layout {
            display: block !important;
          }
          .mobile-cyclic-layout {
            display: none !important;
          }
        }
      `}</style>

      <div className="learning-cycle-container">
        <div className="learning-cycle-glow" />

        {/* ════════════ DESKTOP ORBITAL VIEW ════════════ */}
        <motion.div
          className="desktop-orbital-layout"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1.75 / 1',
            minHeight: '440px',
            maxHeight: '560px',
          }}
        >
          {/* SVG Orbit with 7 organic curved connecting strokes - NO ARROWHEADS */}
          {/* Sized and curved specifically so lines stop gracefully before each word */}
          <svg
            viewBox="0 0 960 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            {/* Arc 1: LEARN (right edge ~540, 52) -> ASK (left edge ~720, 115) */}
            <motion.path
              d="M 550 56 C 620 58, 685 78, 715 102"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              className="cycle-arc-path"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
            />

            {/* Arc 2: ASK (bottom-right edge ~770, 142) -> PRACTISE (top edge ~860, 245) */}
            <motion.path
              d="M 770 142 C 825 172, 855 205, 862 245"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              className="cycle-arc-path"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
            />

            {/* Arc 3: PRACTISE (bottom edge ~862, 305) -> TRACK (top-right edge ~760, 410) */}
            <motion.path
              d="M 860 305 C 850 350, 820 388, 770 412"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              className="cycle-arc-path"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3 }}
            />

            {/* Arc 4: TRACK (bottom-left edge ~690, 448) -> UNDERSTAND (right edge ~585, 508) */}
            <motion.path
              d="M 685 450 C 660 475, 625 498, 585 508"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              className="cycle-arc-path"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.4 }}
            />

            {/* Arc 5: UNDERSTAND (left edge ~375, 508) -> PERSONALIZE (bottom-right edge ~285, 448) */}
            <motion.path
              d="M 375 508 C 335 498, 300 475, 275 450"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              className="cycle-arc-path"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.5 }}
            />

            {/* Arc 6: PERSONALIZE (top-left edge ~190, 412) -> RECOMMEND (bottom edge ~100, 305) */}
            <motion.path
              d="M 190 412 C 140 388, 110 350, 100 305"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              className="cycle-arc-path"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.6 }}
            />

            {/* Arc 7: Complete the loop! RECOMMEND (top edge ~98, 245) -> LEARN (left edge ~410, 52) */}
            <motion.path
              d="M 102 245 C 115 170, 175 105, 410 54"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              className="cycle-arc-path"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.7 }}
            />
          </svg>

          {/* Center Mark: Standalone Pure College Circle AI Icon Mark */}
          <div className="cycle-center-box">
            <motion.div
              className="cycle-center-mark"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <svg
                viewBox="0 0 80 80"
                style={{
                  display: 'block',
                  flexShrink: 0,
                  width: 'clamp(68px, 6.5vw, 84px)',
                  height: 'clamp(68px, 6.5vw, 84px)',
                }}
                fill="none"
              >
                <defs>
                  {/* Mask produces TRUE transparent cutout holes directly into whatever background is underneath */}
                  <mask id="cc-pure-icon-mask">
                    {/* Solid white = visible */}
                    <rect width="80" height="80" fill="#FFFFFF" />
                    {/* Black circles = true transparent holes */}
                    <circle cx="52" cy="32" r="20" fill="#000000" />
                    <circle cx="32" cy="40" r="10" fill="#000000" />
                  </mask>
                </defs>

                {/* Main violet body with transparent punch-outs */}
                <circle
                  cx="32"
                  cy="40"
                  r="28"
                  fill="var(--violet, #5b4af7)"
                  mask="url(#cc-pure-icon-mask)"
                />

                {/* Inner concentric jade accent node */}
                <circle
                  cx="52"
                  cy="32"
                  r="9"
                  fill="var(--jade, #00c896)"
                  opacity="0.95"
                />
              </svg>
            </motion.div>
          </div>

          {/* Node 1: LEARN (Top Center) */}
          <div
            className="cycle-node-card"
            style={{
              position: 'absolute',
              top: '9%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <span
              className="cycle-node-text"
              style={{
                fontSize: 'clamp(21px, 2.2vw, 26px)',
              }}
            >
              LEARN
            </span>
          </div>

          {/* Node 2: ASK (Top Right) */}
          <div
            className="cycle-node-card"
            style={{
              position: 'absolute',
              top: '21%',
              left: '77%',
              transform: 'translate(-20%, -50%)',
              textAlign: 'left',
            }}
          >
            <span
              className="cycle-node-text"
              style={{
                fontSize: 'clamp(20px, 2.1vw, 25px)',
              }}
            >
              ASK
            </span>
          </div>

          {/* Node 3: PRACTISE (Center Right) */}
          <div
            className="cycle-node-card"
            style={{
              position: 'absolute',
              top: '49%',
              left: '92%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <span
              className="cycle-node-text"
              style={{
                fontSize: 'clamp(20px, 2.1vw, 25px)',
              }}
            >
              PRACTISE
            </span>
          </div>

          {/* Node 4: TRACK (Bottom Right) */}
          <div
            className="cycle-node-card"
            style={{
              position: 'absolute',
              top: '77%',
              left: '77%',
              transform: 'translate(-20%, -50%)',
              textAlign: 'left',
            }}
          >
            <span
              className="cycle-node-text"
              style={{
                fontSize: 'clamp(20px, 2.1vw, 25px)',
              }}
            >
              TRACK
            </span>
          </div>

          {/* Node 5: UNDERSTAND (Bottom Center) */}
          <div
            className="cycle-node-card"
            style={{
              position: 'absolute',
              top: '91%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <span
              className="cycle-node-text"
              style={{
                fontSize: 'clamp(20px, 2.1vw, 25px)',
              }}
            >
              UNDERSTAND
            </span>
          </div>

          {/* Node 6: PERSONALIZE (Bottom Left) */}
          <div
            className="cycle-node-card"
            style={{
              position: 'absolute',
              top: '77%',
              left: '23%',
              transform: 'translate(-80%, -50%)',
              textAlign: 'right',
            }}
          >
            <span
              className="cycle-node-text"
              style={{
                fontSize: 'clamp(20px, 2.1vw, 25px)',
              }}
            >
              PERSONALIZE
            </span>
          </div>

          {/* Node 7: RECOMMEND (Center Left) */}
          <div
            className="cycle-node-card"
            style={{
              position: 'absolute',
              top: '49%',
              left: '8%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <span
              className="cycle-node-text"
              style={{
                fontSize: 'clamp(20px, 2.1vw, 25px)',
              }}
            >
              RECOMMEND
            </span>
          </div>
        </motion.div>

        {/* ════════════ MOBILE RESPONSIVE CYCLIC FLOW (< 740px) ════════════ */}
        <motion.div
          className="mobile-cyclic-layout"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            maxWidth: '380px',
            margin: '0 auto',
          }}
        >
          {/* Logo at top of mobile flow - Pure Icon Only */}
          <div
            className="cycle-center-mark"
            style={{
              marginBottom: '18px',
            }}
          >
            <svg viewBox="0 0 80 80" width="58" height="58" fill="none">
              <defs>
                <mask id="cc-pure-icon-mask-mobile">
                  <rect width="80" height="80" fill="#FFFFFF" />
                  <circle cx="52" cy="32" r="20" fill="#000000" />
                  <circle cx="32" cy="40" r="10" fill="#000000" />
                </mask>
              </defs>
              <circle
                cx="32"
                cy="40"
                r="28"
                fill="var(--violet, #5b4af7)"
                mask="url(#cc-pure-icon-mask-mobile)"
              />
              <circle
                cx="52"
                cy="32"
                r="9"
                fill="var(--jade, #00c896)"
                opacity="0.95"
              />
            </svg>
          </div>

          {STAGES.map((item, idx) => (
            <React.Fragment key={item.id}>
              <div
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(139, 128, 249, 0.18)',
                  background: 'rgba(139, 128, 249, 0.04)',
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                <span
                  className="cycle-node-text"
                  style={{
                    fontSize: '19px',
                  }}
                >
                  {item.label}
                </span>
              </div>
              {/* Subtle connecting vertical stroke without arrows */}
              {idx < STAGES.length - 1 && (
                <div
                  style={{
                    width: '1.5px',
                    height: '18px',
                    backgroundColor: 'rgba(165, 155, 255, 0.45)',
                    borderRadius: '1px',
                  }}
                />
              )}
            </React.Fragment>
          ))}
          {/* Subtle loop indicator back to start */}
          <div
            style={{
              marginTop: '4px',
              color: 'rgba(165, 155, 255, 0.65)',
              fontSize: '14px',
              fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
              fontStyle: 'italic',
            }}
          >
            loops back to continuous learning
          </div>
        </motion.div>
      </div>
    </section>
  )
}
