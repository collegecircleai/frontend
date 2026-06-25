"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Target,
  Award,
  Flame,
  ArrowRight,
  Brain,
  TrendingUp,
  BarChart3,
  Sliders,
  Save as SaveIcon,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";
import api, { getFriendlyErrorMessage } from "@/lib/api";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface AnalyticsSummary {
  totalTopics: number;
  completedTopics?: number;
  avgScore: number;
  bestUnit: string;
  streak: number;
}

interface WeeklyEntry {
  day: string;
  topicsStudied: number;
  quizzesDone: number;
}

interface ScoreEntry {
  date: string;
  topic: string;
  score: number;
}

interface WeakTopic {
  topic: string;
  unit: string;
  score: number;
  courseId: string;
  topicId: string;
}

interface StrongTopic {
  topic: string;
  unit: string;
  score: number;
  courseId: string;
  topicId: string;
}

interface BloomDatum {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

interface UserPersona {
  label: string;
  summary: string;
  style: string;
  strengths: string[];
  improvementAreas: string[];
}

interface AnalyticsPayload {
  summary?: AnalyticsSummary;
  weekly?: WeeklyEntry[];
  scores?: ScoreEntry[];
  weakTopics?: WeakTopic[];
  strongTopics?: StrongTopic[];
  bloomData?: BloomDatum[];
  courseProgress?: CourseCompletion[];
  persona?: UserPersona | null;
}

interface CourseCompletion {
  courseId: string;
  courseName: string;
  completedTopics: number;
  totalTopics: number;
}

interface PersonalisationSettings {
  audienceLevel?: "beginner" | "intermediate" | "advanced";
  tone?: "friendly" | "formal" | "exam-focused" | "practical";
  requiredLength?: "short" | "medium" | "long" | "very-long";
  examPrep?: boolean;
  vivaPrep?: boolean;
  includePitfalls?: boolean;
  includeFormulaSheets?: boolean;
  moreExamplesNeeded?: boolean;
  personalisedNotes?: string;
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

/** Safe data extraction — never crashes */
function safeGet<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

/** Format backend weekly data into exactly 7 days ending today */
function fillWeeklyData(backendWeekly: WeeklyEntry[]): WeeklyEntry[] {
  const result: WeeklyEntry[] = [];
  const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().slice(0, 10);
    const dayName = daysMap[d.getDay()];
    
    const backendEntry = backendWeekly.find(w => w.day === dayStr || w.day === dayName);
    
    result.push({
      day: dayName,
      topicsStudied: backendEntry ? backendEntry.topicsStudied : 0,
      quizzesDone: backendEntry ? backendEntry.quizzesDone : 0,
    });
  }
  return result;
}


/** Score color based on thresholds */
function scoreColor(score: number): string {
  if (score < 70) return "#EF4444";
  if (score <= 85) return "#F97316";
  return "#00C896";
}

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
function Skeleton({
  w = "100%",
  h = 20,
  r = 8,
}: {
  w?: string | number;
  h?: number;
  r?: number;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        background:
          "linear-gradient(90deg, var(--border-light) 25%, var(--pearl) 50%, var(--border-light) 75%)",
        backgroundSize: "200% 100%",
        animation: "cc-shimmer 1.4s infinite linear",
      }}
    />
  );
}

