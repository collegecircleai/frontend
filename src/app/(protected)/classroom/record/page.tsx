"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  StopCircle,
  Save,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import { getFriendlyErrorMessage } from "@/lib/api";
import {
  startLiveTranscription,
  type LiveStatus,
  type LiveTranscriptionSession,
} from "@/lib/liveTranscription";

const JADE = "#00C896";
const VIOLET = "#4D3FFF";

type TranscriptLine = { time: string; text: string; saved: boolean };

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export default function RecordPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [partial, setPartial] = useState("");
  const [status, setStatus] = useState<LiveStatus>("stopped");
  const [sessionName, setSessionName] = useState("");
  const [subject, setSubject] = useState("");
  const [professor, setProfessor] = useState("");
  const [lectureNo, setLectureNo] = useState("1");
  const [isSaving, setIsSaving] = useState(false);
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "error" | "success";
  } | null>(null);

  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const sessionRef = useRef<LiveTranscriptionSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      sessionRef.current?.stop();
      sessionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, partial]);

  const startRecording = async () => {
    if (!sessionName.trim() || !subject.trim()) {
      showToast("Please enter both a session name and subject.");
      return;
    }

    try {
      setIsSaving(true);
      setPartial("");

      sessionRef.current = await startLiveTranscription({
        name: sessionName,
        subject,
        professor: professor || "Unknown",
        lecture_no: parseInt(lectureNo) || 1,
        onSessionCreated: setClassroomId,
        onStatus: setStatus,
        onPartial: setPartial,
        onFinal: (line) => {
          setPartial("");
          setTranscript((prev) => [
            ...prev,
            { time: formatTime(line.at), text: line.text, saved: line.saved },
          ]);
        },
        onError: (message, fatal) => {
          showToast(message);
          if (fatal) {
            sessionRef.current = null;
            setIsRecording(false);
            setStatus("stopped");
            setPartial("");
          }
        },
      });

      setIsRecording(true);
      setIsSaving(false);
    } catch (err: any) {
      sessionRef.current = null;
      setIsSaving(false);
      setStatus("stopped");
      const denied =
        err?.name === "NotAllowedError" || err?.name === "SecurityError";
      showToast(
        denied
          ? "Microphone access denied. Allow the mic to record this lecture."
          : err?.name === "NotFoundError"
            ? "No microphone found."
            : getFriendlyErrorMessage(err, "Unable to start this session."),
      );
    }
  };

  const stopRecording = () => {
    sessionRef.current?.stop();
    sessionRef.current = null;
    setIsRecording(false);
    setPartial("");
    setStatus("stopped");
  };

  const handleFinish = () => {
    stopRecording();
    setIsSaving(true);
    const target = classroomId ? `/classroom/${classroomId}` : "/classroom";
    setTimeout(() => router.push(target), 600);
  };

  const statusLabel =
    status === "reconnecting"
      ? "RECONNECTING…"
      : status === "connecting"
        ? "CONNECTING…"
        : status === "speaking"
          ? "LISTENING"
          : "LIVE TRANSCRIPTION ACTIVE";

  const statusColor = status === "reconnecting" ? "#FF4D5A" : JADE;

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            background: toast.type === "error" ? "#FF4D5A" : "#14122A",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: 20,
            fontWeight: 700,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation:
              "toastIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          }}
        >
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 48,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
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
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
            }}
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 900,
                color: "var(--ink)",
                letterSpacing: "-0.04em",
              }}
            >
              {isRecording ? "Recording Live..." : "New Session"}
            </h1>
            {isRecording && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: statusColor,
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    background: statusColor,
                    borderRadius: "50%",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                {statusLabel}
              </div>
            )}
          </div>
        </div>

        {isRecording && (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={stopRecording}
              style={{
                background: "#14122A",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 18,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              <StopCircle size={20} /> Pause
            </button>
            <button
              onClick={handleFinish}
              style={{
                background: "linear-gradient(135deg, #4D3FFF, #6C5BFF)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 18,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 15px 30px rgba(77,63,255,0.2)",
              }}
            >
              <Save size={20} /> Save & Exit
            </button>
          </div>
        )}
      </div>

      {/* Main UI */}
      <div
        style={{
          flex: 1,
          background: "var(--deep)",
          borderRadius: 48,
          border: "1px solid var(--border-light)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.03)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!isRecording && transcript.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 40px",
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                background: "rgba(77,63,255,0.05)",
                color: "#4D3FFF",
                borderRadius: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 32,
              }}
            >
              <Mic size={48} />
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 900,
                color: "var(--ink)",
                marginBottom: 12,
              }}
            >
              Initialize Session
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--mist)",
                maxWidth: 400,
                marginBottom: 48,
                textAlign: "center",
                lineHeight: 1.6,
                fontSize: 18,
              }}
            >
              Fill in the lecture details below to start your AI-powered
              recording.
            </p>

            <div
              style={{
                width: "100%",
                maxWidth: 540,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#4D3FFF",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 10,
                      marginLeft: 4,
                    }}
                  >
                    Lecture Title
                  </label>
                  <input
                    type="text"
                    placeholder="Data Structures"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "18px 24px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border-light)",
                      borderRadius: 20,
                      outline: "none",
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  />
                </div>
                <div style={{ textAlign: "left" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#4D3FFF",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 10,
                      marginLeft: 4,
                    }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Computer Science"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "18px 24px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border-light)",
                      borderRadius: 20,
                      outline: "none",
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr",
                  gap: 20,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#4D3FFF",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 10,
                      marginLeft: 4,
                    }}
                  >
                    Professor
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Jane Smith"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "18px 24px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border-light)",
                      borderRadius: 20,
                      outline: "none",
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  />
                </div>
                <div style={{ textAlign: "left" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#4D3FFF",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 10,
                      marginLeft: 4,
                    }}
                  >
                    Lecture No.
                  </label>
                  <input
                    type="number"
                    value={lectureNo}
                    onChange={(e) => setLectureNo(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "18px 24px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border-light)",
                      borderRadius: 20,
                      outline: "none",
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  />
                </div>
              </div>
              <button
                onClick={startRecording}
                disabled={isSaving}
                style={{
                  background: "#4D3FFF",
                  color: "#fff",
                  padding: "20px",
                  borderRadius: 22,
                  fontWeight: 800,
                  fontSize: 18,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 20px 40px rgba(77,63,255,0.25)",
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                {isSaving ? <Loader2 className="spin" /> : <Mic />} Start
                Recording
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                padding: 60,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 40,
              }}
            >
              {transcript.map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 40,
                    animation: "fadeIn 0.5s ease forwards",
                  }}
                >
                  <div
                    style={{
                      width: 90,
                      flexShrink: 0,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: line.saved ? VIOLET : "#FF4D5A",
                      opacity: 0.7,
                    }}
                  >
                    {line.time}
                    {!line.saved && " ⚠"}
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
                    {line.text}
                  </div>
                </div>
              ))}
              {/* Provisional text for the utterance still being spoken. Replaced
                  in place by the styled final line when Sarvam's VAD closes it. */}
              {isRecording && (
                <div style={{ display: "flex", gap: 40 }}>
                  <div
                    style={{
                      width: 90,
                      flexShrink: 0,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: statusColor,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {status === "speaking" ? "● REC" : "LIVE"}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontSize: 20,
                      lineHeight: 1.8,
                      fontWeight: 400,
                      fontStyle: partial ? "normal" : "italic",
                      color: partial ? "var(--mist)" : statusColor,
                      opacity: partial ? 0.9 : 0.5,
                      borderLeft: `3px dashed ${statusColor}33`,
                      paddingLeft: 40,
                    }}
                  >
                    {partial ||
                      (status === "reconnecting"
                        ? "Reconnecting to transcription…"
                        : "Listening…")}
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                padding: "32px 60px",
                background: "rgba(0,0,0,0.1)",
                borderTop: "1px solid var(--border-light)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: JADE,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontSize: 13,
                  letterSpacing: "0.08em",
                }}
              >
                <Sparkles size={18} /> SARVAM REALTIME TRANSCRIPTION
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  color: "var(--mist)",
                }}
              >
                {transcript.filter((line) => line.saved).length} segments saved
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
