"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import Results from "@/components/Results";
import { Analysis } from "@/types/analysis";

type Status = "form" | "loading" | "done";

export default function Analyzer() {
  const [status, setStatus] = useState<Status>("form");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Analysis | null>(null);

  const analyze = async (file: File, jobDescription: string) => {
    setStatus("loading");
    setError(null);
    try {
      const body = new FormData();
      body.append("resume", file);
      body.append("jobDescription", jobDescription);

      const res = await fetch("/api/analyze", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Analysis failed. Please try again.");

      setResult(json.analysis);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
      setStatus("form");
    }
  };

  return (
    <>
      {/* Form stays mounted so nothing is lost on errors */}
      <div className={status === "form" ? "" : "hidden"}>
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <UploadForm onSubmit={analyze} />
      </div>

      {status === "loading" && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 backdrop-blur-sm p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-indigo-400" />
          <p className="mt-4 font-medium">Analyzing your resume...</p>
          <p className="text-sm text-slate-500 mt-1">This usually takes 10 to 30 seconds.</p>
        </div>
      )}

      {status === "done" && result && <Results analysis={result} onReset={() => setStatus("form")} />}
    </>
  );
}