import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "For clinics",
  "ClaimSaver+ for Florida PIP clinics: patients use self-help software and stay the filer. Staff see checklist progress only. Book a demo at /clinic-demo. After a signed BAA, each clinic gets its own /enroll/ link.",
  "/for-clinics",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
