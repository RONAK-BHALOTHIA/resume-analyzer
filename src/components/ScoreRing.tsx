"use client";

import { useEffect, useState } from "react";

export default function ScoreRing({ score }: { score: number }) {
  const [shown, setShown] = useState(0);

  // Start at 0, then move to the real score so the ring animates
  useEffect(() => {
    const t = setTimeout(() => setShown(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (shown / 100) * circumference;
  const color = score >= 75 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xs text-slate-400">out of 100</span>
      </div>
    </div>
  );
}