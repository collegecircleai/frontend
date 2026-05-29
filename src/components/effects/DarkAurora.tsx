'use client'

import { useEffect, useState } from 'react'

/**
 * DarkAurora — Animated neon aurora background for dark mode.
 * Creates floating gradient orbs that drift slowly across the viewport,
 * inspired by premium crypto/SaaS dark-mode designs.
 *
 * Renders nothing when the theme is 'light'.
 */
export default function DarkAurora() {
  const [isDark, setIsDark] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
      setIsMobile(window.innerWidth < 768)
    }
    check()

    // Watch for theme changes
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    window.addEventListener('resize', check)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [])

  if (!isDark) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Orb 4 — High-Intensity Anchor — The only one shown on mobile for performance */}
      <div
        style={{
          position: 'absolute',
          width: isMobile ? '100vw' : '40vw',
          height: '90vh',
          top: '5%',
          left: isMobile ? '-20%' : '-15%',
          borderRadius: '20% 80% 80% 20% / 50% 50% 50% 50%',
          background: 'radial-gradient(circle at 20% 50%, rgba(77, 63, 255, 0.38) 0%, transparent 70%)',
          filter: 'blur(70px)',
          opacity: 0.7,
          willChange: 'transform'
        }}
      />

      {!isMobile && (
        <>
          {/* Orb 1 — Top-right magenta / pink */}
          <div
            style={{
              position: 'absolute',
              width: '70vw',
              height: '60vw',
              top: '-20%',
              right: '-15%',
              borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)',
              filter: 'blur(80px)',
              transformOrigin: 'center center',
              opacity: 0.5,
              willChange: 'transform'
            }}
          />

          {/* Orb 2 — Bottom-left cyan / blue */}
          <div
            style={{
              position: 'absolute',
              width: '75vw',
              height: '65vw',
              bottom: '-15%',
              left: '-12%',
              borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.06) 40%, transparent 70%)',
              filter: 'blur(80px)',
              transformOrigin: 'center center',
              opacity: 0.5,
              willChange: 'transform'
            }}
          />

          {/* Orb 3 — Center Cyber Teal Core */}
          <div
            style={{
              position: 'absolute',
              width: '50vw',
              height: '50vw',
              top: '25%',
              left: '25%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 255, 190, 0.12) 0%, transparent 60%)',
              filter: 'blur(60px)',
              opacity: 0.6,
              willChange: 'transform'
            }}
          />

          {/* Orb 5 — High-Intensity Right Anchor */}
          <div
            style={{
              position: 'absolute',
              width: '40vw',
              height: '80vh',
              top: '10%',
              right: '-15%',
              borderRadius: '80% 20% 20% 80% / 50% 50% 50% 50%',
              background: 'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
              filter: 'blur(70px)',
              opacity: 0.7,
              willChange: 'transform'
            }}
          />

          {/* Orb 6 — The "Golden Glimmer" */}
          <div
            style={{
              position: 'absolute',
              width: '35vw',
              height: '35vw',
              top: '-8%',
              right: '8%',
              borderRadius: '30% 70% 20% 80% / 50% 30% 70% 50%', 
              background: 'radial-gradient(circle, rgba(255, 190, 0, 0.1) 0%, transparent 65%)',
              filter: 'blur(65px)',
              opacity: 0.4
            }}
          />
        </>
      )}

      {/* Subtle bottom edge glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 10%, rgba(139, 92, 246, 0.15) 50%, transparent 90%)',
        }}
      />
    </div>
  )
}
