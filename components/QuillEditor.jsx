"use client";
import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

export default function QuillEditor({ onChange }) {
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (quill && onChange) {
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML); // ✅ properly send HTML to parent
      });
    }
  }, [quill, onChange]);

  return (
    <div className="rounded p-2">
      <div ref={quillRef} style={{ minHeight: "150px" }} />
    </div>
  );
}
