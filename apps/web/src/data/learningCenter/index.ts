import type { ArticleKey } from "./keys";
import { EN_ARTICLES } from "./en";
import { ES_ARTICLES } from "./es";
import { FR_ARTICLES } from "./fr";

export type { ArticleKey } from "./keys";

export function getLearningArticleParagraphs(
  lang: string | undefined,
  key: ArticleKey
): readonly string[] {
  const code = lang?.split("-")[0]?.toLowerCase();
  if (code === "es") return ES_ARTICLES[key];
  if (code === "fr") return FR_ARTICLES[key];
  return EN_ARTICLES[key];
}
