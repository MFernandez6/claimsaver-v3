import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { templates } from "./emails.mjs";

const dir = dirname(fileURLToPath(import.meta.url));

await mkdir(dir, { recursive: true });
for (const [name, { html }] of Object.entries(templates)) {
  const path = join(dir, `${name}.html`);
  await writeFile(path, `${html.trim()}\n`);
  console.log(`wrote ${path}`);
}
