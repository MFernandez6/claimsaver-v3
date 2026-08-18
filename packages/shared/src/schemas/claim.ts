import { z } from "zod";
import { COMPLETION_METHODS, TOTAL_WORKSHEET_STEPS } from "../constants/worksheet";
import {
  CLAIM_PRIORITIES,
  CLAIM_STATUSES,
} from "../constants/legal";

export const completionMethodSchema = z.union([
  z.enum(COMPLETION_METHODS),
  z.literal(""),
]);

export const floridaNoFaultFormSchema = z.object({
  completionMethod: completionMethodSchema.default(""),
  employersList: z.string().default(""),

  insuranceCompany: z.string().default(""),
  policyNumber: z.string().default(""),
  adjusterName: z.string().default(""),
  adjusterPhone: z.string().default(""),
  fileNumber: z.string().default(""),
  policyHolder: z.string().default(""),
  dateOfAccident: z.string().default(""),

  medicalInsurance: z.string().default(""),
  medicalMemberId: z.string().default(""),

  claimantName: z.string().default(""),
  claimantEmail: z.string().default(""),
  claimantPhone: z.string().default(""),
  claimantPhoneHome: z.string().default(""),
  claimantPhoneBusiness: z.string().default(""),
  claimantAddress: z.string().default(""),
  claimantDOB: z.string().default(""),
  claimantSSN: z.string().default(""),
  floridaResidencyDuration: z.string().default(""),
  permanentAddress: z.string().default(""),

  accidentDate: z.string().default(""),
  accidentLocation: z.string().default(""),
  accidentDescription: z.string().default(""),
  accidentDateTime: z.string().default(""),
  accidentPlace: z.string().default(""),
  yourVehicle: z.string().default(""),
  familyVehicle: z.string().default(""),
  injured: z.boolean().default(false),
  injuryResponse: z.enum(["", "yes", "no"]).default(""),
  injuryDescription: z.string().default(""),

  treatedByDoctor: z.boolean().default(false),
  doctorName: z.string().default(""),
  doctorAddress: z.string().default(""),
  hospitalInpatient: z.boolean().default(false),
  hospitalOutpatient: z.boolean().default(false),
  hospitalName: z.string().default(""),
  hospitalAddress: z.string().default(""),
  medicalBillsToDate: z.string().default(""),
  moreMedicalExpense: z.boolean().default(false),

  inCourseOfEmployment: z.boolean().default(false),
  lostWages: z.boolean().default(false),
  wageLossResponse: z.enum(["", "yes", "no"]).default(""),
  wageLossToDate: z.string().default(""),
  averageWeeklyWage: z.string().default(""),
  disabilityStart: z.string().default(""),
  disabilityEnd: z.string().default(""),
  workersComp: z.boolean().default(false),
  workersCompAmount: z.string().default(""),
  otherExpenses: z.string().default(""),

  signature: z.string().default(""),
  signatureDate: z.string().default(""),

  insuranceAuthInsuredName: z.string().default(""),
  insuranceAuthPolicyNumber: z.string().default(""),
  insuranceAuthInsuranceCompany: z.string().default(""),
  insuranceAuthDisclosureType: z.string().default(""),
  insuranceAuthExcludedInfo: z.array(z.string()).default([]),
  insuranceAuthDisclosureForm: z.string().default(""),
  insuranceAuthReasonForDisclosure: z.string().default(""),
  insuranceAuthRecipientName: z.string().default(""),
  insuranceAuthRecipientOrganization: z.string().default(""),
  insuranceAuthRecipientAddress: z.string().default(""),
  insuranceAuthDurationType: z.string().default(""),
  insuranceAuthStartDate: z.string().default(""),
  insuranceAuthEndDate: z.string().default(""),
  insuranceAuthEndEvent: z.string().default(""),
  insuranceAuthRevocationName: z.string().default(""),
  insuranceAuthRevocationOrganization: z.string().default(""),
  insuranceAuthRevocationAddress: z.string().default(""),
  insuranceAuthSignature: z.string().default(""),
  insuranceAuthSignatureDate: z.string().default(""),

  pipPatientName: z.string().default(""),
  pipPatientSignature: z.string().default(""),
  pipPatientDate: z.string().default(""),
  pipProviderName: z.string().default(""),
  pipProviderSignature: z.string().default(""),
  pipProviderDate: z.string().default(""),

  hipaaPatientName: z.string().default(""),
  hipaaHealthcareProvider: z.string().default(""),
  hipaaDisclosureType: z.string().default(""),
  hipaaExcludedInfo: z.array(z.string()).default([]),
  hipaaDisclosureForm: z.string().default(""),
  hipaaReasonForDisclosure: z.string().default(""),
  hipaaRecipientName: z.string().default(""),
  hipaaRecipientOrganization: z.string().default(""),
  hipaaRecipientAddress: z.string().default(""),
  hipaaDurationType: z.string().default(""),
  hipaaStartDate: z.string().default(""),
  hipaaEndDate: z.string().default(""),
  hipaaEndEvent: z.string().default(""),
  hipaaRevocationName: z.string().default(""),
  hipaaRevocationOrganization: z.string().default(""),
  hipaaRevocationAddress: z.string().default(""),
  hipaaSignature: z.string().default(""),
  hipaaSignatureDate: z.string().default(""),

  vehicleMake: z.string().default(""),
  vehicleModel: z.string().default(""),
  vehicleYear: z.string().default(""),
  licensePlate: z.string().default(""),
  estimatedValue: z.number().min(0).default(0),
});

export type FloridaNoFaultFormData = z.infer<typeof floridaNoFaultFormSchema>;

export function isDrawnSignature(value: string) {
  return value.startsWith("data:image/");
}

export function emptyWorksheet(): FloridaNoFaultFormData {
  return floridaNoFaultFormSchema.parse({});
}

export const claimSummarySchema = z.object({
  id: z.string().uuid(),
  claimNumber: z.string(),
  status: z.enum(CLAIM_STATUSES),
  priority: z.enum(CLAIM_PRIORITIES),
  accidentDate: z.string().nullable(),
  accidentLocation: z.string().nullable(),
  claimantName: z.string().nullable(),
  estimatedValue: z.number().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
  worksheetStep: z.number().int().min(1).max(TOTAL_WORKSHEET_STEPS).default(1),
  worksheetComplete: z.boolean().default(false),
});

export type ClaimSummary = z.infer<typeof claimSummarySchema>;

export const claimDetailSchema = claimSummarySchema.extend({
  worksheet: floridaNoFaultFormSchema,
});

export type ClaimDetail = z.infer<typeof claimDetailSchema>;

export const patchClaimSchema = z.object({
  worksheet: floridaNoFaultFormSchema.partial().optional(),
  status: z.enum(CLAIM_STATUSES).optional(),
  priority: z.enum(CLAIM_PRIORITIES).optional(),
  worksheetStep: z.number().int().min(1).max(TOTAL_WORKSHEET_STEPS).optional(),
});

export type PatchClaimInput = z.infer<typeof patchClaimSchema>;
