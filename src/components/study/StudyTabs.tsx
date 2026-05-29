"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import type { TopicContent, QuizQuestion } from "@/hooks/useTopicContent";
import type { CourseData } from "@/types/study";
import api from "@/lib/api";
import katex from "katex";
import "katex/dist/katex.min.css";

type QuizAnalysis = {
  strengths: string[];
  weaknesses: string[];
  recommendedFocus: string[];
  persona: {
    label: string;
    summary: string;
    style: string;
    strengths: string[];
    improvementAreas: string[];
  };
};

/* ─── Styles ─── */
const SHARED_STYLES = `
  @keyframes cc-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes cc-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes cc-fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes cc-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0.2; }
  }
  @keyframes cc-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
  }
  @keyframes cc-typewriter {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

/* ─── Shared Primitives ─── */
function Spinner({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        padding: "48px 0",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          border: "3px solid rgba(77,63,255,0.15)",
          borderTopColor: "#4D3FFF",
          borderRadius: "50%",
          animation: "cc-spin 0.7s linear infinite",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--mist)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function SkeletonLines({ count = 3 }: { count?: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "8px 0",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 16,
            borderRadius: 6,
            width: i === count - 1 ? "60%" : "100%",
            background:
              "linear-gradient(90deg, var(--border-light) 25%, var(--violet-pale) 50%, var(--border-light) 75%)",
            backgroundSize: "200% 100%",
            animation: "cc-shimmer 1.4s infinite linear",
          }}
        />
      ))}
    </div>
  );
}

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} style={{ fontWeight: 700, color: "var(--ink)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderMathExpression(
  expression: string,
  displayMode: boolean,
): string {
  try {
    return katex.renderToString(expression, {
      throwOnError: false,
      displayMode,
      strict: "ignore",
      output: "html",
    });
  } catch {
    return expression;
  }
}

function hasBlockMath(line: string): boolean {
  return /\$\$[\s\S]+?\$\$/.test(line) || /\\\[[\s\S]+?\\\]/.test(line);
}

function hasAnyMath(line: string): boolean {
  return (
    hasBlockMath(line) ||
    /\$[^$\n]+\$/.test(line) ||
    /\\\([\s\S]+?\\\)/.test(line)
  );
}

function renderLineWithMath(text: string) {
  const html = text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_match, expr: string) => {
      return renderMathExpression(expr.trim(), true);
    })
    .replace(/\\\[([\s\S]+?)\\\]/g, (_match, expr: string) => {
      return renderMathExpression(expr.trim(), true);
    })
    .replace(/\\\(([\s\S]+?)\\\)/g, (_match, expr: string) => {
      return renderMathExpression(expr.trim(), false);
    })
    .replace(/\$([^$\n]+)\$/g, (_match, expr: string) => {
      return renderMathExpression(expr.trim(), false);
    });

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}

/* ═══════════════════════════════════════
   📝 NOTES TAB - ChatGPT Style
   ═══════════════════════════════════════ */
export function NotesTab({
  content,
  isLoading,
  generateForTab,
  usePersonalisation,
  setUsePersonalisation,
}: {
  content: TopicContent;
  isLoading: boolean;
  generateForTab?: (tab: "notes") => Promise<void>;
  usePersonalisation?: boolean;
  setUsePersonalisation?: (v: boolean) => void;
}) {
  const [prevTextLength, setPrevTextLength] = useState(0);
  const [renderTime, setRenderTime] = useState(Date.now());
  const [showMissingPrefsModal, setShowMissingPrefsModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const text = content.notes?.detailed || "";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setPrevTextLength(text.length);
  }, [text]);

  // Detect if we're actively streaming (text is growing)
  const isStreaming =
    isLoading || (text.length > 0 && text.length !== prevTextLength);

  // Only show streaming indicators if:
  // 1. Content is loading OR
  // 2. Text changed in the last 2 seconds (active streaming)
  const showStreamingIndicators =
    isLoading || (isStreaming && Date.now() - renderTime < 2000);

  // Render skeleton while loading with no content
  if (isLoading && !text) {
    return <SkeletonLines count={5} />;
  }

  return (
    <div style={{ animation: "cc-fade-in 0.3s ease", minHeight: "100vh" }}>
      <style>{SHARED_STYLES}</style>

      {/* Main Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background:
            "linear-gradient(135deg, rgba(77,63,255,0.02) 0%, rgba(0,200,150,0.02) 100%)",
          paddingTop: 0,
        }}
      >
        {/* Header with Status */}
        {text && (
          <div
            style={{
              padding: "20px 0",
              borderBottom: "1px solid var(--border-light)",
              background: "rgba(var(--header-bg), 0.4)",
              backdropFilter: "blur(10px)",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div
              style={{
                maxWidth: 900,
                margin: "0 auto",
                paddingLeft: 24,
                paddingRight: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: "24px" }}>📚</div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "var(--ink)",
                      fontSize: 14,
                    }}
                  >
                    Study Notes
                  </div>
                  <div style={{ fontSize: 12, color: "var(--mist)" }}>
                    {showStreamingIndicators ? "Generating..." : "Ready"}
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {setUsePersonalisation && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.03)", padding: "4px 12px", borderRadius: 20 }}>
                    <span style={{ fontSize: 12, color: "var(--mist)", fontWeight: 500 }}>Personalised</span>
                    <button
                      onClick={async () => {
                        // If they are trying to turn it ON, validate first
                        if (!usePersonalisation) {
                          try {
                            const res = await api.get("/personalisation");
                            const prefs = res.data?.data?.personalisation;
                            const hasActiveSettings = prefs && typeof prefs === 'object' && Object.values(prefs).some(val => val === true || (typeof val === 'string' && val.trim() !== ''));
                            
                            if (!hasActiveSettings) {
                              setShowMissingPrefsModal(true);
                              return;
                            }
                          } catch (e) {
                            // Proceed if API fails
                          }
                        }
                        setUsePersonalisation(!usePersonalisation);
                      }}
                      style={{
                        width: 36,
                        height: 20,
                        borderRadius: 20,
                        background: usePersonalisation ? "#4D3FFF" : "var(--border)",
                        border: "none",
                        position: "relative",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      title={usePersonalisation ? "Using your saved Learning Preferences" : "Using standard Academic format"}
                    >
                      <div style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#fff",
                        position: "absolute",
                        top: 2,
                        left: usePersonalisation ? 18 : 2,
                        transition: "left 0.2s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                      }} />
                    </button>
                  </div>
                )}

                {showStreamingIndicators && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#4D3FFF",
                        animation: "cc-pulse 1.5s ease-in-out infinite",
                      }}
                    />
                    <span style={{ fontSize: 12, color: "var(--mist)" }}>
                      Streaming...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: isMobile ? "16px 12px" : "32px 24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Message Container */}
          <div
            style={{
              width: "100%",
              maxWidth: 900,
              paddingBottom: 40,
            }}
          >
            {!text && (
              <div
                style={{
                  textAlign: "center",
                  padding: isMobile ? "20px 10px" : "40px 20px",
                  color: "var(--mist)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>📝</div>
                <h3 style={{ fontSize: 22, color: "var(--ink)", marginBottom: 8, fontFamily: "var(--font-display)", fontWeight: 700 }}>Generate Study Notes</h3>
                <p style={{ fontSize: 14, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
                  Choose how you want your notes generated for this topic.
                </p>

                <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row", justifyContent: "center", marginBottom: 32, flexWrap: "wrap" }}>
                  {/* Detailed Standard */}
                  <div 
                    onClick={() => setUsePersonalisation && setUsePersonalisation(false)}
                    style={{
                      width: isMobile ? "100%" : 240, padding: 24, borderRadius: 16, cursor: "pointer", textAlign: "left",
                      border: !usePersonalisation ? "2px solid #4D3FFF" : "1px solid var(--border)",
                      background: !usePersonalisation ? "rgba(77,63,255,0.05)" : "transparent",
                      transition: "all 0.2s"
                    }}>
                    <div style={{ fontSize: 24, marginBottom: 12 }}>📚</div>
                    <div style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6, fontSize: 15 }}>Detailed Notes</div>
                    <div style={{ fontSize: 13, color: "var(--mist)", lineHeight: 1.5 }}>Full academic explanation with context and standard formal formatting.</div>
                  </div>

                  {/* Personalised */}
                  <div 
                    onClick={() => setUsePersonalisation && setUsePersonalisation(true)}
                    style={{
                      width: isMobile ? "100%" : 240, padding: 24, borderRadius: 16, cursor: "pointer", textAlign: "left",
                      border: usePersonalisation ? "2px solid #00C896" : "1px solid var(--border)",
                      background: usePersonalisation ? "rgba(0,200,150,0.05)" : "transparent",
                      transition: "all 0.2s"
                    }}>
                    <div style={{ fontSize: 24, marginBottom: 12 }}>✨</div>
                    <div style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6, fontSize: 15 }}>Personalised</div>
                    <div style={{ fontSize: 13, color: "var(--mist)", lineHeight: 1.5 }}>Tailored perfectly to your saved Learning Preferences (tone, length, focus).</div>
                  </div>
                </div>

                {generateForTab && (
                  <button
                    onClick={async () => {
                      if (usePersonalisation) {
                        try {
                          const res = await api.get("/personalisation");
                          const prefs = res.data?.data?.personalisation;
                          
                          const hasActiveSettings = prefs && typeof prefs === 'object' && Object.values(prefs).some(val => val === true || (typeof val === 'string' && val.trim() !== ''));
                          
                          if (!hasActiveSettings) {
                            setShowMissingPrefsModal(true);
                            return;
                          }
                        } catch (e) {
                          // Allow fallback if API fails
                        }
                      }
                      generateForTab("notes");
                    }}
                    style={{
                      padding: "14px 36px",
                      borderRadius: 999,
                      border: "none",
                      cursor: "pointer",
                      background: usePersonalisation ? "#00C896" : "#4D3FFF",
                      color: "#fff",
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      boxShadow: usePersonalisation ? "0 8px 20px rgba(0,200,150,0.25)" : "0 8px 20px rgba(77,63,255,0.25)",
                    }}
                  >
                    Generate {usePersonalisation ? "Personalised" : "Standard"} Notes
                  </button>
                )}
              </div>
            )}

            {text && (
              <div
                style={{
                  background: "var(--deep)",
                  borderRadius: 16,
                  padding: "32px",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.05)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    lineHeight: 1.85,
                    color: "var(--ink)",
                  }}
                >
                  {text.split("\n").map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={i} style={{ height: 16 }} />;

                    // Handle Headings
                    if (trimmed.startsWith("# "))
                      return (
                        <h2
                          key={i}
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 32,
                            fontWeight: 800,
                            margin: "40px 0 20px",
                            color: "var(--ink)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.25,
                          }}
                        >
                          {trimmed.slice(2)}
                        </h2>
                      );
                    if (trimmed.startsWith("## "))
                      return (
                        <h3
                          key={i}
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 24,
                            fontWeight: 700,
                            margin: "32px 0 16px",
                            color: "var(--ink)",
                            letterSpacing: "-0.01em",
                            lineHeight: 1.3,
                          }}
                        >
                          {trimmed.slice(3)}
                        </h3>
                      );
                    if (trimmed.startsWith("### "))
                      return (
                        <h4
                          key={i}
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            fontWeight: 700,
                            margin: "24px 0 12px",
                            color: "var(--ink)",
                            lineHeight: 1.35,
                          }}
                        >
                          {trimmed.slice(4)}
                        </h4>
                      );

                    // Handle Lists
                    const checklistMatch = trimmed.match(
                      /^[-*]\s\[(x|X|\s)\]\s+(.+)$/,
                    );
                    if (checklistMatch) {
                      const isChecked = checklistMatch[1].toLowerCase() === "x";
                      const checklistText = checklistMatch[2];
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 12,
                            margin: "12px 0",
                            paddingLeft: 8,
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              color: isChecked ? "#00C896" : "#4D3FFF",
                              fontWeight: 900,
                              marginTop: 2,
                            }}
                          >
                            {isChecked ? "✓" : "□"}
                          </span>
                          <span
                            style={{
                              textDecoration: isChecked
                                ? "line-through"
                                : "none",
                              opacity: isChecked ? 0.7 : 1,
                            }}
                          >
                            {renderInlineBold(checklistText)}
                          </span>
                        </div>
                      );
                    }

                    if (/^[-*]\s+/.test(trimmed)) {
                      const listText = trimmed.replace(/^[-*]\s+/, "").trim();
                      if (!listText) return null;
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 12,
                            margin: "12px 0",
                            paddingLeft: 8,
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              color: "#4D3FFF",
                              fontWeight: 900,
                              marginTop: 2,
                            }}
                          >
                            •
                          </span>
                          <span>
                            {hasAnyMath(listText)
                              ? renderLineWithMath(listText)
                              : renderInlineBold(listText)}
                          </span>
                        </div>
                      );
                    }

                    if (/^\d+\.\s+/.test(trimmed)) {
                      const numberMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
                      if (!numberMatch) return null;
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 12,
                            margin: "12px 0",
                            paddingLeft: 8,
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              color: "#4D3FFF",
                              fontWeight: 700,
                              minWidth: 24,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {numberMatch[1]}.
                          </span>
                          <span>
                            {hasAnyMath(numberMatch[2])
                              ? renderLineWithMath(numberMatch[2])
                              : renderInlineBold(numberMatch[2])}
                          </span>
                        </div>
                      );
                    }

                    // Handle Blockquotes / Special Boxes
                    if (
                      trimmed.startsWith("> Definition:") ||
                      trimmed.startsWith("> Def:")
                    )
                      return (
                        <div
                          key={i}
                          style={{
                            background: "var(--violet-pale)",
                            borderLeft: "4px solid var(--violet)",
                            padding: "16px 20px",
                            borderRadius: "0 12px 12px 0",
                            margin: "20px 0",
                            color: "var(--ink)",
                          }}
                        >
                          <strong>Definition:</strong>{" "}
                          {trimmed.slice(trimmed.indexOf(":") + 1).trim()}
                        </div>
                      );

                    if (
                      trimmed.startsWith("> Example:") ||
                      trimmed.startsWith("> Ex:")
                    )
                      return (
                        <div
                          key={i}
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(0,200,150,0.06) 0%, rgba(0,200,150,0.02) 100%)",
                            borderLeft: "4px solid #00C896",
                            padding: "16px 20px",
                            borderRadius: "0 12px 12px 0",
                            margin: "20px 0",
                            color: "var(--ink)",
                          }}
                        >
                          <strong>Example:</strong>{" "}
                          {trimmed.slice(trimmed.indexOf(":") + 1).trim()}
                        </div>
                      );

                    if (hasAnyMath(trimmed)) {
                      return (
                        <p key={i} style={{ margin: "12px 0" }}>
                          {renderLineWithMath(trimmed)}
                        </p>
                      );
                    }

                    return (
                      <p key={i} style={{ margin: "12px 0" }}>
                        {renderInlineBold(trimmed)}
                      </p>
                    );
                  })}

                  {/* Streaming Cursor */}
                  {showStreamingIndicators && text.length > 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "1.2em",
                        background: "#4D3FFF",
                        marginLeft: "2px",
                        animation: "cc-blink 0.8s infinite",
                        verticalAlign: "text-bottom",
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Streaming Footer */}
            {showStreamingIndicators && text.length > 0 && (
              <div
                style={{
                  marginTop: 24,
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: "rgba(77,63,255,0.05)",
                  border: "1px solid rgba(77,63,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4D3FFF, #00C896)",
                      animation: "cc-pulse 1.5s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--mist)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Receiving stream...
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "#4D3FFF",
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {text.length} characters
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Missing Preferences Modal Overlay */}
        {showMissingPrefsModal && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: isMobile ? "flex-end" : "center",
            justifyContent: "center",
            zIndex: 9999
          }}>
            <div style={{
              background: "var(--deep)",
              width: isMobile ? "100%" : "90%",
              maxWidth: 440,
              borderRadius: isMobile ? "28px 28px 0 0" : 24,
              padding: isMobile ? "32px 24px 48px" : "32px",
              boxShadow: isMobile ? "0 -10px 40px rgba(0,0,0,0.2)" : "0 24px 48px rgba(0,0,0,0.2)",
              border: "1px solid var(--border-light)",
              borderBottom: isMobile ? "none" : "1px solid var(--border-light)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ fontSize: 20, color: "var(--ink)", fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 12 }}>
                Missing Learning Preferences
              </h3>
              <p style={{ fontSize: 14, color: "var(--mist)", lineHeight: 1.6, marginBottom: 24 }}>
                You haven't set up your Learning Preferences yet! Everything is currently set to default. 
                Please head to the Analytics portal to customize your learning style first.
              </p>
              
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, justifyContent: "center" }}>
                {/* On mobile, we put primary action first */}
                <button
                  onClick={() => router.push("/dashboard/analytics")}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 999,
                    border: "none",
                    background: "#00C896",
                    color: "#fff",
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,200,150,0.2)",
                    width: isMobile ? "100%" : "auto",
                    order: isMobile ? 1 : 2
                  }}
                >
                  Go to Analytics
                </button>
                <button
                  onClick={() => setShowMissingPrefsModal(false)}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 999,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--ink)",
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    width: isMobile ? "100%" : "auto",
                    order: isMobile ? 2 : 1
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function QuizTab({
  content,
  isLoading,
  courseId,
  topicId,
  unitNumber = 0,
  course,
  onQuizCompleted,
  generateForTab,
}: {
  content: TopicContent;
  isLoading: boolean;
  courseId: string;
  topicId: string;
  unitNumber?: number;
  course?: CourseData;
  onQuizCompleted?: (
    topicId: string,
    score: number,
    unitNumber: number,
    analysis?: QuizAnalysis,
  ) => void | Promise<void>;
  generateForTab?: (tab: "quiz") => Promise<void>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set(),
  );

  const questions = content?.quiz ?? [];
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setAnalysis(null);
    setExpandedQuestions(new Set());
  }, [content?.quiz]);

  // Helper to get Bloom level color and description
  const getBloomInfo = (bloomLevel?: string) => {
    const bloomMap: Record<
      string,
      { color: string; bgColor: string; description: string }
    > = {
      remember: {
        color: "#6C5B7F",
        bgColor: "rgba(108,91,127,0.08)",
        description: "Recall & Recognition — Tests memory and basic facts",
      },
      understand: {
        color: "#4D3FFF",
        bgColor: "rgba(77,63,255,0.08)",
        description: "Comprehension — Tests understanding of concepts",
      },
      apply: {
        color: "#00C896",
        bgColor: "rgba(0,200,150,0.08)",
        description: "Application — Tests practical use of knowledge",
      },
      analyze: {
        color: "#FF9500",
        bgColor: "rgba(255,149,0,0.08)",
        description: "Analysis — Tests breaking down complex ideas",
      },
      evaluate: {
        color: "#FF6B6B",
        bgColor: "rgba(255,107,107,0.08)",
        description: "Evaluation — Tests critical judgment",
      },
      create: {
        color: "#A855F7",
        bgColor: "rgba(168,85,247,0.08)",
        description: "Creation — Tests synthesis and innovation",
      },
    };
    return bloomMap[bloomLevel || "understand"] || bloomMap.understand;
  };

  // Helper to generate diagnostic message
  const getDiagnosticMessage = (
    question: QuizQuestion,
    isCorrect: boolean,
    questionIndex: number,
  ) => {
    const bloomLevel = question.bloomLevel || "understand";
    const bloomLabel = bloomLevel.charAt(0).toUpperCase() + bloomLevel.slice(1);
    const concept = question.conceptFocus || "this concept";

    if (isCorrect) {
      if (["analyze", "evaluate", "create"].includes(bloomLevel)) {
        return `✓ Excellent! You successfully demonstrated ${bloomLabel}-level thinking on ${concept}.`;
      }
      return `✓ Well done! You've mastered the ${bloomLabel}-level understanding of ${concept}.`;
    } else {
      if (["remember", "understand"].includes(bloomLevel)) {
        return `Review the notes on ${concept} to strengthen your foundation.`;
      }
      if (["apply", "analyze"].includes(bloomLevel)) {
        return `This requires ${bloomLabel}-level thinking about ${concept}. Practice similar examples.`;
      }
      return `Challenge yourself with more problems at the ${bloomLabel} level.`;
    }
  };

  const toggleQuestionExpanded = (index: number) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const uniqueText = (items: Array<string | undefined | null>) =>
    Array.from(
      new Set(items.map((item) => (item || "").trim()).filter(Boolean)),
    );

  const buildPersona = (
    pct: number,
    strengths: string[],
    weaknesses: string[],
    questions: QuizQuestion[],
  ): QuizAnalysis["persona"] => {
    const bloomLevels = questions.map((q) => q.bloomLevel).filter(Boolean);
    const advancedWins = questions.filter(
      (q, i) =>
        answers[i] === q.correct &&
        ["analyze", "evaluate", "create"].includes(String(q.bloomLevel || "")),
    ).length;

    if (pct >= 85 && advancedWins > 0) {
      return {
        label: "Strategic Thinker",
        summary:
          "You handle higher-order concepts well and can connect ideas across Bloom levels.",
        style:
          "Best with challenge questions, synthesis tasks, and case-based revision.",
        strengths: strengths.slice(0, 4),
        improvementAreas: weaknesses.slice(0, 3),
      };
    }

    if (pct >= 70) {
      return {
        label: "Steady Concept Builder",
        summary:
          "You understand the core material and benefit from more application and analysis practice.",
        style: `Responds well to structured revision, examples, and mixed Bloom-level practice (${bloomLevels.join(", ") || "core recall"}).`,
        strengths: strengths.slice(0, 4),
        improvementAreas: weaknesses.slice(0, 3),
      };
    }

    return {
      label: "Foundational Learner",
      summary:
        "You are building the base layer of the topic and should focus on recall plus guided examples.",
      style:
        "Best with short revision cycles, worked examples, and low-pressure recall drills.",
      strengths: strengths.slice(0, 3),
      improvementAreas: weaknesses.slice(0, 4),
    };
  };

  const buildBloomAnalysis = (scorePct: number): QuizAnalysis => {
    const bloomMeta = content.quizAnalysis;
    const strengths = uniqueText([
      ...(bloomMeta?.strengths || []),
      ...questions
        .filter((q, i) => answers[i] === q.correct)
        .map((q) => q.conceptFocus || q.question),
    ]);
    const weaknesses = uniqueText([
      ...(bloomMeta?.weaknesses || []),
      ...questions
        .filter((q, i) => answers[i] !== q.correct)
        .map((q) => q.conceptFocus || q.question),
    ]);
    const recommendedFocus = uniqueText([
      ...(bloomMeta?.recommendedFocus || []),
      ...weaknesses,
      ...(scorePct < 70 ? ["Revisit definitions and examples"] : []),
    ]);

    return {
      strengths,
      weaknesses,
      recommendedFocus,
      persona: buildPersona(scorePct, strengths, weaknesses, questions),
    };
  };

  // Define all hooks BEFORE any conditional returns
  const handleNextUnit = useCallback(() => {
    if (!course || !course.units || unitNumber === undefined) return;

    // Find the next unit
    const nextUnitIndex = unitNumber;
    if (nextUnitIndex < course.units.length) {
      const nextUnit = course.units[nextUnitIndex];
      const firstTopic = nextUnit.topics?.[0];

      if (firstTopic) {
        const p = new URLSearchParams(searchParams.toString());
        p.set("topicId", firstTopic.topicId);
        p.set("tab", "notes");
        router.push(`/course/${params.id}/study?${p.toString()}`);
      }
    }
  }, [course, unitNumber, router, searchParams, params.id]);

  if (isLoading) {
    return <Spinner text="Generating quiz..." />;
  }

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
        <p style={{ color: "var(--mist)", fontSize: 15, marginBottom: 24 }}>
          No quiz questions available yet.
        </p>
        {generateForTab && (
          <button
            onClick={() => generateForTab("quiz")}
            style={{
              padding: "12px 32px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: "#4D3FFF",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.2s ease",
              boxShadow: "0 8px 20px rgba(77,63,255,0.25)",
            }}
          >
            Generate Quiz
          </button>
        )}
      </div>
    );
  }

  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0,
  );
  const pct = Math.round((score / questions.length) * 100);

  const handleSubmit = async () => {
    setSubmitted(true);
    const nextAnalysis = buildBloomAnalysis(pct);
    setAnalysis(nextAnalysis);
    await onQuizCompleted?.(topicId, pct, unitNumber || 1, nextAnalysis);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        animation: "cc-fade-in 0.3s ease",
      }}
    >
      {submitted && (
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(77,63,255,0.06) 0%, rgba(0,200,150,0.06) 100%)",
            borderRadius: 18,
            padding: "28px 32px",
            textAlign: "center",
            border: "1px solid rgba(77,63,255,0.1)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 4,
            }}
          >
            You scored {score}/{questions.length} — {pct}%
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--mist)",
              marginBottom: 16,
            }}
          >
            {pct >= 80
              ? "🎉 Excellent work!"
              : pct >= 50
                ? "💪 Good effort, keep going!"
                : "📚 Review the notes and try again."}
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <button
              onClick={handleRetry}
              style={{
                padding: "10px 28px",
                borderRadius: 999,
                border: "1px solid rgba(77,63,255,0.25)",
                background: "transparent",
                color: "#4D3FFF",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(77,63,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              ↻ Retry Quiz
            </button>
            {course &&
              unitNumber !== undefined &&
              unitNumber < course.units.length && (
                <button
                  onClick={handleNextUnit}
                  style={{
                    padding: "10px 28px",
                    borderRadius: 999,
                    border: "none",
                    background: "#4D3FFF",
                    color: "#fff",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(77,63,255,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(77,63,255,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(77,63,255,0.25)";
                  }}
                >
                  → Next Unit
                </button>
              )}
          </div>

          {analysis && (
            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  background: "rgba(0,200,150,0.08)",
                  border: "1px solid rgba(0,200,150,0.18)",
                  borderRadius: 14,
                  padding: 16,
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
                  {analysis.strengths.slice(0, 4).join(" · ") ||
                    "No clear strengths detected yet."}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,77,90,0.06)",
                  border: "1px solid rgba(255,77,90,0.16)",
                  borderRadius: 14,
                  padding: 16,
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
                  Needs Focus
                </div>
                <div
                  style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}
                >
                  {analysis.weaknesses.slice(0, 4).join(" · ") ||
                    "No major gaps detected."}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(77,63,255,0.08)",
                  border: "1px solid rgba(77,63,255,0.16)",
                  borderRadius: 14,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#4D3FFF",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 8,
                  }}
                >
                  Persona
                </div>
                <div
                  style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6 }}
                >
                  <strong>{analysis.persona.label}</strong>
                  <div>{analysis.persona.summary}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {questions.map((q, qi) => {
        const isCorrect = answers[qi] === q.correct;
        const isExpanded = expandedQuestions.has(qi);
        const bloomInfo = getBloomInfo(q.bloomLevel);

        return (
          <div
            key={qi}
            style={{
              background: "var(--deep)",
              borderRadius: 14,
              padding: "20px 24px",
              border: submitted
                ? `1px solid ${isCorrect ? "rgba(0,200,150,0.3)" : "rgba(255,77,90,0.3)"}`
                : "1px solid var(--border-light)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 14,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "var(--mist)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                }}
              >
                Q{qi + 1}.
              </span>
              <span style={{ flex: 1 }}>{q.question}</span>
              {submitted && (
                <span
                  style={{
                    marginLeft: "auto",
                    flexShrink: 0,
                    color: isCorrect ? "#00C896" : "#FF4D5A",
                    fontSize: 16,
                  }}
                >
                  {isCorrect ? "✓" : "✗"}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: submitted ? 12 : 0,
              }}
            >
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const showCorrect = submitted && oi === q.correct;
                const showWrong = submitted && selected && !isCorrect;
                let bg = "var(--border-light)";
                let border = "1px solid var(--border-light)";
                if (selected && !submitted) {
                  bg = "rgba(77,63,255,0.08)";
                  border = "1px solid rgba(77,63,255,0.25)";
                }
                if (showCorrect) {
                  bg = "rgba(0,200,150,0.08)";
                  border = "1px solid rgba(0,200,150,0.3)";
                }
                if (showWrong) {
                  bg = "rgba(255,77,90,0.06)";
                  border = "1px solid rgba(255,77,90,0.25)";
                }

                return (
                  <label
                    key={oi}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: bg,
                      border,
                      cursor: submitted ? "default" : "pointer",
                      transition: "all 0.15s ease",
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--ink)",
                    }}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={selected}
                      disabled={submitted}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [qi]: oi }))
                      }
                      style={{
                        accentColor: "#4D3FFF",
                        width: 16,
                        height: 16,
                        cursor: submitted ? "default" : "pointer",
                      }}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>

            {/* Bloom Details Panel - shown when submitted */}
            {submitted && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(77,63,255,0.1)",
                }}
              >
                <button
                  onClick={() => toggleQuestionExpanded(qi)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    background: bloomInfo.bgColor,
                    border: `1px solid ${bloomInfo.color}20`,
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: bloomInfo.color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${bloomInfo.color}12`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = bloomInfo.bgColor;
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      transition: "transform 0.2s ease",
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  >
                    ▶
                  </span>
                  <span>
                    Bloom Analysis:{" "}
                    {q.bloomLevel
                      ? q.bloomLevel.charAt(0).toUpperCase() +
                        q.bloomLevel.slice(1)
                      : "Understand"}
                  </span>
                </button>

                {isExpanded && (
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      paddingLeft: 12,
                      animation: "cc-fade-in 0.2s ease",
                    }}
                  >
                    {/* Bloom Level Badge */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        padding: "10px 12px",
                        background: bloomInfo.bgColor,
                        borderRadius: 8,
                        border: `1px solid ${bloomInfo.color}15`,
                      }}
                    >
                      <span style={{ fontSize: "12px", marginTop: "1px" }}>
                        📊
                      </span>
                      <div style={{ fontSize: "13px", lineHeight: 1.5 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: bloomInfo.color,
                            marginBottom: 2,
                          }}
                        >
                          {q.bloomLevel
                            ? q.bloomLevel.charAt(0).toUpperCase() +
                              q.bloomLevel.slice(1)
                            : "Understand"}
                        </div>
                        <div style={{ color: "var(--mist)", fontSize: "12px" }}>
                          {bloomInfo.description}
                        </div>
                      </div>
                    </div>

                    {/* Concept Focus */}
                    {q.conceptFocus && (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          padding: "10px 12px",
                          background: "var(--violet-pale)",
                          borderRadius: 8,
                          border: "1px solid var(--border-light)",
                        }}
                      >
                        <span style={{ fontSize: "12px", marginTop: "1px" }}>
                          🎯
                        </span>
                        <div style={{ fontSize: "13px" }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "var(--ink)",
                              marginBottom: 2,
                            }}
                          >
                            Concept Focus
                          </div>
                          <div style={{ color: "var(--mist)" }}>
                            {q.conceptFocus}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rationale */}
                    {q.rationale && (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          padding: "10px 12px",
                          background: "var(--amber-pale)",
                          borderRadius: 8,
                          border: "1px solid var(--border-light)",
                        }}
                      >
                        <span style={{ fontSize: "12px", marginTop: "1px" }}>
                          💡
                        </span>
                        <div style={{ fontSize: "13px" }}>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "var(--ink)",
                              marginBottom: 2,
                            }}
                          >
                            Why This Matters
                          </div>
                          <div style={{ color: "var(--mist)" }}>
                            {q.rationale}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Diagnostic Message */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        padding: "10px 12px",
                        background: isCorrect
                          ? "rgba(0,200,150,0.04)"
                          : "rgba(255,77,90,0.04)",
                        borderRadius: 8,
                        border: isCorrect
                          ? "1px solid rgba(0,200,150,0.12)"
                          : "1px solid rgba(255,77,90,0.12)",
                      }}
                    >
                      <span style={{ fontSize: "12px", marginTop: "1px" }}>
                        {isCorrect ? "✓" : "📝"}
                      </span>
                      <div style={{ fontSize: "13px", color: "var(--mist)" }}>
                        {getDiagnosticMessage(q, isCorrect, qi)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          style={{
            padding: "14px 36px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background:
              Object.keys(answers).length < questions.length
                ? "rgba(77,63,255,0.4)"
                : "#4D3FFF",
            color: "#fff",
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 600,
            alignSelf: "center",
            transition: "all 0.2s ease",
          }}
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}
