'use client'

import React from 'react'
import { motion } from 'framer-motion'
import CCAILogo from './CCAILogo'

export default function BrandPanel() {
  const bg = '#111218'
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden', background: bg, display: 'flex', flexDirection: 'column', padding: '80px 60px' }}>
      {/* Background Glows (Matching the image's atmospheric depth) */}
      <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '80%', height: '60%', background: 'radial-gradient(circle, rgba(77, 63, 255, 0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', opacity: 0.8 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '70%', height: '50%', background: 'radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', opacity: 0.6 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Brand Logo & Meta */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ marginBottom: '24px' }}>
            <CCAILogo size={32} variant="dark" />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            ESTABLISHED 2024 · DIGITAL SCHOLASTICS
          </div>
        </div>

        <div style={{ marginBottom: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '48px' }}>
            <div style={{ color: 'white', opacity: 0.8, fontSize: '20px', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              College Circle AI
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ color: 'white', fontSize: '64px', fontWeight: 600, lineHeight: 1.1, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Your AI teacher
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', maxWidth: '440px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}
          >
            Enter the digital sanctum where ancient pedagogy meets future intelligence. A modern Gurukul for the contemporary scholar.
          </motion.p>
        </div>

        {/* Footer Motif */}
        <div style={{ marginTop: 'auto', position: 'relative' }}>
          {/* Geometric Motif Lines */}
          <div style={{ position: 'absolute', left: '-20px', bottom: '60px', opacity: 0.15 }}>
            <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
              <rect x="25" y="25" width="50" height="50" stroke="white" strokeWidth="0.5" transform="rotate(45 50 50)" />
              <rect x="30" y="30" width="40" height="40" stroke="white" strokeWidth="0.3" />
              <circle cx="50" cy="50" r="4" fill="white" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ height: '1px', width: '40px', background: 'rgba(80, 227, 194, 0.5)' }} />
            <div style={{ color: '#50E3C2', opacity: 0.9, fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              CURRICULUM · ARCHIVES · INSIGHT
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
