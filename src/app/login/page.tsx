"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getPostAuthRoute, useAuth } from "../../context/AuthContext";
import BrandPanel from "@/components/brand/BrandPanel";
import CCAILogo from "@/components/brand/CCAILogo";
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { getFriendlyErrorMessage } from "@/lib/api";
import { useEffect } from "react";
export default function Login() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [googleAuthError, setGoogleAuthError] = useState(false);

  const handleGoogleAuth = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    window.location.href = `${apiBase.replace(/\/+$/, "")}/api/auth/google`;
  };

  // Hide the intro animation after 2.5 seconds + haptic vibration
  useEffect(() => {
    // Trigger a subtle haptic pulse on load
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([50, 80, 50]);
    }
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    setGoogleAuthError(searchParams.get("googleAuth") === "failed");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) {
      return;
    }

    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get("accessToken");
    const refreshToken = hashParams.get("refreshToken");

    if (!accessToken) {
      return;
    }

    localStorage.setItem("token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      const authData = response?.data ?? response;
      const user = authData?.user ?? authData?.data?.user;
      const hasTokens = Boolean(
        authData?.accessToken ?? authData?.data?.accessToken,
      );
      const isSuccessful =
        response?.success || authData?.success || Boolean(user) || hasTokens;

      if (isSuccessful) {
        router.replace(getPostAuthRoute(user ?? null));
      } else {
        setError(response?.message || authData?.message || "Failed to login.");
      }
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, "Unable to sign in right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;

    router.replace(getPostAuthRoute(user));
  }, [isLoading, router, user]);
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
    boxSizing: "border-box" as const,
  };

  const googleButtonStyle = {
    width: "100%",
    padding: "16px",
    background: "#FFFFFF",
    color: "#111827",
    borderRadius: "12px",
    fontSize: "15px",
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
    <>
      {/* Waving Hand Intro — Mobile Only */}
      {isMobile && showIntro && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          {/* Pulsing gradient glow behind the hand */}
          <div
            style={{
              position: "absolute",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(77,63,255,0.15) 0%, rgba(0,200,150,0.08) 50%, transparent 70%)",
              animation: "gradientPulse 2s ease-in-out infinite",
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontSize: "64px",
              animation: "wave 0.4s ease-in-out infinite alternate",
              transformOrigin: "70% 80%",
              display: "inline-block",
              position: "relative",
              zIndex: 2,
            }}
          >
            👋
          </div>
          <div
            style={{
              fontFamily: '"DM Sans", Arial, sans-serif',
              fontSize: "22px",
              fontWeight: 700,
              color: "#1a1a1a",
              textAlign: "center",
              marginTop: "16px",
              position: "relative",
              zIndex: 2,
            }}
          >
            Welcome back, Scholar.
          </div>
          <style>{`
            @keyframes wave {
              0% { transform: rotate(-15deg); }
              100% { transform: rotate(30deg); }
            }
            @keyframes gradientPulse {
              0%, 100% { transform: scale(1); opacity: 0.6; }
              50% { transform: scale(1.4); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      <div className="flex min-h-screen bg-white">
        {/* Brand Panel — hidden on mobile, 33% on desktop */}
        <div className="hidden lg:block w-[33%] min-h-screen">
          <BrandPanel />
        </div>

        {/* Right panel */}
        <div
          className="flex-1 flex flex-col justify-center items-center relative w-full"
          style={{ padding: isMobile ? "24px" : "64px" }}
        >
          {/* Decorative Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-80px",
                right: "-80px",
                width: "320px",
                height: "320px",
                background: "#E9D5FF",
                borderRadius: "50%",
                opacity: 0.05,
                filter: "blur(48px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "-80px",
                width: "384px",
                height: "384px",
                background: "#D8B4FE",
                borderRadius: "50%",
                opacity: 0.05,
                filter: "blur(48px)",
              }}
            />
          </div>

          {/* Logo at top */}
          <div
            style={{
              alignSelf: "flex-start",
              marginBottom: isMobile ? "32px" : "0px",
              position: isMobile ? "relative" : "absolute",
              top: isMobile ? "0" : "32px",
              left: isMobile ? "0" : "48px",
              zIndex: 20,
            }}
          >
            <CCAILogo size={isMobile ? 28 : 32} variant="light" />
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "448px",
              position: "relative",
              zIndex: 10,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div style={{ marginBottom: isMobile ? "28px" : "56px" }}>
                <h1 className="font-display font-semibold text-neutral-900 mb-3 leading-tight text-3xl lg:text-5xl">
                  Welcome Back
                </h1>

                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "15px",
                    color: "#6B7280",
                    lineHeight: 1.6,
                  }}
                >
                  Sign in to continue your learning journey and unlock your
                  potential.
                </p>
              </div>

              <form onSubmit={handleLogin}>
                {googleAuthError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "#FEF2F2",
                      border: "1px solid #FEE2E2",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      color: "#B91C1C",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "24px",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    <AlertCircle size={16} strokeWidth={2.5} />
                    Google sign-in failed. Please try again.
                  </motion.div>
                )}

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleGoogleAuth}
                  style={{ ...googleButtonStyle, marginBottom: "20px" }}
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
                  Sign in with Google
                </motion.button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "24px",
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

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "#FEF2F2",
                      border: "1px solid #FEE2E2",
                      padding: "14px 16px",
                      borderRadius: "12px",
                      color: "#B91C1C",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "24px",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    <AlertCircle size={16} strokeWidth={2.5} />
                    {error}
                  </motion.div>
                )}

                {/* Email Field */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: "12px",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail
                      size={18}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#D1D5DB",
                      }}
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      style={{ ...inputStyle, paddingRight: "44px" }}
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.background = "#FFFFFF";
                        e.target.style.borderColor = "#4D3FFF";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(77, 63, 255, 0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.background = "#F9FAFB";
                        e.target.style.borderColor = "#E5E7EB";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <label
                      htmlFor="password"
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      style={{
                        fontSize: "12px",
                        color: "#4D3FFF",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontFamily: "DM Sans, sans-serif",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.7")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={18}
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#D1D5DB",
                        pointerEvents: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "48px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9CA3AF",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#4D3FFF")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#9CA3AF")
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      style={{ ...inputStyle, paddingRight: "80px" }}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={(e) => {
                        e.target.style.background = "#FFFFFF";
                        e.target.style.borderColor = "#4D3FFF";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(77, 63, 255, 0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.background = "#F9FAFB";
                        e.target.style.borderColor = "#E5E7EB";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "#4D3FFF",
                    color: "#FFFFFF",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: 700,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "36px",
                    opacity: loading ? 0.75 : 1,
                    transition: "all 0.2s ease",
                    fontFamily: "DM Sans, sans-serif",
                    boxShadow: "0 4px 12px rgba(77, 63, 255, 0.3)",
                  }}
                  onMouseEnter={(e) =>
                    !loading && (e.currentTarget.style.background = "#3D2FEF")
                  }
                  onMouseLeave={(e) =>
                    !loading && (e.currentTarget.style.background = "#4D3FFF")
                  }
                >
                  {loading ? "Authenticating..." : "Sign In"}
                  {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
                </motion.button>
              </form>

              {/* Sign Up Link */}
              <div
                style={{
                  marginTop: "32px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#6B7280",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Don't have an account?{" "}
                <Link
                  href="/register"
                  style={{
                    color: "#4D3FFF",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Create account →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
