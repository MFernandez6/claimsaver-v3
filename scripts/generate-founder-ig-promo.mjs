#!/usr/bin/env node
/**
 * Generates founder "Why we exist" promo images for Instagram + web.
 * Run: node scripts/generate-founder-ig-promo.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const BRAND = {
  navy: "#1e293b",
  navyDark: "#0f172a",
  teal: "#0d9488",
  tealDark: "#115e59",
  emerald: "#059669",
  white: "#ffffff",
  slate50: "#f8fafc",
  slate200: "#e2e8f0",
  slate600: "#475569",
  slate700: "#334155",
  slate900: "#0f172a",
};

const SLUG = "week5-mon-founder-why-we-exist";
const COPY = {
  header: "WHY WE EXIST",
  subheader: "Founder background you can verify",
  name: "Miguel A. Fernandez, M.Sc.",
  role: "Founder · Miami, Florida",
  credentials: [
    "Paralegal & litigation experience",
    "M.Sc. Law & Policy",
    "Florida All-Lines Adjuster (6-20) · G279764",
  ],
  body:
    "Born from our family's accident claim in Miami. We built guided software for Florida PIP paperwork—flat $500, you stay the filer.",
  chips: ["Not a law firm", "Flat $500 access", "You stay in control"],
  disclaimer: "Founder background · Not a service sold on this platform",
  footerCta: "claimsaverplus.com",
};

const PATHS = {
  founderPhoto: path.join(ROOT, "apps/web/public/images/founder1.jpg"),
  lockupDark: path.join(ROOT, "apps/web/public/images/brand/claimsaver-plus-lockup-on-dark.png"),
  outLandscape: path.join(ROOT, "apps/web/public/images/social", `${SLUG}.png`),
  outIg4x5: path.join(
    ROOT,
    "apps/web/public/images/social/instagram/4x5",
    `${SLUG}.png`,
  ),
  outIg1x1: path.join(
    ROOT,
    "apps/web/public/images/social/instagram/1x1",
    `${SLUG}.png`,
  ),
};

function esc(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function circularFounderPhoto(size) {
  const border = Math.round(size * 0.04);
  const inner = size - border * 2;
  const photo = await sharp(PATHS.founderPhoto)
    .resize(inner, inner, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  const mask = Buffer.from(
    `<svg width="${inner}" height="${inner}"><circle cx="${inner / 2}" cy="${inner / 2}" r="${inner / 2}" fill="white"/></svg>`,
  );

  const rounded = await sharp(photo)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const ring = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="none" stroke="${BRAND.teal}" stroke-width="${border}"/>
    </svg>`,
  );

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: rounded, left: border, top: border },
      { input: ring, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}

function buildSvg({ width, height, layout }) {
  const headerH = layout.headerH;
  const footerH = layout.footerH;
  const pad = layout.pad;
  const bodyTop = headerH + layout.bodyTopGap;
  const photoSize = layout.photoSize;
  const photoX = layout.photoX ?? pad;
  const photoY = bodyTop;
  const textX = layout.textX ?? photoX + photoSize + layout.photoGap;
  const textW = width - textX - pad;

  const bodyLines = wrapText(COPY.body, layout.bodyWrap);
  const disclaimerLines = wrapText(COPY.disclaimer, layout.disclaimerWrap ?? 48);

  let credentialRows = "";
  COPY.credentials.forEach((cred, i) => {
    const y = layout.credStartY + i * layout.credGap;
    const num = i + 1;
    credentialRows += `
      <circle cx="${textX + 14}" cy="${y + 14}" r="14" fill="${BRAND.teal}"/>
      <text x="${textX + 14}" y="${y + 19}" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-size="13" font-weight="700" fill="${BRAND.white}">${num}</text>
      <text x="${textX + 38}" y="${y + 19}" font-family="Inter, DejaVu Sans, sans-serif" font-size="${layout.credFont}" font-weight="600" fill="${BRAND.slate700}">${esc(cred)}</text>
    `;
  });

  let chipRow = "";
  const chipStartX = pad;
  const chipY = layout.chipY;
  let chipX = chipStartX;
  COPY.chips.forEach((chip) => {
    const chipW = chip.length * (layout.chipFont * 0.55) + 28;
    chipRow += `
      <rect x="${chipX}" y="${chipY}" width="${chipW}" height="${layout.chipH}" rx="14" fill="${BRAND.white}" stroke="${BRAND.teal}" stroke-width="1.5"/>
      <text x="${chipX + chipW / 2}" y="${chipY + layout.chipH / 2 + 5}" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-size="${layout.chipFont}" font-weight="600" fill="${BRAND.tealDark}">${esc(chip)}</text>
    `;
    chipX += chipW + 12;
  });

  let bodyText = "";
  bodyLines.forEach((line, i) => {
    bodyText += `<text x="${pad}" y="${layout.bodyTextY + i * layout.bodyLineH}" font-family="Inter, DejaVu Sans, sans-serif" font-size="${layout.bodyFont}" fill="${BRAND.slate600}">${esc(line)}</text>`;
  });

  let disclaimerText = "";
  disclaimerLines.forEach((line, i) => {
    disclaimerText += `<text x="${pad}" y="${layout.disclaimerY + i * 16}" font-family="Inter, DejaVu Sans, sans-serif" font-size="11" fill="${BRAND.slate600}">${esc(line)}</text>`;
  });

  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${BRAND.slate50}"/>
          <stop offset="55%" stop-color="#ecfdf5"/>
          <stop offset="100%" stop-color="#dbeafe"/>
        </linearGradient>
        <linearGradient id="footer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${BRAND.emerald}"/>
          <stop offset="100%" stop-color="${BRAND.tealDark}"/>
        </linearGradient>
        <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="${BRAND.teal}" opacity="0.08"/>
        </pattern>
      </defs>

      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <rect width="${width}" height="${height}" fill="url(#dots)"/>

      <!-- header -->
      <rect width="${width}" height="${headerH}" fill="${BRAND.navy}"/>
      <text x="${width / 2}" y="${layout.headerTitleY}" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-size="${layout.headerFont}" font-weight="800" letter-spacing="3" fill="${BRAND.white}">${esc(COPY.header)}</text>
      <text x="${width / 2}" y="${layout.headerSubY}" text-anchor="middle" font-family="Inter, DejaVu Sans, sans-serif" font-size="${layout.headerSubFont}" font-weight="500" fill="#94a3b8">${esc(COPY.subheader)}</text>

      <!-- name block -->
      <text x="${textX}" y="${layout.nameY}" font-family="Inter, DejaVu Sans, sans-serif" font-size="${layout.nameFont}" font-weight="700" fill="${BRAND.slate900}">${esc(COPY.name)}</text>
      <text x="${textX}" y="${layout.roleY}" font-family="Inter, DejaVu Sans, sans-serif" font-size="${layout.roleFont}" fill="${BRAND.slate600}">${esc(COPY.role)}</text>

      ${credentialRows}
      ${bodyText}
      ${chipRow}
      ${disclaimerText}

      <!-- footer -->
      <rect y="${height - footerH}" width="${width}" height="${footerH}" fill="url(#footer)"/>
      <text x="${width - pad}" y="${height - footerH / 2 + 6}" text-anchor="end" font-family="Inter, DejaVu Sans, sans-serif" font-size="${layout.footerFont}" font-weight="700" letter-spacing="1" fill="${BRAND.white}">${esc(COPY.footerCta.toUpperCase())}</text>
    </svg>`,
  );
}

async function renderVariant({ width, height, layout, photoPlacement }) {
  const svg = buildSvg({ width, height, layout });
  const photo = await circularFounderPhoto(layout.photoSize);

  const composites = [{ input: svg, top: 0, left: 0 }];

  if (photoPlacement === "left") {
    composites.push({
      input: photo,
      left: layout.photoX ?? layout.pad,
      top: layout.headerH + layout.bodyTopGap,
    });
  } else {
    composites.push({
      input: photo,
      left: Math.round((width - layout.photoSize) / 2),
      top: layout.headerH + layout.bodyTopGap,
    });
  }

  const lockupMeta = await sharp(PATHS.lockupDark).metadata();
  const lockupH = layout.lockupH;
  const lockupW = Math.round((lockupMeta.width / lockupMeta.height) * lockupH);
  const lockup = await sharp(PATHS.lockupDark).resize(lockupW, lockupH).png().toBuffer();

  composites.push({
    input: lockup,
    left: layout.pad,
    top: height - layout.footerH + Math.round((layout.footerH - lockupH) / 2),
  });

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: BRAND.slate50,
    },
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  await fs.mkdir(path.dirname(PATHS.outIg4x5), { recursive: true });
  await fs.mkdir(path.dirname(PATHS.outIg1x1), { recursive: true });

  const landscape = await renderVariant({
    width: 1376,
    height: 768,
    photoPlacement: "left",
    layout: {
      headerH: 88,
      footerH: 72,
      pad: 48,
      headerFont: 34,
      headerSubFont: 16,
      headerTitleY: 48,
      headerSubY: 74,
      bodyTopGap: 36,
      photoSize: 200,
      photoX: 48,
      photoGap: 32,
      textX: 280,
      nameFont: 26,
      roleFont: 15,
      nameY: 160,
      roleY: 188,
      credStartY: 210,
      credGap: 38,
      credFont: 17,
      bodyTextY: 360,
      bodyFont: 16,
      bodyWrap: 72,
      bodyLineH: 24,
      chipY: 430,
      chipH: 32,
      chipFont: 13,
      disclaimerY: 490,
      disclaimerWrap: 90,
      footerH: 72,
      footerFont: 18,
      lockupH: 40,
    },
  });

  const ig4x5 = await renderVariant({
    width: 1080,
    height: 1350,
    photoPlacement: "center",
    layout: {
      headerH: 110,
      footerH: 88,
      pad: 56,
      headerFont: 38,
      headerSubFont: 18,
      headerTitleY: 58,
      headerSubY: 88,
      bodyTopGap: 40,
      photoSize: 220,
      photoX: 430,
      photoGap: 0,
      textX: 56,
      nameFont: 28,
      roleFont: 16,
      nameY: 420,
      roleY: 452,
      credStartY: 490,
      credGap: 52,
      credFont: 20,
      bodyTextY: 680,
      bodyFont: 19,
      bodyWrap: 52,
      bodyLineH: 28,
      chipY: 790,
      chipH: 36,
      chipFont: 14,
      disclaimerY: 880,
      disclaimerWrap: 58,
      footerH: 88,
      footerFont: 20,
      lockupH: 44,
    },
  });

  const ig1x1 = await renderVariant({
    width: 1080,
    height: 1080,
    photoPlacement: "center",
    layout: {
      headerH: 96,
      footerH: 80,
      pad: 48,
      headerFont: 34,
      headerSubFont: 16,
      headerTitleY: 52,
      headerSubY: 78,
      bodyTopGap: 28,
      photoSize: 180,
      photoX: 450,
      photoGap: 0,
      textX: 48,
      nameFont: 24,
      roleFont: 15,
      nameY: 350,
      roleY: 378,
      credStartY: 410,
      credGap: 44,
      credFont: 17,
      bodyTextY: 580,
      bodyFont: 16,
      bodyWrap: 58,
      bodyLineH: 24,
      chipY: 660,
      chipH: 32,
      chipFont: 13,
      disclaimerY: 730,
      disclaimerWrap: 58,
      footerH: 80,
      footerFont: 18,
      lockupH: 38,
    },
  });

  await fs.writeFile(PATHS.outLandscape, landscape);
  await fs.writeFile(PATHS.outIg4x5, ig4x5);
  await fs.writeFile(PATHS.outIg1x1, ig1x1);

  console.log("Generated founder IG promo assets:");
  console.log(`  ${PATHS.outLandscape}`);
  console.log(`  ${PATHS.outIg4x5}`);
  console.log(`  ${PATHS.outIg1x1}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
