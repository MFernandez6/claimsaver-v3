"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export function FlashNotice({
  message,
  tone = "success",
  onDismiss,
}: {
  message: string | null;
  tone?: "success" | "error";
  onDismiss?: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => onDismiss?.(), 5000);
    return () => window.clearTimeout(id);
  }, [message, onDismiss]);

  if (!message) return null;

  const success = tone === "success";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-50 w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 rounded-xl border px-4 py-3 text-sm shadow-lg ${
        success
          ? "border-teal-200 bg-teal-50 text-teal-950 dark:border-teal-800 dark:bg-teal-950/90 dark:text-teal-50"
          : "border-red-200 bg-red-50 text-red-950"
      }`}
    >
      <p className="flex items-start gap-2 leading-relaxed">
        {success ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : null}
        <span>{message}</span>
      </p>
    </div>
  );
}
