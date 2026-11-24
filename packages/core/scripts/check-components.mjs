import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../src/components/", import.meta.url);
const indexFile = new URL("../src/index.ts", import.meta.url);
const entries = await readdir(root, { withFileTypes: true });
const components = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const indexSource = await readFile(indexFile, "utf8");
const problems = [];

for (const name of components) {
  for (const file of ["index.ts", `${name}.tsx`, `${name}.test.tsx`, `${name}.stories.tsx`]) {
    try {
      await access(join(root.pathname, name, file));
    } catch {
      problems.push(`${name}: missing ${file}`);
    }
  }
  if (!indexSource.includes(`from "./components/${name}"`)) {
    problems.push(`${name}: missing export in src/index.ts`);
  }
}

if (problems.length) {
  console.error(`Component contract failed:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
  process.exit(1);
}

console.log(`Component contract OK: ${components.length} components.`);
