import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "For Clinics",
  "ClaimSaver+ for Florida PIP clinics: patients use self-help software and stay the filer. Staff see checklist progress only. Book a 15-minute demo.",
  "/for-clinics",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
