"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Upload,
  BarChart2,
  Zap,
  CheckCircle,
  ArrowRight,
  Brain,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface Course {
  id: string;
  name: string;
  department?: string;
  semester?: string;
  unitCount?: number;
  progress?: number;
}

interface AnalyticsSummary {
  completedTopics: number;
  avgScore: number;
  streak: number;
}

interface RecentSession {
  courseId: string;
  topicId: string;
  courseName: string;
  topicName: string;
  unitName?: string;
  progress: number;
}

interface WeakTopic {
  topic: string;
  score: number;
  unit: string;
}

interface StrongTopic {
  topic: string;
  score: number;
  unit: string;
}

interface UserPersona {
  label: string;
  summary: string;
  style: string;
  strengths: string[];
  improvementAreas: string[];
}

interface AnalyticsPayload {
  summary?: AnalyticsSummary | null;
  weakTopics?: WeakTopic[];
  strongTopics?: StrongTopic[];
  activity?: Activity[];
  persona?: UserPersona | null;
}

interface Activity {
  action: string;
  topic: string;
  timestamp: string;
}

/* ─────────────────────────────────────────
   DUMMY DATA
───────────────────────────────────────── */
const DUMMY_COURSES: Course[] = [
  {
    id: "1",
    name: "Data Structures",
    department: "Computer Science",
    semester: "2",
    unitCount: 8,
    progress: 65,
  },
  {
    id: "2",
    name: "Algorithms",
    department: "Computer Science",
    semester: "2",
    unitCount: 6,
    progress: 45,
  },
  {
    id: "3",
    name: "Database Systems",
    department: "Computer Science",
    semester: "3",
    unitCount: 7,
    progress: 30,
  },
];

const DUMMY_ANALYTICS: AnalyticsSummary = {
  completedTopics: 24,
  avgScore: 78,
  streak: 12,
};

const DUMMY_SESSION: RecentSession = {
  courseId: "1",
  topicId: "topic-1",
  courseName: "Data Structures",
  topicName: "Binary Trees & Traversal",
  unitName: "Unit 3",
  progress: 65,
};

const DUMMY_WEAK_TOPICS: WeakTopic[] = [
  { topic: "Graph Algorithms", score: 52, unit: "Unit 5" },
  { topic: "Dynamic Programming", score: 61, unit: "Unit 7" },
  { topic: "Recursion", score: 58, unit: "Unit 2" },
];

const DUMMY_ACTIVITY: Activity[] = [
  {
    action: "complete",
    topic: "Sorting Algorithms",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    action: "quiz",
    topic: "Binary Search",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    action: "complete",
    topic: "Linked Lists",
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    action: "quiz",
    topic: "Tree Traversal",
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    action: "complete",
    topic: "Hash Tables",
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────────– */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function safeGet(fn: () => any, fallback: any = null) {
  try {
    return fn();
  } catch {
    return fallback;
  }
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
          "linear-gradient(90deg,#e8e6f0 25%,#f4f2fa 50%,#e8e6f0 75%)",
        backgroundSize: "200% 100%",
        animation: "cc-shimmer 1.4s infinite linear",
      }}
    />
  );
}

/* ─────────────────────────────────────────
   STAT CARD
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
   COURSE CARD
───────────────────────────────────────── */
function CourseCard({ course, delay }: { course: Course; delay: number }) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (

    <div
      className="cc-course-card"
      onClick={() => router.push(`/course/${course.id}`)}
      style={{
        background: "var(--deep)",
        borderRadius: 16,
        padding: "20px",
        boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
        border: "1px solid var(--border-light)",
        cursor: "pointer",
        animationDelay: `${delay}ms`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: 80,
          borderRadius: 10,
          background:
            "linear-gradient(135deg,rgba(77,63,255,0.12),rgba(0,200,150,0.08))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BookOpen size={28} color="#4D3FFF" />
      </div>

      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 18 : 16,
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: 4,
            wordBreak: "break-word",
            overflowWrap: "anywhere"
          }}
        >
          {course.name}
        </h3>
        {(course.department || course.semester) && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--mist)",
            }}
          >
            {[course.department, course.semester].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {/* Unit badge */}
      {course.unitCount != null && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#4D3FFF",
            background: "rgba(77,63,255,0.08)",
            padding: "3px 8px",
            borderRadius: 999,
            display: "inline-block",
          }}
        >
          {course.unitCount} units
        </span>
      )}

      {/* Progress */}
      <div>
        <div
          style={{
            height: 4,
            background: "rgba(9,9,15,0.06)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#00C896",
              width: `${course.progress ?? 0}%`,
              borderRadius: 999,
              transition: "width 0.8s ease",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--mist)",
            marginTop: 4,
          }}
        >
          {course.progress ?? 0}% complete
        </div>
      </div>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 600,
          color: "#4D3FFF",
          padding: 0,
        }}
      >
        Open Course <ArrowRight size={14} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   ACTIVITY ICON
