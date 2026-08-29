/** Normalize emails before Auth calls so copy/paste spaces do not fail login. */
export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}
