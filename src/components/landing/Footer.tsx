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
      icon: <Mail size={17} />,
      label: 'Email Support',
      target: '_blank',
    },
    { href: 'https://www.linkedin.com/company/collegecircleai/', icon: <Linkedin size={17} />, label: 'LinkedIn', target: '_blank' },
    { href: 'https://www.instagram.com/college.circle.ai/', icon: <Instagram size={17} />, label: 'Instagram', target: '_blank' },
    {
      href: 'https://x.com/AICollegeCircle',
      label: 'X',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      target: '_blank',
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
                transition: 'opacity 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              collegecircleai.com
            </Link>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {socialLinks.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  target={social.target}
                  rel={social.target === '_blank' ? 'noopener noreferrer' : undefined}
                  aria-label={social.label}
                  style={{
                    color: '#9e9ea7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#9e9ea7'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
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


