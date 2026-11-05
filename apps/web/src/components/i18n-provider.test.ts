import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "i18n-provider.tsx"), "utf8");

test("language changes do not overwrite unique page titles", () => {
  assert.doesNotMatch(src, /document\.title\s*=/);
});
