export type Improvement = {
  section: string;     // e.g. "Experience", "Skills", "Summary"
  issue: string;       // what is weak or missing
  suggestion: string;  // what to change
};

export type Analysis = {
  matchScore: number;           // 0 to 100
  summary: string;              // 2-3 sentence overall verdict
  strengths: string[];          // what already matches the job
  matchedKeywords: string[];    // keywords found in both
  missingKeywords: string[];    // in the job description, not in the resume
  improvements: Improvement[];  // concrete edits to make
};  