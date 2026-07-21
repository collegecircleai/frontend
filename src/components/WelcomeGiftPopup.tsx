"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Check, Sparkles, AlertCircle } from "lucide-react";
import api, { getFriendlyErrorMessage } from "@/lib/api";

interface WelcomeGiftPopupProps {
  /** Called after the gift is successfully claimed (or found already claimed). */
  onClaimed: () => void;
  /** Called when the user dismisses the popup without claiming. */
  onClose: () => void;
  /** Where to send the user from the success screen. */
  onStart: () => void;
}

const PRICE_STEPS = [150, 120, 90, 60, 30, 0];

const FEATURES = [
  "Personalized Semester Planner",
  "AI CGPA Builder",
  "Smart Revision Planner",
  "Assignment Planning",
  "Progress Tracking",
  "Study Goal Management",
];

type Stage = "offer" | "success";

export default function WelcomeGiftPopup({
  onClaimed,
  onClose,
  onStart,
}: WelcomeGiftPopupProps) {
  const [stage, setStage] = useState<Stage>("offer");
  const [priceIdx, setPriceIdx] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  const currentPrice = PRICE_STEPS[priceIdx];
  const isFree = animationDone && currentPrice === 0;

  // Smooth ~2.5s countdown: 150 → 0, then "FREE FOR YOU".
  useEffect(() => {
    if (priceIdx >= PRICE_STEPS.length - 1) {
      const t = setTimeout(() => setAnimationDone(true), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPriceIdx((i) => i + 1), 420);
    return () => clearTimeout(t);
  }, [priceIdx]);

  const handleClaim = async () => {
    setClaiming(true);
    setError("");
    try {
      await api.post("/auth/welcome-gift/claim");
      setStage("success");
      onClaimed();
    } catch (err) {
      setError(
        getFriendlyErrorMessage(
          err,
          "Unable to activate your complimentary access. Please try again.",
        ),
      );
    } finally {
      setClaiming(false);
    }
  };

  const overlay = useMemo(
    () => ({
      position: "fixed" as const,
      inset: 0,
      zIndex: 11000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      background: "rgba(8,8,26,0.72)",
      backdropFilter: "blur(6px)",
    }),
    [],
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={overlay}
        onClick={stage === "offer" && !claiming ? onClose : undefined}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 460,
            maxHeight: "92vh",
            overflowY: "auto",
            background: "var(--deep)",
            borderRadius: 24,
            border: "1px solid var(--border-light)",
            boxShadow: "0 24px 60px rgba(77,63,255,0.22)",
            padding: 32,
            textAlign: "center",
          }}
        >
          {stage === "offer" ? (
            <>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--mist)",
                  marginBottom: 20,
                }}
              >
                Welcome to College Circle AI
              </p>

              {/* Price countdown → FREE */}
              <div
                style={{
                  height: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                }}
              >
                <AnimatePresence mode="wait">
                  {isFree ? (
                    <motion.div
                      key="free"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 40,
                        fontWeight: 800,
                        color: "var(--jade)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Sparkles size={28} color="var(--jade)" />
                      FREE FOR YOU
                    </motion.div>
                  ) : (
                    <motion.div
                      key={currentPrice}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 44,
                        fontWeight: 700,
                        color: "var(--ink)",
                      }}
                    >
                      ₹{currentPrice}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--ink)",
                  margin: "12px 0 10px",
                  lineHeight: 1.2,
                }}
              >
                Your AI CGPA Builder Has Been Unlocked
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--mist)",
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                As a welcome gift, College Circle AI is giving you complimentary
                access to the AI CGPA Builder — designed to help you plan, track,
                and improve your academic performance throughout the semester.
              </p>

              {/* Feature checklist */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  textAlign: "left",
                  marginBottom: 24,
                }}
              >
                {FEATURES.map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.12 }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 999,
                        background: "rgba(0,200,150,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={14} color="var(--jade)" />
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--ink)",
                        opacity: 0.9,
                      }}
                    >
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Early access badge */}
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 999,
                    background: "rgba(77,63,255,0.08)",
                    border: "1px solid rgba(77,63,255,0.18)",
                    color: "var(--violet)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <ShieldCheck size={14} /> Early Member Benefit
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--mist)",
                    marginTop: 8,
                  }}
                >
                  This complimentary access is available to students joining
                  during the early access phase.
                </p>
              </div>

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "center",
                    background: "rgba(255,77,90,0.1)",
                    color: "#FF4D5A",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontSize: 13,
                    marginBottom: 14,
                  }}
                >
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                onClick={handleClaim}
                disabled={claiming || !animationDone}
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 14,
                  border: "none",
                  background: "var(--violet)",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: claiming || !animationDone ? "not-allowed" : "pointer",
                  opacity: claiming || !animationDone ? 0.7 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {claiming
                  ? "Activating…"
                  : error
                    ? "Try Again"
                    : "Claim My Free Access"}
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 999,
                  background: "rgba(0,200,150,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Check size={38} color="var(--jade)" />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: 12,
                }}
              >
                AI CGPA Builder Activated
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--mist)",
                  lineHeight: 1.6,
                  marginBottom: 28,
                }}
              >
                Your complimentary access has been successfully activated. You
                can now begin planning your semester using College Circle AI.
              </p>
              <button
                onClick={onStart}
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 14,
                  border: "none",
                  background: "var(--violet)",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Start Building My Semester
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
