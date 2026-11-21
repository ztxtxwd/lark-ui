/**
 * Toast Component Generator
 *
 * Generates a Toast ComponentSet that matches the React component:
 *
 * - Floating status notice at the top of the viewport
 * - Pale status tint with a 1px border in the status colour
 * - Filled 16px status icon + semibold title + description
 * - One variant per status (default / success / error / warning / info)
 *
 * Reads styles from component-registry.json (the source of truth).
 * Uses real icons from the Icon Library page.
 *
 * @see packages/lark/src/components/toast/toast.tsx
 */

import {
  createTextNode,
  getVariableByName,
  createModeSection,
  createRowLabel,
  bindFillToVariable,
  bindFillToVariableWithOpacity,
  bindTextColorToVariable,
  bindStrokeToVariable,
  BORDER_RADIUS,
  SECTION_PADDING,
  SECTION_GAP,
  SECTION_TITLE,
  SECTION_LAYOUT,
  GRID_LAYOUT,
  LARK_SHADOWS,
  createShadowEffects,
  SPACING,
  FALLBACK_VALUES,
  VAR_NAMES,
} from "./shared";
import themeData from "../generated/theme-data.json";
import { createIconInstance, bindIconColor } from "./icon-utils";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { logComplete } from "../logger";

// Import registry as source of truth
import registry from "@lark-ui/core/ai/component-registry.json";

const toastData = (registry.components as any).Toasty;
const toastStyling = toastData?.styling;
const variantProp = toastData?.props?.variant as
  | {
      values: string[];
      classes: Record<string, string>;
      descriptions: Record<string, string>;
      default: string;
    }
  | undefined;

/**
 * Fallback config using theme-data.json values to prevent drift.
 * Typography uses Tailwind fontSize values; spacing uses the Tailwind scale.
 */
const FALLBACK_TOAST_CONFIG = {
  // FIGMA-SPECIFIC: Fixed width for Figma canvas rendering.
  // The React component sizes to its content up to a 600px max width.
  width: 420,
  padding: themeData.tailwind.spacing.scale["5"], // px-5 = 20px
  paddingY: themeData.tailwind.spacing.scale["4"], // py-4 = 16px
  borderRadius: BORDER_RADIUS.lg, // rounded-lg = 8px
  gap: 10, // gap-2.5 = 10px
  titleFontSize: themeData.tailwind.fontSize.base, // text-base = 14px (Lark)
  titleFontWeight: FALLBACK_VALUES.fontWeight.semiBold, // font-semibold = 600
  descriptionFontSize: themeData.tailwind.fontSize.base,
  descriptionFontWeight: FALLBACK_VALUES.fontWeight.normal, // font-normal = 400
  iconSize: FALLBACK_VALUES.iconSize.sm, // size-4 = 16px
  textGap: SPACING.xs, // gap-1 = 4px
};

/**
 * Read Toast configuration from the registry with fallback.
 */
function getToastConfig() {
  if (!toastStyling) {
    return FALLBACK_TOAST_CONFIG;
  }

  return {
    width: toastStyling.container?.width ?? FALLBACK_TOAST_CONFIG.width,
    padding: toastStyling.container?.padding ?? FALLBACK_TOAST_CONFIG.padding,
    paddingY:
      toastStyling.container?.paddingY ?? FALLBACK_TOAST_CONFIG.paddingY,
    borderRadius:
      toastStyling.container?.borderRadius ??
      FALLBACK_TOAST_CONFIG.borderRadius,
    gap: toastStyling.container?.gap ?? FALLBACK_TOAST_CONFIG.gap,
    titleFontSize:
      toastStyling.title?.fontSize ?? FALLBACK_TOAST_CONFIG.titleFontSize,
    titleFontWeight:
      toastStyling.title?.fontWeight ?? FALLBACK_TOAST_CONFIG.titleFontWeight,
    descriptionFontSize:
      toastStyling.description?.fontSize ??
      FALLBACK_TOAST_CONFIG.descriptionFontSize,
    descriptionFontWeight:
      toastStyling.description?.fontWeight ??
      FALLBACK_TOAST_CONFIG.descriptionFontWeight,
    iconSize: toastStyling.icon?.size ?? FALLBACK_TOAST_CONFIG.iconSize,
    textGap: FALLBACK_TOAST_CONFIG.textGap,
  };
}

const TOAST_CONFIG = getToastConfig();

/**
 * Filled status icon per variant (Phosphor ids available to the Figma plugin)
 * and the icon colour token. The React component uses the same semantic
 * colours through `iconClasses` in `LARK_TOAST_VARIANTS`.
 */
const TOAST_ICONS: Record<
  string,
  { iconId: string | undefined; color: string | undefined }
> = {
  default: { iconId: undefined, color: undefined },
  success: { iconId: "ph-check", color: "text-lark-success" },
  error: { iconId: "ph-x", color: "text-lark-danger" },
  warning: { iconId: "ph-warning", color: "text-lark-warning" },
  info: { iconId: "ph-info", color: "text-lark-info" },
};

