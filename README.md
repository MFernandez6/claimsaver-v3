# ClaimSaver+ v3

Florida PIP guided claim platform — web + iOS/Android, one typed API.

Live brand reference: [claimsaverplus.com](https://www.claimsaverplus.com/)

Business source of truth: [`PRODUCT_BRIEF.md`](./PRODUCT_BRIEF.md)  
YC application draft: [`YC_APPLICATION.md`](./YC_APPLICATION.md)

## What this version changes

v2 mixed leftover Clerk/Mongo paths, trusted checkout prices from the browser, and talked to the database mostly through a service-role bypass. v3 is built for a YC-ready demo:

- **One contract** (`packages/shared`) — Zod schemas, product catalog, legal copy constants, and a tiny `createApiClient` used by Next.js and Expo
- **Server-authoritative Stripe** — clients send product codes (`platform`, `notarization`); amounts live only on the server
- **Access as an entitlement** — `checkout.session.completed` webhook grants `has_platform_access`
- **Debounced worksheet PATCH** — field-level autosave instead of a 30s dump
- **Bearer + cookie auth** — the same `/api/v1/*` routes work in the browser (cookies) and on mobile (Supabase JWT)
- **Expo app** — camera capture after a crash, same workspace

ClaimSaver+ is still not a law firm. The customer files. The $500 fee is platform access. Notarization is optional and separate.

## Architecture

```
apps/web          Next.js 15 (marketing, dashboard, API)
apps/mobile       Expo Router (iOS / Android / Expo Go)
packages/shared   Types, Zod, pricing, API client
supabase/         Postgres + Storage + RLS
```

```
Web (cookies)  ─┐
                ├─►  Next.js /api/v1/*  ─►  Supabase Postgres + Storage
Mobile (JWT)   ─┘         │
                          └─►  Stripe Checkout + webhooks
```

## Setup

1. Copy `.env.example` to `apps/web/.env.local` (and optionally the repo root).
2. Create a Supabase project. Run `supabase/migrations/001_init.sql` in the SQL editor.
3. Add Stripe keys. Point the webhook to `/api/v1/webhooks/stripe` (`checkout.session.completed`).
4. Install and run:

```bash
npm install
npm run dev          # web → http://localhost:3000
npm run dev:mobile   # Expo
```

On a physical phone, set `EXPO_PUBLIC_API_URL` to your machine’s LAN URL (not `localhost`).

## Production (GitHub → Vercel)

Same path as v2: push `main` to [MFernandez6/claimsaver-v3](https://github.com/MFernandez6/claimsaver-v3). Vercel builds the Next.js app in `apps/web` (npm workspace install from the repo root).

Leave **claimsaver-v2** on its current production domain until you are ready to cut over. v3 ships first on its Vercel URL.

Set these on the Vercel project (Production + Preview):

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production origin, e.g. `https://www.claimsaverplus.com` |
| `NEXT_PUBLIC_APP_URL` | Same as site URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Prod Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only |
| `STRIPE_SECRET_KEY` | Live restricted key (`rk_live_…`) preferred |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Live publishable key |
| `STRIPE_WEBHOOK_SECRET` | From the Stripe endpoint below |

After the first production URL exists:

1. Run `supabase/migrations/001_init.sql` and `002_pip_deadline_chain.sql` on the prod Supabase project (SQL editor).
2. Point Stripe `checkout.session.completed` at `https://<prod-host>/api/v1/webhooks/stripe`.
3. When v3 is ready to replace v2, move the production domain in Vercel from `claimsaver-v2` to `claimsaver-v3` and update `NEXT_PUBLIC_SITE_URL`.

## Product flow

Account → pay $500 (optional +$25 notarization) → 8-step Florida no-fault worksheet → documents → reminders/expenses → **customer sends the package to the insurer**.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Web | Next.js 15 App Router | SEO for marketing, one deploy for API + UI |
| Mobile | Expo | Camera uploads; share TypeScript with web |
| Auth / DB / files | Supabase | Already in production v2; RLS + private bucket |
| Payments | Stripe Checkout Sessions | One-time $500 / $25; no custom card form |
| Validation | Zod in `packages/shared` | Same payload on web, mobile, and server |
| Data fetching | TanStack Query (web) | Cache + fewer round trips on the dashboard |

## Legal

Do not weaken the copy in `PRODUCT_BRIEF.md`. If a feature idea conflicts with that brief, the brief wins.
