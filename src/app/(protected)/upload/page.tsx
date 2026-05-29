"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  BookOpen,
  Play,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Layers,
  Star,
  ExternalLink,
  GraduationCap,
  BarChart2,
  Calendar,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { trackAnalyticsEvent } from "@/lib/analytics";

// import LeftPanel from "@/components/LeftPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadState = "idle" | "uploading" | "processing" | "done" | "error";

interface ProcessingStep {
  icon: string;
  label: string;
  done: boolean;
  active: boolean;
}

interface YoutubeResource {
  topic: string;
  title: string;
  channel: string;
  youtubeVideoId: string;
  whyWatch: string;
  youtubeUrl: string;
  youtubeThumbnailUrl: string;
  publishedYear: number;
}

interface Book {
  topic: string;
  title: string;
  author?: string;
  isbn?: string;
  reason: string;
  searchUrl: string;
  thumbnail?: string;
}

interface TimelinePhase {
  phase: string;
  shortDescription: string;
  detailedGuidance: string;
  actionSteps: string[];
  keyConcepts: string[];
  youtubeResources: YoutubeResource[];
  books: Book[];
}

interface TopicDetail {
  topic: string;
  overview: string;
  keyConcepts: string[];
  prerequisites: string[];
  studyPlan: string[];
}

interface CoursePlanData {
  importantTopics: string[];
  timelineRoadmap: TimelinePhase[];
  topicDetails: TopicDetail[];
  youtubeVideos: YoutubeResource[];
  books: Book[];
  learningPlan: {
    week: string;
    focus: string;
    outcomes: string[];
    tasks: string[];
  }[];
  createdCourseId?: string | null;
}

type RoadmapPreviewData = Pick<CoursePlanData, "importantTopics"> & {
  roadmap: Array<{
    phase: string;
    topics: string[];
  }>;
  timelineRoadmap?: TimelinePhase[];
  topicDetails?: TopicDetail[];
  topicCount: number;
  phases: number;
  youtubeVideos?: YoutubeResource[];
  books?: Book[];
};

