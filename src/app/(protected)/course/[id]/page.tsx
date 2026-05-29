"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
  Layers,
  Play,
  Target,
} from "lucide-react";
import api from "@/lib/api";

type YoutubeResource = {
  topic?: string;
  title?: string;
  channel?: string;
  youtubeVideoId?: string;
  whyWatch?: string;
  youtubeUrl?: string;
  youtubeThumbnailUrl?: string;
  publishedYear?: number;
};

type Book = {
  topic?: string;
  title?: string;
  author?: string;
  isbn?: string;
  reason?: string;
  searchUrl?: string;
  thumbnail?: string;
};

type TimelinePhase = {
  phase?: string;
  shortDescription?: string;
  detailedGuidance?: string;
  actionSteps?: string[];
  keyConcepts?: string[];
  youtubeResources?: YoutubeResource[];
  books?: Book[];
};

type TopicDetail = {
  topic?: string;
  overview?: string;
  keyConcepts?: string[];
  prerequisites?: string[];
  studyPlan?: Array<
    | string
    | {
        task?: string;
        practice?: string;
        rationale?: string;
      }
  >;
};

type LearningPlanItem = {
  week?: string;
  focus?: string;
  outcomes?: string[];
  tasks?: string[];
};

type CoursePlanData = {
  importantTopics?: string[];
  timelineRoadmap?: TimelinePhase[];
  topicDetails?: TopicDetail[];
  youtubeVideos?: YoutubeResource[];
  books?: Book[];
  learningPlan?: LearningPlanItem[];
};

const formatStepText = (step: unknown): string => {
  if (typeof step === "string") {
    return step;
  }

  if (step && typeof step === "object") {
    const candidate = step as {
      task?: unknown;
      practice?: unknown;
      rationale?: unknown;
    };

    const parts = [candidate.task, candidate.practice, candidate.rationale]
      .filter(
        (part): part is string =>
          typeof part === "string" && part.trim().length > 0,
      )
      .map((part) => part.trim());

    if (parts.length > 0) {
      return parts.join(" - ");
    }
  }

  return "Study checkpoint";
};

const getStudyPlanCount = (studyPlan?: TopicDetail["studyPlan"]): number => {
  if (!Array.isArray(studyPlan)) {
    return 0;
  }
  return studyPlan.length;
};

const hasDetailedStudyPlan = (
  studyPlan?: TopicDetail["studyPlan"],
): boolean => {
  if (!Array.isArray(studyPlan)) {
    return false;
  }

  return studyPlan.some((step) => typeof step === "object" && step !== null);
};

const getVideoThumbnailUrl = (video: YoutubeResource): string | undefined => {
  if (video.youtubeThumbnailUrl) {
    return video.youtubeThumbnailUrl;
  }

  if (video.youtubeVideoId) {
    return `https://i.ytimg.com/vi/${video.youtubeVideoId}/hqdefault.jpg`;
  }

  return undefined;
};

type CourseRecord = {
  course_id: string;
  name: string;
  desc?: string;
  course_code?: string;
  college_id?: string;
  coursePlan?: CoursePlanData;
};

const PHASE_COLORS = [
  {
    bg: "rgba(99,102,241,0.08)",
    border: "#818CF8",
    text: "#818CF8",
    badge: "#6366F1",
  },
  {
    bg: "rgba(74,222,128,0.08)",
    border: "#4ADE80",
    text: "#4ADE80",
    badge: "#22C55E",
  },
  {
    bg: "rgba(251,146,60,0.08)",
    border: "#FB923C",
    text: "#FB923C",
    badge: "#F97316",
  },
  {
    bg: "rgba(192,132,252,0.08)",
    border: "#C084FC",
    text: "#C084FC",
    badge: "#A855F7",
  },
  {
    bg: "rgba(56,189,248,0.08)",
    border: "#38BDF8",
    text: "#38BDF8",
    badge: "#0EA5E9",
  },
  {
    bg: "rgba(251,113,133,0.08)",
    border: "#FB7185",
    text: "#FB7185",
    badge: "#F43F5E",
  },
];

