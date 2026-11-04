import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta("Sign in", "Sign in to your ClaimSaver+ account.", "/login");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
