"use client";

import { useEffect } from "react";
import {
  attributionFromSearch,
  mergeAttribution,
  parseAttributionCookie,
  serializeAttributionCookie,
} from "@/lib/14days/attribution";
import { ATTR_COOKIE } from "@/content/14days";

function readCookie() {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${ATTR_COOKIE}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(ATTR_COOKIE.length + 1));
}

export function UtmCapture({ landingPath }: { landingPath: string }) {
  useEffect(() => {
    const existing = parseAttributionCookie(readCookie());
    const incoming = attributionFromSearch(
      window.location.search,
      landingPath || window.location.pathname,
      document.referrer || "",
    );
    const merged = mergeAttribution(existing, incoming);
    document.cookie = serializeAttributionCookie(merged);
  }, [landingPath]);
  return null;
}
