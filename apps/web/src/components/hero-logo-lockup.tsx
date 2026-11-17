"use client";

import Image from "next/image";

/**
 * Hero brand lockup. The mark stays the official hexagon.
 * The wordmark uses the site font so the plus can be brand teal.
 */
export function HeroLogoLockup() {
  return (
    <div className="relative mb-8 flex justify-center sm:mb-14 lg:mb-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-[min(36rem,94vw)] -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-[min(52rem,88vw)]"
        aria-hidden
      >
        <div className="h-full w-full bg-[radial-gradient(ellipse_72%_68%_at_50%_50%,rgba(16,185,129,0.45),rgba(13,148,136,0.2)_46%,transparent_74%)] dark:bg-[radial-gradient(ellipse_72%_68%_at_50%_50%,rgba(45,212,191,0.34),rgba(13,148,136,0.16)_48%,transparent_74%)]" />
      </div>

      <div className="relative flex max-w-full items-center justify-center gap-2 px-2 sm:gap-3" role="img" aria-label="ClaimSaver+">
        <Image
          src="/images/brand/claimsaver-plus-mark.png"
          alt=""
          width={128}
          height={125}
          priority
          className="h-10 w-auto shrink-0 sm:h-14 lg:h-[4.25rem]"
        />
        <p className="font-sans text-[clamp(1.7rem,6.2vw,3.25rem)] font-semibold leading-none tracking-[-0.045em] text-slate-900 dark:text-white">
          <span aria-hidden>ClaimSaver</span>
          <span aria-hidden className="text-teal-600 dark:text-teal-300">+</span>
        </p>
      </div>
    </div>
  );
}
