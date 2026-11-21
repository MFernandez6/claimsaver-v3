import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const card = readFileSync(join(dir, "home-walkthrough-card.tsx"), "utf8");
const home = readFileSync(join(dir, "home-page.tsx"), "utf8");
const webRoot = join(dir, "../..");

test("homepage keeps the dashboard hero and places the 16:9 walkthrough in a card below it", () => {
  assert.match(home, /HomeHeroVisual/);
  assert.match(home, /HomeWalkthroughCard/);
  assert.ok(home.indexOf("<HomeHeroVisual") < home.indexOf("<HomeWalkthroughCard"));
  assert.match(card, /\/walkthroughs\/user-16x9\.mp4/);
  assert.match(card, /aspect-video/);
  assert.doesNotMatch(card, /aspect-\[9\/16\]/);
  assert.doesNotMatch(card, /\/films\//);
  assert.ok(existsSync(join(webRoot, "public/walkthroughs/user-16x9.mp4")));
  assert.ok(existsSync(join(webRoot, "public/walkthroughs/user-16x9.jpg")));
});
