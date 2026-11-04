import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Data handling",
  "How ClaimSaver+ stores worksheets, documents, and deletion requests.",
  "/data-handling",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
