"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mic,
  Clock,
  ChevronRight,
  Play,
  BookOpen,
  Trash2,
  Sparkles,
  Filter,
  Plus,
} from "lucide-react";
import api, { getFriendlyErrorMessage } from "@/lib/api";

interface ClassroomSession {
  class_id: string;
  name: string;
  subject: string;
  transcript: string;
  created_at: string;
}

export default function ClassroomPage() {
  const [sessions, setSessions] = useState<ClassroomSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    msg: string;
    type: "error" | "success";
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/classrooms");
      const raw = res.data?.data || res.data;
      const list = Array.isArray(raw) ? raw : raw?.data || [];
      setSessions(list);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      showToast(getFriendlyErrorMessage(err, "Failed to sync your history."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const deleteSession = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/classrooms/${id}`);
      setSessions((prev) =>
        prev.filter((s) => {
          const sid = s.class_id || (s as any).classroom_id || (s as any).id;
          return sid !== id;
        }),
      );
      showToast("Recording removed successfully", "success");
    } catch (err) {
      showToast(
        getFriendlyErrorMessage(err, "Delete failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAllSessions = async () => {
    try {
      setLoading(true);
      await Promise.all(
        sessions.map((s) => {
          const id = s.class_id || (s as any).classroom_id || (s as any).id;
          return api.delete(`/classrooms/${id}`);
        }),
      );
      setSessions([]);
      showToast("Classroom history cleared", "success");
    } catch (err) {
      showToast(getFriendlyErrorMessage(err, "Failed to clear some sessions."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: isMobile ? "24px 20px" : "40px 56px",
        position: "relative",
        isolation: "isolate",
        minHeight: "100vh",
      }}
    >

      {/* Premium Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 40,
            right: 40,
            zIndex: 10000,
            background: toast.type === "error" ? "#FF4D5A" : "#14122A",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: "20px",
            fontWeight: 600,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background:
                toast.type === "error" ? "rgba(255,255,255,0.2)" : "#4D3FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            {toast.type === "error" ? "!" : <Sparkles size={12} />}
          </div>
          {toast.msg}
        </div>
      )}

      {/* Header Section */}
      <div style={{ marginBottom: 60 }}>
         <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "flex-end",
            justifyContent: "space-between",
          }}
        >

           <div style={{ flex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,

                background: "rgba(77,63,255,0.06)",
                color: "#4D3FFF",
                padding: "6px 12px",
                borderRadius: "100px",
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
              <Sparkles size={14} /> Classroom AI
            </div>
             <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: isMobile ? 32 : 48,
                fontWeight: 900,
                color: "var(--ink)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              Your Lectures
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--mist)",
                marginTop: 12,
                fontSize: 16,
                maxWidth: 500,
                lineHeight: 1.6,
              }}
            >
              Access your past classroom recordings, AI-powered transcripts, and
              study guides in one central hub.
            </p>
          </div>

           <div 
            style={{ 
              display: "flex", 
              gap: 12, 
              flexDirection: isMobile ? "column" : "row",
              marginTop: isMobile ? 24 : 0,
              width: isMobile ? "100%" : "auto"
            }}
          >
            {sessions.length > 0 && (
              <button
                onClick={clearAllSessions}
                style={{
                  height: isMobile ? 48 : 56,
                  padding: "0 24px",
                  borderRadius: 16,
                  background: "var(--deep)",
                  border: "1px solid var(--border-light)",
                  color: "#FF4D5A",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  fontSize: isMobile ? 14 : 15
                }}
              >
                <Trash2 size={isMobile ? 18 : 20} /> Clear All
              </button>
            )}
            <Link
              href="/classroom/record"
              style={{
                height: isMobile ? 52 : 56,
                padding: "0 32px",
                borderRadius: 16,
                background: "linear-gradient(135deg, #4D3FFF, #6C5BFF)",
                color: "#fff",
                fontWeight: 800,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                boxShadow: "0 20px 40px rgba(77,63,255,0.3)",
                transition: "all 0.3s ease",
                fontSize: isMobile ? 15 : 16
              }}
            >
              <Plus size={isMobile ? 20 : 24} strokeWidth={3} />
              <span>New Recording</span>
            </Link>
          </div>
        </div>
      </div>


      {/* Main Content Area */}
      {loading ? (
         <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >

          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: 240,
                background: "var(--deep)",
                borderRadius: 32,
                border: "1px solid var(--border-light)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,0,0,0.02), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div
          style={{
            background: "var(--deep)",
            borderRadius: 48,
            padding: "120px 40px",
            textAlign: "center",
            border: "1px solid var(--border-light)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 40px 80px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              background: "rgba(77,63,255,0.05)",
              color: "#4D3FFF",
              borderRadius: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
              position: "relative",
            }}
          >
            <Mic size={56} />
            <div
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 40,
                height: 40,
                background: "var(--deep)",
                border: "1px solid var(--border-light)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Plus size={24} color="#4D3FFF" strokeWidth={3} />
            </div>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 900,
              color: "var(--ink)",
              marginBottom: 16,
            }}
          >
            No Lecture History
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--mist)",
              marginBottom: 48,
              maxWidth: 400,
              lineHeight: 1.7,
              fontSize: 18,
            }}
          >
            Start your first recording session and let our AI transform your
            voice into organized knowledge.
          </p>
          <Link
            href="/classroom/record"
            style={{
              background: "#14122A",
              color: "#fff",
              padding: "18px 40px",
              borderRadius: 20,
              fontWeight: 800,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Start First Session <ChevronRight size={20} />
          </Link>
        </div>
      ) : (
         <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))",
            gap: isMobile ? 16 : 32,
          }}
        >

          {sessions.map((session: any) => {
            const sid = session.class_id || session.classroom_id || session.id;
            const dateObj = new Date(
              session.created_at || session.createdAt || new Date(),
            );

            return (
                 <div
                key={sid}
                className="session-card"
                style={{
                  background: "var(--deep)",
                  borderRadius: 24,
                  padding: isMobile ? 24 : 32,
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                  position: "relative",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      background: "rgba(77,63,255,0.08)",
                      color: "#4D3FFF",
                      borderRadius: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Play size={28} fill="#4D3FFF" />
                  </div>
                  <button
                    onClick={() => deleteSession(sid)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: "#FFF5F6",
                      border: "none",
                      color: "#FF4D5A",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#FFE0E2")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#FFF5F6")
                    }
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#4D3FFF",
                        opacity: 0.8,
                      }}
                    >
                      {session.subject || "General"}
                    </span>
                  </div>
                   <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: isMobile ? 20 : 24,
                      fontWeight: 900,
                      color: "var(--ink)",
                      lineHeight: 1.2,
                      marginBottom: 12,
                      wordBreak: "break-word",
                      overflowWrap: "anywhere"
                    }}
                  >
                    {session.name || "Untitled Session"}
                  </h3>


                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      color: "var(--mist)",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Clock size={16} />
                      {dateObj.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <span>•</span>
                    <div>
                      {dateObj.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 32 }}>
                  <Link
                    href={`/classroom/${sid}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      width: "100%",
                      height: 60,
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.04)",
                      color: "var(--ink)",
                      fontWeight: 800,
                      fontSize: 15,
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      border: "1px solid var(--border-light)",
                    }}
                    className="view-btn"
                  >
                    View Details <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .session-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(77,63,255,0.08);
          border-color: rgba(77,63,255,0.1) !important;
        }
        .session-card:hover .view-btn {
          background: #4D3FFF !important;
          color: #fff !important;
          box-shadow: 0 10px 20px rgba(77,63,255,0.15);
        }
      `}</style>
    </div>
  );
}
