"use client";

import { useRef, useState, DragEvent } from "react";
import { MAX_FILE_BYTES, MAX_JD_CHARS, MIN_JD_CHARS, formatMB } from "@/lib/limits";

type Props = {
  onSubmit: (file: File, jobDescription: string) => void;
};

function validateFile(file: File): string | null {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "Only PDF files are supported. Export your resume as a PDF and try again.";
  if (file.size === 0) return "This file is empty.";
  if (file.size > MAX_FILE_BYTES) {
    return `This file is ${formatMB(file.size)}. The limit is ${formatMB(MAX_FILE_BYTES)}.`;
  }
  return null;
}

export default function UploadForm({ onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [jdError, setJdError] = useState<string | null>(null);

  const pick = (f: File | undefined) => {
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      setFile(null);
      setFileError(err);
      return;
    }
    setFile(f);
    setFileError(null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = ""; // lets you pick the same file again
  };

  const submit = () => {
    let ok = true;
    const text = jd.trim();

    if (!file) {
      setFileError("Choose your resume as a PDF.");
      ok = false;
    }
    if (text.length < MIN_JD_CHARS) {
      setJdError(`Paste the full job description (at least ${MIN_JD_CHARS} characters).`);
      ok = false;
    } else if (text.length > MAX_JD_CHARS) {
      setJdError(`The job description is too long. The limit is ${MAX_JD_CHARS} characters.`);
      ok = false;
    }

    if (ok && file) onSubmit(file, text);
  };

  return (
    <div className="space-y-8">
      {/* Resume upload */}
      <div>
        <h2 className="text-sm font-semibold mb-2">1. Your resume</h2>

        {!file ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
              dragging
                ? "border-indigo-400 bg-indigo-500/10"
                : "border-slate-700 bg-slate-900/60 backdrop-blur-sm/50 hover:border-slate-500"
            }`}
          >
            <p className="text-sm font-medium">Drag your resume here, or click to choose a file</p>
            <p className="text-xs text-slate-500 mt-1">PDF only, up to {formatMB(MAX_FILE_BYTES)}</p>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 backdrop-blur-sm/60 backdrop-blur-sm/60 backdrop-blur-sm/60 backdrop-blur-sm px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-slate-500">{formatMB(file.size)}</p>
            </div>
            <button onClick={removeFile} className="text-xs text-red-400 hover:text-red-300 ml-4 shrink-0">
              Remove
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        {fileError && <p className="text-xs text-red-400 mt-2">{fileError}</p>}
      </div>

      {/* Job description */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <h2 className="text-sm font-semibold">2. The job description</h2>
          <span className={`text-xs ${jd.length > MAX_JD_CHARS ? "text-red-400" : "text-slate-500"}`}>
            {jd.length} / {MAX_JD_CHARS}
          </span>
        </div>
        <textarea
          rows={10}
          value={jd}
          onChange={(e) => {
            setJd(e.target.value);
            setJdError(null);
          }}
          placeholder="Paste the full job posting here: responsibilities, requirements, and skills."
          className="w-full rounded-xl bg-slate-900/60 backdrop-blur-sm/60 backdrop-blur-sm/60 backdrop-blur-sm/60 backdrop-blur-sm border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        {jdError && <p className="text-xs text-red-400 mt-2">{jdError}</p>}
      </div>

      <div>
        <button
          onClick={submit}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-medium hover:bg-indigo-500"
        >
          Analyze my resume
        </button>
        <p className="text-xs text-slate-500 mt-3 text-center">
          Your resume is sent for analysis and is not stored.
        </p>
      </div>
    </div>
  );
}