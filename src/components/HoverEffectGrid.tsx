'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HoverEffectGridProps {
  items: any[];
  isDark: boolean;
  c: any;
  fadeInUp: any;
  staggerContainer: any;
}

export const HoverEffectGrid = ({ items, isDark, c, fadeInUp, staggerContainer }: HoverEffectGridProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ flex: '1 1 600px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', alignContent: 'start' }}>
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
                layoutId="startupGridHover"
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
                  background: isDark ? 'rgba(139, 128, 249, 0.15)' : 'rgba(139, 128, 249, 0.08)',
                  zIndex: 0
                }}
              />
            )}
          </AnimatePresence>
          
          <div style={{ position: 'relative', zIndex: 1, background: isDark ? c.card : '#FFFFFF', border: `1px solid ${isDark ? c.border08 : 'rgba(0,0,0,0.04)'}`, borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'default', boxShadow: isDark ? 'none' : '0 10px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ color: '#8B80F9', background: 'rgba(139,128,249,0.1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {item.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: c.text, marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '12px', color: c.text50, fontWeight: 500 }}>{item.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
