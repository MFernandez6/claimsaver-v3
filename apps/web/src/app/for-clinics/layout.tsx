import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Florida PIP clinic software",
  "Software for Florida PIP clinics: patients file their own no-fault paperwork. Staff see checklist progress only—never worksheets or medical files. Book a 15-minute demo.",
  "/for-clinics",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
