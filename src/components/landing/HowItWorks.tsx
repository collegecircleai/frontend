'use client'

import { motion } from 'framer-motion'
import { Upload, Network, MousePointer2, LineChart } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      background: 'var(--pearl)',
      padding: 'clamp(60px, 15vw, 160px) clamp(16px, 8vw, 80px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
        color: 'var(--violet)', letterSpacing: '0.15em', marginBottom: '20px',
        textTransform: 'uppercase'
      }}>
        HOW IT WORKS
      </div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 800,
          color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2,
          marginBottom: 'clamp(60px, 10vw, 120px)', maxWidth: '800px'
        }}>
        We turn your syllabus into<br />
        your <span style={{ color: 'var(--violet)', fontStyle: 'italic', fontWeight: 700 }}>entire</span> learning system.
      </motion.h2>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 'clamp(40px, 8vw, 80px)',
        width: '100%', maxWidth: '1000px'
      }}>
        {[
          {
            num: '01',
            title: 'Upload your syllabus',
            desc: 'Drop your PDF. We extract every unit, topic, and subtopic instantly.',
            icon: <Upload size={28} color="var(--violet)" strokeWidth={2} />,
            label: 'Upload Interface'
          },
          {
            num: '02',
            title: 'AI maps everything',
            desc: 'Our engine creates a complete knowledge graph of your entire course.',
            icon: <Network size={28} color="var(--violet)" strokeWidth={2} />,
            label: 'Knowledge Graph'
          },
          {
            num: '03',
            title: 'Pick any topic, start learning',
            desc: 'Click any topic. Get notes, visuals, quizzes, and practice instantly.',
            icon: <MousePointer2 size={28} color="var(--violet)" strokeWidth={2} />,
            label: 'Topic Selection'
          },
          {
            num: '04',
            title: 'The system learns with you',
            desc: 'As you study, we track progress and adapt to your learning style.',
            icon: <LineChart size={28} color="var(--violet)" strokeWidth={2} />,
            label: 'Analytics'
          }
        ].map((step, idx) => (
          <motion.div 
            key={idx}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, margin: "-100px" }}
            className="responsive-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center', gap: 'clamp(32px, 8vw, 80px)'
            }}
          >
            {/* Left Side: Text */}
            <div style={{ display: 'grid', gridTemplateColumns: 'clamp(30px, 5vw, 40px) 1fr', gap: '16px' }}>
              <div style={{ overflow: 'hidden', paddingTop: '6px' }}>
                <motion.div
                  variants={{
                    offscreen: { y: '100%' },
                    onscreen: { y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: 600,
                    color: 'var(--violet)'
                  }}
                >
                  {step.num}
                </motion.div>
              </div>
              <motion.div
                variants={{
                  offscreen: { opacity: 0, x: -30, filter: 'blur(8px)' },
                  onscreen: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }
                }}
              >
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 700,
                  color: 'var(--ink)', marginBottom: '16px'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 15px)', color: 'var(--mist)', lineHeight: 1.6
                }}>
                  {step.desc}
                </p>
              </motion.div>
            </div>

            {/* Right Side: Visual Card */}
            <div style={{ display: 'flex', justifyContent: 'center', perspective: '1200px' }}>
              <motion.div
                variants={{
                  offscreen: { opacity: 0, rotateY: 30, scale: 0.8, x: 50 },
                  onscreen: { opacity: 1, rotateY: 0, scale: 1, x: 0, transition: { type: 'spring', stiffness: 50, damping: 15, delay: 0.2 } }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: -5,
                  boxShadow: '0 20px 60px rgba(77, 63, 255, 0.12)',
                  transition: { duration: 0.4 }
                }}
                style={{
                  background: 'var(--deep)', borderRadius: '16px', 
                  width: '100%', maxWidth: '380px', height: 'clamp(120px, 25vw, 160px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid var(--border)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  {step.icon}
                </motion.div>
                <div style={{ fontSize: '13px', color: 'var(--mist)' }}>
                  {step.label}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
