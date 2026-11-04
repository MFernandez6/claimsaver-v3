import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Contact",
  "Contact ClaimSaver+ support. Software questions only — we do not handle your claim.",
  "/contact",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
