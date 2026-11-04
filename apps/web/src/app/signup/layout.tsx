import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Create your account",
  "Create a ClaimSaver+ account, then pay $500 for Florida PIP claim software access.",
  "/signup",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
