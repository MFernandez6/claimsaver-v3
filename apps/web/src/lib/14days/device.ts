export const PDF_WINDOW_NAME = "cs-14days-pdf";

export function isMobileChecklistDevice(input?: {
  userAgent?: string;
  maxWidth?: boolean;
}): boolean {
  const ua =
    input?.userAgent ??
    (typeof navigator !== "undefined" ? navigator.userAgent : "");
  if (/Mobi|Android|iPhone|iPod|iPad|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }
  if (input?.maxWidth === true) return true;
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
    return true;
  }
  return false;
}

export function openChecklistPdfWindow(): Window | null {
  if (typeof window === "undefined") return null;
  const existing = window.open("about:blank", PDF_WINDOW_NAME);
  if (!existing) return null;
  try {
    existing.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ClaimSaver+</title></head><body style="margin:0;font-family:system-ui,sans-serif;padding:24px;color:#0f172a;background:#f8fafc">Opening your checklist…</body></html>`,
    );
  } catch {
    /* ignore — some browsers lock document.write on reused windows */
  }
  return existing;
}

export function showChecklistPdf(win: Window | null, pdfPath: string) {
  if (win && !win.closed) {
    win.location.replace(pdfPath);
    return;
  }
  if (typeof window === "undefined") return;
  window.open(pdfPath, PDF_WINDOW_NAME);
}
