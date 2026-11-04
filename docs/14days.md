# 14 DAYS. campaign (`/14days`)

Standalone marketing page that trades an email (phone optional) for the free Florida 14-Day PIP Checklist. It does not change login, checkout, the worksheet, or the vault.

Counsel should review checklist and legal copy in `apps/web/src/content/14days.ts` before ads go live.

## Routes

| Path | Language |
| --- | --- |
| `/14days` | English |
| `/es/14dias` | Spanish |
| `/14days/thanks` | English confirmation + PDF |
| `/es/14dias/gracias` | Spanish confirmation + PDF |

PDFs: `apps/web/public/downloads/14-day-pip-checklist-en.pdf` and `-es.pdf`.

## Environment

Add these to Vercel (and `apps/web/.env.local` for local mail). Keep secrets out of git.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | For sending the PDF link | Resend API. From: `ClaimSaver+ <support@claimsaverplus.com>` (domain already used for auth mail). |
| `LEAD_IP_SALT` | Production | Random string mixed into SHA-256 of the client IP. Raw IP is never stored. |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Optional | Google Ads / gtag id. Conversion event `lead_14days` fires on the thanks page. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | Meta Pixel. `PageView` on the landing page, `Lead` on thanks. No name/email/phone, no advanced matching. |

Existing vars still required for the form to save: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

Apply the migration before taking live leads:

```
supabase/migrations/20261104115520_leads_14days.sql
```

Table `public.leads_14days` has RLS on and **no** grants to `anon` / `authenticated`. Writes go through the server action with the service role. Repeat emails upsert (unique on `email`).

## Regenerate PDFs

From the repo root:

```
npm run checklists:generate
```

That writes both PDFs under `apps/web/public/downloads/`. Commit the generated files.

The generator uses `pdf-lib` (not `@react-pdf/renderer`) because renderer v4 cannot load under Node 20 + tsx and v3 cannot run on React 19. The script is still build-time only.

## Export leads to CSV

```
node --env-file=apps/web/.env.local scripts/export-14days-leads.mjs > leads-14days.csv
```

The script does not print `ip_hash`, `user_agent`, or SMS consent text. It needs the service role key.

## Ads pixels and cookies

Pixels load only after the visitor accepts optional cookies on the campaign pages. The first-party `cs_14days_attr` cookie (30 days) stores UTMs / gclid / fbclid for the form and is set on first visit without a banner. Vercel Analytics was already on the site.

## Rate limits and spam

Hidden honeypot field `website`. Server rate limit 5 posts / hour / IP (same durable limiter as the rest of the app). Generic errors; the UI never says an email already exists.
