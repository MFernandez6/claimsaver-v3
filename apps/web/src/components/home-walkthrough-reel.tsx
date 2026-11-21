"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";

const SRC = "/walkthroughs/user-9x16.mp4";
const POSTER = "/walkthroughs/user-9x16.jpg";

export function HomeWalkthroughReel() {
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
    <figure className="relative mx-auto w-full max-w-[20.5rem] lg:max-w-[22rem]">
      <p className="mb-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal-800 dark:text-teal-200">
        {t("home.hero.reelKicker")}
      </p>
      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-10 rounded-[3.5rem] bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.32),transparent_68%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.18),transparent_68%)]"
          aria-hidden
        />
        <div className="relative rounded-[2rem] bg-gradient-to-b from-slate-600 via-slate-900 to-[#071614] p-[0.65rem] shadow-[0_32px_70px_-24px_rgba(15,23,42,0.7)] ring-1 ring-white/25">
          <div className="relative overflow-hidden rounded-[1.45rem] bg-[#0b1f1a] shadow-inner">
            <video
              ref={videoRef}
              className="aspect-[9/16] h-auto w-full bg-[#0b1f1a]"
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
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#071614]/20"
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
        </div>
      </div>
      <figcaption className="mt-4 text-center text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {t("home.hero.reelCaption")}{" "}
        <Link href="/how-it-works" className="whitespace-nowrap font-semibold text-teal-800 underline underline-offset-2 dark:text-teal-200">
          {t("home.hero.reelFull")}
        </Link>
      </figcaption>
    </figure>
  );
}
