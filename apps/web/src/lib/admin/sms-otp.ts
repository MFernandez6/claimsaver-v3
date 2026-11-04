import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { parseUsPhone } from "@/lib/14days/phone";

export const ADMIN_SMS_TTL_MS = 10 * 60 * 1000;
export const ADMIN_SMS_MAX_ATTEMPTS = 5;
export const DEFAULT_OWNER_MFA_PHONE = "+17864173869";

export function resolveAdminMfaPhone(): string {
  const parsed = parseUsPhone(process.env.ADMIN_MFA_PHONE || "7864173869");
  if (parsed.ok && parsed.value) return parsed.value;
  return DEFAULT_OWNER_MFA_PHONE;
}

export function maskMfaPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  const last4 = digits.slice(-4) || "0000";
  return `(***) ***-${last4}`;
}

export function phoneLast4(e164: string): string {
  return e164.replace(/\D/g, "").slice(-4);
}

export function generateSmsCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashSmsCode(userId: string, code: string): string {
  const pepper =
    process.env.CRON_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "claimsaver-admin-sms";
  return createHash("sha256").update(`${userId}:${code.trim()}:${pepper}`).digest("hex");
}

export function hashesMatch(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function smsMessage(code: string): string {
  return `ClaimSaver+ admin code: ${code}. Expires in 10 minutes. If you did not request this, ignore the message.`;
}
