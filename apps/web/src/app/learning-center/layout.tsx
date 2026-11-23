import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Florida PIP claim guides",
  "How to file a Florida PIP claim, the 14-day rule, documents, and when to call an attorney. General education. Not legal advice. Self-help software.",
  "/learning-center",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
