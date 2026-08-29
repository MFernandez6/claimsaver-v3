"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORT_EMAIL } from "@claimsaver/shared";
import { ObfuscatedMailtoButton } from "@/components/obfuscated-support-email";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
  defaultOpenIndexes?: number[];
}

export default function FAQ({
  title,
  subtitle,
  items,
  className = "",
  defaultOpenIndexes = [],
}: FAQProps) {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<number[]>(defaultOpenIndexes);
  const heading = title ?? t("faqBox.defaultTitle");
  const sub = subtitle ?? t("faqBox.defaultSubtitle");

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className={cn("bg-white py-16 sm:py-20 dark:bg-gray-950", className)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {heading}
          </h2>
          {sub ? (
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              {sub}
            </p>
          ) : null}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700">
          {items.map((item, index) => {
            const open = openItems.includes(index);
            return (
              <div key={index} className="border-b border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                >
                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
                    {item.question}
                  </h3>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 dark:border-slate-600 dark:text-slate-300">
                    {open ? (
                      <Minus className="h-4 w-4" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4" aria-hidden />
                    )}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-11 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base font-medium text-slate-900 dark:text-white">
            {t("faqBox.morePrompt")}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
            {t("faqBox.supportBody", { supportEmail: SUPPORT_EMAIL })}
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ObfuscatedMailtoButton className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-teal-800 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:from-teal-700 hover:to-teal-900">
              {t("faqBox.emailSupport")}
            </ObfuscatedMailtoButton>
            <Link
              href="/when-to-call-an-attorney"
              className="text-sm font-medium text-teal-800 underline underline-offset-2 dark:text-teal-300"
            >
              {t("faqBox.attorneyLink")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQLoading() {
  return (
    <section className="bg-white py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </section>
  );
}
