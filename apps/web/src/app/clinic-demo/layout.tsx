import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a clinic demo",
  description:
    "Book a 15-minute ClaimSaver+ walkthrough for Florida PIP clinics. Staff see checklist progress only.",
};

export default function ClinicDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
