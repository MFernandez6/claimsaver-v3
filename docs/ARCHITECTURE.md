# Architecture

## Why one API for web and mobile

Accident customers upload from a phone. Marketing and checkout still need a fast public website. v3 therefore has **one HTTP surface** (`/api/v1/*`) and **one TypeScript contract** (`@claimsaver/shared`).

| Client | Auth | Client helper |
| --- | --- | --- |
| Next.js (browser) | Supabase cookie session | `createApiClient({ baseUrl: "" })` with `credentials: "include"` |
| Expo | `Authorization: Bearer <access_token>` | `createApiClient({ baseUrl, getToken })` |

`getAuthUser` in the API checks the Bearer header first, then cookies. No duplicate business logic.

## Why not tRPC this round

tRPC is excellent inside a Next-only app. Expo + React Native FormData uploads + Stripe webhooks are simpler as ordinary REST with Zod on both ends. The shared `createApiClient` is ~80 lines and identical on both platforms.

## Why Checkout Sessions, not Payment Element

The catalog is two one-time SKUs. Stripe-hosted Checkout is the fastest PCI-light path. **Prices are never taken from the client.** The body is `{ products: ["platform", "notarization"] }`. Amounts come from `PRODUCTS` in `packages/shared`.

Webhook `checkout.session.completed` writes `purchases` and sets `profiles.has_platform_access`. The worksheet and vault return **402** until that flag is true.

## Autosave

The eight-step worksheet PATCHes only the changed fields after 700ms. Accident-date changes can seed Florida PIP milestone templates once per claim (education, not advice).

## Data

Postgres (Supabase) with RLS. The Next.js API uses the service role for storage signed URLs and Stripe fulfillment; user-scoped queries still filter `user_id = auth user`. SSN stays in the worksheet JSON and is not shown on list endpoints.

## What we deleted from v2

Clerk, Mongo/Mongoose, client-supplied Stripe amounts, `payment_method_types: ['card']`, debug API routes, and dual claim-id shapes (`_id` vs `id`).
