/**
 * Soft teal / emerald mesh aligned with the logo (#0d9488), plus a subtle grid for depth.
 */
export function PageHeroBackdrop() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-white/98 to-emerald-50/90 dark:from-slate-950/95 dark:via-gray-900/98 dark:to-slate-900/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(13,148,136,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(45,212,191,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_100%,rgba(16,185,129,0.07),transparent_50%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_100%_100%,rgba(52,211,153,0.06),transparent_50%)]" />
      {/* Fine grid — structure without competing with content */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 85% 65% at 50% 15%, black 15%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(13, 148, 136, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(13, 148, 136, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 90% 85%, black 20%, transparent 65%)",
        }}
      />
    </div>
  );
}
