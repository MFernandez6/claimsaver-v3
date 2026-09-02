import { LEGAL_DOCUMENTS_VERSION } from "@claimsaver/shared";
import { webApi } from "@/lib/api/client";

const STORAGE_KEY = "cs.legalConsentPending";

export function markPendingLegalConsent(source: "signup" | "checkout" | "pricing" | "reaccept") {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: LEGAL_DOCUMENTS_VERSION, source, at: new Date().toISOString() }),
  );
}

export async function flushPendingLegalConsent() {
  if (typeof window === "undefined") return;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const pending = JSON.parse(raw) as { version?: string; source?: string };
  await webApi.post("/api/v1/legal/consent", {
    version: pending.version || LEGAL_DOCUMENTS_VERSION,
    source: pending.source || "signup",
  });
  sessionStorage.removeItem(STORAGE_KEY);
}
