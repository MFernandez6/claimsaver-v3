import { privatePageMeta } from "@/lib/page-seo";

export const metadata = privatePageMeta(
  "Guided application",
  "Florida no-fault worksheet. You stay the filer. ClaimSaver+ does not send this to an insurer.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
