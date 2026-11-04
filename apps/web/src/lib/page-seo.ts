import type { Metadata } from "next";

export function pageMeta(title: string, description: string, path?: string): Metadata {
  return {
    title,
    description,
    alternates: path ? { canonical: path } : undefined,
    openGraph: { title: `${title} | ClaimSaver+`, description },
    twitter: { title: `${title} | ClaimSaver+`, description },
  };
}
