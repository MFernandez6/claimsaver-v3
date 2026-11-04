/**
 * LEGAL REVIEW: checklist copy is sourced from apps/web/src/content/14days.ts.
 * Counsel should review before ads go live. Not legal advice.
 *
 * @react-pdf/renderer is not used: v4 fails to load under Node 20/tsx
 * (@react-pdf/hyphenate export map) and v3 is incompatible with React 19.
 * This script stays out of the Next.js runtime bundle.
 *
 * Run from repo root:
 *   npm run checklists:generate
 */
import { mkdir, writeFile } from "node:fs/promises";
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
const SITE = "https://www.claimsaverplus.com";
const PAGE_W = 612;
const PAGE_H = 792;

const ink = rgb(0.89, 0.91, 0.94);
const teal = rgb(0.176, 0.831, 0.749);
const muted = rgb(0.58, 0.64, 0.72);
const bg = rgb(0.008, 0.024, 0.09);

function wrap(text: string, font: PDFFont, size: number, max: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function renderLocale(locale: DaysLocale) {
  const copy = daysCopy[locale];
  const pageUrl = `${SITE}${copy.path}`;
  const pdf = await PDFDocument.create();
  pdf.setTitle(copy.metaTitle);
  pdf.setAuthor("ClaimSaver+");
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  const pages: PDFPage[] = [];
  const addPage = () => {
    const page = pdf.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: bg });
    pages.push(page);
    return page;
  };

  let page = addPage();
  let y = PAGE_H - 56;
  page.drawText("CLAIMSAVER+  ·  FLORIDA PIP", { x: 48, y, size: 9, font: bold, color: teal });
  y -= 38;
  page.drawText(copy.heroTitle, { x: 48, y, size: 36, font: bold, color: teal });
  y -= 22;
  page.drawText(copy.formHeading, { x: 48, y, size: 11, font: regular, color: ink });
  y -= 28;

  const textWidth = PAGE_W - 48 - 48 - 18;
  for (let i = 0; i < CHECKLIST_ITEMS[locale].length; i += 1) {
    const lines = wrap(`${i + 1}.  ${CHECKLIST_ITEMS[locale][i]}`, regular, 9.5, textWidth);
    const block = lines.length * 12 + 8;
    if (y - block < 120) {
      page = addPage();
      y = PAGE_H - 56;
    }
    page.drawRectangle({ x: 48, y: y - 2, width: 9, height: 9, borderColor: teal, borderWidth: 1.2 });
    for (const line of lines) {
      page.drawText(line, { x: 66, y, size: 9.5, font: regular, color: ink });
      y -= 12;
    }
    y -= 8;
  }

  const last = pages[pages.length - 1];
  const qrPng = await QRCode.toBuffer(pageUrl, {
    margin: 1,
    width: 256,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
  const qrImage = await pdf.embedPng(qrPng);
  const qrSize = 64;
  last.drawImage(qrImage, { x: PAGE_W - 48 - qrSize, y: 36, width: qrSize, height: qrSize });
  last.drawText(pageUrl.replace("https://", ""), {
    x: 48,
    y: 22,
    size: 6.5,
    font: regular,
    color: teal,
  });
  const discLines = wrap(PAGE_DISCLAIMER[locale], regular, 7, PAGE_W - 48 - 48 - qrSize - 16);
  let dy = 36 + discLines.length * 9;
  for (const line of discLines) {
    last.drawText(line, { x: 48, y: dy, size: 7, font: regular, color: muted });
    dy -= 9;
  }

  const filename = `14-day-pip-checklist-${locale}.pdf`;
  await writeFile(join(OUT_DIR, filename), await pdf.save());
  console.log("wrote", filename, `(${pages.length} page)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await renderLocale("en");
  await renderLocale("es");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
