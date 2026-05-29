'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const MasterySection = memo(function MasterySection({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <section id="mastery" style={{
      background: 'var(--cream)',
      padding: '120px 24px',
      display: 'flex', justifyContent: 'center',
      alignItems: 'center'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '1200px',
          background: '#0A0A0A',
          borderRadius: '48px',
          padding: 'clamp(40px, 8vw, 100px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '60px',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Left Column: Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800,
            color: 'white', lineHeight: 1.1, marginBottom: '24px'
          }}>
            Master your fate.<br />
            <span style={{ color: 'var(--violet)', fontStyle: 'italic' }}>Begin the inquiry.</span>
          </h2>
          
          <p style={{
            fontSize: '16px', color: '#888899', lineHeight: 1.7, 
            maxWidth: '440px', marginBottom: '48px'
          }}>
            Join the most exclusive digital learning circle in India. Limited memberships available for the current semester.
          </p>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'var(--violet)', color: 'white', border: 'none',
              padding: '18px 40px', borderRadius: '18px', fontSize: '16px',
              fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(77, 63, 255, 0.3)'
            }}
          >
            Unlock Full Access
          </motion.button>
        </div>

        {/* Right Column: Interactive Quiz Card */}
        <div style={{ position: 'relative', zIndex: 2, perspective: '1000px' }}>
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              background: '#141414',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid #222',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ 
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, 
              color: 'var(--jade)', letterSpacing: '0.15em', marginBottom: '24px',
              textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--jade)', boxShadow: '0 0 10px var(--jade)' }} />
                LIVE DEMO
              </motion.span>
              <span style={{ opacity: 0.3 }}>·</span> 
              <span style={{ opacity: 0.5 }}>QUESTION 14</span>
            </div>

            <h3 style={{
              fontSize: '18px', fontWeight: 600, color: 'white',
              lineHeight: 1.5, marginBottom: '32px'
            }}>
              Which concept best describes the fusion of traditional knowledge systems with AI?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'A.', text: 'Algorithmic Archaism', active: false },
                { label: 'B.', text: 'Digital Gurukul Synthesis', active: true },
                { label: 'C.', text: 'Linear Scholasticism', active: false }
              ].map((opt, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  animate={opt.active ? {
                    boxShadow: ['0 0 0px rgba(0, 200, 150, 0)', '0 0 15px rgba(0, 200, 150, 0.2)', '0 0 0px rgba(0, 200, 150, 0)']
                  } : {}}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: opt.active ? 'rgba(0, 200, 150, 0.05)' : '#1A1A1A',
                    border: opt.active ? '1px solid var(--jade)' : '1px solid #222',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    color: opt.active ? 'white' : '#888899',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {opt.active && (
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
                        zIndex: 1
                      }}
                    />
                  )}
                  <span style={{ fontSize: '13px', fontWeight: 700, color: opt.active ? 'var(--jade)' : 'inherit', zIndex: 2 }}>{opt.label}</span>
                  <span style={{ fontSize: '15px', fontWeight: 500, flex: 1, zIndex: 2 }}>{opt.text}</span>
                  {opt.active && <CheckCircle2 size={18} color="var(--jade)" style={{ zIndex: 2 }} />}
                </motion.div>
              ))}
            </div>

            {/* Feedback Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              style={{
                marginTop: '32px',
                padding: '20px',
                background: 'rgba(0, 200, 150, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 200, 150, 0.1)'
              }}
            >
              <p style={{ fontSize: '13px', color: '#888899', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--jade)', fontWeight: 700 }}>Correct!</span> Synthesis refers to the creative combination of disparate elements into a unified whole.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Abstract background glow */}
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(77, 63, 255, 0.1) 0%, transparent 70%)',
          zIndex: 1, pointerEvents: 'none'
        }} />
      </motion.div>
    </section>
  )
})

export default MasterySection
