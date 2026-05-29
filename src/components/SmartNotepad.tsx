'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Highlighter, Type, AlignLeft, Sparkles, FileText, List, Minimize2, Star } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

type NoteType = 'short' | 'detailed' | 'summary'

const NOTE_TYPES: { key: NoteType, label: string, desc: string, icon: any }[] = [
  { key: 'short', label: 'Short Notes', desc: 'Key points — bullet-form essentials', icon: <List size={18} /> },
  { key: 'detailed', label: 'Detailed Notes', desc: 'Full explanation with context', icon: <FileText size={18} /> },
  { key: 'summary', label: 'Summarised', desc: 'One-page overview per topic', icon: <Minimize2 size={18} /> },
]

export default function SmartNotepad() {
  const [content, setContent] = useState('')
  const [activeNoteType, setActiveNoteType] = useState<NoteType>('detailed')
  const [activeTab, setActiveTab] = useState<'generate' | 'notepad'>('notepad')

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>

      <motion.div variants={item} style={{ marginBottom: '48px' }}>
        <div className="label" style={{ color: 'var(--violet)', marginBottom: '16px' }}><span style={{ fontFamily: '"Noto Sans Devanagari", sans-serif' }}>दृष्टि</span> · INTELLECTUAL INSIGHT</div>
        <h1 className="serif" style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Insight
        </h1>
        <p style={{ color: 'var(--mist)', fontSize: '15px', lineHeight: 1.8, maxWidth: '540px' }}>
          Generate AI-powered notes from your syllabus or write your own. Everything saved and organised by subject.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[
          { key: 'generate', label: 'AI Note Generation', icon: <Sparkles size={14} /> },
          { key: 'notepad', label: 'Student Notepad', icon: <Highlighter size={14} /> },
        ].map((tab) => (
          <motion.button key={tab.key} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '12px 24px', borderRadius: '8px',
              border: activeTab === tab.key ? '2px solid var(--violet)' : '1px solid var(--border)',
              background: activeTab === tab.key ? 'var(--violet-pale)' : 'white',
              color: activeTab === tab.key ? 'var(--violet)' : 'var(--mist)',
              fontWeight: 500, fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
            {tab.icon} {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {activeTab === 'generate' ? (
        <motion.div key="generate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {NOTE_TYPES.map((type, i) => (
              <motion.div key={type.key}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                onClick={() => setActiveNoteType(type.key)}
                className={activeNoteType === type.key ? 'studojo-card' : 'card tactile-card'}
                style={{
                  padding: '24px', cursor: 'pointer', textAlign: 'center',
                  borderColor: activeNoteType === type.key ? '#4D3FFF' : undefined,
                  boxShadow: activeNoteType === type.key ? '5px 5px 0px #4D3FFF' : undefined
                }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: activeNoteType === type.key ? 'var(--violet-pale)' : 'var(--pearl)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: activeNoteType === type.key ? 'var(--violet)' : 'var(--mist)' }}>
                  {type.icon}
                </div>
                <h4 style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{type.label}</h4>
                <p style={{ fontSize: '12px', color: 'var(--mist)', lineHeight: 1.4 }}>{type.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px', display: 'block' }}>Select Topic from Syllabus</label>
            <select style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', background: 'white', cursor: 'pointer' }}>
              <option>Wave Functions & Probability</option>
              <option>The Schrödinger Equation</option>
              <option>Quantum Tunneling</option>
              <option>Angular Momentum & Spin</option>
            </select>
          </div>

          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
            <Sparkles size={16} /> Generate {NOTE_TYPES.find(n => n.key === activeNoteType)?.label}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div key="notepad" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <ToolBtn icon={<Highlighter size={14} />} label="Highlight" active />
              <ToolBtn icon={<Type size={14} />} label="Bold" />
              <ToolBtn icon={<Star size={14} />} label="Key Term" />
              <ToolBtn icon={<AlignLeft size={14} />} label="Format" />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--mist)' }}>Quantum Mechanics II → Wave Functions</span>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="btn-dark" style={{ padding: '10px 20px' }}>
                <Save size={14} /> Save
              </motion.button>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
            <textarea
              placeholder={'Start writing your notes here...\n\n💡 Tip: Use the Highlight tool to mark key terms, formulas, and important lines.'}
              style={{ width: '100%', height: '380px', background: 'transparent', border: 'none', padding: '32px 36px', fontSize: '15px', lineHeight: 2, resize: 'none', outline: 'none', color: 'var(--ink)', fontFamily: 'var(--font-body)' }}
              value={content} onChange={(e) => setContent(e.target.value)} />
            <div style={{ position: 'absolute', bottom: '14px', right: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--mist)' }}>{content.length} chars</span>
              <div style={{ width: '6px', height: '6px', background: 'var(--jade)', borderRadius: '50%', boxShadow: '0 0 6px rgba(0,200,150,0.4)' }} />
              <span className="mono" style={{ fontSize: '11px', color: 'var(--jade)' }}>Auto-saving</span>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--mist)' }}>Saved and organised by subject. Searchable across library.</p>
            <motion.button whileHover={{ x: 3 }} className="btn-primary" style={{ padding: '10px 20px' }}>
              <Sparkles size={14} /> Generate Study Cards
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function ToolBtn({ icon, label, active }: { icon: any, label: string, active?: boolean }) {
  return (
    <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }} title={label}
      style={{
        padding: '8px 12px', background: active ? 'var(--violet-pale)' : 'white',
        border: `1px solid ${active ? 'var(--violet)' : 'var(--border)'}`,
        borderRadius: '8px', color: active ? 'var(--violet)' : 'var(--mist)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '12px', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease'
      }}>
      {icon}
    </motion.button>
  )
}
