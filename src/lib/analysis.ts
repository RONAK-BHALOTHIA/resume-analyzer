import { Analysis, Improvement } from "@/types/analysis";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const strList = (v: unknown, maxItems: number, maxLen: number) =>
  Array.isArray(v) ? v.map((x) => str(x, maxLen)).filter(Boolean).slice(0, maxItems) : [];

export function sanitizeAnalysis(raw: unknown): Analysis | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const score = Number(r.matchScore);
  if (!Number.isFinite(score)) return null;
    
  const summary = str(r.summary, 800);
  if (!summary) return null;

  const improvements: Improvement[] = Array.isArray(r.improvements)
    ? r.improvements
        .map((item) => {
          const i = (item ?? {}) as Record<string, unknown>;
          return {
            section: str(i.section, 60) || "General",
            issue: str(i.issue, 400),
            suggestion: str(i.suggestion, 600),
          };
        })
        .filter((i) => i.issue && i.suggestion)
        .slice(0, 10)
    : [];

  return {
    matchScore: Math.max(0, Math.min(100, Math.round(score))),
    summary,
    strengths: strList(r.strengths, 8, 300),
    matchedKeywords: strList(r.matchedKeywords, 30, 60),
    missingKeywords: strList(r.missingKeywords, 30, 60),
    improvements,
  };
}