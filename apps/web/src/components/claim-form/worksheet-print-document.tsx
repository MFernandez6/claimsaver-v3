"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { isDrawnSignature, type FloridaNoFaultFormData } from "@claimsaver/shared";
import { BrandLogo } from "@/components/brand-logo";

function dash(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function SignatureValue({ value }: { value: string }) {
  if (isDrawnSignature(value)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={value} alt="" className="mt-1 h-16 max-w-xs border border-slate-200 bg-white object-contain" />
    );
  }
  return <span className="block whitespace-pre-wrap">{dash(value)}</span>;
}

function Row({
  label,
  value,
  signature,
}: {
  label: string;
  value?: string;
  signature?: string;
}) {
  return (
    <div className="grid gap-1 border-b border-slate-200 py-2 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-900">
        {signature !== undefined ? <SignatureValue value={signature} /> : <span className="whitespace-pre-wrap">{dash(value)}</span>}
      </dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="worksheet-print-section mt-6 break-inside-avoid">
      <h2 className="border-b-2 border-teal-800 pb-1 text-base font-semibold text-slate-900">{title}</h2>
      <dl>{children}</dl>
    </section>
  );
}

export function WorksheetPrintDocument({
  form,
  claimNumber,
}: {
  form: FloridaNoFaultFormData;
  claimNumber?: string;
}) {
  const { t } = useTranslation();
  const yn = (value: boolean) => (value ? t("common.yes") : t("common.no"));
  const yesNoBlank = (value: "" | "yes" | "no") =>
    value === "yes" ? t("common.yes") : value === "no" ? t("common.no") : "—";
  const method =
    form.completionMethod === "digital_worksheet"
      ? t("claimForm.methodDigital")
      : form.completionMethod === "paper_hand"
        ? t("claimForm.methodPaper")
        : "—";

  return (
    <article id="worksheet-print" className="worksheet-print-document bg-white text-slate-900">
      <header className="border-b-2 border-slate-900 pb-3">
        <BrandLogo variant="print" className="mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{t("claimForm.header.title")}</p>
        <h1 className="mt-1 text-2xl font-bold">{t("claimForm.printDocumentTitle")}</h1>
        {claimNumber ? (
          <p className="mt-1 text-sm text-slate-600">{t("claimForm.printClaimNumber", { number: claimNumber })}</p>
        ) : null}
        <p className="mt-2 text-xs text-slate-500">{t("claimForm.printDisclaimer")}</p>
      </header>

      <Section title={t("claimForm.worksheetSteps.method")}>
        <Row label={t("claimForm.fields.completionMethod")} value={method} />
      </Section>

      <Section title={t("claimForm.worksheetSteps.header")}>
        <Row label={t("claimForm.fields.signatureDate")} value={form.signatureDate} />
        <Row label={t("claimForm.fields.policyHolder")} value={form.policyHolder} />
        <Row label={t("claimForm.fields.dateOfAccident")} value={form.dateOfAccident || form.accidentDate} />
        <Row label={t("claimForm.fields.fileNumber")} value={form.fileNumber} />
        <Row label={t("claimForm.fields.insuranceCompany")} value={form.insuranceCompany} />
        <Row label={t("claimForm.fields.policyNumber")} value={form.policyNumber} />
      </Section>

      <Section title={t("claimForm.worksheetSteps.identity")}>
        <Row label={t("claimForm.fields.fullName")} value={form.claimantName} />
        <Row label={t("claimForm.fields.email")} value={form.claimantEmail} />
        <Row label={t("claimForm.fields.homePhone")} value={form.claimantPhoneHome || form.claimantPhone} />
        <Row label={t("claimForm.fields.businessPhone")} value={form.claimantPhoneBusiness} />
        <Row label={t("claimForm.fields.address")} value={form.claimantAddress} />
        <Row label={t("claimForm.fields.dob")} value={form.claimantDOB} />
        <Row label={t("claimForm.fields.floridaResidency")} value={form.floridaResidencyDuration} />
        <Row label={t("claimForm.fields.permanentAddress")} value={form.permanentAddress} />
        <Row label={t("claimForm.fields.vehicleYear")} value={form.vehicleYear} />
        <Row label={t("claimForm.fields.make")} value={form.vehicleMake} />
        <Row label={t("claimForm.fields.model")} value={form.vehicleModel} />
        <Row label={t("claimForm.fields.plate")} value={form.licensePlate} />
      </Section>

      <Section title={t("claimForm.worksheetSteps.accident")}>
        <Row label={t("claimForm.fields.accidentDateTime")} value={form.accidentDateTime} />
        <Row label={t("claimForm.fields.place")} value={form.accidentPlace || form.accidentLocation} />
        <Row label={t("claimForm.fields.briefDescription")} value={form.accidentDescription} />
        <Row label={t("claimForm.fields.yourVehicle")} value={form.yourVehicle} />
        <Row label={t("claimForm.fields.familyVehicle")} value={form.familyVehicle} />
      </Section>

      <Section title={t("claimForm.worksheetSteps.injury")}>
        <Row label={t("claimForm.fields.injured")} value={yesNoBlank(form.injuryResponse) === "—" ? yn(form.injured) : yesNoBlank(form.injuryResponse)} />
        <Row label={t("claimForm.fields.injuryDescription")} value={form.injuryDescription} />
        <Row label={t("claimForm.fields.treatedByDoctor")} value={yn(form.treatedByDoctor)} />
        <Row label={t("claimForm.fields.doctorName")} value={form.doctorName} />
        <Row label={t("claimForm.fields.doctorAddress")} value={form.doctorAddress} />
        <Row label={t("claimForm.fields.hospitalInpatient")} value={yn(form.hospitalInpatient)} />
        <Row label={t("claimForm.fields.hospitalOutpatient")} value={yn(form.hospitalOutpatient)} />
        <Row label={t("claimForm.fields.hospitalName")} value={form.hospitalName} />
        <Row label={t("claimForm.fields.hospitalAddress")} value={form.hospitalAddress} />
        <Row label={t("claimForm.fields.medicalBills")} value={form.medicalBillsToDate} />
        <Row label={t("claimForm.fields.moreMedical")} value={yn(form.moreMedicalExpense)} />
      </Section>

      <Section title={t("claimForm.worksheetSteps.wages")}>
        <Row label={t("claimForm.fields.courseOfEmployment")} value={yn(form.inCourseOfEmployment)} />
        <Row label={t("claimForm.fields.lostWages")} value={yesNoBlank(form.wageLossResponse) === "—" ? yn(form.lostWages) : yesNoBlank(form.wageLossResponse)} />
        <Row label={t("claimForm.fields.wageLossToDate")} value={form.wageLossToDate} />
        <Row label={t("claimForm.fields.averageWeeklyWage")} value={form.averageWeeklyWage} />
        <Row label={t("claimForm.fields.disabilityStart")} value={form.disabilityStart} />
        <Row label={t("claimForm.fields.disabilityEnd")} value={form.disabilityEnd} />
        <Row label={t("claimForm.fields.workersComp")} value={yn(form.workersComp)} />
        <Row label={t("claimForm.fields.workersCompAmount")} value={form.workersCompAmount} />
        <Row label={t("claimForm.fields.employersList")} value={form.employersList} />
        <Row label={t("claimForm.fields.otherExpenses")} value={form.otherExpenses} />
        <Row label={t("claimForm.fields.medicalInsurance")} value={form.medicalInsurance} />
        <Row label={t("claimForm.fields.memberId")} value={form.medicalMemberId} />
      </Section>

      <Section title={t("claimForm.authInsuranceHeading")}>
        <Row label={t("claimForm.fields.insuredName")} value={form.insuranceAuthInsuredName} />
        <Row label={t("claimForm.fields.policyNumber")} value={form.insuranceAuthPolicyNumber} />
        <Row label={t("claimForm.fields.insuranceCompany")} value={form.insuranceAuthInsuranceCompany} />
        <Row label={t("claimForm.fields.disclosureType")} value={form.insuranceAuthDisclosureType} />
        <Row label={t("claimForm.fields.recipientOrg")} value={form.insuranceAuthRecipientName} />
        <Row label={t("claimForm.fields.recipientAddress")} value={form.insuranceAuthRecipientAddress} />
        <Row label={t("claimForm.fields.reason")} value={form.insuranceAuthReasonForDisclosure} />
        <Row label={t("claimForm.fields.authStart")} value={form.insuranceAuthStartDate} />
        <Row label={t("claimForm.fields.authEnd")} value={form.insuranceAuthEndDate} />
        <Row label={t("claimForm.fields.signature")} signature={form.insuranceAuthSignature} />
        <Row label={t("claimForm.fields.signatureDate")} value={form.insuranceAuthSignatureDate} />
      </Section>

      <Section title={t("claimForm.authHipaaHeading")}>
        <Row label={t("claimForm.fields.patientName")} value={form.hipaaPatientName} />
        <Row label={t("claimForm.fields.healthcareProvider")} value={form.hipaaHealthcareProvider} />
        <Row label={t("claimForm.fields.disclosureType")} value={form.hipaaDisclosureType} />
        <Row label={t("claimForm.fields.recipient")} value={form.hipaaRecipientName} />
        <Row label={t("claimForm.fields.recipientAddress")} value={form.hipaaRecipientAddress} />
        <Row label={t("claimForm.fields.reason")} value={form.hipaaReasonForDisclosure} />
        <Row label={t("claimForm.fields.authStart")} value={form.hipaaStartDate} />
        <Row label={t("claimForm.fields.authEnd")} value={form.hipaaEndDate} />
        <Row label={t("claimForm.fields.signature")} signature={form.hipaaSignature} />
        <Row label={t("claimForm.fields.signatureDate")} value={form.hipaaSignatureDate} />
      </Section>

      <Section title={t("claimForm.authPipHeading")}>
        <Row label={t("claimForm.fields.patientName")} value={form.pipPatientName} />
        <Row label={t("claimForm.fields.signature")} signature={form.pipPatientSignature} />
        <Row label={t("claimForm.fields.signatureDate")} value={form.pipPatientDate} />
        <Row label={t("claimForm.fields.providerName")} value={form.pipProviderName} />
        <Row label={t("claimForm.fields.providerSignature")} signature={form.pipProviderSignature} />
        <Row label={t("claimForm.fields.providerDate")} value={form.pipProviderDate} />
      </Section>

      <Section title={t("claimForm.worksheetSteps.review")}>
        <Row label={t("claimForm.fields.signature")} signature={form.signature} />
        <Row label={t("claimForm.fields.signatureDate")} value={form.signatureDate} />
      </Section>

      <p className="mt-6 text-xs text-slate-500">{t("claimForm.fraudNotice")}</p>
    </article>
  );
}
