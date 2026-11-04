import { describe, expect, it } from "vite-plus/test";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { getComponentData } from "./component-registry";
import { PROP_DESCRIPTIONS_ZH } from "./prop-descriptions";

const pagesDir = join(import.meta.dirname, "../pages");

/** Every `.mdx` and `.astro` page under `src/pages`. */
function collectPages(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectPages(full);
    return entry.endsWith(".mdx") || entry.endsWith(".astro") ? [full] : [];
  });
}

interface PropsTableUsage {
  component: string;
  hiddenProps: string[];
}

/** Parse every `<PropsTable component="X" hiddenProps={[...]} />` usage. */
function collectPropsTableUsages(): PropsTableUsage[] {
  const usages: PropsTableUsage[] = [];

  for (const page of collectPages(pagesDir)) {
    const source = readFileSync(page, "utf-8");
    const pattern = /<PropsTable\s+component="([^"]+)"([^>]*)\/?>/g;

    for (const match of source.matchAll(pattern)) {
      const [, component, rest] = match;
      const hidden = rest.match(/hiddenProps=\{\[([^\]]*)\]\}/);
      const hiddenProps = hidden
        ? [...hidden[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
        : [];
      usages.push({ component, hiddenProps });
    }
  }

  return usages;
}

const usages = collectPropsTableUsages();

describe("prop description translations", () => {
  it("finds props tables to check", () => {
    expect(usages.length).toBeGreaterThan(0);
  });

  it("translates every prop description rendered by a props table", () => {
    const missing: string[] = [];

    for (const { component, hiddenProps } of usages) {
      const data = getComponentData(component);
      if (!data) continue;

      for (const [propName, prop] of Object.entries(data.props)) {
        if (propName === "ref" || propName === "key") continue;
        if (hiddenProps.includes(propName)) continue;
        if (!prop.description) continue;

        const key = `${component}.${propName}`;
        const translation = PROP_DESCRIPTIONS_ZH[key];
        if (!translation) {
          missing.push(key);
        } else {
          expect(translation, key).toMatch(/[一-鿿]/);
        }
      }
    }

    expect(missing, `Missing prop translations: ${missing.join(", ")}`).toEqual(
      [],
    );
  });

  it("has no unused translations", () => {
    const used = new Set<string>();

    for (const { component, hiddenProps } of usages) {
      const data = getComponentData(component);
      if (!data) continue;

      for (const propName of Object.keys(data.props)) {
        if (propName === "ref" || propName === "key") continue;
        if (hiddenProps.includes(propName)) continue;
        used.add(`${component}.${propName}`);
      }
    }

    const unused = Object.keys(PROP_DESCRIPTIONS_ZH).filter(
      (key) => !used.has(key),
    );

    expect(unused, `Unused prop translations: ${unused.join(", ")}`).toEqual(
      [],
    );
  });
});
