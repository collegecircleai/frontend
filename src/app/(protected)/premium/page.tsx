"use client";

import { useState } from "react";
import Script from "next/script";
import api, { getFriendlyErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";

const PREMIUM_PACKAGE = {
  name: "14 Day Premium",
  amount: 14,
  premiumDays: 14,
  description: "Unlock premium access for 14 days.",
};

export default function PremiumPage() {
  const router = useRouter();
  const [isBuying, setIsBuying] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "error" | "success";
  } | null>(null);
  const [todayOfferMessage, setTodayOfferMessage] = useState<string | null>(
    null,
  );
  const [isCheckingOffer, setIsCheckingOffer] = useState(false);

  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 4000);
  };

  const handleBuyPremium = async () => {
    setIsBuying(true);
    try {
      const orderRes = await api.post("/payments/create-order", {
        amount: PREMIUM_PACKAGE.amount,
        description: PREMIUM_PACKAGE.description,
      });

      const orderData = orderRes.data?.data;
      if (!orderData) {
        throw new Error("Order creation failed");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "College Circle AI",
        description: PREMIUM_PACKAGE.description,
        order_id: orderData.orderId,
        handler: () => {
          showToast(
            "Premium purchase started. Complete checkout to activate.",
            "success",
          );
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#4D3FFF",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Premium checkout failed", err);
      showToast(
        getFriendlyErrorMessage(err, "Unable to start premium purchase."),
      );
    } finally {
      setIsBuying(false);
    }
  };

  const handleCheckTodayOffer = async () => {
    setIsCheckingOffer(true);
    try {
      const res = await api.get("/payments/today-special");
      const message =
        res.data?.message || "Today-only special offer is available.";
      setTodayOfferMessage(message);
      showToast(message, "success");
    } catch (err) {
      setTodayOfferMessage(null);
      showToast(
        getFriendlyErrorMessage(
          err,
          "You are not eligible for the today-only offer.",
        ),
      );
    } finally {
      setIsCheckingOffer(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px 24px",
        background: "linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)",
      }}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {toast && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 999,
            padding: "14px 18px",
            borderRadius: 16,
            background: toast.type === "success" ? "#14122A" : "#E15555",
            color: "#fff",
            boxShadow: "0 12px 24px rgba(0,0,0,0.16)",
            fontWeight: 600,
          }}
        >
          {toast.msg}
        </div>
      )}

      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <div style={{ marginBottom: 42, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#6b7280",
              fontWeight: 700,
            }}
          >
            Welcome to premium
          </p>
          <h1
            style={{
              marginTop: 18,
              marginBottom: 18,
              fontSize: 48,
              lineHeight: 1.05,
              color: "#111827",
              fontWeight: 800,
            }}
          >
            Unlock 14 days of premium for just ₹14.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 620,
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: 17,
              color: "#4b5563",
              lineHeight: 1.7,
            }}
          >
            Complete your onboarding journey with a premium plan built for new
            learners. Get AI notes, smart flashcards, and daily learning boosts.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              marginTop: 24,
              padding: "12px 24px",
              borderRadius: 14,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Skip for now
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 24,
          }}
        >
          <div
            style={{
              padding: 36,
              borderRadius: 32,
              background: "#ffffff",
              boxShadow: "0 30px 60px rgba(15, 23, 42, 0.08)",
              border: "1px solid rgba(15, 23, 42, 0.06)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-flex",
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "rgba(79, 70, 229, 0.08)",
                  color: "#4f46e5",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.12em",
                }}
              >
                BEST VALUE
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 42,
                  lineHeight: 1,
                  color: "#111827",
                }}
              >
                ₹{PREMIUM_PACKAGE.amount}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: 16,
                }}
              >
                for {PREMIUM_PACKAGE.premiumDays} days of premium access
              </p>
            </div>

            <p
              style={{
                marginTop: 24,
                color: "#4b5563",
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              Full premium access gives you AI study notes, smart practice
              plans, revision help, and personalized guidance across your
              subjects.
            </p>

            <button
              onClick={handleBuyPremium}
              disabled={isBuying}
              style={{
                marginTop: 28,
                width: "100%",
                padding: "18px 24px",
                borderRadius: 18,
                border: "none",
                cursor: isBuying ? "not-allowed" : "pointer",
                background: "#4d3fff",
                color: "#ffffff",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {isBuying ? "Starting checkout…" : "Buy Premium for ₹14"}
            </button>
          </div>

          <div
            style={{
              padding: 32,
              borderRadius: 28,
              background: "#f8fafc",
              border: "1px solid rgba(148, 163, 184, 0.15)",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 24,
                color: "#111827",
              }}
            >
              New account bonus
            </h3>
            <p
              style={{
                marginTop: 14,
                color: "#4b5563",
                fontSize: 16,
                lineHeight: 1.75,
              }}
            >
              If you created your account today, you can call the special
              today-only route to see your eligibility.
            </p>
            <button
              onClick={handleCheckTodayOffer}
              disabled={isCheckingOffer}
              style={{
                marginTop: 18,
                padding: "14px 22px",
                borderRadius: 16,
                border: "1px solid rgba(77,63,255,0.18)",
                background: "#ffffff",
                color: "#1f2937",
                fontWeight: 700,
                cursor: isCheckingOffer ? "not-allowed" : "pointer",
              }}
            >
              {isCheckingOffer ? "Checking…" : "Check today-only offer"}
            </button>
            {todayOfferMessage && (
              <p
                style={{
                  marginTop: 18,
                  color: "#047857",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                {todayOfferMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
