/**
 * LEGAL REVIEW: checklist copy is sourced from apps/web/src/content/14days.ts.
 * Counsel should review before ads go live. Not legal advice.
 *
 * Run from repo root:
 *   npm run checklists:generate
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import {
  CHECKLIST_ITEMS,
  PAGE_DISCLAIMER,
  daysCopy,
  type DaysLocale,
} from "../apps/web/src/content/14days.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "apps/web/public/downloads");
const LOGO = join(ROOT, "apps/web/public/images/brand/claimsaver-plus-lockup.png");
const SITE = "https://www.claimsaverplus.com";
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 48;

function hex(value: string) {
  const n = Number.parseInt(value.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const teal = hex("#0d9488");
const tealDark = hex("#0f766e");
const tealSoft = hex("#ecfdf5");
const slate = hex("#0f172a");
const body = hex("#334155");
const muted = hex("#64748b");
const line = hex("#e2e8f0");
const paper = hex("#ffffff");
const wash = hex("#f8fafc");

function wrap(text: string, font: PDFFont, size: number, max: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

type Fonts = { regular: PDFFont; bold: PDFFont };

function drawHeader(
  page: PDFPage,
  fonts: Fonts,
  logo: { width: number; height: number; draw: (args: { x: number; y: number; width: number; height: number }) => void },
  kicker: string,
) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: paper });
  page.drawRectangle({ x: 0, y: PAGE_H - 72, width: PAGE_W, height: 72, color: wash });
  page.drawRectangle({ x: 0, y: PAGE_H - 74, width: PAGE_W, height: 2, color: teal });
  logo.draw({ x: MARGIN, y: PAGE_H - 58, width: logo.width, height: logo.height });
  const kickerWidth = fonts.bold.widthOfTextAtSize(kicker, 9);
  page.drawText(kicker, {
    x: PAGE_W - MARGIN - kickerWidth,
    y: PAGE_H - 42,
    size: 9,
    font: fonts.bold,
    color: tealDark,
  });
}

async function renderLocale(locale: DaysLocale) {
  const copy = daysCopy[locale];
  const pageUrl = `${SITE}${copy.path}`;
  const pdf = await PDFDocument.create();
  pdf.setTitle(copy.metaTitle);
  pdf.setAuthor("ClaimSaver+");
  pdf.setSubject("Florida 14-day PIP self-help checklist");
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };
  const logoBytes = await readFile(LOGO);
  const logoImage = await pdf.embedPng(logoBytes);
  const logoH = 22;
  const logoW = (logoImage.width / logoImage.height) * logoH;
  const logo = {
    width: logoW,
    height: logoH,
    draw: (args: { x: number; y: number; width: number; height: number }) => pageDrawImage(args),
  };

  const qrPng = await QRCode.toBuffer(pageUrl, {
    margin: 1,
    width: 256,
    color: { dark: "#0f766e", light: "#ffffff" },
  });
  const qrImage = await pdf.embedPng(qrPng);

  const pages: PDFPage[] = [];
  let page = pdf.addPage([PAGE_W, PAGE_H]);
  pages.push(page);
  const pageDrawImage = (args: { x: number; y: number; width: number; height: number }) => {
    page.drawImage(logoImage, args);
  };
  const kicker =
    locale === "es" ? "PIP EN FLORIDA" : locale === "fr" ? "PIP EN FLORIDE" : "FLORIDA PIP";
  drawHeader(page, fonts, logo, kicker);

  let y = PAGE_H - 118;
  page.drawText(copy.heroTitle, { x: MARGIN, y, size: 32, font: fonts.bold, color: slate });
  y -= 22;
  page.drawText(copy.formHeading, { x: MARGIN, y, size: 11, font: fonts.regular, color: muted });
  y -= 16;
  page.drawRectangle({ x: MARGIN, y, width: 56, height: 3, color: teal });
  y -= 22;

  const colX = MARGIN + 52;
  const textWidth = PAGE_W - colX - MARGIN;
  const items = CHECKLIST_ITEMS[locale];

  function ensureRoom(needed: number) {
    if (y - needed > 92) return;
    page = pdf.addPage([PAGE_W, PAGE_H]);
    pages.push(page);
    drawHeader(page, fonts, logo, kicker);
    y = PAGE_H - 108;
  }

  for (let i = 0; i < items.length; i += 1) {
    const lines = wrap(items[i], fonts.regular, 10.5, textWidth);
    const block = Math.max(28, lines.length * 14 + 16);
    ensureRoom(block);
    const rowBottom = y - block + 6;
    page.drawRectangle({
      x: MARGIN - 8,
      y: rowBottom,
      width: PAGE_W - MARGIN * 2 + 16,
      height: block,
      color: i % 2 === 0 ? wash : paper,
    });
    const cx = MARGIN + 12;
    const cy = y - 6;
    page.drawCircle({ x: cx, y: cy, size: 9, color: tealSoft, borderColor: teal, borderWidth: 1 });
    const num = String(i + 1);
    const numW = fonts.bold.widthOfTextAtSize(num, 8);
    page.drawText(num, { x: cx - numW / 2, y: cy - 3, size: 8, font: fonts.bold, color: tealDark });
    page.drawRectangle({
      x: MARGIN + 28,
      y: cy - 6,
      width: 11,
      height: 11,
      borderColor: teal,
      borderWidth: 1.25,
      color: paper,
    });
    let ty = y - 4;
    for (const line of lines) {
      page.drawText(line, { x: colX, y: ty, size: 10.5, font: fonts.regular, color: body });
      ty -= 14;
    }
    y = rowBottom - 6;
  }

  for (let i = 0; i < pages.length; i += 1) {
    const p = pages[i];
    p.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 78, color: wash });
    p.drawRectangle({ x: 0, y: 78, width: PAGE_W, height: 1.5, color: line });
    const qrSize = 46;
    p.drawImage(qrImage, { x: PAGE_W - MARGIN - qrSize, y: 16, width: qrSize, height: qrSize });
    const disc = wrap(PAGE_DISCLAIMER[locale], fonts.regular, 7, PAGE_W - MARGIN * 2 - qrSize - 16);
    let dy = 58;
    for (const row of disc.slice(0, 4)) {
      p.drawText(row, { x: MARGIN, y: dy, size: 7, font: fonts.regular, color: muted });
      dy -= 9;
    }
    p.drawText(pageUrl.replace("https://", ""), {
      x: MARGIN,
      y: 16,
      size: 7.5,
      font: fonts.bold,
      color: tealDark,
    });
    const label = `${i + 1} / ${pages.length}`;
    p.drawText(label, {
      x: PAGE_W - MARGIN - qrSize - 8 - fonts.regular.widthOfTextAtSize(label, 8),
      y: 18,
      size: 8,
      font: fonts.regular,
      color: muted,
    });
  }

  const filename = `14-day-pip-checklist-${locale}.pdf`;
  await writeFile(join(OUT_DIR, filename), await pdf.save());
  console.log("wrote", filename, `(${pages.length} page)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await renderLocale("en");
  await renderLocale("es");
  await renderLocale("fr");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
