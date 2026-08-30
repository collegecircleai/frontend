'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AnimatedTabs, Tab } from '@/components/ui/animated-tabs'

export default function Features() {
  const tabs: Tab[] = [
    {
      title: 'Detailed',
      value: 'detailed',
      content: (
        <div
          style={{
            background: 'var(--deep)',
            borderRadius: '24px',
            padding: 'clamp(32px, 5vw, 64px)',
            boxShadow: '0 20px 80px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%',
            minHeight: '480px'
          }}
        >
          <div style={{ display: 'inline-block', width: 'fit-content', padding: '6px 12px', background: 'var(--violet-pale)', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--violet)', letterSpacing: '0.1em' }}>
              UNIT 2 · DEMAND & SUPPLY
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            The Law of Demand
          </h3>

          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.8, margin: 0 }}>
            The law of demand states that, all other factors being equal, as the price of a good or service increases, consumer demand for the good or service will decrease, and vice versa.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.8, margin: 0 }}>
            This inverse relationship between price and quantity demanded is fundamental to understanding market dynamics and consumer behavior in microeconomics.
          </p>

          {/* Highlight */}
          <div style={{
            padding: '24px 32px', background: 'var(--violet-pale)', borderRadius: '12px',
            borderLeft: '4px solid var(--violet)', marginTop: '4px'
          }}>
            <span style={{ color: 'var(--violet)', fontSize: '15px', fontWeight: 500, lineHeight: 1.6, display: 'block' }}>
              When price goes up, quantity demanded goes down. This is the foundation of demand analysis.
            </span>
          </div>

          {/* Key Definition */}
          <div style={{
            padding: '28px 32px', background: 'var(--cream)', borderRadius: '12px', marginTop: '4px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: '#00C896', letterSpacing: '0.1em', marginBottom: '12px' }}>
              KEY DEFINITION
            </div>
            <div style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }}>
              Demand: The quantity of a good or service that consumers are willing and able to purchase at various prices during a given time period.
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Summary',
      value: 'summary',
      content: (
        <div
          style={{
            background: 'var(--deep)',
            borderRadius: '24px',
            padding: 'clamp(32px, 5vw, 64px)',
            boxShadow: '0 20px 80px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%',
            minHeight: '480px'
          }}
        >
          <div style={{ display: 'inline-block', width: 'fit-content', padding: '6px 12px', background: 'var(--violet-pale)', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--violet)', letterSpacing: '0.1em' }}>
              UNIT 2 · DEMAND & SUPPLY
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            The Law of Demand
          </h3>

          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.8, margin: 0 }}>
            Price and quantity demanded have an inverse relationship. When prices rise, people buy less. When prices fall, people buy more.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.8, margin: 0 }}>
            This happens because of income effect and substitution effect working together.
          </p>

          {/* Highlight */}
          <div style={{
            padding: '24px 32px', background: 'var(--violet-pale)', borderRadius: '12px',
            borderLeft: '4px solid var(--violet)', marginTop: '4px'
          }}>
            <span style={{ color: 'var(--violet)', fontSize: '15px', fontWeight: 500, lineHeight: 1.6, display: 'block' }}>
              Higher price = Lower demand. Lower price = Higher demand.
            </span>
          </div>

          {/* Key Definition */}
          <div style={{
            padding: '28px 32px', background: 'var(--cream)', borderRadius: '12px', marginTop: '4px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: '#00C896', letterSpacing: '0.1em', marginBottom: '12px' }}>
              KEY DEFINITION
            </div>
            <div style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }}>
              Demand: What people want to buy at different prices.
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Short',
      value: 'short',
      content: (
        <div
          style={{
            background: 'var(--deep)',
            borderRadius: '24px',
            padding: 'clamp(32px, 5vw, 64px)',
            boxShadow: '0 20px 80px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%',
            minHeight: '480px'
          }}
        >
          <div style={{ display: 'inline-block', width: 'fit-content', padding: '6px 12px', background: 'var(--violet-pale)', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--violet)', letterSpacing: '0.1em' }}>
              UNIT 2 · DEMAND & SUPPLY
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Law of Demand
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
              ↑ Price = ↓ Quantity Demanded
            </p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
              ↓ Price = ↑ Quantity Demanded
            </p>
          </div>

          {/* Highlight */}
          <div style={{
            padding: '24px 32px', background: 'var(--violet-pale)', borderRadius: '12px',
            borderLeft: '4px solid var(--violet)', marginTop: '4px'
          }}>
            <span style={{ color: 'var(--violet)', fontSize: '15px', fontWeight: 500, lineHeight: 1.6, display: 'block' }}>
              Inverse relationship between price and quantity.
            </span>
          </div>

          {/* Key Definition */}
          <div style={{
            padding: '28px 32px', background: 'var(--cream)', borderRadius: '12px', marginTop: '4px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: '#00C896', letterSpacing: '0.1em', marginBottom: '12px' }}>
              KEY DEFINITION
            </div>
            <div style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }}>
              Core principle of consumer choice.
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section id="features" style={{
      background: 'var(--cream)',
      padding: '160px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'hidden'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
          color: 'var(--violet)', letterSpacing: '0.15em', marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          THE NOTES ENGINE
        </div>
        
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800,
          color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2,
          marginBottom: '36px'
        }}>
          One topic.<br />
          Three ways to learn.
        </h2>

        {/* Aceternity 3D Animated Tabs */}
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <AnimatedTabs tabs={tabs} />
        </div>
      </motion.div>
    </section>
  )
}
