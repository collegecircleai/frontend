"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Cloud,
  ArrowUp,
  Download,
  Sparkles,
  FileDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, convertInchesToTwip } from "docx";

type UploadState = "idle" | "uploading" | "processing" | "done" | "error";

interface ProcessingStep {
  icon: string;
  label: string;
  done: boolean;
  active: boolean;
}

const INITIAL_STEPS: ProcessingStep[] = [
  { icon: "📄", label: "Reading assignment...", done: false, active: false },
  {
    icon: "🧠",
    label: "Analyzing problem...",
    done: false,
    active: false,
  },
  {
    icon: "✍️",
    label: "Generating solution...",
    done: false,
    active: false,
  },
  { icon: "✅", label: "Done!", done: false, active: false },
];

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
];
const ACCEPTED_EXT = [".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const RAW_MATH_MARKERS =
  /\\(?:frac|text|binom|sum|lim|leq|geq|neq|cdot|times|left|right|begin|end|sqrt|int|prod|infty|quad|alpha|beta|gamma|delta|theta|lambda|mu|pi|sigma|phi|omega)|\\\\|\^|_|&/;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function normalizeMathMarkdown(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();

      if (
        !trimmed ||
        trimmed.startsWith("```") ||
        trimmed.startsWith("#") ||
        trimmed.startsWith(">") ||
        /^[-*+]\s/.test(trimmed) ||
        /^\|/.test(trimmed) ||
        /\$\$/.test(trimmed) ||
        /\$[^$]+\$/.test(trimmed)
      ) {
        return line;
      }

      const looksLikeEquation =
        RAW_MATH_MARKERS.test(trimmed) ||
        /^\w+\s*=/.test(trimmed) ||
        /^P\(.+\)\s*=/.test(trimmed) ||
        /^F\(.+\)\s*=/.test(trimmed);

      return looksLikeEquation ? `$$${trimmed}$$` : line;
    })
    .join("\n");
}

