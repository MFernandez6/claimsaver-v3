"use client";

/**
 * Hero wordmark only — premium editorial treatment (placement unchanged).
 * No icon, no tagline; distinct from the compact navbar brand.
 */
export function HeroLogoLockup() {
  return (
    <div className="relative mb-12 flex justify-center sm:mb-16">
      {/* Soft luminance — luxury keynote / annual-report feel, not a card */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(280px,50vw)] w-[min(900px,100vw)] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div className="h-full w-full bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(45,212,191,0.14),transparent_65%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(20,184,166,0.12),transparent_65%)]" />
      </div>

      <div className="relative px-2 text-center">
        <p className="sr-only">ClaimSaver+</p>

        <div
          aria-hidden
          className="flex flex-nowrap items-end justify-center gap-0 font-display"
        >
          {/* Single wordmark + accent — unified like top-tier consumer fintech */}
          <span className="select-none bg-gradient-to-b from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-[clamp(2.65rem,7.5vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-transparent dark:from-white dark:via-slate-100 dark:to-slate-400">
            ClaimSaver
          </span>
          <span className="select-none bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-800 bg-clip-text pb-0.5 pl-[0.06em] text-[clamp(2.2rem,6.25vw,4.75rem)] font-extralight leading-none tracking-[-0.08em] text-transparent sm:pb-1">
            +
          </span>
        </div>

        {/* Single architectural rule — not an icon, not a badge */}
        <div
          className="mx-auto mt-7 h-[2px] w-[min(12rem,55vw)] max-w-none rounded-full bg-gradient-to-r from-transparent via-teal-500/85 to-transparent opacity-90 shadow-[0_0_24px_rgba(20,184,166,0.35)] sm:mt-9 sm:w-56 md:w-64"
          aria-hidden
        />
      </div>
    </div>
  );
}
