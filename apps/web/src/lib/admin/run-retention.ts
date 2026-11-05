import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { writeAudit } from "@/lib/admin/audit";
import { fulfillAccountDeletion } from "@/lib/api/fulfill-deletion";
import { leadCutoffIso, retentionCutoffIso } from "@/lib/admin/retention";
import type { AppRole } from "@/lib/auth/permissions";

export type RetentionCounts = {
  deletions: number;
  staleClaims: number;
  leads: number;
  expiredSessions: number;
};

export async function runRetentionJob(opts?: {
  actorId?: string;
  actorRole?: AppRole;
}): Promise<RetentionCounts> {
  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  const claimCutoff = retentionCutoffIso();
  const leadCutoff = leadCutoffIso();

  const { data: due } = await admin
    .from("account_deletion_requests")
    .select("id, user_id")
    .eq("status", "processing")
    .lte("hard_delete_after", now)
    .limit(50);

  let deletions = 0;
  for (const row of due ?? []) {
    try {
      await fulfillAccountDeletion(admin, String(row.user_id), String(row.id), null);
      deletions += 1;
    } catch (err) {
      console.error("retention deletion failed", err instanceof Error ? err.message : err);
    }
  }

  const { data: staleClaims } = await admin
    .from("claims")
    .select("id, user_id")
    .lte("updated_at", claimCutoff)
    .limit(100);

  let claims = 0;
  for (const row of staleClaims ?? []) {
    const { data: docs } = await admin
      .from("claim_documents")
      .select("storage_path")
      .eq("claim_id", row.id);
    const paths = (docs ?? []).map((doc) => String(doc.storage_path || "")).filter(Boolean);
    if (paths.length) await admin.storage.from("claim-documents").remove(paths);
    await admin.from("claim_documents").delete().eq("claim_id", row.id);
    await admin.from("claims").delete().eq("id", row.id);
    claims += 1;
  }

  const { data: profiles } = await admin.from("profiles").select("email");
  const emails = new Set(
    (profiles ?? []).map((row) => String(row.email || "").trim().toLowerCase()).filter(Boolean),
  );
  const { data: leads } = await admin
    .from("leads_14days")
    .select("id, email")
    .lte("created_at", leadCutoff)
    .limit(200);
  let leadsRemoved = 0;
  for (const lead of leads ?? []) {
    const email = String(lead.email || "").trim().toLowerCase();
    if (email && emails.has(email)) continue;
    await admin.from("leads_14days").delete().eq("id", lead.id);
    leadsRemoved += 1;
  }

  const { data: staleSessions } = await admin
    .from("impersonation_sessions")
    .select("id")
    .eq("status", "active")
    .lte("expires_at", now);
  if (staleSessions?.length) {
    await admin
      .from("impersonation_sessions")
      .update({ status: "expired" })
      .in(
        "id",
        staleSessions.map((row) => row.id),
      );
  }

  const counts: RetentionCounts = {
    deletions,
    staleClaims: claims,
    leads: leadsRemoved,
    expiredSessions: staleSessions?.length ?? 0,
  };

  await admin.from("cron_runs").insert({ job: "retention", counts });
  await writeAudit({
    actorId: opts?.actorId,
    actorRole: opts?.actorRole,
    action: opts?.actorId ? "cron.retention.manual" : "cron.retention",
    resourceType: "system",
    resourceId: "retention",
    metadata: counts,
  });

  return counts;
}
