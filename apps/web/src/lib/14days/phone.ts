/** US numbers only. Empty → null. Invalid → error. Valid → E.164 (+1XXXXXXXXXX). */
export function parseUsPhone(
  raw: string | null | undefined,
): { ok: true; value: string | null } | { ok: false } {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return { ok: true, value: null };
  const digits = trimmed.replace(/\D/g, "");
  let national = digits;
  if (national.length === 11 && national.startsWith("1")) national = national.slice(1);
  if (national.length !== 10) return { ok: false };
  if (national.startsWith("0") || national.startsWith("1")) return { ok: false };
  return { ok: true, value: `+1${national}` };
}