/**
 * TESTABLE EXPORTS - Pure functions that return intermediate data
 * These functions compute data without calling Figma APIs, enabling snapshot tests.
 */

/** Get variant configuration from registry. */
export function getToastVariantConfig() {
  if (!variantProp) {
    return {
      values: [] as string[],
      classes: {} as Record<string, string>,
      descriptions: {} as Record<string, string>,
      default: "",
    };
  }

  return {
    values: variantProp.values,
    classes: variantProp.classes,
    descriptions: variantProp.descriptions,
    default: variantProp.default,
  };
}

/** Get parsed styles for a specific variant. */
export function getToastParsedVariantStyles(variant: string) {
  const classes = variantProp?.classes?.[variant] || "";
  return {
    variant,
    classes,
    description: variantProp?.descriptions?.[variant] || "",
    parsed: parseTailwindClasses(classes),
  };
}

/** Get container styling configuration from registry. */
export function getContainerConfig() {
  return {
    raw: toastStyling?.container,
    width: TOAST_CONFIG.width,
    padding: TOAST_CONFIG.padding,
    paddingY: TOAST_CONFIG.paddingY,
    borderRadius: TOAST_CONFIG.borderRadius,
    background: toastStyling?.container?.background,
    border: toastStyling?.container?.border,
    shadow: toastStyling?.container?.shadow,
    gap: TOAST_CONFIG.gap,
  };
}

/** Get title styling configuration from registry. */
export function getTitleConfig() {
  return {
    raw: toastStyling?.title,
    fontSize: TOAST_CONFIG.titleFontSize,
    fontWeight: TOAST_CONFIG.titleFontWeight,
    color: toastStyling?.title?.color,
  };
}

/** Get description styling configuration from registry. */
export function getDescriptionConfig() {
  return {
    raw: toastStyling?.description,
    fontSize: TOAST_CONFIG.descriptionFontSize,
    fontWeight: TOAST_CONFIG.descriptionFontWeight,
    color: toastStyling?.description?.color,
  };
}

/** Get icon configuration from registry. */
export function getIconConfig() {
  return {
    raw: toastStyling?.icon,
    size: TOAST_CONFIG.iconSize,
  };
}

/** Get complete variant data for all Toast styling (golden-path test). */
export function getAllVariantData() {
  return {
    styling: toastStyling,
    container: getContainerConfig(),
    title: getTitleConfig(),
    description: getDescriptionConfig(),
    icon: getIconConfig(),
    variants: getToastVariantConfig().values.map((variant) => ({
      ...getToastParsedVariantStyles(variant),
      icon: TOAST_ICONS[variant] || TOAST_ICONS.default,
    })),
  };
}

/**
 * Create a single Toast component for a variant.
 *
 * Layout structure:
 * - Component (horizontal auto-layout)
 *   - Status icon
 *   - Text column (vertical: title + description)
 */
async function createToastComponent(variant: string): Promise<ComponentNode> {
  const styles = getToastParsedVariantStyles(variant);
  const parsed = styles.parsed;

  const component = figma.createComponent();
  component.name = "variant=" + variant;
  component.description =
    styles.description || "Toast notification for transient messages";

  // Horizontal auto-layout, fixed to the representative toast width.
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.itemSpacing = TOAST_CONFIG.gap;
  component.paddingLeft = TOAST_CONFIG.padding;
  component.paddingRight = TOAST_CONFIG.padding;
  component.paddingTop = TOAST_CONFIG.paddingY;
  component.paddingBottom = TOAST_CONFIG.paddingY;
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "AUTO";
  component.resize(TOAST_CONFIG.width, 100);
  component.cornerRadius = TOAST_CONFIG.borderRadius;

  // Pale status tint
  if (parsed.fillVariable) {
    bindFillToVariableWithOpacity(component, parsed.fillVariable);
  } else {
    const bgVar = getVariableByName(VAR_NAMES.color.elevated);
    if (bgVar) {
      bindFillToVariable(component, bgVar.id);
    }
  }

  // 1px status border
  if (parsed.strokeVariable) {
    const strokeVar = getVariableByName(parsed.strokeVariable);
    if (strokeVar) {
      bindStrokeToVariable(component, strokeVar.id, 1);
    }
  } else {
    const borderVar = getVariableByName(VAR_NAMES.color.line);
    if (borderVar) {
      bindStrokeToVariable(component, borderVar.id, 1);
    }
  }

  // Feishu's toast elevation (`ud__toast` uses --shadow-s4-down)
  component.effects = createShadowEffects(LARK_SHADOWS.popover);

  // Status icon
  const iconConfig = TOAST_ICONS[variant] || TOAST_ICONS.default;
  if (iconConfig.iconId) {
    const icon = createIconInstance(iconConfig.iconId, TOAST_CONFIG.iconSize);
    if (icon) {
      icon.name = "Icon";
      if (iconConfig.color) {
        bindIconColor(icon, iconConfig.color);
      }
      component.appendChild(icon);
    }
  }

  // Text column
  const textColumn = figma.createFrame();
  textColumn.name = "Text";
  textColumn.layoutMode = "VERTICAL";
  textColumn.primaryAxisSizingMode = "AUTO";
  textColumn.counterAxisSizingMode = "AUTO";
  textColumn.itemSpacing = TOAST_CONFIG.textGap;
  textColumn.fills = [];
  textColumn.layoutGrow = 1;

  const title = await createTextNode(
    "Toast created",
    TOAST_CONFIG.titleFontSize,
    TOAST_CONFIG.titleFontWeight,
  );
  title.name = "Title";
  title.textAutoResize = "HEIGHT";
  title.layoutAlign = "STRETCH";

  const titleVar = getVariableByName(VAR_NAMES.text.default);
  if (titleVar) {
    bindTextColorToVariable(title, titleVar.id);
  }
  textColumn.appendChild(title);

  const description = await createTextNode(
    "This is a toast notification.",
    TOAST_CONFIG.descriptionFontSize,
    TOAST_CONFIG.descriptionFontWeight,
  );
  description.name = "Description";
  description.textAutoResize = "HEIGHT";
  description.layoutAlign = "STRETCH";

  const descVar = getVariableByName(VAR_NAMES.text.subtle);
  if (descVar) {
    bindTextColorToVariable(description, descVar.id);
  }
  textColumn.appendChild(description);

  component.appendChild(textColumn);

  return component;
}

