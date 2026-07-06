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
  User,
  BookOpen,
  Clock,
  PenSquare,
} from "lucide-react";
import api, { getFriendlyErrorMessage } from "@/lib/api";

export default function RecordPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<
    { time: string; text: string }[]
  >([]);
  const [sessionName, setSessionName] = useState("");
  const [subject, setSubject] = useState("");
  const [professor, setProfessor] = useState("");
  const [lectureNo, setLectureNo] = useState("1");
  const [isSaving, setIsSaving] = useState(false);
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const classroomIdRef = useRef<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "error" | "success";
  } | null>(null);

  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const recognitionRef = useRef<any>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef<number>(0);
  const maxRetriesRef = useRef<number>(5);
  const isRecordingRef = useRef(false);
  const recognitionActiveRef = useRef(false);
  const recognitionStartPendingRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRestartTimer = () => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  };

  const startRecognitionSafely = () => {
    const recognition = recognitionRef.current;
    if (
      !recognition ||
      !isRecordingRef.current ||
      recognitionActiveRef.current ||
      recognitionStartPendingRef.current
    ) {
      return;
    }

    recognitionStartPendingRef.current = true;
    try {
      recognition.start();
    } catch (err) {
      const message = String((err as Error)?.message || err);
      if (!message.includes("already started")) {
        console.error("Failed to start speech recognition:", err);
      }
    } finally {
      recognitionStartPendingRef.current = false;
    }
  };

  const scheduleRecognitionRestart = (delayMs: number) => {
    clearRestartTimer();
    restartTimerRef.current = setTimeout(() => {
      if (!isRecordingRef.current) {
        return;
      }

      startRecognitionSafely();
    }, delayMs);
  };

  const setupSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        recognitionActiveRef.current = true;
        recognitionStartPendingRef.current = false;
        clearRestartTimer();
      };

      recognitionRef.current.onresult = (event: any) => {
        retryCountRef.current = 0; // Reset retry count on successful result
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        if (event.results[event.results.length - 1].isFinal) {
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          setTranscript((prev) => [
            ...prev,
            { time: timestamp, text: currentTranscript },
          ]);

          if (classroomIdRef.current) {
            sendChunk(currentTranscript, classroomIdRef.current);
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "network") {
          recognitionActiveRef.current = false;
          retryCountRef.current += 1;
          if (retryCountRef.current <= maxRetriesRef.current) {
            showToast(
              `Network reconnecting... (${retryCountRef.current}/${maxRetriesRef.current})`,
            );
            scheduleRecognitionRestart(1000 + retryCountRef.current * 500);
          } else {
            showToast(
              "Network Error: Service unreachable. Please check your connection.",
            );
            setIsRecording(false);
            isRecordingRef.current = false;
          }
        } else if (event.error === "not-allowed") {
          showToast("Microphone access denied.");
          setIsRecording(false);
          isRecordingRef.current = false;
        } else if (event.error === "audio-capture") {
          showToast("No microphone found or microphone is already in use.");
          setIsRecording(false);
          isRecordingRef.current = false;
        } else if (event.error === "no-speech") {
          recognitionActiveRef.current = false;
          scheduleRecognitionRestart(500);
        }
      };

      recognitionRef.current.onend = () => {
        recognitionActiveRef.current = false;
        recognitionStartPendingRef.current = false;
        if (isRecordingRef.current && recognitionRef.current) {
          scheduleRecognitionRestart(250);
        }
      };
    }
  };

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    setupSpeechRecognition();

    return () => {
      isRecordingRef.current = false;
      recognitionActiveRef.current = false;
      recognitionStartPendingRef.current = false;
      clearRestartTimer();
      recognitionRef.current?.abort?.();
      recognitionRef.current = null;
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const sendChunk = async (text: string, cid?: string) => {
    const id = cid || classroomIdRef.current;
    if (!text.trim() || !id) return;
    try {
      console.log("Saving transcript chunk:", text);
      await api.post(`/classrooms/${id}/chunks`, { content: text });
    } catch (err) {
      console.error("Failed to send chunk:", err);
    }
  };

  const startRecording = async () => {
    if (!sessionName.trim() || !subject.trim()) {
      showToast("Please enter both a session name and subject.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast(
        "Your browser does not support Web Speech API. Please use Chrome or Edge.",
      );
      return;
    }

    try {
      setIsSaving(true);
      retryCountRef.current = 0; // Reset retry count on new session

      if (!audioStreamRef.current) {
        audioStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const res = await api.post("/classrooms", {
        name: sessionName,
        subject: subject,
        professor: professor || "Unknown",
        lecture_no: parseInt(lectureNo) || 1,
      });

      const data = res.data?.data || res.data;
      const id = data.class_id || data.id || data.classroom_id;

      if (!id) throw new Error("Backend response missing ID.");

      setClassroomId(id);
      classroomIdRef.current = id;
      setIsRecording(true);
      isRecordingRef.current = true;
      if (recognitionRef.current) {
        startRecognitionSafely();
      }
      setIsSaving(false);
    } catch (err: any) {
      console.error("Failed to start session:", err);
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
      setIsSaving(false);
      showToast(getFriendlyErrorMessage(err, "Unable to start this session."));
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    recognitionActiveRef.current = false;
    recognitionStartPendingRef.current = false;
    clearRestartTimer();
    recognitionRef.current?.stop();
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    setIsRecording(false);
  };

  const handleFinish = async () => {
    try {
      setIsSaving(true);
      if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
      }
      setTimeout(() => router.push("/classroom"), 600);
    } catch (err) {
      router.push("/classroom");
    }
  };

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
                  color: "#4D3FFF",
                  fontSize: 14,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    background: "#4D3FFF",
                    borderRadius: "50%",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                AI TRANSCRIPTION ACTIVE
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
                maxWidth: 460,
                marginBottom: 24,
                textAlign: "center",
                lineHeight: 1.6,
                fontSize: 18,
              }}
            >
              Choose how you want to start. Audio recording keeps the current
              flow; text notes opens a dedicated notes page.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 16,
                width: "100%",
                maxWidth: 540,
                marginBottom: 24,
              }}
            >
              <button
                type="button"
                onClick={() => {}}
                style={{
                  border: "1px solid rgba(77, 63, 255, 0.18)",
                  borderRadius: 20,
                  background: "rgba(77, 63, 255, 0.08)",
                  color: "var(--ink)",
                  padding: "16px 18px",
                  textAlign: "left",
                  display: "grid",
                  gap: 8,
                  cursor: "default",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 800,
                  }}
                >
                  <Mic size={16} /> Audio session
                </span>
                <span
                  style={{
                    color: "var(--mist)",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  Use the existing live transcription flow.
                </span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/classroom/text")}
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: 20,
                  background: "var(--deep)",
                  color: "var(--ink)",
                  padding: "16px 18px",
                  textAlign: "left",
                  display: "grid",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 800,
                  }}
                >
                  <PenSquare size={16} /> Text notes
                </span>
                <span
                  style={{
                    color: "var(--mist)",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  Write notes directly and save them with the classroom API.
                </span>
              </button>
            </div>

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
                      fontWeight: 800,
                      color: "#4D3FFF",
                      opacity: 0.6,
                    }}
                  >
                    {line.time}
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
              {isRecording && (
                <div
                  style={{
                    display: "flex",
                    gap: 40,
                    color: "#4D3FFF",
                    opacity: 0.5,
                  }}
                >
                  <div style={{ width: 90, fontWeight: 900, fontSize: 12 }}>
                    LIVE
                  </div>
                  <div style={{ flex: 1, fontSize: 20 }}>
                    Capturing lecture audio...
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
                  color: "#4D3FFF",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                <Sparkles size={18} /> AI ASSISTANT TRANSCRIBING
              </div>
              <div style={{ fontWeight: 700, color: "var(--mist)" }}>
                {transcript.length} segments saved
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
