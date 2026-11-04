import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinic · ClaimSaver+",
  robots: { index: false, follow: false },
};

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
