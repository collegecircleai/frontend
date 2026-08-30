'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLenis } from 'lenis/react'
import Link from 'next/link'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import DarkAurora from '@/components/effects/DarkAurora'
import ElegantParticles from '@/components/effects/ElegantParticles'
import ComponentErrorBoundary from '@/components/effects/ErrorBoundary'
// @ts-ignore
import ScrollExpand from '@/components/ScrollExpand'
import DriftWall from '@/components/DriftWall'
import { SkewedCarousel } from '@/components/SkewedCarousel'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import ImagesReveal from '@/components/animata/image/images-reveal'
import { HoverEffectGrid } from '@/components/HoverEffectGrid'
import { StartupExposureHero } from '@/components/StartupExposureHero'
import { EcosystemAccessCards } from '@/components/EcosystemAccessCards'
import { Sun, ArrowRight, Terminal, Network, Rocket, Code2, Users, Compass, Zap, Shield, Crown, MessageSquare, Heart, Repeat, Flame, Sparkles, Moon, Cpu, Briefcase, Library, Star, MapPin, Trophy, ArrowUpRight, BarChart2, GraduationCap, Share2, Box } from 'lucide-react'

export default function CommunityPage() {
  const lenis = useLenis()
  const [mounted, setMounted] = useState(false)
  const [activeTierModal, setActiveTierModal] = useState<string | null>(null)
  const [activePathway, setActivePathway] = useState<'builder' | 'creator'>('builder')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('cc-ai-theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Sync theme if Header changes it
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
          if (currentTheme) setTheme(currentTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('cc-ai-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const isDark = theme === 'dark';

  const c = {
    bg: isDark ? '#0A0A1E' : '#F7F6F2',
    text: isDark ? '#FFFFFF' : '#1A1A1E',
    text80: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
    text70: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    text60: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    text50: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    text40: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
    text30: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
    card: isDark ? 'rgba(15,15,20,0.8)' : 'rgba(255,255,255,0.9)',
    cardLight: isDark ? 'rgba(15,15,20,0.6)' : 'rgba(255,255,255,0.7)',
    border15: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
    border10: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    border08: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    border05: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    border03: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
    border02: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    gradBase: isDark ? 'rgba(15,15,20,1)' : 'rgba(247,246,242,1)',
    gradTop: isDark ? 'rgba(30,20,50,1)' : 'rgba(230,225,245,1)',
    overlay: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
    purpleHighlight: isDark ? 'rgba(60,40,100,0.4)' : 'rgba(139,128,249,0.1)',
    cardTransparent: isDark ? 'rgba(15,15,20,0)' : 'rgba(255,255,255,0)',
    inputBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
    headingGradient: isDark ? 'linear-gradient(135deg, #fff 0%, #9B90FF 100%)' : 'linear-gradient(135deg, #1A1A1E 0%, #7B6BFF 100%)',
    marqueeGradient: isDark ? 'linear-gradient(90deg, rgba(15,15,20,0) 0%, rgba(15,15,20,0.8) 50%, rgba(15,15,20,0) 100%)' : 'linear-gradient(90deg, rgba(247,246,242,0) 0%, rgba(247,246,242,0.8) 50%, rgba(247,246,242,0) 100%)',
    tierCardGradient: isDark ? 'linear-gradient(180deg, rgba(30,20,45,0.6) 0%, rgba(15,15,20,0.8) 100%)' : 'linear-gradient(180deg, rgba(245,243,248,0.9) 0%, rgba(255,255,255,1) 100%)',
  };



  useEffect(() => {
    if (activeTierModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [activeTierModal])

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <div
      className="content-wrapper"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: c.bg, color: c.text }}
    >
      <ComponentErrorBoundary>
        <div style={{ opacity: isDark ? 1 : 0.3, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <DarkAurora />
        </div>
        <ElegantParticles count={40} />
      </ComponentErrorBoundary>

      <ComponentErrorBoundary>
        <Header onGetStarted={() => window.location.href = '/login'} />
      </ComponentErrorBoundary>

      <main style={{ flex: 1, marginTop: '120px', position: 'relative', zIndex: 10 }}>

        {/* HERO SECTION */}
        <section style={{
          padding: '0 5%',
          paddingTop: '20px',
          marginBottom: '100px',
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          backgroundPosition: 'center center',
          overflowX: 'hidden'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '40px', width: '100%', zIndex: 2 }}>

            {/* Left Column */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} style={{ flex: '1 1 500px', maxWidth: '750px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: c.border03, borderRadius: '100px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF9D' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: c.text70, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
                  THE BUILDERS NETWORK
                </span>
              </div>

              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px, 4.5vw, 72px)', fontWeight: 700, color: c.text, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
                Build the future <span style={{ color: '#9B90FF', fontStyle: 'italic' }}>student ecosystem.</span>
              </h1>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.8vw, 20px)', color: c.text70, lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px' }}>
                Join India's AI-native network of builders, operators, creators, and innovators reshaping what it means to be a student.
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '48px' }}>
                <motion.a
                  href="#pathway"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTierModal('01');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ background: 'linear-gradient(135deg, #7B6BFF 0%, #9B90FF 100%)', color: c.text, padding: '16px 28px', borderRadius: '100px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(123, 107, 255, 0.3)', cursor: 'pointer' }}
                >
                  Explore Your Pathway <ArrowRight size={18} />
                </motion.a>
                <motion.a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScuWSCu-8TwZPABvfl0LiOnVRDhUNjTmVV0PnRZnlYOwZLLkA/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ background: c.border03, color: c.text, border: `1px solid ${c.border10}`, padding: '16px 28px', borderRadius: '100px', fontSize: '15px', fontWeight: 500, textDecoration: 'none', backdropFilter: 'blur(10px)' }}
                >
                  Enter The Ecosystem
                </motion.a>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 'clamp(24px, 5vw, 56px)', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: c.text, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>5K+</div>
                  <div style={{ fontSize: '11px', color: c.text50, fontFamily: 'var(--font-mono)', letterSpacing: '0.2em' }}>EXPLORERS</div>
                </div>
                <div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: c.text, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>80+</div>
                  <div style={{ fontSize: '11px', color: c.text50, fontFamily: 'var(--font-mono)', letterSpacing: '0.2em' }}>CAMPUS AMBASSADORS</div>
                </div>
                <div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: c.text, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>24</div>
                  <div style={{ fontSize: '11px', color: c.text50, fontFamily: 'var(--font-mono)', letterSpacing: '0.2em' }}>CITIES</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center', position: 'relative', width: '100%', maxWidth: '100%' }}>
              <style>{`
                @media (max-width: 768px) {
                  .hero-badge-1 { left: 0px !important; top: 0% !important; }
                  .hero-badge-2 { left: 0px !important; bottom: 0% !important; }
                  .hero-badge-3 { right: 0px !important; top: 45% !important; transform: translateY(-50%) !important; }
                  .hero-badge { padding: 10px 14px !important; gap: 8px !important; border-radius: 14px !important; max-width: calc(100% - 20px); }
                  .hero-badge-title { font-size: 12px !important; }
                  .hero-badge-sub { font-size: 8px !important; }
                }
                @media (max-width: 480px) {
                  .hero-badge-1 { top: -10px !important; left: 0px !important; }
                  .hero-badge-2 { bottom: -10px !important; left: 0px !important; }
                  .hero-badge-3 { right: 0px !important; top: 40% !important; }
                }
              `}</style>

              {/* Fake concentric circles behind */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'clamp(280px, 90vw, 700px)', height: 'clamp(280px, 90vw, 700px)', borderRadius: '50%', border: `1px solid ${c.border08}`, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'clamp(200px, 70vw, 500px)', height: 'clamp(200px, 70vw, 500px)', borderRadius: '50%', border: `1px solid ${c.border15}`, pointerEvents: 'none' }} />

              {/* Static Badges */}
              <div className="hero-badge hero-badge-1" style={{ position: 'absolute', top: '15%', left: '-5%', background: c.cardLight, backdropFilter: 'blur(20px)', border: `1px solid ${c.border08}`, padding: '16px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '14px', zIndex: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <Zap size={18} color="#8B80F9" />
                <div>
                  <div className="hero-badge-title" style={{ fontSize: '14px', fontWeight: 700, color: c.text, marginBottom: '2px' }}>AI Workshop</div>
                  <div className="hero-badge-sub" style={{ fontSize: '10px', color: c.text50, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', fontWeight: 600 }}>ACTIVE NOW</div>
                </div>
              </div>

              <div className="hero-badge hero-badge-2" style={{ position: 'absolute', bottom: '15%', left: '-5%', background: c.cardLight, backdropFilter: 'blur(20px)', border: `1px solid ${c.border08}`, padding: '16px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '14px', zIndex: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <Shield size={18} color="#8B80F9" />
                <div>
                  <div className="hero-badge-title" style={{ fontSize: '14px', fontWeight: 700, color: c.text, marginBottom: '2px' }}>Operator Apps</div>
                  <div className="hero-badge-sub" style={{ fontSize: '10px', color: c.text50, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', fontWeight: 600 }}>OPEN • COHORT 02</div>
                </div>
              </div>

              <div className="hero-badge hero-badge-3" style={{ position: 'absolute', top: '40%', right: '-10%', background: c.cardLight, backdropFilter: 'blur(20px)', border: `1px solid ${c.border08}`, padding: '16px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '14px', zIndex: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <Users size={18} color="#8B80F9" />
                <div>
                  <div className="hero-badge-title" style={{ fontSize: '14px', fontWeight: 700, color: c.text, marginBottom: '2px' }}>+12 campuses</div>
                  <div className="hero-badge-sub" style={{ fontSize: '10px', color: c.text50, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', fontWeight: 600 }}>JOINED TODAY</div>
                </div>
              </div>

              <motion.img
                src="/owl-mascot.png"
                alt="Mascot"
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: '100%', maxWidth: '800px', maxHeight: '85vh', objectFit: 'contain', zIndex: 5, position: 'relative', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))' }}
              />
            </motion.div>

          </div>
        </section>

        {/* MARQUEE SECTION */}
        <div style={{ padding: '40px 0', borderTop: `1px solid ${c.border05}`, borderBottom: `1px solid ${c.border05}`, background: c.marqueeGradient, marginBottom: '100px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: c.text40, letterSpacing: '0.2em', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
            BUILDING INDIA'S AI-NATIVE STUDENT ECOSYSTEM
          </div>
          <div style={{ display: 'flex', gap: '48px', alignItems: 'center', whiteSpace: 'nowrap' }}>
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', gap: '48px', color: c.text70, fontSize: '18px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              {[...Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#5B4BFF', boxShadow: '0 0 10px #7B6BFF' }} /> Mount Carmel
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#5B4BFF', boxShadow: '0 0 10px #7B6BFF' }} /> New Horizon
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#5B4BFF', boxShadow: '0 0 10px #7B6BFF' }} /> SJCC
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#5B4BFF', boxShadow: '0 0 10px #7B6BFF' }} /> Symbiosis
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#5B4BFF', boxShadow: '0 0 10px #7B6BFF' }} /> VIT
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#5B4BFF', boxShadow: '0 0 10px #7B6BFF' }} /> IIIT-B
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#5B4BFF', boxShadow: '0 0 10px #7B6BFF' }} /> CHRIST University
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#5B4BFF', boxShadow: '0 0 10px #7B6BFF' }} /> Jain University
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#5B4BFF', boxShadow: '0 0 10px #7B6BFF' }} /> PES
                  </span>
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>

        {/* WHAT IS THE NETWORK SECTION */}
        <section style={{ padding: '0 5%', marginBottom: '120px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 'clamp(40px, 8vw, 80px)', alignItems: 'flex-start' }}>

            {/* Left Side */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <div style={{ width: '32px', height: '1px', background: 'linear-gradient(90deg, transparent, #7B6BFF)' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>WHAT IS THE NETWORK</span>
              </div>
              <h2 style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800, color: c.text, lineHeight: 1.1, marginBottom: '40px', letterSpacing: '-0.02em', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
                This isn't a club.<br />
                <span style={{ color: '#9B90FF' }}>
                  It's an operating<br />
                  network<br />
                  for AI-native<br />
                  students.
                </span>
              </h2>
              <p style={{ color: c.text60, fontSize: '15px', lineHeight: 1.6, maxWidth: '400px' }}>
                Community One is the infrastructure layer for the next generation of student builders. Not ambassadors. Not volunteers. Operators.
              </p>
            </motion.div>

            {/* Right Side Cards */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="what-is-network-right" style={{ flex: '1 1 600px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '140px', width: '100%', maxWidth: '100%' }}>
              <style>{`
                @media (max-width: 768px) {
                  .what-is-network-right {
                    margin-top: 20px !important;
                    width: 100% !important;
                  }
                }
              `}</style>
              <ImagesReveal>
                {[
                  { title: 'AI Workshops', desc: 'Immersive sessions on prompt engineering, agents, and the AI stack.', icon: <Network size={16} color="#8B80F9" /> },
                  { title: 'Builder Network', desc: 'Build with operators across 24 cities. Ship in public. Get noticed.', icon: <Terminal size={16} color="#8B80F9" /> },
                  { title: 'Startup Exposure', desc: 'Direct access to founders, VCs, and the Indian AI ecosystem.', icon: <Rocket size={16} color="#8B80F9" /> },
                  { title: 'Real Projects', desc: 'Work on shipped products — not toy demos, not case studies.', icon: <Code2 size={16} color="#8B80F9" /> },
                  { title: 'Mentorship', desc: '1:1 with operators who\'ve built in the AI space.', icon: <Compass size={16} color="#8B80F9" /> },
                  { title: 'Community Expansion', desc: 'Become campus ambassadors, run cohorts, lead culture.', icon: <Users size={16} color="#8B80F9" /> }
                ].map((card, i) => (
                  <div key={i} style={{ width: '280px', height: '230px', background: c.cardLight, border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : c.border05}`, borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: isDark ? '0 10px 40px rgba(123, 107, 255, 0.1)' : '0 15px 40px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: c.border03, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {card.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: c.text, marginBottom: '8px' }}>{card.title}</h3>
                      <p style={{ color: c.text50, fontSize: '13px', lineHeight: 1.6 }}>{card.desc}</p>
                    </div>
                  </div>
                ))}
              </ImagesReveal>
            </motion.div>
          </div>
        </section>

        {/* TIERS SECTION */}
        <section id="tiers" style={{ padding: '0 5%', marginBottom: '120px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ textAlign: 'center', marginBottom: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '32px', height: '1px', background: 'linear-gradient(90deg, transparent, #7B6BFF)' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>ECOSYSTEM PROGRESSION</span>
                <div style={{ width: '32px', height: '1px', background: 'linear-gradient(270deg, transparent, #7B6BFF)' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, color: c.text, marginBottom: '16px' }}>
                Level up the network.
              </h2>
              <p style={{ color: c.text60, fontSize: '15px', maxWidth: '600px', lineHeight: 1.6 }}>
                Explore → Build → Contribute → Lead → Scale → Expand → Impact. Every level unlocks new opportunities — earned through contribution, not bought.
              </p>
            </motion.div>

            <style>{`
              .tier-scroll::-webkit-scrollbar { height: 8px; }
              .tier-scroll::-webkit-scrollbar-track { background: transparent; }
              .tier-scroll::-webkit-scrollbar-thumb { background: rgba(123, 107, 255, 0.2); border-radius: 10px; }
              .tier-scroll::-webkit-scrollbar-thumb:hover { background: rgba(123, 107, 255, 0.5); }
              @media (max-width: 768px) {
                .progression-arrow svg { transform: rotate(0deg); }
              }
            `}</style>
            <SkewedCarousel perspective={1400} inactiveScale={0.85} gap={24}>
              {[
                { lvl: '01', title: 'Explore', badge: undefined, subtitle: 'Discover what is possible.', desc: 'Most students enter college without a clear direction. Gain access to AI workshops, career guidance, and networking.', icon: <Compass size={20} />, perks: ['AI Workshops', 'Career Guidance', 'Networking Circles', 'Senior Mentorship'] },
                { lvl: '02', title: 'Build', badge: undefined, subtitle: 'Learn by building.', desc: 'Builders don\'t just attend sessions. They create. Work on projects, startup experiments, and creator systems.', icon: <Terminal size={20} />, perks: ['AI Projects', 'Startup Experiments', 'Creator Systems', 'Collaborative Initiatives'] },
                { lvl: '03', title: 'Contribute', badge: undefined, subtitle: 'Build things that matter.', desc: 'Active participants. Work on content systems, initiatives, and intellectual property alongside experts.', icon: <Zap size={20} />, perks: ['Community Initiatives', 'Founder Conversations', 'Industry Experts', 'Intellectual Property'] },
                { lvl: '04', title: 'Lead', badge: undefined, subtitle: 'Become the network.', desc: 'Represent and grow the ecosystem. Help students discover opportunities, guide members, and build communities.', icon: <Crown size={20} />, perks: ['Official Ambassador Status', 'Free Subscription', '1000 AI Credits', 'Leadership Recognition'] },
                { lvl: '05', title: 'Scale', badge: undefined, subtitle: 'Lead an entire university.', desc: 'Coordinate ecosystem growth across departments. Manage ambassadors, support expansion, and build the network.', icon: <Users size={20} />, perks: ['Full Premium Access', '3000 Credits', 'Founder Networking', 'Scale: 500–1000 Explorers'] },
                { lvl: '06', title: 'Expand', badge: undefined, subtitle: 'Build a city-wide ecosystem.', desc: 'Connect colleges, ambassadors, contributors, and builders across an entire city. Your impact extends beyond a campus.', icon: <Network size={20} />, perks: ['Free Annual Premium', 'Revenue Sharing', 'Strategic Operator Access', 'Scale: Up to 10,000 Students'] },
                { lvl: '07', title: 'Impact', badge: undefined, subtitle: 'Shape the future of the network.', desc: 'Country Ambassadors become strategic ecosystem partners helping scale the community nationally.', icon: <Trophy size={20} />, perks: ['Direct Founder Access', 'National Leadership', 'Strategic Planning Access', 'Premium Network'] }
              ].map((tier, i) => (
                <div key={i} style={{ width: 'clamp(280px, 80vw, 340px)', height: '100%' }}>
                  <motion.div onClick={() => setActiveTierModal(tier.lvl)} initial="hidden" whileInView="visible" whileHover={{ y: -8, scale: 1.02, boxShadow: isDark ? '0 20px 50px rgba(123, 107, 255, 0.15)' : '0 20px 50px rgba(123, 107, 255, 0.1)', borderColor: 'rgba(123, 107, 255, 0.4)' }} viewport={{ once: true }} variants={fadeInUp} style={{ height: '100%', background: c.tierCardGradient, border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '32px 24px', position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: isDark ? 'none' : '0 10px 40px rgba(0,0,0,0.03)' }}>

                    {/* Top Bar (Level + Arrow) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: c.text50, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>LV {tier.lvl}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {tier.badge && (
                          <div style={{ background: 'rgba(123, 107, 255, 0.1)', color: '#9B90FF', padding: '4px 10px', borderRadius: '100px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', border: '1px solid rgba(123, 107, 255, 0.2)' }}>
                            {tier.badge}
                          </div>
                        )}
                        <motion.div whileHover={{ scale: 1.1, backgroundColor: 'rgba(123, 107, 255, 0.1)' }} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.border03, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${c.border10}`, transition: 'background 0.2s' }}>
                          <ArrowRight size={12} color={c.text50} style={{ transform: 'rotate(-45deg)' }} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ color: '#9B90FF' }}>{tier.icon}</div>
                      <h3 style={{ fontSize: '24px', fontWeight: 800, color: c.text, letterSpacing: '-0.02em' }}>{tier.title}</h3>
                    </div>

                    {/* Description */}
                    <div style={{ fontSize: '13px', color: '#9B90FF', fontWeight: 600, marginBottom: '16px' }}>{tier.subtitle}</div>
                    <p style={{ color: c.text50, fontSize: '13px', lineHeight: 1.6, marginBottom: '32px', minHeight: '60px' }}>{tier.desc}</p>

                    <div style={{ height: '1px', background: c.border05, marginBottom: '32px', width: '100%' }} />

                    {/* Perks */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                      {tier.perks.map((perk, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: c.text, fontWeight: 500 }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#7B6BFF', boxShadow: '0 0 8px #9B90FF' }} />
                          {perk}
                        </div>
                      ))}
                    </div>

                    {/* Footer Action */}
                    <div style={{ marginTop: '40px', fontSize: '12px', fontWeight: 600, color: c.text80, display: 'flex', alignItems: 'center' }}>
                      Explore {tier.title} progression <ArrowRight size={12} style={{ marginLeft: '4px' }} />
                    </div>
                  </motion.div>
                </div>
              ))}
            </SkewedCarousel>
          </div>
        </section>

        {/* PRICING & SEATS SECTION */}
        <section style={{ padding: '0 5%', marginBottom: '120px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', justifyContent: 'center' }}>
              <div style={{ width: '32px', height: '1px', background: 'linear-gradient(90deg, transparent, #7B6BFF)' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>ECOSYSTEM ACCESS</span>
              <div style={{ width: '32px', height: '1px', background: 'linear-gradient(270deg, transparent, #7B6BFF)' }} />
            </div>

            <EcosystemAccessCards
              isDark={isDark}
              c={c}
              fadeInUp={fadeInUp}
              onExplorerClick={() => setActiveTierModal('01')}
              onAmbassadorClick={() => setActiveTierModal('04')}
            />
          </div>
        </section>

        {/* THE EXPERIENCE SECTION */}
        <section style={{ padding: '120px 5%', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '32px', height: '1px', background: 'linear-gradient(90deg, transparent, #7B6BFF)' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>THE EXPERIENCE</span>
            </div>

            <h2 style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800, color: c.text, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
              Not workshops.<br />
              <span style={{ color: '#9B90FF' }}>Experiences.</span>
            </h2>
            <p style={{ color: c.text60, fontSize: '15px', lineHeight: 1.6, maxWidth: '400px', marginBottom: '120px' }}>
              We don't lecture. We stage moments. Every session is engineered as a four-act arc with one goal: conversion to operator.
            </p>

            <style>{`
              .experience-line { left: 50%; }
              .experience-dot { left: 50%; }
              .experience-content { width: 45%; }
              .experience-content.left-side { text-align: right; padding: 0 60px 0 0; }
              .experience-content.right-side { text-align: left; padding: 0 0 0 60px; }
              
              @media (max-width: 768px) {
                .experience-line { left: 24px; }
                .experience-dot { left: 24px; }
                .experience-content { width: 100%; text-align: left !important; padding: 0 0 0 64px !important; }
                .experience-item { justify-content: flex-start !important; }
              }
            `}</style>

            <ScrollStack 
              useWindowScroll={true} 
              baseScale={0.85} 
              itemScale={0.03}
              itemStackDistance={30}
              scaleDuration={0.5}
              blurAmount={6}
            >
              {[
                { 
                  step: '01', 
                  title: 'SHOCK', 
                  heading: "An AI moment they can't unsee.", 
                  desc: "We open with a live demo so visceral it rewires how students think about their next four years.",
                  accent: '#9B90FF',
                  glow: 'rgba(155, 144, 255, 0.25)',
                  gradient: isDark 
                    ? 'linear-gradient(135deg, #1C1637 0%, #0C0A1C 100%)' 
                    : 'linear-gradient(135deg, #F0EEFF 0%, #FFFFFF 100%)',
                  border: isDark ? 'rgba(155, 144, 255, 0.3)' : 'rgba(123, 107, 255, 0.2)',
                  Icon: Flame
                },
                { 
                  step: '02', 
                  title: 'DEMO', 
                  heading: "Live prompt engineering battles.", 
                  desc: "Resume roasting by AI. Productivity stack speedruns. Real builders, on stage, shipping.",
                  accent: '#EC4899',
                  glow: 'rgba(236, 72, 153, 0.25)',
                  gradient: isDark 
                    ? 'linear-gradient(135deg, #2A1230 0%, #14081A 100%)' 
                    : 'linear-gradient(135deg, #FFEEEF 0%, #FFFFFF 100%)',
                  border: isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)',
                  Icon: Terminal
                },
                { 
                  step: '03', 
                  title: 'INTERACTION', 
                  heading: "Hands on the toolkit.", 
                  desc: "Every attendee builds something — a workflow, an agent, a side hustle prototype — before they leave.",
                  accent: '#F59E0B',
                  glow: 'rgba(245, 158, 11, 0.25)',
                  gradient: isDark 
                    ? 'linear-gradient(135deg, #2D1E0C 0%, #160E06 100%)' 
                    : 'linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)',
                  border: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.2)',
                  Icon: Cpu
                },
                { 
                  step: '04', 
                  title: 'ONBOARD', 
                  heading: "Welcome to the network.", 
                  desc: "Discord invite. Cohort match. First mission within 48 hours. The community becomes the next chapter.",
                  accent: '#10B981',
                  glow: 'rgba(16, 185, 129, 0.25)',
                  gradient: isDark 
                    ? 'linear-gradient(135deg, #0E2A22 0%, #061410 100%)' 
                    : 'linear-gradient(135deg, #E8FDF5 0%, #FFFFFF 100%)',
                  border: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                  Icon: Network
                }
              ].map((item, i) => {
                const IconComponent = item.Icon;
                return (
                  <ScrollStackItem 
                    key={i} 
                    itemClassName="flex flex-col justify-center items-start overflow-hidden"
                  >
                    <div 
                      className="scroll-stack-card-inner"
                      style={{ 
                        background: item.gradient, 
                        border: `1px solid ${item.border}`, 
                        borderRadius: '32px', 
                        padding: '40px 48px', 
                        width: '100%', 
                        height: '100%', 
                        backdropFilter: 'blur(24px)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: isDark 
                          ? `0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)` 
                          : `0 20px 40px -15px ${item.glow}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)`
                      }}
                    >
                      {/* Radial Accent Ambient Glow */}
                      <div 
                        style={{
                          position: 'absolute',
                          top: '-20%',
                          right: '-10%',
                          width: '250px',
                          height: '250px',
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${item.glow} 0%, transparent 70%)`,
                          pointerEvents: 'none',
                          zIndex: 0
                        }}
                      />

                      {/* Large Background Watermark Icon */}
                      <IconComponent 
                        size={180} 
                        style={{
                          position: 'absolute',
                          right: '5%',
                          bottom: '-10%',
                          color: item.accent,
                          opacity: isDark ? 0.06 : 0.08,
                          pointerEvents: 'none',
                          zIndex: 0
                        }}
                      />

                      {/* Content */}
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div 
                          style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                            border: `1px solid ${item.border}`,
                            fontSize: '11px', 
                            fontWeight: 700, 
                            color: item.accent, 
                            fontFamily: 'var(--font-mono)', 
                            letterSpacing: '0.15em', 
                            marginBottom: '20px' 
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.accent, boxShadow: `0 0 8px ${item.accent}` }} />
                          {item.step} <span style={{ color: c.text30 }}>•</span> {item.title}
                        </div>

                        <h3 style={{ fontSize: 'clamp(28px, 3.5vw, 36px)', fontWeight: 800, color: c.text, marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                          {item.heading}
                        </h3>

                        <p style={{ color: c.text60, fontSize: '15px', lineHeight: 1.6, maxWidth: '520px' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </ScrollStackItem>
                );
              })}
            </ScrollStack>
          </div>
        </section>

        {/* WHY JOIN SECTION */}
        <section style={{ padding: '0 5%', marginBottom: '120px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '32px', height: '1px', background: 'linear-gradient(90deg, transparent, #7B6BFF)' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>WHY JOIN</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-end', marginBottom: '64px' }}>
              <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 800, color: c.text, lineHeight: 1.1, letterSpacing: '-0.02em', flex: '1 1 600px' }}>
                Compounding leverage<br />
                <span style={{ color: c.text30 }}>from day one.</span>
              </h2>
              <p style={{ color: c.text60, fontSize: '13px', maxWidth: '300px', marginBottom: '10px' }}>
                Every operator gets the same starting kit the early team uses to ship.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>

              {/* Big Left Card */}
              <StartupExposureHero isDark={isDark} c={c} fadeInUp={fadeInUp} />

              {/* Right Grid */}
              <HoverEffectGrid 
                isDark={isDark} 
                c={c} 
                fadeInUp={fadeInUp} 
                staggerContainer={staggerContainer}
                items={[
                  { title: 'Founder Access', desc: 'Direct 1:1s with AI founders', icon: <Users size={18} /> },
                  { title: 'Real AI Projects', desc: 'Ship production-ready code', icon: <Cpu size={18} /> },
                  { title: 'Internship Pathways', desc: 'Fast-tracked hiring', icon: <Briefcase size={18} /> },
                  { title: 'AI Resources', desc: 'Premium API credits & tools', icon: <Library size={18} /> },
                  { title: 'Community Status', desc: 'Earned, never bought', icon: <Star size={18} /> },
                  { title: 'National Network', desc: '24 cities, 80 nodes', icon: <MapPin size={18} /> }
                ]}
              />
            </div>
          </div>
        </section>

        {/* XP SYSTEM SECTION */}
        <section style={{ padding: '0 5%', marginBottom: '120px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '32px', height: '1px', background: 'linear-gradient(90deg, transparent, #7B6BFF)' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>XP PROGRESSION SYSTEM</span>
            </div>

            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800, color: c.text, lineHeight: 1.1, marginBottom: '64px', letterSpacing: '-0.02em', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
              Every action compounds<br />
              <span style={{ color: c.text30 }}>into access.</span>
            </motion.h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'start', justifyContent: 'center' }}>
              {/* Left Panel: Scoring System */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} style={{ flex: '1 1 320px', maxWidth: '420px', background: c.card, borderRadius: '24px', padding: '32px', border: `1px solid ${c.border10}`, boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.2)' : '0 20px 40px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '300px', height: '300px', background: `radial-gradient(circle, ${isDark ? 'rgba(123, 107, 255, 0.15)' : 'rgba(123, 107, 255, 0.08)'} 0%, transparent 70%)`, opacity: 0.8, pointerEvents: 'none' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: '12px', fontWeight: 700, color: c.text50, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Expertise Points (XP)</h3>
                    <div style={{ width: '24px', height: '2px', background: '#7B6BFF', marginTop: '8px' }} />
                  </div>
                  <Trophy size={20} color="#E5C158" />
                </div>

                <motion.div variants={staggerContainer} style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                  {[
                    { title: "Project contribution", desc: "Contribute to real projects and earn XP.", xp: "+50 XP" },
                    { title: "Creator collaboration", desc: "Collaborate with creators and build together.", xp: "+40 XP" },
                    { title: "Attend workshop", desc: "Join workshops and level up your skills.", xp: "+20 XP" },
                    { title: "Networking session", desc: "Engage, connect, and grow your network.", xp: "+15 XP" }
                  ].map((item, i) => (
                    <motion.div key={i} variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '24px 0', borderBottom: i < 3 ? `1px solid ${c.border05}` : 'none' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: c.text, marginBottom: '4px' }}>{item.title}</h4>
                        <p style={{ fontSize: '13px', color: c.text50, lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                      <div style={{ padding: '6px 10px', background: isDark ? 'rgba(123, 107, 255, 0.15)' : 'rgba(123, 107, 255, 0.08)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#7B6BFF', whiteSpace: 'nowrap' }}>
                        {item.xp}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Panel: Monthly Structure */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ flex: '1 1 450px', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { 
                    icon: (
                      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#7B6BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M8 3v12" />
                        <circle cx="8" cy="17" r="2" />
                        <path d="M8 10l6 6v5" />
                        <path d="M14 3v4l3.5 3.5" />
                        <circle cx="18.5" cy="11.5" r="2" />
                      </svg>
                    ), 
                    title: "AI-Native Workshops", 
                    desc: "Deep dive into prompt engineering, agents, and execution frameworks.",
                    bg: isDark ? 'linear-gradient(135deg, rgba(123,107,255,0.2) 0%, rgba(123,107,255,0.05) 100%)' : 'linear-gradient(135deg, #F0EEFF 0%, #F8F7FF 100%)',
                    iconBg: isDark ? 'rgba(123,107,255,0.2)' : '#FFFFFF',
                    titleColor: '#7B6BFF'
                  },
                  { 
                    icon: (
                      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="6" height="18" rx="2" />
                        <path d="M9 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9" />
                        <path d="M13 9v6" />
                        <path d="M17 9v6" />
                        <path d="M12 11h6" />
                        <path d="M12 13h6" />
                      </svg>
                    ), 
                    title: "Startup Systems", 
                    desc: "Build real operational experience with live case studies and founder feedback.",
                    bg: c.cardLight,
                    iconBg: isDark ? 'rgba(16,185,129,0.1)' : '#E8FDF5'
                  },
                  { 
                    icon: (
                      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="14" r="4" />
                        <path d="M7 22c0-3 2-5 5-5s5 2 5 5" />
                        <path d="M9.5 9a3 3 0 1 0-5.5 2c-1 1.5-1.5 3-2 5" />
                        <path d="M14.5 9a3 3 0 1 1 5.5 2c1 1.5 1.5 3 2 5" />
                      </svg>
                    ), 
                    title: "Creator Ecosystems", 
                    desc: "Collaborate with editors, designers, and storytellers to build massive internet leverage.",
                    bg: c.cardLight,
                    iconBg: isDark ? 'rgba(245,158,11,0.1)' : '#FFF8E6'
                  },
                  { 
                    icon: <Network size={28} color="#3B82F6" strokeWidth={1.5} />, 
                    title: "Micro-Group Networking", 
                    desc: "Join small growth circles for extreme accountability and ecosystem bonding.",
                    bg: c.cardLight,
                    iconBg: isDark ? 'rgba(59,130,246,0.1)' : '#EFF6FF'
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    variants={fadeInUp}
                    whileHover={{ y: -4, boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.3)' : '0 12px 30px rgba(0,0,0,0.05)' }}
                    style={{ background: item.bg, borderRadius: '20px', padding: '24px', border: `1px solid ${c.border05}`, boxShadow: isDark ? '0 10px 20px rgba(0,0,0,0.1)' : '0 10px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isDark ? 'inset 0 1px 1px rgba(255,255,255,0.1)' : '0 2px 10px rgba(0,0,0,0.05)' }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: item.titleColor || c.text, marginBottom: '6px' }}>{item.title}</h4>
                      <p style={{ fontSize: '13px', color: c.text50, lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* THE CULTURE SECTION */}
        <section style={{ padding: '120px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
            <div style={{ width: '32px', height: '1px', background: 'linear-gradient(90deg, transparent, #7B6BFF)' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>THE CULTURE</span>
            <div style={{ width: '32px', height: '1px', background: 'linear-gradient(270deg, transparent, #7B6BFF)' }} />
          </div>

          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, color: c.text, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
            Build With People Who<br />
            <span style={{ color: '#9B90FF' }}>Are Already Building.</span>
          </motion.h2>

          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: c.text60, lineHeight: 1.6, maxWidth: '800px', margin: '0 auto 80px auto' }}>
            Students from IITs, IIMs, BITS, NITs, Christ, Jain, PES, SRM, VIT and hundreds of campuses learning, building, contributing and growing together.
          </motion.p>

          {/* Tweet Cards */}
          <div className="driftwall-outer-wrap" style={{ height: 750, width: '100%', maxWidth: '1400px', margin: '0 auto', paddingBottom: '32px', transform: 'translateX(-4%)' }}>
            <style>{`
              @media (max-width: 768px) {
                .driftwall-outer-wrap {
                  height: 520px !important;
                  transform: none !important;
                  width: 100% !important;
                  overflow: hidden;
                }
              }
            `}</style>
            <DriftWall
              items={[
                {
                  name: 'Priyanshu Sarangi', role: 'IIT BHUBANESWAR • BUILDER', icon: <Terminal size={14} color="#fff" />, color: '#FF5C00',
                  text: "Joined as an Explorer. Built my first AI workflow in 3 weeks. Today I'm collaborating with students from 8+ colleges on real projects.",
                  likes: '328', replies: '24', retweets: '12'
                },
                {
                  name: 'Ananya Sharma', role: 'IIM BANGALORE • CONTRIBUTOR', icon: <Users size={14} color="#fff" />, color: '#9B90FF',
                  text: "The biggest value wasn't the workshop. It was meeting founders, builders, and ambitious students who pushed me to think bigger.",
                  likes: '412', replies: '31', retweets: '18'
                },
                {
                  name: 'Kabir Mehta', role: 'BITS PILANI • BUILDER', icon: <Zap size={14} color="#fff" />, color: '#7B6BFF',
                  text: "Built my portfolio, joined startup projects, and connected with mentors I would never have met through college alone.",
                  likes: '284', replies: '19', retweets: '8'
                },
                {
                  name: 'Simran Kaur', role: 'DELHI UNIVERSITY • AMBASSADOR', icon: <Crown size={14} color="#fff" />, color: '#FF3366',
                  text: "Managing my college community taught me leadership faster than any classroom ever could.",
                  likes: '501', replies: '42', retweets: '22'
                },
                {
                  name: 'Ritika Nair', role: 'CHRIST UNIVERSITY • UNIV. AMBASSADOR', icon: <Flame size={14} color="#fff" />, color: '#00FF9D',
                  text: "Started as an Explorer. Today I help coordinate students across departments and connect them to opportunities.",
                  likes: '391', replies: '28', retweets: '14'
                },
                {
                  name: 'Rahul Verma', role: 'NIT SURATHKAL • CONTRIBUTOR', icon: <Sparkles size={14} color="#fff" />, color: '#00C3FF',
                  text: "Working on ecosystem projects gave me real execution experience, not just certificates.",
                  likes: '347', replies: '21', retweets: '11'
                }
              ].map((tweet, i) => ({
                id: i,
                image: '',
                title: '',
                href: undefined,
                content: (
                  <div style={{ width: '100%', height: '100%', background: c.card, borderRadius: '16px', padding: isMobile ? '20px 18px' : '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.4)' : '0 12px 32px rgba(0,0,0,0.06)', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: tweet.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {tweet.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: c.text }}>{tweet.name}</div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: c.text40, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>{tweet.role}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: isMobile ? '13.5px' : '15px', color: c.text80, lineHeight: 1.55, flex: 1, wordBreak: 'normal', overflowWrap: 'break-word' }}>
                      {tweet.text}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', color: c.text40, fontSize: '12px', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heart size={14} /> {tweet.likes}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={14} /> {tweet.replies}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Repeat size={14} /> {tweet.retweets}</div>
                    </div>
                  </div>
                )
              }))}
              columns={isMobile ? 1 : 3}
              tileWidth={isMobile ? 320 : 360}
              tileHeight={isMobile ? 240 : 240}
              gap={isMobile ? 20 : 24}
              tilt={isMobile ? 12 : 16}
              turn={isMobile ? -8 : -14}
              perspective={1200}
              depth={120}
              speed={42}
              direction="up"
              variance={isMobile ? 0 : 0.45}
              parallax={0.6}
              lift={64}
              fade={0.2}
              dim={1}
              overlayColor="transparent"
              radius={14}
              roll={0}
              pauseOnHover={false}
              grayscale={false}
              style={{}}
            />
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '48px', maxWidth: '800px', margin: '48px auto 0' }}>
            {['#buildersnetwork', '#studentecosystem', '#futurebuilders', '#aioperators', '#collegecircle', '#foundernetwork', '#contributors', '#explorers'].map((tag, i) => (
              <div key={i} style={{ padding: '8px 16px', background: c.border03, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '12px', color: c.text50, fontFamily: 'var(--font-mono)' }}>
                {tag}
              </div>
            ))}
          </motion.div>
        </section>

        {/* FINAL CTA SECTION - LEAD THE NETWORK (THEME AWARE: LIGHT & DARK) */}
        <section style={{ padding: '0 clamp(16px, 4vw, 5%) clamp(60px, 10vw, 120px) clamp(16px, 4vw, 5%)', position: 'relative', background: 'transparent' }}>
          <div style={{ maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(480px, 58vh, 580px)',
                minHeight: 'clamp(480px, 58vh, 580px)',
                borderRadius: 'clamp(22px, 4vw, 36px)',
                overflow: 'hidden'
              }}
            >
              <ScrollExpand
                src={isDark ? "/lead-network-bg.png" : "/lead-network-bg-light.png"}
                mediaZoom={1.15}
                startWidth={65}
                startHeight={65}
                startRadius={28}
                endRadius={20}
                smoothing={0.06}
                style={{
                  width: '100%',
                  height: '100%',
                  '--se-border': isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(123, 107, 255, 0.25)',
                  '--se-box-shadow': isDark ? '0 25px 80px -20px rgba(0, 0, 0, 0.8)' : '0 20px 60px -15px rgba(123, 107, 255, 0.18)'
                } as React.CSSProperties}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    width: '100%',
                    height: '100%',
                    padding: 'clamp(12px, 2.5vw, 28px)',
                    boxSizing: 'border-box',
                    pointerEvents: 'auto'
                  }}
                >
                  {/* Top Badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 14px',
                      background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '100px',
                      marginBottom: 'clamp(10px, 1.5vw, 18px)',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(123, 107, 255, 0.25)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9B90FF', boxShadow: '0 0 8px #7B6BFF' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: isDark ? '#FFFFFF' : '#4B3BCB', letterSpacing: '0.16em', fontWeight: 700 }}>
                      LEAD THE NETWORK
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: 'clamp(24px, 3.8vw, 46px)',
                      fontWeight: 800,
                      lineHeight: 1.15,
                      marginBottom: 'clamp(8px, 1.4vw, 14px)',
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-body), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    <span style={{ color: isDark ? '#FFFFFF' : '#14112E' }}>India's AI-native</span><br />
                    <span style={{ color: '#7B6BFF' }}>student ecosystem</span><br />
                    <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, color: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(20, 17, 46, 0.5)' }}>starts here.</span>
                  </h2>

                  {/* Subtitle */}
                  <p
                    style={{
                      color: isDark ? 'rgba(225, 225, 245, 0.72)' : 'rgba(30, 25, 55, 0.75)',
                      fontSize: 'clamp(12px, 1.3vw, 15px)',
                      marginBottom: 'clamp(14px, 2vw, 24px)',
                      fontWeight: 500,
                      maxWidth: '520px',
                      lineHeight: 1.5
                    }}
                  >
                    The future will not be built by average students.
                  </p>

                  {/* Action Button */}
                  <motion.a
                    href="https://docs.google.com/forms/d/e/1FAIpQLScuWSCu-8TwZPABvfl0LiOnVRDhUNjTmVV0PnRZnlYOwZLLkA/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, boxShadow: '0 14px 40px -4px rgba(126, 110, 242, 0.7), 0 0 30px rgba(126, 110, 242, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #7E6EF2 0%, #6A56E8 100%)',
                      color: '#FFFFFF',
                      padding: '10px 26px',
                      borderRadius: '100px',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 8px 24px -4px rgba(126, 110, 242, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    Apply To The Network <span style={{ fontSize: '15px' }}>↗</span>
                  </motion.a>
                </div>
              </ScrollExpand>
            </div>
          </div>
        </section>

      </main>

      {/* TIER PROGRESSION MODAL */}
      <AnimatePresence>
        {activeTierModal && (
          <div onClick={() => setActiveTierModal(null)} className="tier-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5%', background: c.overlay, backdropFilter: 'blur(10px)' }}>
            <style>{`
              @media (max-width: 768px) {
                .tier-modal-overlay {
                  padding: 12px !important;
                }
                .tier-modal-content {
                  padding: 28px 20px !important;
                  border-radius: 20px !important;
                  max-height: 94vh !important;
                }
                .tier-modal-close {
                  top: 16px !important;
                  right: 16px !important;
                  width: 32px !important;
                  height: 32px !important;
                }
              }
            `}</style>
            <motion.div data-lenis-prevent="true" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="tier-modal-content" style={{ width: '100%', maxWidth: '1200px', maxHeight: '90vh', overflowY: 'auto', overscrollBehavior: 'contain', background: isDark ? 'linear-gradient(180deg, rgba(20,15,30,1) 0%, rgba(10,10,15,1) 100%)' : '#FFFFFF', border: `1px solid ${c.border10}`, borderRadius: '24px', position: 'relative', padding: '64px', boxShadow: isDark ? '0 40px 100px rgba(0,0,0,0.5)' : '0 40px 100px rgba(0,0,0,0.1)' }}>

              {/* Close button */}
              <button onClick={() => setActiveTierModal(null)} className="tier-modal-close" style={{ position: 'absolute', top: '32px', right: '32px', width: '40px', height: '40px', borderRadius: '50%', background: c.border05, border: `1px solid ${c.border10}`, color: c.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                ✕
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>ECOSYSTEM PROGRESSION MAP</div>
              </div>

              <h2 style={{ fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 800, color: c.text, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em', fontFamily: 'var(--font-body), system-ui, sans-serif', maxWidth: '800px' }}>
                Build systems. <span style={{ color: '#9B90FF' }}>Build the future.</span>
              </h2>

              <p style={{ color: c.text50, fontSize: '14px', lineHeight: 1.6, maxWidth: '600px', marginBottom: '40px' }}>
                Explore → Build → Contribute → Lead → Scale → Expand → Impact. Every level unlocks new opportunities — earned through contribution, not bought.
              </p>

              {/* Progress Steps */}
              <style>{`
                .modal-nav-scroll {
                  overflow-x: auto;
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                  -webkit-overflow-scrolling: touch;
                  margin-bottom: 80px;
                  margin-left: -5%;
                  margin-right: -5%;
                  padding: 0 5%;
                }
                .modal-nav-scroll::-webkit-scrollbar { display: none; }
                .modal-nav-inner {
                  display: flex;
                  justify-content: space-between;
                  position: relative;
                  min-width: 550px; /* Forces scroll on narrow mobile screens */
                  margin: 0 auto;
                  padding: 0 20px;
                }
              `}</style>
              <div className="modal-nav-scroll">
                <div className="modal-nav-inner">
                  <div style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '1px', background: c.border10, zIndex: 1 }} />
                  {[
                    { lvl: '01', name: 'Explore', icon: <Compass size={16} />, active: activeTierModal === '01' },
                    { lvl: '02', name: 'Build', icon: <Terminal size={16} />, active: activeTierModal === '02' },
                    { lvl: '03', name: 'Contribute', icon: <Zap size={16} />, active: activeTierModal === '03' },
                    { lvl: '04', name: 'Lead', icon: <Crown size={16} />, active: activeTierModal === '04' },
                    { lvl: '05', name: 'Scale', icon: <Users size={16} />, active: activeTierModal === '05' },
                    { lvl: '06', name: 'Expand', icon: <Network size={16} />, active: activeTierModal === '06' },
                    { lvl: '07', name: 'Impact', icon: <Trophy size={16} />, active: activeTierModal === '07' }
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, cursor: 'pointer', flex: '0 0 auto', width: '60px' }} onClick={() => setActiveTierModal(step.lvl)}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step.active ? 'rgba(0,255,157,0.1)' : (isDark ? c.gradBase : '#FFFFFF'), border: step.active ? '2px solid #00FF9D' : `1px solid ${c.border10}`, color: step.active ? '#00FF9D' : c.text40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: step.active ? '0 0 20px rgba(0,255,157,0.2)' : 'none', transition: 'all 0.2s ease' }}>
                        {step.icon}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: step.active ? '#00FF9D' : c.text40, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: '2px' }}>LV {step.lvl}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: step.active ? c.text : c.text40 }}>{step.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column Layout */}
              {(() => {
                const tierData = {
                  '01': {
                    color: '#00FF9D',
                    title: 'Explore',
                    badge: 'DISCOVER WHAT IS POSSIBLE',
                    quote: '"Every journey starts here."',
                    desc: "Most students enter college without a clear direction. Explorers gain access to AI workshops, career guidance, networking circles, senior mentorship, and future-focused learning systems that help them understand what opportunities exist beyond the classroom.",
                    icon: <Compass size={20} />,
                    unlocks: [
                      { icon: <Compass size={16} />, title: 'AI Workshops', desc: 'Learn the fundamentals.' },
                      { icon: <Rocket size={16} />, title: 'Career Guidance', desc: 'Direction beyond college.' },
                      { icon: <Users size={16} />, title: 'Networking Circles', desc: 'Meet ambitious peers.' },
                      { icon: <Crown size={16} />, title: 'Senior Mentorship', desc: 'Learn from those ahead of you.' }
                    ],
                    xp: { current: 63, max: 150, text: '63 / 150 XP', pct: '42%' },
                    nextTier: 'Build',
                    activities: [
                      { title: 'Attend a workshop', xp: '+20 XP' },
                      { title: 'Join a networking session', xp: '+15 XP' },
                      { title: 'Community participation', xp: '+5 XP' }
                    ],
                    promo: ['150 XP earned', '2 workshops attended', '1 networking session']
                  },
                  '02': {
                    color: '#9B90FF',
                    title: 'Build',
                    badge: 'LEARN BY BUILDING',
                    quote: '"Ideas become execution."',
                    desc: "Builders don't just attend sessions. They create. Students begin working on AI projects, startup experiments, creator systems, portfolio projects, and collaborative initiatives with ambitious students across different colleges.",
                    icon: <Terminal size={20} />,
                    unlocks: [
                      { icon: <Terminal size={16} />, title: 'AI Projects', desc: 'Build real-world tools.' },
                      { icon: <Zap size={16} />, title: 'Startup Experiments', desc: 'Test and validate ideas.' },
                      { icon: <Sparkles size={16} />, title: 'Creator Systems', desc: 'Learn to distribute.' },
                      { icon: <Network size={16} />, title: 'Collaborative Initiatives', desc: 'Work with students across colleges.' }
                    ],
                    xp: { current: 297, max: 500, text: '297 / 500 XP', pct: '59.4%' },
                    nextTier: 'Contribute',
                    activities: [
                      { title: 'Ship a project', xp: '+40 XP' },
                      { title: 'Join a build group', xp: '+25 XP' },
                      { title: 'Cohort contribution', xp: '+20 XP' }
                    ],
                    promo: ['500 XP earned', '1 project shipped', 'Sustained activity']
                  },
                  '03': {
                    color: '#FFB800',
                    title: 'Contribute',
                    badge: 'BUILD THINGS THAT MATTER',
                    quote: '"Your work starts creating impact."',
                    desc: "Contributors become active participants inside the ecosystem. They work on content systems, community initiatives, startup experiments, and intellectual property projects while gaining access to founder conversations, industry experts, builders, and creators across India.",
                    icon: <Zap size={20} />,
                    unlocks: [
                      { icon: <Shield size={16} />, title: 'Community Initiatives', desc: 'Take responsibility in the network.' },
                      { icon: <Crown size={16} />, title: 'Founder Conversations', desc: 'Direct lines to startup founders.' },
                      { icon: <Users size={16} />, title: 'Industry Experts', desc: 'Learn from top operators.' },
                      { icon: <Code2 size={16} />, title: 'Intellectual Property', desc: 'Build and own assets.' }
                    ],
                    xp: { current: 640, max: 1200, text: '640 / 1200 XP', pct: '53%' },
                    nextTier: 'Lead',
                    activities: [
                      { title: 'Launch ecosystem IP', xp: '+80 XP' },
                      { title: 'Connect a founder', xp: '+50 XP' },
                      { title: 'Active contribution', xp: '+25 XP' }
                    ],
                    promo: ['1200 XP earned', 'Major impact created', 'Community endorsement']
                  },
                  '04': {
                    color: '#FF3366',
                    title: 'Lead',
                    badge: 'BECOME THE NETWORK',
                    quote: '"Leadership is earned through contribution."',
                    desc: "Ambassadors represent and grow the ecosystem inside their college. They help students discover opportunities, guide new members, organize workshops, and build communities.",
                    icon: <Crown size={20} />,
                    unlocks: [
                      { icon: <Shield size={16} />, title: 'Official Ambassador Status', desc: 'Physical badge included.' },
                      { icon: <Crown size={16} />, title: 'Free Subscription', desc: 'Full College Circle access.' },
                      { icon: <Zap size={16} />, title: '1000 AI Credits', desc: 'Power your workflows.' },
                      { icon: <Users size={16} />, title: 'Leadership Recognition', desc: 'Official network status.' }
                    ],
                    xp: { current: 1850, max: 3000, text: '1850 / 3000 XP', pct: '61%' },
                    nextTier: 'Scale',
                    activities: [
                      { title: 'Become campus ambassador', xp: '+500 XP' },
                      { title: 'Organize a workshop', xp: '+300 XP' },
                      { title: 'Guide new members', xp: '+200 XP' }
                    ],
                    promo: ['3000 XP earned', 'Campus community built', 'Board approval']
                  },
                  '05': {
                    color: '#FF0055',
                    title: 'Scale',
                    badge: 'LEAD AN ENTIRE UNIVERSITY',
                    quote: '"You now build systems, not events."',
                    desc: "University Ambassadors coordinate ecosystem growth across departments and colleges. They manage ambassadors, support expansion, and help build a thriving student network.",
                    icon: <Users size={20} />,
                    unlocks: [
                      { icon: <Crown size={16} />, title: 'Full Premium Access', desc: 'Highest tier subscription.' },
                      { icon: <Zap size={16} />, title: '3000 Credits', desc: 'Massive workflow limits.' },
                      { icon: <Network size={16} />, title: 'Founder Networking', desc: 'Exclusive closed-door access.' },
                      { icon: <Trophy size={16} />, title: 'Scale: 500–1000 Explorers', desc: 'University Leadership Status.' }
                    ],
                    xp: { current: 3500, max: 5000, text: '3500 / 5000 XP', pct: '70%' },
                    nextTier: 'Expand',
                    activities: [
                      { title: 'Coordinate departments', xp: '+800 XP' },
                      { title: 'Manage ambassadors', xp: '+600 XP' },
                      { title: 'Support expansion', xp: '+500 XP' }
                    ],
                    promo: ['5000 XP earned', 'University node established', 'Network expansion']
                  },
                  '06': {
                    color: '#B300FF',
                    title: 'Expand',
                    badge: 'BUILD A CITY-WIDE ECOSYSTEM',
                    quote: '"Your impact extends beyond a campus."',
                    desc: "District Ambassadors connect colleges, ambassadors, contributors, and builders across an entire city.",
                    icon: <Network size={20} />,
                    unlocks: [
                      { icon: <Crown size={16} />, title: 'Free Annual Premium', desc: 'Complete ecosystem access.' },
                      { icon: <Shield size={16} />, title: 'Revenue Sharing', desc: 'Up to 25% revenue opportunities.' },
                      { icon: <Users size={16} />, title: 'Strategic Operator Access', desc: 'Work with core team.' },
                      { icon: <Trophy size={16} />, title: 'Scale: Up to 10,000 Students', desc: 'City-Level Leadership.' }
                    ],
                    xp: { current: 6000, max: 10000, text: '6000 / 10000 XP', pct: '60%' },
                    nextTier: 'Impact',
                    activities: [
                      { title: 'Connect city colleges', xp: '+1500 XP' },
                      { title: 'Host a city mixer', xp: '+1000 XP' },
                      { title: 'Drive revenue', xp: '+1200 XP' }
                    ],
                    promo: ['10000 XP earned', 'City ecosystem thriving', 'Core team integration']
                  },
                  '07': {
                    color: '#00FFFF',
                    title: 'Impact',
                    badge: 'SHAPE THE FUTURE OF THE NETWORK',
                    quote: '"Very few people reach this level."',
                    desc: "Country Ambassadors become strategic ecosystem partners helping scale the community nationally. They guide leadership teams, expansion initiatives, partnerships, and growth strategies.",
                    icon: <Trophy size={20} />,
                    unlocks: [
                      { icon: <Crown size={16} />, title: 'Direct Founder Access', desc: 'Partner level communication.' },
                      { icon: <Network size={16} />, title: 'Strategic Planning Access', desc: 'Guide network growth.' },
                      { icon: <Users size={16} />, title: 'Premium Network', desc: 'Ecosystem Authority.' },
                      { icon: <Trophy size={16} />, title: 'Scale: 1,00,000+ Students', desc: 'National Leadership.' }
                    ],
                    xp: { current: 15000, max: 20000, text: '15000 / 20000 XP', pct: '75%' },
                    nextTier: 'MAX',
                    activities: [
                      { title: 'Scale nationally', xp: '+5000 XP' },
                      { title: 'Strategic partnerships', xp: '+4000 XP' },
                      { title: 'Guide leadership', xp: '+3000 XP' }
                    ],
                    promo: ['20000 XP earned', 'National ecosystem shaped', 'Partner status achieved']
                 }
                }

                const currentTier = activeTierModal ? tierData[activeTierModal as keyof typeof tierData] : tierData['01']

                return (
                  <motion.div key={activeTierModal} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%' }}>
                    <style>{`
                      @media (max-width: 768px) {
                        .tier-modal-box {
                          padding: 20px 16px !important;
                          border-radius: 18px !important;
                        }
                      }
                    `}</style>
                    {/* Left Column */}
                    <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                      {/* Info Card */}
                      <div className="tier-modal-box" style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '32px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `rgba(${parseInt(currentTier.color.slice(1, 3), 16)},${parseInt(currentTier.color.slice(3, 5), 16)},${parseInt(currentTier.color.slice(5, 7), 16)},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentTier.color }}>
                            {currentTier.icon}
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: c.text40, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: '4px' }}>LEVEL {activeTierModal} • {currentTier.badge}</div>
                            <h3 style={{ fontSize: '24px', fontWeight: 800, color: c.text }}>{currentTier.title}</h3>
                          </div>
                        </div>
                        <div style={{ fontSize: '15px', color: currentTier.color, fontStyle: 'italic', marginBottom: '16px' }}>{currentTier.quote}</div>
                        <p style={{ color: c.text70, fontSize: '14px', lineHeight: 1.6 }}>{currentTier.desc}</p>
                      </div>

                      <div style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)', marginTop: '16px' }}>WHAT UNLOCKS</div>

                      {/* Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {currentTier.unlocks.map((perk, i) => (
                          <div key={i} className="tier-modal-box" style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '20px', padding: '24px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `rgba(${parseInt(currentTier.color.slice(1, 3), 16)},${parseInt(currentTier.color.slice(3, 5), 16)},${parseInt(currentTier.color.slice(5, 7), 16)},0.05)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentTier.color }}>
                                {perk.icon}
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: c.text }}>{perk.title}</div>
                            </div>
                            <div style={{ fontSize: '13px', color: c.text50, lineHeight: 1.5 }}>{perk.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                      {/* XP Card */}
                      <div className="tier-modal-box" style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: c.text40, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>XP PROGRESSION</div>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: currentTier.color, fontFamily: 'var(--font-mono)' }}>{currentTier.xp.text}</div>
                        </div>

                        <div style={{ height: '6px', background: c.border05, borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: currentTier.xp.pct, background: `linear-gradient(90deg, ${currentTier.color} 0%, rgba(255,255,255,1) 100%)`, borderRadius: '3px' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', fontSize: '12px', color: c.text50 }}>
                          <div>{currentTier.title}</div>
                          <div>Next: {currentTier.nextTier}</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {currentTier.activities.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: c.text }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Zap size={14} color={currentTier.color} /> {item.title}
                              </div>
                              <div style={{ color: currentTier.color, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{item.xp}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Promo Card */}
                      <div style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '32px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: c.text40, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: '24px' }}>PROMOTION TO {currentTier.nextTier.toUpperCase()}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {currentTier.promo.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: c.text }}>
                              <div style={{ color: currentTier.color }}>✓</div> {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Card */}
                      <div
                        onClick={() => {
                          window.open('https://docs.google.com/forms/d/e/1FAIpQLScuWSCu-8TwZPABvfl0LiOnVRDhUNjTmVV0PnRZnlYOwZLLkA/viewform', '_blank');
                        }}
                        style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = c.border05}
                        onMouseLeave={(e) => e.currentTarget.style.background = c.border02}
                      >
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: c.text40, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: '8px' }}>BEGIN JOURNEY</div>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: c.text }}>Claim Access</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: c.border05, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ArrowRight size={16} color={currentTier.color} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })()}

              <div style={{ textAlign: 'center', marginTop: '48px', fontSize: '10px', fontWeight: 700, color: c.text30, fontFamily: 'var(--font-mono)', letterSpacing: '0.2em' }}>
                THE MORE YOU CONTRIBUTE • THE MORE ACCESS YOU UNLOCK
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ComponentErrorBoundary>
        <Footer />
      </ComponentErrorBoundary>
    </div>
  )
}
