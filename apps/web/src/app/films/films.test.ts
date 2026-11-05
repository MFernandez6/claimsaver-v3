import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { REVIEW_FILMS } from "../../content/films.ts";

const dir = dirname(fileURLToPath(import.meta.url));
const webRoot = join(dir, "../../..");

test("review films exist and the /films page stays off the public index", () => {
  const page = readFileSync(join(dir, "page.tsx"), "utf8");
  const layout = readFileSync(join(dir, "layout.tsx"), "utf8");
  assert.match(layout, /index: false/);
  assert.match(layout, /getStaffRole/);
  assert.match(page, /playsInline/);
  assert.equal(REVIEW_FILMS.length, 4);
  for (const film of REVIEW_FILMS) {
    const file = join(webRoot, "public", film.src.replace(/^\//, ""));
    assert.ok(existsSync(file), film.src);
  }
  const middleware = readFileSync(join(webRoot, "src/middleware.ts"), "utf8");
  assert.match(middleware, /"\/films"/);
  const robots = readFileSync(join(webRoot, "public/robots.txt"), "utf8");
  assert.match(robots, /Disallow: \/films/);
});
