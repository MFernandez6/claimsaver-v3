"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ObfuscatedSupportEmail } from "@/components/obfuscated-support-email";
import { MarketingPage, MarketingSection } from "@/components/marketing-page";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <MarketingPage
      kicker={t("pages.contact.kicker")}
      title={t("pages.contact.title")}
      subtitle={t("pages.contact.subtitle")}
      intro={<p>{t("pages.contact.body")}</p>}
      actions={
        <>
          <Button asChild className="h-12 bg-gradient-to-r from-emerald-600 to-teal-800">
            <Link href="/how-it-works">{t("navigation.howItWorks")}</Link>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href="/when-to-call-an-attorney">{t("navigation.needProfessionalHelp")}</Link>
          </Button>
        </>
      }
    >
      <MarketingSection className="grid gap-4 sm:grid-cols-2">
        <Card className="border-teal-200">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
              {t("pages.contact.emailLabel")}
            </p>
            <CardTitle className="text-base">
              <ObfuscatedSupportEmail className="text-teal-800" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-600">{t("pages.contact.notarizationNote")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
              {t("floridaOnly.chip")}
            </p>
            <CardTitle className="text-base leading-snug">{t("pages.contact.headquarters")}</CardTitle>
          </CardHeader>
        </Card>
      </MarketingSection>

      <MarketingSection last>
        <p className="text-sm leading-relaxed text-slate-600">
          <Link href="/when-to-call-an-attorney" className="font-semibold text-teal-800 underline underline-offset-2">
            {t("pages.contact.attorneyCta")}
          </Link>
        </p>
        <p className="mt-4">
          <Link href="/for-clinics" className="text-sm font-semibold text-teal-800 underline underline-offset-2">
            {t("navigation.forClinics")}
          </Link>
        </p>
      </MarketingSection>
    </MarketingPage>
  );
}