export default function AssignmentSolverPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const solutionContentRef = useRef<HTMLDivElement>(null);
  const solutionScrollRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [languageDesc, setLanguageDesc] = useState("formal and detailed");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [steps, setSteps] = useState<ProcessingStep[]>(INITIAL_STEPS);
  const [solution, setSolution] = useState("");
  const [error, setError] = useState("");
  const [streamStatus, setStreamStatus] = useState("");
  const isUploadingRef = useRef(false);
  const hasHandledResultRef = useRef(false);
  const renderedSolution = normalizeMathMarkdown(solution);

  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (solutionScrollRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (solutionScrollRef.current) {
          solutionScrollRef.current.scrollTop =
            solutionScrollRef.current.scrollHeight;
        }
      });
    }
  }, [solution]);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(`Invalid file type. Accepted: ${ACCEPTED_EXT.join(", ")}`);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`File too large. Max: ${formatBytes(MAX_SIZE_BYTES)}`);
      return;
    }

    setSelectedFile(file);
    setError("");
    setUploadState("idle");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploadingRef.current) return;
    isUploadingRef.current = true;
    hasHandledResultRef.current = false;
    setUploadState("uploading");
    setSolution("");
    setError("");
    setStreamStatus("Preparing upload...");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("languageDesc", languageDesc);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assignment/solve`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Upload failed. Please try again.",
        );
      }

      setUploadState("processing");
      setStreamStatus("Solution stream connected. Generating solution...");

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
      let solutionContent = "";
      let currentStepIndex = 0;

      const processEventBlock = (eventBlock: string) => {
        try {
          const lines = eventBlock
            .split("\n")
            .map((line) => line.trimEnd())
            .filter(Boolean);

          let eventName = "message";
          const dataLines: string[] = [];

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice(5).trimStart());
            }
          }

          const rawPayload = dataLines.join("\n");
          if (!rawPayload) {
            return;
          }

          const parsedPayload = JSON.parse(rawPayload) as unknown;

          if (eventName === "status") {
            return;
          }

          if (eventName !== "data") {
            return;
          }

          let chunkText = rawPayload;

          try {
            const parsed = JSON.parse(rawPayload);
            if (typeof parsed === "string") {
              chunkText = parsed;
            } else if (
              parsed &&
              typeof parsed === "object" &&
              "text" in parsed &&
              typeof (parsed as { text?: unknown }).text === "string"
            ) {
              chunkText = (parsed as { text: string }).text;
            }
          } catch {
            // Fallback to the raw payload if it is not valid JSON.
          }

          solutionContent += chunkText;
          setSolution(solutionContent);

          const progress = Math.floor((solutionContent.length / 1000) * 3);
          if (progress > currentStepIndex && progress <= 3) {
            currentStepIndex = progress;
            const newSteps = INITIAL_STEPS.map((s, i) => ({
              ...s,
              active: i === currentStepIndex,
              done: i < currentStepIndex,
            }));
            setSteps(newSteps);
          }
        } catch (err) {
          console.error("Error processing chunk:", err);
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const eventBlocks = buffer.split("\n\n");

        for (let i = 0; i < eventBlocks.length - 1; i++) {
          processEventBlock(eventBlocks[i]);
        }

        buffer = eventBlocks[eventBlocks.length - 1];
      }

      if (buffer) {
        processEventBlock(buffer);
      }

      const finalSteps = INITIAL_STEPS.map((s, i) => ({
        ...s,
        active: false,
        done: i <= currentStepIndex,
      }));
      setSteps(finalSteps);
      setUploadState("done");
      setStreamStatus("Solution generated successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      setUploadState("error");
      setStreamStatus("");
    } finally {
      isUploadingRef.current = false;
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSolution("");
    setError("");
    setUploadState("idle");
    setStreamStatus("");
    setSteps(INITIAL_STEPS);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSolutionTitle = () =>
    selectedFile?.name.replace(/\.[^.]+$/, "") || "assignment-solution";

  const handleDownloadPdf = async () => {
    try {
      const element = solutionScrollRef.current;
      if (!element) {
        setError("Unable to generate PDF. Content not found.");
        return;
      }

      const htmlContent = document.createElement("div");
      htmlContent.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #111827;">
          <h1 style="font-size: 28px; margin-bottom: 10px;">${getSolutionTitle()}</h1>
          <p style="color: #6b7280; font-size: 12px; margin-bottom: 20px;">Generated from CC&gt;AI Assignment Solver</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          ${element.innerHTML}
        </div>
      `;

      const options: any = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `${getSolutionTitle()}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      };

      const { default: html2pdf } = await import("html2pdf.js");
      html2pdf().set(options).from(htmlContent).save();
    } catch (err) {
      setError("Failed to download PDF. Please try again.");
      console.error(err);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      const element = solutionScrollRef.current;
      if (!element) {
        setError("Unable to generate document. Content not found.");
        return;
      }

      // Extract text from HTML content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = element.innerHTML;
      
      // Convert HTML to readable text while preserving structure
      const text = tempDiv.innerText;
      const title = getSolutionTitle();

      // Create document
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: title,
                heading: "Heading1",
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: "Generated from CC>AI Assignment Solver",
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: text,
                spacing: { line: 240, after: 100 },
              }),
            ],
          },
        ],
      });

      // Save document
      Packer.toBlob(doc).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
    } catch (err) {
      setError("Failed to download document. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 lg:p-[56px]" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <AnimatePresence mode="wait">
        {uploadState === "idle" || uploadState === "uploading" ? (
          <motion.div
            key="upload-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ textAlign: "center", marginBottom: "72px" }}
            >
              <div
                className="label"
                style={{
                  color: "var(--violet)",
                  marginBottom: "16px",
                  letterSpacing: "0.3em",
                }}
              >
                ASSIGNMENT ASSISTANT
              </div>
              <h1
                className="serif"
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  marginBottom: "24px",
                }}
              >
                Solve Your Assignment
              </h1>
              <p
                className="serif"
                style={{
                  color: "var(--mist)",
                  fontSize: "16px",
                  fontStyle: "italic",
                  maxWidth: "640px",
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                Upload your assignment and let our AI provide detailed solutions
                with step-by-step explanations.
              </p>
            </motion.div>

            {/* Upload Area */}
            <div className="flex flex-col lg:grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
              {/* Left: Upload Zone */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{
                    translate: "-4px -4px",
                    boxShadow: "12px 12px 0px #4D3FFF",
                  }}
                  className="studojo-card"
                  style={{
                    padding: "64px",
                    textAlign: "center",
                    borderColor: "#4D3FFF",
                    boxShadow: "8px 8px 0px #4D3FFF",
                    borderStyle: "dashed",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "84px",
                      height: "84px",
                      background: "var(--violet)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 32px",
                      boxShadow: "0 8px 24px rgba(77, 63, 255, 0.2)",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Cloud size={44} color="white" fill="white" />
                      <div
                        style={{
                          position: "absolute",
                          top: "55%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "var(--violet)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowUp size={20} strokeWidth={4} />
                      </div>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 600,
                      marginBottom: "12px",
                    }}
                  >
                    Upload your assignment
                  </h3>
                  <p
                    style={{
                      color: "var(--mist)",
                      fontSize: "14px",
                      marginBottom: "24px",
                    }}
                  >
                    PDF, DOCX, TXT, PNG, or JPG (Max{" "}
                    {formatBytes(MAX_SIZE_BYTES)})
                  </p>

                  {selectedFile && (
                    <div
                      style={{
                        background: "rgba(77, 63, 255, 0.05)",
                        border: "1px solid rgba(77, 63, 255, 0.2)",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        marginBottom: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <FileText size={16} color="var(--violet)" />
                        <span style={{ fontSize: "14px" }}>
                          {selectedFile.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--mist)",
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_EXT.join(",")}
                    onChange={(e) =>
                      handleFileSelect(e.target.files?.[0] || null)
                    }
                    style={{ display: "none" }}
                  />

                  <motion.button
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleUpload();
                    }}
                    disabled={!selectedFile || uploadState === "uploading"}
                    style={{
                      padding: "16px 48px",
                      fontSize: "15px",
                      borderRadius: "12px",
                      background: selectedFile ? "#4D3FFF" : "#ccc",
                      opacity: uploadState === "uploading" ? 0.7 : 1,
                    }}
                  >
                    {uploadState === "uploading"
                      ? "Uploading..."
                      : "Solve Assignment"}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right: Language Settings & Instructions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div
                    className="card"
                    style={{
                      padding: "32px",
                      border: "1px solid var(--border)",
                      borderRadius: "24px",
                      background: "var(--pearl)",
                    }}
                  >
                    <h3
                      className="serif"
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        marginBottom: "24px",
                      }}
                    >
                      Solution Style
                    </h3>
                    <div style={{ marginBottom: "24px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 600,
                          marginBottom: "8px",
                          color: "var(--ink)",
                        }}
                      >
                        Tone & Language
                      </label>
                      <textarea
                        value={languageDesc}
                        onChange={(e) => setLanguageDesc(e.target.value)}
                        placeholder="e.g., formal and detailed, simple and concise, academic..."
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontFamily: "inherit",
                          minHeight: "80px",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div
                    className="card"
                    style={{
                      padding: "24px",
                      background: "rgba(0, 200, 150, 0.03)",
                      border: "1px solid rgba(0, 200, 150, 0.1)",
                      borderRadius: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "16px",
                      }}
                    >
                      <Sparkles size={16} color="var(--jade)" />
                      <div
                        className="label"
                        style={{
                          color: "var(--jade)",
                          background: "rgba(0, 200, 150, 0.08)",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "9px",
                        }}
                      >
                        AI INSIGHT
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--ink)",
                        lineHeight: 1.6,
                        opacity: 0.8,
                      }}
                    >
                      Our AI provides comprehensive solutions with step-by-step
                      explanations tailored to your preferred communication
                      style.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: "32px",
                  padding: "16px",
                  background: "#FEE2E2",
                  border: "1px solid #FCA5A5",
                  borderRadius: "8px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <AlertCircle
                  size={20}
                  color="#DC2626"
                  style={{ marginTop: "2px" }}
                />
                <span style={{ color: "#DC2626", fontSize: "14px" }}>
                  {error}
                </span>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="solution-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Solution Header */}
            <div style={{ marginBottom: "48px" }}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 lg:gap-0">
                <div>
                  <div
                    className="label"
                    style={{
                      color: "var(--logo-accent)",
                      marginBottom: "8px",
                    }}
                  >
                    SOLUTION GENERATED
                  </div>
                  <h1 style={{ fontSize: "28px", fontWeight: 600 }}>
                    {selectedFile?.name}
                  </h1>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button
                    onClick={handleReset}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 24px",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      background: "var(--pearl)",
                      color: "var(--ink)",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    <RefreshCw size={16} />
                    Solve Another
                  </button>
                  {uploadState === "done" && solution && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={handleDownloadPdf}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          padding: "12px 20px",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          background: "var(--pearl)",
                          color: "var(--ink)",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 600,
                          flex: 1,
                        }}
                      >
                        <Download size={16} />
                        PDF
                      </button>
                      <button
                        onClick={handleDownloadDocx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          padding: "12px 20px",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          background: "var(--pearl)",
                          color: "var(--ink)",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 600,
                          flex: 1,
                        }}
                      >
                        <FileDown size={16} />
                        DOCX
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Processing Steps */}
              {(uploadState === "processing" || uploadState === "done") && (
                <div className="flex flex-wrap lg:grid lg:grid-cols-4 gap-y-4 gap-x-6 mb-8">
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          background: step.done
                            ? "var(--jade)"
                            : step.active
                              ? "var(--violet)"
                              : "var(--cream)",
                          color:
                            step.done || step.active ? "white" : "var(--ink)",
                        }}
                      >
                        {step.done ? "✓" : step.active ? "..." : i + 1}
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--mist)" }}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solution Content - Markdown Rendered */}
            <div
              className="card p-6 lg:p-[48px]"
              style={{
                background: "var(--pearl)",
                border: "1px solid var(--border)",
                borderRadius: "24px",
                maxWidth: "900px",
                maxHeight: "calc(100vh - 300px)",
                overflowY: "auto",
                overflowX: "hidden",
              }}
              ref={solutionScrollRef}
            >
              {solution ? (
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.8",
                    color: "var(--ink)",
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          style={{
                            fontSize: "24px",
                            fontWeight: 700,
                            marginBottom: "16px",
                          }}
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          style={{
                            fontSize: "20px",
                            fontWeight: 700,
                            marginBottom: "12px",
                            marginTop: "24px",
                          }}
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            marginBottom: "10px",
                            marginTop: "16px",
                          }}
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          style={{ marginBottom: "12px", lineHeight: "1.8" }}
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          style={{
                            marginLeft: "20px",
                            marginBottom: "12px",
                            listStyleType: "disc",
                          }}
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          style={{
                            marginLeft: "20px",
                            marginBottom: "12px",
                            listStyleType: "decimal",
                          }}
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li style={{ marginBottom: "6px" }} {...props} />
                      ),
                      code: ({ node, inline, ...props }: any) =>
                        inline ? (
                          <code
                            style={{
                              background: "#F3F4F6",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontFamily: "monospace",
                              fontSize: "12px",
                            }}
                            {...props}
                          />
                        ) : (
                          <pre
                            style={{
                              background: "#1F2937",
                              color: "#E5E7EB",
                              padding: "12px",
                              borderRadius: "8px",
                              overflow: "auto",
                              marginBottom: "12px",
                            }}
                          >
                            <code {...props} />
                          </pre>
                        ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          style={{
                            borderLeft: "4px solid #4D3FFF",
                            paddingLeft: "12px",
                            marginLeft: "0",
                            marginBottom: "12px",
                            fontStyle: "italic",
                            color: "var(--mist)",
                          }}
                          {...props}
                        />
                      ),
                      hr: ({ node, ...props }) => (
                        <hr
                          style={{
                            border: "none",
                            borderTop: "1px solid var(--border)",
                            margin: "24px 0",
                          }}
                          {...props}
                        />
                      ),
                    }}
                    children={renderedSolution}
                  />
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "var(--mist)" }}>
                  <p>Generating solution...</p>
                </div>
              )}
            </div>

            {streamStatus && (
              <div
                style={{
                  marginTop: "24px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "var(--mist)",
                }}
              >
                {streamStatus}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
