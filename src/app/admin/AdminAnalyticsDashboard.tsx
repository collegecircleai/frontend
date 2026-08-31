"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  Activity,
  ArrowUpRight,
  Brain,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Gauge,
  Lock,
  RefreshCcw,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  PieChart as PieIcon,
  MessageSquareText,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Pie,
  PieChart,
  ReferenceArea,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OverviewResponse = {
  window: { days: number; from: string; to: string };
  registered: { today: number; week: number; month: number };
  active: { today: number; week: number; month: number };
  dauSeries: Array<{ date: string; activeUsers: number }>;
  dau: number;
  wau: number;
  mau: number;
  stickiness: number;
  activation: {
    definition: string;
    signedUp: number;
    activated: number;
    rate: number;
  };
};

type BehaviourResponse = {
  window: { days: number; from: string; to: string };
  sessionDurationSeconds: {
    p25: number | null;
    median: number | null;
    p75: number | null;
    sampleSize: number;
  };
  sessionsPerActiveUser: number;
  questionsPerSession: number;
  topicsPerUser: number;
  followUpRate: number;
  featureUsage: Array<{
    feature: string;
    events: number;
    users: number;
    share: number;
  }>;
};

type RetentionResponse = {
  window: { days: number; from: string; to: string };
  windowDays: number;
  day7: { cohortSize: number; returned: number; rate: number };
  day30: { cohortSize: number; returned: number; rate: number };
  returningUserRate: {
    activeUsers: number;
    returningUsers: number;
    rate: number;
  };
};

type FunnelResponse = {
  window: { days: number; from: string; to: string };
  stages: Array<{
    stage: number;
    key: string;
    label: string;
    users: number;
    conversionFromPrevious: number;
    conversionFromStart: number;
  }>;
};

type AiUsageResponse = {
  window: { days: number; from: string; to: string };
  medianResponseLatencySeconds: number | null;
  responseLatencySampleSize: number;
  helpfulness: {
    definition: string;
    rated: number;
    helpful: number;
    rate: number;
  };
  topicCoverage: {
    topicsOpened: number;
    topicsAsked: number;
    rate: number;
  };
  mostAskedTopics: Array<{
    topic: string;
    topicId: string;
    courseId: string;
    questions: number;
    users: number;
  }>;
};

type CoursesTopicsResponse = {
  window: { days: number; from: string; to: string };
  mostStudiedSubjects: Array<{
    subject: string;
    events: number;
    users: number;
    share: number;
  }>;
  mostOpenedTopics: Array<{
    topic: string;
    topicId: string;
    opens: number;
    users: number;
  }>;
  mostAskedTopics: Array<{
    topic: string;
    topicId: string;
    questions: number;
    users: number;
  }>;
};

type FeedbackRow = {
  eventId: string;
  userId: string;
  userName: string;
  eventName: string;
  submittedAt: string;
  text: string;
  usefulScore: number | null;
  understandScore: number | null;
  npsScore: number | null;
};

