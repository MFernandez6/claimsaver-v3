import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@claimsaver/shared"],
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: "/what-we-do", destination: "/how-it-works", permanent: true },
      { source: "/license-credentials", destination: "/who-we-are", permanent: true },
    ];
  },
};

export default nextConfig;
