import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinic enrollment · ClaimSaver+",
  robots: { index: false, follow: false },
};

export default function EnrollLayout({ children }: { children: React.ReactNode }) {
  return children;
}
