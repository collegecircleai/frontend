"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getPostAuthRoute, useAuth } from "../../context/AuthContext";
import CCAILogo from "@/components/brand/CCAILogo";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { getFriendlyErrorMessage } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const { login, user, isLoading, hydrateUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState(false);

  const handleGoogleAuth = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    window.location.href = `${apiBase.replace(/\/+$/, "")}/api/auth/google`;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    setGoogleAuthError(searchParams.get("googleAuth") === "failed");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get("accessToken");
    const refreshToken = hashParams.get("refreshToken");

    if (!accessToken) return;

    localStorage.setItem("token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`
    );

    hydrateUser()
      .then((googleUser) => router.replace(getPostAuthRoute(googleUser)))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setGoogleAuthError(true);
      });
  }, [hydrateUser, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      const authData = response?.data ?? response;
      const user = authData?.user ?? authData?.data?.user;
      const hasTokens = Boolean(
        authData?.accessToken ?? authData?.data?.accessToken
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

  return (
    <>
      {/* Import Instrument Serif / Newsreader / EB Garamond */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,700;0,6..72,800;1,6..72,700&display=swap"
      />

        {/* Scoped CSS for responsive layout */}
        <style>{`
          .login-page-container {
            height: 100vh;
            max-height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
          .login-main-grid {
            display: grid;
            grid-template-columns: 340px 1fr;
          }
          .login-illustration-column {
            display: flex;
          }
          .login-desktop-access-label {
            display: inline-block;
          }
          .login-mobile-header-tagline {
            display: none;
          }
          .login-mobile-footer-caption {
            display: none;
          }
          @media (max-width: 900px) {
            .login-desktop-access-label {
              display: none !important;
            }
            .login-mobile-header-tagline {
              display: block !important;
              text-align: center !important;
              width: 100% !important;
              font-size: 18px !important;
              line-height: 1.4 !important;
              letter-spacing: 0.012em !important;
              color: #38342D !important;
              font-weight: 500 !important;
              padding: 0 12px !important;
              animation: taglineEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both !important;
            }
            @keyframes taglineEntrance {
              from {
                opacity: 0;
                transform: translateY(6px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .login-page-container {
              height: auto !important;
              min-height: 100dvh !important;
              max-height: none !important;
              overflow-y: auto !important;
              padding: 20px 16px 52px 16px !important;
              justify-content: flex-start !important;
            }
            .login-header {
              margin-top: 0 !important;
              margin-bottom: 20px !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              width: 100% !important;
              text-align: center !important;
            }
            .login-logo-link {
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              width: 100% !important;
              margin: 0 auto !important;
              text-align: center !important;
            }
            .login-logo-link > div {
              margin: 0 auto !important;
              justify-content: center !important;
            }
            .login-header-divider {
              width: 100% !important;
              max-width: 380px !important;
              text-align: center !important;
              display: flex !important;
              justify-content: center !important;
              margin: 14px auto 0 auto !important;
              padding-top: 14px !important;
            }
            .login-main-grid {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              width: 100% !important;
              gap: 0 !important;
              margin-bottom: 28px !important;
            }
            .login-form-card {
              width: 100% !important;
              max-width: 380px !important;
              padding: 26px 22px 24px 22px !important;
              border-radius: 24px !important;
              box-shadow: 0 4px 24px rgba(0,0,0,0.03) !important;
              margin-bottom: 24px !important;
            }
            .login-form-card h1 {
              font-size: 36px !important;
            }
            .login-form-card input {
              padding: 12px 16px !important;
              font-size: 15px !important;
            }
            .login-form-card button[type="submit"] {
              padding: 12px 18px !important;
              font-size: 16px !important;
            }
            .login-illustration-column {
              display: none !important;
            }
            .login-bottom-divider {
              display: none !important;
            }
            .login-mobile-footer-caption {
              display: none !important;
            }
          }
        `}</style>

        <div
          className="login-page-container"
          style={{
            backgroundColor: "#F4F1EA",
            color: "#1A1A1E",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "clamp(12px, 2vh, 24px) clamp(16px, 3.5vw, 44px)",
            boxSizing: "border-box",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1240px",
              display: "flex",
              flexDirection: "column",
              maxHeight: "100%",
            }}
          >
            {/* Top Header Section */}
            <header className="login-header" style={{ width: "100%", marginBottom: "clamp(8px, 1.2vh, 14px)", marginTop: "clamp(-8px, -1.2vh, -4px)", flexShrink: 0 }}>
              {/* Logo linked to Home without card border */}
              <Link
                href="/"
                className="login-logo-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0",
                  textDecoration: "none",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                title="Go to College Circle AI Home"
              >
                <CCAILogo size={28} variant="light" />
              </Link>

            {/* Hairline Divider & Section Label / Mobile Tagline */}
            <div
              className="login-header-divider"
              style={{
                marginTop: "clamp(6px, 1vh, 10px)",
                borderTop: "1px solid #E2DCD1",
                paddingTop: "clamp(5px, 0.8vh, 8px)",
              }}
            >
              {/* Desktop Section Label */}
              <span
                className="login-desktop-access-label"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "#2B2926",
                  textTransform: "uppercase",
                }}
              >
                STUDENT ACCESS
              </span>

              {/* Mobile Tagline (replaces STUDENT ACCESS on mobile only) */}
              <span
                className="login-mobile-header-tagline"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "15px",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#4A463F",
                  letterSpacing: "0.01em",
                }}
              >
                A calm place to pick up where you left off.
              </span>
            </div>
          </header>

          {/* Main Content Area */}
          <main
            className="login-main-grid"
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "340px 1fr",
              gap: "clamp(24px, 4vw, 48px)",
              alignItems: "center",
              minHeight: 0,
            }}
          >
            {/* Left Form Card: Light Warm Cream #FAF9F6 */}
            <motion.div
              className="login-form-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                backgroundColor: "#FAF9F6",
                borderRadius: "24px",
                padding: "36px 28px 30px 28px",
                border: "1px solid #E5E0D5",
                boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                width: "350px",
                maxWidth: "350px",
                flexShrink: 0,
              }}
            >
              {/* Title & Subtitle */}
              <h1
                style={{
                  fontFamily: "'Newsreader', 'Instrument Serif', Georgia, serif",
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#18171A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: "0 0 6px 0",
                  whiteSpace: "nowrap",
                }}
              >
                Welcome back
              </h1>
              <p
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontSize: "15px",
                  color: "#6B665E",
                  margin: "0 0 22px 0",
                  fontWeight: 500,
                }}
              >
                Continue your learning journey.
              </p>

              {googleAuthError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FEE2E2",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    color: "#B91C1C",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                    fontFamily: "'EB Garamond', Georgia, serif",
                  }}
                >
                  <AlertCircle size={15} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <span>Google sign-in failed. Please try again.</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FEE2E2",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    color: "#B91C1C",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                    fontFamily: "'EB Garamond', Georgia, serif",
                  }}
                >
                  <AlertCircle size={15} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleLogin}>
                {/* Email Field */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#18181B",
                      marginBottom: "6px",
                      fontFamily: "'EB Garamond', Georgia, serif",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "11px",
                      border: "1px solid #DFD9CE",
                      backgroundColor: "#FFFFFF",
                      fontSize: "14px",
                      color: "#18181B",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s ease",
                      fontFamily: "'EB Garamond', Georgia, serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#18181B")}
                    onBlur={(e) => (e.target.style.borderColor = "#DFD9CE")}
                  />
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: "10px" }}>
                  <label
                    htmlFor="password"
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#18181B",
                      marginBottom: "6px",
                      fontFamily: "'EB Garamond', Georgia, serif",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 38px 11px 14px",
                        borderRadius: "11px",
                        border: "1px solid #DFD9CE",
                        backgroundColor: "#FFFFFF",
                        fontSize: "14px",
                        color: "#18181B",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s ease",
                        fontFamily: "'EB Garamond', Georgia, serif",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#18181B")}
                      onBlur={(e) => (e.target.style.borderColor = "#DFD9CE")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        padding: "4px",
                        cursor: "pointer",
                        color: "#8E8A81",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div style={{ marginBottom: "16px" }}>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#4338CA",
                      textDecoration: "none",
                      fontFamily: "'EB Garamond', Georgia, serif",
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign in button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px 18px",
                    borderRadius: "11px",
                    backgroundColor: "#18171B",
                    color: "#FFFFFF",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    transition: "background-color 0.2s ease, transform 0.1s ease",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    fontFamily: "'EB Garamond', Georgia, serif",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = "#2C2A30";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = "#18171B";
                  }}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "16px 0",
                }}
              >
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E6E1D7" }} />
                <span
                  style={{
                    fontSize: "13px",
                    color: "#9E9A91",
                    fontFamily: "'EB Garamond', Georgia, serif",
                  }}
                >
                  or
                </span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E6E1D7" }} />
              </div>

              {/* Google sign-in */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                style={{
                  width: "100%",
                  padding: "11px 16px",
                  borderRadius: "11px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DFD9CE",
                  color: "#222025",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "background-color 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  fontFamily: "'EB Garamond', Georgia, serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAF8F5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
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
                <span>Continue with Google</span>
              </button>

              {/* Bottom Account Link */}
              <div
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  fontSize: "13.5px",
                  color: "#6E6A62",
                  fontFamily: "'EB Garamond', Georgia, serif",
                }}
              >
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  style={{
                    color: "#4338CA",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontFamily: "'EB Garamond', Georgia, serif",
                  }}
                >
                  Create account
                </Link>
              </div>
            </motion.div>

            {/* Right Illustration Card */}
            <div
              className="login-illustration-column"
              style={{
                flexDirection: "column",
                width: "100%",
              }}
            >
              <motion.div
                className="login-illustration-card"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                style={{
                  borderRadius: "28px",
                  border: "1px solid #E5E0D5",
                  boxShadow: "0 2px 14px rgba(0,0,0,0.015)",
                  overflow: "hidden",
                  width: "100%",
                  lineHeight: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/login1.png"
                  alt="Student learning illustration"
                  style={{
                    width: "100%",
                    maxHeight: "clamp(340px, 68vh, 560px)",
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </motion.div>

              {/* Bottom Caption */}
              <p
                style={{
                  marginTop: "clamp(12px, 1.6vh, 18px)",
                  paddingLeft: "6px",
                  fontSize: "clamp(20px, 2.2vh, 23px)",
                  color: "#46423A",
                  fontWeight: 500,
                  fontStyle: "italic",
                  fontFamily: "'EB Garamond', Georgia, serif",
                  letterSpacing: "0.01em",
                  lineHeight: 1.25,
                }}
              >
                A calm place to pick up where you left off.
              </p>
            </div>
          </main>

          {/* Mobile Footer Caption (visible on mobile only) */}
          <p className="login-mobile-footer-caption">
            A calm place to pick up where you left off.
          </p>

          {/* Bottom Hairline Divider matching top section placed further down */}
          <div
            className="login-bottom-divider"
            style={{
              width: "100%",
              marginTop: "clamp(18px, 2.8vh, 32px)",
              borderTop: "1px solid #DFD8CC",
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </>
  );
}
