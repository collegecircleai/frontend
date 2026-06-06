"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  FileText,
  Sparkles,
  Calendar,
  BookOpen,
  User,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "@/lib/api";

interface Chunk {
  content: string;
  created_at: string;
}

interface Classroom {
  class_id: string;
  name: string;
  subject: string;
  professor?: string;
  lecture_no?: number;
  created_at: string;
  notes?: string;
  summary_cache?: SummaryPayload | string | null;
}

interface SummaryQuizItem {
  question: string;
  answer: string;
}

interface SummaryPayload {
  notes_markdown: string;
  quiz: SummaryQuizItem[];
}

const extractFirstJsonObject = (input: string) => {
  let depth = 0;
  let startIndex = -1;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (startIndex === -1) {
      if (character === "{") {
        startIndex = index;
        depth = 1;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      continue;
    }

    if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return input.slice(startIndex, index + 1);
      }
    }
  }

  return null;
};

const parseSummaryPayload = (raw: string): SummaryPayload | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidate = extractFirstJsonObject(trimmed) || trimmed;

  try {
    const parsed = JSON.parse(candidate);
    if (
      parsed &&
      typeof parsed.notes_markdown === "string" &&
      Array.isArray(parsed.quiz)
    ) {
      return {
        notes_markdown: parsed.notes_markdown,
        quiz: parsed.quiz.filter(
          (item: SummaryQuizItem) =>
            item &&
            typeof item.question === "string" &&
            typeof item.answer === "string",
        ),
      };
    }
  } catch {
    return null;
  }

  return null;
};

