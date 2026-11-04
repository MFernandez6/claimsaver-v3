const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const USER_QUERY_HINT =
  "Search by exact email or user ID only. No name or partial matches.";

export type ParsedUserQuery =
  | { ok: true; kind: "id"; value: string }
  | { ok: true; kind: "email"; value: string }
  | { ok: false; error: string };

export function parseUserQuery(raw: string | null | undefined): ParsedUserQuery {
  const q = (raw ?? "").trim();
  if (!q) return { ok: false, error: USER_QUERY_HINT };
  if (UUID_RE.test(q)) return { ok: true, kind: "id", value: q.toLowerCase() };
  if (/[%*]/.test(q)) return { ok: false, error: USER_QUERY_HINT };
  if (q.includes("@") && q.includes(".") && !/\s/.test(q) && q.split("@").length === 2) {
    return { ok: true, kind: "email", value: q.toLowerCase() };
  }
  return { ok: false, error: USER_QUERY_HINT };
}

/** Exact match for PostgREST ilike — `_` and `%` would otherwise be wildcards. */
export function escapeIlikeExact(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export function isUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

export function weekAgoIso(now = new Date()): string {
  return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
}
