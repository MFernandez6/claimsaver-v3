import { inflateRawSync } from "node:zlib";

const MIME_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const ZIP_LOCAL = 0x04034b50;
const DOCX_CONTENT_TYPES = "[Content_Types].xml";
const DOCX_MARK = "wordprocessingml";

function sniff(buf: Buffer): string | null {
  if (buf.length >= 5 && buf.subarray(0, 5).equals(Buffer.from("%PDF-"))) return "application/pdf";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buf.length >= 12 && buf.toString("ascii", 4, 8) === "ftyp") {
    const brand = buf.toString("ascii", 8, 12).toLowerCase();
    if (brand.startsWith("hei") || brand.startsWith("mif") || brand.startsWith("msf")) {
      return "image/heic";
    }
  }
  if (buf.length >= 8 && buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0) {
    return "application/msword";
  }
  if (buf.length >= 4 && buf[0] === 0x50 && buf[1] === 0x4b) return "application/zip";
  return null;
}

function readZipStoredFile(buf: Buffer, wanted: string): Buffer | null {
  let i = 0;
  while (i + 30 <= buf.length) {
    if (buf.readUInt32LE(i) !== ZIP_LOCAL) {
      i += 1;
      continue;
    }
    const flags = buf.readUInt16LE(i + 6);
    const method = buf.readUInt16LE(i + 8);
    const compSize = buf.readUInt32LE(i + 18);
    const nameLen = buf.readUInt16LE(i + 26);
    const extraLen = buf.readUInt16LE(i + 28);
    if (flags & 0x0001) return null;
    const nameStart = i + 30;
    const nameEnd = nameStart + nameLen;
    if (nameEnd > buf.length) return null;
    const name = buf.subarray(nameStart, nameEnd).toString("utf8");
    const dataStart = nameEnd + extraLen;
    const usesDescriptor = Boolean(flags & 0x0008);
    if (name === wanted || name.endsWith(`/${wanted}`)) {
      if (usesDescriptor || dataStart + compSize > buf.length) return null;
      const payload = buf.subarray(dataStart, dataStart + compSize);
      if (method === 0) return Buffer.from(payload);
      if (method === 8) {
        try {
          return inflateRawSync(payload);
        } catch {
          return null;
        }
      }
      return null;
    }
    if (usesDescriptor) {
      i = dataStart;
      continue;
    }
    i = dataStart + compSize;
  }
  return null;
}

function isDocxZip(buf: Buffer): boolean {
  const xml = readZipStoredFile(buf, DOCX_CONTENT_TYPES);
  if (!xml) return false;
  return xml.toString("utf8").toLowerCase().includes(DOCX_MARK);
}

export function resolveUploadType(buf: Buffer, declared: string): { mime: string; ext: string } | null {
  const sniffed = sniff(buf);
  if (sniffed === "application/pdf" || sniffed === "image/jpeg" || sniffed === "image/png" || sniffed === "image/webp" || sniffed === "image/heic" || sniffed === "application/msword") {
    return { mime: sniffed, ext: MIME_EXT[sniffed] };
  }
  if (sniffed === "application/zip" && isDocxZip(buf)) {
    const declaredDocx =
      declared === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      declared === "application/octet-stream" ||
      declared === "";
    if (!declaredDocx && declared !== "application/zip") return null;
    return {
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ext: "docx",
    };
  }
  return null;
}
