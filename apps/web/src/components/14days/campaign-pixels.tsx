"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { ADS_CONSENT_COOKIE } from "@/content/14days";

type PixelEvent = "PageView" | "Lead";

function readConsent() {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${ADS_CONSENT_COOKIE}=`));
  return match?.slice(ADS_CONSENT_COOKIE.length + 1) === "1";
}

export function CampaignPixels({ event }: { event: PixelEvent }) {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(readConsent());
  }, []);

  if (!allowed || (!adsId && !pixelId)) return null;

  const conversionSendTo =
    adsId && conversionLabel ? `${adsId}/${conversionLabel}` : adsId ?? "";

  return (
    <>
      {adsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`}
            strategy="afterInteractive"
          />
          <Script id="cs-google-ads" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${adsId}',{allow_enhanced_conversions:false,anonymize_ip:true});
${
  event === "Lead"
    ? `gtag('event','conversion',{send_to:'${conversionSendTo}'});gtag('event','lead_14days',{send_to:'${adsId}'});`
    : ""
}`}
          </Script>
        </>
      ) : null}
      {pixelId ? (
        <Script id="cs-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('set','autoConfig',false,'${pixelId}');
fbq('init','${pixelId}');
fbq('track','${event === "Lead" ? "Lead" : "PageView"}');`}
        </Script>
      ) : null}
    </>
  );
}

export function CampaignCookieNotice({
  title,
  body,
  accept,
  decline,
}: {
  title: string;
  body: string;
  accept: string;
  decline: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const match = document.cookie.split("; ").find((row) => row.startsWith(`${ADS_CONSENT_COOKIE}=`));
    if (!match) setVisible(true);
  }, []);

  if (!visible) return null;

  function setConsent(value: "1" | "0") {
    document.cookie = `${ADS_CONSENT_COOKIE}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax`;
    setVisible(false);
    if (value === "1") window.location.reload();
  }

  return (
    <div
      role="dialog"
      aria-label={title}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-teal-900/40 bg-slate-950/95 p-4 text-slate-100 shadow-2xl backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{body}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className="rounded-lg bg-teal-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
            onClick={() => setConsent("1")}
          >
            {accept}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-500 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
            onClick={() => setConsent("0")}
          >
            {decline}
          </button>
        </div>
      </div>
    </div>
  );
}
