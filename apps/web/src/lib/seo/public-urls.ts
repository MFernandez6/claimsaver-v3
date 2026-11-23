import { LEARNING_CENTER_PATHS } from "@/lib/seo/articles";

/** Canonical production host. Robots/sitemap/IndexNow always advertise this, never a preview URL. */
export const PRODUCTION_ORIGIN = "https://www.claimsaverplus.com";

/** Public marketing URLs that should be crawled and indexed. */
export const PUBLIC_INDEX_PATHS = [
  "",
  "/how-it-works",
  "/pricing",
  "/vs/lawyer-wont-take-my-pip-claim",
  "/learning-center",
  ...LEARNING_CENTER_PATHS,
  "/14days",
  "/es/14dias",
  "/fr/14jours",
  "/when-to-call-an-attorney",
  "/signup",
  "/who-we-are",
  "/for-clinics",
  "/clinic-demo",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/data-handling",
  "/accessibility",
] as const;

export const PUBLIC_INDEX_URLS = PUBLIC_INDEX_PATHS.map((path) => `${PRODUCTION_ORIGIN}${path}`);

/** Paths crawlers should skip so they spend budget on public pages. */
export const ROBOTS_DISALLOW = [
  "/admin",
  "/admin/",
  "/clinic",
  "/clinic/",
  "/enroll/",
  "/films",
  "/films/",
  "/claims-clinic-outreach",
  "/claims-clinic-outreach/",
  "/dashboard",
  "/dashboard/",
  "/claim-form",
  "/claim-form/",
  "/api/",
  "/success",
  "/forgot-password",
  "/update-password",
];
