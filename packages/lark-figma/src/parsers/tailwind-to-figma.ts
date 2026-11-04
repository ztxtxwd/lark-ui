/**
 * Tailwind to Figma Parser
 *
 * Parses Tailwind CSS classes from component variant definitions
 * and converts them to Figma-compatible values.
 *
 * This allows the Figma plugin to stay in sync with the component
 * source of truth (the LARK_*_VARIANTS objects).
 *
 * IMPORTANT: Scale constants are generated from CSS sources.
 * Run `npx tsx build-theme-data.ts` to regenerate theme-data.json.
 */

import themeData from "../generated/theme-data.json";

/**
 * Helper to get value from scale with fallback
 * (Figma plugin runtime doesn't support ?? operator)
 */
function getOrDefault(
  scale: Record<string, number>,
  key: string,
  fallback: number,
): number {
  const value = scale[key];
  return value !== undefined ? value : fallback;
}

/**
 * Convert an arbitrary CSS length to pixels.
 */
function toPixels(value: number, unit: string): number {
  if (unit === "rem" || unit === "em") return value * 16;
  return value;
}

/**
 * Tailwind spacing scale (in pixels)
 * Generated from: Tailwind v4 theme.css --spacing base unit
 */
const SPACING_SCALE: Record<string, number> = themeData.tailwind.spacing.scale;

/**
 * Lark font size scale (in pixels)
 * Generated from: theme-lark.css @theme definitions (Lark overrides Tailwind defaults)
 */
const FONT_SIZE_SCALE: Record<string, number> = {
  ...themeData.lark.fontSize,
  // Extended sizes from Tailwind defaults
  xl: themeData.tailwind.fontSize.xl,
  "2xl": themeData.tailwind.fontSize["2xl"],
  "3xl": themeData.tailwind.fontSize["3xl"],
};

/**
 * Tailwind border radius scale (in pixels)
 * Generated from: Tailwind v4 theme.css --radius-* values
 */
const BORDER_RADIUS_SCALE: Record<string, number> = {
  none: themeData.tailwind.borderRadius.none,
  xs: themeData.tailwind.borderRadius.xs,
  sm: themeData.tailwind.borderRadius.sm,
  DEFAULT: themeData.tailwind.borderRadius.sm, // Same as sm
  md: themeData.tailwind.borderRadius.md,
  lg: themeData.tailwind.borderRadius.lg,
  xl: themeData.tailwind.borderRadius.xl,
  "2xl": themeData.tailwind.borderRadius["2xl"],
  "3xl": themeData.tailwind.borderRadius["3xl"],
  "4xl": themeData.tailwind.borderRadius["4xl"],
  full: themeData.tailwind.borderRadius.full,
};

/**
 * Tailwind font weight scale
 * Generated from: Tailwind v4 theme.css --font-weight-* values
 */
const FONT_WEIGHT_SCALE: Record<string, number> = themeData.tailwind.fontWeight;

/**
 * Tailwind v4 named max-width scale (max-w-md, sm:max-w-2xl, …)
 * Generated from: theme-data.json (tailwind.maxWidth)
 */
const MAX_WIDTH_SCALE: Record<string, number> = themeData.tailwind.maxWidth;

/**
 * Map Lark semantic color classes to Figma variable names
 * These must match the lark-colors collection in Figma (generated from theme-lark.css)
 *
 * Variable names follow the pattern from theme-lark.css:
 * - Background/fill colors: "color-lark-{name}" (e.g., "color-lark-brand", "color-lark-base")
 * - Text colors: "text-color-lark-{name}" (e.g., "text-color-lark-default", "text-color-lark-subtle")
 */
