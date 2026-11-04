import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://js.stripe.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.stripe.com https://va.vercel-insights.com https://vitals.vercel-insights.com https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.facebook.com https://connect.facebook.net https://graph.facebook.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://www.facebook.com https://www.googletagmanager.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@claimsaver/shared"],
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  outputFileTracingIncludes: {
    "/14days": ["./public/downloads/**"],
    "/es/14dias": ["./public/downloads/**"],
    "/fr/14jours": ["./public/downloads/**"],
  },
  images: {
    remotePatterns: [],
  },
  async headers() {
    // Same-origin only. Do not add Access-Control-Allow-Origin: * here or on API routes.
    const adminCsp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-insights.com https://vitals.vercel-insights.com",
      "frame-src 'none'",
    ].join("; ");
    const adminHeaders = [
      ...securityHeaders.filter((h) => h.key !== "Content-Security-Policy"),
      { key: "Content-Security-Policy", value: adminCsp },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin", headers: adminHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
      { source: "/api/v1/admin/:path*", headers: adminHeaders },
      { source: "/clinic", headers: adminHeaders },
      { source: "/clinic/:path*", headers: adminHeaders },
      { source: "/enroll/:path*", headers: adminHeaders },
    ];
  },
  async redirects() {
    return [
      { source: "/what-we-do", destination: "/how-it-works", permanent: true },
      { source: "/signin", destination: "/login", permanent: true },
      { source: "/sign-in", destination: "/login", permanent: true },
      { source: "/sign-up", destination: "/signup", permanent: true },
      { source: "/need-professional-help", destination: "/when-to-call-an-attorney", permanent: true },
      { source: "/notarization", destination: "/pricing", permanent: true },
    ];
  },
};

export default nextConfig;
