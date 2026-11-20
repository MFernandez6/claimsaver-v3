import type { OutreachStage } from "@/lib/outreach/records";

export type KpiPayload = {
  asOf: string;
  tagline: string;
  source: string;
  actuals: {
    collectedRevenueCents: number;
    paidClients: number;
    paidClientsLast90Days: number;
    collectedRevenueLast90DaysCents: number;
    activePayingClinics: number;
    clinicMrrCents: number;
    clinicBillingNote: string;
    demonstrations: number;
    pipelineByStage: Record<OutreachStage, number>;
    clinicPipelineCount: number;
    converted: number;
    lost: number;
    conversionRate: number | null;
    closedWonRate: number | null;
    churnedClinics: number;
    churnNote: string;
    acquisitionCostCents: number | null;
    acquisitionCostNote: string;
    outreachQueryError: string | null;
  };
  targets: {
    label: string;
    windowDays: number;
    payingIndividuals: number;
    payingClinicSubscriptions: number;
    qualifiedDemos: number;
  };
  planning: {
    fundingUsd: number;
    label: string;
  };
};
