"use client";

import { LegalDoc } from "@/components/legal-doc";

export default function TermsPage() {
  // TODO(counsel): update §4 before CLINIC_TIER_PUBLIC=true — clinic dashboard subscription
  return <LegalDoc i18nPrefix="legalPages.terms" sectionCount={20} />;
}
