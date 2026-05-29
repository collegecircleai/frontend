'use client'

import React from 'react'

// Components
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Reality from '@/components/landing/Reality'
import HowItWorks from '@/components/landing/HowItWorks'
import Features from '@/components/landing/Features'
import VisualLearning from '@/components/landing/VisualLearning'
import Practice from '@/components/landing/Practice'
import Personalisation from '@/components/landing/Personalisation'
import MasterySection from '@/components/landing/MasterySection'
import FooterCTA from '@/components/landing/FooterCTA'
import Footer from '@/components/landing/Footer'
import OnboardingModal from '@/components/landing/OnboardingModal'
import DarkAurora from '@/components/effects/DarkAurora'
import ElegantParticles from '@/components/effects/ElegantParticles'
import ComponentErrorBoundary from '@/components/effects/ErrorBoundary'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydration safety: ensure client-only effects only run after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const router = useRouter()
  const openOnboarding = () => router.push('/login')

  return (
    <div 
      className="content-wrapper" 
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Background Effects: Wrapped for safety */}
      {mounted && (
        <ComponentErrorBoundary>
          <DarkAurora />
          <ElegantParticles count={40} />
        </ComponentErrorBoundary>
      )}

      <ComponentErrorBoundary>
        <Header onGetStarted={openOnboarding} />
      </ComponentErrorBoundary>

      <div style={{ marginTop: '80px' }}>
        <ComponentErrorBoundary>
          <Hero onGetStarted={openOnboarding} />
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <Reality />
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <HowItWorks />
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <Features />
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <VisualLearning />
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <Practice />
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <Personalisation />
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <MasterySection onGetStarted={openOnboarding} />
        </ComponentErrorBoundary>


        <ComponentErrorBoundary>
          <FooterCTA onGetStarted={openOnboarding} />
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <Footer />
        </ComponentErrorBoundary>
      </div>

      <ComponentErrorBoundary>
        <OnboardingModal 
          isOpen={isOnboardingOpen} 
          onClose={() => setIsOnboardingOpen(false)} 
        />
      </ComponentErrorBoundary>
    </div>
  )
}
