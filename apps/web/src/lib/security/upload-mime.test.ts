import assert from "node:assert/strict";
import { deflateRawSync } from "node:zlib";
import test from "node:test";
import { resolveUploadType } from "./upload-mime";

function storedZip(name: string, content: Buffer): Buffer {
  const nameBuf = Buffer.from(name);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt32LE(content.length, 18);
  header.writeUInt32LE(content.length, 22);
  header.writeUInt16LE(nameBuf.length, 26);
  header.writeUInt16LE(0, 28);
  return Buffer.concat([header, nameBuf, content]);
}

function deflatedZip(name: string, content: Buffer): Buffer {
  const nameBuf = Buffer.from(name);
  const payload = deflateRawSync(content);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(8, 8);
  header.writeUInt32LE(payload.length, 18);
  header.writeUInt32LE(content.length, 22);
  header.writeUInt16LE(nameBuf.length, 26);
  header.writeUInt16LE(0, 28);
  return Buffer.concat([header, nameBuf, payload]);
}

const contentTypes = Buffer.from(
  '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
);

test("accepts a stored DOCX package", () => {
  const buf = storedZip("[Content_Types].xml", contentTypes);
  const resolved = resolveUploadType(buf, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  assert.equal(resolved?.ext, "docx");
});

test("accepts a deflated DOCX package", () => {
  const buf = deflatedZip("[Content_Types].xml", contentTypes);
  const resolved = resolveUploadType(buf, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  assert.equal(resolved?.ext, "docx");
});

test("rejects a random ZIP declared as DOCX", () => {
  const buf = storedZip("readme.txt", Buffer.from("not a word file"));
  const resolved = resolveUploadType(
    buf,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  assert.equal(resolved, null);
});

test("rejects ZIP whose Content_Types.xml is not Word", () => {
  const xml = Buffer.from(
    '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>',
  );
  const buf = storedZip("[Content_Types].xml", xml);
  const resolved = resolveUploadType(
    buf,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  assert.equal(resolved, null);
});

test("still accepts PDF magic", () => {
  const buf = Buffer.from("%PDF-1.4\n%");
  const resolved = resolveUploadType(buf, "application/pdf");
  assert.equal(resolved?.ext, "pdf");
});
