import type { Metadata } from "next";
import { PATIENT_PRICE_USD } from "@claimsaver/shared";

export const metadata: Metadata = {
  title: "Book a clinic demo",
  description: `Canvassing link: book a 15-minute ClaimSaver+ walkthrough. Patients still pay $${PATIENT_PRICE_USD} for platform access. After a signed BAA, each clinic gets its own patient enroll URL.`,
  alternates: { canonical: "/clinic-demo" },
};

export default function ClinicDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
