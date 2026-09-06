import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Moon, Sun, Menu, X } from 'lucide-react'
import CCAILogo from '../brand/CCAILogo'

export default function Header({ onGetStarted }: { onGetStarted?: () => void }) {
  const router = useRouter()
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted()
    } else {
      router.push('/login')
    }
  }

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
    { label: 'About', href: '/about' },
    { label: 'Student Community', href: '/student-community' }
  ]

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50)
    })
  }, [scrollY])

  return (
    <motion.header
      suppressHydrationWarning
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
      <style jsx global>{`
        .header-nav-link {
          color: rgba(30, 30, 36, 0.72) !important;
          font-size: 15.5px !important;
          font-weight: 500;
          letter-spacing: 0.01em;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s ease, opacity 0.2s ease;
        }
        .header-nav-link:hover,
        .header-nav-link.active {
          color: #111115 !important;
        }

        [data-theme='dark'] .header-nav-link {
          color: rgba(240, 238, 248, 0.75) !important;
        }
        [data-theme='dark'] .header-nav-link:hover,
        [data-theme='dark'] .header-nav-link.active {
          color: #ffffff !important;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.25);
        }

        .header-signin-link {
          color: #1e1e24 !important;
          font-size: 15.5px !important;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .header-signin-link:hover {
          color: var(--violet, #4D3FFF) !important;
        }

        [data-theme='dark'] .header-signin-link {
          color: #f3effc !important;
        }
        [data-theme='dark'] .header-signin-link:hover {
          color: #a098ff !important;
        }

        /* ── Exact Uiverse 3D Rocker Switch ── */
        .uiverse-3d-switch {
          font-size: 13.5px;
          position: relative;
          display: inline-block;
          width: 5em;
          height: 2.5em;
          user-select: none;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), filter 0.2s ease;
        }

        .uiverse-3d-switch:hover {
          transform: scale(1.03);
          filter: brightness(1.05);
        }

        .uiverse-3d-switch:active {
          transform: scale(0.97);
        }

        .uiverse-3d-switch .cb {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }

        .uiverse-3d-switch .toggle {
          position: absolute;
          cursor: pointer;
          width: 100%;
          height: 100%;
          background-color: #E2E8F0;
          border-radius: 0.25em;
          transition: background-color 0.25s ease, outline-color 0.25s ease, box-shadow 0.25s ease;
          overflow: hidden;
          /* Refined soft slate border instead of solid black */
          outline: 1.5px solid #CBD5E1;
          box-shadow: 
            -0.25em 0 0 0 #CBD5E1, 
            -0.25em 0.25em 0 0 #CBD5E1,
            0.25em 0 0 0 #CBD5E1, 
            0.25em 0.25em 0 0 #CBD5E1, 
            0 0.25em 0 0 #CBD5E1,
            0 3px 8px rgba(0, 0, 0, 0.06);
        }

        .uiverse-3d-switch .toggle > .left {
          position: absolute;
          display: flex;
          width: 50%;
          height: 88%;
          background-color: #f5f5f7;
          color: #222226;
          left: 0;
          bottom: 0;
          align-items: center;
          justify-content: center;
          transform-origin: right;
          transform: rotateX(10deg);
          transform-style: preserve-3d;
          transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms ease, background-color 200ms ease;
        }

        .uiverse-3d-switch .left::before {
          position: absolute;
          content: "";
          width: 100%;
          height: 100%;
          background-color: rgb(215, 215, 220);
          transform-origin: center left;
          transform: rotateY(90deg);
        }

        .uiverse-3d-switch .left::after {
          position: absolute;
          content: "";
          width: 100%;
          height: 100%;
          background-color: rgb(130, 130, 138);
          transform-origin: center bottom;
          transform: rotateX(90deg);
        }

        .uiverse-3d-switch .toggle > .right {
          position: absolute;
          display: flex;
          width: 50%;
          height: 88%;
          background-color: #f5f5f7;
          color: rgb(185, 185, 195);
          right: 1px;
          bottom: 0;
          align-items: center;
          justify-content: center;
          transform-origin: left;
          transform: rotateX(10deg) rotateY(-45deg);
          transform-style: preserve-3d;
          transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms ease, background-color 200ms ease;
        }

        .uiverse-3d-switch .right::before {
          position: absolute;
          content: "";
          width: 100%;
          height: 100%;
          background-color: rgb(215, 215, 220);
          transform-origin: center right;
          transform: rotateY(-90deg);
        }

        .uiverse-3d-switch .right::after {
          position: absolute;
          content: "";
          width: 100%;
          height: 100%;
          background-color: rgb(130, 130, 138);
          transform-origin: center bottom;
          transform: rotateX(90deg);
        }

        /* ── Active Face Illuminations ── */
        .uiverse-3d-switch input:not(:checked) + .toggle > .left {
          color: #f59e0b;
          filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.4));
        }

        .uiverse-3d-switch input:checked + .toggle > .left {
          transform: rotateX(10deg) rotateY(45deg);
          color: rgb(185, 185, 195);
        }

        .uiverse-3d-switch input:checked + .toggle > .right {
          transform: rotateX(10deg) rotateY(0deg);
          color: #a78bfa;
        }

        /* ── Dark Mode: Crisp Violet / Obsidian Outer Bezel ── */
        [data-theme='dark'] .uiverse-3d-switch .toggle {
          background-color: #0c0b16;
          outline: 1.5px solid rgba(139, 128, 249, 0.4);
          box-shadow: 
            -0.25em 0 0 0 #1b192e, 
            -0.25em 0.25em 0 0 #1b192e,
            0.25em 0 0 0 #1b192e, 
            0.25em 0.25em 0 0 #1b192e, 
            0 0.25em 0 0 #1b192e,
            0 0 16px rgba(139, 128, 249, 0.35);
        }

        [data-theme='dark'] .uiverse-3d-switch .toggle > .left {
          background-color: #24223b;
          color: rgba(255, 255, 255, 0.35);
        }

        [data-theme='dark'] .uiverse-3d-switch .left::before {
          background-color: #19172a;
        }

        [data-theme='dark'] .uiverse-3d-switch .left::after {
          background-color: #0d0c18;
        }

        [data-theme='dark'] .uiverse-3d-switch .toggle > .right {
          background-color: #2b2847;
          color: rgba(255, 255, 255, 0.35);
        }

        [data-theme='dark'] .uiverse-3d-switch .right::before {
          background-color: #19172a;
        }

        [data-theme='dark'] .uiverse-3d-switch .right::after {
          background-color: #0d0c18;
        }

        [data-theme='dark'] .uiverse-3d-switch input:not(:checked) + .toggle > .left {
          color: #fbbf24;
          filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.6));
        }

        [data-theme='dark'] .uiverse-3d-switch input:checked + .toggle > .left {
          color: rgba(255, 255, 255, 0.25);
          filter: none;
        }

        [data-theme='dark'] .uiverse-3d-switch input:checked + .toggle > .right {
          color: #c4b5fd;
          text-shadow: 0 0 10px rgba(196, 181, 253, 0.85);
          filter: drop-shadow(0 0 6px rgba(196, 181, 253, 0.7));
        }
      `}</style>

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
            <Link
              href={item.href}
              className={`header-nav-link ${hoveredIndex === idx ? 'active' : ''}`}
            >
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
        {/* Exact 3D Mechanical Rocker Theme Switch from provided code */}
        <label
          className="uiverse-3d-switch"
          aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          <input
            type="checkbox"
            className="cb"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          <div className="toggle">
            <span className="left" title="Light Theme">
              <Sun size={15} strokeWidth={2.4} />
            </span>
            <span className="right" title="Dark Theme">
              <Moon size={14} strokeWidth={2.4} />
            </span>
          </div>
        </label>

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

        <Link href="/login" className="mobile-hide header-signin-link" style={{ padding: '8px 16px' }}>
          Sign In
        </Link>

        <motion.button
          onClick={handleGetStarted}
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
                className="header-nav-link"
                style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: idx < navItems.length - 1 ? '1px solid var(--border-light)' : 'none'
                }}
              >
                {item.label}
                <ArrowRight size={16} opacity={0.4} />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
