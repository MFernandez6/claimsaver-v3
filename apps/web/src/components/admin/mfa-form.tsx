"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { webApi } from "@/lib/api/client";

type Challenge = { phone: string; sms: boolean; email: boolean };

export function AdminMfaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get("reason");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const started = useRef(false);

  const send = async () => {
    setError(null);
    setBusy(true);
    try {
      const next = await webApi.post<Challenge>("/api/v1/admin/mfa/challenge", {});
      setChallenge(next);
      setCooldown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function verify() {
    setError(null);
    setBusy(true);
    try {
      await webApi.post("/api/v1/admin/mfa/verify", { code: code.trim() });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void verify();
      }}
    >
      {reason === "idle" ? (
        <p className="text-sm text-amber-700">
          Admin session idle timeout (30 minutes). We sent a new code to your OWNER email.
        </p>
      ) : null}
      {reason === "absolute" ? (
        <p className="text-sm text-amber-700">
          Admin session reached the 12-hour limit. We sent a new code to your OWNER email.
        </p>
      ) : null}
      <p className="text-sm text-slate-600">
        {challenge
          ? `${
              challenge.email
                ? "We emailed a 6-digit code to your OWNER inbox."
                : "We sent a 6-digit admin code."
            }${
              challenge.sms ? ` A text also went to ${challenge.phone}.` : ""
            } Use the newest email — older codes stop working.`
          : "Sending a code to your OWNER email…"}
      </p>
      <Input
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={8}
        required
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        type="submit"
        disabled={busy || code.length < 6}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-800"
      >
        {busy ? "Verifying…" : "Continue"}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={busy || cooldown > 0}
        className="w-full"
        onClick={() => void send()}
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : "Email me a new code"}
      </Button>
    </form>
  );
}
