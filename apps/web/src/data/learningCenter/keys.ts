export const ARTICLE_KEYS = [
  "pipSteps",
  "fourteenDay",
  "needLawyer",
  "documents",
  "mistakes",
] as const;

export type ArticleKey = (typeof ARTICLE_KEYS)[number];
