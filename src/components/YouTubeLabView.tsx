'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Youtube, Link2, Play, CheckCircle2, ArrowRight, Sparkles, MapPin } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const SYLLABUS_TOPICS = [
  {
    topic: 'Wave Functions & Probability',
    videos: [
      { title: 'MIT 8.04 — Wave Function Collapse', channel: 'MIT OpenCourseWare', duration: '48:12' },
      { title: 'Probability in Quantum Mechanics', channel: '3Blue1Brown', duration: '22:04' },
    ]
  },
  {
    topic: 'The Schrödinger Equation',
    videos: [
      { title: 'Schrödinger Equation — Full Derivation', channel: 'Professor M does Science', duration: '35:41' },
      { title: 'Time-Dependent vs Time-Independent SE', channel: 'Physics Explained', duration: '18:23' },
      { title: 'MIT 8.04 — Solving the Schrödinger Eq.', channel: 'MIT OpenCourseWare', duration: '1:12:08' },
    ]
  },
  {
    topic: 'Quantum Tunneling',
    videos: [
      { title: 'Quantum Tunneling Intuition', channel: 'Veritasium', duration: '14:32' },
    ]
  },
]

export default function YouTubeLabView() {
  const [url, setUrl] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [expandedTopic, setExpandedTopic] = useState<string | null>('The Schrödinger Equation')

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ padding: '56px', maxWidth: '1200px', margin: '0 auto' }}>

      <motion.div variants={item} style={{ marginBottom: '56px' }}>
        <div className="label" style={{ color: 'var(--coral)', marginBottom: '16px' }}><span style={{ fontFamily: '"Noto Sans Devanagari", sans-serif' }}>गहन अध्ययन</span> · DEEP STUDY LAB</div>
        <h1 className="serif" style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Deep Study
        </h1>
        <p style={{ color: 'var(--mist)', fontSize: '15px', lineHeight: 1.8, maxWidth: '560px' }}>
          AI finds the most relevant videos for <strong style={{ color: 'var(--ink)' }}>each topic in your syllabus</strong>. Nothing irrelevant — every video is mapped.
        </p>
      </motion.div>

      {/* URL Card */}
      <motion.div variants={item} style={{ marginBottom: '56px' }}>
        <motion.div
          animate={{ borderColor: isFocused ? '#4D3FFF' : '#09090F', boxShadow: isFocused ? '7px 7px 0px #4D3FFF' : '5px 5px 0px #09090F' }}
          className="studojo-card" style={{ padding: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Youtube size={24} color="var(--coral)" />
            </motion.div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Paste Any Lecture URL</h3>
              <p className="mono" style={{ fontSize: '11px', color: 'var(--mist)' }}>Extracts notes, concepts, flashcards</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Link2 size={16} color="var(--mist)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                placeholder="https://youtube.com/watch?v=..."
                style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', background: 'var(--pearl)' }} />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn-coral" style={{ flexShrink: 0 }}>
              <Sparkles size={16} /> Extract
            </motion.button>
          </div>
          <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
            {['Transcribe Audio', 'Extract Concepts', 'Generate Cards'].map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--mist)' }}>
                <div className="mono" style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--violet-pale)', color: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{i + 1}</div>
                {s}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Mapped Videos */}
      <motion.section variants={item}>
        <div className="section-header">
          <h3>Syllabus-Mapped Videos</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={12} color="var(--violet)" />
            <span className="mono" style={{ fontSize: '11px', color: 'var(--mist)' }}>Quantum Mechanics II</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SYLLABUS_TOPICS.map((section, si) => (
            <motion.div key={section.topic}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + si * 0.08, type: 'spring' }}
              className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <motion.div whileHover={{ background: 'var(--pearl)' }}
                onClick={() => setExpandedTopic(expandedTopic === section.topic ? null : section.topic)}
                style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.15s ease',
                  borderBottom: expandedTopic === section.topic ? '1px solid var(--border-light)' : 'none' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--jade)', flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: '14px', flex: 1 }}>{section.topic}</span>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--violet)' }}>{section.videos.length} videos</span>
                <motion.div animate={{ rotate: expandedTopic === section.topic ? 90 : 0 }}>
                  <ArrowRight size={14} color="var(--mist)" />
                </motion.div>
              </motion.div>
              {expandedTopic === section.topic && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                  {section.videos.map((v, vi) => (
                    <motion.div key={v.title}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: vi * 0.06 }}
                      whileHover={{ background: 'var(--pearl)', x: 3 }}
                      style={{ padding: '14px 24px 14px 42px', display: 'flex', alignItems: 'center', gap: '14px',
                        borderBottom: vi < section.videos.length - 1 ? '1px solid var(--border-light)' : 'none', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                      <div style={{ width: '48px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF4D5A, #C53030)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Play size={12} fill="white" color="white" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</div>
                        <div className="mono" style={{ fontSize: '10px', color: 'var(--mist)' }}>{v.channel} · {v.duration}</div>
                      </div>
                      <div className="mono" style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '2px', background: 'rgba(0,200,150,0.08)', color: 'var(--jade)', flexShrink: 0 }}>
                        ✓ Mapped
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
