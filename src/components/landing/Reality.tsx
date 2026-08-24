import React, { memo } from 'react'
import { FileX, Clock, TrendingDown } from 'lucide-react'

import { AnimatedFolder, FolderCard } from "@/components/gammaui/animated-folder";

const realityCards: FolderCard[] = [
  {
    id: "notes",
    icon: <FileX size={20} strokeWidth={2.5} />,
    title: "No structured notes",
    description: "You're stuck with scattered PDFs, textbooks, and lecture slides. Nothing connects."
  },
  {
    id: "time",
    icon: <Clock size={20} strokeWidth={2.5} />,
    title: "Hours of manual work",
    description: "Making notes, flashcards, and practice questions takes forever. Time you don't have."
  },
  {
    id: "missing",
    icon: <TrendingDown size={20} strokeWidth={2.5} />,
    title: "No idea what you're missing",
    description: "You study blind. No way to track weak areas or what topics matter most."
  }
];

const Reality = memo(function Reality() {
  return (
    <section style={{
      background: 'var(--cream)',
      padding: '120px 24px 80px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflow: 'hidden'
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
        marginBottom: '20px'
      }}>
        Your syllabus is just a PDF.<br />
        And exams are next week.
      </h2>

      {/* Interactive Folder replacing static cards */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'center' }}>
        <AnimatedFolder
          title="The Study Trap"
          subtitle="Explore what's inside"
          openSubtitle="Select a challenge to view"
          cards={realityCards}
        />
      </div>
    </section>
  )
})

export default Reality