───────────────────────────────────────── */
function ActivityIcon({ action }: { action: string }) {
  if (action === "quiz") return <Zap size={14} color="#F5A623" />;
  if (action === "complete") return <CheckCircle size={14} color="#00C896" />;
  return <BookOpen size={14} color="#4D3FFF" />;
}

function activityLabel(a: Activity) {
  if (a.action === "quiz") return `Scored on ${a.topic} quiz`;
  if (a.action === "complete") return `Completed ${a.topic}`;
  return `Studied ${a.topic}`;
}

/* ─────────────────────────────────────────
   MAIN DASHBOARD PAGE
───────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [session, setSession] = useState<RecentSession | null>(null);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([]);
  const [strongTopics, setStrongTopics] = useState<StrongTopic[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [persona, setPersona] = useState<UserPersona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, analyticsRes] = await Promise.all([
          api.get("/course"),
          api.get("/analytics/dashboard"),
          // api.get("/session/recent"),
        ]);

        const coursesData = safeGet(
          () => coursesRes.data?.data ?? coursesRes.data ?? [],
          [],
        );

        const emptyAnalyticsPayload: AnalyticsPayload = {};

        const analyticsPayload = safeGet(
          () =>
            analyticsRes.data?.data ??
            analyticsRes.data ??
            emptyAnalyticsPayload,
        );

        // const sessionData = safeGet(
        //   () => sessionRes.data?.data ?? sessionRes.data,
        //   null,
        // );

        const mappedCourses = Array.isArray(coursesData)
          ? coursesData.map((c: any) => ({
              ...c,
              id: c.course_id || c.id,
            }))
          : [];

        setCourses(mappedCourses);
        setAnalytics(analyticsPayload?.summary ?? null);
        setWeakTopics(
          Array.isArray(analyticsPayload?.weakTopics)
            ? analyticsPayload.weakTopics
            : [],
        );
        setStrongTopics(
          Array.isArray(analyticsPayload?.strongTopics)
            ? analyticsPayload.strongTopics
            : [],
        );
        setActivity(
          Array.isArray(analyticsPayload?.activity)
            ? analyticsPayload.activity
            : [],
        );

        try {
          const raw = localStorage.getItem("cc-learning-insights");
          const insights = raw ? JSON.parse(raw) : {};
          setStrongTopics(
            Array.isArray(insights.strongTopics)
              ? insights.strongTopics
              : Array.isArray(analyticsPayload?.strongTopics)
                ? analyticsPayload.strongTopics
                : [],
          );
          setPersona(insights.persona ?? analyticsPayload?.persona ?? null);
          if (
            Array.isArray(insights.weakTopics) &&
            insights.weakTopics.length
          ) {
            setWeakTopics(insights.weakTopics);
          }
        } catch {
          setPersona(analyticsPayload?.persona ?? null);
        }
        // setSession(sessionData);
      } catch {
        setError("Unable to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const hasCourses = courses.length > 0;
  const firstName = user?.name?.split(" ")[0] || "Scholar";

  /* ── Skeleton state ── */
  if (loading)
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: isMobile ? "24px 0" : "40px 0" }}>



        <style>{shimmerCSS}</style>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton h={32} w={isMobile ? "80%" : "40%"} r={12} />
          <Skeleton h={16} w={isMobile ? "60%" : "28%"} r={8} />
        </div>


        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                minWidth: 160,
                background: "var(--deep)",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid var(--border-light)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <Skeleton h={10} w="40%" r={4} />
                <Skeleton h={32} w={32} r={8} />
              </div>
              <Skeleton h={24} w="60%" r={6} />
            </div>
          ))}
        </div>

        <div
          style={{
            background: "var(--deep)",
            padding: "32px",
            borderRadius: "24px",
            border: "1px solid var(--border-light)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Skeleton h={20} w="20%" r={6} />
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Skeleton h={80} w={80} r={16} />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <Skeleton h={18} w="50%" r={6} />
              <Skeleton h={12} w="30%" r={4} />
              <Skeleton h={6} w="100%" r={3} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 24,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--deep)",
                padding: "20px",
                borderRadius: "20px",
                border: "1px solid var(--border-light)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <Skeleton h={100} w="100%" r={12} />
              <Skeleton h={18} w="70%" r={6} />
              <Skeleton h={12} w="40%" r={4} />
              <Skeleton h={6} w="100%" r={3} />
            </div>
          ))}
        </div>
      </div>
    );

  /* ── Error state ── */
  if (error)
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 40,
          textAlign: "center",
          boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            color: "#111",
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
      <style>{shimmerCSS + dashCSS}</style>

       {/* ── SECTION 1: Greeting ── */}
       <div 
        className="cc-fade-in" 
        style={{ 
          marginBottom: 32, 
          padding: "0",
          textAlign: isMobile ? "center" : "left"
        }}
      >

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: isMobile ? 28 : 32,
            fontWeight: 800,
            color: "var(--ink)",
            marginBottom: 8,
            letterSpacing: isMobile ? "-0.03em" : "-0.01em"
          }}
        >
          {getGreeting()}, {firstName} 👋
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: isMobile ? 14 : 15,
            color: "var(--mist)",
            lineHeight: 1.5
          }}
        >
          {hasCourses
            ? `You have ${courses.length} course${courses.length !== 1 ? "s" : ""}. Keep going.`
            : "Welcome! Start by uploading your first course plan."}
        </p>
      </div>



       {/* ── SECTION 2: Stats Row ── */}
      <div
        style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? 12 : 16, 
          marginBottom: 32 
        }}
      >

        <StatCard
          label="Total Courses"
          value={hasCourses ? String(courses.length) : "—"}
          icon={BookOpen}
          delay={0}
        />
        <StatCard
          label="Topics Done"
          value={analytics ? String(analytics.completedTopics) : "—"}
          icon={CheckCircle}
          delay={80}
          color="#00C896"
        />
        <StatCard
          label="Avg Score"
          value={analytics ? `${analytics.avgScore}%` : "—"}
          icon={Target}
          delay={160}
          color="#F5A623"
        />
        <StatCard
          label="Study Streak"
          value={analytics ? `${analytics.streak}d` : "—"}
          icon={Flame}
          delay={240}
          color="#FF4D5A"
        />
      </div>

      {!hasCourses && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--mist)",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          Upload your first course to see your stats
        </p>
      )}

      {/* ── SECTION 3: Upload CTA ── */}
      {!hasCourses ? (
        /* Empty state — full-width prominent card */
        <div
          className="cc-fade-in"
          style={{
            background: "var(--deep)",
            borderRadius: 20,
            padding: isMobile ? "40px 20px" : "48px 40px",
            marginBottom: 32,

            border: "1px solid var(--border-light)",
            boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(77,63,255,0.05) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(0,200,150,0.05) 0%, transparent 60%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "rgba(77,63,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Upload size={36} color="#4D3FFF" />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Start by uploading your course plan
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--mist)",
              maxWidth: 440,
            }}
          >
            Upload a PDF or DOCX syllabus and we'll build your entire learning
            system — notes, quizzes, flashcards and more.
          </p>
          <button
            id="upload-cta-btn"
            onClick={() => router.push("/upload")}
            className="btn-primary"
            style={{
              borderRadius: 999,
              padding: "14px 32px",
              fontSize: 14,
              marginTop: 8,
            }}
          >
            <Upload size={16} /> Upload Course Plan
          </button>
        </div>
      ) : (
        /* Has courses — compact secondary CTA */
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 32,
          }}
        >
          <button
            id="upload-another-btn"
            onClick={() => router.push("/upload")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: "#4D3FFF",
              background: "rgba(77,63,255,0.08)",
              border: "none",
              borderRadius: 999,
              padding: "10px 20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <Upload size={14} /> Upload Another Course
          </button>
        </div>
      )}

      {/* ── SECTION 4: Continue Learning ── */}
      {session && (
        <div className="cc-fade-in" style={{ marginBottom: 32 }}>
          <div className="cc-section-header">
            <h2 className="cc-section-title">Continue Learning</h2>
          </div>
          <div
            className="cc-continue-card"
            onClick={() =>
              router.push(
                `/course/${session.courseId}/study?topicId=${session.topicId}`,
              )
            }
             style={{
              background: "var(--deep)",
              borderRadius: 20,
              padding: isMobile ? "20px" : "24px",
              boxShadow: "0 12px 32px rgba(77,63,255,0.08)",
              border: "1px solid var(--border-light)",
              cursor: "pointer",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 16 : 20,
              alignItems: isMobile ? "flex-start" : "center",
            }}

          >
            {/* Thumbnail */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                flexShrink: 0,
                background: "linear-gradient(135deg,#4D3FFF,#7B70FF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={28} color="white" />
            </div>

            <div 
              style={{ 
                flex: 1, 
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--mist)",
                  marginBottom: 0,
                }}
              >
                {session.courseName}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 0,
                  lineHeight: 1.3
                }}
              >
                {session.topicName}
              </h3>
              {session.unitName && (
                <div style={{ marginTop: 4 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "#4D3FFF",
                      background: "rgba(77,63,255,0.08)",
                      padding: "2px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {session.unitName}
                  </span>
                </div>
              )}
              <div
                style={{
                  marginTop: 12,
                  height: 4,
                  background: "rgba(9,9,15,0.06)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "#00C896",
                    width: `${session.progress}%`,
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>

            {!isMobile && (
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                  background: "#4D3FFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Continue <ArrowRight size={14} />
              </button>
            )}

          </div>
        </div>
      )}

      {/* ── SECTION 5: My Courses Grid ── */}
      {hasCourses && (
        <div className="cc-fade-in" style={{ marginBottom: 32 }}>
          <div className="cc-section-header">
            <h2 className="cc-section-title">My Courses</h2>
            <a
              href="/course"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#4D3FFF",
                textDecoration: "none",
              }}
            >
              View all →
            </a>
          </div>
            <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(280px,1fr))",
              gap: isMobile ? 20 : 16,
            }}
          >


            {courses.map((c, i) => (
              <CourseCard key={c.id} course={c} delay={i * 60} />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 6: Weak Areas ── */}
      {weakTopics.length > 0 && (
        <div className="cc-fade-in" style={{ marginBottom: 32 }}>
          <div className="cc-section-header">
            <h2
              className="cc-section-title"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Brain size={18} color="#D94F00" /> Areas to revisit
            </h2>
            <a
              href="/dashboard/analytics"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#4D3FFF",
                textDecoration: "none",
              }}
            >
              See all →
            </a>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {weakTopics.slice(0, 5).map((w, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#D94F00",
                  background: "var(--deep)",
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {w.topic}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#E06030",
                  }}
                >
                  {w.score}%
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {persona && (
        <div className="cc-fade-in" style={{ marginBottom: 32 }}>
          <div className="cc-section-header">
            <h2
              className="cc-section-title"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Brain size={18} color="#4D3FFF" /> Your learning persona
            </h2>
          </div>
          <div
            style={{
              background: "var(--deep)",
              borderRadius: 16,
              padding: 20,
              border: "1px solid var(--border-light)",
              boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
            }}
          >
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
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
               {persona.summary}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit,minmax(220px,1fr))",
                gap: isMobile ? 12 : 12,
              }}
            >


              <div
                style={{
                  background: "rgba(0,200,150,0.08)",
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
                    "Building strengths now."}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,77,90,0.06)",
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
                  Growth Areas
                </div>
                <div
                  style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}
                >
                  {persona.improvementAreas.slice(0, 4).join(" · ") ||
                    "No clear gaps yet."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {strongTopics.length > 0 && (
        <div className="cc-fade-in" style={{ marginBottom: 32 }}>
          <div className="cc-section-header">
            <h2
              className="cc-section-title"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Target size={18} color="#00C896" /> Strong areas
            </h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {strongTopics.slice(0, 5).map((s, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#00A37A",
                  background: "rgba(0,200,150,0.08)",
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
        </div>
      )}

      {/* ── SECTION 7: Recent Activity ── */}
      {activity.length > 0 && (
        <div className="cc-fade-in" style={{ marginBottom: 32 }}>
          <div className="cc-section-header">
            <h2
              className="cc-section-title"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <TrendingUp size={18} color="#4D3FFF" /> Recent Activity
            </h2>
          </div>
          <div
            style={{
              background: "var(--deep)",
              borderRadius: 16,
              border: "1px solid var(--border-light)",
              boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
              overflow: "hidden",
            }}
          >
            {activity.slice(0, 5).map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 20px",
                  borderBottom:
                    i < Math.min(activity.length, 5) - 1
                      ? "1px solid rgba(9,9,15,0.06)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    flexShrink: 0,
                    background:
                      a.action === "quiz"
                        ? "rgba(245,166,35,0.1)"
                        : a.action === "complete"
                          ? "rgba(0,200,150,0.1)"
                          : "rgba(77,63,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIcon action={a.action} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink)",
                    }}
                  >
                    {activityLabel(a)}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--mist)",
                    flexShrink: 0,
                  }}
                >
                  {relativeTime(a.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   STYLES (injected as CSS strings)
───────────────────────────────────────── */
const shimmerCSS = `
@keyframes cc-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

const dashCSS = `
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
.cc-course-card {
  animation: cc-fade-up 0.4s ease both;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cc-course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(77,63,255,0.10);
}
.cc-continue-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cc-continue-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(77,63,255,0.10);
}
.cc-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.cc-section-title {
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.01em;
}
`;
