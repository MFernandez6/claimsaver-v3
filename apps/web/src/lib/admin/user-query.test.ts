import assert from "node:assert/strict";
import test from "node:test";
import { escapeIlikeExact, parseUserQuery, USER_QUERY_HINT } from "./user-query";

test("user search accepts an exact email or UUID only", () => {
  assert.deepEqual(parseUserQuery("support@claimsaverplus.com"), {
    ok: true,
    kind: "email",
    value: "support@claimsaverplus.com",
  });
  assert.equal(
    parseUserQuery("84efb2a1-26b6-4baa-9d19-4947abd5ec66").ok,
    true,
  );
});

test("user search rejects names, partials, and empty queries", () => {
  assert.deepEqual(parseUserQuery("Miguel"), {
    ok: false,
    error: USER_QUERY_HINT,
  });
  assert.deepEqual(parseUserQuery("support@"), {
    ok: false,
    error: USER_QUERY_HINT,
  });
  assert.deepEqual(parseUserQuery("%@claimsaverplus.com"), {
    ok: false,
    error: USER_QUERY_HINT,
  });
  assert.equal(parseUserQuery("").ok, false);
});

test("ilike exact-escape does not leave LIKE wildcards", () => {
  assert.equal(escapeIlikeExact("john_doe@x.com"), "john\\_doe@x.com");
});
