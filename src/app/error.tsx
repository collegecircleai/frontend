'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCcw, Home, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an analytics provider in production
    console.error('Landing Page Error Caught:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#050510',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Ambience Fix */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(110, 80, 255, 0.1) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 1, textAlign: 'center',
          maxWidth: '480px', width: '100%',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '32px', padding: '60px 40px',
          backdropFilter: 'blur(30px)'
        }}
      >
        <div style={{
          width: '80px', height: '80px', borderRadius: '24px',
          background: 'rgba(255, 60, 60, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ff4d4d', margin: '0 auto 32px auto',
          border: '1px solid rgba(255, 60, 60, 0.2)'
        }}>
          <ShieldAlert size={40} />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800,
          marginBottom: '16px', letterSpacing: '-0.02em'
        }}>
          Something slipped.
        </h1>
        
        <p style={{
          color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1.6,
          marginBottom: '40px'
        }}>
          The AI encountered a brief turbulence. Don't worry, your progress is safe.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '16px', borderRadius: '16px', background: 'var(--violet)',
              color: 'white', border: 'none', fontWeight: 600, fontSize: '15px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              cursor: 'pointer', transition: 'transform 0.2s ease'
            }}
          >
            <RefreshCcw size={18} /> Try Again
          </button>
          
          <Link
            href="/"
            style={{
              padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)',
              color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, fontSize: '15px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              textDecoration: 'none', cursor: 'pointer'
            }}
          >
            <Home size={18} /> Back to Dashboard
          </Link>
        </div>

        <div style={{
          marginTop: '40px', fontSize: '11px', color: 'rgba(255,255,255,0.2)',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em'
        }}>
          Error ID: {error.digest || 'Internal Turbulence'}
        </div>
      </motion.div>
    </div>
  )
}
