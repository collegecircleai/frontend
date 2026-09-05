"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import About from "@/components/landing/About";
import Builders from "@/components/landing/Builders";
import JoinBuilders from "@/components/landing/JoinBuilders";

import DarkAurora from "@/components/effects/DarkAurora";
import ElegantParticles from "@/components/effects/ElegantParticles";
import ComponentErrorBoundary from "@/components/effects/ErrorBoundary";
import { getPostAuthRoute, useAuth } from "@/context/AuthContext";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getPostAuthRoute(user));
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openOnboarding = () => router.push("/login");

  return (
    <div
      className="content-wrapper about-page-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <style jsx global>{`
        /* Light mode: 100% untouched warm cream paper background */
        .about-page-bg {
          background-color: #f6f2e8 !important;
          transition: background-color 0.25s ease;
        }

        /* Dark mode: Transparent sections over fixed deep cosmic canvas so aurora & particles shine through */
        [data-theme='dark'] body {
          background-color: #0A0A1E !important;
          background: #0A0A1E !important;
        }

        [data-theme='dark'] .about-page-bg,
        [data-theme='dark'] .about-page-bg main,
        [data-theme='dark'] .about-page-bg section,
        [data-theme='dark'] .about-page-bg section#about,
        [data-theme='dark'] .about-page-bg section#builders,
        [data-theme='dark'] .about-page-bg section#join-builders {
          background-color: transparent !important;
          background: transparent !important;
        }



        .about-img-light {
          display: block;
        }
        .about-img-dark {
          display: none;
        }
        [data-theme='dark'] .about-img-light {
          display: none !important;
        }
        [data-theme='dark'] .about-img-dark {
          display: block !important;
          background: transparent !important;
        }

        .about-illustration-box {
          background: transparent !important;
        }

        /* ── Typography & Dark Mode Polishing ── */
        .about-headline {
          color: #1a1a1e;
          font-weight: 400 !important;
        }
        .about-highlight-differently {
          color: var(--violet, #4D3FFF);
          font-weight: 400 !important;
        }
        .about-subheadline {
          color: rgba(26, 26, 30, 0.84);
        }
        .about-body-flow {
          color: rgba(26, 26, 30, 0.85);
        }
        .about-strong-text {
          color: #111115;
          font-weight: 600;
        }
        .about-callout-card {
          border-left: 3px solid var(--violet, #4D3FFF);
          padding: 8px 0 8px 18px;
          margin: 4px 0;
          color: #1a1a1e;
          font-size: clamp(18px, 1.26vw, 21.5px);
          font-weight: 500;
          font-style: italic;
        }
        .about-philosophy-lead {
          color: #1a1a1e;
        }
        .about-philosophy-core {
          color: #1a1a1e;
        }
        .about-divider-line {
          border-top: 1px solid rgba(0, 0, 0, 0.09);
        }

        /* Enhanced Dark Theme Polish */
        [data-theme='dark'] .about-headline {
          color: #FAF8F5;
          text-shadow: 0 2px 24px rgba(255, 255, 255, 0.04);
        }
        [data-theme='dark'] .about-highlight-differently {
          color: #A098FF;
          text-shadow: 0 0 22px rgba(160, 152, 255, 0.4);
        }
        [data-theme='dark'] .about-subheadline {
          color: rgba(230, 227, 218, 0.78);
        }
        [data-theme='dark'] .about-body-flow {
          color: rgba(225, 222, 212, 0.82);
        }
        [data-theme='dark'] .about-strong-text {
          color: #FFFFFF;
          font-weight: 600;
        }
        [data-theme='dark'] .about-callout-card {
          border-left: 3px solid #8477FF;
          background: linear-gradient(90deg, rgba(132, 119, 255, 0.09) 0%, transparent 100%);
          padding: 10px 18px;
          border-radius: 0 8px 8px 0;
          color: #FAF8F5;
          font-size: clamp(18px, 1.26vw, 21.5px);
          font-weight: 500;
          font-style: italic;
          box-shadow: inset 1px 0 0 rgba(132, 119, 255, 0.2);
        }
        [data-theme='dark'] .about-philosophy-lead {
          color: rgba(235, 233, 225, 0.88);
        }
        [data-theme='dark'] .about-philosophy-core {
          color: #FAF8F5;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.08);
        }
        [data-theme='dark'] .about-divider-line {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .about-page-bg {
          --cycle-cutout: #f6f2e8;
        }
        [data-theme='dark'] .about-page-bg,
        [data-theme='dark'] .about-page-bg * {
          --cycle-cutout: #0A0A1E !important;
        }
        [data-theme='dark'] .about-teal-underline {
          filter: drop-shadow(0 0 8px rgba(0, 200, 150, 0.45));
        }
      `}</style>

      {/* Landing page animated dark background effects (Active strictly in dark mode) */}
      <ComponentErrorBoundary>
        <DarkAurora />
        <ElegantParticles count={80} />
      </ComponentErrorBoundary>

      {/* Persistent Navigation */}
      <ComponentErrorBoundary>
        <Header onGetStarted={openOnboarding} />
      </ComponentErrorBoundary>

      <main style={{ paddingTop: "72px", flex: 1, position: "relative", zIndex: 1 }}>
        {/* Narrative & Artwork Section */}
        <ComponentErrorBoundary>
          <About />
        </ComponentErrorBoundary>

        {/* Builders / Team Section */}
        <ComponentErrorBoundary>
          <Builders />
        </ComponentErrorBoundary>

        {/* Recruitment / Apply Section */}
        <ComponentErrorBoundary>
          <JoinBuilders />
        </ComponentErrorBoundary>

        {/* Footer */}
      </main>

      <ComponentErrorBoundary>
        <Footer />
      </ComponentErrorBoundary>
    </div>
  );
}
