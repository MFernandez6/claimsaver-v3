import { TOTAL_WORKSHEET_STEPS, WORKSHEET_STEPS } from "./worksheet";
import type { FloridaNoFaultFormData } from "../schemas/claim";

function filled(value: unknown) {
  if (typeof value === "string") return value.trim().length > 0;
  return Boolean(value);
}

/** i18n keys under `claimForm.missing.*` */
export function missingFieldsForStep(step: number, form: FloridaNoFaultFormData): string[] {
  const missing: string[] = [];
  const need = (key: string, ok: boolean) => {
    if (!ok) missing.push(key);
  };

  switch (step) {
    case 1:
      need("completionMethod", filled(form.completionMethod));
      break;
    case 2:
      need("signatureDate", filled(form.signatureDate));
      need("policyHolder", filled(form.policyHolder));
      need("dateOfAccident", filled(form.dateOfAccident || form.accidentDate));
      need("insuranceCompany", filled(form.insuranceCompany));
      need("policyNumber", filled(form.policyNumber));
      break;
    case 3:
      need("fullName", filled(form.claimantName));
      need("email", filled(form.claimantEmail));
      need("homePhone", filled(form.claimantPhoneHome || form.claimantPhone));
      need("address", filled(form.claimantAddress));
      need("dob", filled(form.claimantDOB));
      need("floridaResidency", filled(form.floridaResidencyDuration));
      need("vehicleYear", filled(form.vehicleYear));
      need("make", filled(form.vehicleMake));
      need("model", filled(form.vehicleModel));
      break;
    case 4:
      need("accidentDateTime", filled(form.accidentDateTime || form.dateOfAccident || form.accidentDate));
      need("place", filled(form.accidentPlace || form.accidentLocation));
      need("briefDescription", filled(form.accidentDescription));
      need("yourVehicle", filled(form.yourVehicle));
      break;
    case 5:
      need("injured", form.injuryResponse === "yes" || form.injuryResponse === "no");
      if (form.injuryResponse === "yes") {
        need("injuryDescription", filled(form.injuryDescription));
      }
      if (form.treatedByDoctor) {
        need("doctorName", filled(form.doctorName));
      }
      if (form.hospitalInpatient || form.hospitalOutpatient) {
        need("hospitalName", filled(form.hospitalName));
      }
      break;
    case 6:
      need("lostWages", form.wageLossResponse === "yes" || form.wageLossResponse === "no");
      if (form.wageLossResponse === "yes") {
        need("wageLossToDate", filled(form.wageLossToDate));
        need("averageWeeklyWage", filled(form.averageWeeklyWage));
        need("employersList", filled(form.employersList));
      }
      break;
    case 7:
      need("insuredName", filled(form.insuranceAuthInsuredName));
      need("authPolicyNumber", filled(form.insuranceAuthPolicyNumber || form.policyNumber));
      need("authInsurer", filled(form.insuranceAuthInsuranceCompany || form.insuranceCompany));
      need("recipientOrg", filled(form.insuranceAuthRecipientName));
      need("reason", filled(form.insuranceAuthReasonForDisclosure));
      need("insuranceAuthSignature", filled(form.insuranceAuthSignature));
      need("insuranceAuthSignatureDate", filled(form.insuranceAuthSignatureDate));
      break;
    case 8:
      need("patientName", filled(form.hipaaPatientName));
      need("healthcareProvider", filled(form.hipaaHealthcareProvider));
      need("recipient", filled(form.hipaaRecipientName));
      need("hipaaSignature", filled(form.hipaaSignature));
      need("hipaaSignatureDate", filled(form.hipaaSignatureDate));
      break;
    case 9:
      need("pipPatientName", filled(form.pipPatientName));
      need("pipPatientSignature", filled(form.pipPatientSignature));
      need("pipPatientDate", filled(form.pipPatientDate));
      break;
    case 10:
      need("reviewSignature", filled(form.signature));
      break;
    default:
      break;
  }

  return missing;
}

export function isStepComplete(step: number, form: FloridaNoFaultFormData) {
  return missingFieldsForStep(step, form).length === 0;
}

/** Highest step the user may open (completed prefix + current). */
export function highestReachableStep(form: FloridaNoFaultFormData) {
  let reachable = 1;
  for (let step = 1; step < TOTAL_WORKSHEET_STEPS; step += 1) {
    if (!isStepComplete(step, form)) break;
    reachable = step + 1;
  }
  return reachable;
}

export function completedStepCount(form: FloridaNoFaultFormData) {
  return WORKSHEET_STEP_NUMBERS.filter((step) => isStepComplete(step, form)).length;
}

const WORKSHEET_STEP_NUMBERS = WORKSHEET_STEPS.map((s) => s.step);

/**
 * Combined authorizations used to be step 7, with review at step 8.
 * If a saved record already completed all three authorization pages, treat 8 as review.
 */
export function normalizeWorksheetStep(stored: number, form: FloridaNoFaultFormData) {
  if (!Number.isFinite(stored) || stored < 1) return 1;
  if (
    stored === 8 &&
    isStepComplete(7, form) &&
    isStepComplete(8, form) &&
    isStepComplete(9, form)
  ) {
    return TOTAL_WORKSHEET_STEPS;
  }
  return Math.min(Math.max(1, Math.trunc(stored)), TOTAL_WORKSHEET_STEPS);
}
