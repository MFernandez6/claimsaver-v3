import type { User } from "@supabase/supabase-js";

function firstNonEmpty(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

export function nameFromAuthUser(user: User | null | undefined) {
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const first = firstNonEmpty(String(meta.first_name ?? ""));
  const full = firstNonEmpty(String(meta.full_name ?? ""));
  return first || full.split(/\s+/)[0] || "";
}

export function greetingName(
  me: { firstName?: string; email?: string } | null | undefined,
  user: User | null | undefined,
  fallback: string,
) {
  return (
    firstNonEmpty(me?.firstName, nameFromAuthUser(user), me?.email, user?.email) ||
    fallback
  );
}
