import assert from "node:assert/strict";
import test from "node:test";
import { patchClaimSchema } from "@claimsaver/shared";

test("customers cannot patch privileged claim statuses", () => {
  assert.equal(patchClaimSchema.safeParse({ status: "draft" }).success, true);
  assert.equal(patchClaimSchema.safeParse({ status: "in_progress" }).success, true);
  for (const status of ["pending", "reviewing", "approved", "rejected", "completed"]) {
    assert.equal(patchClaimSchema.safeParse({ status }).success, false, status);
  }
});
