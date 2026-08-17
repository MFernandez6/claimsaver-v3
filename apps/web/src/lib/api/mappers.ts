import { emptyWorksheet, type ClaimDetail, type ClaimSummary } from "@claimsaver/shared";

function str(v: unknown) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export function toClaimSummary(row: Record<string, unknown>): ClaimSummary {
  const ws = (row.worksheet ?? {}) as Record<string, unknown>;
  return {
    id: str(row.id),
    claimNumber: str(row.claim_number),
    status: (str(row.status) || "draft") as ClaimSummary["status"],
    priority: (str(row.priority) || "medium") as ClaimSummary["priority"],
    accidentDate: str(ws.accidentDate || ws.dateOfAccident) || null,
    accidentLocation: str(ws.accidentLocation || ws.accidentPlace) || null,
    claimantName: str(ws.claimantName) || null,
    estimatedValue: typeof ws.estimatedValue === "number" ? ws.estimatedValue : null,
    updatedAt: str(row.updated_at),
    createdAt: str(row.created_at),
    worksheetStep: Number(row.worksheet_step) || 1,
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
