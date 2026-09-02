import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function clientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

function memoryLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (existing.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }
  existing.count += 1;
  return { ok: true };
}

/** Durable when Supabase is configured; in-memory fallback for local/dev. */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: true } | { ok: false; retryAfter: number }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await getSupabaseAdmin()
        .schema("private")
        .rpc("consume_rate_limit", {
          p_key: key,
          p_limit: limit,
          p_window_seconds: Math.max(1, Math.ceil(windowMs / 1000)),
        });
      if (!error && data && typeof data === "object") {
        const row = data as { ok?: boolean; retry_after?: number };
        if (row.ok === false) {
          return { ok: false, retryAfter: Math.max(1, Number(row.retry_after) || 1) };
        }
        if (row.ok === true) return { ok: true };
      }
    } catch {
      /* Fall through to process memory. */
    }
  }
  return memoryLimit(key, limit, windowMs);
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { error: "Too many requests. Try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
