"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import type { DaysCopy } from "@/content/14days";
import { CampaignPixels } from "./campaign-pixels";

export function ThanksOverlay({
  copy,
  pdfPath,
  fireLeadPixel = false,
}: {
  copy: DaysCopy;
  pdfPath: string;
  fireLeadPixel?: boolean;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0 });
    const opener = document.getElementById("lead-open-pdf");
    opener?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-thanks-title"
      className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-slate-950/80 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center"
    >
      {fireLeadPixel ? <CampaignPixels event="Lead" /> : null}
      <div className="w-full max-w-md rounded-2xl border border-teal-900/40 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
        <BrandLogo className="mb-4" />
        <p className="font-display text-4xl font-extrabold tracking-[-0.05em] text-teal-700">{copy.heroTitle}</p>
        <h2 id="lead-thanks-title" className="mt-4 text-2xl font-bold">
          {copy.thanksTitle}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600">{copy.thanksBody}</p>
        <Button
          asChild
          size="lg"
          className="mt-6 h-14 w-full rounded-xl bg-teal-700 px-8 text-base font-semibold text-white hover:bg-teal-600"
        >
          <a id="lead-open-pdf" href={pdfPath} target="_blank" rel="noopener noreferrer">
            {copy.thanksDownload}
          </a>
        </Button>
        <p className="mt-4">
          <Link href="/" className="text-sm text-teal-800 underline underline-offset-2">
            {copy.thanksHome}
          </Link>
        </p>
        <p className="mt-6 text-xs leading-relaxed text-slate-500">{copy.disclaimer}</p>
      </div>
    </div>
  );
}
