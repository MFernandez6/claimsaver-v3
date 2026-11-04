import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "License and credentials",
  "How ClaimSaver+ is organized. Founder credentials stay off consumer pages until counsel approves.",
  "/license-credentials",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
