"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TYPES, type DocumentType } from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import { webApi } from "@/lib/api/client";

export function DocumentUploadModal({
  open,
  onClose,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded: (name: string) => void;
}) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentType>("other");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function resetAndClose() {
    setFile(null);
    setCategory("other");
    setError(null);
    setBusy(false);
    onClose();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError(t("dashboard.uploadModal.fileRequired"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", file.name);
      form.append("type", category);
      await webApi.upload("/api/v1/documents", form);
      const uploadedName = file.name;
      setFile(null);
      setCategory("other");
      setBusy(false);
      onClose();
      onUploaded(uploadedName);
    } catch {
      setError(t("capture.error"));
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="vault-upload-title">
      <button type="button" className="absolute inset-0 bg-slate-900/50" aria-label={t("common.close")} onClick={resetAndClose} />
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <h2 id="vault-upload-title" className="text-lg font-semibold text-slate-900 dark:text-white">
          {t("dashboard.uploadModal.title")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{t("dashboard.uploadModal.hint")}</p>
        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("dashboard.uploadModal.categoryLabel")}
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentType)}
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`dashboard.docTypes.${type}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("dashboard.uploadModal.fileLabel")}
          <input
            type="file"
            accept="image/*,.pdf,.heic,.jpg,.jpeg,.png,.doc,.docx,.webp"
            className="mt-1 block w-full text-sm"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setError(null);
            }}
          />
        </label>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={resetAndClose} disabled={busy}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={busy} className="bg-gradient-to-r from-emerald-600 to-teal-800">
            {busy ? t("dashboard.uploading") : t("dashboard.uploadModal.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
