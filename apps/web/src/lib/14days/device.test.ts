import assert from "node:assert/strict";
import test from "node:test";
import { isMobileChecklistDevice } from "./device";

test("phones and tablets count as mobile for the checklist PDF", () => {
  assert.equal(isMobileChecklistDevice({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0)" }), true);
  assert.equal(isMobileChecklistDevice({ userAgent: "Mozilla/5.0 (Linux; Android 14)" }), true);
  assert.equal(isMobileChecklistDevice({ userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0)" }), true);
  assert.equal(isMobileChecklistDevice({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)", maxWidth: true }), true);
});

test("desktop browsers do not auto-open the PDF", () => {
  assert.equal(
    isMobileChecklistDevice({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Chrome/120.0.0.0",
      maxWidth: false,
    }),
    false,
  );
});
