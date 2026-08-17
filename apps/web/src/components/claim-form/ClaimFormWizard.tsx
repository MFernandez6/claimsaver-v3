"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  WORKSHEET_STEPS,
  emptyWorksheet,
  normalizeAccidentDate,
  type ClaimDetail,
  type FloridaNoFaultFormData,
  type Me,
} from "@claimsaver/shared";
import { ApiClientError } from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { webApi } from "@/lib/api/client";
import { useSupabaseUser } from "@/components/auth/use-supabase-user";
import { NotFilingYet } from "@/components/not-filing-yet";
import { PipDeadlineBanner } from "@/components/pip-deadline-banner";
import { SceneCapture } from "@/components/scene-capture";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function ClaimFormWizard() {
  const { t } = useTranslation();
  const { isLoaded, isSignedIn } = useSupabaseUser();
  const [me, setMe] = useState<Me | null>(null);
  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const [form, setForm] = useState<FloridaNoFaultFormData>(emptyWorksheet);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);
  const [savedComplete, setSavedComplete] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const claimId = claim?.id;

  const patch = useCallback(
    async (partial: Partial<FloridaNoFaultFormData>, worksheetStep?: number) => {
      if (!claimId) return;
      setStatus("saving");
      try {
        const updated = await webApi.patch<ClaimDetail>(`/api/v1/claims/${claimId}`, {
          worksheet: partial,
          worksheetStep: worksheetStep ?? step,
        });
        setClaim(updated);
        setStatus("saved");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : t("claimForm.saveFailed"));
      }
    },
    [claimId, step, t],
  );

  function setMany(partial: Partial<FloridaNoFaultFormData>) {
    setForm((prev) => {
      const next = { ...prev, ...partial };
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void patch(partial);
      }, 700);
      return next;
    });
  }

  function set<K extends keyof FloridaNoFaultFormData>(key: K, value: FloridaNoFaultFormData[K]) {
    setMany({ [key]: value } as Partial<FloridaNoFaultFormData>);
  }

  const accidentDate = normalizeAccidentDate(form);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let cancelled = false;
    (async () => {
      try {
        const profile = await webApi.get<Me>("/api/v1/me");
        if (cancelled) return;
        setMe(profile);
        const list = await webApi.get<ClaimDetail[]>("/api/v1/claims");
        if (cancelled) return;
        if (list[0]) {
          const detail = await webApi.get<ClaimDetail>(`/api/v1/claims/${list[0].id}`);
          setClaim(detail);
          setForm(detail.worksheet);
          setStep(detail.worksheetStep || 1);
        } else {
          const created = await webApi.post<ClaimDetail>("/api/v1/claims", {});
          setClaim(created);
          setForm(created.worksheet);
        }
      } catch (e) {
        if (e instanceof ApiClientError && e.status === 402) {
          setPaywall(true);
          return;
        }
        setError(e instanceof Error ? e.message : t("claimForm.loadFailed"));
      }
    })();
    return () => {
      cancelled = true;
    };
    // `t` is only used for a fallback error string; do not refetch on language change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  const completeness = useMemo(() => {
    const required = [
      form.claimantName,
      form.claimantEmail,
      form.dateOfAccident || form.accidentDate,
    ];
    return required.filter(Boolean).length;
  }, [form]);

  const stepTitle = (key: (typeof WORKSHEET_STEPS)[number]["key"]) =>
    t(`claimForm.worksheetSteps.${key}`);

  if (!isLoaded) return <p className="p-8 text-slate-500">{t("common.loading")}</p>;
  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{t("claimForm.signInTitle")}</h1>
        <Button asChild className="mt-6"><Link href="/login?next=/claim-form">{t("auth.signInTitle")}</Link></Button>
      </div>
    );
  }
  if (paywall) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{t("claimForm.paywallTitle")}</h1>
        <p className="mt-3 text-slate-600">
          {t("claimForm.paywallBody")}
        </p>
        <Button asChild className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-800">
          <Link href="/pricing">{t("common.goToCheckout")}</Link>
        </Button>
      </div>
    );
  }

  const current = WORKSHEET_STEPS[step - 1];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{t("claimForm.header.title")}</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">{t("claimForm.guidedTitle")}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {t("claimForm.guidedIntro")}
      </p>
      <div className="mt-4">
        <NotFilingYet />
      </div>
      {accidentDate ? (
        <div className="mt-4">
          <PipDeadlineBanner accidentDate={accidentDate} />
        </div>
      ) : null}
      <div className="mt-4">
        <SceneCapture compact />
      </div>
      {claim ? (
        <p className="mt-2 text-xs text-slate-400">
          {t("claimForm.record", { number: claim.claimNumber })}
          {status === "saving" ? ` · ${t("claimForm.saving")}` : status === "saved" ? ` · ${t("claimForm.saved")}` : ""}
        </p>
      ) : null}

      <div className="mt-6 flex gap-1">
        {WORKSHEET_STEPS.map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => setStep(s.step)}
            className={`h-2 flex-1 rounded-full ${s.step <= step ? "bg-teal-600" : "bg-slate-200"}`}
            aria-label={stepTitle(s.key)}
          />
        ))}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-700">
        {t("claimForm.stepOf", { step, title: current ? stepTitle(current.key) : "" })}
      </p>

      <Card className="mt-6">
        <CardContent className="space-y-4 pt-6">
          {step === 1 && (
            <>
              <p className="text-sm text-slate-600">{t("claimForm.methodPrompt")}</p>
              <label className="flex gap-3 rounded-lg border p-3">
                <input type="radio" checked={form.completionMethod === "digital_worksheet"} onChange={() => set("completionMethod", "digital_worksheet")} />
                <span className="text-sm">{t("claimForm.methodDigital")}</span>
              </label>
              <label className="flex gap-3 rounded-lg border p-3">
                <input type="radio" checked={form.completionMethod === "paper_hand"} onChange={() => set("completionMethod", "paper_hand")} />
                <span className="text-sm">{t("claimForm.methodPaper")}</span>
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">{t("claimForm.fraudNotice")}</p>
              <Field label={t("claimForm.fields.signatureDate")}><Input type="date" value={form.signatureDate} onChange={(e) => set("signatureDate", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.policyHolder")}><Input value={form.policyHolder} onChange={(e) => set("policyHolder", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.dateOfAccident")}><Input type="date" value={form.dateOfAccident} onChange={(e) => setMany({ dateOfAccident: e.target.value, accidentDate: e.target.value })} /></Field>
              <Field label={t("claimForm.fields.fileNumber")}><Input value={form.fileNumber} onChange={(e) => set("fileNumber", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.insuranceCompany")}><Input value={form.insuranceCompany} onChange={(e) => set("insuranceCompany", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.policyNumber")}><Input value={form.policyNumber} onChange={(e) => set("policyNumber", e.target.value)} /></Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label={t("claimForm.fields.fullName")}><Input value={form.claimantName} onChange={(e) => set("claimantName", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.email")}><Input type="email" value={form.claimantEmail} onChange={(e) => set("claimantEmail", e.target.value)} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("claimForm.fields.homePhone")}><Input value={form.claimantPhoneHome} onChange={(e) => set("claimantPhoneHome", e.target.value)} /></Field>
                <Field label={t("claimForm.fields.businessPhone")}><Input value={form.claimantPhoneBusiness} onChange={(e) => set("claimantPhoneBusiness", e.target.value)} /></Field>
              </div>
              <Field label={t("claimForm.fields.address")}><Textarea value={form.claimantAddress} onChange={(e) => set("claimantAddress", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.dob")}><Input type="date" value={form.claimantDOB} onChange={(e) => set("claimantDOB", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.ssn")}>
                <Input type="password" autoComplete="off" value={form.claimantSSN} onChange={(e) => set("claimantSSN", e.target.value)} />
              </Field>
              <Field label={t("claimForm.fields.floridaResidency")}><Input value={form.floridaResidencyDuration} onChange={(e) => set("floridaResidencyDuration", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.permanentAddress")}><Textarea value={form.permanentAddress} onChange={(e) => set("permanentAddress", e.target.value)} /></Field>
              <div className="grid gap-3 sm:grid-cols-4">
                <Field label={t("claimForm.fields.vehicleYear")}><Input value={form.vehicleYear} onChange={(e) => set("vehicleYear", e.target.value)} /></Field>
                <Field label={t("claimForm.fields.make")}><Input value={form.vehicleMake} onChange={(e) => set("vehicleMake", e.target.value)} /></Field>
                <Field label={t("claimForm.fields.model")}><Input value={form.vehicleModel} onChange={(e) => set("vehicleModel", e.target.value)} /></Field>
                <Field label={t("claimForm.fields.plate")}><Input value={form.licensePlate} onChange={(e) => set("licensePlate", e.target.value)} /></Field>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <Field label={t("claimForm.fields.accidentDateTime")}><Input type="datetime-local" value={form.accidentDateTime} onChange={(e) => {
                const value = e.target.value;
                const day = value.slice(0, 10);
                setMany({
                  accidentDateTime: value,
                  ...(day ? { dateOfAccident: day, accidentDate: day } : {}),
                });
              }} /></Field>
              <Field label={t("claimForm.fields.place")}><Input value={form.accidentPlace} onChange={(e) => { set("accidentPlace", e.target.value); set("accidentLocation", e.target.value); }} /></Field>
              <Field label={t("claimForm.fields.briefDescription")}><Textarea value={form.accidentDescription} onChange={(e) => set("accidentDescription", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.yourVehicle")}><Input value={form.yourVehicle} onChange={(e) => set("yourVehicle", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.familyVehicle")}><Input value={form.familyVehicle} onChange={(e) => set("familyVehicle", e.target.value)} /></Field>
            </>
          )}

          {step === 5 && (
            <>
              <Check label={t("claimForm.fields.injured")} checked={form.injured} onChange={(v) => set("injured", v)} />
              {!form.injured ? (
                <p className="text-sm text-slate-500">{t("claimForm.notInjuredNote")}</p>
              ) : null}
              <Field label={t("claimForm.fields.injuryDescription")}><Textarea value={form.injuryDescription} onChange={(e) => set("injuryDescription", e.target.value)} /></Field>
              <Check label={t("claimForm.fields.treatedByDoctor")} checked={form.treatedByDoctor} onChange={(v) => set("treatedByDoctor", v)} />
              <Field label={t("claimForm.fields.doctorName")}><Input value={form.doctorName} onChange={(e) => set("doctorName", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.doctorAddress")}><Input value={form.doctorAddress} onChange={(e) => set("doctorAddress", e.target.value)} /></Field>
              <Check label={t("claimForm.fields.hospitalInpatient")} checked={form.hospitalInpatient} onChange={(v) => set("hospitalInpatient", v)} />
              <Check label={t("claimForm.fields.hospitalOutpatient")} checked={form.hospitalOutpatient} onChange={(v) => set("hospitalOutpatient", v)} />
              <Field label={t("claimForm.fields.hospitalName")}><Input value={form.hospitalName} onChange={(e) => set("hospitalName", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.hospitalAddress")}><Input value={form.hospitalAddress} onChange={(e) => set("hospitalAddress", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.medicalBills")}><Input value={form.medicalBillsToDate} onChange={(e) => set("medicalBillsToDate", e.target.value)} /></Field>
              <Check label={t("claimForm.fields.moreMedical")} checked={form.moreMedicalExpense} onChange={(v) => set("moreMedicalExpense", v)} />
            </>
          )}

          {step === 6 && (
            <>
              <Check label={t("claimForm.fields.courseOfEmployment")} checked={form.inCourseOfEmployment} onChange={(v) => set("inCourseOfEmployment", v)} />
              <Check label={t("claimForm.fields.lostWages")} checked={form.lostWages} onChange={(v) => set("lostWages", v)} />
              <Field label={t("claimForm.fields.wageLossToDate")}><Input value={form.wageLossToDate} onChange={(e) => set("wageLossToDate", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.averageWeeklyWage")}><Input value={form.averageWeeklyWage} onChange={(e) => set("averageWeeklyWage", e.target.value)} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("claimForm.fields.disabilityStart")}><Input type="date" value={form.disabilityStart} onChange={(e) => set("disabilityStart", e.target.value)} /></Field>
                <Field label={t("claimForm.fields.disabilityEnd")}><Input type="date" value={form.disabilityEnd} onChange={(e) => set("disabilityEnd", e.target.value)} /></Field>
              </div>
              <Check label={t("claimForm.fields.workersComp")} checked={form.workersComp} onChange={(v) => set("workersComp", v)} />
              <Field label={t("claimForm.fields.workersCompAmount")}><Input value={form.workersCompAmount} onChange={(e) => set("workersCompAmount", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.otherExpenses")}><Textarea value={form.otherExpenses} onChange={(e) => set("otherExpenses", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.employersList")}><Textarea value={form.employersList} onChange={(e) => set("employersList", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.medicalInsurance")}><Input value={form.medicalInsurance} onChange={(e) => set("medicalInsurance", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.memberId")}><Input value={form.medicalMemberId} onChange={(e) => set("medicalMemberId", e.target.value)} /></Field>
            </>
          )}

          {step === 7 && (
            <>
              <p className="text-sm text-slate-600">{t("claimForm.authIntro")}</p>
              <h3 className="font-semibold">{t("claimForm.authInsuranceHeading")}</h3>
              <Field label={t("claimForm.fields.insuredName")}><Input value={form.insuranceAuthInsuredName} onChange={(e) => set("insuranceAuthInsuredName", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.policyNumber")}><Input value={form.insuranceAuthPolicyNumber} onChange={(e) => set("insuranceAuthPolicyNumber", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.insuranceCompany")}><Input value={form.insuranceAuthInsuranceCompany} onChange={(e) => set("insuranceAuthInsuranceCompany", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.disclosureType")}><Input value={form.insuranceAuthDisclosureType} onChange={(e) => set("insuranceAuthDisclosureType", e.target.value)} placeholder={t("claimForm.fields.disclosureTypeHint")} /></Field>
              <Field label={t("claimForm.fields.recipientOrg")}><Input value={form.insuranceAuthRecipientName} onChange={(e) => set("insuranceAuthRecipientName", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.recipientAddress")}><Input value={form.insuranceAuthRecipientAddress} onChange={(e) => set("insuranceAuthRecipientAddress", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.reason")}><Input value={form.insuranceAuthReasonForDisclosure} onChange={(e) => set("insuranceAuthReasonForDisclosure", e.target.value)} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("claimForm.fields.authStart")}><Input type="date" value={form.insuranceAuthStartDate} onChange={(e) => set("insuranceAuthStartDate", e.target.value)} /></Field>
                <Field label={t("claimForm.fields.authEnd")}><Input type="date" value={form.insuranceAuthEndDate} onChange={(e) => set("insuranceAuthEndDate", e.target.value)} /></Field>
              </div>
              <Field label={t("claimForm.fields.signature")}><Input value={form.insuranceAuthSignature} onChange={(e) => set("insuranceAuthSignature", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.signatureDate")}><Input type="date" value={form.insuranceAuthSignatureDate} onChange={(e) => set("insuranceAuthSignatureDate", e.target.value)} /></Field>
              <h3 className="pt-4 font-semibold">{t("claimForm.authHipaaHeading")}</h3>
              <Field label={t("claimForm.fields.patientName")}><Input value={form.hipaaPatientName} onChange={(e) => set("hipaaPatientName", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.healthcareProvider")}><Input value={form.hipaaHealthcareProvider} onChange={(e) => set("hipaaHealthcareProvider", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.disclosureType")}><Input value={form.hipaaDisclosureType} onChange={(e) => set("hipaaDisclosureType", e.target.value)} placeholder={t("claimForm.fields.disclosureTypeHint")} /></Field>
              <Field label={t("claimForm.fields.recipient")}><Input value={form.hipaaRecipientName} onChange={(e) => set("hipaaRecipientName", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.recipientAddress")}><Input value={form.hipaaRecipientAddress} onChange={(e) => set("hipaaRecipientAddress", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.reason")}><Input value={form.hipaaReasonForDisclosure} onChange={(e) => set("hipaaReasonForDisclosure", e.target.value)} /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("claimForm.fields.authStart")}><Input type="date" value={form.hipaaStartDate} onChange={(e) => set("hipaaStartDate", e.target.value)} /></Field>
                <Field label={t("claimForm.fields.authEnd")}><Input type="date" value={form.hipaaEndDate} onChange={(e) => set("hipaaEndDate", e.target.value)} /></Field>
              </div>
              <Field label={t("claimForm.fields.signature")}><Input value={form.hipaaSignature} onChange={(e) => set("hipaaSignature", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.signatureDate")}><Input type="date" value={form.hipaaSignatureDate} onChange={(e) => set("hipaaSignatureDate", e.target.value)} /></Field>
              <h3 className="pt-4 font-semibold">{t("claimForm.authPipHeading")}</h3>
              <Field label={t("claimForm.fields.patientName")}><Input value={form.pipPatientName} onChange={(e) => set("pipPatientName", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.signature")}><Input value={form.pipPatientSignature} onChange={(e) => set("pipPatientSignature", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.signatureDate")}><Input type="date" value={form.pipPatientDate} onChange={(e) => set("pipPatientDate", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.providerName")}><Input value={form.pipProviderName} onChange={(e) => set("pipProviderName", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.providerSignature")}><Input value={form.pipProviderSignature} onChange={(e) => set("pipProviderSignature", e.target.value)} /></Field>
              <Field label={t("claimForm.fields.providerDate")}><Input type="date" value={form.pipProviderDate} onChange={(e) => set("pipProviderDate", e.target.value)} /></Field>
            </>
          )}

          {step === 8 && (
            <>
              {savedComplete ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">{t("claimForm.success.title")}</h3>
                  <p className="text-sm text-slate-600">{t("claimForm.success.description")}</p>
                  {accidentDate ? <p className="text-sm text-slate-600">{t("deadlines.savedWithChain")}</p> : null}
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-800">
                      <Link href="/dashboard">{t("claimForm.success.goToDashboard")}</Link>
                    </Button>
                    <Button type="button" variant="outline" onClick={() => window.print()}>
                      {t("claimForm.printSummary")}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-600">{t("claimForm.reviewIntro")}</p>
                  <dl className="grid gap-2 text-sm print:grid-cols-1">
                    <div><dt className="text-slate-500">{t("claimForm.fields.name")}</dt><dd>{form.claimantName || "—"}</dd></div>
                    <div><dt className="text-slate-500">{t("claimForm.fields.email")}</dt><dd>{form.claimantEmail || "—"}</dd></div>
                    <div><dt className="text-slate-500">{t("claimForm.fields.accident")}</dt><dd>{accidentDate || "—"} · {form.accidentPlace || form.accidentLocation || "—"}</dd></div>
                    <div><dt className="text-slate-500">{t("claimForm.fields.briefDescription")}</dt><dd>{form.accidentDescription || "—"}</dd></div>
                    <div><dt className="text-slate-500">{t("claimForm.fields.insurer")}</dt><dd>{form.insuranceCompany || "—"} · {form.policyNumber || "—"}</dd></div>
                    <div><dt className="text-slate-500">{t("claimForm.fields.injuryDescription")}</dt><dd>{form.injuryDescription || "—"}</dd></div>
                    <div><dt className="text-slate-500">{t("claimForm.fieldsStarted")}</dt><dd>{t("claimForm.identityChecks", { count: completeness })}</dd></div>
                  </dl>
                  <Field label={t("claimForm.fields.signature")}><Input value={form.signature} onChange={(e) => set("signature", e.target.value)} /></Field>
                  <p className="text-xs text-slate-500">{t("claimForm.fraudNotice")}</p>
                  <p className="text-xs text-slate-400">{t("claimForm.helloFiler", { name: me?.firstName || t("dashboard.there") })}</p>
                </>
              )}
            </>
          )}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {savedComplete && step === 8 ? null : (
          <div className="flex justify-between pt-4 print:hidden">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>{t("common.back")}</Button>
            {step < 8 ? (
              <Button
                className="bg-gradient-to-r from-emerald-600 to-teal-800"
                onClick={() => {
                  if (timer.current) clearTimeout(timer.current);
                  const next = step + 1;
                  setStep(next);
                  void patch(form, next);
                }}
              >
                {t("common.next")}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => window.print()}>
                  {t("claimForm.printSummary")}
                </Button>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-800"
                  onClick={async () => {
                    if (timer.current) clearTimeout(timer.current);
                    await patch(form, 8);
                    setSavedComplete(true);
                  }}
                >
                  {t("claimForm.saveToAccount")}
                </Button>
              </div>
            )}
          </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/dashboard" className="text-teal-800 underline">{t("navigation.dashboard")}</Link>
        <Link href="/when-to-call-an-attorney" className="text-slate-500 underline">{t("navigation.needProfessionalHelp")}</Link>
      </div>
    </div>
  );
}
