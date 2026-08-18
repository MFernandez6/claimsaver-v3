"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import {
  IDLE_LIMIT_MS,
  IDLE_WARN_MS,
  SESSION_CHANNEL,
  endSession,
  getTabId,
  hasLiveSiblingTab,
  idleMs,
  lastActivityAt,
  loginPath,
  markActivity,
  registerSessionTab,
  unregisterSessionTab,
} from "@/lib/auth/session-security";

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
];

export function SessionGuard() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const [warnSeconds, setWarnSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupabaseBrowserConfigured()) return;
    const supabase = getBrowserSupabase();
    let heartbeat: number | undefined;
    let watching = false;

    const redirectToLogin = () => {
      setWarnSeconds(null);
      const path = pathRef.current;
      if (path.startsWith("/login") || path.startsWith("/signup") || path.startsWith("/checkout-account")) return;
      router.replace(loginPath(path));
      router.refresh();
    };

    const logout = async (reason: "idle" | "new_window" | "broadcast") => {
      stopWatch();
      await endSession(reason);
      redirectToLogin();
    };

    const tick = () => {
      if (!watching) return;
      registerSessionTab();
      const idle = idleMs();
      if (idle >= IDLE_LIMIT_MS) {
        void logout("idle");
        return;
      }
      const remaining = IDLE_LIMIT_MS - idle;
      setWarnSeconds(remaining <= IDLE_WARN_MS ? Math.max(1, Math.ceil(remaining / 1000)) : null);
    };

    const onActivity = () => {
      if (!watching) return;
      markActivity();
      registerSessionTab();
      setWarnSeconds(null);
    };

    const startWatch = () => {
      if (watching) return;
      watching = true;
      if (!lastActivityAt()) markActivity();
      registerSessionTab();
      ACTIVITY_EVENTS.forEach((event) =>
        window.addEventListener(event, onActivity, { passive: true }),
      );
      document.addEventListener("visibilitychange", onVisibility);
      heartbeat = window.setInterval(tick, 1000);
      tick();
    };

    const stopWatch = () => {
      if (!watching) return;
      watching = false;
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, onActivity));
      document.removeEventListener("visibilitychange", onVisibility);
      if (heartbeat) window.clearInterval(heartbeat);
      heartbeat = undefined;
      setWarnSeconds(null);
    };

    function onVisibility() {
      if (document.visibilityState === "visible") tick();
    }

    const attachSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        stopWatch();
        return;
      }
      const thisTab = getTabId();
      if (!thisTab && !hasLiveSiblingTab()) {
        await logout("new_window");
        return;
      }
      startWatch();
    };

    void attachSession();

    const { data: sub } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        if (event === "SIGNED_IN") {
          markActivity();
          registerSessionTab();
        }
        void attachSession();
      }
      if (event === "SIGNED_OUT") {
        stopWatch();
        unregisterSessionTab();
      }
    });

    const channel = new BroadcastChannel(SESSION_CHANNEL);
    channel.onmessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type === "logout") void logout("broadcast");
    };

    const onPageHide = () => unregisterSessionTab();
    window.addEventListener("pagehide", onPageHide);

    return () => {
      stopWatch();
      sub.subscription.unsubscribe();
      channel.close();
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [router]);

  if (warnSeconds == null) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[min(28rem,calc(100%-2rem))] rounded-2xl border border-amber-300 bg-white p-4 shadow-xl"
      role="alertdialog"
      aria-live="assertive"
    >
      <p className="text-sm font-semibold text-slate-900">{t("auth.session.idleTitle")}</p>
      <p className="mt-1 text-sm text-slate-600">
        {t("auth.session.idleBody", { seconds: warnSeconds })}
      </p>
      <Button
        className="mt-3 w-full bg-gradient-to-r from-emerald-600 to-teal-800"
        onClick={() => {
          markActivity();
          registerSessionTab();
          setWarnSeconds(null);
        }}
      >
        {t("auth.session.staySignedIn")}
      </Button>
    </div>
  );
}
