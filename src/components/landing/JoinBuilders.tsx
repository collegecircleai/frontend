'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function JoinBuilders() {
  return (
    <section
      id="join-builders"
      className="join-builders-section"
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)',
        overflow: 'hidden',
      }}
    >
      <style jsx global>{`
        /* Continuous flowing dotted stream animation along the path */
        @keyframes flowingDotsForward {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -128;
          }
        }

        .flowing-dots-path {
          /* Precise circular dots with spacing exactly matching the reference */
          stroke-dasharray: 0.1 16;
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: flowingDotsForward 3.5s linear infinite;
        }

        /* Ambient Glow disabled for seamless background flow */
        .join-builders-glow {
          display: none;
        }

        /* Content Container: Seamless, open editorial canvas (No card box / frame) */
        .join-builders-card {
          position: relative;
          max-width: 1080px;
          margin: 0 auto;
          padding: clamp(20px, 3vw, 40px) clamp(20px, 4vw, 48px);
          background: transparent;
          border: none;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow: visible;
        }

        [data-theme='dark'] .join-builders-card {
          background: transparent;
          border: none;
          box-shadow: none;
        }

        /* Dotted line: Solid black in light mode, crisp luminous ivory in dark mode */
        .flow-black-dots {
          stroke: #111115;
          opacity: 0.95;
        }

        [data-theme='dark'] .flow-black-dots {
          stroke: #faf8f5 !important;
          opacity: 0.95;
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 12px rgba(165, 155, 255, 0.45));
        }

        /* Editorial minimal eyebrow tag (No AI generic badges/sparkles) */
        .join-eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(26, 26, 36, 0.04);
          border: 1px solid rgba(26, 26, 36, 0.09);
          color: rgba(26, 26, 36, 0.72);
          font-family: var(--font-body), -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 28px;
          position: relative;
          z-index: 2;
          transition: all 0.2s ease;
        }

        [data-theme='dark'] .join-eyebrow {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.16);
          color: rgba(255, 255, 255, 0.82);
        }

        /* Main Heading Container with inline SVG loop anchoring directly from 'us?' */
        .join-title-wrap {
          position: relative;
          display: inline-block;
          margin: 0 0 24px 0;
          z-index: 2;
        }

        .join-title {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-weight: 400;
          font-size: clamp(40px, 5.5vw, 76px);
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: #111115;
          margin: 0;
          position: relative;
          z-index: 3;
        }

        [data-theme='dark'] .join-title {
          color: #ffffff;
          text-shadow: 0 2px 28px rgba(255, 255, 255, 0.12);
        }

        /* Question mark anchor holding the SVG directly next to its bottom dot */
        .join-title-qmark-anchor {
          position: relative;
          display: inline-block;
        }

        .loop-anchor-svg {
          position: absolute;
          left: calc(100% - 10px);
          top: calc(100% - 258px);
          width: 760px;
          height: 550px;
          pointer-events: none;
          z-index: 2;
          overflow: visible;
        }

        @media (max-width: 1200px) {
          .loop-anchor-svg {
            width: 620px;
            top: calc(100% - 258px);
          }
        }

        @media (max-width: 960px) {
          .loop-anchor-svg {
            left: calc(100% - 10px);
            top: calc(100% - 258px);
            width: 460px;
            height: 480px;
          }
        }

        @media (max-width: 680px) {
          .loop-anchor-svg {
            display: none;
          }
        }

        /* Description: Pure Garamond typography with relaxed editorial leading */
        .join-desc {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: clamp(21px, 1.85vw, 26px);
          font-weight: 400;
          line-height: 1.55;
          color: rgba(26, 26, 36, 0.78);
          max-width: 760px;
          margin: 0 0 20px 0;
          position: relative;
          z-index: 2;
        }

        [data-theme='dark'] .join-desc {
          color: rgba(235, 232, 245, 0.84);
        }

        /* Status: Refined sage italic */
        .join-status {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: clamp(17px, 1.35vw, 20px);
          font-style: italic;
          color: #1b8a5a;
          font-weight: 400;
          margin-bottom: 38px;
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        [data-theme='dark'] .join-status {
          color: #2ee29b;
        }

        .status-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #1b8a5a;
          box-shadow: 0 0 10px rgba(27, 138, 90, 0.4);
          display: inline-block;
          animation: pulseSage 2.4s infinite ease-in-out;
        }

        [data-theme='dark'] .status-pulse-dot {
          background: #2ee29b;
          box-shadow: 0 0 12px rgba(46, 226, 155, 0.5);
        }

        @keyframes pulseSage {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.45;
          }
        }

        /* Buttons Row */
        .join-buttons-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        /* Primary Button: Deep Obsidian / Bespoke Minimalist Editorial */
        .join-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 36px;
          border-radius: 999px;
          background: #111115;
          color: #ffffff !important;
          text-decoration: none;
          font-family: var(--font-body), -apple-system, sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.015em;
          box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.28),
                      0 1px 2px rgba(0, 0, 0, 0.1),
                      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .join-cta-primary:hover {
          transform: translateY(-2px);
          background: #202028;
          box-shadow: 0 18px 40px -8px rgba(0, 0, 0, 0.38),
                      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
        }

        .join-cta-primary .cta-arrow {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .join-cta-primary:hover .cta-arrow {
          transform: translateX(3px);
        }

        [data-theme='dark'] .join-cta-primary {
          background: #faf8f5;
          color: #111115 !important;
          box-shadow: 0 12px 32px -8px rgba(255, 255, 255, 0.16),
                      0 0 0 1px rgba(255, 255, 255, 0.8) inset;
        }

        [data-theme='dark'] .join-cta-primary:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 18px 45px -8px rgba(255, 255, 255, 0.28);
        }

        /* Subtext: Quiet, elegant invitation line */
        .join-apply-subtext {
          font-family: var(--font-garamond), 'EB Garamond', Georgia, serif;
          font-size: 16px;
          font-style: italic;
          color: rgba(26, 26, 36, 0.52);
          margin-top: 20px;
          position: relative;
          z-index: 2;
        }

        [data-theme='dark'] .join-apply-subtext {
          color: rgba(235, 232, 245, 0.5);
        }
      `}</style>

      <div className="join-builders-card">
        <div className="join-builders-glow" />

        {/* Editorial Eyebrow Tag (Clean, Human, Non-AI) */}
        <div className="join-eyebrow">
          College Circle AI &middot; We&apos;re Hiring
        </div>

        {/* Title Container: Dotted loop emerges strictly from the right side of the heading */}
        <div className="join-title-wrap">
          <h2 className="join-title">
            Want to build with us
            <span className="join-title-qmark-anchor">
              ?
              {/* 
                Dotted stream starting directly on the baseline level with the question mark bottom dot:
              */}
              <svg
                className="loop-anchor-svg"
                viewBox="0 0 760 550"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 0 240 
                     C 30 240, 60 240, 85 240 
                     C 125 240, 168 200, 195 145 
                     C 225 80, 230 25, 200 25 
                     C 165 25, 125 85, 95 165 
                     C 85 195, 85 225, 85 240 
                     C 85 270, 95 305, 115 340 
                     C 150 400, 235 448, 350 472
                     C 470 498, 600 510, 750 520"
                  strokeWidth="4.5"
                  fill="none"
                  className="flow-black-dots flowing-dots-path"
                />
              </svg>
            </span>
          </h2>
        </div>

        {/* Description */}
        <p className="join-desc">
          We’re looking for people who are curious, take initiative and want to <br className="hidden sm:inline" />
          build something that matters.
        </p>

        {/* Status */}
        <div className="join-status">
          <span className="status-pulse-dot" />
          Applications are open.
        </div>

        {/* Action Button */}
        <div className="join-buttons-row">
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLScnN0vQQTJMoveYzBNAclB1gcj51qBpf5D5Vnay5dJM2fY3AQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="join-cta-primary"
          >
            <span>Build with us</span>
            <ArrowRight size={17} className="cta-arrow" />
          </Link>
        </div>

        {/* Subtext */}
        <div className="join-apply-subtext">
          Apply here &mdash; tell us about what you love building
        </div>
      </div>
    </section>
  )
}
