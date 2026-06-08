"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Suspense,
} from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api, { getFriendlyErrorMessage } from "@/lib/api";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { useTopicContent } from "@/hooks/useTopicContent";
import type { QuizBloomAnalysis } from "@/hooks/useTopicContent";
import { TAB_CONFIG, SHIMMER_CSS } from "@/types/study";
import type { TabKey, CourseData, Unit, Topic } from "@/types/study";
import { NotesTab, QuizTab } from "@/components/study/StudyTabs";

/* ─────────────────────────────────────
   TOPIC NAVIGATOR (Secondary Sidebar)
───────────────────────────────────── */
function TopicNavigator({
  course,
  activeTopic,
  unlockedTopics,
  completedTopics,
  onSelectTopic,
  isMobile,
}: {
  course: CourseData;
  activeTopic: string;
  unlockedTopics: Set<string>;
  completedTopics: Set<string>;
  onSelectTopic: (topicId: string) => void;
  isMobile?: boolean;
}) {
  return (
    <aside
      style={{
        width: isMobile ? "100%" : 260,
        minWidth: isMobile ? "100%" : 260,
        background: "rgba(255,255,255,0.015)",
        backdropFilter: "blur(20px)",
        height: isMobile ? "auto" : "calc(100vh - 65px)",
        maxHeight: isMobile ? "40vh" : "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRight: isMobile ? "none" : "1px solid var(--border-light)",
        borderBottom: isMobile ? "1px solid var(--border-light)" : "none",
        position: isMobile ? "relative" : "sticky",
        top: isMobile ? 0 : 65,
      }}
    >
      {/* Scrollable unit/topic list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
        {course?.units?.map((unit, ui) => (
          <div key={ui} style={{ marginBottom: 12 }}>
            {/* Unit header */}
            <div
              style={{
                padding: "8px 20px",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                color: "#4D3FFF",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                opacity: 0.8,
              }}
            >
              {unit.unitName}
            </div>
            {/* Topics */}
            {unit.topics?.map((topic) => {
              const isActive = topic.topicId === activeTopic;
              const isLocked = !unlockedTopics.has(topic.topicId);
              const isCompleted = completedTopics.has(topic.topicId);
              return (
                <button
                  key={topic.topicId}
                  onClick={() => {
                    if (!isLocked) onSelectTopic(topic.topicId);
                  }}
                  disabled={isLocked}
                  title={
                    isLocked
                      ? "Finish the previous subsection quiz to unlock this topic"
                      : ""
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 20px",
                    border: "none",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#4D3FFF" : "var(--mist)",
                    background: isActive
                      ? "rgba(77,63,255,0.06)"
                      : "transparent",
                    borderLeft: isActive
                      ? "3px solid #4D3FFF"
                      : "3px solid transparent",
                    opacity: isLocked ? 0.65 : 1,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && !isLocked)
                      e.currentTarget.style.background = "rgba(77,63,255,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive && !isLocked)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {isLocked ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <rect
                        x="5"
                        y="11"
                        width="14"
                        height="10"
                        rx="2"
                        stroke="var(--mist)"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M8 11V8a4 4 0 1 1 8 0v3"
                        stroke="var(--mist)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : isCompleted ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{ flexShrink: 0 }}
                    >
                      <circle
                        cx="7"
                        cy="7"
                        r="6"
                        fill="rgba(0,200,150,0.1)"
                        stroke="#00C896"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M4.5 7.2L6 8.7L9.5 5.2"
                        stroke="#00C896"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "1.2px solid var(--border-light)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {topic.topicName}
                  </span>
                  {isLocked && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--mist)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        flexShrink: 0,
                      }}
                    >
                      Locked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────
   CONTENT AREA
───────────────────────────────────── */
function ContentPanel({
  course,
  courseId,
  topicId,
  activeTab,
  onTabChange,
  onQuizCompleted,
  isMobile,
}: {
  course: CourseData;
  courseId: string;
  topicId: string;
  activeTab: TabKey;
  onTabChange: (t: TabKey) => void;
  onQuizCompleted: (
    topicId: string,
    score: number,
    unitNumber: number,
    analysis?: QuizBloomAnalysis,
  ) => void;
  isMobile?: boolean;
}) {
  let topicName = "";
  let unitName = "";
  let unitNumber = 0;
  if (course?.units) {
    for (const unit of course.units) {
      const found = unit.topics?.find((t) => t.topicId === topicId);
      if (found) {
        topicName = found.topicName;
        unitName = unit.unitName;
        unitNumber = unit.unitNumber;
        break;
      }
    }
  }

  const { content, loading, error, generateForTab, usePersonalisation, setUsePersonalisation } = useTopicContent(
    courseId,
    topicId,
    unitNumber,
    topicName,
  );

  return (
    <div style={{ flex: 1, minWidth: 0, padding: isMobile ? "16px 16px" : "32px 48px" }}>
      {/* Unit name label */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "#4D3FFF",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {unitName}
      </div>
      {/* Topic title */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: isMobile ? 24 : 32,
          fontWeight: 800,
          color: "var(--ink)",
          marginBottom: 24,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}
      >
        {topicName}
      </h1>

      {/* Tab Selector */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 32,
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                padding: "12px 24px",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#4D3FFF" : "var(--mist)",
                borderBottom: isActive
                  ? "2px solid #4D3FFF"
                  : "2px solid transparent",
                transition: "all 0.15s ease",
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            marginBottom: 20,
            background: "rgba(255,77,90,0.05)",
            border: "1px solid rgba(255,77,90,0.1)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "#FF4D5A",
          }}
        >
          {error}
        </div>
      )}

      {/* Content Render */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + topicId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "notes" && (
            <div
              style={{
                background: "var(--deep)",
                borderRadius: 20,
                padding: 32,
                border: "1px solid var(--border-light)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              }}
            >
              <NotesTab
                content={content}
                isLoading={!!loading.notes}
                generateForTab={generateForTab as any}
                usePersonalisation={usePersonalisation}
                setUsePersonalisation={setUsePersonalisation}
              />
            </div>
          )}
          {activeTab === "quiz" && (
            <QuizTab
              content={content}
              isLoading={!!loading.quiz}
              courseId={courseId}
              topicId={topicId}
              unitNumber={unitNumber}
              course={course}
              onQuizCompleted={onQuizCompleted}
              generateForTab={generateForTab as any}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────── */
function StudyPageSkeleton() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{ width: 260, background: "rgba(0,0,0,0.02)", padding: "24px" }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              height: 12,
              width: "80%",
              borderRadius: 4,
              background: "rgba(0,0,0,0.04)",
              marginBottom: 16,
            }}
          />
        ))}
      </div>
      <div style={{ flex: 1, padding: "48px" }}>
        <div
          style={{
            height: 32,
            width: "40%",
            borderRadius: 8,
            background: "rgba(0,0,0,0.04)",
            marginBottom: 24,
          }}
        />
        <div
          style={{
            height: 400,
            width: "100%",
            borderRadius: 20,
            background: "rgba(0,0,0,0.02)",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────── */
function StudyPageInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const courseId = params.id as string;
  const topicId = searchParams.get("topicId") ?? "";
  const tabParam = (searchParams.get("tab") ?? "notes") as TabKey;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    new Set(),
  );
  const [unitCompleted, setUnitCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const completionStorageKey = useMemo(
    () => `study_completed_${courseId}`,
    [courseId],
  );

  const resolveTopicMeta = useCallback(
    (targetTopicId: string) => {
      for (const unit of course?.units || []) {
        const topicIndex = unit.topics?.findIndex(
          (topic) => topic.topicId === targetTopicId,
        );
        if (topicIndex >= 0) {
          const matchedTopic = unit.topics?.[topicIndex];
          if (!matchedTopic) continue;
          return {
            topicName: matchedTopic.topicName,
            unitNumber: matchedTopic.unitNumber || unit.unitNumber || 1,
            isFirstTopicInUnit: topicIndex === 0,
          };
        }
      }

      return {
        topicName: targetTopicId,
        unitNumber: 1,
        isFirstTopicInUnit: false,
      };
    },
    [course],
  );

  const orderedTopicIds = useMemo(() => {
    return (course?.units || []).flatMap((unit) =>
      (unit.topics || [])
        .map((topic) => String(topic.topicId || ""))
        .filter(Boolean),
    );
  }, [course]);

  const getContiguousCompletedCount = useCallback(
    (completed: Set<string>) => {
      let count = 0;
      for (const orderedTopicId of orderedTopicIds) {
        if (!completed.has(orderedTopicId)) {
          break;
        }
        count += 1;
      }
      return count;
    },
    [orderedTopicIds],
  );

  const appendWeeklyActivity = useCallback(
    (
      weekly: Array<{
        day: string;
        topicsStudied: number;
        quizzesDone: number;
      }>,
      options: { topicsStudied?: number; quizzesDone?: number } = {},
    ) => {
      const dayKey = new Date().toISOString().slice(0, 10);
      const nextWeekly = [...weekly];
      const existingIndex = nextWeekly.findIndex((item) => item.day === dayKey);

      if (existingIndex >= 0) {
        nextWeekly[existingIndex] = {
          ...nextWeekly[existingIndex],
          topicsStudied:
            nextWeekly[existingIndex].topicsStudied +
            (options.topicsStudied || 0),
          quizzesDone:
            nextWeekly[existingIndex].quizzesDone + (options.quizzesDone || 0),
        };
        return nextWeekly;
      }

      return [
        ...nextWeekly,
        {
          day: dayKey,
          topicsStudied: options.topicsStudied || 0,
          quizzesDone: options.quizzesDone || 0,
        },
      ];
    },
    [],
  );

  const syncAnalytics = useCallback(
    async (params: {
      action: string;
      topicId: string;
      score?: number;
      weakTopic?: boolean;
      strongTopic?: boolean;
      unitNumber?: number;
      incrementTopicsStudied?: boolean;
      incrementQuizzesDone?: boolean;
      unlockedUnit?: boolean;
      completedTopicCount?: number;
      analysis?: QuizBloomAnalysis | null;
      persona?: {
        label: string;
        summary: string;
        style: string;
        strengths: string[];
        improvementAreas: string[];
      };
    }) => {
      try {
        const dashboardRes = await api.get("/analytics/dashboard");
        const dashboard = dashboardRes.data?.data ?? dashboardRes.data ?? {};
        const nowIso = new Date().toISOString();

        const nextActivity = [
          {
            action: params.action,
            topic: params.topicId,
            timestamp: nowIso,
          },
        ];

        const currentWeekly = Array.isArray(dashboard.weekly)
          ? dashboard.weekly
          : [];
        const nextWeekly = appendWeeklyActivity(currentWeekly, {
          topicsStudied: params.incrementTopicsStudied ? 1 : 0,
          quizzesDone: params.incrementQuizzesDone ? 1 : 0,
        }).slice(-120);

        const currentScores = Array.isArray(dashboard.scores)
          ? dashboard.scores
          : [];
        const nextScores =
          typeof params.score === "number"
            ? [
                ...currentScores,
                {
                  date: nowIso,
                  topic: params.topicId,
                  score: params.score,
                },
              ].slice(-500)
            : currentScores;

        const currentWeakTopics = Array.isArray(dashboard.weakTopics)
          ? dashboard.weakTopics
          : [];
        const currentStrongTopics = Array.isArray(dashboard.strongTopics)
          ? dashboard.strongTopics
          : [];
        const resolvedTopic = resolveTopicMeta(params.topicId);
        const weakTopicEntry =
          params.weakTopic && typeof params.score === "number"
            ? {
                topic: resolvedTopic.topicName,
                unit: `Unit ${params.unitNumber || resolvedTopic.unitNumber}`,
                score: params.score,
                courseId,
                topicId: params.topicId,
              }
            : null;
        const nextWeakTopics = weakTopicEntry
          ? [
              ...currentWeakTopics.filter(
                (item: any) => item?.topicId !== params.topicId,
              ),
              weakTopicEntry,
            ].slice(-200)
          : currentWeakTopics;

        const strongTopicEntry =
          params.strongTopic && typeof params.score === "number"
            ? {
                topic: resolvedTopic.topicName,
                unit: `Unit ${params.unitNumber || resolvedTopic.unitNumber}`,
                score: params.score,
                courseId,
                topicId: params.topicId,
              }
            : null;
        const nextStrongTopics = strongTopicEntry
          ? [
              ...currentStrongTopics.filter(
                (item: any) => item?.topicId !== params.topicId,
              ),
              strongTopicEntry,
            ].slice(-200)
          : currentStrongTopics;

        const nextPersona = params.persona ?? dashboard.persona ?? null;

        const existingCourseProgress = Array.isArray(dashboard.courseProgress)
          ? dashboard.courseProgress
          : [];
        const totalTopics =
          course?.units?.reduce(
            (sum, unit) => sum + (unit.topics?.length || 0),
            0,
          ) || 0;
        const nextCompletedTopics =
          params.completedTopicCount ?? completedTopics.size;
        const nextCourseProgress = params.unlockedUnit
          ? [
              ...existingCourseProgress.filter(
                (entry: any) => entry?.courseId !== courseId,
              ),
              {
                courseId,
                courseName: course?.courseName || "Course",
                completedTopics: nextCompletedTopics,
                totalTopics,
              },
            ]
          : existingCourseProgress;

        const currentSummary = dashboard.summary ?? {};
        const avgScore = nextScores.length
          ? Math.round(
              nextScores.reduce(
                (sum: number, entry: any) => sum + (Number(entry?.score) || 0),
                0,
              ) / nextScores.length,
            )
          : (currentSummary.avgScore ?? 0);

        const nextSummary = params.unlockedUnit
          ? {
              totalTopics,
              completedTopics: nextCompletedTopics,
              avgScore,
              bestUnit: currentSummary.bestUnit || "N/A",
              streak:
                typeof currentSummary.streak === "number"
                  ? currentSummary.streak
                  : 0,
            }
          : currentSummary;

        await trackAnalyticsEvent({
          action: params.action,
          topicId: params.topicId,
          score: params.score,
          weakTopic: params.weakTopic,
          unitNumber: params.unitNumber,
          incrementTopicsStudied: params.incrementTopicsStudied,
          incrementQuizzesDone: params.incrementQuizzesDone,
          unlockedUnit: params.unlockedUnit,
          completedTopicCount: params.completedTopicCount,
          summary: params.unlockedUnit ? nextSummary : undefined,
          weekly:
            params.incrementTopicsStudied || params.incrementQuizzesDone
              ? nextWeekly
              : undefined,
          scores: typeof params.score === "number" ? nextScores : undefined,
          weakTopics: weakTopicEntry ? nextWeakTopics : undefined,
          strongTopics: strongTopicEntry ? nextStrongTopics : undefined,
          courseProgress: params.unlockedUnit ? nextCourseProgress : undefined,
          persona: nextPersona ?? undefined,
          analysis: params.analysis ?? undefined,
        });

        try {
          const raw = localStorage.getItem("cc-learning-insights");
          const parsed = raw ? JSON.parse(raw) : {};
          const nextStore = {
            ...parsed,
            persona: nextPersona,
            strongTopics: strongTopicEntry
              ? nextStrongTopics
              : (parsed.strongTopics ?? []),
            weakTopics: weakTopicEntry
              ? nextWeakTopics
              : (parsed.weakTopics ?? []),
          };
          localStorage.setItem(
            "cc-learning-insights",
            JSON.stringify(nextStore),
          );
        } catch {
          // local persistence is best-effort only
        }
      } catch {
        // analytics should never block the study flow
      }
    },
    [
      appendWeeklyActivity,
      completedTopics.size,
      course,
      courseId,
      resolveTopicMeta,
    ],
  );

  const unlockedTopics = useMemo(() => {
    const unlocked = new Set<string>();
    if (orderedTopicIds.length === 0) return unlocked;

    const completedSubsections = getContiguousCompletedCount(completedTopics);
    orderedTopicIds.slice(0, completedSubsections + 1).forEach((topicId) => {
      unlocked.add(topicId);
    });

    return unlocked;
  }, [completedTopics, getContiguousCompletedCount, orderedTopicIds]);

  // ── Analytics ──
  const startTimeRef = useRef(Date.now());
  const trackActivity = useCallback(
    async (tId: string, cId: string, timeSpent: number) => {
      void cId;
      void timeSpent;
      await trackAnalyticsEvent({ action: "study", topicId: tId });
    },
    [],
  );

  useEffect(() => {
    startTimeRef.current = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 5 && topicId && courseId) {
        trackActivity(topicId, courseId, timeSpent);
      }
    };
  }, [topicId, courseId, trackActivity]);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  // ── Load Course Data ──
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);

    const load = async () => {
      try {
        const [courseRes, analyticsRes] = await Promise.allSettled([
          api.get(`/course/${courseId}`),
          api.get("/analytics/dashboard"),
        ]);

        if (courseRes.status === "rejected")
          throw new Error("Failed to load course");
        const payload = courseRes.value.data?.data ?? courseRes.value.data;
        if (!payload) throw new Error("Course not found");

        const plan = payload.coursePlan || payload.course_plan || payload.plan;
        console.log("[StudyPage] Course Plan:", plan);

        // Find the roadmap/units array regardless of key name
        const roadmap =
          plan?.timelineRoadmap ||
          plan?.roadmap ||
          plan?.units ||
          plan?.phases ||
          [];

        const units: Unit[] = roadmap.map((phase: any, pIdx: number) => {
          // Detect topics array
          const rawTopics = phase.topics || phase.lessons || phase.items || [];
          return {
            unitName:
              phase.phase || phase.title || phase.name || `Unit ${pIdx + 1}`,
            unitNumber: pIdx + 1,
            topics: rawTopics.map((t: any) => ({
              topicId: typeof t === "string" ? t : t.id || t.name || t.topicId,
              topicName:
                typeof t === "string" ? t : t.name || t.title || t.topicName,
              unitNumber: pIdx + 1,
            })),
          };
        });

        setCourse({
          courseName: payload.name,
          units,
          unitCompleted:
            Number(payload.unit_completed ?? payload.unitCompleted ?? 0) || 0,
        });

        const persistedCompletedUnit =
          Number(payload.unit_completed ?? payload.unitCompleted ?? 0) || 0;
        setUnitCompleted(persistedCompletedUnit);

        if (analyticsRes.status === "fulfilled") {
          const analyticsData =
            analyticsRes.value.data?.data ?? analyticsRes.value.data;
          const completedFromAnalytics = new Set<string>(
            (analyticsData?.activity ?? [])
              .filter((entry: any) => entry?.action === "quiz" && entry?.topic)
              .map((entry: any) => String(entry.topic)),
          );

          const completedFromLocal = (() => {
            try {
              const raw = localStorage.getItem(completionStorageKey);
              const parsed = raw ? JSON.parse(raw) : [];
              return Array.isArray(parsed)
                ? parsed.map((item) => String(item))
                : [];
            } catch {
              return [];
            }
          })();

          setCompletedTopics(
            new Set<string>([
              ...Array.from(completedFromAnalytics),
              ...completedFromLocal,
            ]),
          );
        } else {
          const completedFromLocal = (() => {
            try {
              const raw = localStorage.getItem(completionStorageKey);
              const parsed = raw ? JSON.parse(raw) : [];
              return Array.isArray(parsed)
                ? parsed.map((item) => String(item))
                : [];
            } catch {
              return [];
            }
          })();
          setCompletedTopics(new Set<string>(completedFromLocal));
        }
      } catch (err: any) {
        setError(
          getFriendlyErrorMessage(err, "Failed to load study materials."),
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [completionStorageKey, courseId]);

  const handleQuizCompleted = useCallback(
    async (
      completedTopicId: string,
      score: number,
      completedUnitNumber: number,
      analysis?: QuizBloomAnalysis,
    ) => {
      const nextCompletedTopics = new Set(completedTopics);
      nextCompletedTopics.add(completedTopicId);
      setCompletedTopics(nextCompletedTopics);

      let fullyCompletedUnits = 0;
      for (const unit of course?.units || []) {
        const unitTopicIds = unit.topics?.map((t) => String(t.topicId)) || [];
        if (unitTopicIds.length > 0 && unitTopicIds.every((id) => nextCompletedTopics.has(id))) {
          fullyCompletedUnits += 1;
        } else {
          break;
        }
      }
      
      const nextUnitCompleted = fullyCompletedUnits;
      setUnitCompleted(nextUnitCompleted);
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              unitCompleted: nextUnitCompleted,
            }
          : prev,
      );

      try {
        localStorage.setItem(
          completionStorageKey,
          JSON.stringify(Array.from(nextCompletedTopics)),
        );
      } catch {
        // Ignore storage failures
      }

      try {
        await api.patch(`/course/${courseId}`, {
          unit_completed: nextUnitCompleted,
        });
        const passedThreshold = score >= 70;
        const derivedPersona = analysis?.persona
          ? {
              label: analysis.persona.label || "Learner Profile",
              summary:
                analysis.persona.summary ||
                "A snapshot of your current study pattern.",
              style:
                analysis.persona.style ||
                "Balanced learning with practice and revision.",
              strengths: analysis.persona.strengths || analysis.strengths || [],
              improvementAreas:
                analysis.persona.improvementAreas || analysis.weaknesses || [],
            }
          : undefined;
        const strongTopic = score >= 80;
        await syncAnalytics({
          action: "quiz",
          topicId: completedTopicId,
          score,
          weakTopic: !passedThreshold,
          strongTopic,
          unitNumber: completedUnitNumber,
          incrementQuizzesDone: true,
          unlockedUnit: true,
          completedTopicCount: nextCompletedTopics.size,
          analysis,
          persona: derivedPersona,
        });

        await syncAnalytics({
          action: "subsection_unlock",
          topicId: completedTopicId,
          unitNumber: completedUnitNumber,
          unlockedUnit: true,
          completedTopicCount: nextCompletedTopics.size,
        });
      } catch {
        // Analytics sync is non-blocking
      }
    },
    [
      completedTopics,
      completionStorageKey,
      courseId,
      getContiguousCompletedCount,
      syncAnalytics,
    ],
  );

  const handleSelectTopic = useCallback(
    (newTopicId: string) => {
      const location = resolveTopicMeta(newTopicId);
      const p = new URLSearchParams(searchParams.toString());
      p.set("topicId", newTopicId);
      router.push(`/course/${courseId}/study?${p.toString()}`);

      void trackAnalyticsEvent({
        action: "topic_open",
        topicId: newTopicId,
      });

      if (location.isFirstTopicInUnit) {
        void trackAnalyticsEvent({
          action: "unit_open",
          topicId: newTopicId,
          unitNumber: location.unitNumber,
          incrementTopicsStudied: true,
        });
      }
    },
    [courseId, resolveTopicMeta, router, searchParams],
  );

  const handleTabChange = useCallback(
    (tab: TabKey) => {
      setActiveTab(tab);
      const p = new URLSearchParams(searchParams.toString());
      p.set("tab", tab);
      router.push(`/course/${courseId}/study?${p.toString()}`, {
        scroll: false,
      });

      void syncAnalytics({
        action: `tab_${tab}`,
        topicId:
          topicId || course?.units?.[0]?.topics?.[0]?.topicId || courseId,
      });
    },
    [course?.units, courseId, router, searchParams, syncAnalytics, topicId],
  );

  // ── Auto-select first topic ──
  useEffect(() => {
    // If we have course data but no topicId, pick the first one
    if (
      !loading &&
      course &&
      course.units &&
      course.units.length > 0 &&
      !topicId
    ) {
      const firstTopic = course.units[0]?.topics?.[0];
      if (firstTopic) {
        handleSelectTopic(firstTopic.topicId);
      }
    }
  }, [topicId, course, loading, handleSelectTopic]);

  useEffect(() => {
    if (
      !loading &&
      topicId &&
      unlockedTopics.size > 0 &&
      !unlockedTopics.has(topicId)
    ) {
      const firstUnlockedTopicId = Array.from(unlockedTopics)[0];
      if (firstUnlockedTopicId) {
        handleSelectTopic(firstUnlockedTopicId);
      }
    }
  }, [handleSelectTopic, loading, topicId, unlockedTopics]);

  if (loading) return <StudyPageSkeleton />;
  if (error || !course) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <p style={{ color: "var(--mist)", marginBottom: 20 }}>
          {error || "Course not found"}
        </p>
        <button onClick={() => router.push("/course")} className="btn-primary">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "calc(100vh - 65px)",
        background: "transparent",
      }}
    >
      <style>{SHIMMER_CSS}</style>
      <TopicNavigator
        course={course}
        activeTopic={topicId}
        unlockedTopics={unlockedTopics}
        completedTopics={completedTopics}
        onSelectTopic={handleSelectTopic}
        isMobile={isMobile}
      />
      <ContentPanel
        course={course}
        courseId={courseId}
        topicId={topicId}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onQuizCompleted={handleQuizCompleted}
        isMobile={isMobile}
      />
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<StudyPageSkeleton />}>
      <StudyPageInner />
    </Suspense>
  );
}
