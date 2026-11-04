import assert from "node:assert/strict";
import test from "node:test";
import { canOpenEnrollment, isOnTrack, listedMrrCents } from "./baa";
import { deletionDueIso, retentionYears } from "./retention";
import { IMPERSONATION_MS } from "./impersonation";

test("enrollment stays closed until BAA is signed and the clinic is active", () => {
  assert.equal(canOpenEnrollment({ baaStatus: "SENT", isActive: true }), false);
  assert.equal(canOpenEnrollment({ baaStatus: "SIGNED", isActive: false }), false);
  assert.equal(canOpenEnrollment({ baaStatus: "SIGNED", isActive: true }), true);
});

test("pilot clinics do not contribute listed MRR", () => {
  assert.equal(listedMrrCents("PILOT"), 0);
  assert.equal(listedMrrCents("FOUNDING_199"), 19900);
});

test("on-track means activity inside 14 days", () => {
  assert.equal(isOnTrack(new Date().toISOString()), true);
  assert.equal(isOnTrack(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()), false);
});

test("deletion delay is 30 days and impersonation is 30 minutes", () => {
  const due = Date.parse(deletionDueIso(new Date("2026-01-01T00:00:00Z")));
  assert.equal(due, Date.parse("2026-01-31T00:00:00Z"));
  assert.equal(IMPERSONATION_MS, 30 * 60 * 1000);
  assert.equal(retentionYears() >= 1, true);
});
