"use client";

import { useState } from "react";
import { Analysis } from "@/types/analysis";
import ScoreRing from "@/components/ScoreRing";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available, nothing to do
    }
  };

  return (
    <button onClick={copy} className="text-xs text-indigo-300 hover:text-indigo-200 shrink-0">
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function verdict(score: number) {
  if (score >= 75) return { label: "Strong match", style: "bg-emerald-500/15 text-emerald-300" };
  if (score >= 50) return { label: "Moderate match", style: "bg-amber-500/15 text-amber-300" };
  return { label: "Weak match", style: "bg-red-500/15 text-red-300" };
}

const card = "rounded-xl border border-slate-700 bg-slate-900/60 backdrop-blur-sm";

export default function Results({ analysis, onReset }: { analysis: Analysis; onReset: () => void }) {
  const v = verdict(analysis.matchScore);

  return (
    <div className="space-y-6">
      {/* Score + summary */}
      <section className={`flex flex-col sm:flex-row items-center gap-6 p-6 ${card}`}>
        <ScoreRing score={analysis.matchScore} />
        <div>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${v.style}`}>{v.label}</span>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{analysis.summary}</p>
        </div>
      </section>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <section className={`p-6 ${card}`}>
          <h2 className="font-semibold mb-3">What already fits</h2>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Keywords */}
      <section className={`p-6 ${card}`}>
        <h2 className="font-semibold mb-4">Keywords</h2>

        <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
          In your resume ({analysis.matchedKeywords.length})
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {analysis.matchedKeywords.length === 0 && <span className="text-sm text-slate-500">None found.</span>}
          {analysis.matchedKeywords.map((k, i) => (
            <span key={i} className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
              {k}
            </span>
          ))}
        </div>

        <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
          Missing from your resume ({analysis.missingKeywords.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {analysis.missingKeywords.length === 0 && <span className="text-sm text-slate-500">Nothing missing.</span>}
          {analysis.missingKeywords.map((k, i) => (
            <span key={i} className="rounded-full bg-rose-500/15 px-3 py-1 text-xs text-rose-300">
              {k}
            </span>
          ))}
        </div>
      </section>

      {/* Improvements */}
      {analysis.improvements.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Suggested improvements</h2>
          <div className="space-y-3">
            {analysis.improvements.map((imp, i) => (
              <article key={i} className={`p-5 ${card}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{imp.section}</span>
                  <CopyButton text={imp.suggestion} />
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  <span className="font-medium text-slate-300">Issue: </span>
                  {imp.issue}
                </p>
                <p className="mt-2 text-sm text-slate-200">
                  <span className="font-medium text-indigo-300">Try: </span>
                  {imp.suggestion}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-slate-500">
        AI suggestions can be wrong. Only add skills or experience to your resume that are true.
      </p>

      <button
        onClick={onReset}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-slate-500"
      >
        Edit and analyze again
      </button>
    </div>
  );
}