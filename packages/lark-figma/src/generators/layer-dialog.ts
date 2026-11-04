/**
 * LayerDialog Component Generator
 *
 * Generates a LayerDialog ComponentSet in Figma.
 *
 * LayerDialog is the responsive drawer: a bottom sheet on mobile that turns
 * into a centred panel from the `sm` breakpoint up. The desktop width comes
 * from the size variant (`sm:max-w-md` …) and the panel uses Feishu's
 * overlay surface with the `--shadow-s4-down` elevation.
 *
 * @see packages/lark/src/components/layer-dialog/layer-dialog.tsx
 */

import {
  createTextNode,
  getVariableByName,
  bindFillToVariable,
  bindStrokeToVariable,
  bindTextColorToVariable,
  createShadowEffects,
  LARK_SHADOWS,
  BORDER_RADIUS,
  FONT_SIZE,
  FALLBACK_VALUES,
  VAR_NAMES,
  placeComponentSetSections,
} from "./shared";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { logComplete } from "../logger";

/**
 * Size variants from LARK_LAYER_DIALOG_VARIANTS.size
 * The desktop width is applied from the `sm` breakpoint up.
 */
const SIZE_CLASSES: Record<string, string> = {
  sm: "sm:max-w-md",
  base: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
};

/**
 * Vertical alignment variants from LARK_LAYER_DIALOG_VARIANTS.verticalAlign
 */
const VERTICAL_ALIGN_CLASSES: Record<string, string> = {
  top: "sm:items-start sm:pt-16 sm:pb-6",
  center: "sm:items-center sm:py-6",
};

/**
 * The drawer panel
 * (flex max-h-[85dvh] min-h-0 w-full flex-col overflow-hidden rounded-none bg-lark-elevated p-1.5 shadow-lark-modal sm:rounded-lg)
 */
const PANEL_CLASSES =
  "flex max-h-[85dvh] min-h-0 w-full flex-col overflow-hidden rounded-none bg-lark-elevated p-1.5 shadow-lark-modal sm:rounded-lg";

/**
 * Drag handle
 * (flex justify-center pt-1.5 pb-3 → h-1 w-10 rounded-full bg-lark-fill)
 */
const HANDLE_CLASSES = "h-1 w-10 rounded-full bg-lark-fill";

/**
 * Panel header
 * (z-10 flex shrink-0 items-start justify-between gap-4 rounded-t-lg bg-lark-elevated px-4 py-4)
 */
const HEADER_CLASSES =
  "z-10 flex shrink-0 items-start justify-between gap-4 rounded-t-lg bg-lark-elevated px-4 py-4";

/**
 * TESTABLE EXPORTS - Pure functions that return intermediate data
 */

/**
 * Get size configuration
 */
export function getLayerDialogSizeConfig() {
  return {
    values: Object.keys(SIZE_CLASSES),
    classes: SIZE_CLASSES,
    default: "base",
  };
}

/**
 * Get vertical alignment configuration
 */
export function getLayerDialogVerticalAlignConfig() {
  return {
    values: Object.keys(VERTICAL_ALIGN_CLASSES),
    classes: VERTICAL_ALIGN_CLASSES,
    default: "center",
  };
}

/**
 * Get parsed panel styles
 */
export function getLayerDialogParsedPanelStyles() {
  return parseTailwindClasses(PANEL_CLASSES);
}

/**
 * Get parsed styles for a specific size
 */
export function getLayerDialogParsedSizeStyles(size: string) {
  const classes = SIZE_CLASSES[size] || "";
  return {
    size,
    classes,
    parsed: parseTailwindClasses(classes),
  };
}

/**
 * Get all size data (for snapshot testing)
 */
export function getAllLayerDialogVariantData() {
  const panelStyles = getLayerDialogParsedPanelStyles();
  const handleStyles = parseTailwindClasses(HANDLE_CLASSES);
  const headerStyles = parseTailwindClasses(HEADER_CLASSES);
  const config = getLayerDialogSizeConfig();

  return {
    panel: {
      raw: PANEL_CLASSES,
      parsed: panelStyles,
    },
    handle: {
      raw: HANDLE_CLASSES,
      parsed: handleStyles,
    },
    header: {
      raw: HEADER_CLASSES,
      parsed: headerStyles,
    },
    sizes: config.values.map((size) => {
      const sizeData = getLayerDialogParsedSizeStyles(size);
      return {
        ...sizeData,
        layout: {
          layoutMode: "VERTICAL",
          primaryAxisAlignItems: "MIN",
          counterAxisAlignItems: "MIN",
          paddingLeft: panelStyles.paddingX ?? 6,
          paddingRight: panelStyles.paddingX ?? 6,
          paddingTop: panelStyles.paddingY ?? 6,
          paddingBottom: panelStyles.paddingY ?? 6,
          cornerRadius: panelStyles.borderRadius ?? BORDER_RADIUS.md,
          width: sizeData.parsed.maxWidth ?? 576,
        },
      };
    }),
  };
}

