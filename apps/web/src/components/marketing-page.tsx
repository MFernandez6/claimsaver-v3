import type { ReactNode } from "react";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { cn } from "@/lib/utils";

export function MarketingPage({
  kicker,
  title,
  subtitle,
  intro,
  note,
  actions,
  children,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  intro?: ReactNode;
  note?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          {kicker ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
              {kicker}
            </p>
          ) : null}
          <h1
            className={cn(
              "text-3xl font-bold leading-tight text-slate-900 sm:text-4xl dark:text-white",
              kicker ? "mt-3" : null,
            )}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 text-xl text-teal-800 dark:text-teal-300">{subtitle}</p>
          ) : null}
          {intro ? (
            <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {intro}
            </div>
          ) : null}
          {note ? <p className="mt-3 text-sm text-slate-500">{note}</p> : null}
          {actions ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>
          ) : null}
        </div>
      </section>
      {children}
    </div>
  );
}

export function MarketingSection({
  children,
  last,
  className,
}: {
  children: ReactNode;
  last?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-3xl px-4", last ? "pb-20" : "pb-12", className)}>
      {children}
    </section>
  );
}

export function MarketingHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{children}</h2>
  );
}
