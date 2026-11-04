import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "When to call an attorney",
  "Situations where Florida PIP software is not enough and a licensed attorney may be needed.",
  "/when-to-call-an-attorney",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