const COLOR_TO_VARIABLE: Record<string, string> = {
  // Background colors (--color-lark-* tokens from theme-lark.css)
  "bg-lark-base": "color-lark-base",
  "bg-lark-elevated": "color-lark-elevated",
  "bg-lark-recessed": "color-lark-recessed",
  "bg-lark-overlay": "color-lark-overlay",
  "bg-lark-contrast": "color-lark-contrast",
  "bg-lark-control": "color-lark-control",
  "bg-lark-tint": "color-lark-tint",
  "bg-lark-interact": "color-lark-interact",
  "bg-lark-fill": "color-lark-fill",
  "bg-lark-brand": "color-lark-brand",
  "bg-lark-brand-hover": "color-lark-brand-hover",
  "bg-lark-brand-pressed": "color-lark-brand-pressed",
  "bg-lark-subtle": "color-lark-subtle",
  "bg-lark-banner-info-solid": "color-lark-banner-info-solid",
  "bg-lark-banner-warning-solid": "color-lark-banner-warning-solid",
  "bg-lark-banner-danger-solid": "color-lark-banner-danger-solid",
  "bg-lark-banner-success-solid": "color-lark-banner-success-solid",
  "bg-lark-banner-info-outlined": "color-lark-banner-info-outlined",
  "bg-lark-banner-warning-outlined": "color-lark-banner-warning-outlined",
  "bg-lark-banner-danger-outlined": "color-lark-banner-danger-outlined",
  "bg-lark-banner-success-outlined": "color-lark-banner-success-outlined",
  "bg-lark-fill-hover": "color-lark-fill-hover",
  "bg-lark-fill-pressed": "color-lark-fill-pressed",
  "bg-lark-fill-selected": "color-lark-fill-selected",
  "bg-lark-fill-active": "color-lark-fill-active",
  "bg-lark-mask": "color-lark-mask",
  "bg-lark-line": "color-lark-line",
  "bg-lark-border": "color-lark-border",
  "bg-lark-hairline": "color-lark-hairline",
  "bg-lark-outline": "color-lark-outline",
  "bg-lark-placeholder": "color-lark-placeholder",
  "bg-lark-disabled": "color-lark-disabled",
  "bg-lark-code-surface": "color-lark-code-surface",
  "bg-lark-table-head": "color-lark-table-head",
  "bg-lark-tag-neutral-bg": "color-lark-tag-neutral-bg",
  "bg-lark-badge-red": "color-lark-badge-red",
  "bg-lark-badge-green": "color-lark-badge-green",
  "bg-lark-badge-orange": "color-lark-badge-orange",
  "bg-lark-badge-purple": "color-lark-badge-purple",
  "bg-lark-badge-teal": "color-lark-badge-teal",
  "bg-lark-badge-blue": "color-lark-badge-blue",
  "bg-lark-badge-neutral": "color-lark-badge-neutral",
  "bg-lark-badge-inverted": "color-lark-badge-inverted",
  "bg-lark-info": "color-lark-info",
  "bg-lark-info-tint": "color-lark-info-tint",
  "bg-lark-warning": "color-lark-warning",
  "bg-lark-warning-tint": "color-lark-warning-tint",
  "bg-lark-warning-hover": "color-lark-warning-hover",
  "bg-lark-warning-pressed": "color-lark-warning-pressed",
  "bg-lark-danger": "color-lark-danger",
  "bg-lark-danger-tint": "color-lark-danger-tint",
  "bg-lark-danger-hover": "color-lark-danger-hover",
  "bg-lark-danger-pressed": "color-lark-danger-pressed",
  "bg-lark-success": "color-lark-success",
  "bg-lark-success-tint": "color-lark-success-tint",
  "bg-lark-success-hover": "color-lark-success-hover",
  "bg-lark-success-pressed": "color-lark-success-pressed",
  "bg-transparent": null!, // No fill
  "bg-inherit": null!, // No fill

  // Text colors (--text-color-lark-* tokens from theme-lark.css)
  "text-white": null!, // Hardcoded white
  "text-lark-default": "text-color-lark-default",
  "text-lark-inverse": "text-color-lark-inverse",
  "text-lark-strong": "text-color-lark-strong",
  "text-lark-subtle": "text-color-lark-subtle",
  "text-lark-inactive": "text-color-lark-inactive",
  "text-lark-placeholder": "text-color-lark-placeholder",
  "text-lark-brand": "text-color-lark-brand",
  "text-lark-brand-hover": "text-color-lark-brand-hover",
  "text-lark-brand-pressed": "text-color-lark-brand-pressed",
  "text-lark-link": "text-color-lark-link",
  "text-lark-success": "text-color-lark-success",
  "text-lark-danger": "text-color-lark-danger",
  "text-lark-warning": "text-color-lark-warning",
  "text-lark-info": "text-color-lark-info",
  "text-lark-badge-teal-subtle": "text-color-lark-badge-teal-subtle",
  "text-lark-badge-inverted": "text-color-lark-badge-inverted",
  "!text-white": null!, // Hardcoded white (important)
  "!text-lark-default": "text-color-lark-default",
  "!text-lark-danger": "text-color-lark-danger",

  // Border colors (use --color-lark-* tokens)
  "border-lark-line": "color-lark-line",
  "border-lark-hairline": "color-lark-hairline",
  "border-lark-border": "color-lark-border",
  "border-lark-recessed": "color-lark-recessed",
  "border-lark-outline": "color-lark-outline",
  "border-lark-brand": "color-lark-brand",
  "border-lark-fill": "color-lark-fill",
  "border-lark-info": "color-lark-info",
  "border-lark-warning": "color-lark-warning",
  "border-lark-danger": "color-lark-danger",
  "border-lark-success": "color-lark-success",
  "border-lark-info-outline": "color-lark-info-outline",
  "border-lark-warning-outline": "color-lark-warning-outline",
  "border-lark-danger-outline": "color-lark-danger-outline",
  "border-lark-success-outline": "color-lark-success-outline",
  "ring-lark-line": "color-lark-line",
  "ring-lark-border": "color-lark-border",
  "ring-lark-hairline": "color-lark-hairline",
  "ring-lark-brand": "color-lark-brand",
  "ring-lark-brand-pressed": "color-lark-brand-pressed",
  "ring-lark-outline": "color-lark-outline",
  "ring-lark-disabled": "color-lark-disabled",
  "ring-lark-focus": "color-lark-focus",
  "ring-lark-fill": "color-lark-fill",
  "ring-lark-info": "color-lark-info",
  "ring-lark-warning": "color-lark-warning",
  "fill-lark-subtle": "color-lark-subtle",
  "fill-lark-info": "color-lark-info",
  "fill-lark-warning": "color-lark-warning",
  "fill-lark-danger": "color-lark-danger",
  "fill-lark-success": "color-lark-success",
  "fill-lark-contrast": "color-lark-contrast",
  "fill-lark-elevated": "color-lark-elevated",
  "fill-lark-arrow-edge": "color-lark-arrow-edge",
  "fill-lark-arrow-stroke": "color-lark-arrow-stroke",
  "ring-lark-danger": "color-lark-danger",
};

