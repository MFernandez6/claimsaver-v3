import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Payment received",
  "Your ClaimSaver+ platform access is ready. Continue to your dashboard.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
