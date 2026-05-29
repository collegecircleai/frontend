'use client'

import { motion } from 'framer-motion'

export default function CCAILogo({ size = 32, variant }: { size?: number, variant?: 'dark' | 'light' }) {
  // If variant is 'dark', we force the White/Electric look regardless of global theme
  const isDarkV = variant === 'dark'
  const isLightV = variant === 'light'
  
  const textColor = isDarkV ? '#FFFFFF' : (isLightV ? '#000000' : 'var(--ink)')
  const accentColor = isDarkV ? 'var(--violet-light)' : (isLightV ? '#4D3FFF' : 'var(--logo-accent)')
  const taglineColor = isDarkV ? 'rgba(160,159,192,0.8)' : (isLightV ? '#666666' : 'var(--logo-tagline)')
  
  // For the icon punch-outs, if we're in a dark section, we want them to look like holes into the dark bg
  const punchOutColor = isDarkV ? '#111218' : (isLightV ? '#FFFFFF' : 'var(--pearl)')

  return (
      <motion.div 
        whileHover="hover"
        style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 18px)', cursor: 'pointer' }}
      >
        <motion.svg 
          viewBox="0 0 80 80" width={size} height={size} fill="none"
          variants={{ hover: { rotate: 5, scale: 1.05 } }}
        >
          {/* Main Logo Mark remains brand violet */}
          <circle cx="32" cy="40" r="28" fill="var(--violet)" />
          {/* Punch-out circles use dynamic color */}
          <circle cx="52" cy="32" r="20" fill={punchOutColor} />
          <circle cx="52" cy="32" r="14" fill={punchOutColor} />
          <circle cx="52" cy="32" r="9" fill="var(--jade)" opacity="0.9" />
          <circle cx="32" cy="40" r="10" fill={punchOutColor} />
          <circle cx="52" cy="32" r="4" fill={punchOutColor} />
        </motion.svg>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div style={{ 
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '22px', 
            color: textColor, letterSpacing: '-0.02em' 
          }}>
            CC
            <motion.span 
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: accentColor, marginLeft: '4px' }}
            >
              &gt;AI
            </motion.span>
          </div>
          <motion.div 
            variants={{ hover: { x: 2 } }}
            style={{ 
              fontFamily: 'var(--font-body)', fontWeight: 300, 
              fontSize: 'clamp(7px, 1.5vw, 9px)', 
              color: taglineColor, 
              letterSpacing: 'clamp(0.05em, 1vw, 0.15em)', 
              textTransform: 'uppercase', 
              marginTop: 'clamp(0px, 0.5vw, 2px)', 
              whiteSpace: 'nowrap'
            }}
          >
            College Circle AI
          </motion.div>
        </div>
      </motion.div>
  )
}
