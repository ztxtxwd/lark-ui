/**
 * Lark Theme Configuration
 *
 * Single source of truth for all semantic color tokens and typography.
 * Values follow the Universe Design palette and are normalized to the
 * canonical Lark desktop palette.
 *
 * Token naming:
 * - Key = token name used in codebase utilities (bg-lark-*, text-lark-*, ...)
 * - CSS variable: --color-lark-* / --text-color-lark-*
 *
 * All light/dark pairs are emitted as `light-dark()` so components never need
 * `dark:` variants.
 */

import type { ThemeConfig } from "./types.js";

type Pair = { light: string; dark: string };

/** Build a single light/dark token definition. */
function pair(light: string, dark: string) {
  return { newName: "", theme: { lark: { light, dark } } };
}

export const THEME_CONFIG: ThemeConfig = {
  /**
   * Text color tokens — used with text-{token}.
   */
  text: {
    /** Primary text / titles: #1f2329 light, #ebebeb dark. */
    "lark-default": pair("#1f2329", "#ebebeb"),
    /** Text on inverted/contrast surfaces. */
    "lark-inverse": pair("#ffffff", "#1f2329"),
    /** Emphasized titles. */
    "lark-strong": pair("#0f1114", "#f5f6f7"),
    /** Body / secondary copy: #646a73 light, #a6a6a6 dark. */
    "lark-subtle": pair("#646a73", "#a6a6a6"),
    /** Inactive / disabled text. */
    "lark-inactive": pair("#bbbfc4", "#5f5f5f"),
    /** Muted / placeholder text: #8f959e light, #757575 dark. */
    "lark-placeholder": pair("#8f959e", "#757575"),
    /** Lark brand blue. */
    "lark-brand": pair("#3370ff", "#4c88ff"),
    /** Lark brand blue on hover. */
    "lark-brand-hover": pair("#4e83fd", "#669eff"),
    /** Lark brand blue while pressed. */
    "lark-brand-pressed": pair("#245bdb", "#75a4ff"),
    /** Links. */
    "lark-link": pair("#3370ff", "#4c88ff"),
    /** Informational text. */
    "lark-info": pair("#3370ff", "#4c88ff"),
    /** Success text (Feishu green scale). */
    "lark-success": pair("#2ea121", "#51ba43"),
    /** Danger text (Feishu red scale). */
    "lark-danger": pair("#f54a45", "#f05b56"),
    /** Warning text (Feishu orange scale). */
    "lark-warning": pair("#ff8800", "#f3871b"),

    /*
     * Badge text tokens.
     */
    "lark-badge-orange-subtle": pair("#b26206", "#fec48b"),
    "lark-badge-teal-subtle": pair("#078372", "#6fe8d8"),
    "lark-badge-neutral-subtle": pair("#646a73", "#eff0f1"),
    "lark-badge-inverted": pair("#ffffff", "#1f2329"),
  },

  /**
   * Surface / border / fill tokens — used with bg-*, border-*, ring-*, fill-*.
   */
  color: {
    /** App/page canvas behind surfaces. */
    "lark-canvas": pair("#f5f6f7", "#1a1a1a"),
    /** Elevated surface (popovers, cards). */
    "lark-elevated": pair("#ffffff", "#262626"),
    /** Recessed surface (wells, inset panels). */
    "lark-recessed": pair("#eff0f1", "#1f1f1f"),
    /** Base surface. */
    "lark-base": pair("#ffffff", "#1a1a1a"),
    /** Subtle tinted surface. */
    "lark-tint": pair("#f5f6f7", "#1f1f1f"),
    /** High-contrast surface (tooltips, inverse chips). */
    "lark-contrast": pair("#1f2329", "#f5f6f7"),
    /** Overlay surface behind floating content. */
    "lark-overlay": pair("#f2f3f5", "#1f1f1f"),
    /** Default control background. */
    "lark-control": pair("#eff0f1", "#262626"),
    /** Active/pressed neutral interaction color. */
    "lark-interact": pair("#dee0e3", "#373a40"),
    /** Neutral fill. */
    "lark-fill": pair("#f2f3f5", "#262626"),
    /**
     * Muted neutral that also works with `fill-*` utilities.
     * `text-lark-subtle` lives in the text namespace, so `fill-lark-subtle`
     * needs a colour-namespace twin.
     */
    "lark-subtle": pair("#646a73", "#a6a6a6"),
    /** Placeholder neutral in the colour namespace (Feishu N500). */
    "lark-placeholder": pair("#8f959e", "#757575"),
    /**
     * Resting outline of checkboxes and radios (Feishu N500).
     * Darker than `lark-border`, which is used by the text inputs.
     */
    "lark-outline": pair("#8f959e", "#757575"),
    /** Disabled control outline / icon (Feishu N400). */
    "lark-disabled": pair("#bbbfc4", "#5f5f5f"),
    /** Disabled checked brand fill (Feishu `--primary-fill-solid-03`). */
    "lark-disabled-brand": pair("#bacefd", "#194294"),
    /** Chart grid lines (Feishu N300). */
    "lark-chart-grid": pair("#dee0e3", "#434343"),
    /** Scrollbar thumb (Feishu N900 at 30%). */
    "lark-scroll-thumb": pair("#b8babc", "#595959"),
    /** Code block content surface. */
    "lark-code-surface": pair("#f9fafb", "#171717"),
    /** Primary icon colour (Feishu `--icon-n1`). */
    "lark-icon": pair("#2b2f36", "#e8e8e8"),
    /** Brand tint (Feishu `--primary-pri-100`) — picker hover, range band. */
    "lark-brand-tint": pair("#e1eaff", "#173166"),
    /** Neutral divider (Feishu `--line-divider-default`). */
    "lark-divider": pair("rgba(31, 35, 41, 0.15)", "rgba(207, 207, 207, 0.15)"),
    /** Table header surface (Feishu `--udtoken-table-bg-head`). */
    "lark-table-head": pair("#f2f3f5", "#373737"),
    /** Neutral tag / chip background (Feishu `--udtoken-tag-neutral-bg-normal`). */
    "lark-tag-neutral-bg": pair(
      "rgba(31, 35, 41, 0.10)",
      "rgba(166, 166, 166, 0.20)",
    ),
    /** Table row hover background (Feishu `--udtoken-table-bg-hover`). */
    "lark-table-row-hover": pair("#eff0f1", "#434343"),
    /** Neutral fill hover. */
    "lark-fill-hover": pair(
      "rgba(31, 35, 41, 0.08)",
      "rgba(235, 235, 235, 0.08)",
    ),
    /** Neutral fill pressed / focused. */
    "lark-fill-pressed": pair(
      "rgba(31, 35, 41, 0.12)",
      "rgba(235, 235, 235, 0.12)",
    ),
    /** Brand-tinted fill for selected rows and options. */
    "lark-fill-selected": pair(
      "rgba(51, 112, 255, 0.08)",
      "rgba(76, 136, 255, 0.15)",
    ),
    /** Brand-tinted fill for active/pressed brand items. */
    "lark-fill-active": pair(
      "rgba(51, 112, 255, 0.12)",
      "rgba(76, 136, 255, 0.20)",
    ),
    /** Backdrop behind modal surfaces. */
    "lark-mask": pair("rgba(0, 0, 0, 0.55)", "rgba(0, 0, 0, 0.60)"),
    /** Brand fill. */
    "lark-brand": pair("#3370ff", "#4c88ff"),
    /** Brand hover. */
    "lark-brand-hover": pair("#4e83fd", "#669eff"),
    /** Borders and control outlines. */
    "lark-line": pair("#dee0e3", "#373a40"),
    /**
     * Component borders (inputs, selects, checkboxes…).
     * Feishu `--line-border-component` (N350) — one step darker than
     * `--line-border-card`, used for outlined form controls.
     */
    "lark-border": pair("#d0d3d6", "#505050"),
    /** Subtle dividers / hairlines. */
    "lark-hairline": pair("#e4e6eb", "#2e3033"),
    /** Focus ring color. */
    "lark-focus": pair("#3370ff", "#4c88ff"),
    /** Brand color under press. */
    "lark-brand-pressed": pair("#245bdb", "#75a4ff"),
    /** Tight shadow edge for thumbs/knobs. */
    "lark-shadow-edge": pair(
      "rgba(31, 35, 41, 0.12)",
      "rgba(255, 255, 255, 0.10)",
    ),
    /** Drop shadow color for thumbs/knobs. */
    "lark-shadow-drop": pair("rgba(31, 35, 41, 0.08)", "rgba(0, 0, 0, 0.30)"),
    /** Popover/tooltip arrow edge (light mode). */
    "lark-arrow-edge": pair("#dee0e3", "transparent"),
    /** Popover/tooltip arrow stroke (dark mode). */
    "lark-arrow-stroke": pair("transparent", "#373a40"),
    /** Info tint background. */
    "lark-info-tint": pair(
      "rgba(51, 112, 255, 0.10)",
      "rgba(76, 136, 255, 0.15)",
    ),
    /** Info solid color. */
    "lark-info": pair("#3370ff", "#4c88ff"),
    /**
     * Info outline color (Feishu `--B600`).
     * The outlined notice draws its 1px border one step stronger than the
     * status icon.
     */
    "lark-info-outline": pair("#1456f0", "#75a4ff"),
    /** Warning tint background. */
    "lark-warning-tint": pair(
      "rgba(255, 136, 0, 0.10)",
      "rgba(243, 135, 27, 0.18)",
    ),
    /** Warning solid color. */
    "lark-warning": pair("#ff8800", "#f3871b"),
    /** Warning fill hover. */
    "lark-warning-hover": pair("#ff9d4c", "#db7018"),
    /** Warning fill pressed. */
    "lark-warning-pressed": pair("#ed6d0c", "#f89e44"),
    /**
     * Warning outline color — the deeper step of Lark's orange accent.
     * Feishu's own `--Y600` is a gold that clashes with Lark's orange, so
     * the warning keeps its hue and takes the next step down instead.
     */
    "lark-warning-outline": pair("#ed6d0c", "#f89e44"),
    /** Danger tint background. */
    "lark-danger-tint": pair(
      "rgba(245, 74, 69, 0.10)",
      "rgba(240, 91, 86, 0.18)",
    ),
    /** Danger solid color. */
    "lark-danger": pair("#f54a45", "#f05b56"),
    /** Danger hover color (Lark international `--R400`). */
    "lark-danger-hover": pair("#f76964", "#f6827e"),
    /** Danger pressed color (Lark international `--R600`). */
    "lark-danger-pressed": pair("#d83931", "#d14642"),
    /** Danger outline color (Feishu `--R600`). */
    "lark-danger-outline": pair("#c02a26", "#f6827e"),
    /** Success tint background. */
    "lark-success-tint": pair(
      "rgba(52, 199, 36, 0.10)",
      "rgba(81, 186, 67, 0.18)",
    ),
    /** Success solid color. */
    "lark-success": pair("#34c724", "#51ba43"),
    /** Success fill hover. */
    "lark-success-hover": pair("#5cd168", "#35872a"),
    /** Success fill pressed. */
    "lark-success-pressed": pair("#32a645", "#51ba43"),
    /** Success outline color (Feishu `--G600`). */
    "lark-success-outline": pair("#1a7526", "#51ba43"),
    /** Informational banner background. */
    "lark-banner-info": pair(
      "rgba(51, 112, 255, 0.08)",
      "rgba(76, 136, 255, 0.12)",
    ),
    /** Warning banner background. */
    "lark-banner-warning": pair(
      "rgba(255, 136, 0, 0.10)",
      "rgba(243, 135, 27, 0.15)",
    ),
    /**
     * Notification accent bar (Feishu `ud__notification__notice-border`).
     * Lark international: info #4e83fd, success #62d256, warning #ffa53d,
     * danger #f76964.
     */
    "lark-notice-info": pair("#4e83fd", "#4c88ff"),
    "lark-notice-success": pair("#62d256", "#51ba43"),
    "lark-notice-warning": pair("#ffa53d", "#f3871b"),
    "lark-notice-danger": pair("#f76964", "#f05b56"),
    /** Solid informational banner background (Feishu notice filled). */
    "lark-banner-info-solid": pair("#e1eaff", "#152340"),
    /** Solid warning banner background (Feishu notice filled). */
    "lark-banner-warning-solid": pair("#feead2", "#331b0b"),
    /** Solid danger banner background (Feishu notice filled). */
    "lark-banner-danger-solid": pair("#fde2e2", "#3d1a19"),
    /** Solid success banner background (Feishu notice filled). */
    "lark-banner-success-solid": pair("#d9f5d6", "#0e2b0a"),
    /**
     * Outlined banner backgrounds (Feishu `ud__notice--outlined`).
     * The outlined theme tints the surface one step lighter than the filled
     * theme and adds a 1px border in the status colour:
     * `--function-{info,success,warning,danger}-50`.
     */
    "lark-banner-info-outlined": pair("#f0f4ff", "#152340"),
    "lark-banner-success-outlined": pair("#e4fae1", "#0e2b0a"),
    "lark-banner-warning-outlined": pair("#fff3e5", "#33230b"),
    "lark-banner-danger-outlined": pair("#fef0f0", "#3d1a19"),

    /*
     * Badge solid backgrounds.
     */
    "lark-badge-red": pair("#f54a45", "#e22e28"),
    "lark-badge-green": pair("#34c724", "#32a645"),
    "lark-badge-orange": pair("#ff8800", "#ed6d0c"),
    "lark-badge-purple": pair("#7f3bf5", "#8d55ed"),
    "lark-badge-teal": pair("#04b49c", "#2dbeab"),
    "lark-badge-blue": pair("#82a7fc", "#4c88ff"),
    "lark-badge-neutral": pair("#bbbfc4", "#646a73"),
    "lark-badge-inverted": pair("#1f2329", "#ffffff"),
  },

  /**
   * Typography — Feishu desktop scale.
   */
  typography: {
    xs: pairSize("12px"),
    "xs--line-height": pairSize("calc(1 / 0.75)"),
    sm: pairSize("13px"),
    "sm--line-height": pairSize("calc(1 / 0.85)"),
    base: pairSize("14px"),
    "base--line-height": pairSize("1.5"),
    lg: pairSize("16px"),
    "lg--line-height": pairSize("1.5"),
  },
};

function pairSize(value: string) {
  return { newName: "", theme: { lark: value } };
}

/** List of all available themes */
export const AVAILABLE_THEMES = ["lark"] as const;
export type AvailableTheme = (typeof AVAILABLE_THEMES)[number];
