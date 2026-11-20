import { NextRequest } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { jsonErr, jsonOk } from "@/lib/supabase/auth";
import { requirePermission } from "@/lib/admin/require-permission";
import { rateLimit, rateLimitResponse, clientIp } from "@/lib/security/rate-limit";
import { resolveOutreachStage, type OutreachStage } from "@/lib/outreach/records";
import {
  NINETY_DAY_TARGETS,
  PLANNING_FUNDING_USD,
  PITCH_TAGLINE,
  closedWonRate,
  collectedRevenueCents,
  conversionRate,
  countStages,
  daysAgoIso,
  paidClientCount,
  purchasesSince,
  qualifiedDemoCount,
  type PipelineRow,
  type PurchaseRow,
} from "@/lib/admin/kpis";

export async function GET(req: NextRequest) {
  const limited = await rateLimit(`admin-kpis:${clientIp(req)}`, 30, 10 * 60 * 1000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfter);

  const { response } = await requirePermission(req, "admin.pitch", {
    resourceType: "admin",
    resourceId: "kpis",
  });
  if (response) return response;
  if (!isSupabaseConfigured()) return jsonErr("Database not configured", 503);

  const admin = getSupabaseAdmin();
  const since90 = daysAgoIso(90);

  const [{ data: purchaseRows, error: purchaseError }, { data: outreachRows, error: outreachError }] =
    await Promise.all([
      admin.from("purchases").select("user_id, product_code, status, amount_cents, created_at"),
      admin.from("outreach_records").select("kind, stage, data"),
    ]);

  if (purchaseError) return jsonErr(purchaseError.message, 500);

  const purchases = (purchaseRows ?? []) as PurchaseRow[];
  const recentPurchases = purchasesSince(purchases, since90);
  const pipeline: PipelineRow[] = [];
  if (!outreachError) {
    for (const row of outreachRows ?? []) {
      const data = row.data && typeof row.data === "object" ? (row.data as Record<string, unknown>) : {};
      const stage = resolveOutreachStage({
        kind: String(row.kind),
        stage: row.stage,
        status: typeof data.status === "string" ? data.status : undefined,
      });
      pipeline.push({ kind: String(row.kind), stage: stage as OutreachStage | null });
    }
  }

  const clinicPipeline = pipeline.filter((row) => row.kind === "clinic");
  const stages = countStages(clinicPipeline);
  const clinicTotal = clinicPipeline.filter((row) => row.stage).length;

  return jsonOk({
    asOf: new Date().toISOString(),
    tagline: PITCH_TAGLINE,
    source: "Verified purchases.table and outreach_records stages. Not ads pixels or HeyCatch.",
    actuals: {
      collectedRevenueCents: collectedRevenueCents(purchases),
      paidClients: paidClientCount(purchases),
      paidClientsLast90Days: paidClientCount(recentPurchases),
      collectedRevenueLast90DaysCents: collectedRevenueCents(recentPurchases),
      activePayingClinics: 0,
      clinicMrrCents: 0,
      clinicBillingNote:
        "No clinic Stripe subscriptions are recorded. Listed clinic plan amounts are not collected revenue.",
      demonstrations: qualifiedDemoCount(pipeline),
      pipelineByStage: stages,
      clinicPipelineCount: clinicTotal,
      converted: stages.converted,
      lost: stages.lost,
      conversionRate: conversionRate(stages.converted, clinicTotal),
      closedWonRate: closedWonRate(stages.converted, stages.lost),
      churnedClinics: 0,
      churnNote: "Churn requires a clinic subscription history. None exists yet.",
      acquisitionCostCents: null as number | null,
      acquisitionCostNote: "No expense ledger is stored. Ads pixels are not a cost source.",
      outreachQueryError: outreachError ? "Outreach stages are unavailable until the database update is applied." : null,
    },
    targets: {
      label: "90-day targets",
      windowDays: 90,
      payingIndividuals: NINETY_DAY_TARGETS.payingIndividuals,
      payingClinicSubscriptions: NINETY_DAY_TARGETS.payingClinicSubscriptions,
      qualifiedDemos: NINETY_DAY_TARGETS.qualifiedDemos,
    },
    planning: {
      fundingUsd: PLANNING_FUNDING_USD,
      label: "Pitch planning only. Not an announced or committed round.",
    },
  });
}
