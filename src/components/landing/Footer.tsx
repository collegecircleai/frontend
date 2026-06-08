'use client'

import Link from 'next/link'
import CCAILogo from '../brand/CCAILogo'
import { Linkedin, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  const navLinks = [
    { name: 'How it Works', href: '/#how-it-works' },
    { name: 'Features', href: '/#features' },
    { name: 'Personalisation', href: '/#personalisation' },
    { name: 'Student Community', href: '/student-community' }
  ]

  return (
    <footer style={{
      background: '#050505',
      padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 80px) clamp(24px, 4vw, 40px) clamp(16px, 4vw, 80px)',
      color: '#888899',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Top Row */}
      <div 
        className="responsive-flex"
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 'clamp(24px, 5vw, 40px)',
          gap: '32px'
        }}
      >
        {/* Logo & Company */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 24px)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <CCAILogo size={32} variant="dark" />
          </Link>
          <div style={{ fontSize: 'clamp(9px, 1.5vw, 12px)', opacity: 0.8 }}>
            College Circle AI Pvt. Ltd.
          </div>
        </div>

        {/* Center Nav */}
        <div style={{ 
          display: 'flex', 
          gap: 'clamp(12px, 3vw, 40px)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              style={{ 
                fontSize: 'clamp(11px, 2vw, 14px)', color: '#888899', textDecoration: 'none',
                transition: 'color 0.2s ease', 
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'white'}
              onMouseOut={(e) => e.currentTarget.style.color = '#888899'}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Socials & URL */}
        <div 
          className="responsive-flex"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            gap: 'clamp(8px, 2vw, 16px)' 
          }}
        >
          <Link 
            href="https://collegecircleai.com"
            style={{ 
              fontSize: 'clamp(12px, 2vw, 14px)', 
              fontWeight: 600, 
              color: 'white',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            collegecircleai.com
          </Link>
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(20px, 3vw, 28px)', 
            alignItems: 'center',
            transition: 'all 0.3s ease'
          }}>
            {[
              { href: "mailto:collegecircleai@gmail.com", icon: <Mail size={20} />, target: "_self" },
              { href: "https://www.linkedin.com/company/collegecircleai/", icon: <Linkedin size={20} />, target: "_blank" },
              { href: "https://www.instagram.com/college.circle.ai/", icon: <Instagram size={20} />, target: "_blank" },
              { 
                href: "https://x.com/AICollegeCircle", 
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ), 
                target: "_blank" 
              }
            ].map((social, i) => (
              <Link 
                key={i}
                href={social.href} 
                target={social.target}
                rel={social.target === "_blank" ? "noopener noreferrer" : undefined}
                style={{ 
                  color: 'inherit', 
                  display: 'flex', 
                  alignItems: 'center',
                  transition: 'color 0.2s ease, transform 0.2s ease',
                  opacity: 0.8
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'inherit'
                  e.currentTarget.style.opacity = '0.8'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px', background: 'rgba(255,255,255,0.05)', width: '100%',
        marginBottom: 'clamp(24px, 5vw, 40px)'
      }} />

      {/* Bottom Legal / Copyright */}
      <div style={{
        textAlign: 'center', fontSize: 'clamp(7px, 1.5vw, 10px)', fontFamily: 'var(--font-mono)',
        opacity: 0.5, letterSpacing: '0.05em'
      }}>
        © 2026 College Circle AI Pvt. Ltd.
      </div>
    </footer>
  )
}
