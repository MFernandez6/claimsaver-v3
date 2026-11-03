import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "../../../next.config";

test("legacy auth paths permanently redirect", async () => {
  const redirects = await nextConfig.redirects?.();
  const map = new Map((redirects ?? []).map((row) => [row.source, row]));
  assert.equal(map.get("/signin")?.destination, "/login");
  assert.equal(map.get("/sign-in")?.destination, "/login");
  assert.equal(map.get("/sign-up")?.destination, "/signup");
  assert.equal(map.get("/need-professional-help")?.destination, "/when-to-call-an-attorney");
  for (const source of ["/signin", "/sign-in", "/sign-up", "/need-professional-help"]) {
    assert.equal(map.get(source)?.permanent, true);
  }
});
