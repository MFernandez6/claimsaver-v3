import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Who we are",
  "CLAIMSAVERPLUS LLC builds self-help software for Florida no-fault (PIP) paperwork. Not a law firm. Not legal advice.",
  "/who-we-are",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
