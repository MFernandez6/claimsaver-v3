"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  CLAIMS_PREPARED_COUNT,
  DATED_THIRD_PARTY,
  FILER_QUOTES,
  FOUNDER_LINKEDIN_HREF,
  FOUNDER_PHOTO_SRC,
} from "@/lib/proof/public-proof";

const TERMS_REFUND_HREF = "/terms-of-service#section-5";

export function TrustCtaNote({
  className,
  align = "left",
}: {
  className?: string;
  align?: "left" | "center";
}) {
  const { t } = useTranslation();

  return (
    <p
      className={cn(
        "text-sm leading-relaxed text-slate-500 dark:text-slate-400",
        align === "center" && "text-center",
        className,
      )}
    >
      {t("cta.refundLine")} {t("cta.stripeLine")}{" "}
      <Link href={TERMS_REFUND_HREF} className="font-medium text-teal-800 underline underline-offset-2 dark:text-teal-300">
        {t("cta.refundTermsLink")}
      </Link>
    </p>
  );
}

export function FounderTrustCard({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const { t } = useTranslation();
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex gap-4 rounded-2xl border p-5",
        dark
          ? "border-white/15 bg-white/10"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/70",
      )}
    >
      {FOUNDER_PHOTO_SRC ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={FOUNDER_PHOTO_SRC}
          alt={t("whoWeAre.founderBackground.imageAlt")}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold",
            dark ? "bg-teal-400/20 text-teal-100" : "bg-teal-100 text-teal-900 dark:bg-teal-900/40 dark:text-teal-100",
          )}
        >
          {t("whoWeAre.founderBackground.initials")}
        </div>
      )}
      <div>
        <p className={cn("font-semibold", dark ? "text-white" : "text-slate-900 dark:text-white")}>
          {t("whoWeAre.founderBackground.name")}
        </p>
        <p className={cn("mt-1 text-sm font-medium", dark ? "text-slate-300" : "text-slate-500")}>
          {t("whoWeAre.founderBackground.role")}
        </p>
        <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-slate-300" : "text-slate-600 dark:text-slate-300")}>
          {t("pitch.founderByline")}
        </p>
        <p className={cn("mt-2 text-sm", dark ? "text-slate-400" : "text-slate-500")}>
          <Link
            href="/who-we-are"
            className={cn("underline underline-offset-2", dark ? "text-teal-200" : "text-teal-800 dark:text-teal-300")}
          >
            {t("navigation.whoWeAre")}
          </Link>
          {" · "}
          <a
            href={FOUNDER_LINKEDIN_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("underline underline-offset-2", dark ? "text-teal-200" : "text-teal-800 dark:text-teal-300")}
          >
            {t("whoWeAre.founderBackground.linkedin")}
          </a>
        </p>
      </div>
    </div>
  );
}

export function NamedProofSection() {
  const { t } = useTranslation();
  if (FILER_QUOTES.length === 0 && CLAIMS_PREPARED_COUNT == null) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            {t("home.proofQuotes.title")}
          </h2>
          {CLAIMS_PREPARED_COUNT != null ? (
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t("home.proofQuotes.counter", { count: CLAIMS_PREPARED_COUNT })}
            </p>
          ) : null}
        </div>
        {FILER_QUOTES.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FILER_QUOTES.map((quote) => (
              <li
                key={`${quote.firstName}-${quote.initials}`}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-900 dark:bg-teal-900/40 dark:text-teal-100">
                    {quote.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{quote.firstName}</p>
                    <p className="text-xs text-slate-500">{quote.context}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">“{quote.quote}”</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export function ThirdPartyStrip() {
  if (DATED_THIRD_PARTY.length === 0) return null;

  return (
    <section className="border-t border-slate-200/70 py-10 dark:border-slate-800/60">
      <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 text-sm text-slate-500">
        {DATED_THIRD_PARTY.map((item) => (
          <li key={`${item.label}-${item.date}`}>
            {item.href ? (
              <a href={item.href} className="underline underline-offset-2">
                {item.label} ({item.date})
              </a>
            ) : (
              <span>
                {item.label} ({item.date})
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
