'use client'

import { motion } from 'framer-motion'
import { Brain, CreditCard, ClipboardCheck } from 'lucide-react'

export default function Practice() {
  const cards = [
    {
      title: 'Flashcards',
      desc: 'AI-generated flashcards with spaced repetition algorithm to boost retention.',
      footer: 'Front/Back flip view',
      tag: 'SPACED REPETITION',
      tagBg: '#ECFDF5',
      tagColor: '#10B981',
      icon: <CreditCard size={24} />,
      iconBg: '#EEF2FF',
      iconColor: '#6366F1'
    },
    {
      title: 'Adaptive Quizzes',
      desc: 'MCQ quizzes that adjust difficulty based on your performance in real-time.',
      footer: 'Smart question engine',
      tag: 'ADAPTIVE DIFFICULTY',
      tagBg: '#EEF2FF',
      tagColor: '#6366F1',
      icon: <Brain size={24} />,
      iconBg: '#F5F3FF',
      iconColor: '#8B5CF6'
    },
    {
      title: 'Mock Exams',
      desc: 'Full practice papers following your actual exam pattern and marking scheme.',
      footer: 'Realistic exam format',
      tag: 'MARKING SCHEME BASED',
      tagBg: '#FFF7ED',
      tagColor: '#F97316',
      icon: <ClipboardCheck size={24} />,
      iconBg: '#F0F9FF',
      iconColor: '#0EA5E9'
    }
  ]

  return (
    <section style={{
      background: 'var(--pearl)',
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
          color: 'var(--violet)', letterSpacing: '0.15em', marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          PRACTICE & ASSESSMENT
        </div>
        
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800,
          color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2,
          marginBottom: '80px'
        }}>
          Study smarter. Practice harder.
        </h2>
      </motion.div>

      <div 
        className="mobile-pyramid"
        style={{
          display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '32px',
          width: '100%', maxWidth: '1200px', justifyContent: 'center'
        }}
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="reality-card"
            style={{
              padding: 'clamp(20px, 4vw, 40px)',
              display: 'flex', flexDirection: 'column', position: 'relative',
              overflow: 'hidden',
              borderRadius: '24px',
              flex: '1 1 0', /* Exact third widths on Desktop */
              width: '100%' 
            }}
          >
            {/* Header with Icon and Tag */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start', marginBottom: 'clamp(20px, 4vw, 40px)' }}>
              <div style={{
                width: 'clamp(40px, 10vw, 48px)', height: 'clamp(40px, 10vw, 48px)', borderRadius: '12px',
                background: `${card.iconColor}15`, color: card.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${card.iconColor}30`
              }}>
                {card.icon}
              </div>
              <div style={{
                padding: '6px 10px', borderRadius: '6px', fontSize: 'clamp(8px, 1.5vw, 10px)',
                fontFamily: 'var(--font-mono)', fontWeight: 600, 
                backgroundColor: `${card.tagColor}10`, color: card.tagColor,
                letterSpacing: '0.05em',
                border: `1px solid ${card.tagColor}20`,
                textAlign: 'left'
              }}>
                {card.tag}
              </div>
            </div>

            <h3 style={{ fontSize: 'clamp(16px, 3.5vw, 20px)', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
              {card.title}
            </h3>
            <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: 'var(--mist)', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
              {card.desc}
            </p>

            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '16px', opacity: 0.3 }} />
            
            <div style={{ fontSize: 'clamp(11px, 2vw, 13px)', color: 'var(--mist)', fontWeight: 500 }}>
              {card.footer}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: 'absolute', inset: 0, 
                background: `linear-gradient(135deg, ${card.iconColor}08 0%, transparent 100%)`,
                pointerEvents: 'none'
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
