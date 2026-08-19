import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { SUPPORT_EMAIL } from "@claimsaver/shared";

import enTranslations from "../locales/en.json";
import esTranslations from "../locales/es.json";
import frTranslations from "../locales/fr.json";

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "es", "fr"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    debug: false,

    interpolation: {
      escapeValue: false,
      defaultVariables: {
        supportEmail: SUPPORT_EMAIL,
      },
    },

    react: {
      useSuspense: false,
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;

export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
] as const;

export type UiLanguage = "en" | "es" | "fr";

/** Language used for UI and image assets — prefers the active i18n language, not the fallback. */
export function getUiLanguage(instance: typeof i18n = i18n): UiLanguage {
  const raw = `${instance.language || ""}`;
  const code = raw.split("-")[0]?.toLowerCase();
  if (code === "es" || code === "fr" || code === "en") return code;
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("i18nextLng")?.split("-")[0]?.toLowerCase() : null;
  if (stored === "es" || stored === "fr" || stored === "en") return stored;
  return "en";
}

export const getLanguageName = (code: string) => {
  const lang = supportedLanguages.find((l) => l.code === code);
  return lang ? lang.name : "English";
};

export const getLanguageFlag = (code: string) => {
  const lang = supportedLanguages.find((l) => l.code === code);
  return lang ? lang.flag : "🇺🇸";
};
