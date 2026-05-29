'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, Cloud, CircleDashed, CheckCircle2, Sparkles, ArrowUpRight, Activity, ArrowUp,
  MessageSquare, BookOpen, Clock, ChevronDown, ChevronUp, PlayCircle
} from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export default function LibraryView() {
  const [isUploaded, setIsUploaded] = useState(false)

  return (
    <div style={{ padding: '56px', maxWidth: '1200px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        {!isUploaded ? (
          <motion.div key="upload-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
            {/* Header Section */}
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={item} style={{ textAlign: 'center', marginBottom: '72px' }}>
                <div className="label" style={{ color: 'var(--violet)', marginBottom: '16px', letterSpacing: '0.3em' }}>SCHOLASTIC INGESTION</div>
                <h1 className="serif" style={{ fontSize: '32px', fontWeight: 600, marginBottom: '24px' }}>
                  Course Material Digitization
                </h1>
                <p className="serif" style={{ color: 'var(--mist)', fontSize: '16px', fontStyle: 'italic', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
                  Present your academic syllabus or course plan. Our intelligence will architect a personalized study sanctum for you.
                </p>
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }}>
                {/* Left Column: Upload Zone */}
                <motion.div variants={item}>
                  <motion.div 
                    onClick={() => setIsUploaded(true)}
                    whileHover={{ translate: '-4px -4px', boxShadow: '12px 12px 0px #4D3FFF' }}
                    className="studojo-card" 
                    style={{ padding: '64px', textAlign: 'center', borderColor: '#4D3FFF', boxShadow: '8px 8px 0px #4D3FFF', borderStyle: 'dashed', cursor: 'pointer' }}
                  >
                    <div style={{ width: '84px', height: '84px', background: 'var(--violet)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 8px 24px rgba(77, 63, 255, 0.2)' }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Cloud size={44} color="white" fill="white" />
                        <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ArrowUp size={20} strokeWidth={4} />
                        </div>
                      </div>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Upload your course plan</h3>
                    <p style={{ color: 'var(--mist)', fontSize: '14px', marginBottom: '40px' }}>
                      PDF, DOCX, or high-fidelity scans of your syllabus
                    </p>
                    <motion.button 
                      className="btn-primary" 
                      style={{ padding: '16px 48px', fontSize: '15px', borderRadius: '12px', background: '#4D3FFF' }}
                    >
                      Select Document
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Right Column: Processing & Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <motion.div variants={item}>
                    <div className="card" style={{ padding: '32px', border: '1px solid var(--border)', borderRadius: '24px', background: 'white' }}>
                      <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '32px' }}>Processing Pipeline</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <PipelineStep status="done" title="Document Ingestion" desc="Syllabus_Physics_101.pdf (2.4MB)" />
                        <PipelineStep status="active" title="Extracting Scholastic Topics" desc="Applying neural OCR layers..." />
                        <PipelineStep status="waiting" title="Semantic Curricula Mapping" desc="Waiting for extraction..." />
                      </div>
                      <div style={{ marginTop: '48px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span className="label" style={{ color: 'var(--violet)', fontSize: '10px' }}>INTEGRATION PROGRESS</span>
                          <span className="mono" style={{ fontSize: '12px', fontWeight: 600 }}>42%</span>
                        </div>
                        <div className="progress-bar-bg" style={{ height: '8px', borderRadius: '4px' }}>
                          <div className="progress-bar-fill shimmer-fill" style={{ width: '42%', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div variants={item}>
                    <div className="card" style={{ padding: '24px', background: 'rgba(0, 200, 150, 0.03)', border: '1px solid rgba(0, 200, 150, 0.1)', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <Sparkles size={16} color="var(--jade)" />
                        <div className="label" style={{ color: 'var(--jade)', background: 'rgba(0, 200, 150, 0.08)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px' }}>AI INSIGHT</div>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, opacity: 0.8 }}>
                        Our AI has identified high-priority cognitive clusters in the first 3 pages. Preparation for these topics will be prioritized in your sanctum.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="curriculum-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} variants={container}>
            {/* Top Course Card (Exact Parity) */}
            <motion.div variants={item} style={{ marginBottom: '48px' }}>
              <div className="card" style={{ padding: '56px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                
                <div style={{ flex: 1, position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                    <div className="label" style={{ color: '#00523C', background: '#99F6E4', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, fontSize: '9px' }}>ACADEMIC LUXURY</div>
                    <div className="mono" style={{ color: 'var(--mist)', fontSize: '10px', letterSpacing: '0.05em' }}>CODE: ECON-301</div>
                  </div>
                  
                  <h1 className="serif" style={{ fontSize: '32px', fontWeight: 500, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '-0.01em' }}>Microeconomics - Semester 3</h1>
                  
                  <p style={{ color: 'var(--mist)', fontSize: '16px', maxWidth: '580px', lineHeight: 1.7, marginBottom: '44px', fontWeight: 400 }}>
                    Advanced analysis of market structures, consumer behavior, and firm theory through the lens of modern computational intelligence.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '56px', alignItems: 'center' }}>
                    <div>
                      <div className="label" style={{ color: 'var(--mist)', fontSize: '9px', marginBottom: '8px' }}>CREDITS</div>
                      <div className="serif" style={{ fontWeight: 600, fontSize: '20px', color: 'var(--ink)' }}>04</div>
                    </div>
                    <div style={{ width: '1px', height: '32px', background: 'var(--border)' }} />
                    <div>
                      <div className="label" style={{ color: 'var(--mist)', fontSize: '9px', marginBottom: '8px' }}>DURATION</div>
                      <div className="serif" style={{ fontWeight: 600, fontSize: '20px', color: 'var(--ink)' }}>14 wks</div>
                    </div>
                  </div>
                </div>

                <div style={{ width: '300px', height: '100%', position: 'absolute', right: '40px', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Geometric Background Shapes (Strict Parity) */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.08 }}>
                    <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
                      <rect x="150" y="60" width="140" height="140" transform="rotate(45 150 60)" stroke="var(--violet)" strokeWidth="0.5" />
                      <circle cx="150" cy="150" r="110" stroke="var(--violet)" strokeWidth="0.5" />
                      <circle cx="100" cy="150" r="120" stroke="var(--violet)" strokeWidth="0.5" />
                    </svg>
                  </div>

                  {/* Radial Progress */}
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="180" height="180">
                      <circle cx="90" cy="90" r="80" fill="white" fillOpacity="0.9" stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
                      <circle cx="90" cy="90" r="80" fill="none" stroke="var(--violet)" strokeWidth="3" strokeDasharray="502" strokeDashoffset="502" />
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <div className="serif" style={{ fontSize: '42px', fontWeight: 500, color: 'var(--violet)', lineHeight: 1 }}>0%</div>
                      <div className="label" style={{ fontSize: '10px', color: 'var(--mist)', marginTop: '4px' }}>COMPLETE</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hierarchy Section */}
            <motion.section variants={item} style={{ marginBottom: '56px' }}>
              <div className="section-header">
                <h3 className="serif">Curriculum Hierarchy</h3>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--mist)' }}>5 UNITS TOTAL</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <UnitAccordion 
                  number="01" 
                  title="Foundations of Consumer Choice" 
                  meta="4 TOPICS · 3.5 HOURS OF STUDY" 
                  isOpen={true}
                  topics={[
                    { title: 'Axioms of Preference & Utility Functions', type: 'Lecture Video', duration: '45 mins' },
                    { title: 'The Budget Constraint & Optimization', type: 'Interactive Simulation', duration: '60 mins' },
                    { title: 'Income and Substitution Effects (Slutsky)', type: 'Reading Manuscript', duration: '30 mins' },
                  ]}
                />
                <UnitAccordion number="02" title="Production Theory & Costs" meta="6 TOPICS · 5 HOURS OF STUDY" />
                <UnitAccordion number="03" title="Perfect Competition & Monopoly" meta="5 TOPICS · 4 HOURS OF STUDY" />
              </div>
            </motion.section>

            {/* Bottom Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '32px' }}>
              <motion.div variants={item}>
                <div className="card" style={{ background: '#4D3FFF', padding: '32px', borderRadius: '24px', color: 'white', cursor: 'pointer' }}>
                  <MessageSquare size={24} style={{ marginBottom: '24px' }} />
                  <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Ask CC-AI Anything</h3>
                  <p style={{ fontSize: '13px', opacity: 0.8, lineHeight: 1.6, marginBottom: '24px' }}>
                    Need clarification on Unit 1 axioms? Our intelligence is ready.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600 }}>
                    OPEN PORTAL <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={item}>
                <div className="card" style={{ padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', gap: '32px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div className="label" style={{ color: 'var(--jade)', background: 'rgba(0, 200, 150, 0.08)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', display: 'inline-block', marginBottom: '16px' }}>AI INSIGHT</div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Recommended Reading</h4>
                    <p className="serif" style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--mist)', lineHeight: 1.6 }}>
                      "The analysis of consumer behavior is often the bedrock of macroeconomic stability..."
                    </p>
                  </div>
                  <div style={{ width: '140px', height: '100px', background: 'var(--pearl)', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200" alt="reading" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PipelineStep({ status, title, desc }: { status: 'done' | 'active' | 'waiting', title: string, desc: string }) {
  const isDone = status === 'done'
  const isActive = status === 'active'
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ marginTop: '2px' }}>
        {isDone && <CheckCircle2 size={24} color="var(--jade)" fill="rgba(0, 200, 150, 0.1)" />}
        {isActive && (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <CircleDashed size={24} color="var(--violet)" />
          </motion.div>
        )}
        {status === 'waiting' && <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--pearl)', border: '2px solid var(--border)' }} />}
      </div>
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: 600, color: status === 'waiting' ? 'var(--mist)' : 'var(--ink)', marginBottom: '4px' }}>{title}</h4>
        <p className="mono" style={{ fontSize: '11px', color: isActive ? 'var(--violet)' : 'var(--mist)', opacity: isActive ? 0.8 : 1 }}>{desc}</p>
      </div>
    </div>
  )
}

function UnitAccordion({ number, title, meta, isOpen = false, topics = [] }: { number: string, title: string, meta: string, isOpen?: boolean, topics?: any[] }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)', borderRadius: '16px' }}>
      <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '24px', background: isOpen ? 'rgba(77, 63, 255, 0.02)' : 'white', borderBottom: isOpen ? '1px solid var(--border)' : 'none' }}>
        <div style={{ width: '32px', height: '32px', background: isOpen ? 'var(--violet)' : 'var(--pearl)', color: isOpen ? 'white' : 'var(--mist)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>{number}</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>{title}</h4>
          <div className="label" style={{ fontSize: '9px', color: 'var(--mist)', marginTop: '4px' }}>{meta}</div>
        </div>
        {isOpen ? <ChevronUp size={20} color="var(--border)" /> : <ChevronDown size={20} color="var(--border)" />}
      </div>
      {isOpen && (
        <div style={{ padding: '16px 32px 32px 88px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {topics.map((topic, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid var(--border)' }} />
                   <h5 style={{ fontSize: '14px', fontWeight: 600 }}>{topic.title}</h5>
                </div>
                <div className="mono" style={{ fontSize: '11px', color: 'var(--mist)', marginLeft: '18px' }}>{topic.type} · {topic.duration}</div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ padding: '8px 20px', borderRadius: '24px', border: '1px solid var(--border)', background: 'white', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Start <ArrowUpRight size={14} />
              </motion.button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

