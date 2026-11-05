import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Terms of Service",
  "ClaimSaver+ terms. Self-help software, not a law firm, not legal advice. Version 26.11.05.",
  "/terms-of-service",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
