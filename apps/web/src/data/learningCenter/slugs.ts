import type { ArticleKey } from "./keys";

/** URL slugs for Learning Center articles (SEO). */
export const ARTICLE_SLUGS: Record<ArticleKey, string> = {
  pipSteps: "how-to-file-pip-in-florida",
  fourteenDay: "florida-pip-14-day-rule",
  needLawyer: "do-you-need-an-attorney",
  documents: "pip-claim-documents-checklist",
  mistakes: "common-pip-claim-mistakes",
};

export const SLUG_TO_ARTICLE: Record<string, ArticleKey> = Object.fromEntries(
  Object.entries(ARTICLE_SLUGS).map(([key, slug]) => [slug, key as ArticleKey]),
) as Record<string, ArticleKey>;

export function articlePath(key: ArticleKey): string {
  return `/learning-center/${ARTICLE_SLUGS[key]}`;
}
