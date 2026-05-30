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
import { Sun, ArrowRight, Terminal, Network, Rocket, Code2, Users, Compass, Zap, Shield, Crown, MessageSquare, Heart, Repeat, Flame, Sparkles, Moon, Cpu, Briefcase, Library, Star, MapPin, Trophy, ArrowUpRight } from 'lucide-react'

export default function CommunityPage() {
  const lenis = useLenis()
  const [mounted, setMounted] = useState(false)
  const [activeTierModal, setActiveTierModal] = useState<string | null>(null)
  const [activePathway, setActivePathway] = useState<'builder' | 'creator'>('builder')

  
  useEffect(() => {
    setMounted(true)
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
      {mounted && (
        <ComponentErrorBoundary>
          <div style={{ opacity: isDark ? 1 : 0.3, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <DarkAurora />
          </div>
          <ElegantParticles count={40} />
        </ComponentErrorBoundary>
      )}

      
      {mounted && (
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(139, 128, 249, 0.15)' : 'rgba(139, 128, 249, 0.05)' }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "absolute", top: "clamp(20px, 4vw, 40px)", right: "clamp(20px, 4vw, 40px)",
            backgroundColor: 'rgba(139, 128, 249, 0)', border: `1px solid ${c.border10}`,
            borderRadius: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: c.text, cursor: 'pointer', zIndex: 100, transition: 'all 0.3s ease'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={theme} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      )}

      <ComponentErrorBoundary>
        <Header onGetStarted={() => window.location.href = '/login'} />
      </ComponentErrorBoundary>

      <main style={{ flex: 1, marginTop: '120px', paddingBottom: '80px', position: 'relative', zIndex: 10 }}>
        
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
              
              <h1 style={{ fontFamily: 'var(--font-body), system-ui, sans-serif', fontSize: 'clamp(40px, 5vw, 80px)', fontWeight: 800, color: c.text, lineHeight: 1.08, marginBottom: '24px', letterSpacing: '-0.02em' }}>
                Build the future<br />
                <span style={{ color: '#9B90FF' }}>student culture.</span>
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <style>{`
                @media (max-width: 768px) {
                  .hero-badge-1 { left: 10px !important; top: 5% !important; }
                  .hero-badge-2 { left: 10px !important; bottom: 5% !important; }
                  .hero-badge-3 { right: 10px !important; top: 50% !important; transform: translateY(-50%) !important; }
                  .hero-badge { padding: 12px 16px !important; gap: 10px !important; }
                  .hero-badge-title { font-size: 12px !important; }
                  .hero-badge-sub { font-size: 9px !important; }
                }
              `}</style>
              
              {/* Fake concentric circles behind */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'clamp(300px, 150vw, 700px)', height: 'clamp(300px, 150vw, 700px)', borderRadius: '50%', border: `1px solid ${c.border08}`, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'clamp(200px, 100vw, 500px)', height: 'clamp(200px, 100vw, 500px)', borderRadius: '50%', border: `1px solid ${c.border15}`, pointerEvents: 'none' }} />
              
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
                This isn't a club.<br/>
                <span style={{ color: '#9B90FF' }}>
                  It's an operating<br/>
                  network<br/>
                  for AI-native<br/>
                  students.
                </span>
              </h2>
              <p style={{ color: c.text60, fontSize: '15px', lineHeight: 1.6, maxWidth: '400px' }}>
                Community One is the infrastructure layer for the next generation of student builders. Not ambassadors. Not volunteers. Operators.
              </p>
            </motion.div>

            {/* Right Side Cards */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ flex: '1 1 600px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { title: 'AI Workshops', desc: 'Immersive sessions on prompt engineering, agents, and the AI stack.', icon: <Network size={16} color="#8B80F9" /> },
                { title: 'Builder Network', desc: 'Build with operators across 24 cities. Ship in public. Get noticed.', icon: <Terminal size={16} color="#8B80F9" /> },
                { title: 'Startup Exposure', desc: 'Direct access to founders, VCs, and the Indian AI ecosystem.', icon: <Rocket size={16} color="#8B80F9" /> },
                { title: 'Real Projects', desc: 'Work on shipped products — not toy demos, not case studies.', icon: <Code2 size={16} color="#8B80F9" /> },
                { title: 'Mentorship', desc: '1:1 with operators who\'ve built in the AI space.', icon: <Compass size={16} color="#8B80F9" /> },
                { title: 'Community Expansion', desc: 'Become campus ambassadors, run cohorts, lead culture.', icon: <Users size={16} color="#8B80F9" /> }
              ].map((card, i) => (
                <motion.div key={i} variants={fadeInUp} style={{ background: c.cardLight, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', backdropFilter: 'blur(10px)', transition: 'transform 0.2s', cursor: 'default' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: c.border03, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: c.text, marginBottom: '8px' }}>{card.title}</h3>
                    <p style={{ color: c.text50, fontSize: '13px', lineHeight: 1.6 }}>{card.desc}</p>
                  </div>
                </motion.div>
              ))}
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
                Explorer → Pathfinder → Builder → Ambassador Lead. Every level unlocks new opportunities — earned through contribution, not bought.
              </p>
            </motion.div>

            <style>{`
              @media (max-width: 768px) {
                .progression-arrow svg { transform: rotate(90deg); }
              }
            `}</style>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(20px, 4vw, 40px)' }}>
              {[
                { lvl: '01', title: 'Explorer', badge: undefined, subtitle: 'Enter the ecosystem.', desc: 'Curious students stepping in early. AI study systems, workshops, networking.', icon: <Compass size={20}/>, perks: ['AI Study Systems', 'Beginner Workshops', 'Networking Access', 'Roadmap Guidance'] },
                { lvl: '04', title: 'Ambassador Lead', badge: undefined, subtitle: 'Operate the ecosystem.', desc: 'Run communities. Host workshops. Connect founders. Shape direction.', icon: <Crown size={20}/>, perks: ['Leadership Access', 'Founder Networking', 'Verified Identity', 'Ecosystem Strategy'] }
              ].map((tier, i) => (
                <React.Fragment key={i}>
                  <motion.div onClick={() => setActiveTierModal(tier.lvl)} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ flex: '1 1 300px', maxWidth: '400px', background: c.tierCardGradient, border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '32px 24px', position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                    
                    {/* Top Bar (Level + Arrow) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: c.text50, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>LV {tier.lvl}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {tier.badge && (
                        <div style={{ background: 'rgba(123, 107, 255, 0.1)', color: '#9B90FF', padding: '4px 10px', borderRadius: '100px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', border: '1px solid rgba(123, 107, 255, 0.2)' }}>
                          {tier.badge}
                        </div>
                      )}
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.border03, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <ArrowRight size={12} color="rgba(255,255,255,0.5)" style={{ transform: 'rotate(-45deg)' }} />
                      </div>
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
                {i === 0 && (
                  <motion.div className="progression-arrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ padding: '16px', background: c.border03, borderRadius: '50%', border: `1px solid ${c.border10}` }}>
                      <ArrowRight size={24} color="#9B90FF" />
                    </div>
                  </motion.div>
                )}
                </React.Fragment>
              ))}
            </div>
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
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
              {/* Explorer Card */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#00FF9D', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: '16px' }}>EARLY ECOSYSTEM ACCESS</div>
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: c.text, marginBottom: '8px' }}>Explorer Access</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '18px', color: c.text50, textDecoration: 'line-through' }}>$10</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#00FF9D' }}>FREE</span>
                </div>
                
                <div style={{ background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.2)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <span style={{ color: '#00FF9D', fontSize: '13px', fontWeight: 600 }}>Curated ecosystem access</span>
                  <span style={{ color: '#00FF9D', fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>50 Seats Left</span>
                </div>
                
                <button onClick={() => setActiveTierModal('01')} style={{ width: '100%', padding: '16px', background: c.border05, border: `1px solid ${c.border10}`, borderRadius: '100px', color: c.text, fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = c.border10} onMouseLeave={(e) => e.currentTarget.style.background = c.border05}>
                  View Explorer Pathway <ArrowRight size={16} />
                </button>
              </motion.div>

              {/* Builder Card */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ background: c.tierCardGradient, border: `1px solid ${c.border10}`, borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(123, 107, 255, 0.1)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #7B6BFF, #9B90FF)' }} />
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#9B90FF', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: '16px' }}>OPERATE THE ECOSYSTEM</div>
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: c.text, marginBottom: '8px' }}>Ambassador Lead</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '18px', color: c.text50, textDecoration: 'line-through' }}>$30</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#9B90FF' }}>FREE</span>
                </div>
                
                <div style={{ background: 'rgba(123, 107, 255, 0.1)', border: '1px solid rgba(123, 107, 255, 0.2)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <span style={{ color: '#9B90FF', fontSize: '13px', fontWeight: 600 }}>Curated ecosystem access</span>
                  <span style={{ color: '#9B90FF', fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>25 Seats Left</span>
                </div>
                
                <button onClick={() => setActiveTierModal('04')} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #7B6BFF 0%, #9B90FF 100%)', border: 'none', borderRadius: '100px', color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(123, 107, 255, 0.2)' }}>
                  View Ambassador Pathway <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>
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
              Not workshops.<br/>
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
            
            <div style={{ position: 'relative', padding: '0 0 40px 0' }}>
              {/* Vertical line */}
              <div className="experience-line" style={{ position: 'absolute', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(180deg, transparent, rgba(123, 107, 255, 0.3) 10%, rgba(123, 107, 255, 0.3) 90%, transparent)' }} />
              
              {[
                { step: '01', title: 'SHOCK', heading: "An AI moment they can't unsee.", desc: "We open with a live demo so visceral it rewires how students think about their next four years." },
                { step: '02', title: 'DEMO', heading: "Live prompt engineering battles.", desc: "Resume roasting by AI. Productivity stack speedruns. Real builders, on stage, shipping." },
                { step: '03', title: 'INTERACTION', heading: "Hands on the toolkit.", desc: "Every attendee builds something — a workflow, an agent, a side hustle prototype — before they leave." },
                { step: '04', title: 'ONBOARD', heading: "Welcome to the network.", desc: "Discord invite. Cohort match. First mission within 48 hours. The community becomes the next chapter." }
              ].map((item, i) => (
                <div key={i} className="experience-item" style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end', position: 'relative', marginBottom: '80px' }}>
                  
                  {/* Timeline Dot */}
                  <div className="experience-dot" style={{ position: 'absolute', top: '24px', transform: 'translate(-50%, -50%)', width: '28px', height: '28px', borderRadius: '50%', background: c.gradBase, border: '1px solid rgba(123,107,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9B90FF', boxShadow: '0 0 10px #7B6BFF' }} />
                  </div>

                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className={`experience-content ${i % 2 === 0 ? 'left-side' : 'right-side'}`}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9B90FF', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: '16px' }}>
                      {item.step} <span style={{ color: c.text30, margin: '0 4px' }}>•</span> {item.title}
                    </div>
                    <h3 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: c.text, marginBottom: '16px', letterSpacing: '-0.02em' }}>{item.heading}</h3>
                    <p style={{ color: c.text50, fontSize: '14px', lineHeight: 1.6, display: 'inline-block', maxWidth: '350px' }}>
                      {item.desc}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
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
                Compounding leverage<br/>
                <span style={{ color: c.text30 }}>from day one.</span>
              </h2>
              <p style={{ color: c.text60, fontSize: '13px', maxWidth: '300px', marginBottom: '10px' }}>
                Every operator gets the same starting kit the early team uses to ship.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              
              {/* Big Left Card */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} whileHover={{ y: -4 }} style={{ flex: '1 1 500px', background: isDark ? 'linear-gradient(180deg, rgba(20,15,25,0.8) 0%, rgba(30,20,50,0.4) 100%)' : 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(240,240,250,0.8) 100%)', border: `1px solid ${c.border08}`, borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(20px)', transition: 'all 0.3s ease', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                <div style={{ background: 'rgba(139,128,249,0.15)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                  <Rocket size={24} color="#8B80F9" />
                </div>
                <div style={{ zIndex: 10 }}>
                  <h3 style={{ fontSize: '28px', fontWeight: 800, color: c.text, letterSpacing: '-0.02em', marginBottom: '12px' }}>Startup Exposure</h3>
                  <p style={{ color: c.text60, fontSize: '14px', lineHeight: 1.6, maxWidth: '80%' }}>Get direct access to the fastest growing AI startups in the country. Skip the resume pile and let your shipped projects do the talking.</p>
                </div>
                <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '300px', height: '300px', background: '#7B6BFF', filter: 'blur(100px)', opacity: isDark ? 0.3 : 0.15, borderRadius: '50%' }} />
              </motion.div>

              {/* Right Grid */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ flex: '1 1 600px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignContent: 'start' }}>
                {[
                  { title: 'Founder Access', desc: 'Direct 1:1s with AI founders', icon: <Users size={18} /> },
                  { title: 'Real AI Projects', desc: 'Ship production-ready code', icon: <Cpu size={18} /> },
                  { title: 'Internship Pathways', desc: 'Fast-tracked hiring', icon: <Briefcase size={18} /> },
                  { title: 'AI Resources', desc: 'Premium API credits & tools', icon: <Library size={18} /> },
                  { title: 'Community Status', desc: 'Earned, never bought', icon: <Star size={18} /> },
                  { title: 'National Network', desc: '24 cities, 80 nodes', icon: <MapPin size={18} /> }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} whileHover={{ y: -4, borderColor: 'rgba(139,128,249,0.4)', boxShadow: '0 10px 30px rgba(139,128,249,0.08)' }} style={{ background: c.card, border: `1px solid ${c.border08}`, borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'default' }}>
                    <div style={{ color: '#8B80F9', background: 'rgba(139,128,249,0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: c.text, marginBottom: '4px' }}>{item.title}</h3>
                      <p style={{ fontSize: '12px', color: c.text50, fontWeight: 500 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
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
              Every action compounds<br/>
              <span style={{ color: c.text30 }}>into access.</span>
            </motion.h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(16px, 4vw, 24px)' }}>
              {/* Left Panel: Scoring System */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ flex: '1 1 450px', background: isDark ? c.cardLight : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '40px', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>EXPERTISE POINTS (XP)</span>
                  <Trophy size={16} color="#E5C158" />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { label: 'Project contribution', pts: '+50 XP' },
                    { label: 'Creator collaboration', pts: '+40 XP' },
                    { label: 'Attend workshop', pts: '+20 XP' },
                    { label: 'Networking session', pts: '+15 XP' }
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: c.text }}>{item.label}</span>
                        <div style={{ background: 'rgba(123, 107, 255, 0.1)', color: '#9B90FF', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{item.pts}</div>
                      </div>
                      {i < 3 && <div style={{ height: '1px', background: c.border05, width: '100%' }} />}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Panel: Monthly Structure */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: 'AI-Native Workshops', desc: 'Deep dive into prompt engineering, agents, and execution frameworks.', highlight: true },
                  { title: 'Startup Systems', desc: 'Build real operational experience with live case studies and founder feedback.', highlight: false },
                  { title: 'Creator Ecosystems', desc: 'Collaborate with editors, designers, and storytellers to build massive internet leverage.', highlight: false },
                  { title: 'Micro-Group Networking', desc: 'Join small growth circles for extreme accountability and ecosystem bonding.', highlight: false }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} style={{ background: item.highlight ? 'linear-gradient(90deg, rgba(15,15,20,0.6) 0%, rgba(60,40,100,0.4) 100%)' : (isDark ? c.cardLight : '#F7F6F2'), border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '8px', backdropFilter: 'blur(10px)' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: item.highlight ? '#9B90FF' : c.text }}>{item.title}</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: c.text60, lineHeight: 1.6 }}>{item.desc}</div>
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

          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: c.text, lineHeight: 1.1, marginBottom: '80px', letterSpacing: '-0.02em', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
            People don't join<br/>
            <span style={{ color: '#9B90FF' }}>clubs</span><br/>
            anymore.<br/>
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, color: c.text40 }}>they join movements.</span>
          </motion.h2>

          {/* Tweet Cards */}
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '32px', maxWidth: '1400px', margin: '0 auto', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
            {[
              {
                name: '@arjun.builds', role: 'AI OPERATOR • BANGALORE', icon: <Flame size={14} color="#fff" />, color: '#FF5C00',
                text: "shipped my first agent in cohort 01. tomorrow we hack the campus LMS. wild week",
                likes: '412', replies: '51', retweets: '34'
              },
              {
                name: '@simrun.eth', role: 'CULTURE BUILDER • DELHI', icon: <Sparkles size={14} color="#fff" />, color: '#9B90FF',
                text: "the reel hit 240k. operators are the new founders. this isn't a phase.",
                likes: '1240', replies: '155', retweets: '103'
              },
              {
                name: '@kabir.codes', role: 'CAMPUS AMBASSADOR • PUNE', icon: <Moon size={14} color="#fff" />, color: '#7B6BFF',
                text: "3am, discord on, three of us building. this is the network i was promised.",
                likes: '380', replies: '47', retweets: '31'
              },
              {
                name: '@ananya.ai', role: 'AI OPERATOR • HYDERABAD', icon: <Zap size={14} color="#fff" />, color: '#FF3366',
                text: "ran our first prompt battle today. 80 students showed. cohort is officially live.",
                likes: '612', replies: '76', retweets: '51'
              }
            ].map((tweet, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} style={{ flex: '0 0 320px', scrollSnapAlign: 'start', background: c.card, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: tweet.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {tweet.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: c.text }}>{tweet.name}</div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: c.text40, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>{tweet.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: c.text80, lineHeight: 1.6, flex: 1 }}>
                  {tweet.text}
                </div>
                <div style={{ display: 'flex', gap: '16px', color: c.text40, fontSize: '12px', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heart size={14} /> {tweet.likes}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={14} /> {tweet.replies}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Repeat size={14} /> {tweet.retweets}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '48px', maxWidth: '800px', margin: '48px auto 0' }}>
            {['#builtbyoperators', '#cohort01', '#latenightbuilders', '#aithisweekend', '#campusambassadors', '#thenetwork'].map((tag, i) => (
              <div key={i} style={{ padding: '8px 16px', background: c.border03, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '12px', color: c.text50, fontFamily: 'var(--font-mono)' }}>
                {tag}
              </div>
            ))}
          </motion.div>
        </section>


        {/* FINAL CTA SECTION */}
        <section style={{ position: 'relative', padding: '160px 5%', textAlign: 'center', background: `linear-gradient(180deg, ${c.gradBase} 0%, ${c.gradTop} 100%)`, overflow: 'hidden' }}>
          {/* Removed Subtle Grid Overlay */}
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
              <span style={{ color: c.text }}>India's AI-native</span><br/>
              <span style={{ color: '#7B6BFF' }}>student culture</span><br/>
              <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, color: c.text40 }}>starts here.</span>
            </h2>
            <p style={{ color: c.text50, fontSize: '15px', marginBottom: '48px', fontWeight: 500 }}>The future will not be built by average students.</p>
            <motion.a
              href="https://docs.google.com/forms/d/e/1FAIpQLScuWSCu-8TwZPABvfl0LiOnVRDhUNjTmVV0PnRZnlYOwZLLkA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #7B6BFF 0%, #9B90FF 100%)', color: c.text, padding: '16px 32px', borderRadius: '100px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 10px 25px rgba(123, 107, 255, 0.3)' }}
            >
              Apply To The Network <ArrowUpRight size={18} />
            </motion.a>
          </motion.div>
        </section>

      </main>

      {/* TIER PROGRESSION MODAL */}
      <AnimatePresence>
        {activeTierModal && (
          <div onClick={() => setActiveTierModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5%', background: c.overlay, backdropFilter: 'blur(10px)' }}>
            <motion.div data-lenis-prevent="true" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ width: '100%', maxWidth: '1200px', maxHeight: '90vh', overflowY: 'auto', overscrollBehavior: 'contain', background: isDark ? 'linear-gradient(180deg, rgba(20,15,30,1) 0%, rgba(10,10,15,1) 100%)' : '#FFFFFF', border: `1px solid ${c.border10}`, borderRadius: '24px', position: 'relative', padding: '64px', boxShadow: isDark ? '0 40px 100px rgba(0,0,0,0.5)' : '0 40px 100px rgba(0,0,0,0.1)' }}>
              
              {/* Close button */}
              <button onClick={() => setActiveTierModal(null)} style={{ position: 'absolute', top: '32px', right: '32px', width: '40px', height: '40px', borderRadius: '50%', background: c.border05, border: `1px solid ${c.border10}`, color: c.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                ✕
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: c.text50, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>ECOSYSTEM PROGRESSION MAP</div>
                
                {/* Pathway Toggle */}
                <div style={{ display: 'flex', background: isDark ? c.border02 : '#F7F6F2', borderRadius: '100px', padding: '4px', border: `1px solid ${c.border05}` }}>
                  <button onClick={() => setActivePathway('builder')} style={{ background: activePathway === 'builder' ? c.border05 : 'transparent', color: activePathway === 'builder' ? c.text : c.text50, border: 'none', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Terminal size={14} /> Builder Track
                  </button>
                  <button onClick={() => setActivePathway('creator')} style={{ background: activePathway === 'creator' ? c.border05 : 'transparent', color: activePathway === 'creator' ? c.text : c.text50, border: 'none', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Creator Track
                  </button>
                </div>
              </div>
              
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: c.text, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em', fontFamily: 'var(--font-body), system-ui, sans-serif', maxWidth: '800px' }}>
                {activePathway === 'builder' ? 'Build systems.' : 'Build narratives.'} <span style={{ color: '#9B90FF' }}>{activePathway === 'builder' ? 'Build the future.' : 'Build the culture.'}</span>
              </h2>
              
              <p style={{ color: c.text50, fontSize: '15px', lineHeight: 1.6, maxWidth: '600px', marginBottom: '64px' }}>
                {activePathway === 'builder' ? 'Explorer → Pathfinder → Builder → Ambassador Lead. For students who want to build systems, create projects, work with AI, and collaborate with founders.' : 'Explorer → Pathfinder → Creator → Culture Lead. For students interested in storytelling, content creation, editing, and internet culture.'}
              </p>

              {/* Progress Steps */}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginBottom: '80px', padding: '0 40px' }}>
                <div style={{ position: 'absolute', top: '24px', left: '40px', right: '40px', height: '1px', background: c.border10, zIndex: 1 }} />
                {[
                  { lvl: '01', name: 'Explorer', icon: <Compass size={20} />, active: activeTierModal === '01' },
                  { lvl: '02', name: 'Pathfinder', icon: <Zap size={20} />, active: activeTierModal === '02' },
                  { lvl: '03', name: activePathway === 'builder' ? 'Builder' : 'Creator', icon: activePathway === 'builder' ? <Terminal size={20} /> : <Sparkles size={20} />, active: activeTierModal === '03' },
                  { lvl: '04', name: activePathway === 'builder' ? 'Ambassador Lead' : 'Culture Lead', icon: activePathway === 'builder' ? <Crown size={20} /> : <Trophy size={20} />, active: activeTierModal === '04' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 2, cursor: 'pointer' }} onClick={() => setActiveTierModal(step.lvl)}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: step.active ? 'rgba(0,255,157,0.1)' : (isDark ? c.gradBase : '#FFFFFF'), border: step.active ? '2px solid #00FF9D' : `1px solid ${c.border10}`, color: step.active ? '#00FF9D' : c.text40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: step.active ? '0 0 20px rgba(0,255,157,0.2)' : 'none' }}>
                      {step.icon}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: step.active ? '#00FF9D' : c.text40, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: '4px' }}>LV {step.lvl}</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: step.active ? c.text : c.text40 }}>{step.name}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Two Column Layout */}
              {(() => {
                const tierData = {
                  '01': {
                    color: '#00FF9D',
                    title: 'Explorer',
                    badge: 'ENTRY INTO THE ECOSYSTEM',
                    quote: '"Most students consume. Explorers start exploring early."',
                    desc: "You're already curious enough to step in. Explorer is not beginner mode — it's the realization that the future is moving faster than college.",
                    icon: <Compass size={20} />,
                    unlocks: [
                      { icon: <Compass size={16} />, title: 'AI Study Systems', desc: 'Smart revision, crash notes, PYQ systems, exam workflows.' },
                      { icon: <Zap size={16} />, title: 'AI Exposure', desc: 'Beginner workshops, future careers, creator + startup ecosystem.' },
                      { icon: <Users size={16} />, title: 'Networking Access', desc: 'Discussion rooms, campus circles, student growth groups.' },
                      { icon: <Rocket size={16} />, title: 'Guidance Systems', desc: 'Roadmaps, mentorship, college survival, direction support.' }
                    ],
                    xp: { current: 63, max: 150, text: '63 / 150 XP', pct: '42%' },
                    nextTier: 'Pathfinder',
                    activities: [
                      { title: 'Attend a workshop', xp: '+20 XP' },
                      { title: 'Join a networking session', xp: '+15 XP' },
                      { title: 'Upload notes / PYQ', xp: '+10 XP' },
                      { title: 'Community participation', xp: '+5 XP' }
                    ],
                    promo: ['150 XP earned', '2 workshops attended', '1 networking session', 'Active participation']
                  },
                  '02': {
                    color: '#9B90FF',
                    title: 'Pathfinder',
                    badge: 'ACTIVE INSIDE THE ECOSYSTEM',
                    quote: '"Progression is earned through contribution — never bought."',
                    desc: "Pathfinders move from curiosity to involvement. You start showing up for the work, the people, and the ambition.",
                    icon: <Zap size={20} />,
                    unlocks: [
                      { icon: <Compass size={16} />, title: 'AI Workflow Workshops', desc: 'Deeper systems for building with AI, not just using it.' },
                      { icon: <Rocket size={16} />, title: 'Startup Systems', desc: 'How ambitious students think, ship, and operate.' },
                      { icon: <Users size={16} />, title: 'Accountability Groups', desc: 'Small circles that compound your output weekly.' },
                      { icon: <Sparkles size={16} />, title: 'Collaboration Circles', desc: 'Project communities & cross-campus build groups.' }
                    ],
                    xp: { current: 297, max: 500, text: '297 / 500 XP', pct: '59.4%' },
                    nextTier: 'Builder',
                    activities: [
                      { title: 'Lead a session', xp: '+35 XP' },
                      { title: 'Ship a mini-project', xp: '+40 XP' },
                      { title: 'Bring active members', xp: '+25 XP' },
                      { title: 'Cohort contribution', xp: '+20 XP' }
                    ],
                    promo: ['500 XP earned', '1 project shipped', 'Sustained weekly activity', 'Peer endorsement']
                  },
                  '03': activePathway === 'builder' ? {
                    color: '#FFB800',
                    title: 'Builder',
                    badge: 'BUILD WITH THE NETWORK',
                    quote: '"Builders ship. They do not wait for permission."',
                    desc: "Contributors, not members. You are now shipping projects, writing content, and building IP alongside founders.",
                    icon: <Terminal size={20} />,
                    unlocks: [
                      { icon: <Code2 size={16} />, title: 'AI Project Access', desc: 'Direct access to build AI tools with the community.' },
                      { icon: <Users size={16} />, title: 'Creator Cohorts', desc: 'Intensive groups for content and personal branding.' },
                      { icon: <Crown size={16} />, title: 'Founder Access', desc: 'Direct lines to startup founders and leaders.' },
                      { icon: <Compass size={16} />, title: 'IP & Content', desc: 'Monetize and distribute your intellectual property.' }
                    ],
                    xp: { current: 640, max: 1200, text: '640 / 1200 XP', pct: '53%' },
                    nextTier: 'Ambassador Lead',
                    activities: [
                      { title: 'Ship a major tool', xp: '+150 XP' },
                      { title: 'Host a cohort', xp: '+100 XP' },
                      { title: 'Publish viral IP', xp: '+80 XP' },
                      { title: 'Connect a founder', xp: '+50 XP' }
                    ],
                    promo: ['1200 XP earned', '3 projects shipped', 'Community endorsement', 'Founder referral']
                  } : {
                    color: '#FFB800',
                    title: 'Creator',
                    badge: 'SHAPE THE CULTURE',
                    quote: '"Creators don\'t just consume culture, they design it."',
                    desc: 'You are now shipping content, building internet systems, and telling stories that expand the network.',
                    icon: <Sparkles size={20} />,
                    unlocks: [
                      { icon: <Sparkles size={16} />, title: 'Creator Cohorts', desc: 'Work with editors, designers, and storytellers.' },
                      { icon: <Code2 size={16} />, title: 'AI Content Workflows', desc: 'Learn how to scale media with AI tools.' },
                      { icon: <Crown size={16} />, title: 'Founder Access', desc: 'Direct lines to creators and operators.' },
                      { icon: <Compass size={16} />, title: 'IP & Content', desc: 'Monetize and distribute your digital assets.' }
                    ],
                    xp: { current: 640, max: 1200, text: '640 / 1200 XP', pct: '53%' },
                    nextTier: 'Culture Lead',
                    activities: [
                      { title: 'Ship viral content', xp: '+150 XP' },
                      { title: 'Host a creator session', xp: '+100 XP' },
                      { title: 'Launch ecosystem IP', xp: '+80 XP' },
                      { title: 'Brand collaboration', xp: '+50 XP' }
                    ],
                    promo: ['1200 XP earned', '3 major pieces shipped', 'Community endorsement', 'Creator referral']
                  },
                  '04': activePathway === 'builder' ? {
                    color: '#FF3366',
                    title: 'Ambassador Lead',
                    badge: 'OPERATE THE ECOSYSTEM',
                    quote: '"Leadership is taking responsibility for the network\'s growth."',
                    desc: "You run communities, host massive workshops, and connect founders. You shape the strategic direction of the network.",
                    icon: <Crown size={20} />,
                    unlocks: [
                      { icon: <Users size={16} />, title: 'Leadership Access', desc: 'Become campus ambassadors and run city-wide chapters.' },
                      { icon: <Network size={16} />, title: 'Founder Networking', desc: 'Exclusive closed-door founder dinners.' },
                      { icon: <Shield size={16} />, title: 'Verified Identity', desc: 'Blue-tick equivalent within the ecosystem.' },
                      { icon: <Compass size={16} />, title: 'Ecosystem Strategy', desc: 'Seat at the table for network decisions.' }
                    ],
                    xp: { current: 1850, max: 3000, text: '1850 / 3000 XP', pct: '61%' },
                    nextTier: 'Ecosystem Partner',
                    activities: [
                      { title: 'Become a campus ambassador', xp: '+500 XP' },
                      { title: 'Host a city mixer', xp: '+300 XP' },
                      { title: 'Bring a sponsor', xp: '+400 XP' },
                      { title: 'Strategic advisory', xp: '+200 XP' }
                    ],
                    promo: ['3000 XP earned', 'Node successfully run', 'Ecosystem impact', 'Board approval']
                  } : {
                    color: '#FF3366',
                    title: 'Culture Lead',
                    badge: 'OPERATE THE NARRATIVE',
                    quote: '"Leadership is taking responsibility for the network\'s story."',
                    desc: 'You run creator ecosystems, manage the brand, and scale the internet presence of the network.',
                    icon: <Trophy size={20} />,
                    unlocks: [
                      { icon: <Users size={16} />, title: 'Leadership Access', desc: 'Run city-wide creator groups.' },
                      { icon: <Network size={16} />, title: 'Brand Networking', desc: 'Exclusive closed-door creator summits.' },
                      { icon: <Shield size={16} />, title: 'Verified Identity', desc: 'Blue-tick equivalent within the ecosystem.' },
                      { icon: <Compass size={16} />, title: 'Media Strategy', desc: 'Seat at the table for network narratives.' }
                    ],
                    xp: { current: 1850, max: 3000, text: '1850 / 3000 XP', pct: '61%' },
                    nextTier: 'Ecosystem Partner',
                    activities: [
                      { title: 'Run a creator node', xp: '+500 XP' },
                      { title: 'Host a city mixer', xp: '+300 XP' },
                      { title: 'Bring a brand sponsor', xp: '+400 XP' },
                      { title: 'Strategic advisory', xp: '+200 XP' }
                    ],
                    promo: ['3000 XP earned', 'Node successfully run', 'Ecosystem impact', 'Board approval']
                  }
                }

                const currentTier = activeTierModal ? tierData[activeTierModal as keyof typeof tierData] : tierData['01']
                
                return (
                  <motion.div key={activeTierModal} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%' }}>
                    {/* Left Column */}
                    <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {/* Info Card */}
                      <div style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '32px' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `rgba(${parseInt(currentTier.color.slice(1,3),16)},${parseInt(currentTier.color.slice(3,5),16)},${parseInt(currentTier.color.slice(5,7),16)},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentTier.color }}>
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
                          <div key={i} style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '20px', padding: '24px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `rgba(${parseInt(currentTier.color.slice(1,3),16)},${parseInt(currentTier.color.slice(3,5),16)},${parseInt(currentTier.color.slice(5,7),16)},0.05)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentTier.color }}>
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
                    <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {/* XP Card */}
                      <div style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '32px' }}>
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
                          setActiveTierModal(null);
                          setTimeout(() => {
                            if (lenis) {
                              lenis.scrollTo('#apply', { offset: -50, duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                            } else {
                              document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        }}
                        style={{ background: isDark ? c.border02 : '#F7F6F2', border: `1px solid ${c.border05}`, borderRadius: '24px', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }} 
                        onMouseEnter={(e) => e.currentTarget.style.background = c.border05} 
                        onMouseLeave={(e) => e.currentTarget.style.background = c.border02}
                      >
                        <div>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: c.text40, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginBottom: '8px' }}>BEGIN JOURNEY</div>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: c.text }}>Claim {currentTier.title} Access</div>
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
