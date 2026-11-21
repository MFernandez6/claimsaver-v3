import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const page = readFileSync(join(dir, "page.tsx"), "utf8");
const webRoot = join(dir, "../../..");

test("how-it-works embeds the public user walkthrough, not a gated /films asset", () => {
  assert.match(page, /\/walkthroughs\/user\.mp4/);
  assert.match(page, /ProductVideo/);
  assert.doesNotMatch(page, /\/films\//);
  assert.ok(existsSync(join(webRoot, "public/walkthroughs/user.mp4")));
  assert.ok(existsSync(join(webRoot, "public/walkthroughs/clinic.mp4")));
  assert.ok(existsSync(join(webRoot, "public/walkthroughs/user-9x16.mp4")));
});
