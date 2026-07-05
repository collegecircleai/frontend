"use client";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

// Register custom fonts
const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "impact",
  "tahoma",
  "times-new-roman",
  "trebuchet",
  "verdana",
];
Quill.register(Font, true);

export default function QuillEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}) {
  const modules = {
    toolbar: [
      [
        {
          font: [
            "times-new-roman",
            "arial",
            "comic-sans",
            "courier-new",
            "georgia",
            "helvetica",
            "impact",
            "tahoma",
            "trebuchet",
            "verdana",
          ],
        },
      ],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder}
      className="custom-quill-editor"
      style={{ height: "100%", display: "flex", flexDirection: "column", color: "var(--ink)", minHeight: 0 }}
    />
  );
}
