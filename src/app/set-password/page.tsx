"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import BrandPanel from "@/components/brand/BrandPanel";
import CCAILogo from "@/components/brand/CCAILogo";
import { api, getFriendlyErrorMessage } from "@/lib/api";

export const dynamic = "force-dynamic";

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Verification token is missing. Please check your email link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/verify-email", {
        token,
        password,
      });
      if (response.data?.success) {
        const accessToken =
          response.data?.data?.accessToken ||
          response.data?.data?.token ||
          response.data?.accessToken ||
          response.data?.token;
        if (accessToken && typeof window !== "undefined") {
          localStorage.setItem("token", accessToken);
        }

        setIsSuccess(true);
        setTimeout(() => {
          router.push("/onboarding");
        }, 2500);
      } else {
        setError(response.data?.message || "Failed to set password.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(
        getFriendlyErrorMessage(err, "Unable to set password right now."),
      );
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen flex bg-[#F8F5F2]">
      {/* LEFT: BRAND PANEL */}
      <div className="hidden lg:block lg:w-1/2">
        <BrandPanel />
      </div>

      {/* RIGHT: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center py-12 relative overflow-hidden">
        {/* Precise Watermark Book (Matching Screenshot) */}
        <div className="absolute -top-6 right-12 pointer-events-none opacity-[0.04] w-[220px] h-[220px] text-black">
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

        <div className="absolute top-12 left-8 lg:hidden">
          <CCAILogo size={32} variant="light" />
        </div>

        <div className="max-w-md w-full px-8">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ marginBottom: "64px" }}>
                  <h2
                    className="serif"
                    style={{
                      fontSize: "40px",
                      fontWeight: 600,
                      color: "#09090F",
                      marginBottom: "12px",
                    }}
                  >
                    Secure Your Account
                  </h2>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "16px",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Final step! Create a strong password to start your journey
                    with CC&gt;AI.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="">
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
                    <label htmlFor="password" style={labelStyle}>
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
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
                        type={showPassword ? "text" : "password"}
                        required
                        style={inputStyle}
                        placeholder="Enter your password here"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "52px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#9CA3AF",
                        }}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: "40px" }}>
                    <label htmlFor="confirmPassword" style={labelStyle}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <ShieldCheck
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
                        type={showPassword ? "text" : "password"}
                        required
                        style={inputStyle}
                        placeholder="Enter your password here"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      padding: "18px",
                      background: "var(--ink)",
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
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? "Securing Account..." : "Complete Setup"}
                    {!isSubmitting && <ArrowRight size={20} />}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    background: "rgba(0, 200, 150, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--jade)",
                    margin: "0 auto 32px auto",
                  }}
                >
                  <CheckCircle2 size={48} />
                </div>
                <h2
                  className="serif"
                  style={{
                    fontSize: "36px",
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: "16px",
                  }}
                >
                  Setup Complete!
                </h2>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "16px",
                    lineHeight: 1.6,
                    marginBottom: "40px",
                  }}
                >
                  Your account is now secured. We are preparing your
                  personalized AI workspace...
                </p>
                <div
                  style={{
                    height: "4px",
                    width: "120px",
                    background: "#F3F4F6",
                    margin: "0 auto",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    style={{ height: "100%", background: "var(--violet)" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordContent />
    </Suspense>
  );
}
