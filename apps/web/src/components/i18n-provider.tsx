"use client";

import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { getUiLanguage } from "@/lib/i18n";

function applyDocumentLangAndMeta() {
  const code = getUiLanguage(i18n);
  document.documentElement.lang = code;
  const t = i18n.getFixedT(code);
  document.title = t("meta.title");
  const description = t("meta.description");
  const setMeta = (selector: string, attr: string, value: string) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", t("meta.title"));
  setMeta('meta[property="og:description"]', "content", description);
  const ogLocale = code === "es" ? "es_ES" : code === "fr" ? "fr_FR" : "en_US";
  setMeta('meta[property="og:locale"]', "content", ogLocale);
}

export default function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("i18nextLng");
    const normalized = saved?.split("-")[0];
    if (normalized && ["en", "es", "fr"].includes(normalized) && getUiLanguage(i18n) !== normalized) {
      void i18n.changeLanguage(normalized);
    }
    applyDocumentLangAndMeta();
    const onChange = () => applyDocumentLangAndMeta();
    i18n.on("languageChanged", onChange);
    return () => {
      i18n.off("languageChanged", onChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
