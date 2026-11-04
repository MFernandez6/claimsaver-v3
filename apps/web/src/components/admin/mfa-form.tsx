"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";
import { webApi } from "@/lib/api/client";

type Mode = "loading" | "enroll" | "challenge";

export function AdminMfaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get("reason");
  const [mode, setMode] = useState<Mode>("loading");
  const [factorId, setFactorId] = useState("");
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!isSupabaseBrowserConfigured()) {
      setError("Auth is not configured.");
      return;
    }
    const supabase = getBrowserSupabase();
    void (async () => {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) {
        setError(factors.error.message);
        return;
      }
      const verified = factors.data.totp.find(
        (factor: { id: string; status: string }) => factor.status === "verified",
      );
      if (verified) {
        setFactorId(verified.id);
        setMode("challenge");
        return;
      }
      for (const factor of factors.data.totp) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }
      const enrolled = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `ClaimSaver+ admin ${Date.now()}`,
      });
      if (enrolled.error) {
        setError(enrolled.error.message);
        return;
      }
      setFactorId(enrolled.data.id);
      const qrCode = enrolled.data.totp.qr_code;
      setQr(
        qrCode.startsWith("data:")
          ? qrCode
          : `data:image/svg+xml;utf-8,${encodeURIComponent(qrCode)}`,
      );
      setSecret(enrolled.data.totp.secret);
      setMode("enroll");
    })();
  }, []);

  async function verify() {
    setError(null);
    setBusy(true);
    try {
      const supabase = getBrowserSupabase();
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;
      const verified = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: code.trim(),
      });
      if (verified.error) throw verified.error;
      await webApi.post("/api/v1/admin/session");
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
          Admin session idle timeout (30 minutes). Enter a new authenticator code.
        </p>
      ) : null}
      {reason === "absolute" ? (
        <p className="text-sm text-amber-700">
          Admin session reached the 12-hour limit. Enter a new authenticator code.
        </p>
      ) : null}
      {mode === "enroll" ? (
        <>
          <p className="text-sm text-slate-600">
            Scan this QR code in your authenticator app, then enter the 6-digit code.
            Admin access requires TOTP. Phone SMS is not used.
          </p>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qr}
              alt="Authenticator QR code"
              className="mx-auto h-48 w-48 rounded-lg border bg-white p-2"
            />
          ) : null}
          {secret ? (
            <p className="break-all text-center text-xs text-slate-500">
              Manual key: {secret}
            </p>
          ) : null}
        </>
      ) : null}
      {mode === "challenge" ? (
        <p className="text-sm text-slate-600">
          Enter the 6-digit code from your authenticator app.
        </p>
      ) : null}
      {mode !== "loading" ? (
        <Input
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={8}
          required
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value.trim())}
        />
      ) : (
        <p className="text-sm text-slate-500">Checking authenticator…</p>
      )}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        type="submit"
        disabled={busy || mode === "loading" || code.length < 6}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-800"
      >
        {busy ? "Verifying…" : "Continue"}
      </Button>
    </form>
  );
}