/**
 * Responsive breakpoint prefixes.
 *
 * Figma renders a single viewport, so breakpoint-prefixed sizing utilities
 * are read *through* the prefix: the `sm` breakpoint carries the fixed width
 * the components use on desktop (e.g. `sm:w-96` for the dialog).
 */
const BREAKPOINT_PREFIX = "(?:sm|md|lg|xl|2xl):";

/**
 * Optional responsive breakpoint prefix ("sm:", "md:", …).
 */
const OPTIONAL_BREAKPOINT = "(?:" + BREAKPOINT_PREFIX + ")?";

/**
 * Parsed style information from Tailwind classes
 */
export type ParsedStyles = {
  // Layout
  height?: number;
  width?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  paddingX?: number;
  paddingY?: number;
  paddingLeft?: number;
  paddingRight?: number;
  gap?: number;
  /** Horizontal gap (gap-x-*) */
  gapX?: number;
  /** Vertical gap (gap-y-*) */
  gapY?: number;
  borderRadius?: number;

  // Typography
  fontSize?: number;
  fontWeight?: number;

  // Colors (Figma variable names)
  fillVariable?: string | null;
  fillOpacity?: number;
  textVariable?: string | null;
  textOpacity?: number;
  strokeVariable?: string | null;
  strokeOpacity?: number;

  // Special flags
  isWhiteText?: boolean;
  hasBorder?: boolean;
  borderStyle?: "solid" | "dashed";

  // Border properties
  strokeWeight?: number;
  dashPattern?: number[];

  // State variants (hover, focus, active, disabled, pressed)
  states?: {
    hover?: ParsedStyles;
    focus?: ParsedStyles;
    active?: ParsedStyles;
    disabled?: ParsedStyles;
    pressed?: ParsedStyles;
  };

  /**
   * Data-attribute variants, keyed by `attribute=value`
   * (e.g. `data-[banner-theme=outlined]:bg-lark-banner-danger-outlined`
   * lands in `data["banner-theme=outlined"]`).
   */
  data?: Record<string, ParsedStyles>;
};

