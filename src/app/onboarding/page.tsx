"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  Mail,
  Edit3,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  Check,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import CCAILogo from "../../components/brand/CCAILogo";
import api, { getFriendlyErrorMessage } from "../../lib/api";

/* ── Design System Constants ── */
const COLORS = {
  sidebarBg: "#FFFFFF",
  contentBg: "#F9F7F5",
  brandBlue: "#4d3fff",
  brandTeal: "#60fcc6",
  textMain: "#1c1917",
  textMuted: "#78716c",
  textLight: "#a8a29e",
  border: "#e7e5e4",
};

const FONTS = {
  serif: "'Playfair Display', serif",
  sans: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

/* ── Global Styles ── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
    body { margin: 0; padding: 0; overflow: hidden; background: ${COLORS.contentBg}; }
    * { box-sizing: border-box; }
    :root {
      --violet: #4d3fff;
      --jade: #60fcc6;
      --ink: #1c1917;
      --mist: #78716c;
      --pearl: #FFFFFF;
    }
  `}</style>
);

/* ── Sidebar Component ── */
function Sidebar({ step, isMobile }: { step: number; isMobile: boolean }) {
  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;
  const content = {
    tag:
      step === 1
        ? "JOURNEY INITIATION"
        : step === 2
          ? "PHASE 02 / 03"
          : "SCHOLASTIC MILESTONE",
    title:
      step === 1
        ? "Personal Records"
        : step === 2
          ? "Define Your Scholastic Identity."
          : "Almost there, Scholar.",
    subtitle:
      step === 1
        ? "Your profile is the manuscript of your academic journey. Let's begin with the basics."
        : step === 2
          ? "We calibrate your AI curriculum based on the specific rigors of your institution and degree path."
          : "Define your current academic position and your primary intent for this digital sanctum.",
  };

  if (isMobile) return null;

  return (
    <aside
      style={{
        width: "380px",
        height: "100vh",
        backgroundColor: COLORS.sidebarBg,
        borderRight: `1px solid ${COLORS.border}`,
        padding: "64px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "80px" }}>
          <CCAILogo size={32} variant="light" />
          <div
            style={{
              fontSize: "9px",
              fontFamily: FONTS.mono,
              fontWeight: 700,
              color: COLORS.textLight,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: "12px",
            }}
          >
            GURUKUL DIGITAL INFRASTRUCTURE
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "10px",
              fontFamily: FONTS.mono,
              letterSpacing: "0.3em",
              color: COLORS.brandBlue,
              fontWeight: 700,
              margin: "0 0 16px 0",
              textTransform: "uppercase",
            }}
          >
            {content.tag}
          </p>
          <h2
            style={{
              fontSize: "38px",
              fontFamily: FONTS.serif,
              color: COLORS.textMain,
              margin: "0 0 20px 0",
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            {content.title}
          </h2>
          <p
            style={{
              fontSize: "14px",
              fontFamily: FONTS.sans,
              color: COLORS.textMuted,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {content.subtitle}
          </p>

          {step < 3 ? (
            <div style={{ marginTop: "64px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: FONTS.mono,
                    color: COLORS.textLight,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Progress
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: FONTS.mono,
                    fontWeight: 700,
                    color: COLORS.brandBlue,
                  }}
                >
                  {progress}%
                </span>
              </div>
              <div
                style={{
                  height: "2px",
                  width: "100%",
                  backgroundColor: "#f5f5f4",
                  position: "relative",
                }}
              >
                <motion.div
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  style={{
                    height: "100%",
                    backgroundColor: COLORS.brandBlue,
                    position: "absolute",
                    left: 0,
                    top: 0,
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120%",
                opacity: 0.03,
                pointerEvents: "none",
              }}
            >
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 5 L95 85 L5 85 Z" />
              </svg>
            </div>
          )}
        </div>

        <div style={{ marginTop: "auto" }}>
          {step === 3 && (
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: FONTS.mono,
                    color: COLORS.brandBlue,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  100% COMPLETE
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px", height: "4px" }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.brandBlue,
                      borderRadius: "2px",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <p
            style={{
              fontSize: "9px",
              fontFamily: FONTS.mono,
              color: COLORS.textLight,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            DIGITAL MANUSCRIPT ID: CC-AI-2024-0021
          </p>
        </div>
      </div>
    </aside>
  );
}

/* ── Step 1: Identity ── */
function Step1({
  user,
  name,
  onNameChange,
  onNext,
  isMobile,
}: {
  user: any;
  name: string;
  onNameChange: (val: string) => void;
  onNext: () => void;
  isMobile: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        maxWidth: "600px",
        width: "100%",
        padding: isMobile ? "0 20px" : "0",
      }}
    >
      <div style={{ marginBottom: isMobile ? "40px" : "64px" }}>
        <h1
          style={{
            fontSize: isMobile ? "36px" : "52px",
            fontFamily: FONTS.serif,
            fontWeight: 700,
            color: COLORS.textMain,
            margin: "0 0 20px 0",
            lineHeight: 1.1,
          }}
        >
          Tell us about yourself.
        </h1>
        <p
          style={{
            fontSize: isMobile ? "15px" : "17px",
            fontFamily: FONTS.sans,
            color: COLORS.textMuted,
            margin: 0,
            lineHeight: 1.6,
            maxWidth: "440px",
          }}
        >
          Your profile is the manuscript of your academic journey. Let's begin
          with the basics.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "32px" : "48px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              fontFamily: FONTS.mono,
              fontWeight: 700,
              letterSpacing: "0.25em",
              color: COLORS.textLight,
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            ACCOUNT REFERENCE
          </label>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#fff",
              border: `1px solid ${COLORS.border}`,
              borderRadius: "100px",
              padding: "10px 24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              width: isMobile ? "100%" : "auto",
              overflow: "hidden",
            }}
          >
            <Mail
              size={14}
              color={COLORS.brandBlue}
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: "13px",
                fontFamily: FONTS.mono,
                color: COLORS.textMuted,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || "scholar.inquiry@curriculum.ai"}
            </span>
          </div>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              fontFamily: FONTS.mono,
              fontWeight: 700,
              letterSpacing: "0.25em",
              color: COLORS.textLight,
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            Full Legal Name
          </label>
          <div style={{ position: "relative", width: isMobile ? "100%" : "400px" }}>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your full name"
              style={{
                width: "100%",
                backgroundColor: "#fff",
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: "12px",
                padding: isMobile ? "14px 18px" : "18px 24px",
                fontSize: "15px",
                fontFamily: FONTS.sans,
                color: COLORS.textMain,
                outline: "none",
              }}
            />
            <Edit3
              size={18}
              style={{
                position: "absolute",
                right: "24px",
                top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.textLight,
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: isMobile ? "20px" : "40px",
          marginTop: "48px",
        }}
      >
        <button
          onClick={onNext}
          style={{
            flex: isMobile ? 1 : "initial",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            backgroundColor: COLORS.brandBlue,
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: isMobile ? "16px 30px" : "18px 40px",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: FONTS.sans,
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(77, 63, 255, 0.25)",
          }}
        >
          Continue Journey <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

/* ── Step 2: Academic ── */
function Step2({
  formData,
  setFormData,
  onBack,
  onNext,
  isMobile,
}: {
  formData: any;
  setFormData: any;
  onBack: () => void;
  onNext: () => void;
  isMobile: boolean;
}) {
  const canContinue =
    formData.college && formData.degree && (formData.degree !== "other" || formData.customDegree) && formData.department;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        maxWidth: "560px",
        width: "100%",
        padding: isMobile ? "0 16px" : "0",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: isMobile ? "32px 24px" : "48px",
          borderRadius: "24px",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "24px" : "32px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "10px",
                fontFamily: FONTS.mono,
                fontWeight: 700,
                color: COLORS.textLight,
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              INSTITUTION NAME
            </label>
            <input
              value={formData.college}
              onChange={(e) =>
                setFormData({ ...formData, college: e.target.value })
              }
              placeholder="e.g. IIT Madras"
              style={{
                width: "100%",
                backgroundColor: "#fff",
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: "12px",
                padding: "14px 18px",
                fontSize: "14px",
                fontFamily: FONTS.sans,
                color: COLORS.textMain,
                outline: "none",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "10px",
                fontFamily: FONTS.mono,
                fontWeight: 700,
                color: COLORS.textLight,
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              DEGREE
            </label>
            <select
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              style={{
                width: "100%",
                backgroundColor: "#fff",
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: "12px",
                padding: "14px 18px",
                fontSize: "14px",
                fontFamily: FONTS.sans,
                color: COLORS.textMain,
                outline: "none",
              }}
            >
              <option value="">Select degree</option>
              <option value="btech">B.Tech</option>
              <option value="bcom">B.Com</option>
              <option value="bsc">B.Sc</option>
              <option value="ba">B.A</option>
              <option value="other">Other (Please specify)</option>
            </select>
            {formData.degree === "other" && (
              <input
                value={formData.customDegree || ""}
                onChange={(e) =>
                  setFormData({ ...formData, customDegree: e.target.value })
                }
                placeholder="Type your degree here..."
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: "12px",
                  padding: "14px 18px",
                  fontSize: "14px",
                  fontFamily: FONTS.sans,
                  color: COLORS.textMain,
                  outline: "none",
                  marginTop: "12px",
                }}
              />
            )}
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "10px",
                fontFamily: FONTS.mono,
                fontWeight: 700,
                color: COLORS.textLight,
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              SPECIALIZATION
            </label>
            <input
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              placeholder="e.g. CSE"
              style={{
                width: "100%",
                backgroundColor: "#fff",
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: "12px",
                padding: "14px 18px",
                fontSize: "14px",
                fontFamily: FONTS.sans,
                color: COLORS.textMain,
                outline: "none",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "16px",
              marginTop: "12px",
            }}
          >
            <button
              onClick={onNext}
              disabled={!canContinue}
              style={{
                flex: 1,
                backgroundColor: COLORS.brandBlue,
                color: "#fff",
                border: "none",
                borderRadius: "100px",
                padding: "16px 32px",
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: FONTS.sans,
                cursor: "pointer",
                opacity: canContinue ? 1 : 0.5,
              }}
            >
              Continue
            </button>
            <button
              onClick={onBack}
              style={{
                padding: "16px 32px",
                backgroundColor: "#fff",
                border: `1px solid ${COLORS.border}`,
                borderRadius: "100px",
                color: COLORS.textMuted,
                fontSize: "13px",
                fontWeight: 700,
                fontFamily: FONTS.sans,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Step 3: Goals ── */
function Step3({
  formData,
  setFormData,
  onBack,
  onNext,
  isMobile,
  loading,
}: {
  formData: any;
  setFormData: any;
  onBack: () => void;
  onNext: () => void;
  isMobile: boolean;
  loading: boolean;
}) {
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
  const semesters = ["01", "02", "03", "04", "05", "06", "07", "08"];
  const intents = [
    {
      id: "exam_prep",
      title: "Exam Prep",
      desc: "Intensive archival analysis and outcome prediction.",
      icon: <Zap size={18} />,
    },
    {
      id: "concepts",
      title: "Understanding Concepts",
      desc: "Deep scholastic inquiry and semantic mapping.",
      icon: <Target size={18} />,
    },
    {
      id: "revision",
      title: "Daily Revision",
      desc: "Spaced repetition and concise insight gathering.",
      icon: <BookOpen size={18} />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        maxWidth: "640px",
        width: "100%",
        padding: isMobile ? "0 20px" : "0",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              fontFamily: FONTS.mono,
              fontWeight: 700,
              color: COLORS.textLight,
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            ACADEMIC YEAR
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setFormData({ ...formData, year: y })}
                style={{
                  padding: "10px 20px",
                  borderRadius: "100px",
                  border: `1px solid ${formData.year === y ? COLORS.brandBlue : COLORS.border}`,
                  backgroundColor:
                    formData.year === y ? COLORS.brandBlue : "#fff",
                  color: formData.year === y ? "#fff" : COLORS.textMuted,
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: FONTS.sans,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              fontFamily: FONTS.mono,
              fontWeight: 700,
              color: COLORS.textLight,
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            CURRENT SEMESTER
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {semesters.map((s) => (
              <button
                key={s}
                onClick={() => setFormData({ ...formData, semester: s })}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  border: `1px solid ${formData.semester === s ? COLORS.brandBlue : COLORS.border}`,
                  backgroundColor:
                    formData.semester === s ? COLORS.brandBlue : "#fff",
                  color: formData.semester === s ? "#fff" : COLORS.textMuted,
                  fontSize: "13px",
                  fontWeight: 700,
                  fontFamily: FONTS.mono,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "10px",
              fontFamily: FONTS.mono,
              fontWeight: 700,
              color: COLORS.textLight,
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            PRIMARY SCHOLASTIC INTENT
          </label>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {intents.map((intent) => (
              <button
                key={intent.id}
                onClick={() => setFormData({ ...formData, intent: intent.id })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "12px" : "20px",
                  padding: isMobile ? "16px" : "20px 24px",
                  borderRadius: "16px",
                  border: `1px solid ${formData.intent === intent.id ? COLORS.brandBlue : COLORS.border}`,
                  backgroundColor: "#fff",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow:
                    formData.intent === intent.id
                      ? "0 4px 15px rgba(77, 63, 255, 0.08)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: "#f8faff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.brandBlue,
                  }}
                >
                  {intent.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: COLORS.textMain,
                      marginBottom: "4px",
                    }}
                  >
                    {intent.title}
                  </div>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted }}>
                    {intent.desc}
                  </div>
                </div>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: `1.5px solid ${formData.intent === intent.id ? COLORS.brandBlue : COLORS.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {formData.intent === intent.id && (
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: COLORS.brandBlue,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={8} color="#fff" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#f0fdf9",
            border: "1px solid #ccfbf1",
            padding: "16px 20px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Sparkles size={16} color="#0d9488" />
          <span
            style={{
              fontSize: "10px",
              fontFamily: FONTS.mono,
              fontWeight: 700,
              color: "#0d9488",
              letterSpacing: "0.1em",
            }}
          >
            AI PATH OPTIMIZED FOR ARCHIVAL EXAM RECOVERY
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "space-between",
            marginTop: "24px",
            gap: isMobile ? "20px" : "0",
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: "13px",
              color: COLORS.textLight,
              fontFamily: FONTS.sans,
            }}
          >
            Back to Academic
          </button>
          <button
            onClick={onNext}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isMobile ? "100%" : "auto",
              gap: "12px",
              backgroundColor: COLORS.brandBlue,
              color: "#fff",
              border: "none",
              borderRadius: "100px",
              padding: "16px 40px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: FONTS.sans,
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(77, 63, 255, 0.25)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Syncing..." : "Let's Go"} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Step 4: Success ── */
function Success({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "400px" : "800px",
          height: isMobile ? "400px" : "800px",
          opacity: 0.04,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          style={{ width: "100%", height: "100%", color: COLORS.textMain }}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="0.2"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="currentColor"
            strokeWidth="0.2"
          />
          <path
            d="M50 5 L95 50 L50 95 L5 50 Z"
            stroke="currentColor"
            strokeWidth="0.2"
          />
        </svg>
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: isMobile ? "64px" : "88px",
            height: isMobile ? "64px" : "88px",
            borderRadius: "50%",
            backgroundColor: COLORS.brandTeal,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "48px",
          }}
        >
          <Check size={isMobile ? 32 : 44} color="#fff" />
        </div>
        <h1
          style={{
            fontSize: isMobile ? "42px" : "72px",
            fontFamily: FONTS.serif,
            fontWeight: 700,
            color: COLORS.textMain,
            margin: "0 0 16px 0",
            lineHeight: 1.1,
          }}
        >
          You're all set.
        </h1>
        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            fontFamily: FONTS.serif,
            fontStyle: "italic",
            color: COLORS.textMuted,
            margin: "0 0 56px 0",
          }}
        >
          "Knowledge is the supreme ornament."
        </p>
        <div
          style={{
            padding: "12px 36px",
            backgroundColor: "rgba(96, 252, 198, 0.08)",
            border: `1px solid rgba(13, 148, 136, 0.2)`,
            borderRadius: "100px",
            color: "#0d9488",
            fontSize: "11px",
            fontFamily: FONTS.mono,
            fontWeight: 700,
            letterSpacing: "0.25em",
            marginBottom: "40px",
          }}
        >
          INITIALIZATION COMPLETE
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Onboarding() {
  const router = useRouter();
  const { user, setUser, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [formData, setFormData] = useState({
    college: "",
    degree: "",
    customDegree: "",
    department: "",
    year: "1st Year",
    semester: "02",
    intent: "exam_prep",
  });

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/login");
    }
    if (user?.name && !name) setName(user.name);
  }, [user, isLoading, mounted, name, router]);

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => router.push("/dashboard"), 4000);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const payload = {
        name,
        college_name: formData.college,
        degree: formData.degree === "other" ? formData.customDegree : formData.degree,
        department: formData.department,
        course: formData.department,
        year: parseInt(formData.year.replace(/[^0-9]/g, "")) || 1,
        semester: parseInt(formData.semester) || 1,
        intent: formData.intent,
        is_onboarded: true,
      };

      await api.patch(`/auth/users/${user.id}`, payload);
      
      const updatedUser = { ...user, ...payload, isOnboarded: true };
      if (setUser) setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      setStep(4);
    } catch (err: any) {
      alert(getFriendlyErrorMessage(err, "Failed to save profile."));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || isLoading) return null;
  const isMobile = windowWidth < 1024;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100vw",
        height: "100dvh",
        backgroundColor: isMobile ? "#FAFAFA" : COLORS.contentBg,
        fontFamily: FONTS.sans,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <GlobalStyles />
      
      {/* Mobile Premium Background Effects */}
      {isMobile && (
        <>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(77, 63, 255, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(96, 252, 198, 0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 }} />
        </>
      )}

      {step < 4 && <Sidebar step={step} isMobile={isMobile} />}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflowY: "auto",
          width: "100%",
          zIndex: 1,
        }}
      >
        <header
          style={{
            height: isMobile ? "72px" : "96px",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "space-between",
            padding: isMobile ? "0 24px" : "0 64px",
            flexShrink: 0,
            zIndex: 100,
            backgroundColor: isMobile ? "rgba(255, 255, 255, 0.7)" : "transparent",
            backdropFilter: isMobile ? "blur(20px)" : "none",
            WebkitBackdropFilter: isMobile ? "blur(20px)" : "none",
            borderBottom: isMobile ? `1px solid rgba(0,0,0,0.05)` : "none",
            position: isMobile ? "sticky" : "static",
            top: 0,
          }}
        >
          {isMobile ? (
            <CCAILogo size={22} variant="light" />
          ) : (
            <div /> // Empty div to keep space-between layout for STUDENT PORTAL text
          )}
          {!isMobile && step < 4 && (
            <div
              style={{
                fontSize: "10px",
                fontFamily: FONTS.mono,
                fontWeight: 700,
                color: COLORS.textLight,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
              }}
            >
              STUDENT PORTAL
            </div>
          )}
        </header>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: isMobile ? "center" : "flex-start",
            padding:
              step === 4
                ? "0"
                : isMobile
                  ? "40px 0 80px 0"
                  : "0 64px 80px 10vw",
            zIndex: 10,
          }}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1
                key="s1"
                user={user}
                name={name}
                onNameChange={setName}
                onNext={() => setStep(2)}
                isMobile={isMobile}
              />
            )}
            {step === 2 && (
              <Step2
                key="s2"
                formData={formData}
                setFormData={setFormData}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                isMobile={isMobile}
              />
            )}
            {step === 3 && (
              <Step3
                key="s3"
                formData={formData}
                setFormData={setFormData}
                onBack={() => setStep(2)}
                onNext={handleSubmit}
                isMobile={isMobile}
                loading={loading}
              />
            )}
            {step === 4 && <Success key="s4" isMobile={isMobile} />}
          </AnimatePresence>
        </div>

        {/* Desktop mascot image */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "40px",
              width: "400px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <motion.img
              src={step === 4 ? "/Smile.png" : "/owl-mascot.png"}
              alt="Owl Mascot"
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
