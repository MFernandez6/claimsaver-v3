import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LAWYER_DECLINED_PATH } from "./paths";

const dir = dirname(fileURLToPath(import.meta.url));
const webRoot = join(dir, "../..");

test("D5 pricing title, Product schema, homepage FAQ schema, and llms.txt", () => {
  const pricingLayout = readFileSync(join(webRoot, "app/pricing/layout.tsx"), "utf8");
  assert.match(pricingLayout, /pricingDocumentTitle/);
  assert.match(pricingLayout, /pricingProductJsonLd/);
  assert.match(pricingLayout, /absolute: title/);
  const jsonLd = readFileSync(join(webRoot, "lib/seo/json-ld.tsx"), "utf8");
  assert.match(jsonLd, /ClaimSaver\+ pricing: flat/);
  assert.match(jsonLd, /"@type": "FAQPage"/);
  assert.match(jsonLd, /"@type": "Product"/);
  assert.match(jsonLd, /priceCurrency: "USD"/);
  const home = readFileSync(join(webRoot, "app/page.tsx"), "utf8");
  assert.match(home, /homeFaqJsonLd/);
  const llms = readFileSync(join(webRoot, "../public/llms.txt"), "utf8");
  assert.match(llms, /Flat \$499 one time/);
  assert.match(llms, /lawyer-wont-take-my-pip-claim/);
});

test("D5 comparison page is linked from home, pricing, learning center, and sitemap", () => {
  assert.equal(LAWYER_DECLINED_PATH, "/vs/lawyer-wont-take-my-pip-claim");
  const sitemap = readFileSync(join(webRoot, "app/sitemap.ts"), "utf8");
  assert.match(sitemap, /\/vs\/lawyer-wont-take-my-pip-claim/);
  const vsPage = readFileSync(join(webRoot, "app/vs/lawyer-wont-take-my-pip-claim/page.tsx"), "utf8");
  assert.match(vsPage, /pages\.lawyerDeclined\.title/);
  const vsLayout = readFileSync(join(webRoot, "app/vs/lawyer-wont-take-my-pip-claim/layout.tsx"), "utf8");
  assert.match(vsLayout, /lawyerDeclinedFaqJsonLd/);
  const homePage = readFileSync(join(webRoot, "components/home-page.tsx"), "utf8");
  assert.match(homePage, /LAWYER_DECLINED_PATH/);
  const pricing = readFileSync(join(webRoot, "app/pricing/page.tsx"), "utf8");
  assert.match(pricing, /LAWYER_DECLINED_PATH/);
  const learning = readFileSync(join(webRoot, "app/learning-center/page.tsx"), "utf8");
  assert.match(learning, /LAWYER_DECLINED_PATH/);
});
