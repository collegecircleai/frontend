'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface Props {
  isDark: boolean;
  c: any;
  fadeInUp: any;
}

export const StartupExposureHero = ({ isDark, c, fadeInUp }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const rocketX = useTransform(springX, [-1, 1], [-15, 15]);
  const rocketY = useTransform(springY, [-1, 1], [-15, 15]);
  
  const orbX = useTransform(springX, [-1, 1], [30, -30]);
  const orbY = useTransform(springY, [-1, 1], [30, -30]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = (e.clientX - rect.left - centerX) / centerX;
    const y = (e.clientY - rect.top - centerY) / centerY;
    
    mouseX.set(x);
    mouseY.set(y);

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div 
      ref={ref}
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={fadeInUp} 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group"
      style={{ 
        flex: '1 1 500px', 
        background: isDark ? 'linear-gradient(180deg, rgba(20,15,25,0.8) 0%, rgba(30,20,50,0.4) 100%)' : 'linear-gradient(180deg, #F8F7FF 0%, #EBE6FF 100%)', 
        border: `1px solid ${isDark ? c.border08 : 'rgba(139,128,249,0.15)'}`, 
        borderRadius: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        minHeight: '320px', 
        position: 'relative', 
        overflow: 'hidden', 
        backdropFilter: 'blur(20px)', 
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        boxShadow: isDark ? 'none' : '0 20px 40px rgba(139,128,249,0.08)' 
      }}
    >
      {/* 1. Glowing Mouse Follow Overlay (Masked to border and interior) */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139,128,249,0.15), transparent 40%)`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* 2. Textural Grid/Noise Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%238B80F9' fill-opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px',
          opacity: isDark ? 0.4 : 0.6,
          zIndex: 0,
          pointerEvents: 'none',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
        }}
      />

      {/* 3. Parallax Blurred Orb */}
      <motion.div 
        style={{ 
          position: 'absolute', 
          bottom: '-50px', 
          right: '-50px', 
          width: '300px', 
          height: '300px', 
          background: '#7B6BFF', 
          filter: 'blur(100px)', 
          opacity: isDark ? 0.3 : 0.15, 
          borderRadius: '50%',
          x: orbX,
          y: orbY,
          zIndex: 0
        }} 
      />

      {/* 4. Elegant Curved Vector Lines Graphic */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
          x: orbX,
          y: orbY,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 500 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', top: 0, right: 0, opacity: isDark ? 0.65 : 0.45 }}
        >
          <defs>
            <linearGradient id="curveGradient1" x1="150" y1="0" x2="500" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B80F9" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7B6BFF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="curveGradient2" x1="200" y1="0" x2="480" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7B6BFF" stopOpacity="0.1" />
              <stop offset="60%" stopColor="#8B80F9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Smooth sweeping curved trajectory line 1 */}
          <motion.path
            d="M 120 -20 C 260 40, 360 160, 520 220"
            stroke="url(#curveGradient1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0.8, opacity: 0.6 }}
            animate={{
              pathOffset: [0, 1],
              opacity: isHovered ? [0.6, 0.9, 0.6] : 0.6
            }}
            transition={{
              pathOffset: { duration: 8, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
          />

          {/* Dashed outer accent curve 2 */}
          <motion.path
            d="M 170 -40 C 310 30, 390 180, 540 260"
            stroke="url(#curveGradient2)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            strokeLinecap="round"
            animate={{
              strokeDashoffset: [0, -40]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          {/* Ambient subtle back curve 3 */}
          <path
            d="M 80 -10 C 220 80, 320 220, 480 340"
            stroke="#8B80F9"
            strokeWidth="1"
            strokeOpacity={isDark ? "0.2" : "0.15"}
          />

          {/* Glowing node point on curve */}
          <motion.circle
            cx="330"
            cy="125"
            r="4"
            fill="#8B80F9"
            filter="url(#glow)"
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <circle cx="330" cy="125" r="8" stroke="#8B80F9" strokeOpacity="0.3" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Main Content Container (Padded) */}
      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', zIndex: 10, position: 'relative', pointerEvents: 'none' }}>
        
        {/* Parallax Floating Rocket */}
        <motion.div 
          style={{ 
            background: 'rgba(139,128,249,0.15)', 
            width: '56px', 
            height: '56px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(139,128,249,0.2)',
            x: rocketX,
            y: rocketY,
            border: '1px solid rgba(139,128,249,0.3)'
          }}
        >
          <motion.div
            animate={{ 
              y: isHovered ? [0, -4, 0] : 0 
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Rocket size={28} color="#8B80F9" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '32px', fontWeight: 800, color: c.text, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Startup Exposure
          </h3>
          <p style={{ color: c.text60, fontSize: '15px', lineHeight: 1.6, maxWidth: '85%' }}>
            Get direct access to the fastest growing AI startups in the country. Skip the resume pile and let your shipped projects do the talking.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
