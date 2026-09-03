"use client";

import { Gift, X } from "lucide-react";
import { useState } from "react";

export default function WelcomeGiftPopup({
  onDismiss,
}: {
  onDismiss: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dismiss = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await onDismiss();
    } catch {
      setError("Could not save this yet. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-gift-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: 20,
        background: "rgba(9, 9, 15, 0.55)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(100%, 440px)",
          padding: "40px 32px 32px",
          borderRadius: 24,
          background: "var(--deep)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.24)",
          textAlign: "center",
        }}
      >
        <button
          type="button"
          aria-label="Close welcome gift"
          disabled={saving}
          onClick={dismiss}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            border: 0,
            background: "transparent",
            color: "var(--mist)",
            cursor: saving ? "wait" : "pointer",
          }}
        >
          <X size={20} />
        </button>
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 20px",
            borderRadius: 18,
            display: "grid",
            placeItems: "center",
            background: "rgba(77,63,255,0.12)",
          }}
        >
          <Gift size={30} color="#4D3FFF" />
        </div>
        <h2
          id="welcome-gift-title"
          style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 12 }}
        >
          Welcome to College Circle
        </h2>
        <p style={{ color: "var(--mist)", lineHeight: 1.6, marginBottom: 24 }}>
          Your learning space is ready. Upload a course plan to get started.
        </p>
        {error && <p role="alert" style={{ color: "#D94F00", marginBottom: 16 }}>{error}</p>}
        <button
          type="button"
          className="btn-primary"
          disabled={saving}
          onClick={dismiss}
          style={{ width: "100%", borderRadius: 999, padding: "13px 20px" }}
        >
          {saving ? "Saving..." : "Let’s go"}
        </button>
      </div>
    </div>
  );
}
