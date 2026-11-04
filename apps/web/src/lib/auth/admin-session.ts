import { NextResponse, type NextRequest } from "next/server";

export const ADMIN_IDLE_MS = 30 * 60 * 1000;
export const ADMIN_ABSOLUTE_MS = 12 * 60 * 60 * 1000;

export const ADMIN_IDLE_COOKIE = "cs_admin_idle";
export const ADMIN_ABS_COOKIE = "cs_admin_abs";

export type AdminSessionState = "ok" | "missing" | "idle" | "absolute";

export function adminCookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.ceil(maxAgeMs / 1000),
  };
}

export function parseCookieTime(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function adminSessionState(
  idleAt: number,
  absAt: number,
  now = Date.now(),
): AdminSessionState {
  if (!idleAt || !absAt) return "missing";
  if (now - absAt > ADMIN_ABSOLUTE_MS) return "absolute";
  if (now - idleAt > ADMIN_IDLE_MS) return "idle";
  return "ok";
}

export function adminSessionStateFromRequest(
  request: NextRequest,
  now = Date.now(),
): AdminSessionState {
  return adminSessionState(
    parseCookieTime(request.cookies.get(ADMIN_IDLE_COOKIE)?.value),
    parseCookieTime(request.cookies.get(ADMIN_ABS_COOKIE)?.value),
    now,
  );
}

export function remainingMs(startedAt: number, limitMs: number, now = Date.now()) {
  return Math.max(0, limitMs - (now - startedAt));
}

export function applyAdminSessionCookies(
  response: NextResponse,
  opts: { idleAt?: number; absAt?: number; now?: number },
) {
  const now = opts.now ?? Date.now();
  const idleAt = opts.idleAt ?? now;
  const absAt = opts.absAt ?? now;
  response.cookies.set(ADMIN_IDLE_COOKIE, String(idleAt), adminCookieOptions(ADMIN_IDLE_MS));
  response.cookies.set(ADMIN_ABS_COOKIE, String(absAt), adminCookieOptions(ADMIN_ABSOLUTE_MS));
  return response;
}

export function refreshAdminIdleCookie(response: NextResponse, now = Date.now()) {
  response.cookies.set(ADMIN_IDLE_COOKIE, String(now), adminCookieOptions(ADMIN_IDLE_MS));
  return response;
}

export function clearAdminSessionCookies(response: NextResponse) {
  const expired = { ...adminCookieOptions(0), maxAge: 0 };
  response.cookies.set(ADMIN_IDLE_COOKIE, "", expired);
  response.cookies.set(ADMIN_ABS_COOKIE, "", expired);
  return response;
}

export function mfaPath(reason?: AdminSessionState | "enroll") {
  if (!reason || reason === "ok" || reason === "missing") return "/admin/mfa";
  return `/admin/mfa?reason=${encodeURIComponent(reason)}`;
}
