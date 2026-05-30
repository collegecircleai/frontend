import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Moon, Sun, Menu, X } from 'lucide-react'
import CCAILogo from '../brand/CCAILogo'

export default function Header({ onGetStarted }: { onGetStarted?: () => void }) {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('cc-ai-theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      // Force Light Theme as default regardless of system settings
      setTheme('light')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('cc-ai-theme', newTheme)
  }

  // Use springs for ultra-smooth physical transition
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Transform values for the floating capsule effect
  const headerWidth = useTransform(smoothScrollY, [0, 200], ['100%', '92%'])
  const headerTop = useTransform(smoothScrollY, [0, 200], ['0px', '16px'])
  const headerRadius = useTransform(smoothScrollY, [0, 200], ['0px', '24px'])
  // Mobile-first fluid padding clamps! (Desktop keeps 60px, Phones shrink strictly to 16px)
  const headerPadding = useTransform(smoothScrollY, [0, 200], ['0 clamp(16px, 5vw, 60px)', '0 clamp(12px, 3vw, 32px)'])
  const navGap = useTransform(smoothScrollY, [0, 200], ['32px', '20px'])

  const navItems = [
    { label: 'How it Works', href: '/preview#how-it-works' },
    { label: 'Features', href: '/preview#features' },
    { label: 'Personalisation', href: '/preview#personalisation' },
    { label: 'Student Community', href: '/student-community' }
  ]

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50)
    })
  }, [scrollY])

  return (
    <motion.header 
      style={{
        position: 'fixed',
        left: '50%',
        x: '-50%',
        top: headerTop,
        width: headerWidth,
        height: '80px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: headerPadding,
        background: isScrolled 
          ? 'rgba(var(--header-bg), 0.75)' 
          : 'rgba(var(--header-bg), 0.9)',
        backdropFilter: 'blur(24px) saturate(200%)',
        border: '1px solid var(--border-light)',
        borderRadius: headerRadius,
        boxShadow: isScrolled ? '0 15px 35px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-start', flex: 1 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <CCAILogo />
          </motion.div>
        </Link>
      </div>

      <nav 
        className="mobile-hide"
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
          flex: '0 1 auto' 
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {navItems.map((item, idx) => (
          <motion.div
            key={item.label}
            style={{ 
              position: 'relative', 
              padding: '8px 0',
              marginRight: idx < navItems.length - 1 ? navGap : 0
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
          >
            <Link href={item.href} style={{
              textDecoration: 'none',
              color: 'var(--ink)',
              fontSize: '14px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              opacity: hoveredIndex === idx ? 1 : 0.6,
              transition: 'opacity 0.3s ease'
            }}>
              {item.label}
            </Link>
            
            {hoveredIndex === idx && (
              <motion.div
                layoutId="nav-underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--violet)',
                  borderRadius: '1px'
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </motion.div>
        ))}
      </nav>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        gap: 'clamp(6px, 1.5vw, 12px)', 
        flex: 1 
      }}>
        {/* Theme Toggle Button */}
        {mounted && (
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(139, 128, 249, 0.15)' }}
            whileTap={{ scale: 0.9 }}
            style={{
              backgroundColor: 'rgba(139, 128, 249, 0)', // Fix: 'transparent' keyword crashes Framer interpolator
              border: '1px solid var(--border)',
              borderRadius: '12px',
              width: '36px', // Slightly smaller on mobile
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink)',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ y: 20, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        )}

        {/* Premium Mobile Menu Toggle */}
        <motion.button
          className="mobile-only"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--ink)',
            padding: '4px'
          }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>

        <Link href="/login" className="mobile-hide" style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '14px', fontWeight: 600, padding: '8px 16px' }}>
          Sign In
        </Link>

        <motion.button
          onClick={onGetStarted}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 8px 25px rgba(77, 63, 255, 0.3)' 
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'var(--violet)',
            color: 'white',
            border: 'none',
            padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 18px)', 
            borderRadius: '12px',
            fontSize: 'clamp(11px, 2.5vw, 13px)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
            whiteSpace: 'nowrap'
          }}
        >
          Get Started
          <motion.span
            className="mobile-hide"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight size={14} />
          </motion.span>
        </motion.button>
      </div>

      {/* Premium Glass Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: -15, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.4 }}
            style={{
              position: 'absolute',
              top: '90px',
              left: '16px',
              right: '16px',
              background: 'rgba(var(--header-bg), 0.95)',
              backdropFilter: 'blur(30px) saturate(200%)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              transformOrigin: 'top center'
            }}
          >
            {navItems.map((item, idx) => (
              <Link 
                key={item.label} 
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  color: 'var(--ink)',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: idx < navItems.length - 1 ? '1px solid var(--border-light)' : 'none'
                }}
              >
                {item.label}
                <ArrowRight size={16} opacity={0.3} />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
