"use client";

import React, { useState } from "react";
import { api, getFriendlyErrorMessage } from "../../lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BrandPanel from "@/components/brand/BrandPanel";
import CCAILogo from "@/components/brand/CCAILogo";
import { Mail, ArrowRight, User as UserIcon, AlertCircle } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const googleAuthPath = "/api/auth/google";

  const handleGoogleAuth = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    window.location.href = `${apiBase.replace(/\/+$/, "")}${googleAuthPath}`;
  };

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
      });

      if (
        response.data?.success ||
        response.status === 201 ||
        response.status === 200
      ) {
        setIsSent(true);
      } else {
        setError(response.data?.message || "Failed to register.");
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("An account with this email already exists.");
      } else {
        setError(
          getFriendlyErrorMessage(err, "Unable to complete registration."),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    fontSize: "15px",
    fontFamily: "DM Sans, sans-serif",
    outline: "none",
    transition: "all 0.3s ease",
    background: "#F9FAFB",
    color: "#000000",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 800,
    color: "#9CA3AF",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    marginBottom: "14px",
    fontFamily: "DM Sans, sans-serif",
  };

  const googleButtonStyle = {
    width: "100%",
    padding: "18px",
    background: "#FFFFFF",
    color: "#111827",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: 700,
    border: "1px solid #E5E7EB",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    fontFamily: "DM Sans, sans-serif",
    transition: "all 0.2s ease",
  };

  return (
    <div className="min-h-screen flex bg-[#F8F5F2]">
      {/* LEFT: BRAND PANEL */}
      <div className="hidden lg:block lg:w-1/2">
        <BrandPanel />
      </div>

      {/* RIGHT: FORM */}
      <div
        style={{
          padding: isMobile ? "48px 32px" : "48px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          flex: 1,
        }}
        className="w-full lg:w-1/2"
      >
        {/* Precise Watermark Book (Matching Screenshot) */}
        <div className="absolute -top-6 right-12 pointer-events-none opacity-[0.04] w-55 h-55 text-black">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full"
          >
            {/* Left Page */}
            <path d="M 2 7 C 2 7, 6 4, 11 6 L 11 21 C 6 19, 2 21, 2 21 Z" />
            {/* Right Page with integrated fold */}
            <path d="M 13 6 C 18 4, 22 7, 22 7 L 22 21 C 22 21, 18 19, 13 21 Z" />
            {/* Subtle Page Fold Detail */}
            <path
              d="M 13 6 C 15 3, 19 3, 21 6 L 21 20 C 19 17, 15 17, 13 20 Z"
              opacity="0.3"
            />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            top: isMobile ? "24px" : "48px",
            left: isMobile ? "32px" : "32px",
            zIndex: 20,
          }}
          className="lg:hidden"
        >
          <CCAILogo size={32} variant="light" />
        </div>

        <div className="max-w-md w-full px-8">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form-container"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ marginBottom: "64px" }}>
                  <h2
                    className="serif"
                    style={{
                      fontSize: isMobile ? "32px" : "40px",
                      fontWeight: 600,
                      color: "#09090F",
                      marginBottom: "12px",
                    }}
                  >
                    Join the Circle
                  </h2>

                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "16px",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Create your scholastic identity to begin your journey.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleGoogleAuth}
                    style={{ ...googleButtonStyle, marginBottom: "24px" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#D1D5DB";
                      e.currentTarget.style.boxShadow =
                        "0 6px 18px rgba(17, 24, 39, 0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E5E7EB";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#EA4335"
                        d="M12 10.2v3.96h5.62c-.25 1.32-1.02 2.44-2.18 3.2v2.67h3.53c2.06-1.9 3.25-4.7 3.25-8.03 0-.78-.07-1.53-.2-2.2H12z"
                      />
                      <path
                        fill="#34A853"
                        d="M6.55 14.18l-.72.55-2.56 1.99C4.86 19.56 8.1 21.8 12 21.8c2.7 0 4.96-.89 6.62-2.42l-3.53-2.67c-.97.65-2.21 1.04-3.09 1.04-2.37 0-4.38-1.6-5.1-3.77z"
                      />
                      <path
                        fill="#4A90E2"
                        d="M3.27 7.86A9.82 9.82 0 0 0 2.2 12c0 1.34.32 2.6.97 3.72l4.35-3.37a5.86 5.86 0 0 1 0-1.71L3.27 7.86z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M12 5.38c1.47 0 2.78.51 3.82 1.52l2.86-2.86C16.95 2.38 14.7 1.4 12 1.4 8.1 1.4 4.86 3.64 3.27 7.86l4.35 3.38c.72-2.17 2.73-3.86 5.1-3.86z"
                      />
                    </svg>
                    Sign up with Google
                  </motion.button>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "32px",
                      color: "#9CA3AF",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    <span
                      style={{ flex: 1, height: "1px", background: "#E5E7EB" }}
                    />
                    <span>or continue with email</span>
                    <span
                      style={{ flex: 1, height: "1px", background: "#E5E7EB" }}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: "#FEF2F2",
                        border: "1px solid #FEE2E2",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        color: "#B91C1C",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}

                  <div style={{ marginBottom: "40px" }}>
                    <label htmlFor="name" style={labelStyle}>
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon
                        size={18}
                        style={{
                          position: "absolute",
                          right: "20px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#9CA3AF",
                        }}
                      />
                      <input
                        id="name"
                        type="text"
                        required
                        style={inputStyle}
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={(e) => {
                          e.target.style.background = "white";
                          e.target.style.borderColor = "var(--violet)";
                          e.target.style.boxShadow =
                            "0 0 0 4px rgba(77, 63, 255, 0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.background = "#F9FAFB";
                          e.target.style.borderColor = "#E5E7EB";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "40px" }}>
                    <label htmlFor="email" style={labelStyle}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        style={{
                          position: "absolute",
                          right: "20px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#9CA3AF",
                        }}
                      />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        style={inputStyle}
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={(e) => {
                          e.target.style.background = "white";
                          e.target.style.borderColor = "var(--violet)";
                          e.target.style.boxShadow =
                            "0 0 0 4px rgba(77, 63, 255, 0.05)";
                        }}
                        onBlur={(e) => {
                          e.target.style.background = "#F9FAFB";
                          e.target.style.borderColor = "#E5E7EB";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "18px",
                      background: "#4D3FFF",
                      color: "white",
                      borderRadius: "14px",
                      fontSize: "16px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      marginTop: "32px",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? "Initializing..." : "Create Account"}
                    {!loading && <ArrowRight size={20} />}
                  </motion.button>
                </form>

                <div
                  style={{
                    marginTop: "40px",
                    textAlign: "center",
                    fontSize: "15px",
                    color: "#6B7280",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    style={{
                      color: "var(--violet)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Sign in &rarr;
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(77, 63, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--violet)",
                    margin: "0 auto 32px",
                  }}
                >
                  <Mail size={40} />
                </div>
                <h2
                  className="serif"
                  style={{
                    fontSize: "32px",
                    fontWeight: 600,
                    color: "#09090F",
                    marginBottom: "16px",
                  }}
                >
                  Check your email
                </h2>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "16px",
                    fontFamily: "DM Sans, sans-serif",
                    lineHeight: 1.6,
                    marginBottom: "32px",
                  }}
                >
                  We've sent a verification link to <strong>{email}</strong>.
                  Click it to set your password and complete your registration.
                </p>
                <Link
                  href="/login"
                  style={{
                    display: "inline-block",
                    padding: "14px 32px",
                    background: "var(--ink)",
                    color: "white",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Back to Sign In
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
