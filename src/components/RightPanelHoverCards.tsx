'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RightPanelHoverCardsProps {
  items: any[];
  isDark: boolean;
  c: any;
  fadeInUp: any;
  staggerContainer: any;
}

export const RightPanelHoverCards = ({ items, isDark, c, fadeInUp, staggerContainer }: RightPanelHoverCardsProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} style={{ flex: '1 1 450px', maxWidth: '560px', display: 'flex', flexDirection: 'column' }}>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className="group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ position: 'relative', padding: '8px' }}
          variants={fadeInUp}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                layoutId="rightPanelHoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  height: '100%',
                  width: '100%',
                  display: 'block',
                  borderRadius: '24px',
                  background: isDark ? 'rgba(123, 107, 255, 0.1)' : 'rgba(123, 107, 255, 0.05)',
                  zIndex: 0
                }}
              />
            )}
          </AnimatePresence>
          
          <div style={{ position: 'relative', zIndex: 1, background: item.bg, borderRadius: '20px', padding: '24px', border: `1px solid ${c.border05}`, boxShadow: isDark ? '0 10px 20px rgba(0,0,0,0.1)' : '0 10px 20px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isDark ? 'inset 0 1px 1px rgba(255,255,255,0.1)' : '0 2px 10px rgba(0,0,0,0.05)' }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: item.titleColor || c.text, marginBottom: '6px' }}>{item.title}</h4>
              <p style={{ fontSize: '13px', color: c.text50, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
