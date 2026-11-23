import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "Florida PIP software support",
  "Contact ClaimSaver+ about the self-help PIP platform. Software and billing questions only — you remain the filer. Not legal advice.",
  "/contact",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
