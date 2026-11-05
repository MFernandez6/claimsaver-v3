import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Contact",
  "Contact ClaimSaver+ support. Software questions only — you remain the filer.",
  "/contact",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
