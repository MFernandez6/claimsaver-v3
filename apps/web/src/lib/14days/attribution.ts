import {
  ATTR_COOKIE,
  ATTR_COOKIE_MAX_AGE,
  type DaysLocale,
} from "@/content/14days";

export type LeadAttribution = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  gclid: string | null;
  fbclid: string | null;
  referrer: string | null;
  landingPath: string | null;
};

const KEYS = [
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "gclid",
  "fbclid",
  "referrer",
  "landingPath",
] as const;

function clip(value: string | null | undefined, max = 500) {
  const next = String(value ?? "").trim();
  if (!next) return null;
  return next.slice(0, max);
}

export function emptyAttribution(): LeadAttribution {
  return {
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    gclid: null,
    fbclid: null,
    referrer: null,
    landingPath: null,
  };
}

export function parseAttributionCookie(raw: string | null | undefined): LeadAttribution {
  const base = emptyAttribution();
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    for (const key of KEYS) {
      base[key] = clip(typeof parsed[key] === "string" ? parsed[key] : null);
    }
    return base;
  } catch {
    return base;
  }
}

/** First-touch: keep existing values, fill blanks from the current URL. */
export function mergeAttribution(existing: LeadAttribution, incoming: LeadAttribution): LeadAttribution {
  const next = { ...existing };
  for (const key of KEYS) {
    if (!next[key] && incoming[key]) next[key] = incoming[key];
  }
  return next;
}

export function attributionFromSearch(search: string, landingPath: string, referrer: string): LeadAttribution {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return {
    utmSource: clip(params.get("utm_source")),
    utmMedium: clip(params.get("utm_medium")),
    utmCampaign: clip(params.get("utm_campaign")),
    utmContent: clip(params.get("utm_content")),
    utmTerm: clip(params.get("utm_term")),
    gclid: clip(params.get("gclid")),
    fbclid: clip(params.get("fbclid")),
    referrer: clip(referrer, 1000),
    landingPath: clip(landingPath, 200),
  };
}

export function serializeAttributionCookie(value: LeadAttribution) {
  return `${ATTR_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${ATTR_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function thanksPathFor(locale: DaysLocale) {
  return locale === "es" ? "/es/14dias/gracias" : "/14days/thanks";
}
