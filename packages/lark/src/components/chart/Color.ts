/**
 * Categorical colors for light mode — used when assigning colors to data series
 * by index (e.g. the first series gets Blue, the second gets Cyan, etc.).
 *
 * The hue order and the individual steps come from Feishu's Universe Design
 * chart palette (`--ccmtoken-chart-aurora-*` / `--ccm-chart-*`): the first
 * series of a chart is the brand blue, then cyan, purple, yellow, red and
 * orange.
 */
enum ChartCategoricalLightColors {
  Blue = "#4E83FD",
  Cyan = "#50CEFB",
  Purple = "#935AF6",
  Yellow = "#FAD355",
  Red = "#F76964",
  Orange = "#FFA53D",
}

/**
 * Categorical colors for dark mode — same hue order as the light palette,
 * using the dark steps of the same Universe Design chart palette.
 */
enum ChartCategoricalDarkColors {
  Blue = "#54A5FD",
  Cyan = "#56D0FB",
  Purple = "#965EF6",
  Yellow = "#FAD45A",
  Red = "#F76B66",
  Orange = "#FFAA47",
}

/**
 * Semantic colors for light mode — used to convey meaning (status, severity)
 * rather than just distinguishing series. Use via `ChartPalette.semantic()`.
 *
 * These mirror the library's semantic tokens (`lark-danger`, `lark-warning`,
 * `lark-success`) so chart meaning matches the rest of the UI.
 */
enum ChartSemanticLightColors {
  Attention = "#F54A45",
  Warning = "#FF8800",
  Success = "#2EA121",
  Neutral = "#BACEFD",
  Disabled = "#BBBFC4",
  Skeleton = "#DEE0E3",
}

/**
 * Semantic colors for dark mode
 */
enum ChartSemanticDarkColors {
  Attention = "#F05B56",
  Warning = "#F3871B",
  Success = "#51BA43",
  Neutral = "#70A0FF",
  Disabled = "#5F5F5F",
  Skeleton = "#434343",
}

export type ChartSemanticColorName =
  "Attention" | "Warning" | "Success" | "Neutral" | "Disabled" | "Skeleton";

/**
 * Sequential color palettes for light mode with the colour in position #2 of the array as the base.
 *
 * Built from the Universe Design blue scale (`--ccm-chart-B*`); the base step
 * is the brand blue (`#3370ff`).
 */
const sequentialLight = {
  blues: ["#E1EAFF", "#82A7FC", "#3370FF", "#1C4CBA", "#0C296E"],
};

/**
 * Sequential color palettes for dark mode. These are the reverse of the light mode palettes using the same base color (position 2).
 */
const sequentialDark = {
  blues: ["#0C296E", "#1C4CBA", "#3370FF", "#82A7FC", "#E1EAFF"],
};

/** Colours for GeoJSON-based map charts. */
export interface MapColors {
  /** Fill for land / no-data regions. */
  area: string;
  /** Default bubble fill (the chart palette blue). */
  bubble: string;
  /**
   * Sequential ramp (low → high) for shading choropleth regions. Tuned so the
   * lowest band stays clearly distinct from the neutral no-data fill in both
   * modes (light: low = light blue → high = deep blue; dark: low = deep blue →
   * high = bright blue, so higher values read brighter against the dark base).
   */
  scale: string[];
}

/** Neutral land fill per mode; bubbles use the shared categorical palette. */
const mapAreaByMode = {
  light: "#DEE0E3",
  dark: "#434343",
} as const;

/**
 * Choropleth shading ramp per mode (ordered low → high), anchored on the shared
 * chart blue `#3370ff` (the brand blue, same as `categorical(0)`) so the maps
 * read as one family. Every step stays clearly blue, and the low ends are kept
 * distinct from the neutral no-data fill in both modes.
 */
const mapScaleByMode = {
  light: ["#BACEFD", "#82A7FC", "#4E83FD", "#245BDB", "#133C9A"],
  dark: ["#2851A3", "#2E65D1", "#4C88FF", "#99BBFF", "#CEDFFF"],
} as const;

