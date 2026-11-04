import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Dashboard",
  "Your ClaimSaver+ claim workspace. Progress, documents, and PIP reminders.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
