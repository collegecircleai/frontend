"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2, ArrowLeft, MoreHorizontal, Clock, Star } from "lucide-react";
import api, { getFriendlyErrorMessage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import "react-quill/dist/quill.snow.css";

// ReactQuill requires document/window to exist, so it must be dynamically imported with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "40px", textAlign: "center", color: "var(--mist)" }}>
      Loading editor...
    </div>
  ),
});

export default function TextNotesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sessionName, setSessionName] = useState("Untitled Lecture");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [subject, setSubject] = useState("General Notes");
  const [professor, setProfessor] = useState("Unknown");
  const [lectureNo, setLectureNo] = useState("1");
  const [isStarred, setIsStarred] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "info" | "error" | "success" } | null>(null);

  const showToast = (msg: string, type: "info" | "error" | "success" = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!notes.trim()) {
      showToast("Please write some notes before saving.", "error");
      return;
    }

    try {
      setIsSaving(true);

      await api.post("/classrooms", {
        name: sessionName.trim() || "Untitled Lecture",
        subject: subject.trim() || "General Notes",
        professor: professor.trim() || "Unknown",
        lecture_no: Number(lectureNo) || 1,
        summary_cache: {
          notes_markdown: notes.trim(),
          quiz: [],
        },
      });

      router.push("/classroom");
    } catch (err) {
      console.error("Failed to save notes:", err);
      showToast(getFriendlyErrorMessage(err, "Unable to save your notes right now."), "error");
    } finally {
      setIsSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 72px)", // Adjusts for dashboard top navbar
        background: "var(--pearl)",
        position: "relative",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          background: toast.type === "error" ? "#EF4444" : "var(--ink)",
          color: toast.type === "error" ? "#fff" : "var(--pearl)",
          padding: "12px 24px",
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 600,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          {toast.type === "info" && <Clock size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Document Settings Modal */}
      {showSettings && (
        <div className="settings-modal-overlay" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="settings-modal-content" style={{
            background: "var(--deep)", borderRadius: 20, padding: 32,
            width: 400, border: "1px solid var(--border-light)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 8, color: "var(--ink)", fontSize: 20, fontWeight: 800 }}>
              Document Details
            </h3>
            <p style={{ margin: "0 0 24px 0", color: "var(--mist)", fontSize: 13 }}>
              These details will be saved with your lecture notes.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--mist)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Subject
                <input 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)} 
                  style={{ 
                    width: "100%", padding: "12px 16px", marginTop: 8, borderRadius: 12, 
                    border: "1px solid var(--border-light)", background: "var(--pearl)", 
                    color: "var(--ink)", fontSize: 15, fontWeight: 600, outline: "none" 
                  }} 
                />
              </label>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--mist)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Professor
                  <input 
                    value={professor} 
                    onChange={e => setProfessor(e.target.value)} 
                    style={{ 
                      width: "100%", padding: "12px 16px", marginTop: 8, borderRadius: 12, 
                      border: "1px solid var(--border-light)", background: "var(--pearl)", 
                      color: "var(--ink)", fontSize: 15, fontWeight: 600, outline: "none" 
                    }} 
                  />
                </label>

                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--mist)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Lecture No.
                  <input 
                    type="number" 
                    value={lectureNo} 
                    onChange={e => setLectureNo(e.target.value)} 
                    style={{ 
                      width: "100%", padding: "12px 16px", marginTop: 8, borderRadius: 12, 
                      border: "1px solid var(--border-light)", background: "var(--pearl)", 
                      color: "var(--ink)", fontSize: 15, fontWeight: 600, outline: "none" 
                    }} 
                  />
                </label>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSettings(false)} 
              style={{
                width: "100%", marginTop: 32, padding: 14, borderRadius: 12,
                background: "var(--violet)", color: "#fff", border: "none", 
                fontWeight: 800, fontSize: 15, cursor: "pointer"
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header
        className="editor-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border-light)",
          background: "var(--pearl)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="editor-header-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--mist)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowLeft size={18} />
          </button>
          
          <div
            className="breadcrumb-container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              color: "var(--ink)",
            }}
          >
            <span className="breadcrumb-text" style={{ color: "var(--violet)", fontWeight: 600 }}>{subject || "Subject"}</span>
            <span className="breadcrumb-divider" style={{ color: "var(--mist)", opacity: 0.5 }}>/</span>
            <input
              className="title-input"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontWeight: 600,
                fontSize: 14,
                width: 150,
                background: "transparent",
                color: "var(--ink)",
              }}
            />
          </div>
        </div>

        <div className="editor-header-right" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: "var(--jade)", // Green upgrade-like button
              color: "#fff",
              border: "none",
              padding: "6px 16px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: isSaving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {isSaving ? <Loader2 size={14} className="spin" /> : "Save Document"}
          </button>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              background: "var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--mist)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {user?.name || "Me"}
          </div>
          <button 
            onClick={() => showToast("Document versions are autosaved dynamically.", "info")}
            style={{ background: "transparent", border: "none", color: "var(--mist)", cursor: "pointer" }}
            title="Version History"
          >
            <Clock size={18} />
          </button>
          <button 
            onClick={() => setIsStarred(!isStarred)}
            style={{ background: "transparent", border: "none", color: isStarred ? "#F5A623" : "var(--mist)", cursor: "pointer" }}
            title="Star Document"
          >
            <Star size={18} fill={isStarred ? "#F5A623" : "none"} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            style={{ background: "transparent", border: "none", color: "var(--mist)", cursor: "pointer" }}
            title="Document Settings"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* Editor Area */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <ReactQuill
          theme="snow"
          value={notes}
          onChange={setNotes}
          modules={modules}
          placeholder="Start typing your notes here..."
          style={{ height: "100%", display: "flex", flexDirection: "column", color: "var(--ink)" }}
          className="custom-quill-editor"
        />
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        /* Custom overrides for ReactQuill to match the theme */
        .custom-quill-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid var(--border-light) !important;
          background: var(--deep) !important;
          padding: 12px 24px !important;
        }

        .custom-quill-editor .ql-toolbar .ql-stroke {
          stroke: var(--mist) !important;
        }

        .custom-quill-editor .ql-toolbar .ql-fill {
          fill: var(--mist) !important;
        }

        .custom-quill-editor .ql-toolbar .ql-picker {
          color: var(--mist) !important;
        }
        
        /* Dropdown lists styling */
        .custom-quill-editor .ql-picker-options {
          background-color: var(--deep) !important;
          border: 1px solid var(--border-light) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        .custom-quill-editor .ql-picker-item {
          color: var(--ink) !important;
        }

        .custom-quill-editor .ql-picker-item:hover,
        .custom-quill-editor .ql-picker-item.ql-selected {
          color: var(--violet) !important;
          background-color: rgba(77, 63, 255, 0.05) !important;
        }

        .custom-quill-editor .ql-container {
          border: none !important;
          font-family: inherit !important;
          font-size: 15px !important;
          flex: 1;
          overflow-y: auto;
          background: var(--pearl) !important;
        }
        
        .custom-quill-editor .ql-editor {
          padding: 40px 60px !important;
          max-width: 900px;
          margin: 0 auto;
          line-height: 1.7;
          color: var(--ink);
        }

        .custom-quill-editor .ql-editor.ql-blank::before {
          color: var(--mist) !important;
          opacity: 0.6;
        }

        /* Mobile Responsive Overrides */
        @media (max-width: 768px) {
          .editor-header {
            padding: 12px 16px !important;
            flex-direction: column;
            gap: 16px;
            align-items: stretch !important;
          }
          .editor-header-left, .editor-header-right {
            justify-content: space-between;
            width: 100%;
          }
          .breadcrumb-container {
            flex: 1;
          }
          .title-input {
            width: 120px !important;
          }
          .settings-modal-content {
            width: 90% !important;
            padding: 20px !important;
          }
          .custom-quill-editor .ql-toolbar {
            padding: 8px 12px !important;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            justify-content: center;
          }
          .custom-quill-editor .ql-editor {
            padding: 20px !important;
            font-size: 16px !important; /* Prevents iOS auto-zoom */
          }
          .save-btn {
            padding: 6px 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
