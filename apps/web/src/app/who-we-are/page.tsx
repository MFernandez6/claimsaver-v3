"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CHECKOUT_PATH, FOUNDER } from "@claimsaver/shared";
import { PageHeroBackdrop } from "@/components/page-hero-backdrop";
import { Button } from "@/components/ui/button";

export default function WhoWeArePage() {
  const { t } = useTranslation();

  const credentials = [
    t("whoWeAre.founderBackground.credential1"),
    t("whoWeAre.founderBackground.credential2"),
    t("whoWeAre.founderBackground.credential3"),
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden pt-28 pb-20">
        <PageHeroBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {t("whoWeAre.hero.title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {t("whoWeAre.hero.description")}
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
            <Image
              src="/images/family.jpg"
              alt={t("whoWeAre.about.imageAlt")}
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-white">
            {t("whoWeAre.familyStory.title")}
          </h2>
          <p className="mt-2 text-sm font-medium text-teal-800 dark:text-teal-300">
            {t("whoWeAre.familyStory.subtitle")}
          </p>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            {t("whoWeAre.familyStory.body")}
          </p>
          <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
            {t("whoWeAre.about.paragraph3")}
          </p>

          <div className="mt-14 rounded-2xl border border-teal-200/80 bg-gradient-to-br from-slate-50 to-teal-50/40 p-6 shadow-sm dark:border-teal-900/50 dark:from-slate-900 dark:to-teal-950/30 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              {t("whoWeAre.founderBackground.subtitle")}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              {t("whoWeAre.founderBackground.title")}
            </h2>

            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="mx-auto shrink-0 sm:mx-0">
                <div className="overflow-hidden rounded-full border-4 border-teal-600/30 shadow-md">
                  <Image
                    src="/images/founder1.jpg"
                    alt={t("whoWeAre.founderBackground.imageAlt")}
                    width={160}
                    height={160}
                    className="h-40 w-40 object-cover object-top"
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("whoWeAre.founderBackground.name")}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("whoWeAre.founderBackground.role")}
                </p>

                <ul className="mt-4 space-y-2">
                  {credentials.map((credential) => (
                    <li
                      key={credential}
                      className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white"
                        aria-hidden
                      >
                        ✓
                      </span>
                      <span>{credential}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                  {t("whoWeAre.founderBackground.body")}
                </p>

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  {t("whoWeAre.founderBackground.disclaimer")}
                </p>

                <p className="mt-3 text-sm">
                  <a
                    href={FOUNDER.dfsLookupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-teal-800 underline dark:text-teal-300"
                  >
                    {t("whoWeAre.founderBackground.verifyLink")}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm">
            <Link href="/when-to-call-an-attorney" className="text-teal-800 underline dark:text-teal-300">
              {t("navigation.needProfessionalHelp")}
            </Link>
          </p>
          <p className="mt-6 text-sm text-slate-500">{t("whoWeAre.headquartersNote")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
              <Link href={CHECKOUT_PATH}>{t("whoWeAre.cta.startClaim")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/how-it-works">{t("whoWeAre.cta.learnMore")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
