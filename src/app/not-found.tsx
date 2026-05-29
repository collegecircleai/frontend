'use client'

import { motion } from 'framer-motion'
import { Home, Compass } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
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
      {/* Background Ambience */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 30% 30%, rgba(110, 80, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(77, 63, 255, 0.05) 0%, transparent 50%)',
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 1, textAlign: 'center',
          maxWidth: '480px', width: '100%',
        }}
      >
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--violet)', margin: '0 auto 40px auto',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 0 30px rgba(110, 80, 255, 0.1)'
        }}>
          <Compass size={48} />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '64px', fontWeight: 900,
          marginBottom: '16px', letterSpacing: '-0.04em', color: 'white'
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: 'white'
        }}>
          Destination Lost.
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.4)', fontSize: '16px', lineHeight: 1.6,
          marginBottom: '48px'
        }}>
          You've reached a part of the nebula that hasn't been mapped yet. 
          Let's get you back to your syllabus.
        </p>

        <Link
          href="/"
          style={{
            padding: '18px 40px', borderRadius: '20px', background: 'var(--violet)',
            color: 'white', border: 'none', fontWeight: 700, fontSize: '16px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            textDecoration: 'none', cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(110, 80, 255, 0.2)'
          }}
        >
          <Home size={20} /> Return to Learning
        </Link>
      </motion.div>
    </div>
  )
}
