import type { MetadataRoute } from "next";
import { PRODUCTION_ORIGIN, ROBOTS_DISALLOW } from "@/lib/seo/public-urls";

export default function robots(): MetadataRoute.Robots {
  const allowPublic = {
    allow: "/",
    disallow: ROBOTS_DISALLOW,
  };
  return {
    rules: [
      { userAgent: "*", ...allowPublic },
      { userAgent: "Googlebot", ...allowPublic },
      { userAgent: "Bingbot", ...allowPublic },
    ],
    sitemap: `${PRODUCTION_ORIGIN}/sitemap.xml`,
    host: PRODUCTION_ORIGIN,
  };
}
