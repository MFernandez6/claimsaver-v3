/**
 * Public proof for marketing pages.
 * Fill only with real, dated, consented items. Empty arrays stay off the page.
 */

export type FilerQuote = {
  firstName: string;
  initials: string;
  context: string;
  quote: string;
};

/** Named filer quotes. Do not invent. */
export const FILER_QUOTES: FilerQuote[] = [];

/** Public count of claims prepared through ClaimSaver+. Null until a real number exists. */
export const CLAIMS_PREPARED_COUNT: number | null = null;

export type DatedThirdParty = {
  label: string;
  date: string;
  href?: string;
};

/** Dated third-party signals (press, rating, program badge). Do not invent. */
export const DATED_THIRD_PARTY: DatedThirdParty[] = [];

/** Founder headshot path. Null until a photo without a license number is supplied. */
export const FOUNDER_PHOTO_SRC: string | null = null;

export const FOUNDER_LINKEDIN_HREF = "https://www.linkedin.com/in/miguelfernandez023/";
