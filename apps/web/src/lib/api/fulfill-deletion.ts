import type { SupabaseClient } from "@supabase/supabase-js";

export async function fulfillAccountDeletion(
  admin: SupabaseClient,
  userId: string,
  requestId: string,
  processedBy: string,
) {
  const { data: docs } = await admin
    .from("claim_documents")
    .select("storage_path")
    .eq("user_id", userId);
  const paths = (docs ?? [])
    .map((row) => String(row.storage_path || ""))
    .filter(Boolean);
  if (paths.length) {
    await admin.storage.from("claim-documents").remove(paths);
  }

  await admin.from("claim_documents").delete().eq("user_id", userId);
  await admin.from("calendar_events").delete().eq("user_id", userId);
  await admin.from("expenses").delete().eq("user_id", userId);
  await admin.from("claims").delete().eq("user_id", userId);

  await admin
    .from("profiles")
    .update({
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      has_platform_access: false,
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  await admin.auth.admin.signOut(userId, "global").catch(() => undefined);
  await admin.auth.admin
    .updateUserById(userId, { ban_duration: "876600h" })
    .catch(() => undefined);

  const { error } = await admin
    .from("account_deletion_requests")
    .update({
      status: "done",
      processed_at: new Date().toISOString(),
      processed_by: processedBy,
    })
    .eq("id", requestId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}
