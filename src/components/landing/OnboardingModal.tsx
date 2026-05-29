'use client'

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, ArrowRight, AlertCircle, Mail } from 'lucide-react'
import Link from 'next/link'
import CCAILogo from '../brand/CCAILogo'
import NeuralInput from '../effects/NeuralInput'
import api from '@/lib/api'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [isSent, setIsSent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  const isFormValid = () => {
    return (
      formData.name.trim().length > 1 &&
      validateEmail(formData.email)
    )
  }

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['3deg', '-3deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-3deg', '3deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    
    if (!validateEmail(formData.email)) {
      setEmailError(true)
      return
    }
    
    if (!isFormValid()) return;

    setIsSubmitting(true)
    
    try {
      await api.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      })
      setIsSent(true)
    } catch (error: any) {
      if (error.response?.status === 409) {
        setApiError('conflict')
      } else {
        setApiError('general')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed
      setTimeout(() => {
        setIsSent(false)
        setEmailError(false)
        setApiError(null)
        setFormData({ name: '', email: '' })
      }, 300)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const labelStyle = { 
    display: 'block', 
    fontSize: '11px', 
    fontWeight: 800, 
    color: 'var(--mist)', 
    textTransform: 'uppercase' as const, 
    letterSpacing: '0.8px', 
    marginBottom: '6px' 
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
           style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}
           onClick={onClose}
        >
          <motion.div
             initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }}
             onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0) }} onClick={(e) => e.stopPropagation()}
             style={{ rotateX, rotateY, transformStyle: 'preserve-3d', background: '#ffffff', width: '100%', maxWidth: '420px', borderRadius: '16px', padding: '32px', position: 'relative', display: 'flex', flexDirection: 'column', margin: 'auto', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#888', zIndex: 10, padding: '12px', transition: 'all 0.2s' }}>
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div key="form" initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column' }}>
                  
                  {apiError === 'general' && (
                    <div style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
                      <AlertCircle size={16} /> Something went wrong. Please try again.
                    </div>
                  )}

                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '12px' }}><CCAILogo size={32} variant="light" /></div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 900, color: '#000000', marginBottom: '4px', letterSpacing: '-1px' }}>Join the Circle</h2>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#666666', fontSize: '14px', fontWeight: 500 }}>Start your journey with CC&gt;AI.</p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* NAME */}
                    <div>
                      <label style={{ ...labelStyle, color: '#666666', fontFamily: 'DM Sans, sans-serif' }}>Full Name</label>
                      <NeuralInput
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{ padding: '14px 20px', fontSize: '15px', color: '#000000', background: '#f5f5f5', border: '1px solid #e0e0e0' }}
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label style={{ ...labelStyle, color: '#666666', fontFamily: 'DM Sans, sans-serif' }}>Email Address</label>
                      <NeuralInput
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        isError={emailError || apiError === 'conflict'}
                        onChange={e => {
                          setFormData({ ...formData, email: e.target.value })
                          setEmailError(false)
                          if (apiError === 'conflict') setApiError(null)
                        }}
                        style={{ padding: '14px 20px', fontSize: '15px', color: '#000000', background: '#f5f5f5', border: '1px solid #e0e0e0' }}
                      />
                      {emailError && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: 'DM Sans, sans-serif', color: '#ff4d4d', fontSize: '12px', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={14} /> Please enter a valid email address
                        </motion.p>
                      )}
                      {apiError === 'conflict' && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: 'DM Sans, sans-serif', color: '#ff4d4d', fontSize: '12px', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={14} /> 
                          An account with this email already exists.{' '}
                          <Link href="/login" onClick={onClose} style={{ color: 'var(--violet)', textDecoration: 'none', marginLeft: '4px' }}>Sign in instead &rarr;</Link>
                        </motion.p>
                      )}
                    </div>

                    <motion.button 
                      type="submit"
                      whileHover={isFormValid() ? { scale: 1.02 } : {}} 
                      whileTap={isFormValid() ? { scale: 0.98 } : {}} 
                      disabled={!isFormValid() || isSubmitting}
                      style={{ fontFamily: 'DM Sans, sans-serif', marginTop: '8px', background: isFormValid() ? 'var(--violet)' : '#e0e0e0', color: isFormValid() ? 'white' : '#888888', border: 'none', padding: '16px 36px', borderRadius: '9999px', fontWeight: 800, fontSize: '16px', cursor: isFormValid() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s', overflow: 'hidden' }}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Account'}
                      {isFormValid() && !isSubmitting && (
                        <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                          <motion.div variants={{ initial: { x: 0, opacity: 1 }, hover: { x: 40, opacity: 0 } }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowRight size={20} />
                          </motion.div>
                          <motion.div variants={{ initial: { x: -40, opacity: 0 }, hover: { x: 0, opacity: 1 } }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowRight size={20} />
                          </motion.div>
                        </div>
                      )}
                    </motion.button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Link href="/login" onClick={onClose} style={{ fontFamily: 'DM Sans, sans-serif', color: '#666666', fontSize: '14px', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
                      Already have an account? <span style={{ color: 'var(--violet)', fontWeight: 600 }}>Sign in &rarr;</span>
                    </Link>
                  </div>
                  
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '340px' }}>
                  <div style={{ marginBottom: '24px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(77, 63, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--violet)' }}>
                    <Mail size={48} />
                  </div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#000000', marginBottom: '12px' }}>Check your email</h2>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#666666', fontSize: '15px', lineHeight: 1.6, marginBottom: '8px' }}>
                    We've sent a verification link to <strong>{formData.email}</strong>. Click it to set your password and get started.
                  </p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#999999', fontSize: '12px', marginBottom: '32px' }}>
                    Didn't receive it? Check your spam folder.
                  </p>
                  <button onClick={onClose} style={{ fontFamily: 'DM Sans, sans-serif', background: 'var(--violet)', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(77, 63, 255, 0.2)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>Got it</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
