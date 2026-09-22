"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api, getFriendlyErrorMessage } from "../../lib/api";
import { getPostAuthRoute, useAuth } from "../../context/AuthContext";
import { AlertCircle, Mail, ArrowRight, User } from "lucide-react";
import styles from "./register.module.css";

export default function Register() {
  const router = useRouter();
  const { user, isLoading, hydrateUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  // Handle Google OAuth hash return if redirected back to /register
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

  // If already logged in, route to authorized dashboard
  useEffect(() => {
    if (isLoading) return;
    if (!user) return;
    router.replace(getPostAuthRoute(user));
  }, [isLoading, router, user]);

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
          getFriendlyErrorMessage(err, "Unable to complete registration.")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCardWrapper}>
        {/* Top Right "Already have an account? Log in" */}
        <div className={styles.registerLoginTopRight}>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#2424E6",
              fontWeight: 600,
              textDecoration: "none",
              marginLeft: "4px",
            }}
          >
            Log in
          </Link>
        </div>

        {/* Left Column: Logo, Heading, Inputs, Buttons */}
        <div className={styles.registerLeftCol}>
          {/* Top Brand Mark */}
          <div className={styles.registerTopRow}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
              }}
            >
              {/* Visual Circle Logo Mark */}
              <svg
                width="38"
                height="38"
                viewBox="0 0 80 80"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="34" cy="40" r="28" fill="#2424E6" />
                <circle cx="50" cy="34" r="18" fill="#F8F5EE" />
                <circle cx="50" cy="34" r="9" fill="#10B981" opacity="0.9" />
                <circle cx="34" cy="40" r="8" fill="#F8F5EE" />
              </svg>
              <span
                style={{
                  fontFamily:
                    "var(--font-garamond), 'EB Garamond', Georgia, serif",
                  fontSize: "23px",
                  fontWeight: 500,
                  color: "#18171A",
                  letterSpacing: "-0.01em",
                }}
              >
                College Circle AI
              </span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Title & Subtitle */}
                <h1 className={styles.registerTitle}>
                  Create your account
                </h1>
                <p className={styles.registerSubtitle}>
                  Start your personalised learning journey
                  <br />
                  with College Circle AI.
                </p>

                {/* Errors */}
                {googleAuthError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      backgroundColor: "#FEF2F2",
                      border: "1px solid #FEE2E2",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      color: "#B91C1C",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
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
                      padding: "10px 14px",
                      borderRadius: "10px",
                      color: "#B91C1C",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleRegister}>
                  {/* Full name input */}
                  <div className={styles.registerInputWrap}>
                    <User
                      className={styles.registerInputIcon}
                      size={18}
                      strokeWidth={1.75}
                    />
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.registerFieldInput}
                    />
                  </div>

                  {/* Email address input */}
                  <div className={styles.registerInputWrap}>
                    <Mail
                      className={styles.registerInputIcon}
                      size={18}
                      strokeWidth={1.75}
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.registerFieldInput}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.registerSubmitBtn}
                  >
                    <span>
                      {loading ? "Creating account..." : "Create account"}
                    </span>
                    {!loading && <ArrowRight size={17} />}
                  </button>
                </form>

                {/* Divider */}
                <div className={styles.registerOrDivider}>
                  <span>or</span>
                </div>

                {/* Continue with Google button only (Centered, No Github) */}
                <div className={styles.registerGoogleWrap}>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className={styles.registerGoogleBtn}
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
                    <span>Continue with Google</span>
                  </button>
                </div>

                {/* Footnote: Privacy Policy */}
                <div className={styles.registerFootnote}>
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/privacy-policy"
                    className={styles.registerFootnoteLink}
                  >
                    Privacy Policy
                  </Link>
                  .
                </div>
              </motion.div>
            ) : (
              /* Success View: Verification Sent */
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: "24px 0",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(36, 36, 230, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2424E6",
                    marginBottom: "20px",
                  }}
                >
                  <Mail size={30} />
                </div>
                <h2
                  style={{
                    fontFamily:
                      "var(--font-garamond), 'EB Garamond', Georgia, serif",
                    fontSize: "34px",
                    fontWeight: 600,
                    color: "#18171A",
                    marginBottom: "10px",
                  }}
                >
                  Check your email
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#5C574F",
                    lineHeight: 1.5,
                    marginBottom: "24px",
                  }}
                >
                  We&apos;ve sent a verification link to{" "}
                  <strong style={{ color: "#18171A" }}>{email}</strong>. Click
                  the link to set your password and get started.
                </p>
                <Link
                  href="/login"
                  style={{
                    display: "inline-block",
                    width: "fit-content",
                    padding: "12px 28px",
                    backgroundColor: "#18171B",
                    color: "#FFFFFF",
                    borderRadius: "11px",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  Return to Log In
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hairline Divider between Form and Illustration */}
        <div className={styles.registerDividerLine} />

        {/* Right Column: Owl Mascot Illustration */}
        <div className={styles.registerRightCol}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/signup 2.png"
            alt="College Circle AI Mascot Learning Illustration"
            style={{
              width: "100%",
              maxWidth: "760px",
              maxHeight: "820px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}