/**
 * Ordered list of categorical colors for light mode, indexed by series position.
 * Used as the default ECharts color palette when `isDarkMode` is `false`.
 *
 * The order follows Feishu's Universe Design chart palette: blue → cyan →
 * purple → yellow → red → orange. Feishu's palette carries 30 steps per hue
 * family; the first six (one per family) are used here so the cycle length
 * stays at six.
 */
export const CHART_LIGHT_COLORS = [
  ChartCategoricalLightColors.Blue,
  ChartCategoricalLightColors.Cyan,
  ChartCategoricalLightColors.Purple,
  ChartCategoricalLightColors.Yellow,
  ChartCategoricalLightColors.Red,
  ChartCategoricalLightColors.Orange,
];

/**
 * Ordered list of categorical colors for dark mode, indexed by series position.
 * Used as the default ECharts color palette when `isDarkMode` is `true`.
 */
export const CHART_DARK_COLORS = [
  ChartCategoricalDarkColors.Blue,
  ChartCategoricalDarkColors.Cyan,
  ChartCategoricalDarkColors.Purple,
  ChartCategoricalDarkColors.Yellow,
  ChartCategoricalDarkColors.Red,
  ChartCategoricalDarkColors.Orange,
];

/**
 * Utilities for resolving Lark chart colors by semantic name or series index.
 * All functions accept an `isDarkMode` flag and return the appropriate color string.
 */
export namespace ChartPalette {
  /**
   * Returns the hex color for a named semantic value (status, severity, etc.).
   *
   * @example
   * ```ts
   * ChartPalette.semantic("Attention")           // "#F54A45" (light)
   * ChartPalette.semantic("Warning", true)       // "#F3871B" (dark)
   * ```
   */
  export function semantic(
    name: ChartSemanticColorName,
    isDarkMode = false,
  ): string {
    return isDarkMode
      ? ChartSemanticDarkColors[name]
      : ChartSemanticLightColors[name];
  }

  /**
   * Returns the categorical color for a given series index.
   * Wraps around via modulo when `index` exceeds the palette length (6 colors).
   *
   * @example
   * ```ts
   * ChartPalette.categorical(0)        // Blue (light)
   * ChartPalette.categorical(0, true)  // Blue (dark)
   * ChartPalette.categorical(6)        // wraps back to Blue
   * ```
   */
  export function categorical(index: number, isDarkMode = false): string {
    return isDarkMode
      ? CHART_DARK_COLORS[index % CHART_DARK_COLORS.length]
      : CHART_LIGHT_COLORS[index % CHART_LIGHT_COLORS.length];
  }

  /**
   * Returns all steps of a named sequential palette as an array.
   *
   * @example
   * ```ts
   * ChartPalette.sequential("blues")        // 5-step array (light)
   * ChartPalette.sequential("blues", true)  // 5-step array (dark)
   * ```
   */
  export function sequential(
    palette: keyof typeof sequentialLight,
    isDarkMode = false,
  ): string[] {
    return isDarkMode
      ? [...sequentialDark[palette]]
      : [...sequentialLight[palette]];
  }

  /**
   * Returns the hex color for chart text/labels.
   *
   * `primary` is the axis-label colour (`--text-caption`), `secondary` is the
   * muted caption colour (`--text-placeholder`).
   *
   * @example
   * ```ts
   * ChartPalette.text("primary")        // "#646A73" (light)
   * ChartPalette.text("primary", true)  // "#A6A6A6" (dark)
   * ChartPalette.text("secondary")      // "#8F959E" (light)
   * ```
   */
  export function text(variant: "primary" | "secondary", isDarkMode = false) {
    const colors = {
      light: { primary: "#646A73", secondary: "#8F959E" },
      dark: { primary: "#A6A6A6", secondary: "#757575" },
    };
    return isDarkMode ? colors.dark[variant] : colors.light[variant];
  }

  /** Returns colors for GeoJSON-based map charts. */
  export function mapColors(isDarkMode = false): MapColors {
    const mode = isDarkMode ? "dark" : "light";

    return {
      area: mapAreaByMode[mode],
      bubble: categorical(0, isDarkMode),
      scale: [...mapScaleByMode[mode]],
    };
  }
}
