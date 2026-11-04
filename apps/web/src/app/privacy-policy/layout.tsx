import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Privacy Policy",
  "How ClaimSaver+ collects, uses, and deletes account data. English text controls.",
  "/privacy-policy",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
