import type { Metadata } from "next";
import { PATIENT_PRICE_USD } from "@claimsaver/shared";

export const metadata: Metadata = {
  title: "Florida PIP clinic demo",
  description: `Book a 15-minute walkthrough of Florida PIP clinic software. Patients still pay $${PATIENT_PRICE_USD} and stay the filer. Staff see checklist progress only.`,
  alternates: { canonical: "/clinic-demo" },
};

export default function ClinicDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
