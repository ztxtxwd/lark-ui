#!/usr/bin/env npx tsx
/**
 * Build Theme Data
 *
 * Generates theme-data.json from CSS source files at BUILD TIME.
 * This eliminates hardcoded numeric values in the Figma plugin.
 *
 * Sources:
 *   - packages/lark/src/styles/theme-lark.css (Lark overrides)
 *   - node_modules/tailwindcss/theme.css (Tailwind v4 defaults)
 *   - packages/lark/src/components/button/button.tsx (compactSize)
 *
 * Output:
 *   packages/lark-figma/src/generated/theme-data.json
 *
 * Usage:
 *   pnpm run build:data (from packages/lark-figma)
 */

import { writeFileSync, readFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths - reference sibling lark package
const LARK_PKG = join(__dirname, "../../lark");
const LARK_THEME_CSS = join(LARK_PKG, "src/styles/theme-lark.css");
const LARK_BINDING_CSS = join(LARK_PKG, "src/styles/lark-binding.css");
const BUTTON_TSX = join(LARK_PKG, "src/components/button/button.tsx");

/**
 * Find Tailwind's theme.css (handles pnpm structure)
 * Searches both lark package and monorepo root node_modules
 */
function getTailwindThemeCssPath(): string {
  // Try lark package's node_modules first
  const larkDirectPath = join(LARK_PKG, "node_modules/tailwindcss/theme.css");
  try {
    readFileSync(larkDirectPath);
    return larkDirectPath;
  } catch {
    // Ignore and try next location
  }

  // Try monorepo root node_modules
  const monorepoRoot = join(__dirname, "../../..");
  const rootDirectPath = join(
    monorepoRoot,
    "node_modules/tailwindcss/theme.css",
  );
  try {
    readFileSync(rootDirectPath);
    return rootDirectPath;
  } catch {
    // Ignore and try pnpm structure
  }

  // Try pnpm structure in lark package
  try {
    const pnpmBasePath = join(LARK_PKG, "node_modules/.pnpm");
    const pnpmDirs = readdirSync(pnpmBasePath);
    const tailwindDir = pnpmDirs.find((d: string) =>
      d.startsWith("tailwindcss@"),
    );

    if (tailwindDir) {
      return join(
        pnpmBasePath,
        tailwindDir,
        "node_modules/tailwindcss/theme.css",
      );
    }
  } catch {
    // Ignore and try monorepo pnpm
  }

  // Try pnpm structure in monorepo root
  try {
    const pnpmBasePath = join(monorepoRoot, "node_modules/.pnpm");
    const pnpmDirs = readdirSync(pnpmBasePath);
    const tailwindDir = pnpmDirs.find((d: string) =>
      d.startsWith("tailwindcss@"),
    );

    if (tailwindDir) {
      return join(
        pnpmBasePath,
        tailwindDir,
        "node_modules/tailwindcss/theme.css",
      );
    }
  } catch {
    // Final fallback failed
  }

  throw new Error(
    "Could not find tailwindcss/theme.css in lark package or monorepo root",
  );
}

/**
 * Convert rem to pixels (16px base)
 */
function remToPx(remValue: string): number {
  const num = parseFloat(remValue.replace("rem", ""));
  return Math.round(num * 16);
}

/**
 * Parse Lark's theme-lark.css for font sizes
 * Lark overrides Tailwind defaults: xs=12, sm=13, base=14, lg=16
 */
function parseLarkFontSizes(css: string): Record<string, number> {
  const sizes: Record<string, number> = {};

  // Match: --text-xs: 12px; or --text-sm: 13px;
  const pxMatches = css.matchAll(/--text-(\w+):\s*(\d+)px/g);
  for (const match of pxMatches) {
    sizes[match[1]] = parseInt(match[2], 10);
  }

  // Match rem values: --text-xl: 1.25rem;
  const remMatches = css.matchAll(/--text-(\w+):\s*([\d.]+)rem/g);
  for (const match of remMatches) {
    if (!sizes[match[1]]) {
      sizes[match[1]] = remToPx(match[2] + "rem");
    }
  }

  return sizes;
}

/**
 * Parse Tailwind v4 theme.css for spacing base unit
 */
function parseTailwindSpacing(css: string): { baseUnitPx: number } {
  // Tailwind v4: --spacing: 0.25rem = 4px
  const match = css.match(/--spacing:\s*([\d.]+)rem/);
  if (!match) {
    throw new Error("Could not find --spacing in tailwind theme.css");
  }
  return { baseUnitPx: remToPx(match[1] + "rem") };
}

/**
 * Parse Tailwind v4 theme.css for border radius values
 */
function parseTailwindBorderRadius(css: string): Record<string, number> {
  const radii: Record<string, number> = {};
  const names = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"];

  for (const name of names) {
    const pattern = new RegExp(`--radius-${name}:\\s*([\\d.]+)rem`);
    const match = css.match(pattern);
    if (match) {
      radii[name] = remToPx(match[1] + "rem");
    }
  }

  return radii;
}

/**
 * Parse Tailwind v4 theme.css for font sizes (defaults, may be overridden by Lark)
 */
function parseTailwindFontSizes(css: string): Record<string, number> {
  const sizes: Record<string, number> = {};
  const names = [
    "xs",
    "sm",
    "base",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "7xl",
    "8xl",
    "9xl",
  ];

  for (const name of names) {
    const pattern = new RegExp(`--text-${name}:\\s*([\\d.]+)rem`);
    const match = css.match(pattern);
    if (match) {
      sizes[name] = remToPx(match[1] + "rem");
    }
  }

  return sizes;
}

/**
 * Parse Tailwind v4 theme.css for font weights
 */
function parseTailwindFontWeights(css: string): Record<string, number> {
  const weights: Record<string, number> = {};
  const names = [
    "thin",
    "extralight",
    "light",
    "normal",
    "medium",
    "semibold",
    "bold",
    "extrabold",
    "black",
  ];

  for (const name of names) {
    const pattern = new RegExp(`--font-weight-${name}:\\s*(\\d+)`);
    const match = css.match(pattern);
    if (match) {
      weights[name] = parseInt(match[1], 10);
    }
  }

  return weights;
}

/**
 * Parse Tailwind v4 theme.css for shadow definitions
 */
function parseTailwindShadows(css: string): Record<
  string,
  {
    layers: Array<{
      offsetX: number;
      offsetY: number;
      blur: number;
      spread: number;
      opacity: number;
    }>;
  }
> {
  const shadows: Record<
    string,
    {
      layers: Array<{
        offsetX: number;
        offsetY: number;
        blur: number;
        spread: number;
        opacity: number;
      }>;
    }
  > = {};
  const names = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"];

  for (const name of names) {
    const pattern = new RegExp(`--shadow-${name}:\\s*([^;]+);`);
    const match = css.match(pattern);
    if (match) {
      shadows[name] = parseShadowString(match[1].trim());
    }
  }

  return shadows;
}

/**
 * Parse CSS shadow string into structured layers
 */
function parseShadowString(shadowStr: string): {
  layers: Array<{
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    opacity: number;
  }>;
} {
  const layers: Array<{
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    opacity: number;
  }> = [];

  // Split by comma for multi-layer shadows
  const layerStrings = shadowStr.split(/,\s*(?=\d)/);

  for (const layer of layerStrings) {
    const match = layer.match(
      /(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?(?:\s+(-?[\d.]+)(?:px)?)?\s+rgb\([^/]+\/\s*([\d.]+)\)/,
    );

    if (match) {
      layers.push({
        offsetX: parseFloat(match[1]),
        offsetY: parseFloat(match[2]),
        blur: parseFloat(match[3]),
        spread: match[4] ? parseFloat(match[4]) : 0,
        opacity: parseFloat(match[5]),
      });
    }
  }

  return { layers };
}

/**
 * Tailwind v4 max-width utility scale.
 *
 * Tailwind v4 defines `--max-w-*` in the utility layer rather than in
 * theme.css, so the named scale is listed here explicitly.
 */
const MAX_WIDTH_SCALE: Record<string, number> = {
  xs: 320, // 20rem
  sm: 384, // 24rem
  md: 448, // 28rem
  lg: 512, // 32rem
  xl: 576, // 36rem
  "2xl": 672, // 42rem
  "3xl": 768, // 48rem
  "4xl": 896, // 56rem
  "5xl": 1024, // 64rem
  "6xl": 1152, // 72rem
  "7xl": 1280, // 80rem
  "8xl": 1440, // 90rem
  "9xl": 1536, // 96rem
};

/**
 * Parse the Feishu `--shadow-lark-*` elevation tokens.
 *
 * Source: packages/lark/src/styles/lark-binding.css
 *
 * The Lark shadows are multi-layer and use `light-dark(rgba(...), rgba(...))`
 * colours. Figma cannot bind a shadow to a variable, so the light-mode colour
 * is stored and the dark-mode variant is kept alongside it.
 */
function parseLarkShadows(css: string): Record<
  string,
  {
    layers: Array<{
      offsetX: number;
      offsetY: number;
      blur: number;
      spread: number;
      opacity: number;
      color: { r: number; g: number; b: number };
      darkColor: { r: number; g: number; b: number };
      darkOpacity: number;
    }>;
  }
> {
  const shadows: Record<
    string,
    {
      layers: Array<{
        offsetX: number;
        offsetY: number;
        blur: number;
        spread: number;
        opacity: number;
        color: { r: number; g: number; b: number };
        darkColor: { r: number; g: number; b: number };
        darkOpacity: number;
      }>;
    }
  > = {};

  const names = ["xs", "sm", "md", "lg", "popover", "modal", "notification"];

  for (const name of names) {
    const match = css.match(
      new RegExp(`--shadow-lark-${name}:\\s*([\\s\\S]*?);`),
    );
    if (!match) continue;

    const layers: Array<{
      offsetX: number;
      offsetY: number;
      blur: number;
      spread: number;
      opacity: number;
      color: { r: number; g: number; b: number };
      darkColor: { r: number; g: number; b: number };
      darkOpacity: number;
    }> = [];

    // Split the declaration into its individual shadow layers
    for (const layer of splitShadowLayers(match[1])) {
      const geometry = layer.match(
        /^\s*(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?(?:\s+(-?[\d.]+)(?:px)?)?\s/,
      );
      if (!geometry) continue;

      const light = layer.match(
        /light-dark\(\s*rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*,\s*rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*\)/,
      );
      if (!light) continue;

      layers.push({
        offsetX: parseFloat(geometry[1]),
        offsetY: parseFloat(geometry[2]),
        blur: parseFloat(geometry[3]),
        spread: geometry[4] ? parseFloat(geometry[4]) : 0,
        opacity: parseFloat(light[4]),
        color: {
          r: parseFloat(light[1]) / 255,
          g: parseFloat(light[2]) / 255,
          b: parseFloat(light[3]) / 255,
        },
        darkOpacity: parseFloat(light[8]),
        darkColor: {
          r: parseFloat(light[5]) / 255,
          g: parseFloat(light[6]) / 255,
          b: parseFloat(light[7]) / 255,
        },
      });
    }

    if (layers.length > 0) {
      shadows[name] = { layers };
    }
  }

  return shadows;
}

/**
 * Split a CSS shadow declaration into its layers.
 * Commas inside `rgba()` / `light-dark()` must not split a layer.
 */
function splitShadowLayers(value: string): string[] {
  const layers: string[] = [];
  let depth = 0;
  let current = "";

  for (const char of value) {
    if (char === "(") depth++;
    if (char === ")") depth--;

    if (char === "," && depth === 0) {
      layers.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }

  if (current.trim()) layers.push(current.trim());
  return layers;
}

/**
 * Generate full spacing scale from base unit
 */
function generateSpacingScale(baseUnitPx: number): Record<string, number> {
  const keys = [
    "0",
    "px",
    "0.5",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "4.5",
    "5",
    "6",
    "6.5", // Lark custom
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "20",
    "24",
    "28",
    "32",
    "36",
    "40",
    "44",
    "48",
    "52",
    "56",
    "60",
    "64",
    "72",
    "80",
    "96",
  ];

  const scale: Record<string, number> = {};

  for (const key of keys) {
    if (key === "0") {
      scale[key] = 0;
    } else if (key === "px") {
      scale[key] = 1;
    } else {
      scale[key] = Math.round(parseFloat(key) * baseUnitPx);
    }
  }

  return scale;
}

/**
 * Parse button.tsx for compactSize values
 */
function parseButtonCompactSizes(tsx: string): Record<string, number> {
  const sizes: Record<string, number> = {};
  const sizeNames = ["xs", "sm", "base", "lg"];

  for (const name of sizeNames) {
    // Match: xs: { classes: "size-6 min-w-0" }
    // The class string may carry extra utilities after the size token, so the
    // match stops at the first whitespace instead of the closing quote.
    const pattern = new RegExp(
      `${name}:\\s*\\{\\s*classes:\\s*["']size-([\\d.]+)`,
    );
    const match = tsx.match(pattern);
    if (match) {
      // Convert Tailwind size to pixels: size-X = X * 4
      sizes[name] = Math.round(parseFloat(match[1]) * 4);
    }
  }

  return sizes;
}

// Main execution
console.log("📖 Parsing CSS source files for Figma plugin...\n");

// Read source files
const larkThemeCss = readFileSync(LARK_THEME_CSS, "utf-8");
const larkBindingCss = readFileSync(LARK_BINDING_CSS, "utf-8");
const tailwindThemeCss = readFileSync(getTailwindThemeCssPath(), "utf-8");
const buttonTsx = readFileSync(BUTTON_TSX, "utf-8");

// Parse Tailwind v4 defaults
console.log("📦 Parsing Tailwind v4 theme.css...");
const tailwindSpacing = parseTailwindSpacing(tailwindThemeCss);
const tailwindBorderRadius = parseTailwindBorderRadius(tailwindThemeCss);
const tailwindFontSizes = parseTailwindFontSizes(tailwindThemeCss);
const tailwindFontWeights = parseTailwindFontWeights(tailwindThemeCss);
const tailwindShadows = parseTailwindShadows(tailwindThemeCss);

console.log(`   - Base spacing unit: ${tailwindSpacing.baseUnitPx}px`);
console.log(
  `   - Border radii: ${Object.keys(tailwindBorderRadius).length} values`,
);
console.log(`   - Font sizes: ${Object.keys(tailwindFontSizes).length} values`);
console.log(
  `   - Font weights: ${Object.keys(tailwindFontWeights).length} values`,
);
console.log(`   - Shadows: ${Object.keys(tailwindShadows).length} values`);

// Parse Lark overrides (typography is now in theme-lark.css, generated by codegen:themes)
console.log("\n🎨 Parsing Lark theme-lark.css overrides...");
const larkFontSizes = parseLarkFontSizes(larkThemeCss);
console.log(
  `   - Font size overrides: xs=${larkFontSizes.xs}px, sm=${larkFontSizes.sm}px, base=${larkFontSizes.base}px, lg=${larkFontSizes.lg}px`,
);

// Parse the Feishu elevation shadows
console.log("\n🌗 Parsing Lark shadow tokens...");
const larkShadows = parseLarkShadows(larkBindingCss);
console.log(`   - Shadow tokens: ${Object.keys(larkShadows).join(", ")}`);

// Parse button compact sizes
console.log("\n🔘 Parsing button.tsx compact sizes...");
const buttonCompactSizes = parseButtonCompactSizes(buttonTsx);
console.log(
  `   - Compact sizes: xs=${buttonCompactSizes.xs}px, sm=${buttonCompactSizes.sm}px, base=${buttonCompactSizes.base}px, lg=${buttonCompactSizes.lg}px`,
);

// Generate full spacing scale
const spacingScale = generateSpacingScale(tailwindSpacing.baseUnitPx);

// Build final theme data
const themeData = {
  _generated: new Date().toISOString(),
  _sources: [
    "packages/lark/src/styles/theme-lark.css",
    "packages/lark/src/styles/lark-binding.css",
    "node_modules/tailwindcss/theme.css",
    "packages/lark/src/components/button/button.tsx",
  ],

  // Tailwind v4 base values
  tailwind: {
    spacing: {
      baseUnitPx: tailwindSpacing.baseUnitPx,
      scale: spacingScale,
    },
    borderRadius: {
      ...tailwindBorderRadius,
      full: 9999,
      none: 0,
    },
    fontSize: tailwindFontSizes,
    fontWeight: tailwindFontWeights,
    shadows: tailwindShadows,
    maxWidth: MAX_WIDTH_SCALE,
  },

  // Lark-specific overrides
  lark: {
    fontSize: larkFontSizes,
    buttonCompactSize: buttonCompactSizes,
    shadows: larkShadows,
  },

  // Pre-computed values for direct import in generators
  // These are the "final" values combining Tailwind defaults + Lark overrides
  computed: {
    // For shared.ts SPACING constant
    spacing: {
      xs: spacingScale["1"], // gap-1 = 4px
      sm: spacingScale["1.5"], // gap-1.5 = 6px
      base: spacingScale["2"], // gap-2 = 8px
      lg: spacingScale["3"], // gap-3 = 12px
    },

    // For shared.ts BORDER_RADIUS constant (from Tailwind v4)
    borderRadius: {
      xs: tailwindBorderRadius.xs, // 2px
      sm: tailwindBorderRadius.sm, // 4px
      md: tailwindBorderRadius.md, // 6px
      lg: tailwindBorderRadius.lg, // 8px
      xl: tailwindBorderRadius.xl, // 12px
      full: 9999,
    },

    // For shared.ts FONT_SIZE constant (Lark overrides)
    fontSize: {
      xs: larkFontSizes.xs, // 12px
      sm: larkFontSizes.sm, // 13px (Lark override)
      base: larkFontSizes.base, // 14px (Lark override)
      lg: larkFontSizes.lg, // 16px (Lark override)
    },

    // For shared.ts FALLBACK_VALUES.fontWeight
    fontWeight: {
      normal: tailwindFontWeights.normal, // 400
      medium: tailwindFontWeights.medium, // 500
      semiBold: tailwindFontWeights.semibold, // 600
    },

    // For shared.ts FALLBACK_VALUES.buttonCompactSize
    buttonCompactSize: buttonCompactSizes,

    // For shared.ts SHADOWS (computed from Tailwind)
    shadows: {
      xs: tailwindShadows.xs,
      lg: tailwindShadows.lg,
    },
  },
};

// Ensure generated directory exists
const generatedDir = join(__dirname, "generated");
mkdirSync(generatedDir, { recursive: true });

// Write theme data
const outputPath = join(generatedDir, "theme-data.json");
writeFileSync(outputPath, JSON.stringify(themeData, null, 2));

console.log(`\n✅ Wrote ${outputPath}`);
console.log("\n📋 Summary:");
console.log(`   - Spacing scale: ${Object.keys(spacingScale).length} values`);
console.log(
  `   - Border radius: ${Object.keys(themeData.computed.borderRadius).length} values`,
);
console.log(
  `   - Font sizes: ${Object.keys(themeData.computed.fontSize).length} values (Lark overrides)`,
);
console.log(
  `   - Font weights: ${Object.keys(themeData.computed.fontWeight).length} values`,
);
console.log(
  `   - Button compact sizes: ${Object.keys(buttonCompactSizes).length} values`,
);
