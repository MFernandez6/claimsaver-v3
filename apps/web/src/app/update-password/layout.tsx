import { privatePageMeta } from "@/lib/page-seo";

export const metadata = privatePageMeta(
  "Update password",
  "Choose a new ClaimSaver+ account password.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
