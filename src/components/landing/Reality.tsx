import React, { memo } from 'react'
import { FileX, Clock, TrendingDown } from 'lucide-react'

const Reality = memo(function Reality() {
  return (
    <section style={{
      background: 'var(--cream)',
      padding: '120px 80px',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
        color: 'var(--violet)', letterSpacing: '0.15em', marginBottom: '20px',
        textTransform: 'uppercase'
      }}>
        THE REALITY
      </div>
      
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 800,
        color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2,
        marginBottom: '64px'
      }}>
        Your syllabus is just a PDF.<br />
        And exams are next week.
      </h2>

      <div 
        className="responsive-grid"
        style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px',
        width: '100%', maxWidth: '1200px'
      }}>
        {/* Card 1 */}
        <div className="reality-card">
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--violet-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--violet)', marginBottom: '24px'
          }}>
            <FileX size={24} />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
            No structured notes
          </div>
          <div style={{ fontSize: '14px', color: 'var(--mist)', lineHeight: 1.6 }}>
            You're stuck with scattered PDFs, textbooks, and lecture slides. Nothing connects.
          </div>
        </div>

        {/* Card 2 */}
        <div className="reality-card">
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--violet-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--violet)', marginBottom: '24px'
          }}>
            <Clock size={24} />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
            Hours of manual work
          </div>
          <div style={{ fontSize: '14px', color: 'var(--mist)', lineHeight: 1.6 }}>
            Making notes, flashcards, and practice questions takes forever. Time you don't have.
          </div>
        </div>

        {/* Card 3 */}
        <div className="reality-card">
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'var(--violet-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--violet)', marginBottom: '24px'
          }}>
            <TrendingDown size={24} />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
            No idea what you're missing
          </div>
          <div style={{ fontSize: '14px', color: 'var(--mist)', lineHeight: 1.6 }}>
            You study blind. No way to track weak areas or what topics matter most.
          </div>
        </div>
      </div>
    </section>
  )
})

export default Reality
