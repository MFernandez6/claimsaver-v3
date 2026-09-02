import {
  emptyWorksheet,
  floridaNoFaultFormSchema,
  isWorksheetComplete,
  normalizeAccidentDate,
  TOTAL_WORKSHEET_STEPS,
  type ClaimDetail,
  type ClaimSummary,
} from "@claimsaver/shared";

function str(v: unknown) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export function toClaimSummary(row: Record<string, unknown>): ClaimSummary {
  const ws = (row.worksheet ?? {}) as Record<string, unknown>;
  const parsed = floridaNoFaultFormSchema.safeParse(ws);
  const worksheet = parsed.success ? parsed.data : emptyWorksheet();
  const step = Number(row.worksheet_step) || 1;
  return {
    id: str(row.id),
    claimNumber: str(row.claim_number),
    status: (str(row.status) || "draft") as ClaimSummary["status"],
    priority: (str(row.priority) || "medium") as ClaimSummary["priority"],
    accidentDate:
      normalizeAccidentDate({
        dateOfAccident: str(ws.dateOfAccident),
        accidentDate: str(ws.accidentDate),
        accidentDateTime: str(ws.accidentDateTime),
      }) || null,
    accidentLocation: str(ws.accidentLocation || ws.accidentPlace) || null,
    claimantName: str(ws.claimantName) || null,
    estimatedValue: typeof ws.estimatedValue === "number" ? ws.estimatedValue : null,
    updatedAt: str(row.updated_at),
    createdAt: str(row.created_at),
    worksheetStep: step,
    worksheetComplete:
      (parsed.success && isWorksheetComplete(worksheet)) ||
      (step >= TOTAL_WORKSHEET_STEPS && str(ws.signature).trim().length > 0),
  };
}

export function toClaimDetail(row: Record<string, unknown>): ClaimDetail {
  const ws = emptyWorksheet();
  const raw = (row.worksheet ?? {}) as Record<string, unknown>;
  return {
    ...toClaimSummary(row),
    worksheet: { ...ws, ...raw, claimantSSN: str(raw.claimantSSN) },
  };
}
