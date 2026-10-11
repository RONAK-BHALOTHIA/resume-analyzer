type Entry = { count: number; resetAt: number };

// Stored on globalThis so the data survives hot reloads in development
const g = globalThis as unknown as { __rateStore?: Map<string, Entry> };
const store = g.__rateStore ?? (g.__rateStore = new Map<string, Entry>());

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  // Occasionally remove expired entries so the map doesn't grow forever
  if (store.size > 5000) {
    for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
  }

  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export const minutes = (n: number) => Math.ceil(n / 60);