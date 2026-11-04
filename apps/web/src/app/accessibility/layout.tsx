import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Accessibility",
  "ClaimSaver+ accessibility statement for the Florida PIP self-help software.",
  "/accessibility",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
