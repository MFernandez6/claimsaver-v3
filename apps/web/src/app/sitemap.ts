import type { MetadataRoute } from "next";
import { PRODUCTION_ORIGIN, PUBLIC_INDEX_PATHS } from "@/lib/seo/public-urls";

const PRIORITY: Record<string, number> = {
  "": 1,
  "/how-it-works": 0.9,
  "/vs/lawyer-wont-take-my-pip-claim": 0.9,
  "/learning-center": 0.9,
  "/14days": 0.9,
  "/pricing": 0.8,
  "/when-to-call-an-attorney": 0.8,
  "/signup": 0.7,
  "/es/14dias": 0.7,
  "/fr/14jours": 0.7,
  "/for-clinics": 0.6,
  "/who-we-are": 0.5,
  "/clinic-demo": 0.5,
  "/contact": 0.4,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PUBLIC_INDEX_PATHS.map((path) => ({
    url: `${PRODUCTION_ORIGIN}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/learning-center" ? "weekly" : "monthly",
    priority: path.startsWith("/learning-center/") ? 0.85 : (PRIORITY[path] ?? 0.2),
  }));
}
