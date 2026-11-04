import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinic invitation",
  description: "A Florida clinic invited you to ClaimSaver+. You stay the filer. Platform access is $500.",
  robots: { index: false, follow: false },
};

export default function EnrollLayout({ children }: { children: React.ReactNode }) {
  return children;
}
