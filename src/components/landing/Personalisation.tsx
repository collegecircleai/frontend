import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

// Optimized reveal variants for hardware acceleration
const revealVariants = {
  hidden: { opacity: 0, x: -30, translateZ: 0 },
  show: { opacity: 1, x: 0, translateZ: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const Personalisation = memo(function Personalisation() {
  const listItems = [
    'Tracks your progress across all topics',
    'Identifies weak areas automatically',
    'Suggests the next best topic to study',
    'Adapts difficulty to your level',
    'Remembers what you struggle with'
  ]

  return (
    <section id="personalisation" className="responsive-grid" style={{
      background: 'var(--cream)',
      padding: '160px 80px',
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '100px',
      alignItems: 'center'
    }}>
      {/* Left Column: Content */}
      <motion.div
        initial="hidden"
        whileInView="show"
        variants={revealVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
          color: 'var(--violet)', letterSpacing: '0.15em', marginBottom: '24px',
          textTransform: 'uppercase'
        }}>
          PERSONALISATION
        </div>
        
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 800,
          color: 'var(--ink)', lineHeight: 1.1, marginBottom: '24px'
        }}>
          The more you study,<br />
          the smarter it gets.
        </h2>

        <div style={{ fontSize: '18px', color: 'var(--violet)', fontWeight: 600, marginBottom: '32px' }}>
          Your AI adapts to you.
        </div>

        <p style={{
          fontSize: '15px', color: '#888899', lineHeight: 1.7, 
          maxWidth: '520px', marginBottom: '48px'
        }}>
          College Circle AI doesn't just give you content. It learns your patterns, identifies gaps, and guides your learning journey intelligently.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {listItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15, translateZ: 0 }}
              whileInView={{ opacity: 1, x: 0, translateZ: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <CheckCircle2 size={20} color="#00C896" />
              <span style={{ fontSize: '16px', color: 'var(--ink)', fontWeight: 500 }}>{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Column: Visual Component */}
      <div style={{ perspective: '1200px', display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 40, rotateY: 15, translateZ: 0 }}
          whileInView={{ opacity: 1, y: 0, rotateY: 0, translateZ: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6, rotateX: 1, rotateY: -1, translateZ: 0 }}
          style={{
            background: 'var(--deep)', borderRadius: '32px', padding: '48px',
            width: '100%', maxWidth: '580px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', // Optimized shadow weight
            border: '1px solid var(--border)',
            position: 'relative',
            transition: 'all 0.5s ease',
            // @ts-ignore
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Header Tags */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            <div style={{ 
              background: 'var(--violet-pale)', color: 'var(--violet)', padding: '6px 12px', 
              borderRadius: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
              border: '1px solid var(--border)'
            }}>
              ECONOMICS
            </div>
            <div style={{ 
              color: '#888899', fontSize: '11px', fontWeight: 500, paddingTop: '6px'
            }}>
              L3 Intermediate
            </div>
          </div>

          {/* Progress Section */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>Course Progress</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--violet)' }}>68%</span>
            </div>
            <div style={{ height: '10px', width: '100%', background: 'var(--cream)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '68%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                style={{ height: '100%', background: 'var(--violet)', borderRadius: '10px' }} 
              />
            </div>
          </div>

          {/* Weak Areas */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px' }}>Weak Areas</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Multiplier Effect', 'Elasticity'].map((area, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0, translateZ: 0 }}
                  whileInView={{ scale: 1, opacity: 1, translateZ: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + (i * 0.1) }}
                  style={{
                    padding: '10px 20px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--coral)',
                    borderRadius: '12px', fontSize: '13px', fontWeight: 500,
                    border: '1px solid rgba(255, 77, 90, 0.2)'
                  }}
                >
                  {area}
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 15, translateZ: 0 }}
            whileInView={{ opacity: 1, y: 0, translateZ: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              padding: '24px 32px', background: 'var(--violet-pale)', 
              borderRadius: '16px', borderLeft: '5px solid var(--violet)',
              boxShadow: '0 4px 15px rgba(77, 63, 255, 0.1)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ 
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, 
              color: 'var(--violet)', letterSpacing: '0.1em', marginBottom: '12px' 
            }}>
              AI RECOMMENDATION
            </div>
            <div style={{ fontSize: '15px', color: 'var(--ink)', fontWeight: 600 }}>
              Start with Elasticity of Demand
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})

export default Personalisation
