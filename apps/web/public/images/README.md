# Images Directory

## Brand

Processed lockups from the Fiverr ClaimSaver+ mark live in `brand/`:

- `claimsaver-plus-lockup.png` — horizontal logo, dark wordmark (light backgrounds)
- `claimsaver-plus-lockup-on-dark.png` — horizontal logo, white wordmark (dark backgrounds)
- `claimsaver-plus-lockup-email.png` — 400×97 lockup for transactional email headers
- `claimsaver-plus-mark.png` — icon only
- `claimsaver-plus-icon-192.png` / `claimsaver-plus-icon-512.png` — PWA icons
- `claimsaver-og-share-1200x630.png` — Open Graph / Twitter share image

Favicon and Apple touch icon are generated from the mark in `apps/web/src/app/icon.png` and `apple-icon.png`.

## Family Image

- `family.jpg` — Who We Are page hero (family story)
- `founder1.jpg` — Founder portrait (Who We Are + IG promo)

The family image should be:

- High quality (recommended: 1200x800 pixels or larger)
- Shows the founder's family in a professional yet warm setting
- Represents the family values and personal story behind ClaimSaver+
- Optimized for web (compressed but maintaining quality)

## Image Usage

The family image is used on the "Who We Are" page to illustrate the personal story behind ClaimSaver+ and show the human element of the company.

## Social / Instagram

Landscape graphics live in `social/`; IG crops in `social/instagram/1x1/` (1080×1080) and `social/instagram/4x5/` (1080×1350).

Founder “Why we exist” promo (pinned post / Highlight):

- `social/week5-mon-founder-why-we-exist.png`
- `social/instagram/4x5/week5-mon-founder-why-we-exist.png` — **preferred for IG feed**
- `social/instagram/1x1/week5-mon-founder-why-we-exist.png`

Regenerate: `npm run social:founder-promo`

IG caption copy: `whoWeAre.founderBackground.igCaption` in locale files.

## Current Status

- ✅ `family.jpg`
- ✅ `founder1.jpg`
- ✅ Image component ready in the page
- ✅ Responsive design implemented
- ✅ Loading and error states handled
