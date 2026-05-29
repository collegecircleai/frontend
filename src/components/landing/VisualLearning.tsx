'use client'

import { motion } from 'framer-motion'
import { Workflow, Network, BarChart3 } from 'lucide-react'

export default function VisualLearning() {
  return (
    <section style={{
      background: '#09080E', 
      padding: '160px 80px',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <motion.div
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-100px" }}
         transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
         style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
          color: '#8B80F9', letterSpacing: '0.15em', marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          VISUAL LEARNING
        </div>
        
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 800,
          color: 'white', textAlign: 'center', lineHeight: 1.1,
          marginBottom: '24px'
        }}>
          Don't just read.<br />
          <span style={{ color: '#8B80F9', fontStyle: 'italic', fontWeight: 700 }}>See</span> it.
        </h2>

        <p style={{ fontSize: '15px', color: '#888899', marginBottom: '80px', textAlign: 'center', fontWeight: 400 }}>
          AI-generated infographics, concept maps, and diagrams.
        </p>
      </motion.div>

      <div 
        className="mobile-pyramid"
        style={{
          display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '32px',
          width: '100%', maxWidth: '1360px', justifyContent: 'center'
        }}
      >
        {[
          {
            title: 'Process Diagrams',
            desc: 'Step-by-step flowcharts for complex concepts',
            icon: <Workflow size={28} color="#8B80F9" strokeWidth={2} />
          },
          {
            title: 'Concept Maps',
            desc: 'Connected knowledge graphs showing relationships',
            icon: <Network size={28} color="#8B80F9" strokeWidth={2} />
          },
          {
            title: 'Topic Infographics',
            desc: 'Visual summaries with key stats and data',
            icon: <BarChart3 size={28} color="#8B80F9" strokeWidth={2} />
          }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.06)' }}
            className="reality-card"
            style={{
              background: '#050510', border: '1px solid rgba(123, 112, 255, 0.12)',
              display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease',
              padding: 'clamp(20px, 4vw, 48px) clamp(16px, 3vw, 40px)',
              borderRadius: '24px', flex: '1 1 0', width: '100%'
            }}
          >
            <div style={{
              width: 'clamp(48px, 12vw, 64px)', height: 'clamp(48px, 12vw, 64px)', borderRadius: '16px',
              background: '#121220', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 'clamp(24px, 5vw, 48px)', border: '1px solid rgba(255,255,255,0.03)',
              flexShrink: 0
            }}>
              <motion.div whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                {card.icon}
              </motion.div>
            </div>
            <div style={{ fontSize: 'clamp(15px, 3.5vw, 20px)', fontWeight: 600, color: 'white', marginBottom: '16px' }}>
              {card.title}
            </div>
            <div style={{ fontSize: 'clamp(12px, 2.5vw, 15px)', color: '#888899', lineHeight: 1.6, flex: 1, marginBottom: 'clamp(24px, 5vw, 48px)' }}>
              {card.desc}
            </div>
            <div>
              <span style={{
                display: 'inline-block', background: '#121220', color: '#888899',
                padding: '6px 12px', borderRadius: '6px', fontFamily: 'var(--font-mono)', 
                fontSize: 'clamp(8px, 1.5vw, 10px)', fontWeight: 600, letterSpacing: '0.05em', border: '1px solid rgba(255,255,255,0.03)'
              }}>
                AI-GENERATED
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
