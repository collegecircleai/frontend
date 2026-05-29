'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [phase, setPhase] = useState<'building' | 'portal' | 'done'>('building')
  const [stars, setStars] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mobile = window.innerWidth <= 768
    setIsMobile(mobile)
    document.body.style.overflow = 'hidden'

    // Performance-optimized star count for mobile
    const ambientCount = mobile ? 20 : 60
    const ingestCount = mobile ? 15 : 40

    const generatedStars = [
      ...Array.from({ length: ambientCount }).map((_, i) => ({
        id: `ambient-${i}`,
        type: 'ambient',
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 80 + 20,
        size: Math.random() * 1.5 + 0.5, // Slightly smaller for mobile performance
        speed: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 2
      })),
      ...Array.from({ length: ingestCount }).map((_, i) => ({
        id: `ingest-${i}`,
        type: 'ingestion',
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 50 + 100,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1.5 + 1,
        delay: Math.random() * 2
      }))
    ]
    setStars(generatedStars)
    
    const portalTimer = setTimeout(() => {
      setPhase('portal')
    }, 2800)

    const doneTimer = setTimeout(() => {
      setPhase('done')
      setIsVisible(false)
      document.body.style.overflow = ''
    }, 3800)

    return () => {
      clearTimeout(portalTimer)
      clearTimeout(doneTimer)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
           style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'var(--pearl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {mounted && (
            <>
              {/* Warp Speed Particle Layer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0
          }}>
            {stars.map((star, i) => (
              <motion.div
                key={star.id}
                initial={{ 
                  x: Math.cos(star.angle) * star.distance + 'vw', 
                  y: Math.sin(star.angle) * star.distance + 'vh',
                  opacity: 0,
                  scale: 0
                }}
                animate={
                  phase === 'building' 
                    ? (star.type === 'ingestion' ? {
                        x: 0, // Ingest into center
                        y: 0,
                        opacity: [0, 0.8, 0],
                        scale: [0.2, 1, 0],
                      } : {
                        x: Math.cos(star.angle) * (star.distance * 0.1) + 'vw',
                        y: Math.sin(star.angle) * (star.distance * 0.1) + 'vh',
                        opacity: [0, 0.4, 0.4, 0],
                        scale: [0.5, 1, 1, 0.5],
                      })
                    : {
                        x: Math.cos(star.angle) * 200 + 'vw',
                        y: Math.sin(star.angle) * 200 + 'vh',
                        opacity: 1,
                        scaleX: 15,
                        scaleY: 0.5
                      }
                }
                transition={
                  phase === 'building' 
                    ? (star.type === 'ingestion' ? {
                        duration: star.speed,
                        repeat: 2, // Ingest a few times
                        ease: "circIn",
                        delay: star.delay
                      } : {
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: star.delay
                      })
                    : {
                        duration: 0.8,
                        ease: [0.64, 0, 0.78, 0]
                      }
                }
                style={{
                  position: 'absolute',
                  left: '65%', // vanishing point aligned with Jade Eye
                  top: '40%',
                  width: star.size + 'px',
                  height: star.size + 'px',
                  borderRadius: '50%',
                  background: i % 2 === 0 ? 'var(--violet)' : 'var(--jade)',
                  boxShadow: `0 0 10px ${i % 2 === 0 ? 'var(--violet)' : 'var(--jade)'}`,
                  transformOrigin: 'center'
                }}
              />
            ))}
          </div>

          {/* Background Ambient Glow */}
          <motion.div 
            animate={{
              scale: phase === 'portal' ? 1.5 : 1,
              opacity: phase === 'portal' ? 0 : 1
            }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 65% 40%, rgba(77, 63, 255, 0.08) 0%, transparent 60%)',
              zIndex: 1
            }}
          />

          {/* Central Logo Construction */}
          <motion.div
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              zIndex: 10,
              position: 'relative'
            }}
          >
            <motion.svg 
              viewBox="0 0 80 80" 
              fill="none" 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={
                phase === 'building' 
                  ? { scale: 1, opacity: 1, x: isMobile ? 8 : -3 } 
                  : { scale: isMobile ? 35 : 60, opacity: 0, x: isMobile ? 8 : -3 }
              }
              transition={
                phase === 'building'
                  ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 1.1, ease: [0.85, 0, 0.15, 1] } 
              }
              style={{ 
                width: 'clamp(120px, 25vw, 180px)', 
                height: 'clamp(120px, 25vw, 180px)',
                filter: isMobile ? 'none' : 'drop-shadow(0 30px 40px rgba(77, 63, 255, 0.2))',
                transformOrigin: '65% 40%',
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
            >
              <motion.circle 
                cx="32" cy="40" r="28" 
                stroke="var(--violet)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, fill: 'rgba(77, 63, 255, 0)' }}
                animate={{ pathLength: 1, fill: 'rgba(77, 63, 255, 1)' }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
              
              <motion.circle 
                cx="52" cy="32" r="20" 
                fill="var(--pearl)" 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                style={{ transformOrigin: '52px 32px' }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }} 
              />
              <motion.circle 
                cx="52" cy="32" r="14" 
                fill="var(--pearl)" 
              />

              <motion.circle 
                cx="52" cy="32" r="9" 
                stroke="var(--jade)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, fill: 'rgba(0, 200, 150, 0)', scale: 0.8 }}
                animate={{ pathLength: 1, fill: 'rgba(0, 200, 150, 0.9)', scale: 1 }}
                style={{ transformOrigin: '52px 32px' }}
                transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }} 
              />
              
              <motion.circle 
                cx="32" cy="40" r="10" 
                fill="var(--pearl)" 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                style={{ transformOrigin: '32px 40px' }}
                transition={{ duration: 0.5, delay: 1.1, ease: 'easeOut' }} 
              />
              <motion.circle 
                cx="52" cy="32" r="4" 
                fill="var(--pearl)" 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                style={{ transformOrigin: '52px 32px' }}
                transition={{ duration: 0.4, delay: 1.25, ease: 'easeOut' }} 
              />
            </motion.svg>
            
            <motion.div 
              animate={
                phase === 'building'
                  ? { opacity: 1, y: 0, x: isMobile ? -4 : -16 }
                  : { opacity: 0, y: 40, x: isMobile ? -4 : -16, filter: 'blur(10px)' } 
              }
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              marginTop: '4px' // Brought very slightly closer
            }}>
              <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={phase === 'building' ? { opacity: 1, y: 0 } : undefined}
                 transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 style={{ 
                   fontFamily: 'var(--font-display)', 
                   fontWeight: 800, 
                   fontSize: 'clamp(40px, 8vw, 64px)', 
                   color: 'var(--ink)', 
                   letterSpacing: '-0.03em',
                   marginRight: '-0.03em',
                   lineHeight: 1,
                   transform: 'translateY(-2px)' // Optical lift
                 }}
              >
                 CC<span style={{ color: 'var(--violet)', marginLeft: '6px' }}>&gt;AI</span>
              </motion.div>

              <motion.div
                 initial={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                 animate={phase === 'building' ? { opacity: 1, filter: 'blur(0px)', y: 0 } : undefined}
                 transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 style={{ 
                   fontFamily: 'var(--font-mono)', 
                   fontWeight: 500, 
                   fontSize: 'clamp(10px, 2.5vw, 16px)', 
                   color: 'var(--mist)', 
                   letterSpacing: '0.32em', // Optically tighter
                   marginRight: '-0.32em',
                   marginTop: '10px', // Closer to title
                   textTransform: 'uppercase'
                 }}
              >
                 College Circle AI
              </motion.div>
            </motion.div>
          </motion.div>
        </>)}
      </motion.div>
      )}
    </AnimatePresence>
  )
}
