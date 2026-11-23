import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Florida PIP software from Miami",
  "CLAIMSAVERPLUS LLC builds self-help software so you can file Florida no-fault (PIP) paperwork yourself. Not a law firm. Not legal advice.",
  "/who-we-are",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
