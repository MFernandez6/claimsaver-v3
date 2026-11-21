import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const reel = readFileSync(join(dir, "home-walkthrough-reel.tsx"), "utf8");
const home = readFileSync(join(dir, "home-page.tsx"), "utf8");
const webRoot = join(dir, "../..");

test("homepage hero uses the public 9:16 user reel, not a gated /films asset", () => {
  assert.match(home, /HomeWalkthroughReel/);
  assert.match(reel, /\/walkthroughs\/user-9x16\.mp4/);
  assert.match(reel, /aspect-\[9\/16\]/);
  assert.doesNotMatch(reel, /\/films\//);
  assert.ok(existsSync(join(webRoot, "public/walkthroughs/user-9x16.mp4")));
  assert.ok(existsSync(join(webRoot, "public/walkthroughs/user-9x16.jpg")));
});