type TabId = "roadmap" | "topics" | "videos" | "books";

function EmptyState({ text }: { text: string }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 14,
        color: "var(--mist)",
        lineHeight: 1.6,
      }}
    >
      {text}
    </p>
  );
}

function TabButton({
  isActive,
  onClick,
  icon,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "10px 12px",
        background: isActive ? "var(--deep)" : "transparent",
        border: "none",
        borderRadius: 10,
        boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? "#818CF8" : "var(--mist)",
        transition: "all 0.2s ease",
      }}
    >
      {icon}
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
    </button>
  );
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<CourseRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>("roadmap");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const response = await api.get(`/course/${courseId}`);
      const payload = response.data?.data ?? response.data;

      if (!payload) {
        setNotFound(true);
        return;
      }

      setCourse(payload as CourseRecord);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
        return;
      }
      setError("Unable to load course details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const plan = useMemo(() => {
    const rawPlan =
      course?.coursePlan ||
      (course as any)?.course_plan ||
      (course as any)?.plan;
    if (!rawPlan) return null;

    const normalized = {
      importantTopics:
        rawPlan.importantTopics || rawPlan.important_topics || [],
      timelineRoadmap:
        rawPlan.timelineRoadmap ||
        rawPlan.roadmap ||
        rawPlan.units ||
        rawPlan.phases ||
        [],
      topicDetails: rawPlan.topicDetails || rawPlan.topic_details || [],
      youtubeVideos:
        rawPlan.youtubeVideos ||
        rawPlan.videos ||
        rawPlan.youtube_resources ||
        [],
      books: rawPlan.books || rawPlan.reading_list || [],
      learningPlan:
        rawPlan.learningPlan ||
        rawPlan.learning_plan ||
        rawPlan.timelineRoadmap ||
        [],
    };

    // Debug logging
    if (normalized.books && normalized.books.length > 0) {
      console.log("📚 Course books loaded:", normalized.books.length);
    }

    return normalized;
  }, [course]);

  const stats = useMemo(() => {
    return {
      phases: plan?.timelineRoadmap?.length ?? 0,
      topics: plan?.importantTopics?.length ?? 0,
      videos: plan?.youtubeVideos?.length ?? 0,
      books: plan?.books?.length ?? 0,
    };
  }, [plan]);

  if (loading) {
    return (
      <div
        style={{
          background: "var(--deep)",
          borderRadius: 20,
          padding: 40,
          color: "var(--mist)",
          fontFamily: "var(--font-body)",
        }}
      >
        Loading course details...
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        style={{
          background: "var(--deep)",
          borderRadius: 20,
          padding: 40,
          textAlign: "center",
          boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            color: "var(--ink)",
            marginBottom: 10,
          }}
        >
          Course not found
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--mist)",
            marginBottom: 20,
          }}
        >
          This course may have been deleted or the URL is invalid.
        </p>
        <button
          onClick={() => router.push("/course")}
          className="btn-primary"
          style={{ borderRadius: 999 }}
        >
          <ArrowLeft size={14} /> Back to My Courses
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "var(--deep)",
          borderRadius: 20,
          padding: 40,
          textAlign: "center",
          boxShadow: "0 2px 16px rgba(77,63,255,0.06)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            color: "var(--ink)",
            marginBottom: 10,
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--mist)",
            marginBottom: 20,
          }}
        >
          {error}
        </p>
        <button
          onClick={fetchCourse}
          className="btn-primary"
          style={{ borderRadius: 999 }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!course || !plan) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => router.push("/course")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            background: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "#4D3FFF",
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> My Courses
        </button>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          background: "var(--deep)",
          borderRadius: 20,
          border: "1px solid var(--border-light)",
          boxShadow: "0 2px 20px rgba(77,63,255,0.07)",
          padding: isMobile ? "20px" : "26px 28px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
          >
            <div
              style={{
                width: isMobile ? 36 : 44,
                height: isMobile ? 36 : 44,
                borderRadius: isMobile ? 10 : 14,
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <GraduationCap size={isMobile ? 18 : 22} color="#fff" />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: isMobile ? 22 : 28,
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 1.2,
                  margin: 0,
                  wordBreak: "break-word",
                }}
              >
                {course.name}
              </h1>
              {!isMobile && (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--mist)",
                    margin: "2px 0 0",
                  }}
                >
                  {stats.phases} phases · {stats.topics} key topics ·{" "}
                  {stats.videos} videos · {stats.books} books
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              width: isMobile ? "100%" : "auto",
              marginTop: isMobile ? 12 : 0,
            }}
          >
            <button
              onClick={() => router.push(`/course/${course.course_id}/study`)}
              className="btn-primary"
              style={{
                borderRadius: 12,
                padding: isMobile ? "12px 24px" : "10px 24px",
                fontSize: 14,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "linear-gradient(135deg, #4D3FFF 0%, #7B70FF 100%)",
                border: "none",
                boxShadow: "0 4px 12px rgba(77, 63, 255, 0.25)",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <Play size={16} fill="currentColor" />
              Study Now
            </button>
            {isMobile && (
              <p
                style={{
                  fontSize: 11,
                  color: "var(--mist)",
                  margin: "8px 0 0",
                  textAlign: "center",
                }}
              >
                {stats.phases} phases · {stats.topics} topics
              </p>
            )}
          </div>
        </div>

        {course.desc ? (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--mist)",
              lineHeight: 1.7,
              marginBottom: 14,
            }}
          >
            {course.desc}
          </p>
        ) : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(plan.importantTopics || []).map((topic: string, idx: number) => (
            <span
              key={`${topic}-${idx}`}
              style={{
                padding: "5px 12px",
                borderRadius: 999,
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                fontSize: 12,
                color: "#4338CA",
                fontWeight: 500,
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      </motion.div>

      <div
        style={{
          display: "flex",
          gap: 4,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          padding: 4,
          overflowX: isMobile ? "auto" : "visible",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <TabButton
          isActive={activeTab === "roadmap"}
          onClick={() => setActiveTab("roadmap")}
          icon={<Calendar size={15} />}
          label="Learning Roadmap"
        />
        <TabButton
          isActive={activeTab === "topics"}
          onClick={() => setActiveTab("topics")}
          icon={<Layers size={15} />}
          label="Topic Deep Dives"
        />
        <TabButton
          isActive={activeTab === "videos"}
          onClick={() => setActiveTab("videos")}
          icon={<Play size={15} />}
          label="Video Resources"
        />
        <TabButton
          isActive={activeTab === "books"}
          onClick={() => setActiveTab("books")}
          icon={<BookOpen size={15} />}
          label="Reading List"
        />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "roadmap" && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {(plan.timelineRoadmap || []).length === 0 ? (
              <div
                style={{
                  background: "var(--deep)",
                  borderRadius: 16,
                  border: "1px solid var(--border-light)",
                  padding: 18,
                }}
              >
                <EmptyState text="No roadmap phases available." />
              </div>
            ) : (
              ((plan.timelineRoadmap || []) as TimelinePhase[]).map(
                (phase, idx) => {
                  const color = PHASE_COLORS[idx % PHASE_COLORS.length];
                  const isOpen = expandedPhase === idx;
                  const weekLabel =
                    plan.learningPlan?.[idx]?.week || `Phase ${idx + 1}`;

                  return (
                    <div
                      key={`${phase.phase || "phase"}-${idx}`}
                      style={{
                        borderRadius: 16,
                        border: `1px solid ${isOpen ? color.border : "#E5E7EB"}`,
                        background: "var(--deep)",
                        boxShadow: isOpen
                          ? `0 8px 24px ${color.badge}1A`
                          : "0 1px 4px rgba(0,0,0,0.05)",
                        overflow: "hidden",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <button
                        onClick={() => setExpandedPhase(isOpen ? null : idx)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          padding: "16px 18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              color: color.badge,
                              textTransform: "uppercase",
                              marginBottom: 4,
                            }}
                          >
                            {weekLabel}
                          </p>
                          <h3
                            style={{
                              fontSize: 17,
                              fontWeight: 700,
                              color: "var(--ink)",
                              margin: 0,
                            }}
                          >
                            {phase.phase || `Phase ${idx + 1}`}
                          </h3>
                        </div>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: isOpen
                              ? color.bg
                              : "rgba(255,255,255,0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isOpen ? (
                            <ChevronUp size={14} color={color.badge} />
                          ) : (
                            <ChevronDown size={14} color="#9CA3AF" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${color.border}40`,
                                padding: "14px 18px 18px",
                              }}
                            >
                              {phase.detailedGuidance ? (
                                <p
                                  style={{
                                    fontSize: 14,
                                    color: "var(--mist)",
                                    lineHeight: 1.7,
                                    marginBottom: 12,
                                  }}
                                >
                                  {phase.detailedGuidance}
                                </p>
                              ) : null}

                              {(phase.keyConcepts || []).length > 0 ? (
                                <div style={{ marginBottom: 10 }}>
                                  <p
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: "var(--mist)",
                                      marginBottom: 6,
                                    }}
                                  >
                                    Key Concepts
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 6,
                                    }}
                                  >
                                    {(phase.keyConcepts || []).map(
                                      (concept, cIdx) => (
                                        <span
                                          key={`${concept}-${cIdx}`}
                                          style={{
                                            padding: "4px 10px",
                                            background: color.bg,
                                            border: `1px solid ${color.border}40`,
                                            borderRadius: 8,
                                            fontSize: 12,
                                            color: color.text,
                                          }}
                                        >
                                          {concept}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                </div>
                              ) : null}

                              {(phase.actionSteps || []).length > 0 ? (
                                <div>
                                  <p
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: "var(--mist)",
                                      marginBottom: 6,
                                    }}
                                  >
                                    Action Steps
                                  </p>
                                  <ul
                                    style={{
                                      margin: 0,
                                      paddingLeft: 18,
                                      color: "var(--mist)",
                                      fontSize: 13,
                                    }}
                                  >
                                    {(phase.actionSteps || []).map(
                                      (step, sIdx) => {
                                        const stepText = formatStepText(step);
                                        return (
                                          <li key={`${stepText}-${sIdx}`}>
                                            {stepText}
                                          </li>
                                        );
                                      },
                                    )}
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                },
              )
            )}
          </motion.div>
        )}

        {activeTab === "topics" && (
          <motion.div
            key="topics"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {(plan.topicDetails || []).length === 0 ? (
              <div
                style={{
                  background: "var(--deep)",
                  borderRadius: 16,
                  border: "1px solid var(--border-light)",
                  padding: 18,
                }}
              >
                <EmptyState text="No topic deep-dive data available." />
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {((plan.topicDetails || []) as TopicDetail[]).map(
                  (topic, idx) => {
                    const isOpen = expandedTopic === idx;
                    return (
                      <div
                        key={`${topic.topic || "topic"}-${idx}`}
                        style={{
                          border: "1px solid rgba(9,9,15,0.08)",
                          borderRadius: 14,
                          background: "var(--deep)",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          onClick={() => setExpandedTopic(isOpen ? null : idx)}
                          style={{
                            width: "100%",
                            border: "none",
                            background: "transparent",
                            textAlign: "left",
                            padding: "14px 16px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "var(--ink)",
                                margin: 0,
                              }}
                            >
                              {topic.topic || `Topic ${idx + 1}`}
                            </p>
                            <p
                              style={{
                                fontSize: 12,
                                color: "var(--mist)",
                                marginTop: 4,
                              }}
                            >
                              {(topic.keyConcepts || []).length} key concepts ·{" "}
                              {getStudyPlanCount(topic.studyPlan)} study steps
                            </p>
                          </div>
                          {isOpen ? (
                            <ChevronUp size={16} color="#6B7280" />
                          ) : (
                            <ChevronDown size={16} color="#6B7280" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              style={{ overflow: "hidden" }}
                            >
                              <div
                                style={{
                                  borderTop: "1px solid rgba(9,9,15,0.08)",
                                  padding: "12px 16px",
                                }}
                              >
                                {topic.overview ? (
                                  <p
                                    style={{
                                      fontSize: 13,
                                      color: "var(--mist)",
                                      lineHeight: 1.6,
                                      marginBottom: 8,
                                    }}
                                  >
                                    {topic.overview}
                                  </p>
                                ) : null}

                                {(topic.keyConcepts || []).length > 0 ? (
                                  <p
                                    style={{
                                      fontSize: 13,
                                      color: "var(--mist)",
                                      marginBottom: 6,
                                    }}
                                  >
                                    <strong>Key Concepts:</strong>{" "}
                                    {(topic.keyConcepts || []).join(", ")}
                                  </p>
                                ) : null}

                                {(topic.prerequisites || []).length > 0 ? (
                                  <p
                                    style={{
                                      fontSize: 13,
                                      color: "#374151",
                                      marginBottom: 6,
                                    }}
                                  >
                                    <strong>Prerequisites:</strong>{" "}
                                    {(topic.prerequisites || []).join(", ")}
                                  </p>
                                ) : null}

                                {(topic.studyPlan || []).length > 0 ? (
                                  <div>
                                    <p
                                      style={{
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: "var(--mist)",
                                        marginBottom: 4,
                                      }}
                                    >
                                      Study Plan
                                    </p>
                                    {hasDetailedStudyPlan(topic.studyPlan) ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 8,
                                        }}
                                      >
                                        {(topic.studyPlan || []).map(
                                          (step, sIdx) => {
                                            if (
                                              typeof step === "string" ||
                                              !step
                                            ) {
                                              return (
                                                <div
                                                  key={`study-step-${sIdx}`}
                                                  style={{
                                                    border:
                                                      "1px solid rgba(9,9,15,0.08)",
                                                    borderRadius: 10,
                                                    padding: "10px 12px",
                                                    background:
                                                      "rgba(99,102,241,0.04)",
                                                    fontSize: 13,
                                                    color: "var(--mist)",
                                                  }}
                                                >
                                                  {typeof step === "string"
                                                    ? step
                                                    : "Study this checkpoint"}
                                                </div>
                                              );
                                            }

                                            return (
                                              <div
                                                key={`study-step-${sIdx}`}
                                                style={{
                                                  border:
                                                    "1px solid rgba(9,9,15,0.08)",
                                                  borderRadius: 10,
                                                  padding: "10px 12px",
                                                  background:
                                                    "rgba(99,102,241,0.04)",
                                                }}
                                              >
                                                {step.task ? (
                                                  <p
                                                    style={{
                                                      fontSize: 13,
                                                      color: "var(--ink)",
                                                      marginBottom: 6,
                                                      fontWeight: 600,
                                                    }}
                                                  >
                                                    {step.task}
                                                  </p>
                                                ) : null}
                                                {step.practice ? (
                                                  <p
                                                    style={{
                                                      fontSize: 12,
                                                      color: "var(--mist)",
                                                      marginBottom: 4,
                                                      lineHeight: 1.6,
                                                    }}
                                                  >
                                                    <strong>Practice:</strong>{" "}
                                                    {step.practice}
                                                  </p>
                                                ) : null}
                                                {step.rationale ? (
                                                  <p
                                                    style={{
                                                      fontSize: 12,
                                                      color: "var(--mist)",
                                                      lineHeight: 1.6,
                                                    }}
                                                  >
                                                    <strong>Why:</strong>{" "}
                                                    {step.rationale}
                                                  </p>
                                                ) : null}
                                              </div>
                                            );
                                          },
                                        )}
                                      </div>
                                    ) : (
                                      <ul
                                        style={{
                                          margin: 0,
                                          paddingLeft: 18,
                                          color: "var(--mist)",
                                          fontSize: 13,
                                        }}
                                      >
                                        {(topic.studyPlan || []).map(
                                          (step, sIdx) => (
                                            <li key={`study-step-${sIdx}`}>
                                              {typeof step === "string"
                                                ? step
                                                : step?.task ||
                                                  "Study this checkpoint"}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "videos" && (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {(plan.youtubeVideos || []).length === 0 ? (
              <div
                style={{
                  background: "var(--deep)",
                  borderRadius: 16,
                  border: "1px solid var(--border-light)",
                  padding: 18,
                }}
              >
                <EmptyState text="No video resources available." />
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 12,
                }}
              >
                {((plan.youtubeVideos || []) as YoutubeResource[]).map(
                  (video, idx) => {
                    const thumbnailUrl = getVideoThumbnailUrl(video);

                    return (
                      <div
                        key={`${video.title || "video"}-${idx}`}
                        style={{
                          border: "1px solid rgba(239,68,68,0.2)",
                          background: "var(--deep)",
                          borderRadius: 12,
                          padding: 12,
                        }}
                      >
                        {video.youtubeUrl ? (
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "block",
                              borderRadius: 10,
                              overflow: "hidden",
                              marginBottom: 10,
                              border: "1px solid rgba(9,9,15,0.08)",
                              background: "rgba(255,255,255,0.04)",
                            }}
                          >
                            {thumbnailUrl ? (
                              <img
                                src={thumbnailUrl}
                                alt={video.title || "Video thumbnail"}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  height: 160,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  height: 160,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 8,
                                  color: "#6B7280",
                                  fontSize: 13,
                                }}
                              >
                                <Play size={16} />
                                Thumbnail unavailable
                              </div>
                            )}
                          </a>
                        ) : null}
                        <p
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--ink)",
                            marginBottom: 4,
                          }}
                        >
                          {video.title || "Untitled video"}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--mist)",
                            marginBottom: 8,
                          }}
                        >
                          {(video.channel || "Unknown channel") +
                            (video.topic ? ` · ${video.topic}` : "")}
                        </p>
                        {video.whyWatch ? (
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--mist)",
                              marginBottom: 8,
                              lineHeight: 1.6,
                            }}
                          >
                            {video.whyWatch}
                          </p>
                        ) : null}
                        {video.youtubeUrl ? (
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#DC2626",
                              textDecoration: "none",
                            }}
                          >
                            Watch on YouTube <ExternalLink size={13} />
                          </a>
                        ) : null}
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "books" && (
          <motion.div
            key="books"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {(plan.books || []).length === 0 &&
            (!plan.learningPlan || plan.learningPlan.length === 0) ? (
              <div
                style={{
                  background: "var(--deep)",
                  borderRadius: 16,
                  border: "1px solid rgba(245,166,35,0.16)",
                  padding: 18,
                  boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                }}
              >
                <EmptyState text="No reading list or learning plan available." />
              </div>
            ) : null}

            {(plan.books || []).length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 12,
                }}
              >
                {((plan.books || []) as Book[]).map((book, idx) =>
                  (() => {
                    const color = PHASE_COLORS[idx % PHASE_COLORS.length];
                    const thumbnailUrl = book.thumbnail;

                    return (
                      <motion.a
                        key={`${book.title || "book"}-${idx}`}
                        href={book.searchUrl || (book as any).url || "#"}
                        target={
                          book.searchUrl || (book as any).url
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          book.searchUrl || (book as any).url
                            ? "noreferrer"
                            : undefined
                        }
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ x: 4 }}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          textDecoration: "none",
                          cursor:
                            book.searchUrl || (book as any).url
                              ? "pointer"
                              : "default",
                          border: "1px solid rgba(245,166,35,0.18)",
                          background: "var(--deep)",
                          borderRadius: 18,
                          padding: 0,
                          boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                          backdropFilter: "blur(14px)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            paddingTop: "56.25%",
                            background: "rgba(245,166,35,0.08)",
                            overflow: "hidden",
                            borderBottom: "1px solid rgba(245,166,35,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={book.title || "Book cover"}
                              loading="lazy"
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: `linear-gradient(135deg, ${color.badge}22, ${color.badge}10)`,
                              }}
                            >
                              <BookOpen size={26} color={color.badge} />
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            padding: "14px 16px 16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: 10,
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  letterSpacing: "0.05em",
                                  color:
                                    PHASE_COLORS[idx % PHASE_COLORS.length]
                                      .badge,
                                  textTransform: "uppercase",
                                  display: "block",
                                  marginBottom: 4,
                                }}
                              >
                                {book.topic || "Reading"}
                              </span>
                              <h4
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: "var(--ink)",
                                  margin: 0,
                                  lineHeight: 1.35,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {book.title || "Untitled reference"}
                              </h4>
                              <p
                                style={{
                                  fontSize: 12,
                                  color: "var(--mist)",
                                  margin: "5px 0 0",
                                  lineHeight: 1.45,
                                }}
                              >
                                {[
                                  book.author &&
                                  book.author.toLowerCase() !== "unknown"
                                    ? book.author
                                    : null,
                                  book.isbn ? `ISBN: ${book.isbn}` : null,
                                ]
                                  .filter(Boolean)
                                  .join(" · ") || "Open Library recommendation"}
                              </p>
                            </div>
                            <ExternalLink
                              size={14}
                              color={
                                PHASE_COLORS[idx % PHASE_COLORS.length].badge
                              }
                              style={{ flexShrink: 0, marginTop: 4 }}
                            />
                          </div>

                          {book.reason ? (
                            <p
                              style={{
                                fontSize: 12,
                                color: "#475569",
                                margin: "8px 0 0",
                                lineHeight: 1.55,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {book.reason}
                            </p>
                          ) : null}

                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 12,
                              padding: "6px 10px",
                              borderRadius: 999,
                              background: `${PHASE_COLORS[idx % PHASE_COLORS.length].badge}14`,
                              color:
                                PHASE_COLORS[idx % PHASE_COLORS.length].badge,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            Open in Open Library
                          </div>
                        </div>
                      </motion.a>
                    );
                  })(),
                )}
              </div>
            ) : null}

            {(plan.learningPlan || []).length > 0 ? (
              <div
                style={{
                  border: "1px solid rgba(9,9,15,0.08)",
                  borderRadius: 14,
                  background: "var(--deep)",
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Target size={15} color="#4D3FFF" />
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    Weekly Learning Plan
                  </p>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {((plan.learningPlan || []) as LearningPlanItem[]).map(
                    (item, idx) => (
                      <div
                        key={`${item.week || "week"}-${idx}`}
                        style={{
                          border: "1px solid rgba(99,102,241,0.18)",
                          borderRadius: 10,
                          padding: "10px 12px",
                          background: "rgba(99,102,241,0.04)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#3730A3",
                            marginBottom: 4,
                          }}
                        >
                          {(item.week || `Week ${idx + 1}`) +
                            (item.focus ? ` - ${item.focus}` : "")}
                        </p>
                        {(item.outcomes || []).length > 0 ? (
                          <p
                            style={{
                              fontSize: 12,
                              color: "var(--mist)",
                              marginBottom: 4,
                            }}
                          >
                            <strong>Outcomes:</strong>{" "}
                            {(item.outcomes || []).join(", ")}
                          </p>
                        ) : null}
                        {(item.tasks || []).length > 0 ? (
                          <p style={{ fontSize: 12, color: "var(--mist)" }}>
                            <strong>Tasks:</strong>{" "}
                            {(item.tasks || []).join(", ")}
                          </p>
                        ) : null}
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