type FeedbackResponse = {
  window: { days: number; from: string; to: string };
  understandScore: { average: number | null; responses: number };
  nps: {
    score: number | null;
    promoters: number;
    passives: number;
    detractors: number;
    responses: number;
  };
  featurePreference: Array<{ feature: string; events: number }>;
  feedback: FeedbackRow[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

type MetricsState = {
  overview: OverviewResponse | null;
  behaviour: BehaviourResponse | null;
  retention: RetentionResponse | null;
  funnel: FunnelResponse | null;
  aiUsage: AiUsageResponse | null;
  coursesTopics: CoursesTopicsResponse | null;
  feedback: FeedbackResponse | null;
};

type TabKey =
  | "overview"
  | "behaviour"
  | "funnel"
  | "ai"
  | "topics"
  | "feedback";

const WINDOW_DAYS = 30;
const FEEDBACK_LIMIT = 8;

const COLORS = {
  bg: "#0D0C1D",
  panel: "#14122A",
  card: "#1A1830",
  border: "rgba(255,255,255,0.08)",
  text: "#F4F2FF",
  muted: "#A4A0C3",
  violet: "#4D3FFF",
  violetSoft: "#7B70FF",
  jade: "#00C896",
  amber: "#F5A623",
  rose: "#FF6A7A",
  slate: "#B4AFD6",
};

const TAB_ORDER: Array<{ key: TabKey; label: string; icon: React.ElementType }> =
  [
    { key: "overview", label: "Overview", icon: Gauge },
    { key: "behaviour", label: "Student Behaviour", icon: Activity },
    { key: "funnel", label: "Funnel", icon: TrendingUp },
    { key: "ai", label: "AI Usage", icon: Brain },
    { key: "topics", label: "Courses & Topics", icon: BookOpen },
    { key: "feedback", label: "Feedback & Research", icon: MessageSquareText },
  ];

const defaultState: MetricsState = {
  overview: null,
  behaviour: null,
  retention: null,
  funnel: null,
  aiUsage: null,
  coursesTopics: null,
  feedback: null,
};

function unwrap<T>(response: any): T {
  return (response?.data?.data ?? response?.data ?? response) as T;
}

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

function formatDuration(seconds: number | null | undefined) {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return "—";
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainder = total % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainder}s`;
  return `${remainder}s`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function shortLabel(label: string) {
  const trimmed = label.trim();
  if (trimmed.length <= 32) return trimmed;
  return `${trimmed.slice(0, 29)}…`;
}

function compactId(value: string) {
  if (!value) return "—";
  if (value.length <= 18) return value;
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 24,
        padding: 24,
        boxShadow: "0 18px 48px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              lineHeight: 1.1,
              color: COLORS.text,
              margin: 0,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                marginTop: 8,
                color: COLORS.muted,
                fontFamily: "var(--font-body)",
                fontSize: 14,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = COLORS.violet,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        padding: 18,
        minHeight: 130,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 28,
              lineHeight: 1,
              color: COLORS.text,
              marginTop: 12,
            }}
          >
            {value}
          </div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            background: `${accent}1A`,
            color: accent,
            flexShrink: 0,
          }}
        >
          <Icon size={18} />
        </div>
      </div>
      {hint && (
        <div
          style={{
            marginTop: 12,
            color: COLORS.muted,
            fontFamily: "var(--font-body)",
            fontSize: 13,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#101022",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "10px 12px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: COLORS.slate,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {payload.map((entry: any) => (
        <div
          key={`${entry.dataKey}-${entry.name}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: COLORS.text,
            marginTop: 4,
          }}
        >
          <span>{entry.name ?? entry.dataKey}</span>
          <span>{typeof entry.value === "number" ? formatNumber(entry.value) : String(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeaderBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        border: `1px solid ${COLORS.border}`,
        background: "rgba(255,255,255,0.03)",
        color: COLORS.muted,
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function RangePoint({
  cx,
  cy,
  payload,
}: {
  cx?: number;
  cy?: number;
  payload?: { kind?: string };
}) {
  if (cx === undefined || cy === undefined) return null;
  const kind = payload?.kind;
  const isMedian = kind === "median";
  const fill =
    kind === "range" ? COLORS.violetSoft : isMedian ? COLORS.jade : COLORS.violet;
  const radius = isMedian ? 7 : 5;
  return <circle cx={cx} cy={cy} r={radius} fill={fill} stroke="#fff" strokeWidth={1.5} />;
}

export default function AdminAnalyticsDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [metrics, setMetrics] = useState<MetricsState>(defaultState);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const didInitRef = useRef(false);

  const isAdmin = user?.role === "admin";
  const feedbackMeta = metrics.feedback?.meta;
  const overview = metrics.overview;
  const behaviour = metrics.behaviour;
  const retention = metrics.retention;
  const funnel = metrics.funnel;
  const aiUsage = metrics.aiUsage;
  const coursesTopics = metrics.coursesTopics;
  const feedback = metrics.feedback;

  const activeFunnelIndex = useMemo(() => {
    if (!funnel?.stages?.length) return -1;
    let biggestDrop = -1;
    let biggestIndex = -1;
    funnel.stages.forEach((stage, index) => {
      if (index === 0) return;
      const prev = funnel.stages[index - 1]?.users || 0;
      const drop = Math.max(prev - stage.users, 0);
      if (drop > biggestDrop) {
        biggestDrop = drop;
        biggestIndex = index;
      }
    });
    return biggestIndex;
  }, [funnel]);

  const openFeedbackRows = feedback?.feedback ?? [];

  async function requestJson<T>(path: string, params?: Record<string, unknown>) {
    const response = await api.get(path, { params });
    return unwrap<T>(response);
  }

  async function loadAllMetrics(page = feedbackPage) {
    try {
      setLoading(true);
      setError(null);
      const seed = refreshTick;
      const shared = { days: WINDOW_DAYS, seed };
      const [
        overviewRes,
        behaviourRes,
        retentionRes,
        funnelRes,
        aiUsageRes,
        coursesTopicsRes,
        feedbackRes,
      ] = await Promise.allSettled([
        requestJson<OverviewResponse>("/admin/metrics/overview", shared),
        requestJson<BehaviourResponse>("/admin/metrics/behaviour", shared),
        requestJson<RetentionResponse>("/admin/metrics/retention", shared),
        requestJson<FunnelResponse>("/admin/metrics/funnel", shared),
        requestJson<AiUsageResponse>("/admin/metrics/ai-usage", shared),
        requestJson<CoursesTopicsResponse>("/admin/metrics/courses-topics", shared),
        requestJson<FeedbackResponse>("/admin/metrics/feedback", {
          ...shared,
          page,
          limit: FEEDBACK_LIMIT,
        }),
      ]);

      const nextState: MetricsState = {
        overview:
          overviewRes.status === "fulfilled" ? overviewRes.value : null,
        behaviour:
          behaviourRes.status === "fulfilled" ? behaviourRes.value : null,
        retention:
          retentionRes.status === "fulfilled" ? retentionRes.value : null,
        funnel: funnelRes.status === "fulfilled" ? funnelRes.value : null,
        aiUsage:
          aiUsageRes.status === "fulfilled" ? aiUsageRes.value : null,
        coursesTopics:
          coursesTopicsRes.status === "fulfilled" ? coursesTopicsRes.value : null,
        feedback:
          feedbackRes.status === "fulfilled" ? feedbackRes.value : null,
      };

      setMetrics(nextState);

      const rejected = [
        overviewRes,
        behaviourRes,
        retentionRes,
        funnelRes,
        aiUsageRes,
        coursesTopicsRes,
        feedbackRes,
      ].filter((item) => item.status === "rejected");

      if (rejected.length > 0) {
        setError("Some metrics could not be loaded. Showing the data that did arrive.");
      }
    } catch (err) {
      setError("The admin metrics dashboard could not be loaded.");
    } finally {
      setLoading(false);
      didInitRef.current = true;
    }
  }

  async function loadFeedbackPage(page: number) {
    try {
      setFeedbackLoading(true);
      const data = await requestJson<FeedbackResponse>("/admin/metrics/feedback", {
        days: WINDOW_DAYS,
        page,
        limit: FEEDBACK_LIMIT,
        seed: refreshTick,
      });
      setMetrics((current) => ({ ...current, feedback: data }));
    } finally {
      setFeedbackLoading(false);
    }
  }

  useEffect(() => {
    void loadAllMetrics(feedbackPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTick]);

  useEffect(() => {
    if (!didInitRef.current) return;
    void loadFeedbackPage(feedbackPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackPage]);

  const handleRefresh = () => {
    setRefreshTick((value) => value + 1);
  };

  const downloadCsv = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const baseUrl = api.defaults.baseURL ?? "/api";
    const response = await fetch(
      `${baseUrl}/admin/metrics/feedback/export.csv?days=${WINDOW_DAYS}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `feedback-${WINDOW_DAYS}d.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 560,
            width: "100%",
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 24,
            padding: 28,
            color: COLORS.text,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                background: `${COLORS.rose}1A`,
                color: COLORS.rose,
              }}
            >
              <Lock size={18} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  lineHeight: 1.1,
                }}
              >
                Admin access required
              </div>
              <div style={{ marginTop: 8, color: COLORS.muted }}>
                This dashboard is available only to admin accounts.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !overview && !behaviour && !funnel && !aiUsage && !coursesTopics && !feedback) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          display: "grid",
          placeItems: "center",
          color: COLORS.text,
          fontFamily: "var(--font-mono)",
        }}
      >
        Loading admin metrics…
      </div>
    );
  }

  const funnelData =
    funnel?.stages.map((stage, index) => ({
      ...stage,
      fill:
        index === activeFunnelIndex
          ? COLORS.rose
          : index === 0
            ? COLORS.violet
            : index === funnel.stages.length - 1
              ? COLORS.jade
              : COLORS.violetSoft,
    })) ?? [];

  const daiSeries = overview?.dauSeries ?? [];
  const sessionRange = behaviour?.sessionDurationSeconds;
  const sessionRangeData = [
    { kind: "range", x: sessionRange?.p25 ?? 0, y: 0.5, label: "P25" },
    { kind: "median", x: sessionRange?.median ?? 0, y: 0.5, label: "Median" },
    { kind: "range", x: sessionRange?.p75 ?? 0, y: 0.5, label: "P75" },
  ];
  const maxSession = Math.max(
    60,
    sessionRange?.p75 ?? 0,
    sessionRange?.median ?? 0,
    sessionRange?.p25 ?? 0,
  );

  const feedbackPages = useMemo(() => {
    const total = feedbackMeta?.totalPages ?? 1;
    const current = feedbackMeta?.page ?? feedbackPage;
    const pages: number[] = [];
    for (let i = Math.max(1, current - 1); i <= Math.min(total, current + 1); i++) {
      pages.push(i);
    }
    return pages;
  }, [feedbackMeta?.page, feedbackMeta?.totalPages, feedbackPage]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 20% 0%, rgba(77,63,255,0.18), transparent 30%),
          radial-gradient(circle at 80% 10%, rgba(0,200,150,0.12), transparent 28%),
          linear-gradient(180deg, #0D0C1D 0%, #0B0A18 100%)
        `,
        color: COLORS.text,
        padding: 28,
      }}
    >
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <SectionHeaderBadge>
                <Shield size={12} />
                Admin metrics
              </SectionHeaderBadge>
              <SectionHeaderBadge>
                <CalendarDays size={12} />
                Last {overview?.window.days ?? WINDOW_DAYS} days
              </SectionHeaderBadge>
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              Student analytics
            </h1>
            <p
              style={{
                marginTop: 14,
                maxWidth: 760,
                color: COLORS.muted,
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              Admin-only visibility over activation, retention, student behaviour,
              AI usage, course/topic demand, and open feedback.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleRefresh}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.panel,
                color: COLORS.text,
                borderRadius: 14,
                padding: "12px 16px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              <RefreshCcw size={15} />
              Refresh
            </button>
            <button
              onClick={() => void downloadCsv()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                background: COLORS.violet,
                color: "#fff",
                borderRadius: 14,
                padding: "12px 16px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </header>

        {error && (
          <div
            style={{
              marginBottom: 18,
              padding: "12px 14px",
              borderRadius: 14,
              border: `1px solid ${COLORS.border}`,
              background: "rgba(255,106,122,0.08)",
              color: COLORS.text,
              fontFamily: "var(--font-body)",
            }}
          >
            {error}
          </div>
        )}

        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 24,
            padding: 8,
            borderRadius: 18,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {TAB_ORDER.map((tab) => {
            const active = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: active ? "none" : `1px solid ${COLORS.border}`,
                  background: active ? COLORS.violet : "transparent",
                  color: active ? "#fff" : COLORS.text,
                  borderRadius: 14,
                  padding: "12px 14px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  boxShadow: active ? "0 12px 28px rgba(77,63,255,0.22)" : "none",
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === "overview" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              <MetricCard
                label="Registered today"
                value={formatNumber(overview?.registered.today)}
                hint="New student signups since midnight."
                icon={Users}
                accent={COLORS.violet}
              />
              <MetricCard
                label="Registered week"
                value={formatNumber(overview?.registered.week)}
                hint="New student signups over the rolling 7-day window."
                icon={Users}
                accent={COLORS.violetSoft}
              />
              <MetricCard
                label="Registered month"
                value={formatNumber(overview?.registered.month)}
                hint="New student signups over the rolling 30-day window."
                icon={Users}
                accent={COLORS.jade}
              />
              <MetricCard
                label="Active today"
                value={formatNumber(overview?.active.today)}
                hint="Distinct active users in the last 24 hours."
                icon={Activity}
                accent={COLORS.jade}
              />
              <MetricCard
                label="Active week"
                value={formatNumber(overview?.active.week)}
                hint="Distinct active users in the last 7 days."
                icon={Activity}
                accent={COLORS.violet}
              />
              <MetricCard
                label="Active month"
                value={formatNumber(overview?.active.month)}
                hint="Distinct active users in the last 30 days."
                icon={Activity}
                accent={COLORS.violetSoft}
              />
              <MetricCard
                label="Activation rate"
                value={formatPercent(overview?.activation.rate)}
                hint={`${formatNumber(overview?.activation.activated)} of ${formatNumber(overview?.activation.signedUp)} signups asked an AI question.`}
                icon={Sparkles}
                accent={COLORS.amber}
              />
              <MetricCard
                label="Stickiness"
                value={formatPercent(overview?.stickiness)}
                hint="DAU divided by MAU."
                icon={Gauge}
                accent={COLORS.rose}
              />
              <MetricCard
                label="7-day retention"
                value={formatPercent(retention?.day7.rate)}
                hint="Rolling cohort return rate after one week."
                icon={ArrowUpRight}
                accent={COLORS.jade}
              />
              <MetricCard
                label="30-day retention"
                value={formatPercent(retention?.day30.rate)}
                hint="Rolling cohort return rate after one month."
                icon={ArrowUpRight}
                accent={COLORS.violet}
              />
            </div>

            <SectionCard
              title="DAU trend"
              subtitle="Distinct active users over time. The series comes from the backend /overview aggregation."
            >
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <AreaChart data={daiSeries}>
                    <defs>
                      <linearGradient id="dauFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.violet} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={COLORS.violet} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatShortDate}
                      stroke={COLORS.muted}
                      tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                    />
                    <YAxis
                      stroke={COLORS.muted}
                      tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      name="Active users"
                      stroke={COLORS.jade}
                      fill="url(#dauFill)"
                      strokeWidth={2.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "behaviour" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 16,
              }}
            >
              <MetricCard
                label="Sessions / user"
                value={formatNumber(behaviour?.sessionsPerActiveUser)}
                hint="Sessions divided by active users in the window."
                icon={Activity}
                accent={COLORS.violet}
              />
              <MetricCard
                label="Questions / session"
                value={formatNumber(behaviour?.questionsPerSession)}
                hint="AI questions per study session."
                icon={Brain}
                accent={COLORS.jade}
              />
              <MetricCard
                label="Topics / user"
                value={formatNumber(behaviour?.topicsPerUser)}
                hint="Distinct topic interactions per active user."
                icon={BookOpen}
                accent={COLORS.violetSoft}
              />
              <MetricCard
                label="Follow-up rate"
                value={formatPercent(behaviour?.followUpRate)}
                hint="Follow-up questions as a share of AI questions."
                icon={TrendingUp}
                accent={COLORS.amber}
              />
            </div>

            <SectionCard
              title="Session duration range"
              subtitle="Median plus p25/p75 band. The shaded band is the interquartile range."
            >
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <ScatterChart margin={{ left: 8, right: 24, top: 18, bottom: 12 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      type="number"
                      dataKey="x"
                      domain={[0, maxSession * 1.1]}
                      tickFormatter={formatDuration}
                      stroke={COLORS.muted}
                      tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                    />
                    <YAxis type="number" dataKey="y" domain={[0, 1]} hide />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const point = payload[0]?.payload;
                        return (
                          <div
                            style={{
                              background: "#101022",
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: 14,
                              padding: "10px 12px",
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "var(--font-body)",
                                color: COLORS.text,
                                marginBottom: 4,
                              }}
                            >
                              {point?.label}
                            </div>
                            <div
                              style={{
                                fontFamily: "var(--font-mono)",
                                color: COLORS.slate,
                                fontSize: 12,
                              }}
                            >
                              {formatDuration(point?.x)}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <ReferenceArea
                      x1={sessionRange?.p25 ?? 0}
                      x2={sessionRange?.p75 ?? 0}
                      y1={0}
                      y2={1}
                      fill={COLORS.violet}
                      fillOpacity={0.18}
                    />
                    <Scatter
                      data={sessionRangeData}
                      shape={<RangePoint />}
                      name="Session duration"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  marginTop: 18,
                }}
              >
                <MetricCard
                  label="P25"
                  value={formatDuration(sessionRange?.p25)}
                  hint="25th percentile session duration."
                  icon={ChevronLeft}
                  accent={COLORS.violetSoft}
                />
                <MetricCard
                  label="Median"
                  value={formatDuration(sessionRange?.median)}
                  hint="Typical session duration."
                  icon={Gauge}
                  accent={COLORS.jade}
                />
                <MetricCard
                  label="P75"
                  value={formatDuration(sessionRange?.p75)}
                  hint="75th percentile session duration."
                  icon={ChevronRight}
                  accent={COLORS.violet}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Feature usage distribution"
              subtitle="Events by feature across the selected window."
            >
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={behaviour?.featureUsage ?? []} layout="vertical">
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                    <XAxis type="number" stroke={COLORS.muted} tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      width={110}
                      stroke={COLORS.muted}
                      tick={{ fontFamily: "var(--font-body)", fontSize: 12 }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="events" name="Events" radius={[0, 10, 10, 0]}>
                      {(behaviour?.featureUsage ?? []).map((entry, index) => (
                        <Cell
                          key={entry.feature}
                          fill={index % 2 === 0 ? COLORS.violet : COLORS.jade}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "funnel" && (
          <div style={{ display: "grid", gap: 20 }}>
            <SectionCard
              title="7-stage funnel"
              subtitle="Signup → login → upload → parsed → subject opened → first activity → 7-day return."
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(280px, 1.2fr) minmax(280px, 0.8fr)",
                  gap: 18,
                }}
              >
                <div style={{ width: "100%", height: 360 }}>
                  <ResponsiveContainer>
                    <FunnelChart>
                      <Tooltip content={<ChartTooltip />} />
                      <Funnel
                        dataKey="users"
                        data={funnelData}
                        isAnimationActive={false}
                      >
                        <LabelList
                          position="right"
                          fill={COLORS.text}
                          stroke="none"
                          dataKey="label"
                        />
                        {funnelData.map((entry, index) => (
                          <Cell key={entry.key} fill={entry.fill} />
                        ))}
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  {funnel?.stages.map((stage, index) => {
                    const prev = funnel.stages[index - 1]?.users ?? stage.users;
                    const drop = index === 0 ? 0 : Math.max(prev - stage.users, 0);
                    const biggest = index === activeFunnelIndex;
                    return (
                      <div
                        key={stage.key}
                        style={{
                          padding: 14,
                          borderRadius: 16,
                          border: `1px solid ${biggest ? COLORS.rose : COLORS.border}`,
                          background: biggest ? "rgba(255,106,122,0.08)" : "rgba(255,255,255,0.03)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <div>
                            <div
                              style={{
                                fontFamily: "var(--font-body)",
                                color: COLORS.text,
                                fontWeight: 600,
                              }}
                            >
                              {stage.stage}. {stage.label}
                            </div>
                            <div
                              style={{
                                marginTop: 6,
                                fontFamily: "var(--font-mono)",
                                color: COLORS.muted,
                                fontSize: 11,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                              }}
                            >
                              {formatNumber(stage.users)} users
                            </div>
                          </div>
                          <div
                            style={{
                              textAlign: "right",
                              fontFamily: "var(--font-mono)",
                              color: biggest ? COLORS.rose : COLORS.jade,
                              fontSize: 12,
                            }}
                          >
                            {index === 0 ? "start" : `-${formatNumber(drop)} drop`}
                            <br />
                            {index === 0 ? "100%" : `${(stage.conversionFromPrevious * 100).toFixed(1)}% from prev`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "ai" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 16,
              }}
            >
              <MetricCard
                label="Total questions"
                value={formatNumber(aiUsage?.helpfulness.rated)}
                hint="Responses rated for helpfulness."
                icon={Brain}
                accent={COLORS.violet}
              />
              <MetricCard
                label="Questions / session"
                value={formatNumber(behaviour?.questionsPerSession)}
                hint="AI questions per active session."
                icon={Activity}
                accent={COLORS.jade}
              />
              <MetricCard
                label="Follow-up rate"
                value={formatPercent(behaviour?.followUpRate)}
                hint="Follow-up question share."
                icon={TrendingUp}
                accent={COLORS.amber}
              />
              <MetricCard
                label="Helpfulness rate"
                value={formatPercent(aiUsage?.helpfulness.rate)}
                hint="Useful-score threshold defined by the backend."
                icon={Sparkles}
                accent={COLORS.jade}
              />
              <MetricCard
                label="Median response latency"
                value={formatDuration(aiUsage?.medianResponseLatencySeconds)}
                hint={
                  aiUsage?.responseLatencySampleSize
                    ? `${formatNumber(aiUsage.responseLatencySampleSize)} sampled responses`
                    : "No stored latency sample yet."
                }
                icon={Shield}
                accent={COLORS.violetSoft}
              />
            </div>

            <SectionCard
              title="Most asked topics"
              subtitle="Topics ranked by AI questions in the window."
            >
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={aiUsage?.mostAskedTopics ?? []} layout="vertical">
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                    <XAxis type="number" stroke={COLORS.muted} tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="topic"
                      width={180}
                      stroke={COLORS.muted}
                      tick={{ fontFamily: "var(--font-body)", fontSize: 12 }}
                      tickFormatter={shortLabel}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="questions" name="Questions" radius={[0, 10, 10, 0]} fill={COLORS.violet} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "topics" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              <MetricCard
                label="Topic coverage"
                value={formatPercent(aiUsage?.topicCoverage.rate)}
                hint="AI-question topics divided by opened topics."
                icon={PieIcon}
                accent={COLORS.jade}
              />
              <MetricCard
                label="Opened topics"
                value={formatNumber(aiUsage?.topicCoverage.topicsOpened)}
                hint="Unique topics opened in the window."
                icon={BookOpen}
                accent={COLORS.violet}
              />
              <MetricCard
                label="AI-question topics"
                value={formatNumber(aiUsage?.topicCoverage.topicsAsked)}
                hint="Unique topics where students asked the AI a question."
                icon={Brain}
                accent={COLORS.violetSoft}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 20,
              }}
            >
              <SectionCard
                title="Most-studied subjects"
                subtitle="Course-level aggregate based on learning events with a course id."
              >
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={coursesTopics?.mostStudiedSubjects ?? []} layout="vertical">
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                      <XAxis type="number" stroke={COLORS.muted} tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="subject"
                        width={180}
                        stroke={COLORS.muted}
                        tick={{ fontFamily: "var(--font-body)", fontSize: 12 }}
                        tickFormatter={shortLabel}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="events" name="Events" radius={[0, 10, 10, 0]} fill={COLORS.violet} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard
                title="Most-opened topics"
                subtitle="Topics opened most often by students."
              >
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={coursesTopics?.mostOpenedTopics ?? []} layout="vertical">
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                      <XAxis type="number" stroke={COLORS.muted} tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="topic"
                        width={180}
                        stroke={COLORS.muted}
                        tick={{ fontFamily: "var(--font-body)", fontSize: 12 }}
                        tickFormatter={shortLabel}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="opens" name="Opens" radius={[0, 10, 10, 0]} fill={COLORS.jade} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard
                title="AI-heavy topics"
                subtitle="Topics with the most AI questions, used as a difficulty proxy."
              >
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={coursesTopics?.mostAskedTopics ?? []} layout="vertical">
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                      <XAxis type="number" stroke={COLORS.muted} tick={{ fontFamily: "var(--font-mono)", fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="topic"
                        width={180}
                        stroke={COLORS.muted}
                        tick={{ fontFamily: "var(--font-body)", fontSize: 12 }}
                        tickFormatter={shortLabel}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="questions" name="Questions" radius={[0, 10, 10, 0]} fill={COLORS.rose} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              <MetricCard
                label="Understanding score"
                value={
                  feedback?.understandScore.average === null
                    ? "—"
                    : feedback?.understandScore.average?.toFixed(2) ?? "—"
                }
                hint={`${formatNumber(feedback?.understandScore.responses)} responses`}
                icon={Brain}
                accent={COLORS.violet}
              />
              <MetricCard
                label="NPS"
                value={feedback?.nps.score === null ? "—" : formatNumber(feedback?.nps.score)}
                hint={`${formatNumber(feedback?.nps.promoters)} promoters • ${formatNumber(feedback?.nps.detractors)} detractors`}
                icon={Sparkles}
                accent={COLORS.jade}
              />
              <MetricCard
                label="Open feedback"
                value={formatNumber(feedback?.meta.total)}
                hint="Rows returned by the paginated feedback endpoint."
                icon={MessageSquareText}
                accent={COLORS.violetSoft}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(280px, 0.8fr) minmax(320px, 1.2fr)",
                gap: 20,
              }}
            >
              <SectionCard
                title="Feature preference distribution"
                subtitle="Counts by feature extracted from learning events."
              >
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Tooltip content={<ChartTooltip />} />
                      <Pie
                        data={feedback?.featurePreference ?? []}
                        dataKey="events"
                        nameKey="feature"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                      >
                        {(feedback?.featurePreference ?? []).map((entry, index) => (
                          <Cell
                            key={entry.feature}
                            fill={[
                              COLORS.violet,
                              COLORS.jade,
                              COLORS.rose,
                              COLORS.amber,
                              COLORS.violetSoft,
                            ][index % 5]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard
                title="Open feedback"
                subtitle="Paginated raw feedback pulled from /feedback."
                action={
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => setFeedbackPage((page) => Math.max(1, page - 1))}
                      disabled={!feedbackMeta?.hasPrev || feedbackLoading}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        border: `1px solid ${COLORS.border}`,
                        background: "transparent",
                        color: COLORS.text,
                        cursor: feedbackMeta?.hasPrev ? "pointer" : "not-allowed",
                      }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <div style={{ display: "flex", gap: 6 }}>
                      {feedbackPages.map((page) => (
                        <button
                          key={page}
                          onClick={() => setFeedbackPage(page)}
                          style={{
                            minWidth: 36,
                            height: 36,
                            borderRadius: 12,
                            border: page === (feedbackMeta?.page ?? feedbackPage)
                              ? "none"
                              : `1px solid ${COLORS.border}`,
                            background:
                              page === (feedbackMeta?.page ?? feedbackPage)
                                ? COLORS.violet
                                : "transparent",
                            color: COLORS.text,
                            cursor: "pointer",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setFeedbackPage((page) => page + 1)}
                      disabled={!feedbackMeta?.hasNext || feedbackLoading}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        border: `1px solid ${COLORS.border}`,
                        background: "transparent",
                        color: COLORS.text,
                        cursor: feedbackMeta?.hasNext ? "pointer" : "not-allowed",
                      }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                }
              >
                <div style={{ display: "grid", gap: 12 }}>
                  {(feedbackLoading ? [] : openFeedbackRows).map((row) => (
                    <article
                      key={row.eventId}
                      style={{
                        padding: 14,
                        borderRadius: 16,
                        border: `1px solid ${COLORS.border}`,
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 16,
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: "var(--font-body)", color: COLORS.text, fontWeight: 600 }}>
                            {row.userName}
                          </div>
                          <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 11, color: COLORS.muted }}>
                            {row.eventName} • {formatDateTime(row.submittedAt)}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <span style={{ fontFamily: "var(--font-mono)", color: COLORS.jade, fontSize: 11 }}>
                            understand {row.understandScore ?? "—"}
                          </span>
                          <span style={{ fontFamily: "var(--font-mono)", color: COLORS.violetSoft, fontSize: 11 }}>
                            nps {row.npsScore ?? "—"}
                          </span>
                        </div>
                      </div>
                      <p
                        style={{
                          marginTop: 12,
                          color: COLORS.text,
                          fontFamily: "var(--font-body)",
                          lineHeight: 1.6,
                        }}
                      >
                        {row.text}
                      </p>
                    </article>
                  ))}

                  {!feedbackLoading && openFeedbackRows.length === 0 && (
                    <div
                      style={{
                        padding: 18,
                        borderRadius: 16,
                        border: `1px dashed ${COLORS.border}`,
                        color: COLORS.muted,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      No open feedback in this window.
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