export default function ClassroomDetails() {
  const router = useRouter();
  const params = useParams();
  const [session, setSession] = useState<Classroom | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [summaryRaw, setSummaryRaw] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryPayload | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [openQuizIndex, setOpenQuizIndex] = useState<number | null>(null);

  const storedSummary =
    session && session.summary_cache
      ? typeof session.summary_cache === "string"
        ? parseSummaryPayload(session.summary_cache)
        : (session.summary_cache as SummaryPayload)
      : null;

  const hasStoredNotes = Boolean(storedSummary?.notes_markdown?.trim());
  const hasTranscript = chunks.length > 0;
  const showNotesPanel = Boolean(storedSummary || summaryData || summaryRaw);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/classrooms/${params.id}`);
        const result = res.data?.data || res.data;

        console.log("Details raw response:", result);

        const classroomData = result.classroom || result;
        setSession(classroomData);

        // Robust chunk search
        let foundChunks = [];
        if (Array.isArray(result.chunks)) {
          foundChunks = result.chunks;
        } else if (Array.isArray(classroomData.chunks)) {
          foundChunks = classroomData.chunks;
        } else if (result.audioChunks && Array.isArray(result.audioChunks)) {
          foundChunks = result.audioChunks;
        }

        setChunks(foundChunks);
      } catch (err) {
        console.error("Failed to fetch session details:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDetails();
  }, [params.id]);

  const handleGenerateSummary = async () => {
    if (!params.id || isGeneratingSummary) return;

    try {
      setIsGeneratingSummary(true);
      setSummaryRaw(null);
      setSummaryData(null);
      setOpenQuizIndex(null);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(
        `${api.defaults.baseURL}/classrooms/${params.id}/generate-notes-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (!response.ok || !response.body) {
        throw new Error("Unable to generate summary for this lecture.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let eventName = "message";
      let dataLines: string[] = [];
      let streamingSummary = "";
      let parsedSummary: SummaryPayload | null = null;

      const refreshParsedSummary = (raw: string) => {
        const parsed = parseSummaryPayload(raw);
        if (parsed) {
          parsedSummary = parsed;
          setSummaryData(parsed);
        }
        setSummaryRaw(raw);
      };

      const emitEvent = () => {
        if (!dataLines.length) {
          eventName = "message";
          return;
        }

        const rawData = dataLines.join("\n");
        const currentEvent = eventName;
        dataLines = [];
        eventName = "message";

        try {
          const payload = JSON.parse(rawData);

          if (currentEvent === "token" && typeof payload?.token === "string") {
            streamingSummary += payload.token;
            refreshParsedSummary(streamingSummary);
            return;
          }

          if (currentEvent === "done") {
            const responseText = payload?.response;
            if (typeof responseText === "string" && responseText.trim()) {
              streamingSummary = responseText;
              refreshParsedSummary(responseText);
            }
          }

          if (currentEvent === "error") {
            throw new Error(
              payload?.message ||
                "Failed to generate summary for this lecture.",
            );
          }
        } catch (error) {
          if (currentEvent === "token") {
            streamingSummary += rawData;
            refreshParsedSummary(streamingSummary);
            return;
          }

          throw error;
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

        let boundary = buffer.indexOf("\n");
        while (boundary >= 0) {
          const line = buffer.slice(0, boundary).replace(/\r$/, "");
          buffer = buffer.slice(boundary + 1);

          if (!line) {
            emitEvent();
          } else if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            dataLines.push(line.slice(5).trimStart());
          }

          boundary = buffer.indexOf("\n");
        }

        if (done) {
          if (dataLines.length) {
            emitEvent();
          }
          break;
        }
      }

      if (!streamingSummary.trim() && !parsedSummary) {
        throw new Error("No summary was returned for this lecture.");
      }
    } catch (err) {
      console.error("Failed to generate summary:", err);
      setSummaryRaw(null);
      setSummaryData(null);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid rgba(77,63,255,0.1)",
            borderTopColor: "#4D3FFF",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (!session)
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111" }}>
          Session not found
        </h2>
        <button
          onClick={() => router.back()}
          style={{
            marginTop: 20,
            color: "#4D3FFF",
            fontWeight: 700,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 60 }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: "var(--deep)",
            border: "1px solid var(--border-light)",
            cursor: "pointer",
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            transition: "all 0.2s ease",
            marginBottom: 32,
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "translateX(-4px)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "translateX(0)")
          }
        >
          <ArrowLeft size={22} />
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                background: "rgba(77,63,255,0.08)",
                color: "#4D3FFF",
                padding: "6px 14px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {session.subject}
            </div>
            <div
              style={{
                color: "var(--mist)",
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Calendar size={16} />
              {new Date(
                session.created_at || (session as any).createdAt,
              ).toLocaleDateString(undefined, { dateStyle: "long" })}
            </div>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 56,
              fontWeight: 900,
              color: "var(--ink)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            {session.name}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--ink)",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--mist)",
                }}
              >
                <User size={16} />
              </div>
              Prof. {session.professor || "Unknown"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--ink)",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--mist)",
                }}
              >
                <BookOpen size={16} />
              </div>
              Lecture #{session.lecture_no || 1}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 12,
            }}
          >
            <button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #4D3FFF, #6C5BFF)",
                color: "#fff",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                cursor: isGeneratingSummary ? "wait" : "pointer",
                boxShadow: "0 14px 28px rgba(77,63,255,0.18)",
                opacity: isGeneratingSummary ? 0.8 : 1,
              }}
            >
              {isGeneratingSummary ? (
                <Loader2 size={18} className="spin-icon" />
              ) : (
                <Sparkles size={18} />
              )}
              {isGeneratingSummary
                ? "Generating Summary..."
                : "Generate Summary"}
            </button>
          </div>
        </div>
      </div>

      {(storedSummary || summaryData || summaryRaw) && (
        <div
          style={{
            marginBottom: 32,
            padding: 0,
            borderRadius: 28,
            border: "1px solid var(--border-light)",
            background: "rgba(77,63,255,0.04)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "22px 26px",
              borderBottom: "1px solid var(--border-light)",
              background: "var(--deep)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={18} color="#4D3FFF" />
              <div>
                <div style={{ fontWeight: 900, color: "var(--ink)" }}>
                  Lecture Summary
                </div>
                <div style={{ fontSize: 13, color: "var(--mist)" }}>
                  Structured notes and quiz
                </div>
              </div>
            </div>

            {summaryData && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span
                  style={{
                    padding: "7px 12px",
                    borderRadius: 999,
                    background: "rgba(77,63,255,0.10)",
                    color: "#4D3FFF",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {(storedSummary || summaryData)?.quiz.length || 0} quiz items
                </span>
                <span
                  style={{
                    padding: "7px 12px",
                    borderRadius: 999,
                    background: "rgba(0,200,150,0.10)",
                    color: "#008D6F",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  Live generated
                </span>
              </div>
            )}
          </div>

          {storedSummary || summaryData ? (
            <div style={{ padding: 26, display: "grid", gap: 24 }}>
              <section
                style={{
                  padding: 22,
                  borderRadius: 22,
                  background: "var(--deep)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    marginBottom: 14,
                    color: "var(--ink)",
                  }}
                >
                  Notes
                </div>
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1
                        style={{
                          fontSize: 28,
                          margin: "0 0 12px",
                          color: "var(--ink)",
                          fontWeight: 900,
                        }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2
                        style={{
                          fontSize: 22,
                          margin: "20px 0 10px",
                          color: "var(--ink)",
                          fontWeight: 900,
                        }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        style={{
                          fontSize: 18,
                          margin: "18px 0 10px",
                          color: "var(--ink)",
                          fontWeight: 800,
                        }}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p
                        style={{
                          margin: "0 0 12px",
                          lineHeight: 1.8,
                          color: "var(--mist)",
                        }}
                      >
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul
                        style={{
                          margin: "0 0 12px 20px",
                          padding: 0,
                          lineHeight: 1.8,
                          color: "var(--mist)",
                        }}
                      >
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol
                        style={{
                          margin: "0 0 12px 20px",
                          padding: 0,
                          lineHeight: 1.8,
                          color: "var(--mist)",
                        }}
                      >
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li style={{ marginBottom: 6 }}>{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong style={{ color: "var(--ink)" }}>
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {(storedSummary || summaryData)?.notes_markdown || ""}
                </ReactMarkdown>
              </section>

              <section
                style={{
                  padding: 22,
                  borderRadius: 22,
                  background: "var(--deep)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    marginBottom: 16,
                    color: "var(--ink)",
                  }}
                >
                  Quiz
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {(storedSummary || summaryData)?.quiz.map((item, index) => {
                    const isOpen = openQuizIndex === index;
                    return (
                      <div
                        key={`${item.question}-${index}`}
                        style={{
                          borderRadius: 18,
                          border: "1px solid var(--border-light)",
                          overflow: "hidden",
                          background: "var(--pearl)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenQuizIndex(isOpen ? null : index)
                          }
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "16px 18px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16,
                            color: "var(--ink)",
                            fontWeight: 800,
                            fontSize: 15,
                          }}
                        >
                          <span>
                            {index + 1}. {item.question}
                          </span>
                          <span
                            style={{
                              padding: "6px 10px",
                              borderRadius: 999,
                              background: isOpen
                                ? "rgba(0,200,150,0.12)"
                                : "rgba(77,63,255,0.10)",
                              color: isOpen ? "#008D6F" : "#4D3FFF",
                              fontSize: 12,
                              fontWeight: 800,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {isOpen ? "Hide answer" : "Show answer"}
                          </span>
                        </button>
                        {isOpen && (
                          <div
                            style={{
                              padding: "0 18px 18px",
                              color: "var(--mist)",
                              lineHeight: 1.8,
                              borderTop: "1px solid var(--border-light)",
                              background: "transparent",
                            }}
                          >
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          ) : summaryRaw ? (
            <div style={{ padding: 26 }}>
              <div
                style={{
                  padding: 18,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(77,63,255,0.08)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  color: "var(--ink)",
                  fontSize: 15,
                }}
              >
                {summaryRaw}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {!showNotesPanel && (
        <div
          style={{
            background: "var(--deep)",
            borderRadius: 48,
            border: "1px solid var(--border-light)",
            padding: "60px",
            boxShadow: "0 40px 100px rgba(0,0,0,0.03)",
            position: "relative",
            minHeight: 400,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 48,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "rgba(0,200,150,0.08)",
                  color: "#00C896",
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={28} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "var(--ink)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Lecture Transcript
                </h2>
                <p
                  style={{
                    color: "var(--mist)",
                    fontSize: 14,
                    fontWeight: 500,
                    marginTop: 2,
                  }}
                >
                  Real-time voice-to-text recording
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "8px 16px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-light)",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              {chunks.length} segments captured
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {chunks.length > 0 ? (
              chunks.map((chunk, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 40,
                    animation: "fadeIn 0.6s ease forwards",
                    opacity: 0,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div
                    style={{
                      width: 90,
                      flexShrink: 0,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#4D3FFF",
                      paddingTop: 6,
                      opacity: 0.6,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {new Date(chunk.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontSize: 20,
                      color: "var(--ink)",
                      lineHeight: 1.8,
                      fontWeight: 500,
                      borderLeft: "3px solid rgba(77,63,255,0.08)",
                      paddingLeft: 40,
                    }}
                  >
                    {chunk.content}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "#F9FAFB",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "rgba(0,0,0,0.1)",
                  }}
                >
                  <Clock size={40} />
                </div>
                <p
                  style={{
                    color: "var(--mist)",
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  No transcript data found for this session.
                </p>
                <p style={{ color: "var(--mist)", fontSize: 14, marginTop: 8 }}>
                  The transcript may be processing or was not captured.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
