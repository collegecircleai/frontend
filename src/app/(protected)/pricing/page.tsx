"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Zap, Sparkles, Award } from "lucide-react";
import api, { getFriendlyErrorMessage } from "@/lib/api";
import Script from "next/script";

/* ── Design tokens (enforced CC·AI dark palette) ── */
const C = {
  bg: "#0D0C1D",
  card: "#14122A",
  cardHi: "#1A1830",
  border: "rgba(139,132,255,0.14)",
  violet: "#4D3FFF",
  violetLight: "#7B70FF",
  jade: "#00C896",
  ink: "#FFFFFF",
  mist: "#A9A7C8",
  faint: "#6E6C93",
};
const FONT = {
  display: "'Playfair Display', serif",
  body: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

/* ── Backend-mapped shape ── */
interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number | null;
  premiumDays: number;
}
interface Topup {
  id: string;
  name: string;
  price: number;
  accessHours: number;
}

/* ── Marketing copy (structure/features from the approved Lovable design;
      prices come from the backend, which is the billing source of truth). ── */
const PLAN_COPY: Record<
  string,
  {
    tagline: string;
    description: string;
    features: string[];
    feeling: string;
    cta: string;
    anchorPrice?: number; // struck-through reference price
    mostPopular?: boolean;
    deansCircle?: string[];
  }
> = {
  "survival-pack": {
    tagline: "Your Academic Survival Kit",
    description:
      "Perfect for assignments, internals, last-minute revision, viva prep & PYQ analysis.",
    features: [
      "Full Platform Access",
      "Assignment Maker (up to 4)",
      "Exam Support",
      "Revision Tools",
      "PYQ Intelligence",
      "AI Academic Assistant",
      "Personalized Tests",
      "AI Mentor",
    ],
    feeling: "I can survive this semester.",
    cta: "Get Survival Pack",
  },
  "cgpa-builder": {
    tagline: "For students serious about improving academically.",
    description:
      "Everything in Survival Pack — plus the systems to actually get organized.",
    anchorPrice: 150,
    mostPopular: true,
    features: [
      "Everything in Survival Pack",
      "Personalized Learning Paths (Advanced)",
      "Assignment Maker (Unlimited)",
      "Smart Revision Plans",
      "Productivity Systems",
      "Academic Tracking",
      "Explorer Fellowship Community",
      "Career Guidance",
      "AI Workshops / Projects (free)",
      "Early Feature Access",
    ],
    feeling: "I finally feel organized.",
    cta: "Build my CGPA",
  },
  "topper-list": {
    tagline: "The complete academic growth ecosystem.",
    description:
      "Topper List + Curious Student + Elite Study — merged into one tier.",
    features: [
      "Everything in CGPA Builder",
      "Founder Sessions",
      "Monthly Guidance Call",
      "Premium Badge",
      "Private Student Network",
      "Priority Event Access",
      "Ambassador Network",
      "Leadership Pathway",
      "Premium Workshops",
      "Internship Guidance",
    ],
    deansCircle: ["College Circle AI Physical Patch"],
    feeling: "I'm building my future, not just studying.",
    cta: "Go Elite",
  },
};

