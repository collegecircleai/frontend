'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Shield, Radio, FileText, Clock, Trophy, CheckCircle2, XCircle, Zap, ArrowRight } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const FEATURES = [
  { icon: <Shield size={18} />, title: 'Noise Cancel', desc: 'Background noise removed' },
  { icon: <Radio size={18} />, title: 'Full Recording', desc: 'Records entire lecture' },
  { icon: <FileText size={18} />, title: 'Live Notes', desc: 'Real-time structured notes' },
  { icon: <Clock size={18} />, title: 'Searchable', desc: 'Saved & organised after class' },
]

const TRANSCRIPT = [
  { time: '0:42', text: 'Today we discuss the Schrödinger equation — fundamental to quantum mechanics...' },
  { time: '1:15', text: 'Particles don\'t have definite positions — they have wave functions describing probability amplitudes.' },
  { time: '2:03', text: 'The time-independent form: Hψ = Eψ, where H is the Hamiltonian operator...' },
]

const QUIZ_QUESTIONS = [
  { 
    q: 'What does the wave function ψ describe in quantum mechanics?',
    options: ['Exact position of a particle', 'Probability amplitude of a particle\'s state', 'Speed of light in a vacuum', 'Temperature of a quantum system'],
    correct: 1, topic: 'Wave Functions'
  },
  {
    q: 'In the equation Hψ = Eψ, what does H represent?',
    options: ['Planck\'s constant', 'The Hamiltonian operator', 'The heat equation', 'Heisenberg\'s matrix'],
    correct: 1, topic: 'Schrödinger Equation'
  },
  {
    q: 'Which principle states you cannot know both position and momentum exactly?',
    options: ['Pauli Exclusion Principle', 'Heisenberg Uncertainty Principle', 'Superposition Principle', 'Correspondence Principle'],
    correct: 1, topic: 'Uncertainty'
  },
]

