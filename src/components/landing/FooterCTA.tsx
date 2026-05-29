'use client'

import { motion } from 'framer-motion'
import CCAILogo from '../brand/CCAILogo'

interface FooterCTAProps {
  onGetStarted?: () => void
}

export default function FooterCTA({ onGetStarted }: FooterCTAProps) {
  return (
    <section style={{
      background: '#0A0A1A',
      padding: '160px 80px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
    }}>
      {/* Diagonal atmospheric sweep — top-right to bottom-right */}
      <div
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
          background: 'linear-gradient(135deg, transparent 30%, rgba(120,115,170,0.25) 60%, rgba(160,155,200,0.45) 85%, rgba(180,175,215,0.55) 100%)',
          pointerEvents: 'none'
        }}
      />
      {/* Extra brightness in bottom-right corner */}
      <div
        style={{
          position: 'absolute', bottom: '-10%', right: '-5%',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(175,170,210,0.35) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ marginBottom: '48px', opacity: 0.9 }}>
          <CCAILogo size={48} variant="dark" />
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '72px', fontWeight: 900,
          color: 'white', lineHeight: 1.1, marginBottom: '24px'
        }}>
          Your teacher.<br />
          <span style={{ color: '#9FA2FF', fontStyle: 'italic', fontWeight: 700 }}>24/7.</span>
        </h2>

        <p style={{
          fontSize: '18px', color: '#888899', marginBottom: '64px',
          maxWidth: '500px', lineHeight: 1.6
        }}>
          Upload your syllabus. We handle everything else.
        </p>

        <motion.button
          onClick={onGetStarted}
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139,128,249,0.2)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'var(--violet)', color: 'white', border: 'none',
            padding: '24px 60px', borderRadius: '20px', fontSize: '18px',
            fontWeight: 700, cursor: 'pointer', marginBottom: '40px',
            transition: 'all 0.3s ease'
          }}
        >
          Start Learning Now →
        </motion.button>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#555566',
          letterSpacing: '0.05em'
        }}>
          Free to start
        </div>
      </motion.div>
    </section>
  )
}