const INITIAL_STEPS: ProcessingStep[] = [
  { icon: "📄", label: "Reading syllabus...", done: false, active: false },
  {
    icon: "🧠",
    label: "Extracting core topics...",
    done: false,
    active: false,
  },
  {
    icon: "🗺️",
    label: "Building learning roadmap...",
    done: false,
    active: false,
  },
  {
    icon: "✨",
    label: "Preparing recommendations...",
    done: false,
    active: false,
  },
  { icon: "✅", label: "Finalizing...", done: false, active: false },
];

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXT = [".pdf", ".docx"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Phase accent colors ──────────────────────────────────────────────────────
const PHASE_COLORS = [
  { bg: "#EEF2FF", border: "#818CF8", text: "#4338CA", badge: "#6366F1" },
  { bg: "#F0FDF4", border: "#4ADE80", text: "#166534", badge: "#22C55E" },
  { bg: "#FFF7ED", border: "#FB923C", text: "#9A3412", badge: "#F97316" },
  { bg: "#FDF4FF", border: "#C084FC", text: "#7E22CE", badge: "#A855F7" },
  { bg: "#F0F9FF", border: "#38BDF8", text: "#0C4A6E", badge: "#0EA5E9" },
  { bg: "#FFF1F2", border: "#FB7185", text: "#9F1239", badge: "#F43F5E" },
  { bg: "#ECFDF5", border: "#34D399", text: "#064E3B", badge: "#10B981" },
];

// ─── Results Display ──────────────────────────────────────────────────────────

function CoursePlanResults({ data }: { data: CoursePlanData }) {
  const [activeTab, setActiveTab] = useState<
    "roadmap" | "topics" | "videos" | "books"
  >("roadmap");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tabs = [
    { id: "roadmap", label: "Learning Roadmap", icon: <Calendar size={15} /> },
    { id: "topics", label: "Topic Deep Dives", icon: <Layers size={15} /> },
    { id: "videos", label: "Video Resources", icon: <Play size={15} /> },
    { id: "books", label: "Reading List", icon: <BookOpen size={15} /> },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        maxWidth: "1440px",
        padding: isMobile ? "0 4px" : "0",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: "28px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap size={22} color="#fff" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display, 'Georgia', serif)",
                fontSize: isMobile ? "22px" : "26px",
                fontWeight: 700,
                color: "var(--ink, #0d0d14)",
                margin: 0,
                letterSpacing: "-0.025em",
              }}
            >
              Your Course Plan
            </h1>

            <p
              style={{
                fontSize: "13px",
                color: "var(--mist, #8B8FA8)",
                margin: 0,
                marginTop: "2px",
              }}
            >
              {data.learningPlan?.length || 0} phases ·{" "}
              {data.importantTopics?.length || 0} key topics ·{" "}
              {data.youtubeVideos?.length || 0} videos ·{" "}
              {data.books?.length || 0} books
            </p>
          </div>
        </div>

        {/* Key Topics Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          {data.importantTopics.map((topic, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.04 }}
              style={{
                padding: "5px 13px",
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#4338CA",
                cursor: "default",
              }}
            >
              {topic}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Tab Bar */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          background: "rgba(0,0,0,0.04)",
          borderRadius: "14px",
          padding: "4px",
          overflowX: isMobile ? "auto" : "visible",
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: isMobile ? "0 0 auto" : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: isMobile ? "9px 16px" : "9px 10px",
              background: activeTab === tab.id ? "var(--deep)" : "transparent",
              border:
                activeTab === tab.id ? "1px solid var(--border-light)" : "none",
              boxShadow:
                activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#4338CA" : "var(--mist)",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {tab.icon}
            <span
              style={{
                display: isMobile
                  ? activeTab === tab.id
                    ? "inline"
                    : "none"
                  : "inline",
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ ROADMAP TAB ═══ */}
        {activeTab === "roadmap" && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* Timeline */}
            <div style={{ position: "relative" }}>
              {/* Vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: isMobile ? "17px" : "23px",
                  top: "28px",
                  bottom: "28px",
                  width: "2px",
                  background:
                    "linear-gradient(to bottom, #6366F1, #A78BFA, transparent)",
                  opacity: 0.3,
                }}
              />

              {data.timelineRoadmap.map((phase, idx) => {
                const color = PHASE_COLORS[idx % PHASE_COLORS.length];
                const isOpen = expandedPhase === idx;
                const weekLabel =
                  data.learningPlan[idx]?.week || `Phase ${idx + 1}`;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        flexShrink: 0,
                        paddingTop: isMobile ? "12px" : "16px",
                      }}
                    >
                      <div
                        style={{
                          width: isMobile ? "36px" : "48px",
                          height: isMobile ? "36px" : "48px",
                          borderRadius: "50%",
                          background: color.badge,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 0 0 4px ${color.bg}, 0 0 0 5px ${color.border}30`,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <span
                          style={{
                            fontSize: isMobile ? "12px" : "14px",
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      style={{
                        flex: 1,
                        background: "var(--deep)",
                        borderRadius: "16px",
                        border: `1px solid ${isOpen ? color.border : "var(--border-light)"}`,
                        overflow: "hidden",
                        boxShadow: isOpen
                          ? `0 8px 24px ${color.badge}1A`
                          : "0 1px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <button
                        onClick={() => setExpandedPhase(isOpen ? null : idx)}
                        style={{
                          width: "100%",
                          padding: isMobile ? "12px 14px" : "16px 20px",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                letterSpacing: "0.06em",
                                color: color.badge,
                                textTransform: "uppercase",
                              }}
                            >
                              {weekLabel}
                            </span>
                          </div>
                          <h3
                            style={{
                              fontSize: isMobile ? "14px" : "16px",
                              fontWeight: 700,
                              color: "var(--ink)",
                              margin: 0,
                              lineHeight: 1.3,
                            }}
                          >
                            {phase.phase}
                          </h3>
                        </div>
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: isOpen ? color.bg : "#F9FAFB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.2s",
                          }}
                        >
                          {isOpen ? (
                            <ChevronUp size={12} color={color.badge} />
                          ) : (
                            <ChevronDown size={12} color="#9CA3AF" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              style={{
                                padding: "0 20px 20px",
                                borderTop: `1px solid ${color.border}30`,
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "var(--ink)",
                                  opacity: 0.8,
                                  lineHeight: 1.7,
                                  marginBottom: "16px",
                                  paddingTop: "14px",
                                }}
                              >
                                {phase.detailedGuidance}
                              </p>

                              {/* Key Concepts */}
                              {phase.keyConcepts.length > 0 && (
                                <div style={{ marginBottom: "16px" }}>
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      color: "#9CA3AF",
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    Key Concepts
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "6px",
                                    }}
                                  >
                                    {phase.keyConcepts.map((kc, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          padding: "4px 10px",
                                          background: color.bg,
                                          border: `1px solid ${color.border}40`,
                                          borderRadius: "6px",
                                          fontSize: "12px",
                                          color: color.text,
                                          fontWeight: 500,
                                        }}
                                      >
                                        {kc}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Action Steps */}
                              {phase.actionSteps.length > 0 && (
                                <div style={{ marginBottom: "16px" }}>
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      color: "#9CA3AF",
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    Action Steps
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "6px",
                                    }}
                                  >
                                    {phase.actionSteps.map((step, i) => (
                                      <div
                                        key={i}
                                        style={{
                                          display: "flex",
                                          gap: "10px",
                                          alignItems: "flex-start",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            background: color.badge,
                                            flexShrink: 0,
                                            marginTop: "1px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "10px",
                                              fontWeight: 700,
                                              color: "#fff",
                                            }}
                                          >
                                            {i + 1}
                                          </span>
                                        </div>
                                        <span
                                          style={{
                                            fontSize: "13px",
                                            color: "#374151",
                                            lineHeight: 1.6,
                                          }}
                                        >
                                          {step}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Inline videos for this phase */}
                              {phase.youtubeResources.length > 0 && (
                                <div>
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      color: "#9CA3AF",
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    Recommended Videos
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "8px",
                                    }}
                                  >
                                    {phase.youtubeResources.map((vid, i) => (
                                      <a
                                        key={i}
                                        href={vid.youtubeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          display: "flex",
                                          gap: "10px",
                                          alignItems: "center",
                                          padding: "10px 12px",
                                          background: "#FEF2F2",
                                          border: "1px solid #FECACA",
                                          borderRadius: "10px",
                                          textDecoration: "none",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "8px",
                                            background: "#EF4444",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                          }}
                                        >
                                          <Play
                                            size={14}
                                            color="#fff"
                                            fill="#fff"
                                          />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <p
                                            style={{
                                              fontSize: "13px",
                                              fontWeight: 600,
                                              color: "#111827",
                                              margin: 0,
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {vid.title}
                                          </p>
                                          <p
                                            style={{
                                              fontSize: "11px",
                                              color: "#9CA3AF",
                                              margin: 0,
                                            }}
                                          >
                                            {vid.channel} · {vid.publishedYear}
                                          </p>
                                        </div>
                                        <ExternalLink
                                          size={13}
                                          color="#9CA3AF"
                                        />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══ TOPICS TAB ═══ */}
        {activeTab === "topics" && (
          <motion.div
            key="topics"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {data.topicDetails.map((topic, idx) => {
                const color = PHASE_COLORS[idx % PHASE_COLORS.length];
                const isOpen = expandedTopic === idx;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      background: "var(--deep)",
                      borderRadius: "16px",
                      border: `1px solid ${isOpen ? color.border : "var(--border-light)"}`,
                      overflow: "hidden",
                      boxShadow: isOpen
                        ? `0 8px 24px ${color.badge}18`
                        : "0 1px 3px rgba(0,0,0,0.04)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <button
                      onClick={() => setExpandedTopic(isOpen ? null : idx)}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          background: color.bg,
                          border: `1px solid ${color.border}50`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Target size={18} color={color.badge} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "var(--ink)",
                            margin: 0,
                          }}
                        >
                          {topic.topic}
                        </h3>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#9CA3AF",
                            margin: 0,
                            marginTop: "2px",
                          }}
                        >
                          {topic.prerequisites.length > 0
                            ? `Requires: ${topic.prerequisites.join(", ")}`
                            : "No prerequisites"}
                        </p>
                      </div>
                      <div
                        style={{
                          padding: "3px 10px",
                          borderRadius: "999px",
                          background: color.bg,
                          border: `1px solid ${color.border}40`,
                          fontSize: "11px",
                          fontWeight: 600,
                          color: color.badge,
                          flexShrink: 0,
                        }}
                      >
                        {topic.keyConcepts.length} concepts
                      </div>
                      {isOpen ? (
                        <ChevronUp size={14} color={color.badge} />
                      ) : (
                        <ChevronDown size={14} color="#9CA3AF" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              padding: "0 20px 20px",
                              borderTop: `1px solid ${color.border}25`,
                            }}
                          >
                            <p
                              style={{
                                fontSize: "14px",
                                color: "#4B5563",
                                lineHeight: 1.75,
                                paddingTop: "14px",
                                marginBottom: "16px",
                              }}
                            >
                              {topic.overview}
                            </p>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "14px",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#9CA3AF",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    marginBottom: "8px",
                                  }}
                                >
                                  Key Concepts
                                </p>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                  }}
                                >
                                  {topic.keyConcepts.map((kc, i) => (
                                    <div
                                      key={i}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "7px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "6px",
                                          height: "6px",
                                          borderRadius: "50%",
                                          background: color.badge,
                                          flexShrink: 0,
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          color: "#374151",
                                        }}
                                      >
                                        {kc}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#9CA3AF",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    marginBottom: "8px",
                                  }}
                                >
                                  Study Plan
                                </p>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                  }}
                                >
                                  {topic.studyPlan.map((step, i) => (
                                    <div
                                      key={i}
                                      style={{
                                        display: "flex",
                                        gap: "8px",
                                        alignItems: "flex-start",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          fontWeight: 700,
                                          color: color.badge,
                                          flexShrink: 0,
                                          marginTop: "2px",
                                        }}
                                      >
                                        {i + 1}.
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          color: "#6B7280",
                                          lineHeight: 1.6,
                                        }}
                                      >
                                        {step}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══ VIDEOS TAB ═══ */}
        {activeTab === "videos" && (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {data.youtubeVideos.map((video, idx) => (
                <motion.a
                  key={idx}
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
                  }}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.25s ease",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      position: "relative",
                      paddingTop: "56.25%",
                      background: "#F3F4F6",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={video.youtubeThumbnailUrl}
                      alt={video.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "0")
                      }
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: "#EF4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Play size={20} color="#fff" fill="#fff" />
                      </div>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        padding: "3px 8px",
                        background: "rgba(0,0,0,0.7)",
                        borderRadius: "4px",
                        fontSize: "10px",
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    >
                      {video.publishedYear}
                    </div>
                  </div>

                  {/* Info */}
                  <div
                    style={{
                      padding: "14px 16px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "#6366F1",
                        textTransform: "uppercase",
                      }}
                    >
                      {video.topic}
                    </span>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#111827",
                        margin: 0,
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {video.title}
                    </h4>
                    <p
                      style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}
                    >
                      {video.channel}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6B7280",
                        margin: 0,
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {video.whyWatch}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ BOOKS TAB ═══ */}
        {activeTab === "books" && (
          <motion.div
            key="books"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {!data.books || data.books.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 18px",
                  background: "rgba(255,255,255,0.78)",
                  borderRadius: "16px",
                  border: "1px solid rgba(77,63,255,0.12)",
                  boxShadow: "0 10px 30px rgba(77,63,255,0.06)",
                }}
              >
                <BookOpen
                  size={32}
                  style={{ margin: "0 auto 12px", color: "#C7D2FE" }}
                />
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  No reading list available for this course plan.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "12px",
                }}
              >
                {data.books.map((book, idx) => {
                  const color = PHASE_COLORS[idx % PHASE_COLORS.length];
                  const thumbnailUrl = book.thumbnail;
                  return (
                    <motion.a
                      key={idx}
                      href={book.searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 4 }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(255,255,255,0.78)",
                        border: "1px solid rgba(245,166,35,0.18)",
                        borderRadius: "18px",
                        textDecoration: "none",
                        cursor: "pointer",
                        boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                        transition: "all 0.2s ease",
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
                            alt={book.title}
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
                            gap: "10px",
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                color: color.badge,
                                textTransform: "uppercase",
                                display: "block",
                                marginBottom: "4px",
                              }}
                            >
                              {book.topic}
                            </span>
                            <h4
                              style={{
                                fontSize: "15px",
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
                              {book.title}
                            </h4>
                            <p
                              style={{
                                fontSize: "12px",
                                color: "var(--mist, #8B8FA8)",
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
                            color={color.badge}
                            style={{ flexShrink: 0, marginTop: "4px" }}
                          />
                        </div>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#475569",
                            margin: 0,
                            marginTop: "8px",
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
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            marginTop: "12px",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: `${color.badge}14`,
                            color: color.badge,
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          Open in Open Library
                        </div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            marginTop: "12px",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: `${color.badge}14`,
                            color: color.badge,
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          Open in Open Library
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Upload Page ─────────────────────────────────────────────────────────

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(
    "Upload failed. Please try again.",
  );
  const [streamStatus, setStreamStatus] = useState(
    "Waiting for analysis to begin...",
  );
  const [steps, setSteps] = useState<ProcessingStep[]>(INITIAL_STEPS);
  const [roadmapPreview, setRoadmapPreview] =
    useState<RoadmapPreviewData | null>(null);
  const [resultData, setResultData] = useState<CoursePlanData | null>(null);

  const isUploadingRef = useRef(false);
  const hasHandledResultRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Course creation now happens server-side; frontend will use server-provided createdCourseId

  const validateFile = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXT.includes(ext))
      return "Only PDF and DOCX files are supported.";
    if (file.size > MAX_SIZE_BYTES) return "File size must be under 10MB.";
    return null;
  };

  const applyFile = (file: File) => {
    const err = validateFile(file);
    setFileError(err);
    setSelectedFile(err ? null : file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploadingRef.current) return;
    isUploadingRef.current = true;
    hasHandledResultRef.current = false;
    setUploadState("uploading");
    setUploadProgress(0);
    setStreamStatus("Preparing upload...");

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (user?.id) formData.append("userId", user.id);

    const parseUploadErrorMessage = async (response: Response) => {
      try {
        const contentType = response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const body = await response.json();
          const message = body?.message || body?.data?.message || body?.error;
          if (typeof message === "string" && message.trim()) {
            return message.trim();
          }
        }

        if (contentType.includes("application/x-ndjson")) {
          const text = await response.text();
          const firstLine = text
            .split("\n")
            .map((line) => line.trim())
            .find(Boolean);

          if (firstLine) {
            try {
              const event = JSON.parse(firstLine);
              if (typeof event?.message === "string" && event.message.trim()) {
                return event.message.trim();
              }
            } catch {
              // Ignore parse errors and fallback below.
            }
          }
        }
      } catch {
        // Ignore parser failures and fallback below.
      }

      return "Upload failed. Please try again.";
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        //
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/course-plan-details?stream=true`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // const response =api.post("/ai/course-plan-details", formData);

      if (!response.ok) {
        const message = await parseUploadErrorMessage(response);
        throw new Error(message);
      }

      setUploadProgress(100);
      setUploadState("processing");
      setStreamStatus("Analysis stream connected. Reading progress updates...");
      setRoadmapPreview(null);

      // Reset steps to start
      const resetSteps = INITIAL_STEPS.map((s, i) => ({
        ...s,
        active: i === 0,
        done: false,
      }));
      setSteps(resetSteps);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      const processEvent = async (line: string) => {
        if (!line.trim()) return;
        try {
          const event = JSON.parse(line);
          const stageMap: Record<string, number> = {
            received: 0,
            parsing: 0,
            roadmap: 1,
            roadmap_complete: 1,
            learning_plan_generating: 1,
            learning_plan_complete: 1,
            details_started: 2,
            details_topics: 2,
            details_topics_ai: 2,
            details_topics_ai_error: 2,
            details_topics_complete: 2,
            details_videos: 3,
            details_videos_complete: 3,
            details_books: 3,
            details_books_complete: 3,
            building_timeline: 4,
            finalizing: 4,
          };

          if (event.type === "progress") {
            const stepIdx = stageMap[event.stage] ?? 0;
            setStreamStatus(
              event.message || `Processing ${event.stage || "analysis"}...`,
            );
            setSteps((prev) =>
              prev.map((s, i) => ({
                ...s,
                done: i < stepIdx,
                active: i === stepIdx,
              })),
            );
          } else if (event.type === "roadmap") {
            const previewData = event.data || {};
            setRoadmapPreview({
              roadmap: Array.isArray(previewData.roadmap)
                ? previewData.roadmap
                : [],
              importantTopics: Array.isArray(previewData.importantTopics)
                ? previewData.importantTopics
                : [],
              timelineRoadmap: Array.isArray(previewData.timelineRoadmap)
                ? previewData.timelineRoadmap
                : [],
              topicCount: Number(previewData.topicCount || 0),
              phases: Number(previewData.phases || 0),
            });
            setStreamStatus(
              event.message || "Roadmap ready - continuing analysis...",
            );
          } else if (event.type === "videos") {
            const previewData = event.data || {};
            setRoadmapPreview((prev) => ({
              ...(prev || {
                roadmap: [],
                importantTopics: [],
                topicCount: 0,
                phases: 0,
              }),
              youtubeVideos: Array.isArray(previewData.youtubeVideos)
                ? previewData.youtubeVideos
                : [],
            }));
            setStreamStatus(event.message || "Video recommendations ready");
          } else if (event.type === "result") {
            if (hasHandledResultRef.current) {
              return;
            }
            hasHandledResultRef.current = true;
            setStreamStatus("Finalizing course plan...");

            setSteps((prev) =>
              prev.map((s) => ({ ...s, done: true, active: false })),
            );
            const payload = event.data?.data ?? event.data ?? null;
            if (payload) {
              stepTimersRef.current.forEach(clearTimeout);

              // Debug: Log the payload structure
              console.log("📚 Received payload structure:", {
                hasBooks: !!payload.books,
                bookCount: payload.books?.length || 0,
                bookData: payload.books?.slice(0, 2),
              });

              // Normalize payload to ensure books and other arrays are present
              const normalizedPayload: CoursePlanData = {
                importantTopics: payload.importantTopics || [],
                timelineRoadmap: payload.timelineRoadmap || [],
                topicDetails: payload.topicDetails || [],
                youtubeVideos: payload.youtubeVideos || payload.videos || [],
                books: payload.books || [],
                learningPlan: payload.learningPlan || [],
              };

              console.log(
                "📖 Normalized payload books:",
                normalizedPayload.books?.length,
              );

              setRoadmapPreview((prev) =>
                prev
                  ? {
                      ...prev,
                      timelineRoadmap:
                        normalizedPayload.timelineRoadmap ||
                        prev.timelineRoadmap,
                      topicDetails:
                        normalizedPayload.topicDetails || prev.topicDetails,
                      youtubeVideos:
                        normalizedPayload.youtubeVideos ||
                        prev.youtubeVideos ||
                        [],
                      books: normalizedPayload.books || prev.books || [],
                    }
                  : prev,
              );

              // Show results immediately
              setResultData(normalizedPayload);
              setUploadState("done");

              const fallbackName = selectedFile?.name
                ?.replace(/\.[^/.]+$/, "")
                .trim();
              const analyticTopic =
                fallbackName && fallbackName.length >= 2
                  ? fallbackName.slice(0, 150)
                  : "Generated Course Plan";

              // Track analytics and navigate if server created a course
              void trackAnalyticsEvent({
                action: "upload_course",
                topicId: analyticTopic,
              });

              const createdCourseId =
                normalizedPayload.createdCourseId ||
                payload?.createdCourseId ||
                payload?.courseId ||
                payload?.course_id ||
                null;

              if (createdCourseId) {
                setTimeout(
                  () => router.push(`/course/${createdCourseId}`),
                  3000,
                );
              }
            } else {
              const courseId =
                event.data?.data?.createdCourseId ||
                event.data?.data?.courseId ||
                event.data?.createdCourseId ||
                event.data?.courseId;
              if (courseId)
                setTimeout(() => router.push(`/course/${courseId}`), 1000);
            }
          } else if (event.type === "error") {
            throw new Error(event.message || "Processing failed");
          }
        } catch (e) {
          if (line.length > 0)
            console.warn("Failed to parse stream event:", line);
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines[lines.length - 1];
        for (let i = 0; i < lines.length - 1; i++) {
          await processEvent(lines[i]);
        }
      }
      if (buffer.trim()) {
        await processEvent(buffer);
      }
    } catch (err: any) {
      stepTimersRef.current.forEach(clearTimeout);
      setErrorMessage(err?.message || "Upload failed. Please try again.");
      setUploadState("error");
      isUploadingRef.current = false;
    }
  };

  const handleReset = () => {
    stepTimersRef.current.forEach(clearTimeout);
    isUploadingRef.current = false;
    hasHandledResultRef.current = false;
    setUploadState("idle");
    setSelectedFile(null);
    setFileError(null);
    setUploadProgress(0);
    setSteps(INITIAL_STEPS);
    setRoadmapPreview(null);
    setResultData(null);
    setErrorMessage("Upload failed. Please try again.");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(
    () => () => {
      stepTimersRef.current.forEach(clearTimeout);
    },
    [],
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "transparent",
      }}
    >
      {/* <LeftPanel variant="upload" /> */}

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: uploadState === "done" ? "flex-start" : "center",
          justifyContent: "center",
          padding: uploadState === "done" ? "40px 32px" : "40px 20px",
          position: "relative",
          overflow: "auto",
        }}
      >
        <div className="bg-mesh" />

        <AnimatePresence mode="wait">
          {/* ═══ IDLE ═══ */}
          {uploadState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                width: "100%",
                maxWidth: "600px",
                background: "var(--deep)",
                borderRadius: "28px",
                padding: "48px",
                border: "1px solid var(--border-light)",
                boxShadow: "0 24px 64px rgba(9,9,15,0.08)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div style={{ marginBottom: "36px", textAlign: "center" }}>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    marginBottom: "10px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Upload Your Course Plan
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--mist, #8B8FA8)",
                    lineHeight: 1.6,
                  }}
                >
                  We'll extract units, topics, and references automatically.
                </p>
              </div>

              <motion.div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                animate={{
                  borderColor: isDragging
                    ? "#4D3FFF"
                    : fileError
                      ? "#FF4D5A"
                      : "#4D3FFF",
                  background: isDragging
                    ? "rgba(77,63,255,0.05)"
                    : fileError
                      ? "rgba(255,77,90,0.03)"
                      : "rgba(77,63,255,0.02)",
                }}
                whileHover={{ background: "rgba(77,63,255,0.05)" }}
                transition={{ duration: 0.2 }}
                style={{
                  border: `1.5px dashed ${fileError ? "#FF4D5A" : "#4D3FFF"}`,
                  borderRadius: "20px",
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <motion.div
                  animate={{ y: isDragging ? -6 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Upload size={48} color="#4D3FFF" strokeWidth={1.5} />
                </motion.div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "var(--ink)",
                  }}
                >
                  Drag &amp; drop your syllabus here
                </p>
                <p style={{ fontSize: "13px", color: "var(--mist, #8B8FA8)" }}>
                  or{" "}
                  <span
                    style={{
                      color: "#4D3FFF",
                      fontWeight: 600,
                      textDecoration: "underline",
                    }}
                  >
                    click to browse
                  </span>
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    color: "var(--mist, #8B8FA8)",
                    letterSpacing: "0.1em",
                    marginTop: "4px",
                  }}
                >
                  PDF · DOCX · MAX 10MB
                </p>
              </motion.div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: "none" }}
                onChange={onFileChange}
              />

              <AnimatePresence>
                {fileError && (
                  <motion.div
                    key="file-error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 14px",
                      background: "rgba(255,77,90,0.08)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,77,90,0.2)",
                    }}
                  >
                    <AlertCircle size={16} color="#FF4D5A" />
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#FF4D5A",
                        fontWeight: 500,
                      }}
                    >
                      {fileError}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {selectedFile && !fileError && (
                  <motion.div
                    key="file-info"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      marginTop: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      background: "rgba(77,63,255,0.06)",
                      borderRadius: "12px",
                      border: "1px solid rgba(77,63,255,0.15)",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "rgba(77,63,255,0.12)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={18} color="#4D3FFF" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--ink)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedFile.name}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--mist, #8B8FA8)",
                          marginTop: "2px",
                        }}
                      >
                        {formatBytes(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--mist, #8B8FA8)",
                        display: "flex",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleUpload}
                disabled={!selectedFile || !!fileError}
                whileHover={
                  selectedFile && !fileError
                    ? { y: -2, boxShadow: "0 12px 32px rgba(77,63,255,0.3)" }
                    : {}
                }
                whileTap={selectedFile && !fileError ? { scale: 0.97 } : {}}
                style={{
                  marginTop: "28px",
                  width: "100%",
                  padding: "16px",
                  background:
                    selectedFile && !fileError
                      ? "#4D3FFF"
                      : "rgba(77,63,255,0.3)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor:
                    selectedFile && !fileError ? "pointer" : "not-allowed",
                  transition: "background 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Upload size={18} /> Upload Now
              </motion.button>
            </motion.div>
          )}

          {/* ═══ UPLOADING ═══ */}
          {uploadState === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
              style={{
                width: "100%",
                maxWidth: "600px",
                background: "var(--deep)",
                borderRadius: "28px",
                padding: "56px 48px",
                border: "1px solid var(--border-light)",
                boxShadow: "0 24px 64px rgba(9,9,15,0.08)",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeInOut",
                }}
                style={{
                  marginBottom: "24px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    background: "rgba(77,63,255,0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Upload size={32} color="#4D3FFF" />
                </div>
              </motion.div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: "6px",
                }}
              >
                Uploading your syllabus...
              </p>
              {selectedFile && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--mist, #8B8FA8)",
                    marginBottom: "28px",
                  }}
                >
                  {selectedFile.name}
                </p>
              )}
              <div
                style={{
                  height: "6px",
                  background: "rgba(77,63,255,0.1)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: "10px",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #4D3FFF, #7B70FF, #4D3FFF)",
                    backgroundSize: "200% 100%",
                    borderRadius: "999px",
                  }}
                  animate={{
                    width: `${uploadProgress}%`,
                    backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                  }}
                  transition={{
                    width: { duration: 0.4 },
                    backgroundPosition: {
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    },
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#6366F1",
                  letterSpacing: "0.05em",
                }}
              >
                {uploadProgress}%
              </p>
            </motion.div>
          )}

          {/* ═══ PROCESSING ═══ */}
          {uploadState === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
              style={{
                width: "100%",
                maxWidth: "600px",
                background:
                  "linear-gradient(135deg, rgba(77,63,255,0.04) 0%, rgba(123,112,255,0.08) 100%)",
                borderRadius: "28px",
                padding: "48px",
                border: "1px solid rgba(77,63,255,0.15)",
                boxShadow: "0 24px 64px rgba(77,63,255,0.1)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "36px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    marginBottom: "8px",
                  }}
                >
                  Analysing your syllabus
                </h2>
                <p style={{ fontSize: "13px", color: "var(--mist, #8B8FA8)" }}>
                  This may take a few moments — sit tight!
                </p>
                <div
                  style={{
                    marginTop: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "rgba(77,63,255,0.08)",
                    color: "#4D3FFF",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <RefreshCw size={14} />
                  {streamStatus}
                </div>
              </div>
              {roadmapPreview && roadmapPreview.roadmap.length > 0 && (
                <div
                  style={{
                    marginBottom: "14px",
                    padding: "14px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.76)",
                    border: "1px solid rgba(77,63,255,0.12)",
                    boxShadow: "0 8px 24px rgba(77,63,255,0.07)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#4D3FFF",
                        }}
                      >
                        Roadmap
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "12px",
                          color: "var(--mist, #8B8FA8)",
                        }}
                      >
                        {roadmapPreview.phases} phases ·{" "}
                        {roadmapPreview.topicCount} topics
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      maxHeight: "300px",
                      overflowY: "auto",
                      paddingRight: "4px",
                    }}
                  >
                    {(roadmapPreview.timelineRoadmap?.length
                      ? roadmapPreview.timelineRoadmap
                      : roadmapPreview.roadmap.map((phase, index) => ({
                          phase: phase.phase,
                          topics: phase.topics,
                          shortDescription: `Phase ${index + 1}`,
                          detailedGuidance: phase.topics.join(" · "),
                          actionSteps: phase.topics.slice(0, 3),
                          keyConcepts: phase.topics.slice(0, 5),
                          youtubeResources: [],
                          books: [],
                        }))
                    )
                      .slice(0, 5)
                      .map((phase, index) => (
                        <div
                          key={`${phase.phase}-${index}`}
                          style={{
                            padding: "9px 11px",
                            borderRadius: "11px",
                            background: "rgba(77,63,255,0.04)",
                            border: "1px solid rgba(77,63,255,0.08)",
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "var(--ink)",
                              lineHeight: 1.3,
                            }}
                          >
                            {phase.phase}
                          </p>
                          {phase.shortDescription && (
                            <p
                              style={{
                                margin: "2px 0 0",
                                fontSize: "11px",
                                color: "var(--mist, #8B8FA8)",
                                lineHeight: 1.4,
                              }}
                            >
                              {phase.shortDescription.slice(0, 60)}
                            </p>
                          )}
                          {phase.detailedGuidance && (
                            <p
                              style={{
                                margin: "3px 0 0",
                                fontSize: "10px",
                                color: "#6b7280",
                                lineHeight: 1.4,
                              }}
                            >
                              {phase.detailedGuidance.slice(0, 80)}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>

                  {roadmapPreview.importantTopics.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginTop: "12px",
                      }}
                    >
                      {roadmapPreview.importantTopics
                        .slice(0, 6)
                        .map((topic, index) => (
                          <span
                            key={`${topic}-${index}`}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "999px",
                              background: "rgba(77,63,255,0.08)",
                              border: "1px solid rgba(77,63,255,0.12)",
                              color: "#4D3FFF",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {topic}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              )}
              {roadmapPreview?.youtubeVideos &&
                roadmapPreview.youtubeVideos.length > 0 && (
                  <div
                    style={{
                      marginBottom: "14px",
                      padding: "14px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.76)",
                      border: "1px solid rgba(99, 102, 241,0.12)",
                      boxShadow: "0 8px 24px rgba(99,102,241,0.07)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#6366F1",
                          }}
                        >
                          Videos
                        </p>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: "12px",
                            color: "var(--mist, #8B8FA8)",
                          }}
                        >
                          {roadmapPreview.youtubeVideos.length} recommended
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        maxHeight: "320px",
                        overflowY: "auto",
                        paddingRight: "4px",
                      }}
                    >
                      {roadmapPreview.youtubeVideos
                        .slice(0, 5)
                        .map((video, idx) => {
                          const thumbnailUrl = video.youtubeThumbnailUrl;

                          return (
                            <div
                              key={`${video.youtubeVideoId}-${idx}`}
                              style={{
                                display: "flex",
                                gap: "10px",
                                padding: "10px",
                                borderRadius: "12px",
                                background: "rgba(99, 102, 241, 0.05)",
                                border: "1px solid rgba(99, 102, 241, 0.08)",
                              }}
                            >
                              <div
                                style={{
                                  width: "94px",
                                  height: "58px",
                                  borderRadius: "9px",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                  background: "rgba(99, 102, 241, 0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {thumbnailUrl ? (
                                  <img
                                    src={thumbnailUrl}
                                    alt={video.title}
                                    loading="lazy"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      display: "block",
                                    }}
                                  />
                                ) : (
                                  <Play size={16} color="#6366F1" />
                                )}
                              </div>

                              <div style={{ minWidth: 0, flex: 1 }}>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "var(--ink)",
                                    lineHeight: 1.35,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {video.title}
                                </p>
                                <p
                                  style={{
                                    margin: "3px 0 0",
                                    fontSize: "10px",
                                    color: "#6b7280",
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {video.channel} · {video.publishedYear}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              {roadmapPreview?.books && roadmapPreview.books.length > 0 && (
                <div
                  style={{
                    marginBottom: "14px",
                    padding: "14px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.76)",
                    border: "1px solid rgba(245,166,35,0.12)",
                    boxShadow: "0 8px 24px rgba(245,166,35,0.07)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#A16207",
                        }}
                      >
                        Books
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "12px",
                          color: "var(--mist, #8B8FA8)",
                        }}
                      >
                        {roadmapPreview.books.length} recommended
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      maxHeight: "320px",
                      overflowY: "auto",
                      paddingRight: "4px",
                    }}
                  >
                    {roadmapPreview.books.slice(0, 5).map((book, idx) => {
                      const color = PHASE_COLORS[idx % PHASE_COLORS.length];
                      const thumbnailUrl = book.thumbnail;

                      return (
                        <div
                          key={`${book.title}-${idx}`}
                          style={{
                            display: "flex",
                            gap: "10px",
                            padding: "10px",
                            borderRadius: "12px",
                            background: "rgba(245,166,35,0.05)",
                            border: "1px solid rgba(245,166,35,0.08)",
                          }}
                        >
                          <div
                            style={{
                              width: "94px",
                              height: "58px",
                              borderRadius: "9px",
                              overflow: "hidden",
                              flexShrink: 0,
                              background: "rgba(245,166,35,0.08)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {thumbnailUrl ? (
                              <img
                                src={thumbnailUrl}
                                alt={book.title}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            ) : (
                              <BookOpen size={16} color={color.badge} />
                            )}
                          </div>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "var(--ink)",
                                lineHeight: 1.35,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {book.title}
                            </p>
                            <p
                              style={{
                                margin: "3px 0 0",
                                fontSize: "10px",
                                color: "#6b7280",
                                lineHeight: 1.3,
                              }}
                            >
                              {book.author || "Open Library"}
                              {book.isbn ? ` · ${book.isbn}` : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{
                      opacity: step.active || step.done ? 1 : 0.35,
                      x: 0,
                    }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "14px 18px",
                      background: step.done
                        ? "rgba(0,200,150,0.08)"
                        : step.active
                          ? "rgba(77,63,255,0.08)"
                          : "rgba(77,63,255,0.03)",
                      borderRadius: "14px",
                      border: `1px solid ${step.done ? "rgba(0,200,150,0.2)" : step.active ? "rgba(77,63,255,0.2)" : "transparent"}`,
                      transition:
                        "background 0.4s ease, border-color 0.4s ease",
                    }}
                  >
                    <span style={{ fontSize: "22px", lineHeight: 1 }}>
                      {step.icon}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "14px",
                        fontWeight: step.active ? 600 : 500,
                        color: step.done
                          ? "#00C896"
                          : step.active
                            ? "#4D3FFF"
                            : "var(--mist, #8B8FA8)",
                        transition: "color 0.4s ease",
                      }}
                    >
                      {step.label}
                    </span>
                    <AnimatePresence>
                      {step.done && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                        >
                          <CheckCircle size={18} color="#00C896" />
                        </motion.div>
                      )}
                      {step.active && !step.done && (
                        <motion.div
                          key="spinner"
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                        >
                          <RefreshCw size={16} color="#4D3FFF" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ DONE ═══ */}
          {uploadState === "done" && resultData && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                width: "100%",
                maxWidth: "1440px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Success banner */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 18px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "12px",
                  marginBottom: "24px",
                }}
              >
                <CheckCircle size={18} color="#059669" />
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#065F46",
                    margin: 0,
                  }}
                >
                  Course plan analysed successfully! Here's your personalised
                  learning roadmap.
                </p>
                <button
                  onClick={handleReset}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "1px solid #A7F3D0",
                    borderRadius: "8px",
                    padding: "5px 12px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#059669",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Upload size={12} /> New Upload
                </button>
              </motion.div>

              <CoursePlanResults data={resultData} />
            </motion.div>
          )}

          {/* ═══ ERROR ═══ */}
          {uploadState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
              style={{
                width: "100%",
                maxWidth: "600px",
                background:
                  "linear-gradient(135deg, rgba(255,77,90,0.05) 0%, rgba(255,77,90,0.08) 100%)",
                borderRadius: "28px",
                padding: "56px 48px",
                border: "1px solid rgba(255,77,90,0.2)",
                boxShadow: "0 24px 64px rgba(255,77,90,0.08)",
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1,
                }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    background: "rgba(255,77,90,0.12)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AlertCircle size={36} color="#FF4D5A" />
                </div>
              </motion.div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--ink, #0d0d14)",
                  marginBottom: "12px",
                }}
              >
                Upload Failed
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#FF4D5A",
                  marginBottom: "36px",
                  lineHeight: 1.6,
                  background: "rgba(255,77,90,0.08)",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,77,90,0.15)",
                }}
              >
                {errorMessage}
              </p>
              <motion.button
                onClick={handleReset}
                whileHover={{
                  y: -2,
                  boxShadow: "0 10px 24px rgba(77,63,255,0.25)",
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "14px 36px",
                  background: "#4D3FFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <RefreshCw size={16} /> Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
