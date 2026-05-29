import React, { memo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react'

// Memoize letters to prevent expensive text re-renders
const StaggeredText = memo(function StaggeredText({ text, delay = 0, italic = false }: { text: string, delay?: number, italic?: boolean }) {
  const letters = Array.from(text)
  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={{
        show: { transition: { staggerChildren: 0.03, delayChildren: delay } }
      }}
      style={{ display: 'inline-block' }}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
          }}
          style={{ 
            display: 'inline-block', 
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            fontStyle: italic ? 'italic' : 'normal',
            color: italic ? 'var(--violet)' : 'inherit'
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
})

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 3.8 }
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

interface HeroProps {
  onGetStarted?: () => void
}

const Hero = memo(function Hero({ onGetStarted }: HeroProps) {
  const [isDesktop, setIsDesktop] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  if (isDesktop) {
    return (
      <section 
        style={{
          position: 'relative',
          minHeight: '870px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: 'var(--pearl)',
          width: '100%'
        }}
      >
        {/* Background Image Layer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            height: '100%'
          }}>
            <div style={{ 
              gridColumn: 'span 7', 
              position: 'relative', 
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <motion.img 
                key={isMounted ? 'hero-ready' : 'hero-waiting'}
                initial={{ 
                  opacity: 0.2,
                  scale: 1.05,
                  clipPath: 'circle(0% at 30% 50%)',
                  filter: 'brightness(1.5) blur(10px)'
                }}
                animate={isMounted ? { 
                  opacity: 1, 
                  scale: 1,
                  clipPath: 'circle(150% at 30% 50%)',
                  filter: 'var(--hero-img-filter) blur(0px)'
                } : {}}
                transition={{ 
                  duration: 2.5, 
                  ease: [0.16, 1, 0.3, 1], 
                  delay: 3.5 
                }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWpzbPp1-YwGt6q-tvN4Gdt0ZCho1Pq_BWxy1-IAeWhBteRfnFen0EgdLfimLBGHUUfuZhjYa92xvRM4dIoyjo5eYXItcU2uGWX4Z1alJIUuDOpOCgOL9hzcYYXck-5sdD-KzzjdsNYjB-dre5gfXrh8jDLMWkalHZkRx94pr5tlrjP4pdoFT_WwNcFrINcupIv0C8QSjTl_kbCwJ3F3kpRVe4g01edF-WBYiqEvzsmQaKxcfivAyZSBmVPUa1UlZuuaqthUXVdWq3"
                alt="Student Background"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  maskImage: 'var(--hero-mask)',
                  WebkitMaskImage: 'var(--hero-mask)',
                  position: 'absolute',
                  inset: 0
                }}
              />
              {/* Edge Blender Overlay (Dark Mode Only Sync) */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '25%',
                height: '100%',
                background: 'linear-gradient(to right, transparent, var(--pearl))',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
            </div>
            <div style={{ gridColumn: 'span 5', background: 'var(--pearl)' }} />
          </div>
        </div>

        {/* Content Layer */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 80px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            width: '100%',
            transform: 'translateY(-60px)' // Move up slightly
          }}>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              style={{ gridColumn: '7 / span 6' }} // Move further right
            >
              <motion.span 
                variants={fadeInUp}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                  color: 'var(--violet)', letterSpacing: '0.15em', textTransform: 'uppercase',
                  marginBottom: '24px', display: 'block'
                }}
              >
                Academic Intelligence for the New Era
              </motion.span>
              
              <motion.h1 style={{
                fontFamily: 'var(--font-display)', fontSize: '72px', fontWeight: 900,
                lineHeight: 1.1, color: 'var(--ink)', marginBottom: '32px', letterSpacing: '-0.02em'
              }}>
                <StaggeredText text="Learn Anything." delay={0.2} /><br />
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }
                  }}
                  style={{ color: 'var(--violet)', fontStyle: 'italic', fontWeight: 'normal', fontFamily: 'var(--font-display)' }}
                >
                  Instantly.
                </motion.span>
              </motion.h1>

              <motion.p variants={fadeInUp} style={{
                fontSize: '18px', color: 'var(--mist)', maxWidth: '540px', 
                marginBottom: '48px', lineHeight: 1.7
              }}>
                A digital sanctum for the modern scholar. CC&gt;AI synthesizes centuries of scholastic rigor with the precision of artificial intelligence.
              </motion.p>

              <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <motion.button
                  onClick={onGetStarted}
                  whileHover={{ scale: 1.05, x: 5, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'var(--violet)', color: 'white', border: 'none',
                    padding: '18px 40px', borderRadius: '18px', fontSize: '16px',
                    fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px',
                    cursor: 'pointer', boxShadow: '0 8px 25px rgba(77, 63, 255, 0.2)'
                  }}
                >
                  Get Started <ArrowRight size={20} />
                </motion.button>

                <div style={{
                  color: 'var(--mist)', fontSize: '16px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8
                }}>
                  See How It Works
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  // Original Mobile/Tablet Layout
  return (
    <main style={{
      flex: 1, minHeight: '100dvh', display: 'flex', flexDirection: 'column', 
      padding: '80px 24px', position: 'relative', zIndex: 1, gap: '60px',
      background: 'var(--pearl)', borderBottom: '1px solid var(--border)',
      alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Dynamic Grid: Stacks on Mobile, Split on Laptops */}
      <div style={{
        width: '100%', maxWidth: '1400px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '60px', alignItems: 'center'
      }}>
        
        {/* Left Column: Text */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ textAlign: 'center' as const }}>
          <motion.div variants={fadeInUp} style={{ marginBottom: '24px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
              color: 'var(--violet)', letterSpacing: '0.2em', textTransform: 'uppercase'
            }}>
              AI · ACADEMIC PLATFORM
            </span>
          </motion.div>

          <motion.h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 8vw, 84px)', fontWeight: 900,
            lineHeight: 1.05, color: 'var(--ink)', marginBottom: '32px', letterSpacing: '-0.02em'
          }}>
            <StaggeredText text="Learning," delay={0.2} /><br />
            <StaggeredText text="Redefined." delay={0.6} italic />
          </motion.h1>

          <motion.p variants={fadeInUp} style={{
            fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--mist)', maxWidth: '540px', 
            margin: '0 auto 48px auto', lineHeight: 1.7
          }}>
            Upload your syllabus. Get notes, quizzes, visuals, and full exam papers — instantly.
          </motion.p>

          <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05, x: 5, y: -5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'var(--violet)', color: 'white', border: 'none',
                padding: '18px 40px', borderRadius: '18px', fontSize: '16px',
                fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px',
                cursor: 'pointer', boxShadow: '0 8px 25px rgba(77, 63, 255, 0.2)'
              }}
            >
              Get Started <ArrowRight size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(var(--header-bg), 0.4)', color: 'var(--ink)',
                border: '1px solid var(--border)', padding: '18px 32px',
                borderRadius: '18px', fontSize: '16px', fontWeight: 600,
                cursor: 'pointer', backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease'
              }}
            >
              See How It Works
            </motion.button>
          </motion.div>

          {/* Social Proof Footer */}
          <motion.div variants={fadeInUp} style={{ marginTop: '64px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--mist)',
              display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'
            }}>
              Built by students
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column: Interaction Visual */}
        <div style={{ 
          display: 'flex', justifyContent: 'center', width: '100%',
          perspective: '1500px',
        }}>
          {/* Floating Wrapper with zero jitter */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ 
              width: '100%', maxWidth: '520px', 
              willChange: 'transform',
              filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.3))'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateX: 25, rotateY: -15, y: 60 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, y: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const dx = x - xc;
                const dy = y - yc;
                e.currentTarget.style.setProperty('--x', `${dx / 30}deg`);
                e.currentTarget.style.setProperty('--y', `${-dy / 30}deg`);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--x', '0deg');
                e.currentTarget.style.setProperty('--y', '0deg');
              }}
              style={{ 
                width: '100%', 
                transformStyle: 'preserve-3d',
                // @ts-ignore
                transform: 'rotateX(var(--y, 0deg)) rotateY(var(--x, 0deg)) translate3d(0,0,0)',
                transition: 'transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
                backfaceVisibility: 'hidden',
                outline: '1px solid transparent', // Anti-jitter buffer
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              <div style={{
                background: 'var(--deep)', borderRadius: '32px', padding: 'clamp(24px, 5vw, 40px)',
                width: '100%',
                border: '1px solid rgba(255,255,255,0.1)', position: 'relative',
                overflow: 'hidden',
                backfaceVisibility: 'hidden',
                outline: '1px solid transparent', // Anti-jitter buffer
                transform: 'translate3d(0,0,0)'
              }}>
                {/* PDF Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: 'var(--violet-pale)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'var(--violet)', flexShrink: 0,
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)'
                  }}>
                    <FileText size={28} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>syllabus.pdf</div>
                    <div style={{ fontSize: '14px', color: 'var(--mist)', marginTop: '4px' }}>Processing...</div>
                  </div>
                  <ArrowRight size={20} color="var(--violet)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                </div>

                {/* Smoother Divider using shadow-inset instead of background-border */}
                <div style={{ height: '0px', boxShadow: '0 0.5px 0 0 var(--border)', marginBottom: '32px', position: 'relative', zIndex: 2 }} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
                    color: 'var(--violet)', letterSpacing: '0.1em', marginBottom: '20px', textTransform: 'uppercase'
                  }}>
                    COURSE STRUCTURE
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      padding: '20px', background: 'var(--cream)',
                      borderRadius: '16px', fontSize: '15px', fontWeight: 500, color: 'var(--ink)',
                      boxShadow: 'inset 0 0 0 1px var(--border)'
                    }}>
                      Unit 1
                    </div>

                    <div style={{
                      padding: '20px', background: 'var(--violet-pale)', 
                      boxShadow: 'inset 0 0 0 1px var(--border)',
                      borderRadius: '16px'
                    }}>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)', marginBottom: '16px' }}>Unit 2</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '4px' }}>
                        {[
                          { t: 'Introduction to Economics', c: false },
                          { t: 'Demand & Supply', c: true },
                          { t: 'Market Equilibrium', c: false }
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {item.c ? <CheckCircle2 size={16} color="var(--jade)" style={{ flexShrink: 0 }} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mist)', flexShrink: 0 }} />}
                            <span style={{
                              fontSize: '14px', color: item.c ? 'var(--jade)' : 'var(--mist)',
                              fontWeight: item.c ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}>{item.t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  )
})

export default Hero