/**
 * Parse a Tailwind class string and extract Figma-compatible values
 */
export function parseTailwindClasses(classes: string): ParsedStyles {
  const result: ParsedStyles = {};
  const classList = classes.split(/\s+/).filter(Boolean);

  for (const cls of classList) {
    // Parse state variants (hover:, focus:, active:, disabled:, pressed:)
    // Pattern: state:class-name
    const stateMatch = cls.match(
      /^(hover|focus|active|disabled|pressed):(.+)$/,
    );
    if (stateMatch) {
      const state = stateMatch[1] as
        "hover" | "focus" | "active" | "disabled" | "pressed";
      const stateClass = stateMatch[2];

      // Parse the state class recursively
      const stateParsed = parseTailwindClasses(stateClass);

      // Add to states object if anything was parsed
      if (Object.keys(stateParsed).length > 0) {
        if (!result.states) {
          result.states = {};
        }
        result.states[state] = stateParsed;
      }
      continue;
    }

    // Parse data-attribute variants (data-[attr=value]:class-name).
    // These drive alternative surfaces a component swaps in at runtime
    // (e.g. the Banner's outlined theme).
    const dataMatch = cls.match(/^data-\[([\w-]+)=([^\]]+)\]:(.+)$/);
    if (dataMatch) {
      const key = `${dataMatch[1]}=${dataMatch[2]}`;
      const dataParsed = parseTailwindClasses(dataMatch[3]);

      if (Object.keys(dataParsed).length > 0) {
        if (!result.data) {
          result.data = {};
        }
        result.data[key] = { ...result.data[key], ...dataParsed };
      }
      continue;
    }

    // Skip other colon-prefixed classes (except ! important).
    // Breakpoint-prefixed sizing utilities (e.g. "sm:w-96") are parsed below.
    if (
      cls.includes(":") &&
      !cls.startsWith("!") &&
      !cls.match(new RegExp("^" + BREAKPOINT_PREFIX))
    ) {
      continue;
    }

    // Arbitrary value patterns: w-[350px], h-[2.5rem], min-w-[32rem], max-h-[100px]
    const arbitraryMatch = cls.match(
      new RegExp(
        "^" +
          OPTIONAL_BREAKPOINT +
          "(w|h|min-w|min-h|max-w|max-h)-\\[(\\d+(?:\\.\\d+)?)(px|rem|em)?\\]$",
      ),
    );
    if (arbitraryMatch) {
      const property = arbitraryMatch[1];
      const value = parseFloat(arbitraryMatch[2]);
      const unit = arbitraryMatch[3] || "px";

      // Convert rem and em to px (rem/em * 16 = px)
      const pxValue = unit === "px" ? value : value * 16;

      // Map property to result key
      if (property === "w") {
        result.width = pxValue;
      } else if (property === "h") {
        result.height = pxValue;
      } else if (property === "min-w") {
        result.minWidth = pxValue;
      } else if (property === "min-h") {
        result.minHeight = pxValue;
      } else if (property === "max-w") {
        result.maxWidth = pxValue;
      } else if (property === "max-h") {
        result.maxHeight = pxValue;
      }
      continue;
    }

    // Min-width: min-w-72, min-w-96 (Tailwind spacing scale)
    const minWidthMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "min-w-(\\d+\\.?\\d*)$"),
    );
    if (minWidthMatch) {
      result.minWidth = getOrDefault(
        SPACING_SCALE,
        minWidthMatch[1],
        parseFloat(minWidthMatch[1]) * 4,
      );
      continue;
    }

    // Width: w-96, sm:w-96 (Tailwind spacing scale)
    const widthMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "w-(\\d+\\.?\\d*)$"),
    );
    if (widthMatch) {
      result.width = getOrDefault(
        SPACING_SCALE,
        widthMatch[1],
        parseFloat(widthMatch[1]) * 4,
      );
      continue;
    }

    // Max width: max-w-md, sm:max-w-2xl (Tailwind v4 named scale)
    const maxWidthMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "max-w-([\\w-]+)$"),
    );
    if (maxWidthMatch) {
      const namedWidth = MAX_WIDTH_SCALE[maxWidthMatch[1]];
      if (namedWidth !== undefined) {
        result.maxWidth = namedWidth;
        continue;
      }
    }

    // Height: h-5, h-6.5, h-9, h-10
    const heightMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "h-(\\d+\\.?\\d*)$"),
    );
    if (heightMatch) {
      result.height = getOrDefault(
        SPACING_SCALE,
        heightMatch[1],
        parseFloat(heightMatch[1]) * 4,
      );
      continue;
    }

    // Size (width and height): size-3.5, size-6.5, size-9, size-10
    const sizeMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "size-(\\d+\\.?\\d*)$"),
    );
    if (sizeMatch) {
      const size = getOrDefault(
        SPACING_SCALE,
        sizeMatch[1],
        parseFloat(sizeMatch[1]) * 4,
      );
      result.width = size;
      result.height = size;
      continue;
    }

    // Padding X: px-1.5, px-2, px-3, px-4
    const pxMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "px-(\\d+\\.?\\d*)$"),
    );
    if (pxMatch) {
      result.paddingX = getOrDefault(
        SPACING_SCALE,
        pxMatch[1],
        parseFloat(pxMatch[1]) * 4,
      );
      continue;
    }

    // Padding X (arbitrary): px-[11px]
    const pxArbitraryMatch = cls.match(/^px-\[(\d+(?:\.\d+)?)(px|rem|em)?\]$/);
    if (pxArbitraryMatch) {
      result.paddingX = toPixels(
        parseFloat(pxArbitraryMatch[1]),
        pxArbitraryMatch[2] ?? "px",
      );
      continue;
    }

    // Padding left/right (arbitrary): pl-[11px], pr-2
    const plArbitraryMatch = cls.match(
      /^pl-\[(\d+(?:\.\d+)?)(px|rem|em)?\]$/,
    );
    if (plArbitraryMatch) {
      result.paddingLeft = toPixels(
        parseFloat(plArbitraryMatch[1]),
        plArbitraryMatch[2] ?? "px",
      );
      continue;
    }

    const prArbitraryMatch = cls.match(
      /^pr-\[(\d+(?:\.\d+)?)(px|rem|em)?\]$/,
    );
    if (prArbitraryMatch) {
      result.paddingRight = toPixels(
        parseFloat(prArbitraryMatch[1]),
        prArbitraryMatch[2] ?? "px",
      );
      continue;
    }

    // Padding left/right (spacing scale): pl-4, pr-2
    const plMatch = cls.match(/^pl-(\d+\.?\d*)$/);
    if (plMatch) {
      result.paddingLeft = getOrDefault(
        SPACING_SCALE,
        plMatch[1],
        parseFloat(plMatch[1]) * 4,
      );
      continue;
    }

    const prMatch = cls.match(/^pr-(\d+\.?\d*)$/);
    if (prMatch) {
      result.paddingRight = getOrDefault(
        SPACING_SCALE,
        prMatch[1],
        parseFloat(prMatch[1]) * 4,
      );
      continue;
    }

    // Padding Y: py-0.5, py-1, py-2
    const pyMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "py-(\\d+\\.?\\d*)$"),
    );
    if (pyMatch) {
      result.paddingY = getOrDefault(
        SPACING_SCALE,
        pyMatch[1],
        parseFloat(pyMatch[1]) * 4,
      );
      continue;
    }

    // Padding Y (arbitrary): py-[9px]
    const pyArbitraryMatch = cls.match(
      /^py-\[(\d+(?:\.\d+)?)(px|rem|em)?\]$/,
    );
    if (pyArbitraryMatch) {
      result.paddingY = toPixels(
        parseFloat(pyArbitraryMatch[1]),
        pyArbitraryMatch[2] ?? "px",
      );
      continue;
    }

    // Gap: gap-1, gap-1.5, gap-2
    const gapMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "gap-(\\d+\\.?\\d*)$"),
    );
    if (gapMatch) {
      result.gap = getOrDefault(
        SPACING_SCALE,
        gapMatch[1],
        parseFloat(gapMatch[1]) * 4,
      );
      continue;
    }

    // Horizontal / vertical gap: gap-x-1, gap-y-0.5
    const gapXMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "gap-x-(\\d+\\.?\\d*)$"),
    );
    if (gapXMatch) {
      result.gapX = getOrDefault(
        SPACING_SCALE,
        gapXMatch[1],
        parseFloat(gapXMatch[1]) * 4,
      );
      continue;
    }

    const gapYMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "gap-y-(\\d+\\.?\\d*)$"),
    );
    if (gapYMatch) {
      result.gapY = getOrDefault(
        SPACING_SCALE,
        gapYMatch[1],
        parseFloat(gapYMatch[1]) * 4,
      );
      continue;
    }

    // Border radius: rounded-sm, rounded-md, rounded-lg, rounded-full
    // Breakpoint-prefixed radii (sm:rounded-lg) win — Figma renders the
    // desktop breakpoint.
    const radiusMatch = cls.match(
      new RegExp("^" + OPTIONAL_BREAKPOINT + "rounded-?(\\w*)$"),
    );
    if (radiusMatch) {
      const key = radiusMatch[1] || "DEFAULT";
      result.borderRadius = getOrDefault(
        BORDER_RADIUS_SCALE,
        key,
        BORDER_RADIUS_SCALE.DEFAULT,
      );
      continue;
    }

    // Font size: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
    // Tailwind v4 also allows a line-height modifier: text-xs/[inherit]
    const fontMatch = cls.match(
      /^text-(xs|sm|base|lg|xl|2xl|3xl)(?:\/\[[^\]]+\])?$/,
    );
    if (fontMatch) {
      result.fontSize = FONT_SIZE_SCALE[fontMatch[1]];
      continue;
    }

    // Font weight: font-thin, font-light, font-normal, font-medium, font-semibold, font-bold
    const fontWeightMatch = cls.match(
      /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    );
    if (fontWeightMatch) {
      result.fontWeight = FONT_WEIGHT_SCALE[fontWeightMatch[1]];
      continue;
    }

    // Background colors (with optional opacity: bg-lark-info/20)
    if (cls.startsWith("bg-")) {
      // Check for opacity modifier (e.g., bg-lark-info/20)
      const opacityMatch = cls.match(/^(bg-[^/]+)\/([0-9]+)$/);
      if (opacityMatch) {
        const baseClass = opacityMatch[1];
        const opacityValue = opacityMatch[2];
        const varName = COLOR_TO_VARIABLE[baseClass];
        if (varName !== undefined) {
          // Use opacity variant variable directly (e.g., "color-info/20")
          // These are generated by sync-tokens-to-figma.ts
          result.fillVariable = `${varName}/${opacityValue}`;
          // ALSO extract numeric opacity for generator flexibility
          result.fillOpacity = parseInt(opacityValue, 10) / 100;
        }
      } else {
        const varName = COLOR_TO_VARIABLE[cls];
        if (varName !== undefined) {
          result.fillVariable = varName;
        }
      }
      continue;
    }

    // Text colors (including !important variants and opacity modifiers)
    if (cls.startsWith("text-") || cls.startsWith("!text-")) {
      // Check for opacity modifier (e.g., text-surface/50, !text-error/80, text-white/90)
      const opacityMatch = cls.match(/^(!?text-[^/]+)\/([0-9]+)$/);
      if (opacityMatch) {
        const baseClass = opacityMatch[1];
        const opacityValue = opacityMatch[2];
        const varName = COLOR_TO_VARIABLE[baseClass];
        // Extract numeric opacity
        result.textOpacity = parseInt(opacityValue, 10) / 100;
        // Set variable (null for white)
        if (varName !== undefined) {
          result.textVariable =
            varName !== null ? `${varName}/${opacityValue}` : null;
        }
        // Check for white text flag
        if (baseClass === "text-white" || baseClass === "!text-white") {
          result.isWhiteText = true;
        }
      } else {
        const varName = COLOR_TO_VARIABLE[cls];
        if (varName !== undefined) {
          result.textVariable = varName;
          if (cls === "text-white" || cls === "!text-white") {
            result.isWhiteText = true;
          }
        }
      }
      continue;
    }

    // Border
    if (cls === "border" || cls.startsWith("border-")) {
      result.hasBorder = true;

      // Parse border width: border (1px default), etc.
      if (cls === "border") {
        result.strokeWeight = 1;
      } else {
        const widthMatch = cls.match(/^border-(\d+)$/);
        if (widthMatch) {
          result.strokeWeight = parseInt(widthMatch[1], 10);
          continue;
        }
      }

      // Parse border style
      if (cls === "border-dashed") {
        result.borderStyle = "dashed";
        result.dashPattern = [4, 4];
      } else if (cls.startsWith("border-") && !cls.includes("dashed")) {
        // Check for opacity modifier (e.g., border-lark-danger/50)
        const opacityMatch = cls.match(/^(border-[^/]+)\/([0-9]+)$/);
        if (opacityMatch) {
          const baseClass = opacityMatch[1];
          const opacityValue = opacityMatch[2];
          const varName = COLOR_TO_VARIABLE[baseClass];
          if (varName) {
            result.strokeVariable = `${varName}/${opacityValue}`;
            result.strokeOpacity = parseInt(opacityValue, 10) / 100;
          }
        } else {
          const varName = COLOR_TO_VARIABLE[cls];
          if (varName) {
            result.strokeVariable = varName;
          }
        }
      }
      continue;
    }

    // Ring (used as border in some variants)
    if (cls === "ring" || cls.startsWith("ring-")) {
      result.hasBorder = true;
      // Check for opacity modifier (e.g., ring-lark-hairline/50)
      const opacityMatch = cls.match(/^(ring-[^/]+)\/([0-9]+)$/);
      if (opacityMatch) {
        const baseClass = opacityMatch[1];
        const opacityValue = opacityMatch[2];
        const varName = COLOR_TO_VARIABLE[baseClass];
        if (varName) {
          result.strokeVariable = `${varName}/${opacityValue}`;
          result.strokeOpacity = parseInt(opacityValue, 10) / 100;
        }
      } else {
        const varName = COLOR_TO_VARIABLE[cls];
        if (varName) {
          result.strokeVariable = varName;
        }
      }
      continue;
    }
  }

  return result;
}

/**
 * Parse base styles string (like from badgeVariants or buttonVariants)
 */
export function parseBaseStyles(baseStylesString: string): ParsedStyles {
  return parseTailwindClasses(baseStylesString);
}
