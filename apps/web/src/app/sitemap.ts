import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = [
    "",
    "/how-it-works",
    "/pricing",
    "/who-we-are",
    "/learning-center",
    "/when-to-call-an-attorney",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/data-handling",
    "/accessibility",
    "/14days",
    "/es/14dias",
    "/fr/14jours",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
