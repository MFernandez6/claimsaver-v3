import type { Metadata } from "next";

const INDEX = { index: true, follow: true } as const;
const NOINDEX = { index: false, follow: false } as const;

export function pageMeta(title: string, description: string, path?: string): Metadata {
  return {
    title,
    description,
    robots: INDEX,
    alternates: path ? { canonical: path } : undefined,
    openGraph: { title: `${title} | ClaimSaver+`, description },
    twitter: { title: `${title} | ClaimSaver+`, description },
  };
}

/** Account, payment, and worksheet surfaces — keep them out of search results. */
export function privatePageMeta(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: NOINDEX,
    openGraph: { title: `${title} | ClaimSaver+`, description },
    twitter: { title: `${title} | ClaimSaver+`, description },
  };
}
