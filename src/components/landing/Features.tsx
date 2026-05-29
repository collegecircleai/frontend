'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Features() {
  const [activeNoteTab, setActiveNoteTab] = useState('Detailed')

  return (
    <section id="features" style={{
      background: 'var(--cream)',
      padding: '160px 80px',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
          color: 'var(--violet)', letterSpacing: '0.15em', marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          THE NOTES ENGINE
        </div>
        
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 800,
          color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2,
          marginBottom: '48px'
        }}>
          One topic.<br />
          Three ways to learn.
        </h2>

        {/* Toggle Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '80px', background: 'var(--cream)', padding: '6px', borderRadius: '18px', border: '1px solid var(--border)' }}>
          {['Detailed', 'Summary', 'Short'].map(tab => (
            <motion.button
              key={tab}
              onClick={() => setActiveNoteTab(tab)}
              whileHover={{ scale: activeNoteTab === tab ? 1 : 1.02 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 28px', borderRadius: '12px', border: 'none',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                background: activeNoteTab === tab ? 'var(--violet)' : 'var(--deep)',
                color: activeNoteTab === tab ? 'white' : 'var(--ink)',
                boxShadow: activeNoteTab === tab ? '0 10px 30px rgba(77,63,255,0.2)' : '0 4px 15px rgba(0,0,0,0.02)',
                transition: 'all 0.3s ease'
              }}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content Card with AnimatePresence */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ width: '100%', maxWidth: '900px', perspective: '1000px' }}
      >
         <div
           style={{
             background: 'var(--deep)', borderRadius: '24px', padding: '64px',
             boxShadow: '0 20px 80px rgba(0,0,0,0.15)', overflow: 'hidden',
             border: '1px solid var(--border)'
           }}
         >
           <div style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--violet-pale)', borderRadius: '6px', marginBottom: '32px', border: '1px solid var(--border)' }}>
             <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--violet)', letterSpacing: '0.1em' }}>
               UNIT 2 · DEMAND & SUPPLY
             </span>
           </div>
           <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', marginBottom: '32px' }}>
             {activeNoteTab === 'Short' ? 'Law of Demand' : 'The Law of Demand'}
           </h3>
           
           <div style={{ minHeight: '440px', position: 'relative' }}>
             <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeNoteTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}
                >
                  {activeNoteTab === 'Detailed' && (
                    <>
                      <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.8 }}>
                        The law of demand states that, all other factors being equal, as the price of a good or service increases, consumer demand for the good or service will decrease, and vice versa.
                      </p>
                      <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.8 }}>
                        This inverse relationship between price and quantity demanded is fundamental to understanding market dynamics and consumer behavior in microeconomics.
                      </p>
                      
                      {/* Highlight */}
                      <div style={{
                        padding: '24px 32px', background: 'var(--violet-pale)', borderRadius: '12px',
                        borderLeft: '4px solid var(--violet)', marginTop: '8px'
                      }}>
                        <span style={{ color: 'var(--violet)', fontSize: '15px', fontWeight: 500, lineHeight: 1.6, display: 'block' }}>
                          When price goes up, quantity demanded goes down. This is the foundation of demand analysis.
                        </span>
                      </div>

                      {/* Key Definition */}
                      <div style={{
                        padding: '28px 32px', background: 'var(--cream)', borderRadius: '12px', marginTop: '8px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: '#00C896', letterSpacing: '0.1em', marginBottom: '12px' }}>
                          KEY DEFINITION
                        </div>
                        <div style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }}>
                          Demand: The quantity of a good or service that consumers are willing and able to purchase at various prices during a given time period.
                        </div>
                      </div>
                    </>
                  )}
                  {activeNoteTab === 'Summary' && (
                    <>
                      <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.8 }}>
                        Price and quantity demanded have an inverse relationship. When prices rise, people buy less. When prices fall, people buy more.
                      </p>
                      <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.8 }}>
                        This happens because of income effect and substitution effect working together.
                      </p>
                      
                      {/* Highlight */}
                      <div style={{
                        padding: '24px 32px', background: 'var(--violet-pale)', borderRadius: '12px',
                        borderLeft: '4px solid var(--violet)', marginTop: '8px'
                      }}>
                        <span style={{ color: 'var(--violet)', fontSize: '15px', fontWeight: 500, lineHeight: 1.6, display: 'block' }}>
                          Higher price = Lower demand. Lower price = Higher demand.
                        </span>
                      </div>

                      {/* Key Definition */}
                      <div style={{
                        padding: '28px 32px', background: 'var(--cream)', borderRadius: '12px', marginTop: '8px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: '#00C896', letterSpacing: '0.1em', marginBottom: '12px' }}>
                          KEY DEFINITION
                        </div>
                        <div style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }}>
                          Demand: What people want to buy at different prices.
                        </div>
                      </div>
                    </>
                  )}
                  {activeNoteTab === 'Short' && (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p style={{ fontSize: '15px', color: 'var(--ink)' }}>
                          ↑ Price = ↓ Quantity Demanded
                        </p>
                        <p style={{ fontSize: '15px', color: 'var(--ink)' }}>
                          ↓ Price = ↑ Quantity Demanded
                        </p>
                      </div>

                      {/* Highlight */}
                      <div style={{
                        padding: '24px 32px', background: 'var(--violet-pale)', borderRadius: '12px',
                        borderLeft: '4px solid var(--violet)', marginTop: '8px'
                      }}>
                        <span style={{ color: 'var(--violet)', fontSize: '15px', fontWeight: 500, lineHeight: 1.6, display: 'block' }}>
                          Inverse relationship between price and quantity.
                        </span>
                      </div>

                      {/* Key Definition */}
                      <div style={{
                        padding: '28px 32px', background: 'var(--cream)', borderRadius: '12px', marginTop: '8px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: '#00C896', letterSpacing: '0.1em', marginBottom: '12px' }}>
                          KEY DEFINITION
                        </div>
                        <div style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }}>
                          Core principle of consumer choice.
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
             </AnimatePresence>
           </div>
         </div>
      </motion.div>
    </section>
  )
}
