import { privatePageMeta } from "@/lib/page-seo";

export const metadata = privatePageMeta("Sign in", "Sign in to your ClaimSaver+ account.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
