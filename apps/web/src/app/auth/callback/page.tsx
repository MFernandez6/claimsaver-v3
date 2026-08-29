"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { safeNextPath, withQueryParam } from "@/lib/auth/next-path";

const OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function isOtpType(value: string | null): value is EmailOtpType {
  return Boolean(value && OTP_TYPES.has(value as EmailOtpType));
}

function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const next = safeNextPath(params.get("next"), "/dashboard");
      const fail = `/login?error=confirm&next=${encodeURIComponent(next)}`;

      if (!isSupabaseBrowserConfigured()) {
        router.replace(fail);
        return;
      }

      const supabase = getBrowserSupabase();
      const tokenHash = params.get("token_hash");
      const typeParam = params.get("type");
      const code = params.get("code");
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      let error: { message: string } | null = null;

      if (tokenHash && isOtpType(typeParam)) {
        const result = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: typeParam });
        error = result.error;
      } else if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code);
        error = result.error;
      } else if (accessToken && refreshToken) {
        const result = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        error = result.error;
      } else {
        router.replace(fail);
        return;
      }

      if (cancelled) return;
      if (error) {
        setMessage("That link could not sign you in. Redirecting…");
        router.replace(fail);
        return;
      }

      const dest =
        typeParam === "recovery"
          ? "/update-password"
          : withQueryParam(next, "email_confirmed", "1");
      router.replace(dest);
      router.refresh();
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-slate-600">{message}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <p className="text-slate-600">Confirming your email…</p>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
