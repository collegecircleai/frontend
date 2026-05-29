'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Sign Out",
  message = "Are you sure you want to sign out? Your session will be ended.",
  confirmText = "Sign Out",
  cancelText = "Cancel"
}: ConfirmModalProps) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkTheme = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              zIndex: 9998,
              cursor: 'pointer'
            }}
          />

          {/* Modal Container */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: '90%',
                maxWidth: '420px',
                pointerEvents: 'auto',
                position: 'relative'
              }}
            >
              {/* Glow Effect (Dark Mode Only) */}
              {isDark && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-1px',
                    background: 'linear-gradient(135deg, rgba(77, 63, 255, 0.4), rgba(0, 200, 150, 0.4))',
                    borderRadius: '24px',
                    filter: 'blur(20px)',
                    zIndex: -1,
                    opacity: 0.5
                  }}
                />
              )}

              {/* Main Content Card */}
              <div
                style={{
                  background: isDark 
                    ? 'rgba(15, 15, 22, 0.95)' 
                    : 'rgba(255, 255, 255, 0.98)',
                  border: isDark 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow: isDark 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(12px)',
                  textAlign: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'transparent',
                    border: 'none',
                    color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                    e.currentTarget.style.color = isDark ? '#fff' : '#000'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
                  }}
                >
                  <X size={18} />
                </button>

                {/* Icon Circle */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'rgba(77, 63, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#4D3FFF'
                  }}
                >
                  <LogOut size={28} />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: isDark ? '#fff' : '#0B0B12',
                    marginBottom: '12px',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {title}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    color: isDark ? 'var(--mist)' : 'rgba(11, 11, 18, 0.6)',
                    lineHeight: '1.6',
                    marginBottom: '32px'
                  }}
                >
                  {message}
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '14px',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                      background: 'transparent',
                      color: isDark ? '#fff' : '#0B0B12',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '14px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #4D3FFF, #3b2fff)',
                      color: '#fff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px -6px rgba(77, 63, 255, 0.4)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(77, 63, 255, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 8px 20px -6px rgba(77, 63, 255, 0.4)'
                    }}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null

  return createPortal(modalContent, document.body)
}
