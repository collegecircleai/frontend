'use client'

import Link from 'next/link'
import CCAILogo from '../brand/CCAILogo'
import { Linkedin, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About College Circle AI', href: '/about' },
        { name: 'The Builders', href: '/about#builders' },
        { name: 'Build with Us', href: '/about#join-builders' },
        { name: 'Student Community', href: '/student-community' },
      ],
    },
    {
      title: 'For Students',
      links: [
        { name: 'Interactive Classrooms', href: '/preview#features' },
        { name: 'Visual Mind Maps', href: '/preview#visual-learning' },
        { name: 'Adaptive Practice Quizzes', href: '/preview#practice' },
        { name: 'AI Study Roadmaps', href: '/preview#personalisation' },
      ],
    },
    {
      title: 'Account',
      links: [
        { name: 'Student Login', href: '/login' },
        { name: 'Create Account', href: '/register' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Email Support', href: 'mailto:collegecircleai@gmail.com', isExternal: true },
        { name: 'Privacy Policy', href: '/privacy-policy' },
      ],
    },
  ]

  const socialLinks = [
    {
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=collegecircleai@gmail.com&su=College%20Circle%20AI%20Support',
      label: 'Email Support',
      target: '_blank',
      hoverColor: '#EA4335',
      hoverBg: 'rgba(234, 67, 53, 0.16)',
      hoverGlow: '0 0 16px rgba(234, 67, 53, 0.45)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="3" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      href: 'https://www.linkedin.com/company/collegecircleai/',
      label: 'LinkedIn',
      target: '_blank',
      hoverColor: '#0A66C2',
      hoverBg: 'rgba(10, 102, 194, 0.16)',
      hoverGlow: '0 0 16px rgba(10, 102, 194, 0.45)',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      href: 'https://www.instagram.com/college.circle.ai/',
      label: 'Instagram',
      target: '_blank',
      hoverColor: '#E1306C',
      hoverBg: 'rgba(225, 48, 108, 0.16)',
      hoverGlow: '0 0 16px rgba(225, 48, 108, 0.45)',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      href: 'https://x.com/AICollegeCircle',
      label: 'X',
      target: '_blank',
      hoverColor: '#FFFFFF',
      hoverBg: 'rgba(255, 255, 255, 0.16)',
      hoverGlow: '0 0 16px rgba(255, 255, 255, 0.45)',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ]

  return (
    <footer
      className="ccai-main-footer"
      style={{
        background: '#141414',
        backgroundColor: '#141414',
        position: 'relative',
        zIndex: 20,
        isolation: 'isolate',
        padding: 'clamp(44px, 6vw, 76px) clamp(20px, 4.5vw, 68px) clamp(28px, 3.5vw, 40px)',
        color: '#a0a0a0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div style={{ maxWidth: '1360px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Top Header Bar: Logo on left, collegecircleai.com + Socials on right */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: 'clamp(40px, 5.5vw, 58px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <CCAILogo size={32} variant="dark" />
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px, 2.5vw, 24px)', flexWrap: 'wrap' }}>
            <Link
              href="https://collegecircleai.com"
              style={{
                fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
                fontSize: '17px',
                color: '#e4e4e7',
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'opacity 0.2s ease, color 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#FFFFFF'
                e.currentTarget.style.opacity = '0.8'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#e4e4e7'
                e.currentTarget.style.opacity = '1'
              }}
            >
              collegecircleai.com
            </Link>

            {/* Single Unified Pill Capsule for Social Icons */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 6px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                gap: '4px',
              }}
            >
              {socialLinks.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  target={social.target}
                  rel={social.target === '_blank' ? 'noopener noreferrer' : undefined}
                  aria-label={social.label}
                  className="footer-social-pill-item"
                  style={{
                    color: '#A6A6B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    textDecoration: 'none',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = social.hoverColor
                    e.currentTarget.style.background = social.hoverBg
                    e.currentTarget.style.boxShadow = social.hoverGlow
                    e.currentTarget.style.transform = 'scale(1.12)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#A6A6B8'
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Column Grid with properly proportioned column widths and divider lines */}
        <style jsx global>{`
          footer.ccai-main-footer,
          [data-theme='dark'] footer.ccai-main-footer,
          [data-theme='light'] footer.ccai-main-footer {
            background: #141414 !important;
            background-color: #141414 !important;
            position: relative !important;
            z-index: 20 !important;
            isolation: isolate !important;
          }
          /* Prevent any parent page transparent backgrounds from rendering over the footer */
          [data-theme='dark'] footer.ccai-main-footer::before {
            content: '';
            position: absolute;
            inset: 0;
            background: #141414;
            z-index: -1;
            pointer-events: none;
          }
          .footer-link-item {
            position: relative;
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .footer-link-text {
            display: inline-flex;
            align-items: center;
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease;
          }
          .footer-link-arrow {
            opacity: 0;
            transform: translateX(-6px);
            transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            color: #8B80F9;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            font-weight: 400;
            line-height: 1;
            pointer-events: none;
          }
          .footer-row-container:hover .footer-link-text,
          .footer-link-item:hover .footer-link-text {
            transform: translateX(6px);
            color: #FFFFFF !important;
          }
          .footer-row-container:hover .footer-link-arrow,
          .footer-link-item:hover .footer-link-arrow {
            opacity: 1;
            transform: translateX(0);
          }
          .footer-row-container {
            transition: border-color 0.25s ease;
          }
          .footer-row-container:hover {
            border-bottom-color: rgba(123, 112, 255, 0.45) !important;
          }
        `}</style>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 230px))',
            gap: 'clamp(28px, 5vw, 64px)',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: 'clamp(48px, 6.5vw, 68px)',
          }}
        >
          {footerSections.map((section) => (
            <div
              key={section.title}
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '230px',
                width: '100%',
              }}
            >
              {/* Column Title - Clean without underline */}
              <div
                style={{
                  paddingBottom: '14px',
                  marginBottom: '4px',
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
                    fontSize: '21px',
                    fontWeight: 500,
                    fontStyle: 'italic',
                    color: '#FFFFFF',
                    letterSpacing: '0.01em',
                    margin: 0,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  }}
                >
                  {section.title}
                </h3>
              </div>

              {/* Column Links with visible divider line under every option including the last one */}
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {section.links.map((link) => (
                  <li
                    key={link.name}
                    className="footer-row-container"
                    style={{
                      padding: '13px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
                    }}
                  >
                    {link.href.startsWith('mailto:') ? (
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=collegecircleai@gmail.com&su=College%20Circle%20AI%20Support"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link-item"
                        onClick={(e) => {
                          const iframe = document.createElement('iframe')
                          iframe.style.display = 'none'
                          iframe.src = 'mailto:collegecircleai@gmail.com'
                          document.body.appendChild(iframe)
                          setTimeout(() => {
                            if (document.body.contains(iframe)) {
                              document.body.removeChild(iframe)
                            }
                          }, 1000)
                        }}
                        style={{
                          fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
                          fontSize: '17px',
                          fontWeight: 400,
                          color: '#9C9CA8',
                          lineHeight: '1.4',
                          cursor: 'pointer',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      >
                        <span className="footer-link-text">{link.name}</span>
                        <span className="footer-link-arrow">→</span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="footer-link-item"
                        style={{
                          fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
                          fontSize: '17px',
                          fontWeight: 400,
                          color: '#9C9CA8',
                          lineHeight: '1.4',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      >
                        <span className="footer-link-text">{link.name}</span>
                        <span className="footer-link-arrow">→</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Centered Copyright */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 400,
            fontFamily: "var(--font-garamond), 'EB Garamond', Georgia, serif",
            color: '#9E9EA8',
            letterSpacing: '0.02em',
            paddingTop: 'clamp(22px, 3.5vw, 36px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.16)',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          <div>© 2026 College Circle AI Pvt. Ltd. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}


