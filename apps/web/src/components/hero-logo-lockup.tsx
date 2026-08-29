"use client";

import { BrandLogo } from "@/components/brand-logo";

/**
 * Hero brand lockup — official Fiverr mark, with a soft luminance behind it.
 */
export function HeroLogoLockup() {
  return (
    <div className="relative mb-12 flex justify-center sm:mb-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(280px,50vw)] w-[min(900px,100vw)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div className="h-full w-full bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(13,148,136,0.16),transparent_65%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(45,212,191,0.12),transparent_65%)]" />
      </div>

      <div className="relative px-2">
        <BrandLogo variant="hero" />
      </div>
    </div>
  );
}
