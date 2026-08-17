"use client";

import { useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { webApi } from "@/lib/api/client";

export function SceneCapture({
  compact = false,
  onUploaded,
}: {
  compact?: boolean;
  onUploaded?: () => void;
}) {
  const { t } = useTranslation();
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", file.name);
      form.append("type", "evidence");
      await webApi.upload("/api/v1/documents", form);
      onUploaded?.();
    } catch {
      setError(t("capture.error"));
    } finally {
      setBusy(false);
    }
  }

  const inputs = (
    <>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void upload(f);
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf,.heic,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void upload(f);
        }}
      />
    </>
  );

  const actions = (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        disabled={busy}
        className="bg-gradient-to-r from-emerald-600 to-teal-800"
        onClick={() => cameraRef.current?.click()}
      >
        <Camera className="h-4 w-4" />
        {busy ? t("dashboard.uploading") : t("capture.photo")}
      </Button>
      <Button type="button" variant="outline" disabled={busy} onClick={() => fileRef.current?.click()}>
        <Upload className="h-4 w-4" />
        {t("capture.file")}
      </Button>
    </div>
  );

  if (compact) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        {inputs}
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{t("capture.title")}</p>
        <p className="mt-1 text-xs text-slate-500">{t("capture.vaultHint")}</p>
        <div className="mt-3">{actions}</div>
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <Card className="border-teal-200/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t("capture.title")}</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">{t("capture.body")}</p>
      </CardHeader>
      <CardContent>
        {inputs}
        {actions}
        <p className="mt-3 text-xs text-slate-500">{t("capture.vaultHint")}</p>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
