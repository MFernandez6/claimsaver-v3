"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LEGAL_ENTITY_DISPLAY, PRINCIPAL_ADDRESS_LINE, SUNBIZ_DOCUMENT_NUMBER } from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingPage, MarketingSection } from "@/components/marketing-page";

export default function LicenseCredentialsPage() {
  const { t } = useTranslation();

  return (
    <MarketingPage
      kicker={t("pages.licenseCredentials.kicker")}
      title={t("pages.licenseCredentials.title")}
      subtitle={t("pages.licenseCredentials.subtitle")}
      intro={<p>{t("pages.licenseCredentials.body")}</p>}
      note={t("floridaOnly.note")}
      actions={
        <>
          <Button asChild className="h-12 bg-gradient-to-r from-emerald-600 to-teal-800">
            <Link href="/who-we-are">{t("navigation.whoWeAre")}</Link>
          </Button>
          <Button variant="outline" asChild className="h-12">
            <Link href="/contact">{t("navigation.contact")}</Link>
          </Button>
        </>
      }
    >
      <MarketingSection className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
              {t("pages.licenseCredentials.kicker")}
            </p>
            <CardTitle className="text-base">{t("pages.licenseCredentials.searchHint")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-slate-600">
            <p>{t("pages.licenseCredentials.optionalPA")}</p>
            <p>{t("pages.licenseCredentials.notAdjusting")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
              {t("floridaOnly.chip")}
            </p>
            <CardTitle className="text-base">{t("pages.licenseCredentials.staffLicenseHeading")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-slate-600">
            <p>{t("pages.licenseCredentials.staffLicenseBody")}</p>
            <p>{t("pages.licenseCredentials.staffLicensePending")}</p>
            <p className="text-slate-500">{t("pages.licenseCredentials.unsupportedNote")}</p>
            <p className="text-slate-500">{t("pages.licenseCredentials.verify")}</p>
          </CardContent>
        </Card>
      </MarketingSection>

      <MarketingSection last>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{LEGAL_ENTITY_DISPLAY}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-slate-600">
            <p>{PRINCIPAL_ADDRESS_LINE}</p>
            <p>{t("pages.licenseCredentials.sunbizLine", { document: SUNBIZ_DOCUMENT_NUMBER })}</p>
          </CardContent>
        </Card>
      </MarketingSection>
    </MarketingPage>
  );
}