/* ─────────────────────────────────────────
   STAT CARD (matches dashboard pattern)
───────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon: Icon,
  delay,
  color = "#4D3FFF",
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  delay: number;
  color?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className="cc-stat-card"
      style={{
        background: "var(--deep)",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
        border: "1px solid var(--border-light)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        animationDelay: `${delay}ms`,
        flex: 1,
        minWidth: 140,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--mist)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${color}14`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} color={color} />
        </div>
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: isMobile ? 24 : 28,
          fontWeight: 700,
          color: "var(--ink)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CHART SECTION WRAPPER
───────────────────────────────────────── */
function ChartSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="cc-fade-in"
      style={{
        background: "var(--deep)",
        borderRadius: 16,
        padding: "24px",
        boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
        border: "1px solid var(--border-light)",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {icon}
        <h2
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            fontWeight: 700,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   SCORE BAR (for weak topics)
───────────────────────────────────────── */
function ScoreBar({ score }: { score: number }) {
  const fillColor = scoreColor(score);
  const clampedScore = Math.min(100, Math.max(0, score));

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 12,
        borderRadius: 6,
        overflow: "visible",
      }}
    >
      {/* Background track */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 6,
          background: "rgba(9,9,15,0.06)",
        }}
      />
      {/* Score fill */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: `${clampedScore}%`,
          borderRadius: 6,
          background: fillColor,
          transition: "width 0.8s ease, background 0.3s ease",
        }}
      />
      {/* 70% threshold marker */}
      <div
        style={{
          position: "absolute",
          top: -2,
          bottom: -2,
          left: "70%",
          width: 2,
          background: "#111",
          opacity: 0.25,
          borderRadius: 1,
        }}
        title="70% threshold"
      />
      {/* Score label */}
      <span
        style={{
          position: "absolute",
          right: 0,
          top: -18,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 600,
          color: fillColor,
        }}
      >
        {score}%
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   CUSTOM CHART TOOLTIP
───────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#14122A",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        border: "1px solid rgba(77,63,255,0.2)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </p>
      {payload.map((entry: any, i: number) => (
        <p
          key={i}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: entry.color,
            fontWeight: 600,
          }}
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN ANALYTICS PAGE
───────────────────────────────────────── */
export default function AnalyticsPage() {
  const router = useRouter();

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [weekly, setWeekly] = useState<WeeklyEntry[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [strongTopics, setStrongTopics] = useState<StrongTopic[]>([]);
  const [bloomData, setBloomData] = useState<BloomDatum[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseCompletion[]>([]);
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Personalisation State
  const [personalisation, setPersonalisation] =
    useState<PersonalisationSettings>({});
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const EMPTY_SUMMARY: AnalyticsSummary = {
    totalTopics: 0,
    completedTopics: 0,
    avgScore: 0,
    bestUnit: "—",
    streak: 0,
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/analytics/dashboard");
        const payload = safeGet<AnalyticsPayload>(
          () => response.data?.data ?? response.data,
          {},
        );

        setSummary(payload?.summary ?? EMPTY_SUMMARY);
        setWeekly(fillWeeklyData(Array.isArray(payload?.weekly) ? payload.weekly : []));
        setScores(Array.isArray(payload?.scores) ? payload.scores : []);
        setWeakTopics(Array.isArray(payload?.weakTopics) ? payload.weakTopics : []);
        setStrongTopics(Array.isArray(payload?.strongTopics) ? payload.strongTopics : []);
        setBloomData(Array.isArray(payload?.bloomData) ? payload.bloomData : []);
        setCourseProgress(Array.isArray(payload?.courseProgress) ? payload.courseProgress : []);

        setPersona(payload?.persona ?? null);
      } catch {
        // Fallback to empty if server fails
        setSummary(EMPTY_SUMMARY);
        setWeekly(fillWeeklyData([]));
        setScores([]);
        setWeakTopics([]);
        setCourseProgress([]);
        console.warn("Analytics server unreachable. Loading empty data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPersonalisation = async () => {
      try {
        const res = await api.get("/personalisation");
        if (res.data?.data?.personalisation) {
          setPersonalisation(res.data.data.personalisation);
        }
      } catch (err) {
        console.warn("Failed to fetch personalisation settings:", err);
      }
    };

    fetchAnalytics();
    fetchPersonalisation();
  }, []);

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    setSaveMessage(null);
    try {
      await api.post("/personalisation", { personalisation });
      setSaveMessage({
        type: "success",
        text: "Preferences saved successfully!",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: getFriendlyErrorMessage(err, "Failed to save preferences."),
      });
    } finally {
      setSavingPrefs(false);
    }
  };

  /* ── Skeleton state ── */
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: isMobile ? "24px 20px" : "40px 0",
        }}
      >
        <style>{shimmerCSS}</style>
        <Skeleton h={32} w={isMobile ? "70%" : "35%"} r={10} />
        <Skeleton h={16} w={isMobile ? "50%" : "25%"} r={6} />

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, minWidth: 140 }}>
              <Skeleton h={100} r={16} />
            </div>
          ))}
        </div>
        <Skeleton h={280} r={16} />
        <Skeleton h={240} r={16} />
        <Skeleton h={200} r={16} />
      </div>
    );

  /* ── Error state ── */
  if (error)
    return (
      <div
        style={{
          background: "var(--deep)",
          borderRadius: 20,
          padding: 40,
          textAlign: "center",
          border: "1px solid var(--border-light)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          color: "var(--ink)",
        }}
      >
        <style>{shimmerCSS}</style>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            color: "var(--ink)",
            marginBottom: 8,
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--mist)",
            marginBottom: 24,
          }}
        >
          {error}
        </p>
        <button
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );

  return (
    <>
      <style>{shimmerCSS + analyticsCSS}</style>

      {/* ── HEADER ── */}
      <div
        className="cc-fade-in"
        style={{ marginBottom: 32, padding: isMobile ? "0 4px" : "0" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 26 : 32,
            fontWeight: 800,
            color: "var(--ink)",
            marginBottom: 6,
            letterSpacing: isMobile ? "-0.03em" : "normal",
          }}
        >
          Analytics 📊
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: "var(--mist)",
          }}
        >
          Track your learning journey, identify weak areas, and measure
          progress.
        </p>
      </div>

      {/* ── SECTION 1: Summary Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? 12 : 16,
          marginBottom: 32,
        }}
      >
        <StatCard
          label="Completed Topics"
          value={summary ? String(summary.completedTopics ?? 0) : "—"}
          icon={BookOpen}
          delay={0}
        />
        <StatCard
          label="Avg Score"
          value={summary ? `${summary.avgScore}%` : "—"}
          icon={Target}
          delay={80}
          color="#F5A623"
        />
        <StatCard
          label="Best Unit"
          value={summary?.bestUnit || "—"}
          icon={Award}
          delay={160}
          color="#00C896"
        />
        <StatCard
          label="Study Streak"
          value={summary ? `${summary.streak} days` : "—"}
          icon={Flame}
          delay={240}
          color="#FF4D5A"
        />
      </div>

      {/* ── SECTION 2: Weekly Activity Chart ── */}
      {weekly.length > 0 && (
        <ChartSection
          title="Weekly Activity"
          icon={<BarChart3 size={18} color="#4D3FFF" />}
        >
          <div style={{ width: "100%", height: isMobile ? 200 : 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={weekly} barGap={4} barCategoryGap="20%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-light)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fill: "var(--mist)",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fill: "var(--mist)",
                  }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(77,63,255,0.04)" }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                  }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="topicsStudied"
                  name="Topics Studied"
                  fill="#7B70FF"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="quizzesDone"
                  name="Quizzes Done"
                  fill="#00C896"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      )}

      {/* ── SECTION 3: Score Progress Over Time ── */}
      {scores.length > 0 && (
        <ChartSection
          title="Score Progress"
          icon={<TrendingUp size={18} color="#00C896" />}
        >
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scores}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-light)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fill: "var(--mist)",
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fill: "var(--mist)",
                  }}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  stroke="#00C896"
                  strokeWidth={2.5}
                  dot={{
                    fill: "#00C896",
                    r: 4,
                    strokeWidth: 2,
                    stroke: "var(--deep)",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#00C896",
                    stroke: "var(--deep)",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      )}

      {/* ── SECTION 4: Bloom Taxonomy Mix ── */}
      {bloomData.length > 0 && (
        <ChartSection
          title="Bloom Taxonomy Mix"
          icon={<Target size={18} color="#A855F7" />}
        >
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={bloomData} barCategoryGap="18%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-light)"
                  vertical={false}
                />
                <XAxis
                  dataKey="level"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fill: "var(--mist)",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fill: "var(--mist)",
                  }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Questions" radius={[4, 4, 0, 0]}>
                  {bloomData.map((entry) => (
                    <Cell key={entry.level} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 16,
            }}
          >
            {bloomData.map((entry) => (
              <span
                key={entry.level}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 999,
                  padding: "8px 12px",
                  background: `${entry.color}12`,
                  border: `1px solid ${entry.color}22`,
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink)",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: entry.color,
                  }}
                />
                {entry.level} · {entry.count} ({entry.percentage}%)
              </span>
            ))}
          </div>
        </ChartSection>
      )}

      {/* ── SECTION 5: Weak Areas — Topics to Focus On ── */}
      {weakTopics.length > 0 && (
        <ChartSection
          title="Topics to Focus On"
          icon={<Brain size={18} color="#EF4444" />}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {weakTopics.map((w, i) => (
              <div
                key={i}
                className="cc-weak-topic-row"
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? 12 : 16,
                  padding: isMobile ? "16px" : "14px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-light)",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Topic info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: isMobile ? 15 : 14,
                      fontWeight: 700,
                      color: "var(--ink)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: isMobile ? "normal" : "nowrap",
                    }}
                  >
                    {w.topic}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--mist)",
                      marginTop: 2,
                    }}
                  >
                    {w.unit}
                  </div>
                </div>

                {!isMobile && (
                  <div style={{ width: 160, flexShrink: 0 }}>
                    <ScoreBar score={w.score} />
                  </div>
                )}

                {isMobile && (
                  <div style={{ width: "100%", marginTop: 4 }}>
                    <ScoreBar score={w.score} />
                  </div>
                )}

                {/* Study Again CTA */}
                <button
                  onClick={() =>
                    router.push(
                      `/course/${w.courseId}/study?topicId=${w.topicId}`,
                    )
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#4D3FFF",
                    whiteSpace: "nowrap",
                    padding: isMobile ? "4px 0" : "6px 0",
                    transition: "opacity 0.2s",
                    marginLeft: isMobile ? 0 : "auto",
                  }}
                >
                  Study Again <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </ChartSection>
      )}

      {persona && (
        <ChartSection
          title="Learning Persona"
          icon={<Target size={18} color="#00C896" />}
        >
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: 6,
                }}
              >
                {persona.label}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--mist)",
                  lineHeight: 1.6,
                }}
              >
                {persona.summary}
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit,minmax(220px,1fr))",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "rgba(0,200,150,0.08)",
                  border: "1px solid rgba(0,200,150,0.16)",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#00C896",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                  }}
                >
                  Strengths
                </div>
                <div
                  style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}
                >
                  {persona.strengths.slice(0, 4).join(" · ") ||
                    "No strengths identified yet."}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,77,90,0.06)",
                  border: "1px solid rgba(255,77,90,0.16)",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#FF4D5A",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                  }}
                >
                  Needs Work
                </div>
                <div
                  style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}
                >
                  {persona.improvementAreas.slice(0, 4).join(" · ") ||
                    "No gaps identified yet."}
                </div>
              </div>
            </div>
          </div>
        </ChartSection>
      )}

      {strongTopics.length > 0 && (
        <ChartSection
          title="Strong Topics"
          icon={<Award size={18} color="#00C896" />}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {strongTopics.map((s, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--jade)",
                  background: "rgba(0,200,150,0.12)",
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,200,150,0.16)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {s.topic}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#00C896",
                  }}
                >
                  {s.score}%
                </span>
              </span>
            ))}
          </div>
        </ChartSection>
      )}

      {/* ── SECTION 6: Completion by Course ── */}
      {courseProgress.length > 0 && (
        <ChartSection
          title="Completion by Course"
          icon={<BookOpen size={18} color="#4D3FFF" />}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {courseProgress.map((cp) => {
              const pct =
                cp.totalTopics > 0
                  ? Math.round((cp.completedTopics / cp.totalTopics) * 100)
                  : 0;
              return (
                <div key={cp.courseId}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--ink)",
                      }}
                    >
                      {cp.courseName}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--mist)",
                      }}
                    >
                      {cp.completedTopics}/{cp.totalTopics} topics · {pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background:
                          pct >= 100
                            ? "linear-gradient(90deg, #00C896, #00E6A8)"
                            : "#00C896",
                        borderRadius: 999,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartSection>
      )}

      {/* ── Empty state if nothing loaded ── */}
      {!summary &&
        weekly.length === 0 &&
        scores.length === 0 &&
        bloomData.length === 0 &&
        weakTopics.length === 0 &&
        strongTopics.length === 0 &&
        courseProgress.length === 0 && (
          <div
            style={{
              background: "var(--deep)",
              borderRadius: 24,
              padding: "64px 40px",
              border: "1px solid var(--border-light)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Accents */}
            <div
              style={{
                position: "absolute",
                top: "-10%",
                right: "-10%",
                width: "40%",
                height: "40%",
                background:
                  "radial-gradient(circle, rgba(77,63,255,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ fontSize: 48, marginBottom: 20 }}>📈</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 12,
              }}
            >
              No analytics yet
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                color: "var(--mist)",
                maxWidth: 400,
                margin: "0 auto 24px",
              }}
            >
              Start studying your courses to see your learning progress, scores,
              and weak areas here.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#4D3FFF",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "12px 28px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Go to Dashboard <ArrowRight size={14} />
            </button>
          </div>
        )}

      {/* ── SECTION 4: My Learning Preferences (Personalisation) ── */}
      <ChartSection
        title="My Learning Preferences"
        icon={<Sliders size={18} color="#FF007A" />}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p
            style={{
              color: "var(--mist)",
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 8,
            }}
          >
            Customize how CC&gt;AI generates notes, flashcards, and mindmaps for
            you. Your preferences are applied globally.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 24,
            }}
          >
            {/* Column 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  Audience Level
                </label>
                <select
                  className="cc-input"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border-light)",
                    background: "var(--deep)",
                    color: "var(--ink)",
                  }}
                  value={personalisation.audienceLevel || ""}
                  onChange={(e) =>
                    setPersonalisation({
                      ...personalisation,
                      audienceLevel: e.target.value as any,
                    })
                  }
                >
                  <option value="">Default</option>
                  <option value="beginner">
                    Beginner (Explain like I'm 5)
                  </option>
                  <option value="intermediate">Intermediate (Standard)</option>
                  <option value="advanced">Advanced (Deep Technical)</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  Tone
                </label>
                <select
                  className="cc-input"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border-light)",
                    background: "var(--deep)",
                    color: "var(--ink)",
                  }}
                  value={personalisation.tone || ""}
                  onChange={(e) =>
                    setPersonalisation({
                      ...personalisation,
                      tone: e.target.value as any,
                    })
                  }
                >
                  <option value="">Default</option>
                  <option value="friendly">Friendly & Encouraging</option>
                  <option value="formal">Strictly Formal & Academic</option>
                  <option value="exam-focused">Exam-Focused</option>
                  <option value="practical">Practical & Real-World</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: 8,
                  }}
                >
                  Content Length
                </label>
                <select
                  className="cc-input"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border-light)",
                    background: "var(--deep)",
                    color: "var(--ink)",
                  }}
                  value={personalisation.requiredLength || ""}
                  onChange={(e) =>
                    setPersonalisation({
                      ...personalisation,
                      requiredLength: e.target.value as any,
                    })
                  }
                >
                  <option value="">Default</option>
                  <option value="short">Short & Concise</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long & Detailed</option>
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={personalisation.examPrep || false}
                  onChange={(e) =>
                    setPersonalisation({
                      ...personalisation,
                      examPrep: e.target.checked,
                    })
                  }
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--violet)",
                  }}
                />
                <span style={{ fontSize: 14, color: "var(--ink)" }}>
                  Prioritize Exam Prep & Likely Questions
                </span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={personalisation.vivaPrep || false}
                  onChange={(e) =>
                    setPersonalisation({
                      ...personalisation,
                      vivaPrep: e.target.checked,
                    })
                  }
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--violet)",
                  }}
                />
                <span style={{ fontSize: 14, color: "var(--ink)" }}>
                  Include Viva/Interview Prep
                </span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={personalisation.moreExamplesNeeded || false}
                  onChange={(e) =>
                    setPersonalisation({
                      ...personalisation,
                      moreExamplesNeeded: e.target.checked,
                    })
                  }
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--violet)",
                  }}
                />
                <span style={{ fontSize: 14, color: "var(--ink)" }}>
                  Maximize Examples & Analogies
                </span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={personalisation.includePitfalls || false}
                  onChange={(e) =>
                    setPersonalisation({
                      ...personalisation,
                      includePitfalls: e.target.checked,
                    })
                  }
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--violet)",
                  }}
                />
                <span style={{ fontSize: 14, color: "var(--ink)" }}>
                  Highlight Common Mistakes & Pitfalls
                </span>
              </label>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              Custom Instructions (Optional)
            </label>
            <textarea
              placeholder="E.g., 'Always explain things using basketball analogies' or 'Focus heavily on the mathematical derivations.'"
              style={{
                width: "100%",
                height: 100,
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-light)",
                background: "var(--deep)",
                color: "var(--ink)",
                resize: "vertical",
                fontFamily: "var(--font-body)",
              }}
              value={personalisation.personalisedNotes || ""}
              onChange={(e) =>
                setPersonalisation({
                  ...personalisation,
                  personalisedNotes: e.target.value,
                })
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 12,
            }}
          >
            <button
              onClick={handleSavePreferences}
              disabled={savingPrefs}
              className="btn-primary"
              style={{
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {savingPrefs ? (
                "Saving..."
              ) : (
                <>
                  <SaveIcon size={16} /> Save Preferences
                </>
              )}
            </button>
            {saveMessage && (
              <span
                style={{
                  fontSize: 14,
                  color:
                    saveMessage.type === "success"
                      ? "var(--jade)"
                      : "var(--rose)",
                  fontWeight: 500,
                }}
              >
                {saveMessage.text}
              </span>
            )}
          </div>
        </div>
      </ChartSection>
    </>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const shimmerCSS = `
@keyframes cc-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

const analyticsCSS = `
@keyframes cc-fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cc-fade-in {
  animation: cc-fade-up 0.4s ease forwards;
}
.cc-stat-card {
  animation: cc-fade-up 0.4s ease both;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cc-stat-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(77,63,255,0.10);
}
.cc-weak-topic-row:hover {
  background: rgba(77,63,255,0.04) !important;
}

/* Recharts overrides */
.recharts-default-legend {
  padding-top: 8px !important;
}
.recharts-legend-item-text {
  color: #6B6B7E !important;
  font-size: 12px !important;
}
`;
