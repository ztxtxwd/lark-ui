/**
 * TableOfContents Component Generator
 *
 * Generates a TableOfContents ComponentSet in Figma.
 *
 * Mirrors Feishu's `ud__anchor`: inactive links use `--text-caption`
 * (`lark-subtle`), the active section keeps the brand colour and a 2px
 * brand-coloured marker.
 *
 * @see packages/lark/src/components/table-of-contents/table-of-contents.tsx
 */

import {
  createTextNode,
  getVariableByName,
  bindTextColorToVariable,
  FONT_SIZE,
  FALLBACK_VALUES,
  SPACING,
  VAR_NAMES,
  placeComponentSetSections,
} from "./shared";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { logComplete } from "../logger";

/**
 * Item states from LARK_TABLE_OF_CONTENTS_VARIANTS.state
 */
const STATE_CLASSES: Record<string, string> = {
  default:
    "text-lark-subtle hover:text-lark-brand active:text-lark-brand-pressed",
  active: "border-lark-brand font-medium text-lark-brand",
};

/**
 * Base classes of every table-of-contents item
 * (block w-full truncate border-l-2 border-transparent py-px pl-4 text-sm text-left no-underline transition-colors duration-100)
 */
const ITEM_BASE_CLASSES =
  "block w-full truncate border-l-2 border-transparent py-px pl-4 text-sm text-left no-underline transition-colors duration-100";

/**
 * The list wraps the items in a 2px divider
 * (flex flex-col gap-3 border-l-2 border-lark-line)
 */
const LIST_CLASSES = "flex flex-col gap-3 border-l-2 border-lark-line";

/**
 * The section title
 * (py-px pl-4 text-sm leading-5 font-medium text-lark-subtle)
 */
const TITLE_CLASSES =
  "py-px pl-4 text-sm leading-5 font-medium text-lark-subtle";

/** Sample section links */
const SAMPLE_ITEMS = ["Overview", "Guidelines", "Components"];

/** Width of the generated table of contents */
const TOC_WIDTH = 200;

/**
 * TESTABLE EXPORTS - Pure functions that return intermediate data
 */

/**
 * Get state configuration (from the component's variant definitions)
 */
export function getTableOfContentsStateConfig() {
  return {
    values: Object.keys(STATE_CLASSES),
    classes: STATE_CLASSES,
    default: "default",
  };
}

/**
 * Get parsed base styles
 */
export function getTableOfContentsParsedBaseStyles() {
  return parseTailwindClasses(ITEM_BASE_CLASSES);
}

/**
 * Get parsed styles for a specific state
 */
export function getTableOfContentsParsedStateStyles(state: string) {
  const classes = STATE_CLASSES[state] || "";
  return {
    state,
    classes,
    parsed: parseTailwindClasses(classes),
  };
}

/**
 * Get all state data (for snapshot testing)
 */
export function getAllTableOfContentsVariantData() {
  const baseStyles = getTableOfContentsParsedBaseStyles();
  const listStyles = parseTailwindClasses(LIST_CLASSES);
  const titleStyles = parseTailwindClasses(TITLE_CLASSES);
  const config = getTableOfContentsStateConfig();

  return {
    baseStyles: {
      raw: ITEM_BASE_CLASSES,
      parsed: baseStyles,
    },
    list: {
      raw: LIST_CLASSES,
      parsed: listStyles,
    },
    title: {
      raw: TITLE_CLASSES,
      parsed: titleStyles,
    },
    states: config.values.map((state) => {
      const stateData = getTableOfContentsParsedStateStyles(state);
      return {
        ...stateData,
        layout: {
          layoutMode: "VERTICAL",
          itemSpacing: listStyles.gap ?? SPACING.base,
          paddingLeft: baseStyles.paddingLeft ?? 16,
          fontSize: baseStyles.fontSize ?? FONT_SIZE.base,
          fontWeight:
            stateData.parsed.fontWeight ?? FALLBACK_VALUES.fontWeight.normal,
        },
      };
    }),
  };
}

/**
 * Create a single TableOfContents component
 */
async function createTableOfContentsComponent(
  state: string,
): Promise<ComponentNode> {
  const baseStyles = getTableOfContentsParsedBaseStyles();
  const listStyles = parseTailwindClasses(LIST_CLASSES);
  const titleStyles = parseTailwindClasses(TITLE_CLASSES);
  const stateStyles = getTableOfContentsParsedStateStyles(state).parsed;

  const component = figma.createComponent();
  component.name = "state=" + state;
  component.description = "Table of contents anchor navigation";

  component.layoutMode = "VERTICAL";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = listStyles.gap ?? SPACING.base;
  component.resize(TOC_WIDTH, 120);
  component.fills = [];

  // Section title
  const title = await createTextNode(
    "On this page",
    titleStyles.fontSize ?? FONT_SIZE.base,
    titleStyles.fontWeight ?? FALLBACK_VALUES.fontWeight.medium,
  );
  title.name = "Title";
  title.paddingLeft = titleStyles.paddingLeft ?? 16;
  if (titleStyles.textVariable) {
    const titleVar = getVariableByName(titleStyles.textVariable);
    if (titleVar) {
      bindTextColorToVariable(title, titleVar.id);
    }
  }
  component.appendChild(title);

  // Items
  for (const label of SAMPLE_ITEMS) {
    const isActive = state === "active" && label === SAMPLE_ITEMS[0];
    const item = figma.createFrame();
    item.name = "Item: " + label;
    item.layoutMode = "HORIZONTAL";
    item.primaryAxisAlignItems = "MIN";
    item.counterAxisAlignItems = "CENTER";
    item.primaryAxisSizingMode = "AUTO";
    item.counterAxisSizingMode = "AUTO";
    item.paddingLeft = baseStyles.paddingLeft ?? 16;
    item.paddingRight = 0;
    item.paddingTop = baseStyles.paddingY ?? 1;
    item.paddingBottom = baseStyles.paddingY ?? 1;
    item.fills = [];

    const itemText = await createTextNode(
      label,
      baseStyles.fontSize ?? FONT_SIZE.base,
      stateStyles.fontWeight ?? FALLBACK_VALUES.fontWeight.normal,
    );
    itemText.name = "Label";
    const itemVariableName = isActive
      ? VAR_NAMES.text.brand
      : stateStyles.textVariable;
    if (itemVariableName) {
      const itemVar = getVariableByName(itemVariableName);
      if (itemVar) {
        bindTextColorToVariable(itemText, itemVar.id);
      }
    }
    item.appendChild(itemText);
    component.appendChild(item);
  }

  return component;
}

/**
 * Generate TableOfContents ComponentSet
 *
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateTableOfContentsComponents(
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  const config = getTableOfContentsStateConfig();
  const components: ComponentNode[] = [];
  const rowLabels: { y: number; text: string }[] = [];

  let currentY = 0;
  for (const state of config.values) {
    const component = await createTableOfContentsComponent(state);
    rowLabels.push({ y: currentY, text: "state=" + state });
    component.x = 160;
    component.y = currentY;
    currentY += component.height + 48;
    components.push(component);
  }

  // @ts-ignore - combineAsVariants works at runtime
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = "TableOfContents";
  componentSet.description = "Anchor navigation for long documents";

  const nextY = await placeComponentSetSections(
    figma.currentPage,
    componentSet,
    components,
    {
      name: "TableOfContents",
      startY,
      rowLabels,
      labelColumnWidth: 160,
    },
  );

  logComplete(
    "Generated TableOfContents ComponentSet with " +
      components.length +
      " states (light + dark)",
  );

  return nextY;
}