/**
 * Create a single LayerDialog component
 */
async function createLayerDialogComponent(
  size: string,
): Promise<ComponentNode> {
  const panelStyles = getLayerDialogParsedPanelStyles();
  const handleStyles = parseTailwindClasses(HANDLE_CLASSES);
  const headerStyles = parseTailwindClasses(HEADER_CLASSES);
  const sizeStyles = getLayerDialogParsedSizeStyles(size).parsed;

  const component = figma.createComponent();
  component.name = "size=" + size;
  component.description = "Responsive drawer / centred panel";

  component.layoutMode = "VERTICAL";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = 0;
  component.paddingLeft = panelStyles.paddingX ?? 6;
  component.paddingRight = panelStyles.paddingX ?? 6;
  component.paddingTop = panelStyles.paddingY ?? 6;
  component.paddingBottom = panelStyles.paddingY ?? 6;
  component.cornerRadius = panelStyles.borderRadius ?? BORDER_RADIUS.md;
  component.resize(sizeStyles.maxWidth ?? 576, 320);

  // Floating surface
  if (panelStyles.fillVariable) {
    const bgVar = getVariableByName(panelStyles.fillVariable);
    if (bgVar) {
      bindFillToVariable(component, bgVar.id);
    }
  }

  // Card border
  if (panelStyles.strokeVariable) {
    const borderVar = getVariableByName(panelStyles.strokeVariable);
    if (borderVar) {
      bindStrokeToVariable(component, borderVar.id, 1);
    }
  }

  // Feishu overlay elevation (shadow-lark-modal)
  component.effects = createShadowEffects(LARK_SHADOWS.modal);

  // Drag handle
  const handle = figma.createFrame();
  handle.name = "Drag Handle";
  handle.layoutMode = "HORIZONTAL";
  handle.primaryAxisAlignItems = "CENTER";
  handle.counterAxisAlignItems = "CENTER";
  handle.primaryAxisSizingMode = "FIXED";
  handle.counterAxisSizingMode = "FIXED";
  handle.resize(handleStyles.width ?? 40, handleStyles.height ?? 4);
  handle.cornerRadius = handleStyles.borderRadius ?? BORDER_RADIUS.full;
  if (handleStyles.fillVariable) {
    const handleVar = getVariableByName(handleStyles.fillVariable);
    if (handleVar) {
      bindFillToVariable(handle, handleVar.id);
    }
  }
  component.appendChild(handle);

  // Header
  const header = figma.createFrame();
  header.name = "Header";
  header.layoutMode = "VERTICAL";
  header.primaryAxisAlignItems = "MIN";
  header.counterAxisAlignItems = "MIN";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  header.paddingLeft = headerStyles.paddingX ?? 16;
  header.paddingRight = headerStyles.paddingX ?? 16;
  header.paddingTop = headerStyles.paddingY ?? 16;
  header.paddingBottom = headerStyles.paddingY ?? 16;
  header.cornerRadius = headerStyles.borderRadius ?? BORDER_RADIUS.lg;
  header.fills = [];

  const title = await createTextNode(
    "Layer dialog",
    FONT_SIZE.lg,
    FALLBACK_VALUES.fontWeight.semiBold,
  );
  title.name = "Title";
  const titleVar = getVariableByName(VAR_NAMES.text.default);
  if (titleVar) {
    bindTextColorToVariable(title, titleVar.id);
  }
  header.appendChild(title);

  const description = await createTextNode(
    "A responsive drawer that becomes a centred panel on desktop.",
    FONT_SIZE.base,
    FALLBACK_VALUES.fontWeight.normal,
  );
  description.name = "Description";
  const descriptionVar = getVariableByName(VAR_NAMES.text.subtle);
  if (descriptionVar) {
    bindTextColorToVariable(description, descriptionVar.id);
  }
  header.appendChild(description);

  component.appendChild(header);

  return component;
}

/**
 * Generate LayerDialog ComponentSet
 *
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateLayerDialogComponents(
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  const config = getLayerDialogSizeConfig();
  const components: ComponentNode[] = [];
  const rowLabels: { y: number; text: string }[] = [];

  let currentY = 0;
  for (const size of config.values) {
    const component = await createLayerDialogComponent(size);
    rowLabels.push({ y: currentY, text: "size=" + size });
    component.x = 160;
    component.y = currentY;
    currentY += component.height + 48;
    components.push(component);
  }

  // @ts-ignore - combineAsVariants works at runtime
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = "LayerDialog";
  componentSet.description = "Responsive drawer that becomes a centred panel";

  const nextY = await placeComponentSetSections(
    figma.currentPage,
    componentSet,
    components,
    {
      name: "LayerDialog",
      startY,
      rowLabels,
      labelColumnWidth: 160,
    },
  );

  logComplete(
    "Generated LayerDialog ComponentSet with " +
      components.length +
      " sizes (light + dark)",
  );

  return nextY;
}
