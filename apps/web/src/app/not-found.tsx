"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">{t("notFound.heading")}</h1>
      <p className="mt-3 text-slate-600">{t("notFound.messageShort")}</p>
      <Link href="/" className="mt-6 inline-block text-teal-800 underline">{t("notFound.backHome")}</Link>
    </div>
  );
}
