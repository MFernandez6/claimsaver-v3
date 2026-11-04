"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { submitLead14Days } from "@/app/14days/actions";
import type { SubmitLeadState } from "@/lib/14days/types";
import { ATTR_COOKIE, type DaysCopy, type DaysLocale } from "@/content/14days";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function readAttrCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${ATTR_COOKIE}=`));
  if (!match) return "";
  return decodeURIComponent(match.slice(ATTR_COOKIE.length + 1));
}

export function LeadForm({ copy, locale }: { copy: DaysCopy; locale: DaysLocale }) {
  const [state, action, pending] = useActionState(submitLead14Days, null as SubmitLeadState);
  const [phone, setPhone] = useState("");
  const [attr, setAttr] = useState("");
  const errorId = useId();
  const showSms = phone.trim().length > 0;

  useEffect(() => {
    setAttr(readAttrCookie());
  }, []);

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="landingPath" value={copy.path} />
      <input type="hidden" name="attr" value={attr} />
      <div className="hidden" aria-hidden="true">
        <label>
          {copy.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state?.error ? (
        <p id={errorId} role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.fields ? Object.values(state.fields)[0] : state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="lead-first-name" className="mb-1 block text-sm font-medium text-slate-800">
          {copy.firstName}
        </label>
        <Input
          id="lead-first-name"
          name="firstName"
          autoComplete="given-name"
          required
          maxLength={80}
          aria-invalid={Boolean(state?.fields?.firstName)}
          aria-describedby={state?.error ? errorId : undefined}
          className="h-12 bg-white text-base"
        />
      </div>

      <div>
        <label htmlFor="lead-email" className="mb-1 block text-sm font-medium text-slate-800">
          {copy.email}
        </label>
        <Input
          id="lead-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          aria-invalid={Boolean(state?.fields?.email)}
          aria-describedby={state?.error ? errorId : undefined}
          className="h-12 bg-white text-base"
        />
      </div>

      <div>
        <label htmlFor="lead-phone" className="mb-1 block text-sm font-medium text-slate-800">
          {copy.phone}
        </label>
        <Input
          id="lead-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={Boolean(state?.fields?.phone)}
          className="h-12 bg-white text-base"
        />
      </div>

      <div>
        <label htmlFor="lead-locale" className="mb-1 block text-sm font-medium text-slate-800">
          {copy.language}
        </label>
        <select
          id="lead-locale"
          name="locale"
          defaultValue={locale}
          className="border-input h-12 w-full rounded-md border bg-white px-3 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          <option value="en">{copy.languageEn}</option>
          <option value="es">{copy.languageEs}</option>
        </select>
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
        <input
          type="checkbox"
          name="ackSelfHelp"
          value="true"
          required
          className="mt-1 size-4 shrink-0 accent-teal-700"
        />
        <span>{copy.ackLabel}</span>
      </label>

      {showSms ? (
        <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
          <input
            type="checkbox"
            name="smsConsent"
            value="true"
            required
            className="mt-1 size-4 shrink-0 accent-teal-700"
          />
          <span>{copy.smsLabel}</span>
        </label>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-800 text-base font-semibold"
      >
        {pending ? copy.submitting : copy.submit}
      </Button>
    </form>
  );
}
