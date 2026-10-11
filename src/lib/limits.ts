export const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel body limit is ~4.5 MB)
export const MAX_JD_CHARS = 8000;
export const MIN_JD_CHARS = 50;

export const formatMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1) + " MB";