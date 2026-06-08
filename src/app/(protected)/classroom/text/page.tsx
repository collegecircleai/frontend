"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, PenSquare, Save } from "lucide-react";
import api, { getFriendlyErrorMessage } from "@/lib/api";

export default function TextNotesPage() {
  const router = useRouter();
  const [sessionName, setSessionName] = useState("");
  const [subject, setSubject] = useState("");
  const [professor, setProfessor] = useState("");
  const [lectureNo, setLectureNo] = useState("1");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "error" | "success";
  } | null>(null);

  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    if (!sessionName.trim() || !subject.trim() || !notes.trim()) {
      showToast(
        "Please enter a session name, subject, and notes before saving.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await api.post("/classrooms", {
        name: sessionName.trim(),
        subject: subject.trim(),
        professor: professor.trim() || "Unknown",
        lecture_no: Number(lectureNo) || 1,
        summary_cache: {
          notes_markdown: notes.trim(),
          quiz: [],
        },
      });

      showToast("Notes saved successfully.", "success");
      setTimeout(() => router.push("/classroom"), 500);
    } catch (err) {
      console.error("Failed to save notes:", err);
      showToast(
        getFriendlyErrorMessage(err, "Unable to save your notes right now."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 980,
        margin: "0 auto",
        minHeight: "calc(100vh - 120px)",
        padding: "40px 20px 56px",
      }}
    >
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            background: toast.type === "error" ? "#FF4D5A" : "#14122A",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 16,
            fontWeight: 700,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
        >
          {toast.msg}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "var(--deep)",
            border: "1px solid var(--border-light)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ink)",
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "var(--mist)",
              fontSize: 12,
              margin: 0,
            }}
          >
            Classroom
          </p>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: "var(--ink)",
              margin: "6px 0 0",
            }}
          >
            Write Notes
          </h1>
        </div>
      </div>

      <div
        style={{
          background: "var(--deep)",
          borderRadius: 32,
          border: "1px solid var(--border-light)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.04)",
          padding: 24,
        }}
      >
        <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <label style={styles.label}>
              Lecture Title
              <input
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                style={styles.input}
                placeholder="Week 4: Algorithms"
              />
            </label>
            <label style={styles.label}>
              Subject
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={styles.input}
                placeholder="Computer Science"
              />
            </label>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 0.7fr",
              gap: 16,
            }}
          >
            <label style={styles.label}>
              Professor
              <input
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                style={styles.input}
                placeholder="Dr. Smith"
              />
            </label>
            <label style={styles.label}>
              Lecture No.
              <input
                type="number"
                value={lectureNo}
                onChange={(e) => setLectureNo(e.target.value)}
                style={styles.input}
              />
            </label>
          </div>
        </div>

        <label style={styles.label}>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your lecture notes here..."
            style={{
              ...styles.input,
              minHeight: 220,
              resize: "vertical",
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          />
        </label>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginTop: 18,
            flexWrap: "wrap",
          }}
        >
          <p style={{ color: "var(--mist)", fontSize: 13, margin: 0 }}>
            This saves your notes through the existing classroom creation
            endpoint.
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: "linear-gradient(135deg, #4D3FFF, #6C5BFF)",
              color: "#fff",
              borderRadius: 18,
              padding: "14px 18px",
              border: "none",
              cursor: isSaving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontWeight: 800,
            }}
          >
            {isSaving ? <Loader2 className="spin" /> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Notes"}
          </button>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  label: {
    display: "grid",
    gap: 8,
    fontSize: 12,
    color: "#4D3FFF",
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    fontWeight: 800,
  },
  input: {
    width: "100%",
    borderRadius: 18,
    border: "1px solid var(--border-light)",
    background: "rgba(255,255,255,0.04)",
    padding: "14px 16px",
    fontSize: 15,
    fontWeight: 600,
    color: "var(--ink)",
    outline: "none",
  },
};
