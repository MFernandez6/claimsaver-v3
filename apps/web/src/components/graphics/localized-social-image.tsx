"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUiLanguage } from "@/lib/i18n";

type LocalizedSocialImageProps = {
  /** Filename without language suffix or extension, e.g. week4-thu-what-you-get */
  baseName: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function LocalizedSocialImage({
  baseName,
  alt,
  width,
  height,
  className,
}: LocalizedSocialImageProps) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(() => getUiLanguage(i18n));

  useEffect(() => {
    const sync = (next?: string) => {
      const code = (next || i18n.language || "en").split("-")[0]?.toLowerCase();
      setLang(code === "es" || code === "fr" ? code : "en");
    };
    sync();
    i18n.on("languageChanged", sync);
    return () => {
      i18n.off("languageChanged", sync);
    };
  }, [i18n]);

  const src =
    lang === "en"
      ? `/images/social/${baseName}.png`
      : `/images/social/${baseName}-${lang}.png`;

  return (
    // Native img so a language switch always loads a new file (Next/Image can keep the English bitmap).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
