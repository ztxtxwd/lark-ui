import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve once — points at the sibling lark package root
const larkRoot = resolve(__dirname, "../../../lark");
const larkSrc = resolve(larkRoot, "src");

/**
 * Map every `@lark-ui/core` sub-path export to its source equivalent.
 *
 * In dev mode Vite will resolve these to the raw .ts/.tsx source files,
 * which means file-watcher-based HMR works instantly — no rebuild of
 * the lark package required.
 *
 * In production builds (astro build) this plugin is NOT loaded, so the
 * normal package.json `exports` field is used (dist/), which validates
 * the real consumer experience.
 */
const aliases: Record<string, string> = {
  // Main barrel — resolves to source index.ts
  "@lark-ui/core": resolve(larkSrc, "index.ts"),

  // CSS styles — resolve to source CSS
  "@lark-ui/core/styles/tailwind": resolve(larkSrc, "styles/lark.css"),
  "@lark-ui/core/styles/standalone": resolve(
    larkSrc,
    "styles/lark-standalone.css",
  ),
  "@lark-ui/core/styles": resolve(larkSrc, "styles/lark.css"),

  // JSON registry — these live outside src/ and are NOT built, so same
  // path works in dev and prod.  We alias anyway so Vite can resolve
  // the workspace:* link correctly and watch the file.
  "@lark-ui/core/ai/component-registry.json": resolve(
    larkRoot,
    "ai/component-registry.json",
  ),

  // Theme generator — resolve to source TS so the docs color page
  // always reflects the latest config without a lark build step.
  "@lark-ui/core/scripts/theme-generator/config": resolve(
    larkRoot,
    "scripts/theme-generator/config.ts",
  ),
  "@lark-ui/core/scripts/theme-generator/types": resolve(
    larkRoot,
    "scripts/theme-generator/types.ts",
  ),

  // Code highlighting has separate client and server entry points.
  "@lark-ui/core/code": resolve(larkSrc, "code/index.ts"),
  "@lark-ui/core/code/server": resolve(larkSrc, "code/server.tsx"),
};

/**
 * Vite plugin that rewires `@lark-ui/core` imports to the raw source
 * files of the sibling package during `astro dev`.
 *
 * **Why not just use `resolve.alias`?**
 * `resolve.alias` is a simple prefix match — it can't distinguish
 * `@lark-ui/core` from `@lark-ui/figma` without a trailing
 * slash, and it can't handle the overlapping sub-path exports cleanly.
 * A plugin gives us exact-match control.
 */
export function larkHmrPlugin() {
  return {
    name: "vite-plugin-lark-hmr",
    enforce: "pre" as const,

    resolveId(source: string) {
      // Exact match first (most imports)
      if (aliases[source]) {
        return aliases[source];
      }

      // Sub-path component imports: @lark-ui/core/components/button
      // → packages/lark/src/components/button/index.ts
      if (source.startsWith("@lark-ui/core/components/")) {
        const componentName = source.replace("@lark-ui/core/components/", "");
        return resolve(larkSrc, `components/${componentName}/index.ts`);
      }

      // Primitives: @lark-ui/core/primitives/dialog
      // → packages/lark/src/primitives/dialog.ts
      if (source.startsWith("@lark-ui/core/primitives/")) {
        const primitiveName = source.replace("@lark-ui/core/primitives/", "");
        return resolve(larkSrc, `primitives/${primitiveName}.ts`);
      }
      if (source === "@lark-ui/core/primitives") {
        return resolve(larkSrc, "primitives/index.ts");
      }

      // Utils barrel
      if (source === "@lark-ui/core/utils") {
        return resolve(larkSrc, "utils/index.ts");
      }

      // Catalog barrel
      if (source === "@lark-ui/core/catalog") {
        return resolve(larkSrc, "catalog/index.ts");
      }

      // Registry barrel
      if (source === "@lark-ui/core/registry") {
        return resolve(larkSrc, "registry/index.ts");
      }

      // Catch-all for any other @lark-ui/core/styles/* CSS imports
      if (source.startsWith("@lark-ui/core/styles/")) {
        const styleName = source.replace("@lark-ui/core/styles/", "");
        return resolve(larkSrc, `styles/${styleName}.css`);
      }

      return undefined;
    },

    configResolved(config: { server: { fs: { allow: string[] } } }) {
      // Append lark source to the existing allow list rather than replacing it.
      // Using config() would shallow-merge and override Astro/Vite defaults.
      if (config.server?.fs?.allow) {
        config.server.fs.allow.push(larkRoot);
      }
    },
  };
}
