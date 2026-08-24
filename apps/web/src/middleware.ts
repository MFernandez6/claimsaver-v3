import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const AUTH_REQUIRED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/claim/",
  "/claim-form",
  "/account",
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
    if (authLimited || apiLimited) {
      const limited = rateLimit(`mw:${pathname}:${clientIp(request)}`, authLimited ? 20 : 40, 10 * 60 * 1000);
      if (!limited.ok) return rateLimitResponse(limited.retryAfter);
    }
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

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/claim-form/:path*",
    "/account/:path*",
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
  ],
};
