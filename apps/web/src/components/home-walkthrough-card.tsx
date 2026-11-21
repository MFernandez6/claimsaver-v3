"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";

const SRC = "/walkthroughs/user-16x9.mp4";
const POSTER = "/walkthroughs/user-16x9.jpg";

export function HomeWalkthroughCard() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    void video.play();
  }, []);

  return (
    <section className="bg-white py-12 sm:py-16 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-200">
          {t("home.hero.reelKicker")}
        </p>
        <h2 className="mt-2 text-center text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-white">
          {t("home.hero.reelTitle")}
        </h2>
        <figure className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] dark:border-slate-700">
          <div className="relative bg-black">
            <video
              ref={videoRef}
              className="aspect-video h-auto w-full bg-black"
              playsInline
              preload="metadata"
              poster={POSTER}
              controls={started}
              title={t("home.hero.reelTitle")}
              onPlay={() => setStarted(true)}
              onEnded={() => {
                setStarted(false);
                const video = videoRef.current;
                if (!video) return;
                video.pause();
                video.currentTime = 0;
              }}
            >
              <source src={SRC} type="video/mp4" />
              <a href={SRC} className="text-teal-400 underline">
                {t("home.hero.reelTitle")}
              </a>
            </video>
            {started ? null : (
              <button
                type="button"
                onClick={start}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/25"
                aria-label={t("home.hero.reelPlay")}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-800 text-white shadow-[0_12px_30px_rgba(13,148,136,0.45)] ring-2 ring-white/35">
                  <Play className="ml-0.5 h-7 w-7 fill-current" aria-hidden />
                </span>
                <span className="rounded-full bg-white/95 px-3.5 py-1 text-xs font-semibold tracking-wide text-slate-900 shadow-sm">
                  {t("home.hero.reelPlay")}
                </span>
              </button>
            )}
          </div>
          <figcaption className="bg-white px-5 py-4 text-center text-sm leading-relaxed text-slate-600 sm:text-left dark:bg-slate-900 dark:text-slate-300">
            {t("home.hero.reelCaption")}{" "}
            <Link
              href="/how-it-works"
              className="whitespace-nowrap font-semibold text-teal-800 underline underline-offset-2 dark:text-teal-200"
            >
              {t("home.hero.reelFull")}
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
