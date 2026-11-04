import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { jsonErr } from "@/lib/supabase/auth";

export const IMPERSONATION_MS = 30 * 60 * 1000;
export const IMPERSONATION_COOKIE = "cs_impersonate";

export function impersonationCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.ceil(IMPERSONATION_MS / 1000),
  };
}

export function impersonationIdFromRequest(req: NextRequest): string | null {
  const value = req.cookies.get(IMPERSONATION_COOKIE)?.value?.trim() || "";
  return value || null;
}

export async function activeImpersonation(req: NextRequest) {
  const id = impersonationIdFromRequest(req);
  if (!id) return null;
  const { data, error } = await getSupabaseAdmin()
    .from("impersonation_sessions")
    .select("id, staff_id, user_id, status, expires_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  if (data.status !== "active") return null;
  const expires = data.expires_at ? Date.parse(String(data.expires_at)) : 0;
  if (!expires || Date.now() > expires) return null;
  return data;
}

export async function rejectIfImpersonating(req: NextRequest) {
  const session = await activeImpersonation(req);
  if (!session) return null;
  return jsonErr(
    "This support session is read-only. Claim worksheets stay with the claimant.",
    403,
  );
}

export function clearImpersonationCookie(response: NextResponse) {
  response.cookies.set(IMPERSONATION_COOKIE, "", {
    ...impersonationCookieOptions(),
    maxAge: 0,
  });
  return response;
}
