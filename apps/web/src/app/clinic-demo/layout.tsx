import type { Metadata } from "next";
import { PATIENT_PRICE_USD } from "@claimsaver/shared";

export const metadata: Metadata = {
  title: "Book a clinic demo",
  description: `Book a 15-minute ClaimSaver+ walkthrough for Florida PIP clinics. Patients still pay $${PATIENT_PRICE_USD} for platform access. Staff see checklist progress only.`,
  alternates: { canonical: "/clinic-demo" },
};

export default function ClinicDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
