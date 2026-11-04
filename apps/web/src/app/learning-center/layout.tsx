import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Learning center",
  "General Florida PIP education. Not legal advice. ClaimSaver+ is self-help software.",
  "/learning-center",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
