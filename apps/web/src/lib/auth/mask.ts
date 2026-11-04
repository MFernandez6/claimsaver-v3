/** Masking for staff views. Reveal is a separate, audited action — never the default. */

export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at < 1 || at === trimmed.length - 1) return "***";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `***-***-${digits.slice(-4)}`;
}

export function maskName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "***";
  return parts.map((part) => `${part.slice(0, 1).toUpperCase()}.`).join(" ");
}

export function maskId(id: string): string {
  const trimmed = id.trim();
  if (trimmed.length <= 8) return "***";
  return `${trimmed.slice(0, 8)}…`;
}

/** SSN is never shown in admin. Empty string, not a partial mask. */
export function maskSsn(_value?: string): "" {
  return "";
}

const MEDICAL_KEYS = /^(medical|diagnosis|treatment|injury|icd|cpt|npi|patient|health|hipaa)/i;

export function stripMedicalFields(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (MEDICAL_KEYS.test(key)) continue;
    out[key] = value;
  }
  return out;
}