const TOPUP_COPY: Record<string, { description: string; uses: string[]; cta: string }> = {
  "quick-boost": {
    description: "Unlimited access for 12 hours.",
    uses: ["Assignment deadlines", "Internal submissions", "Last-minute study sessions"],
    cta: "Activate Quick Boost",
  },
  "assignment-rescue": {
    description: "Unlimited Assignment & PPT generation for 24 hours.",
    uses: ["Assignments", "Reports", "Presentations", "Viva preparation"],
    cta: "Activate Assignment Rescue",
  },
  "exam-rescue": {
    description: "Unlimited revision, PYQ & exam-prep tools for 48 hours.",
    uses: ["Revision Systems", "PYQ Analysis", "Exam Preparation Tools"],
    cta: "Activate Exam Rescue",
  },
};

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [topups, setTopups] = useState<Topup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [buying, setBuying] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPackages = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      // Backend returns { plans:[...], topups:[...] } — the billing source of truth.
      const res = await api.get("/payments/packages");
      const cat = res.data?.data ?? {};
      const p: Plan[] = (Array.isArray(cat.plans) ? cat.plans : []).map((x: any) => ({
        id: x.id,
        name: x.name,
        monthlyPrice: x.monthlyPrice,
        annualPrice: x.annualPrice ?? null,
        premiumDays: x.premiumDays ?? 30,
      }));
      const t: Topup[] = (Array.isArray(cat.topups) ? cat.topups : []).map((x: any) => ({
        id: x.id,
        name: x.name,
        price: x.price,
        accessHours: x.accessHours ?? 24,
      }));
      if (!p.length && !t.length) throw new Error("Empty pricing catalogue");
      setPlans(p);
      setTopups(t);
    } catch (err) {
      console.error("Failed to load pricing catalogue:", err);
      setLoadError(true);
      showToast(getFriendlyErrorMessage(err, "Unable to load pricing right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll the server-confirmed status (set by the Razorpay webhook) rather than
  // trusting the client checkout callback.
  const confirmActivation = async (label: string) => {
    showToast("Payment received. Activating your access…", "success");
    for (let i = 0; i < 8; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const s = await api.get("/payments/status");
        if (s.data?.data?.is_premium) {
          showToast(`Activated — ${label}.`, "success");
          return;
        }
      } catch {
        /* transient, keep polling */
      }
    }
    showToast(
      "Payment received — activation is taking a moment and will reflect shortly.",
      "success",
    );
  };

  const startPayment = async (opts: {
    itemId: string;
    type: "plan" | "topup";
    amount: number;
    billingMode: "monthly" | "yearly";
    name: string;
    successLabel: string;
  }) => {
    setBuying(opts.itemId);
    try {
      // Backend re-validates amount against its catalogue and rejects tampering.
      const orderRes = await api.post("/payments/create-order", {
        amount: opts.amount,
        description: opts.name,
        itemId: opts.itemId,
        type: opts.type,
        billingMode: opts.billingMode,
      });
      const order = orderRes.data?.data;
      if (!order) throw new Error("Order creation failed");

      const rzpOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "College Circle AI",
        description: opts.name,
        order_id: order.orderId,
        handler: async () => confirmActivation(opts.successLabel),
        theme: { color: C.violet },
      };
      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.open();
    } catch (err) {
      console.error("Payment init failed", err);
      showToast(getFriendlyErrorMessage(err, "Failed to start payment. Please try again."));
    } finally {
      setBuying(null);
    }
  };

  /* ── Loading / error ── */
  if (loading) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="spinner" />
      </div>
    );
  }
  if (loadError) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 16, padding: 24, textAlign: "center" }}>
        <p style={{ fontFamily: FONT.body, fontSize: 16, color: C.mist, maxWidth: 420 }}>
          We couldn't load the latest pricing. Please check your connection and try again.
        </p>
        <button onClick={fetchPackages} style={{ padding: "14px 32px", borderRadius: 14, border: "none", background: C.violet, color: "#fff", fontFamily: FONT.body, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 80 }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {toast && (
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 10000, background: toast.type === "error" ? "#FF4D5A" : C.cardHi, color: "#fff", padding: "14px 18px", borderRadius: 14, fontFamily: FONT.body, fontWeight: 600, boxShadow: "0 16px 36px rgba(0,0,0,0.35)", border: `1px solid ${C.border}`, maxWidth: 360 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "32px 20px 0" : "48px 40px 0" }}>
        {/* ── Top bar: eyebrow + skip ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: "0.14em", color: C.violetLight, textTransform: "uppercase" }}>
            Recharge · 2025–26
          </span>
          <button onClick={() => router.push("/dashboard")} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.mist, borderRadius: 999, padding: "8px 18px", fontFamily: FONT.body, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Skip for now
          </button>
        </div>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT.display, fontSize: isMobile ? 34 : 52, fontWeight: 800, color: C.ink, lineHeight: 1.12, marginBottom: 18 }}>
            Pick the plan that <span style={{ color: C.violetLight, fontStyle: "italic" }}>fits your semester.</span>
          </motion.h1>
          <p style={{ fontFamily: FONT.body, fontSize: isMobile ? 15 : 17, color: C.mist, maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>
            Three honest tiers. No credits, no counters. Just the academic support you actually need — when you need it.
          </p>

          {/* Billing toggle */}
          <div style={{ display: "inline-flex", marginTop: 28, background: C.card, borderRadius: 999, padding: 5, border: `1px solid ${C.border}` }}>
            {(["monthly", "yearly"] as const).map((mode) => (
              <button key={mode} onClick={() => setBilling(mode)} style={{ border: "none", cursor: "pointer", padding: "9px 22px", borderRadius: 999, fontFamily: FONT.body, fontSize: 13, fontWeight: 700, color: billing === mode ? "#fff" : C.mist, background: billing === mode ? C.violet : "transparent", transition: "all 0.2s" }}>
                {mode === "monthly" ? "Monthly" : "Yearly"}
                {mode === "yearly" && <span style={{ color: billing === mode ? "#D9FBEF" : C.jade, marginLeft: 6, fontSize: 11 }}>save more</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Plan cards ── */}
        <div id="plans" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 24, alignItems: "stretch", marginBottom: 72 }}>
          {plans.map((plan, idx) => {
            const copy = PLAN_COPY[plan.id];
            if (!copy) return null;
            const yearly = billing === "yearly" && plan.annualPrice != null;
            const shownPrice = yearly ? plan.annualPrice! : plan.monthlyPrice;
            const period = yearly ? "year" : `${plan.premiumDays} days`;
            const highlight = copy.mostPopular;

            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                style={{ position: "relative", background: highlight ? C.cardHi : C.card, borderRadius: 22, padding: isMobile ? 26 : 30, border: highlight ? `1.5px solid ${C.violet}` : `1px solid ${C.border}`, display: "flex", flexDirection: "column", boxShadow: highlight ? "0 20px 50px rgba(77,63,255,0.18)" : "none" }}>

                {highlight && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: C.violet, color: "#fff", fontFamily: FONT.body, fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", padding: "5px 16px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                    <Sparkles size={13} /> Most Popular
                  </div>
                )}

                <div style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.jade, marginBottom: 12 }}>
                  {plan.premiumDays} DAYS
                </div>
                <h3 style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 700, color: C.ink, marginBottom: 6 }}>{plan.name}</h3>
                <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.violetLight, marginBottom: 12, fontWeight: 600 }}>{copy.tagline}</p>
                <p style={{ fontFamily: FONT.body, fontSize: 13.5, color: C.mist, lineHeight: 1.55, marginBottom: 20, minHeight: isMobile ? 0 : 60 }}>{copy.description}</p>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  {!yearly && copy.anchorPrice && (
                    <span style={{ fontFamily: FONT.mono, fontSize: 18, color: C.faint, textDecoration: "line-through" }}>₹{copy.anchorPrice}</span>
                  )}
                  <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 700, color: C.ink }}>₹{shownPrice}</span>
                  <span style={{ fontFamily: FONT.body, fontSize: 13, color: C.mist }}>/ {period}</span>
                </div>
                {plan.annualPrice != null && (
                  <p style={{ fontFamily: FONT.mono, fontSize: 12, color: C.faint, marginBottom: 20 }}>
                    {yearly ? `₹${plan.monthlyPrice} / ${plan.premiumDays} days monthly` : `or ₹${plan.annualPrice} / year`}
                  </p>
                )}
                {plan.annualPrice == null && <div style={{ height: 20 }} />}

                <button onClick={() => startPayment({ itemId: plan.id, type: "plan", amount: shownPrice, billingMode: yearly ? "yearly" : "monthly", name: plan.name, successLabel: `${plan.name} (${period})` })} disabled={buying !== null}
                  style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: highlight ? C.violet : "rgba(139,132,255,0.12)", color: highlight ? "#fff" : C.ink, fontFamily: FONT.body, fontSize: 14.5, fontWeight: 700, cursor: buying ? "not-allowed" : "pointer", marginBottom: 24, transition: "all 0.2s" }}>
                  {buying === plan.id ? "Processing…" : copy.cta}
                </button>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {copy.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                      <Check size={16} color={C.jade} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontFamily: FONT.body, fontSize: 13, color: C.ink, opacity: 0.88, lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                  {copy.deansCircle && (
                    <div style={{ marginTop: 8, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, color: C.jade, fontFamily: FONT.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
                        <Award size={14} /> DEAN'S CIRCLE PERKS
                      </div>
                      {copy.deansCircle.map((d) => (
                        <div key={d} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <Check size={16} color={C.jade} style={{ flexShrink: 0 }} />
                          <span style={{ fontFamily: FONT.body, fontSize: 13, color: C.ink, opacity: 0.88 }}>{d}</span>
                          <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.faint, marginLeft: "auto" }}>Physical</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Student feeling */}
                <div style={{ marginTop: 22, padding: "14px 16px", background: "rgba(0,200,150,0.06)", borderRadius: 12, border: "1px solid rgba(0,200,150,0.15)" }}>
                  <span style={{ fontFamily: FONT.display, fontStyle: "italic", fontSize: 14, color: C.jade }}>"{copy.feeling}"</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Top-ups ── */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.jade, textTransform: "uppercase", marginBottom: 14 }}>
            <Zap size={15} /> Top-ups
          </div>
          <h2 style={{ fontFamily: FONT.display, fontSize: isMobile ? 30 : 40, fontWeight: 800, color: C.ink, marginBottom: 14 }}>
            Instant <span style={{ color: C.violetLight, fontStyle: "italic" }}>boosters.</span>
          </h2>
          <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.mist, maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            No credits. No counters. No complexity. Just unlimited access for a fixed window.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 22 }}>
          {topups.map((t, idx) => {
            const copy = TOPUP_COPY[t.id];
            if (!copy) return null;
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                style={{ background: C.card, borderRadius: 20, padding: 26, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: C.ink }}>{t.name}</h3>
                  <span style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 700, color: C.jade, background: "rgba(0,200,150,0.1)", padding: "4px 10px", borderRadius: 999 }}>{t.accessHours} hours</span>
                </div>
                <div style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 700, color: C.ink, marginBottom: 6 }}>₹{t.price}</div>
                <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.mist, lineHeight: 1.5, marginBottom: 18 }}>{copy.description}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, marginBottom: 20 }}>
                  {copy.uses.map((u) => (
                    <div key={u} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Check size={15} color={C.jade} style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.ink, opacity: 0.85 }}>{u}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => startPayment({ itemId: t.id, type: "topup", amount: t.price, billingMode: "monthly", name: t.name, successLabel: `${t.name} (${t.accessHours}h)` })} disabled={buying !== null}
                  style={{ width: "100%", padding: 13, borderRadius: 12, border: `1px solid ${C.violet}`, background: "transparent", color: C.violetLight, fontFamily: FONT.body, fontSize: 14, fontWeight: 700, cursor: buying ? "not-allowed" : "pointer" }}>
                  {buying === t.id ? "Processing…" : copy.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: 28, fontFamily: FONT.mono, fontSize: 12, color: C.faint, letterSpacing: "0.05em" }}>
          Top-ups stack on top of any plan
        </p>
      </div>
    </div>
  );
}
