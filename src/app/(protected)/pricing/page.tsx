"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Crown, Rocket, ShieldCheck } from "lucide-react";
import api, { getFriendlyErrorMessage } from "@/lib/api";
import Script from "next/script";

interface Package {
  id: string;
  name: string;
  amount: number;
  premiumDays?: number;
  description: string;
}

const PLAN_ICONS: Record<string, any> = {
  "Emergency Study pack": Rocket,
  "Assignment Rescue": Zap,
  "Exam Rescue": Crown,
};

const FALLBACK_PACKAGES: Package[] = [
  {
    id: "pkg_1",
    name: "Starter Premium",
    amount: 20,
    premiumDays: 7,
    description: "Unlock premium access for 7 days.",
  },
  {
    id: "pkg_2",
    name: "Monthly Premium",
    amount: 49,
    premiumDays: 30,
    description: "Unlock premium access for 30 days.",
  },
  {
    id: "pkg_3",
    name: "Quarterly Premium",
    amount: 199,
    premiumDays: 90,
    description: "Unlock premium access for 90 days.",
  },
];

export default function PricingPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "error" | "success";
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pkgRes = await api.get("/payments/packages");
        const fetchedPackages = pkgRes.data?.data || pkgRes.data || [];

        setPackages(
          Array.isArray(fetchedPackages) && fetchedPackages.length > 0
            ? fetchedPackages.map((pkg: any) => ({
                id: pkg.id,
                name: pkg.name,
                amount: pkg.amount,
                premiumDays: pkg.premiumDays ?? pkg.premium_days ?? pkg.days,
                description: pkg.description || "Premium subscription access",
              }))
            : FALLBACK_PACKAGES,
        );
      } catch (err) {
        console.error("Pricing sync deferred:", err);
        setPackages(FALLBACK_PACKAGES);
        showToast(
          getFriendlyErrorMessage(err, "Unable to load pricing right now."),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBuy = async (pkg: Package) => {
    setBuying(pkg.id);
    try {
      // 1. Create Order
      const orderRes = await api.post("/payments/create-order", {
        amount: pkg.amount,
        description: pkg.description,
      });

      const orderData = orderRes.data?.data;
      if (!orderData) throw new Error("Order creation failed");

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "", // Make sure this is in your .env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "College Circle AI",
        description: pkg.description,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          // Success callback
          showToast(
            `Premium activated for ${pkg.premiumDays ?? "your selected"} days.`,
            "success",
          );
        },
        prefill: {
          name: "", // Optional: Fill from user profile
          email: "",
        },
        theme: {
          color: "#4D3FFF",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed", err);
      showToast(
        getFriendlyErrorMessage(
          err,
          "Failed to start payment. Please try again.",
        ),
      );
    } finally {
      setBuying(null);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: isMobile ? "24px 20px" : "40px 56px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 10000,
            background: toast.type === "error" ? "#FF4D5A" : "#14122A",
            color: "#fff",
            padding: "14px 18px",
            borderRadius: 14,
            fontWeight: 600,
            boxShadow: "0 16px 36px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 32 : 48,
            fontWeight: 800,
            color: "var(--ink)",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          Supercharge Your Learning
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            color: "var(--mist)",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Get AI-powered notes, quizzes, and personalized roadmaps for any
          course. Choose a subscription plan that fits how long you want premium
          access.
        </motion.p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 24,
            padding: "8px 16px",
            background: "rgba(77,63,255,0.06)",
            borderRadius: 999,
            border: "1px solid rgba(77,63,255,0.15)",
            color: "#4D3FFF",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Time-based premium plans • no credits required
        </div>
      </div>

      {/* Pricing Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(340px, 1fr))",
          gap: isMobile ? 24 : 32,
          paddingBottom: 80,
        }}
      >
        {packages.map((pkg, idx) => {
          const Icon = PLAN_ICONS[pkg.name] || Zap;
          const isPro = pkg.name === "Professional";

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: "var(--deep)",
                borderRadius: 24,
                padding: isMobile ? 32 : 40,
                border: isPro
                  ? "2px solid #4D3FFF"
                  : "1px solid var(--border-light)",
                boxShadow: isPro
                  ? "0 20px 40px rgba(77,63,255,0.12)"
                  : "0 4px 20px rgba(0,0,0,0.04)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              whileHover={{ transform: "translateY(-8px)" }}
            >
              {isPro && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#4D3FFF",
                    color: "#fff",
                    padding: "4px 16px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: isPro
                      ? "linear-gradient(135deg,#4D3FFF,#7B70FF)"
                      : "rgba(9,9,15,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Icon size={24} color={isPro ? "#fff" : "#4D3FFF"} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  {pkg.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--mist)",
                    lineHeight: 1.5,
                  }}
                >
                  {pkg.description}
                </p>
              </div>

              <div style={{ marginBottom: 32 }}>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 4 }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    ₹
                  </span>
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 800,
                      color: "var(--ink)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {pkg.amount}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "#4D3FFF",
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  {pkg.premiumDays ?? 30} days of premium access
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginBottom: 40,
                  flex: 1,
                }}
              >
                {[
                  "Unlimited premium study sessions",
                  "Priority AI study recommendations",
                  "Interactive quizzes and roadmaps",
                  "Download-ready notes and summaries",
                  "Calendar-linked planning and reminders",
                ].map((feature, fIdx) => (
                  <div
                    key={fIdx}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <ShieldCheck size={18} color="#00C896" />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--ink)",
                        opacity: 0.8,
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleBuy(pkg)}
                disabled={buying !== null}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 14,
                  border: "none",
                  background: isPro ? "#4D3FFF" : "var(--border-light)",
                  color: isPro ? "#fff" : "var(--ink)",

                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {buying === pkg.id ? "Processing..." : `Get ${pkg.name}`}
                {buying !== pkg.id && <ArrowRight size={18} />}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
