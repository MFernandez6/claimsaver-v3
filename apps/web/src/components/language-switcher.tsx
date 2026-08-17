"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { supportedLanguages, getUiLanguage } from "@/lib/i18n";
import { ChevronDown, Globe } from "lucide-react";

/** Compact globe + language code for crowded navbars; full names stay in the dropdown. */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => getUiLanguage(i18n));

  useEffect(() => {
    const sync = (lng?: string) => {
      const code = (lng || i18n.language || "en").split("-")[0]?.toLowerCase();
      setCurrentLanguage(code === "es" || code === "fr" || code === "en" ? code : "en");
    };
    sync();
    i18n.on("languageChanged", sync);
    return () => {
      i18n.off("languageChanged", sync);
    };
  }, [i18n]);

  const handleLanguageChange = (languageCode: string) => {
    void i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode === "es" || languageCode === "fr" ? languageCode : "en");
    setIsOpen(false);
    localStorage.setItem("i18nextLng", languageCode);
  };

  const currentLang =
    supportedLanguages.find((lang) => lang.code === currentLanguage) ||
    supportedLanguages[0];

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 min-h-[44px] px-2 gap-1 rounded-lg border border-transparent text-gray-700 hover:bg-gray-100 hover:border-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-700 lg:h-8 lg:min-h-8 lg:px-1.5 lg:gap-0.5 touch-manipulation"
        aria-label={`Language: ${currentLang.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-3.5 w-3.5 shrink-0 opacity-80" />
        <span className="text-[10px] font-semibold uppercase tracking-tight w-5 text-center leading-none">
          {currentLang.code}
        </span>
        <ChevronDown
          className={`h-3 w-3 shrink-0 opacity-50 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 min-w-[10rem] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              type="button"
              role="option"
              aria-selected={currentLanguage === language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                currentLanguage === language.code
                  ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-base leading-none">{language.flag}</span>
              <span className="text-left">{language.name}</span>
              {currentLanguage === language.code && (
                <span className="ml-auto w-1.5 h-1.5 bg-teal-600 dark:bg-teal-400 rounded-full shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          aria-hidden
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