/**
 * Generate Toast ComponentSet with one component per status variant.
 * Creates both light and dark mode sections.
 *
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateToastComponents(startY: number): Promise<number> {
  if (startY === undefined) startY = 100;

  const variants = getToastVariantConfig().values;
  const components: ComponentNode[] = [];

  const columnGap = GRID_LAYOUT.componentGapX.standard;
  const headerOffset = GRID_LAYOUT.headerRowHeight;

  for (const variant of variants) {
    components.push(await createToastComponent(variant));
  }

  // Column x positions
  const columnX: number[] = [];
  let currentX = 0;
  for (const component of components) {
    columnX.push(currentX);
    currentX += component.width + columnGap;
  }

  for (let columnIndex = 0; columnIndex < components.length; columnIndex++) {
    components[columnIndex].x = columnX[columnIndex];
    components[columnIndex].y = 0;
  }

  const columnHeaders: { x: number; text: string }[] = variants.map(
    (variant, columnIndex) => ({
      x: columnX[columnIndex],
      text: "variant=" + variant,
    }),
  );

  // @ts-ignore - combineAsVariants works at runtime
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = "Toast";
  componentSet.description =
    "Toast notification component. " +
    "Use for transient messages, confirmations, and alerts.";

  const contentWidth = componentSet.width;
  const contentHeight = componentSet.height;
  const contentYOffset = SECTION_TITLE.height;

  const lightSection = createModeSection(figma.currentPage, "Toast", "light");
  lightSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2 + contentYOffset + headerOffset,
  );

  const darkSection = createModeSection(figma.currentPage, "Toast", "dark");
  darkSection.frame.resize(
    contentWidth + SECTION_PADDING * 2,
    contentHeight + SECTION_PADDING * 2 + contentYOffset + headerOffset,
  );

  lightSection.frame.appendChild(componentSet);
  componentSet.x = SECTION_PADDING;
  componentSet.y = SECTION_PADDING + headerOffset + contentYOffset;

  for (const header of columnHeaders) {
    const headerNode = await createRowLabel(
      header.text,
      SECTION_PADDING + header.x,
      SECTION_PADDING + contentYOffset,
    );
    lightSection.frame.appendChild(headerNode);
  }

  for (const component of components) {
    const instance = component.createInstance();
    instance.x = component.x + SECTION_PADDING;
    instance.y = component.y + SECTION_PADDING + headerOffset + contentYOffset;
    darkSection.frame.appendChild(instance);
  }

  for (const header of columnHeaders) {
    const headerNode = await createRowLabel(
      header.text,
      SECTION_PADDING + header.x,
      SECTION_PADDING + contentYOffset,
    );
    darkSection.frame.appendChild(headerNode);
  }

  const totalWidth = contentWidth + SECTION_PADDING * 2;
  const totalHeight =
    contentHeight + SECTION_PADDING * 2 + contentYOffset + headerOffset;

  lightSection.section.resizeWithoutConstraints(totalWidth, totalHeight);
  darkSection.section.resizeWithoutConstraints(totalWidth, totalHeight);

  lightSection.frame.x = SECTION_LAYOUT.startX;
  lightSection.frame.y = startY;

  darkSection.frame.x =
    lightSection.frame.x + totalWidth + SECTION_LAYOUT.modeGap;
  darkSection.frame.y = startY;

  logComplete("Generated Toast ComponentSet (light + dark)");

  return startY + totalHeight + SECTION_GAP;
}