export default function VoiceModeView() {
  const [mode, setMode] = useState<'record' | 'quiz'>('record')
  const [isListening, setIsListening] = useState(false)
  const [query, setQuery] = useState('')
  const [pulseScale, setPulseScale] = useState(1)
  const [recordingTime, setRecordingTime] = useState(0)
  // Quiz state
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (!isListening) { setRecordingTime(0); return }
    const interval = setInterval(() => {
      setPulseScale(1 + Math.random() * 0.15)
      setRecordingTime(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isListening])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const handleAnswer = (idx: number) => {
    if (answered) return
    setSelectedAnswer(idx)
    setAnswered(true)
    if (idx === QUIZ_QUESTIONS[currentQ].correct) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
  }

  const nextQuestion = () => {
    if (currentQ + 1 >= QUIZ_QUESTIONS.length) {
      setQuizComplete(true)
    } else {
      setCurrentQ(q => q + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQ(0); setSelectedAnswer(null); setScore(0); setAnswered(false); setQuizComplete(false); setStreak(0)
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ padding: '56px', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Header */}
      <motion.div variants={item} style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div className="label" style={{ color: 'var(--violet)', marginBottom: '16px' }}><span style={{ fontFamily: '"Noto Sans Devanagari", sans-serif' }}>संग्रह</span> · SCHOLARLY ARCHIVE</div>
        <h1 className="serif" style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>
          Archive
        </h1>
        <p style={{ color: 'var(--mist)', fontSize: '15px', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto' }}>
          Record lectures, then <strong style={{ color: 'var(--ink)' }}>test your understanding</strong> with AI-generated questions.
        </p>
      </motion.div>

      {/* Mode Tabs */}
      <motion.div variants={item} style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '48px' }}>
        {[
          { key: 'record', label: 'Classroom Recording', icon: <Mic size={14} /> },
          { key: 'quiz', label: 'Post-Class Q&A', icon: <Trophy size={14} /> },
        ].map(tab => (
          <motion.button key={tab.key} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => setMode(tab.key as any)}
            style={{
              padding: '12px 24px', borderRadius: '8px',
              border: mode === tab.key ? '2px solid var(--violet)' : '1px solid var(--border)',
              background: mode === tab.key ? 'var(--violet-pale)' : 'white',
              color: mode === tab.key ? 'var(--violet)' : 'var(--mist)',
              fontWeight: 500, fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            {tab.icon} {tab.label}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'record' ? (
          <motion.div key="record" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '48px' }}>
              {FEATURES.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--violet-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'var(--violet)' }}>
                    {f.icon}
                  </div>
                  <h4 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{f.title}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--mist)', lineHeight: 1.4 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Mic Card */}
            <motion.div
              animate={{ borderColor: isListening ? '#4D3FFF' : '#09090F', boxShadow: isListening ? '7px 7px 0px #4D3FFF' : '5px 5px 0px #09090F' }}
              className="studojo-card" style={{ padding: '48px', textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
                {isListening && (
                  <>
                    <motion.div animate={{ scale: [1, 2.5], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity }}
                      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(77,63,255,0.12)' }} />
                    <motion.div animate={{ scale: [1, 2], opacity: [0.2, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(77,63,255,0.12)' }} />
                  </>
                )}
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  animate={{ scale: isListening ? pulseScale : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  onClick={() => setIsListening(!isListening)}
                  style={{
                    width: '96px', height: '96px', borderRadius: '50%',
                    background: isListening ? 'var(--violet)' : 'var(--ink)', border: 'none', color: 'white',
                    cursor: 'pointer', position: 'relative', zIndex: 2,
                    boxShadow: isListening ? '0 0 40px rgba(77,63,255,0.2)' : '0 8px 20px rgba(9,9,15,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                  {isListening ? <Mic size={28} /> : <MicOff size={28} />}
                </motion.button>
              </div>
              <motion.p animate={{ opacity: isListening ? [0.5, 1, 0.5] : 1 }} transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
                style={{ fontWeight: 600, fontSize: '15px', color: isListening ? 'var(--violet)' : 'var(--mist)' }}>
                {isListening ? `Recording — ${formatTime(recordingTime)}` : 'Tap to start recording'}
              </motion.p>
              <p style={{ fontSize: '12px', color: 'var(--mist)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                {isListening ? 'Noise cancellation active' : 'Background noise cancelled automatically'}
              </p>
              {isListening && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginTop: '24px', height: '32px', alignItems: 'center' }}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div key={i} animate={{ height: [4, 4 + Math.random() * 24, 4] }}
                      transition={{ duration: 0.3 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.03 }}
                      style={{ width: '3px', borderRadius: '1px', background: 'var(--violet)' }} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Transcript */}
            {isListening && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '48px' }}>
                <div className="section-header"><h3>Live Transcript</h3><div className="live-badge"><span className="live-dot" /> REAL-TIME</div></div>
                <div className="card" style={{ padding: '24px' }}>
                  {TRANSCRIPT.map((l, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.8 }}
                      style={{ padding: '10px 0', borderBottom: i < TRANSCRIPT.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                      <span className="mono" style={{ fontSize: '11px', color: 'var(--violet)', marginRight: '12px' }}>{l.time}</span>
                      <span style={{ fontSize: '14px', lineHeight: 1.6 }}>{l.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* ===== GAMIFICATION: POST-CLASS Q&A ===== */
          <motion.div key="quiz" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            
            {!quizComplete ? (
              <>
                {/* Score Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--violet-pale)', borderRadius: '8px' }}>
                      <Trophy size={14} color="var(--violet)" />
                      <span className="mono" style={{ fontSize: '12px', color: 'var(--violet)' }}>Score: {score}/{QUIZ_QUESTIONS.length}</span>
                    </div>
                    {streak >= 2 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(245,166,35,0.1)', borderRadius: '8px' }}>
                        <Zap size={14} color="var(--amber)" fill="var(--amber)" />
                        <span className="mono" style={{ fontSize: '12px', color: '#C48010' }}>{streak}x Streak!</span>
                      </motion.div>
                    )}
                  </div>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--mist)' }}>
                    Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                </div>

                {/* Progress */}
                <div style={{ height: '3px', background: 'var(--border-light)', marginBottom: '40px' }}>
                  <motion.div animate={{ width: `${((currentQ + (answered ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
                    style={{ height: '100%', background: 'var(--violet)' }} />
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                  <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="studojo-card" style={{ padding: '40px', marginBottom: '32px', borderColor: 'var(--violet)', boxShadow: '5px 5px 0px var(--violet)' }}>
                    <div className="mono" style={{ fontSize: '10px', color: 'var(--violet)', letterSpacing: '0.15em', marginBottom: '12px' }}>
                      {QUIZ_QUESTIONS[currentQ].topic.toUpperCase()}
                    </div>
                    <h3 className="serif" style={{ fontSize: '22px', fontWeight: 700, marginBottom: '32px', lineHeight: 1.4 }}>
                      {QUIZ_QUESTIONS[currentQ].q}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {QUIZ_QUESTIONS[currentQ].options.map((opt, idx) => {
                        const isCorrect = idx === QUIZ_QUESTIONS[currentQ].correct
                        const isSelected = idx === selectedAnswer
                        let bg = 'white'
                        let border = 'var(--border)'
                        let color = 'var(--ink)'
                        if (answered) {
                          if (isCorrect) { bg = 'rgba(0,200,150,0.08)'; border = 'var(--jade)'; color = 'var(--ink)' }
                          else if (isSelected && !isCorrect) { bg = 'rgba(255,77,90,0.06)'; border = 'var(--coral)'; color = 'var(--coral)' }
                        } else if (isSelected) { bg = 'var(--violet-pale)'; border = 'var(--violet)' }

                        return (
                          <motion.button key={idx}
                            whileHover={answered ? {} : { x: 4 }} whileTap={answered ? {} : { scale: 0.98 }}
                            onClick={() => handleAnswer(idx)}
                            style={{
                              padding: '16px 20px', background: bg, border: `2px solid ${border}`,
                              borderRadius: '8px', textAlign: 'left', cursor: answered ? 'default' : 'pointer',
                              fontFamily: 'var(--font-body)', fontSize: '14px', color, fontWeight: 500,
                              display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease'
                            }}>
                            <span className="mono" style={{ fontSize: '11px', color: 'var(--mist)', width: '20px' }}>{String.fromCharCode(65 + idx)}</span>
                            {opt}
                            {answered && isCorrect && <CheckCircle2 size={16} color="var(--jade)" style={{ marginLeft: 'auto' }} />}
                            {answered && isSelected && !isCorrect && <XCircle size={16} color="var(--coral)" style={{ marginLeft: 'auto' }} />}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {answered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }} onClick={nextQuestion}
                      className="btn-primary" style={{ padding: '14px 28px' }}>
                      {currentQ + 1 >= QUIZ_QUESTIONS.length ? 'See Results' : 'Next Question'} <ArrowRight size={16} />
                    </motion.button>
                  </motion.div>
                )}
              </>
            ) : (
              /* ===== QUIZ COMPLETE ===== */
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="studojo-card" style={{ padding: '60px', textAlign: 'center', borderColor: 'var(--jade)', boxShadow: '5px 5px 0px var(--jade)' }}>
                <motion.div animate={{ rotate: [0, -10, 10, -5, 0] }} transition={{ delay: 0.3, duration: 0.6 }}
                  style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</motion.div>
                <h2 className="serif" style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px' }}>
                  {score === QUIZ_QUESTIONS.length ? 'Perfect Score!' : score >= 2 ? 'Great Job!' : 'Keep Practicing!'}
                </h2>
                <p style={{ color: 'var(--mist)', fontSize: '15px', marginBottom: '32px' }}>
                  You scored <strong style={{ color: 'var(--ink)' }}>{score}/{QUIZ_QUESTIONS.length}</strong> on today's post-class quiz.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={resetQuiz}
                    className="btn-primary">Try Again</motion.button>
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                    className="btn-ghost">View Explanations</motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
