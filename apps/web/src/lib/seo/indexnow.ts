import { PRODUCTION_ORIGIN, PUBLIC_INDEX_URLS } from "@/lib/seo/public-urls";

/** Hosted at /{INDEXNOW_KEY}.txt so Bing/Yandex/Naver can verify IndexNow submissions. */
export const INDEXNOW_KEY = "9e4c2a71b6f04d18a7c3e91f0b25d846";

export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;

export async function notifyIndexNow(urls: string[] = [...PUBLIC_INDEX_URLS]) {
  const body = {
    host: "www.claimsaverplus.com",
    key: INDEXNOW_KEY,
    keyLocation: `${PRODUCTION_ORIGIN}${INDEXNOW_KEY_PATH}`,
    urlList: urls,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok || res.status === 202, status: res.status };
}
