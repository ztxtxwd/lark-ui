import { readFile, writeFile } from "node:fs/promises";

const file = new URL("../dist/index.d.ts", import.meta.url);
const source = await readFile(file, "utf8");
await writeFile(file, source.replace(/^import "\.\/styles\/index\.css";\n/m, ""));
