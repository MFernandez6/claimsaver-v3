import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import nextConfig from "../../../next.config";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

test("HeyCatch init is a static client entry with the project key", () => {
  const pkg = JSON.parse(readFileSync(join(webRoot, "package.json"), "utf8")) as {
    dependencies: Record<string, string>;
  };
  assert.match(pkg.dependencies["@heycatch/sdk"], /\^0\.\d+\.\d+$/);
  const entry = readFileSync(join(webRoot, "src/instrumentation-client.ts"), "utf8");
  assert.match(entry, /from "@heycatch\/sdk"/);
  assert.match(entry, /projectKey: "hck_pk_mXAe0H2X98dyJTiaEHEXTjjuZKairf4Y"/);
  assert.match(entry, /framework: "nextjs"/);
  assert.match(entry, /frameworkVersion: "15"/);
  assert.match(entry, /agent: "cursor"/);
  assert.doesNotMatch(entry, /apiHost/);
  assert.doesNotMatch(entry, /site: "landing"/);
});

test("CSP and short-link redirects allow HeyCatch", async () => {
  const config = readFileSync(join(webRoot, "next.config.ts"), "utf8");
  assert.match(config, /script-src[\s\S]*https:\/\/in\.heycatch\.ai/);
  assert.match(config, /connect-src[\s\S]*https:\/\/in\.heycatch\.ai/);
  const redirects = await nextConfig.redirects?.();
  const short = redirects?.find((row) => row.source === "/:l([a-z0-9])");
  assert.equal(short?.destination, "/?utm_source=heycatch&utm_campaign=:l");
  assert.equal(short?.permanent, false);
});

test("signup, sign-in, and purchase report HeyCatch identity events", () => {
  const signup = readFileSync(join(webRoot, "src/app/signup/page.tsx"), "utf8");
  const checkout = readFileSync(join(webRoot, "src/app/checkout-account/page.tsx"), "utf8");
  const login = readFileSync(join(webRoot, "src/app/login/login-inner.tsx"), "utf8");
  const callback = readFileSync(join(webRoot, "src/app/auth/callback/page.tsx"), "utf8");
  const session = readFileSync(join(webRoot, "src/lib/auth/session-security.ts"), "utf8");
  const webhook = readFileSync(join(webRoot, "src/app/api/v1/webhooks/stripe/route.ts"), "utf8");
  assert.match(signup, /trackSignupCompleted/);
  assert.match(signup, /markPendingSignup/);
  assert.match(checkout, /trackSignupCompleted/);
  assert.match(checkout, /identifyUser/);
  assert.match(login, /identifyUser/);
  assert.match(callback, /trackSignupCompleted/);
  assert.match(session, /resetAnalyticsIdentity/);
  assert.match(webhook, /analytics\.init\(\{ projectKey: "hck_pk_mXAe0H2X98dyJTiaEHEXTjjuZKairf4Y" \}\)/);
  assert.match(webhook, /purchase_completed/);
  assert.match(webhook, /userId/);
});
