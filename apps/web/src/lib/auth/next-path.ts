/** Only allow in-app relative paths (blocks open redirects). */
export function safeNextPath(raw: string | null | undefined, fallback = "/dashboard") {
  if (!raw) return fallback;
  const next = raw.trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (next.includes("://")) return fallback;
  return next;
}

export function withQueryParam(path: string, key: string, value: string) {
  const hashIndex = path.indexOf("#");
  const beforeHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const sep = beforeHash.includes("?") ? "&" : "?";
  return `${beforeHash}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}${hash}`;
}

export function pricingCheckoutPath(opts?: { platform?: boolean }) {
  const q = new URLSearchParams();
  q.set("checkout", "1");
  if (opts?.platform === false) q.set("platform", "0");
  return `/pricing?${q.toString()}`;
}
