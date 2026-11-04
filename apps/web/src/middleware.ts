import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";
import {
  adminSessionStateFromRequest,
  mfaPath,
  refreshAdminIdleCookie,
} from "@/lib/auth/admin-session";

  const AUTH_REQUIRED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/claim/",
  "/claim-form",
  "/account",
  "/clinic",
  "/enroll",
];

function isProtectedPath(pathname: string) {
  return AUTH_REQUIRED_PREFIXES.some((p) =>
    p.endsWith("/") ? pathname.startsWith(p) : pathname.startsWith(p),
  );
}

function hasSupabaseAuthCookies(request: NextRequest) {
  return request.cookies.getAll().some((c) => c.name.includes("-auth-token"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "POST") {
    const authLimited =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/checkout-account" ||
      pathname === "/forgot-password" ||
      pathname === "/update-password";
    const apiLimited =
      pathname === "/api/v1/checkout" ||
      pathname === "/api/v1/documents" ||
      pathname === "/api/v1/claims";
    const adminLimited = pathname.startsWith("/api/v1/admin");
    if (authLimited || apiLimited || adminLimited) {
      const limit = adminLimited ? 20 : authLimited ? 20 : 40;
      const limited = await rateLimit(`mw:${pathname}:${clientIp(request)}`, limit, 10 * 60 * 1000);
      if (!limited.ok) return rateLimitResponse(limited.retryAfter);
    }
  }

  const impersonating = Boolean(request.cookies.get("cs_impersonate")?.value);
  if (
    impersonating &&
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    !pathname.startsWith("/api/v1/admin/impersonation")
  ) {
    return NextResponse.json(
      { error: "This support session is read-only. Claim worksheets stay with the claimant." },
      { status: 403 },
    );
  }

  const needsAuth = isProtectedPath(pathname);

  if (needsAuth && !hasSupabaseAuthCookies(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  const shouldRefreshSession =
    hasSupabaseAuthCookies(request) ||
    pathname.startsWith("/auth/") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/checkout-account" ||
    pathname === "/forgot-password" ||
    pathname === "/update-password";

  if (!shouldRefreshSession) {
    return NextResponse.next();
  }

  const { user, supabaseResponse, timedOut } = await updateSession(request);

  if (needsAuth && !user) {
    if (timedOut) return supabaseResponse;
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  const onAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/mfa";
  if (user && onAdminPage) {
    const state = adminSessionStateFromRequest(request);
    if (state !== "ok") {
      const url = request.nextUrl.clone();
      const dest = mfaPath(state);
      url.pathname = dest.split("?")[0] ?? "/admin/mfa";
      url.search = dest.includes("?") ? dest.slice(dest.indexOf("?")) : "";
      const redirect = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie);
      });
      return redirect;
    }
    refreshAdminIdleCookie(supabaseResponse);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/claim-form",
    "/claim-form/:path*",
    "/account",
    "/account/:path*",
    "/clinic",
    "/clinic/:path*",
    "/enroll/:path*",
    "/claim/:path*",
    "/auth/:path*",
    "/login",
    "/signup",
    "/checkout-account",
    "/forgot-password",
    "/update-password",
    "/api/v1/checkout",
    "/api/v1/documents",
    "/api/v1/claims",
    "/api/v1/admin/:path*",
    "/api/v1/:path*",
  ],
};
