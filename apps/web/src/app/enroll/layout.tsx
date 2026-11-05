import type { Metadata } from "next";
import { PATIENT_PRICE_USD } from "@claimsaver/shared";

export const metadata: Metadata = {
  title: "Clinic invitation",
  description: `A Florida clinic invited you to ClaimSaver+. You stay the filer. Platform access is $${PATIENT_PRICE_USD}.`,
  robots: { index: false, follow: false },
};

export default function EnrollLayout({ children }: { children: React.ReactNode }) {
  return children;
}
