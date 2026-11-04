"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { DAYS_PATH, getDaysCopy, type DaysLocale } from "@/content/14days";

const LANG_TOGGLE: { locale: DaysLocale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "es", label: "ES" },
  { locale: "fr", label: "FR" },
];
import { CampaignCookieNotice, CampaignPixels } from "./campaign-pixels";
import { LeadForm } from "./lead-form";
import { ThanksOverlay } from "./thanks-overlay";
import { UtmCapture } from "./utm-capture";

export function FourteenDaysLanding({ locale }: { locale: DaysLocale }) {
  const copy = getDaysCopy(locale);
  const clinicHref = "/clinic-demo";

  return (
    <div lang={copy.htmlLang} className="-mx-0 bg-slate-950 text-white">
      <UtmCapture landingPath={copy.path} />
      <CampaignPixels event="PageView" />

      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden bg-slate-950 px-4 py-16 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_55%)]" aria-hidden />
        <div className="relative mx-auto w-full max-w-5xl">
          <div className="mb-10 flex items-center justify-between gap-4">
            <BrandLogo variant="footer" className="opacity-90" />
            <nav aria-label={copy.langToggleLabel} className="text-sm font-semibold tracking-wide text-teal-100">
              {LANG_TOGGLE.map((item, index) => (
                <span key={item.locale}>
                  {index > 0 ? (
                    <span aria-hidden className="px-2 text-teal-700">
                      |
                    </span>
                  ) : null}
                  {locale === item.locale ? (
                    <span aria-current="page">{item.label}</span>
                  ) : (
                    <Link href={DAYS_PATH[item.locale]} className="underline-offset-4 hover:underline">
                      {item.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-teal-300">{copy.heroKicker}</p>
          <h1 className="font-display text-[clamp(4.25rem,22vw,9.5rem)] font-extrabold leading-[0.85] tracking-[-0.06em] text-teal-400">
            {copy.heroTitle}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">{copy.heroSubline}</p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-xl bg-teal-400 px-8 text-base font-semibold text-slate-950 hover:bg-teal-300"
            >
              <a
                href={`#${copy.formId}`}
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById(copy.formId)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {copy.heroCta}
              </a>
            </Button>
            <p className="mt-4 text-sm text-slate-400">{copy.heroTrust}</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{copy.cardsHeading}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {copy.cards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-teal-900/60 bg-slate-950/60 p-5">
                <h3 className="text-lg font-semibold text-teal-300">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id={copy.formId} className="scroll-mt-24 bg-slate-100 px-4 py-16 text-slate-900 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-start">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">{copy.formHeading}</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">{copy.formIntro}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <LeadForm copy={copy} locale={locale} />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 text-slate-900 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold">{copy.clinicsHeading}</h2>
          <Button asChild className="mt-6 h-12 rounded-xl bg-teal-800 px-6 font-semibold hover:bg-teal-700">
            <a
              href={clinicHref}
              onClick={() => {
                const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
                gtag?.("event", "clinic_demo", { event_category: "clinic" });
              }}
            >
              {copy.clinicsCta}
            </a>
          </Button>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-400">
          <p>{copy.disclaimer}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/terms-of-service" className="underline underline-offset-2 hover:text-teal-200">
              {copy.terms}
            </Link>
            <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-teal-200">
              {copy.privacy}
            </Link>
          </p>
        </div>
      </section>

      <CampaignCookieNotice
        title={copy.cookieTitle}
        body={copy.cookieBody}
        accept={copy.cookieAccept}
        decline={copy.cookieDecline}
      />
    </div>
  );
}

export function FourteenDaysThanks({ locale }: { locale: DaysLocale }) {
  const copy = getDaysCopy(locale);

  return (
    <div lang={copy.htmlLang} className="min-h-[50vh] bg-slate-950">
      <ThanksOverlay copy={copy} pdfPath={copy.pdfPath} fireLeadPixel autoOpenPdf />
      <CampaignCookieNotice
        title={copy.cookieTitle}
        body={copy.cookieBody}
        accept={copy.cookieAccept}
        decline={copy.cookieDecline}
      />
    </div>
  );
}
