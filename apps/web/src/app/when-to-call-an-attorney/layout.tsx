import { pageMeta } from "@/lib/page-seo";

export const metadata = pageMeta(
  "When a Florida PIP claim needs an attorney",
  "When self-help PIP software is not enough: serious injury, denials, EUO/IME, or a third-party claim. Situations where a licensed Florida attorney may be needed.",
  "/when-to-call-an-attorney",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
