'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Props {
  isDark: boolean;
  c: any;
  fadeInUp: any;
  onExplorerClick: () => void;
  onAmbassadorClick: () => void;
}

interface TiltCardProps {
  children: React.ReactNode;
  isDark: boolean;
  featured?: boolean;
  accentColor: string;
  borderColor: string;
}

const TiltCard = ({ children, isDark, featured = false, accentColor, borderColor }: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(mouseX);
    y.set(mouseY);

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200, width: '100%' }}>
      <style>{`
        @media (max-width: 768px) {
          .tilt-card-box {
            padding: 28px 20px !important;
            border-radius: 24px !important;
          }
        }
      `}</style>
      <motion.div
        ref={cardRef}
        className="tilt-card-box"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: isDark
            ? featured
              ? 'linear-gradient(180deg, rgba(32, 24, 52, 0.75) 0%, rgba(14, 11, 22, 0.92) 100%)'
              : 'linear-gradient(180deg, rgba(22, 18, 32, 0.75) 0%, rgba(12, 10, 18, 0.92) 100%)'
            : '#FFFFFF',
          border: `1px solid ${borderColor}`,
          borderRadius: '32px',
          padding: '44px 40px',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(30px)',
          boxShadow: isDark
            ? featured
              ? '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 50px -10px rgba(123, 107, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
              : '0 30px 60px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
            : featured
              ? '0 25px 50px -12px rgba(123, 107, 255, 0.14), 0 2px 8px rgba(0, 0, 0, 0.03)'
              : '0 20px 45px -10px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Moving Border Beam for Featured Card */}
        {featured && (
          <div
            style={{
              position: 'absolute',
              inset: '-1px',
              borderRadius: '32px',
              padding: '1px',
              background: 'linear-gradient(90deg, transparent 20%, #8B80F9 50%, transparent 80%)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              pointerEvents: 'none',
              zIndex: 2,
              opacity: isDark ? 0.7 : 0.5,
            }}
          />
        )}

        {/* Ambient Top Light Beam for Featured Card */}
        {featured && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '-70px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '300px',
                height: '140px',
                background: '#7B6BFF',
                filter: 'blur(70px)',
                opacity: isDark ? 0.38 : 0.18,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #A78BFA, transparent)',
                zIndex: 1,
              }}
            />
          </>
        )}

        {/* Specular Radial Spotlight following cursor */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${
              isDark
                ? featured
                  ? 'rgba(139, 128, 249, 0.14)'
                  : 'rgba(52, 211, 153, 0.08)'
                : featured
                  ? 'rgba(139, 128, 249, 0.07)'
                  : 'rgba(16, 185, 129, 0.05)'
            }, transparent 60%)`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Content with 3D Depth */}
        <div style={{ position: 'relative', zIndex: 3, transform: 'translateZ(20px)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export const EcosystemAccessCards = ({
  isDark,
  c,
  fadeInUp,
  onExplorerClick,
  onAmbassadorClick,
}: Props) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: '28px',
        alignItems: 'stretch',
      }}
    >
      {/* 1. EXPLORER CARD */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        style={{ display: 'flex' }}
      >
        <TiltCard
          isDark={isDark}
          accentColor="#10B981"
          borderColor={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
        >
          {/* Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '22px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '100px',
                background: isDark ? 'rgba(52, 211, 153, 0.08)' : 'rgba(16, 185, 129, 0.07)',
                border: `1px solid ${isDark ? 'rgba(52, 211, 153, 0.22)' : 'rgba(16, 185, 129, 0.18)'}`,
                boxShadow: isDark ? '0 0 20px rgba(52, 211, 153, 0.1)' : 'none',
              }}
            >
              {/* Pulsing Emerald Dot */}
              <span style={{ position: 'relative', display: 'flex', width: '7px', height: '7px' }}>
                <motion.span
                  animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: isDark ? '#34D399' : '#10B981',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: isDark ? '#34D399' : '#059669',
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: isDark ? '#34D399' : '#059669',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.14em',
                }}
              >
                EARLY ECOSYSTEM ACCESS
              </span>
            </span>
          </div>

          <h3
            style={{
              fontSize: '34px',
              fontWeight: 800,
              color: c.text,
              marginBottom: '14px',
              letterSpacing: '-0.035em',
            }}
          >
            Explorer Access
          </h3>

          {/* Pricing Row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '32px' }}>
            <span
              style={{
                fontSize: '18px',
                color: c.text40,
                textDecoration: 'line-through',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              $10
            </span>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: isDark ? '#34D399' : '#059669',
                letterSpacing: '-0.02em',
                textShadow: isDark ? '0 0 25px rgba(52, 211, 153, 0.35)' : 'none',
              }}
            >
              FREE
            </span>
          </div>

          {/* Scarcity Status Module with Live Shimmer Bar */}
          <div
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.025)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'}`,
              padding: '18px 22px',
              borderRadius: '20px',
              marginBottom: '36px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <span style={{ color: c.text70, fontSize: '13.5px', fontWeight: 500 }}>
                Curated ecosystem access
              </span>
              <span
                style={{
                  color: isDark ? '#34D399' : '#059669',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                50 Seats Left
              </span>
            </div>

            {/* Glowing Capacity Bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                borderRadius: '100px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '50%',
                  height: '100%',
                  background: isDark
                    ? 'linear-gradient(90deg, #059669, #34D399)'
                    : 'linear-gradient(90deg, #10B981, #34D399)',
                  borderRadius: '100px',
                  position: 'relative',
                }}
              >
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '50%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={onExplorerClick}
            className="group"
            style={{
              width: '100%',
              padding: '17px 24px',
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F3F2EE',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
              borderRadius: '100px',
              color: c.text,
              fontWeight: 600,
              fontSize: '14.5px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.25s ease',
              boxShadow: isDark
                ? '0 4px 15px rgba(0,0,0,0.2)'
                : '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <span>View Explorer Pathway</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </motion.button>
        </TiltCard>
      </motion.div>

      {/* 2. AMBASSADOR CARD (FEATURED) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        style={{ display: 'flex' }}
      >
        <TiltCard
          isDark={isDark}
          featured={true}
          accentColor="#7B6BFF"
          borderColor={isDark ? 'rgba(139, 128, 249, 0.35)' : 'rgba(123, 107, 255, 0.25)'}
        >
          {/* Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '22px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '100px',
                background: isDark ? 'rgba(139, 128, 249, 0.14)' : 'rgba(123, 107, 255, 0.08)',
                border: `1px solid ${isDark ? 'rgba(139, 128, 249, 0.35)' : 'rgba(123, 107, 255, 0.22)'}`,
                boxShadow: isDark ? '0 0 20px rgba(123, 107, 255, 0.2)' : 'none',
              }}
            >
              {/* Pulsing Violet Dot */}
              <span style={{ position: 'relative', display: 'flex', width: '7px', height: '7px' }}>
                <motion.span
                  animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: '#8B80F9',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#8B80F9',
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: isDark ? '#A78BFA' : '#7B6BFF',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.14em',
                }}
              >
                OPERATE THE ECOSYSTEM
              </span>
            </span>
          </div>

          <h3
            style={{
              fontSize: '34px',
              fontWeight: 800,
              color: c.text,
              marginBottom: '14px',
              letterSpacing: '-0.035em',
            }}
          >
            Ambassador Lead
          </h3>

          {/* Pricing Row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '32px' }}>
            <span
              style={{
                fontSize: '18px',
                color: c.text40,
                textDecoration: 'line-through',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              $30
            </span>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: isDark ? '#A78BFA' : '#7B6BFF',
                letterSpacing: '-0.02em',
                textShadow: isDark ? '0 0 25px rgba(139, 128, 249, 0.4)' : 'none',
              }}
            >
              FREE
            </span>
          </div>

          {/* Scarcity Status Module with Live Shimmer Bar */}
          <div
            style={{
              background: isDark ? 'rgba(123, 107, 255, 0.06)' : 'rgba(123, 107, 255, 0.035)',
              border: `1px solid ${isDark ? 'rgba(139, 128, 249, 0.18)' : 'rgba(123, 107, 255, 0.12)'}`,
              padding: '18px 22px',
              borderRadius: '20px',
              marginBottom: '36px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <span style={{ color: c.text70, fontSize: '13.5px', fontWeight: 500 }}>
                Curated ecosystem access
              </span>
              <span
                style={{
                  color: isDark ? '#A78BFA' : '#7B6BFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                25 Seats Left
              </span>
            </div>

            {/* Glowing Capacity Bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                borderRadius: '100px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '75%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #7B6BFF, #A78BFA)',
                  borderRadius: '100px',
                  position: 'relative',
                }}
              >
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '50%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Button with luxury neon glow */}
          <motion.button
            whileHover={{
              scale: 1.015,
              boxShadow: '0 18px 36px rgba(123, 107, 255, 0.45)',
            }}
            whileTap={{ scale: 0.985 }}
            onClick={onAmbassadorClick}
            style={{
              width: '100%',
              padding: '17px 24px',
              background: 'linear-gradient(135deg, #7B6BFF 0%, #5E4BEB 100%)',
              border: 'none',
              borderRadius: '100px',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '14.5px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              boxShadow:
                '0 12px 28px rgba(123, 107, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
              transition: 'all 0.25s ease',
            }}
          >
            <span>View Ambassador Pathway</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </motion.button>
        </TiltCard>
      </motion.div>
    </div>
  );
};
