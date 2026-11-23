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
  assert.match(jsonLd, /Florida PIP software pricing: flat/);
  assert.match(jsonLd, /"@type": "FAQPage"/);
  assert.match(jsonLd, /"@type": "Product"/);
  assert.match(jsonLd, /"@type": "SoftwareApplication"/);
  assert.match(jsonLd, /"@type": "HowTo"/);
  assert.match(jsonLd, /priceCurrency: "USD"/);
  const home = readFileSync(join(webRoot, "app/page.tsx"), "utf8");
  assert.match(home, /homeFaqJsonLd/);
  assert.match(home, /softwareApplicationJsonLd/);
  const llms = readFileSync(join(webRoot, "../public/llms.txt"), "utf8");
  assert.match(llms, /Flat \$499 one time/);
  assert.match(llms, /lawyer-wont-take-my-pip-claim/);
  assert.match(llms, /how-to-file-pip-in-florida/);
  assert.match(llms, /florida-pip-14-day-rule/);
});

test("D5 comparison page is linked from home, pricing, learning center, and sitemap", () => {
  assert.equal(LAWYER_DECLINED_PATH, "/vs/lawyer-wont-take-my-pip-claim");
  const sitemap = readFileSync(join(webRoot, "app/sitemap.ts"), "utf8");
  assert.match(sitemap, /PUBLIC_INDEX_PATHS/);
  const publicUrls = readFileSync(join(webRoot, "lib/seo/public-urls.ts"), "utf8");
  assert.match(publicUrls, /\/vs\/lawyer-wont-take-my-pip-claim/);
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

test("public metadata leads with assistance queries, not only the brand", () => {
  const root = readFileSync(join(webRoot, "app/layout.tsx"), "utf8");
  assert.match(root, /File a Florida PIP claim yourself/);
  assert.match(root, /file no-fault paperwork yourself/);
  assert.match(root, /organizationJsonLd/);
  const how = readFileSync(join(webRoot, "app/how-it-works/layout.tsx"), "utf8");
  assert.match(how, /How to file a Florida PIP claim/);
  assert.match(how, /howItWorksHowToJsonLd/);
  const learning = readFileSync(join(webRoot, "app/learning-center/layout.tsx"), "utf8");
  assert.match(learning, /Florida PIP claim guides/);
  const days = readFileSync(join(webRoot, "content/14days.ts"), "utf8");
  assert.match(days, /Florida PIP 14-day rule checklist/);
});

test("learning center articles have unique titles and are in the sitemap", () => {
  const articles = readFileSync(join(webRoot, "lib/seo/articles.ts"), "utf8");
  assert.match(articles, /How to file a PIP claim in Florida/);
  assert.match(articles, /Florida PIP 14-day rule explained/);
  const sitemap = readFileSync(join(webRoot, "app/sitemap.ts"), "utf8");
  assert.match(sitemap, /PUBLIC_INDEX_PATHS/);
  const slugs = readFileSync(join(webRoot, "data/learningCenter/slugs.ts"), "utf8");
  assert.match(slugs, /how-to-file-pip-in-florida/);
  assert.match(slugs, /florida-pip-14-day-rule/);
  const articleLayout = readFileSync(join(webRoot, "app/learning-center/[slug]/layout.tsx"), "utf8");
  assert.match(articleLayout, /generateMetadata/);
  assert.match(articleLayout, /generateStaticParams/);
  assert.match(articleLayout, /articlePageJsonLd/);
});

test("homepage FAQ schema answers file-yourself and 14-day queries", () => {
  const en = JSON.parse(readFileSync(join(webRoot, "locales/en.json"), "utf8")) as {
    home: { faq: Record<string, { question: string; answer: string }> };
  };
  assert.match(en.home.faq.fileYourself.question, /file a Florida PIP claim myself/i);
  assert.match(en.home.faq.fileYourself.answer, /You stay the filer/);
  assert.match(en.home.faq.whatIsPip.question, /Florida PIP/);
  assert.match(en.home.faq.fourteenDay.question, /14-day rule/);
  assert.match(en.home.faq.attorneyNeed.question, /lawyer to file a PIP claim in Florida/i);
  const jsonLd = readFileSync(join(webRoot, "lib/seo/json-ld.tsx"), "utf8");
  assert.match(jsonLd, /"fileYourself"/);
  const homePage = readFileSync(join(webRoot, "components/home-page.tsx"), "utf8");
  assert.match(homePage, /home\.faq\.fileYourself/);
});

test("public pages ask crawlers to index; private surfaces stay off the index", () => {
  const robots = readFileSync(join(webRoot, "app/robots.ts"), "utf8");
  assert.match(robots, /Googlebot/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /ROBOTS_DISALLOW/);
  const disallow = readFileSync(join(webRoot, "lib/seo/public-urls.ts"), "utf8");
  assert.match(disallow, /\/films/);
  assert.match(disallow, /\/dashboard/);
  const root = readFileSync(join(webRoot, "app/layout.tsx"), "utf8");
  assert.match(root, /index: true/);
  assert.match(root, /NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION/);
  const login = readFileSync(join(webRoot, "app/login/layout.tsx"), "utf8");
  assert.match(login, /privatePageMeta/);
  const dashboard = readFileSync(join(webRoot, "app/dashboard/layout.tsx"), "utf8");
  assert.match(dashboard, /privatePageMeta/);
  const indexnow = readFileSync(join(webRoot, "app/api/cron/indexnow/route.ts"), "utf8");
  assert.match(indexnow, /notifyIndexNow/);
  const urls = readFileSync(join(webRoot, "lib/seo/public-urls.ts"), "utf8");
  assert.match(urls, /LEARNING_CENTER_PATHS/);
});
