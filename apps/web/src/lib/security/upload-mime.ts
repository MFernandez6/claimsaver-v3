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

export function resolveUploadType(buf: Buffer, declared: string): { mime: string; ext: string } | null {
  const sniffed = sniff(buf);
  if (sniffed === "application/pdf" || sniffed === "image/jpeg" || sniffed === "image/png" || sniffed === "image/webp" || sniffed === "image/heic" || sniffed === "application/msword") {
    return { mime: sniffed, ext: MIME_EXT[sniffed] };
  }
  if (
    sniffed === "application/zip" &&
    declared === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return {
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ext: "docx",
    };
  }
  return null;
}
