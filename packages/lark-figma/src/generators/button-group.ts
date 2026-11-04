/**
 * ButtonGroup Component Generator
 *
 * Generates a ButtonGroup component in Figma.
 *
 * A ButtonGroup joins a small set of tightly-coupled controls into one
 * control — most commonly a split button. The group itself carries no
 * surface of its own: it only removes the inner borders and shadows of its
 * children so the controls read as one.
 *
 * @see packages/lark/src/components/button-group/button-group.tsx
 */

import {
  createTextNode,
  getVariableByName,
  bindFillToVariable,
  bindStrokeToVariable,
  bindTextColorToVariable,
  setWhiteTextColor,
  BORDER_RADIUS,
  FONT_SIZE,
  FALLBACK_VALUES,
  SPACING,
  placeComponentSetSections,
} from "./shared";
import { parseTailwindClasses } from "../parsers/tailwind-to-figma";
import { logComplete } from "../logger";

/**
 * Base classes shared by every ButtonGroup
 * (from LARK_BUTTON_GROUP_STYLING.baseClasses)
 */
const BASE_CLASSES = "relative isolate inline-flex w-max flex-row";

/**
 * The joined controls keep the Button styling — a filled brand button next
 * to a secondary one (the classic Feishu split button).
 */
const PRIMARY_BUTTON_CLASSES =
  "bg-lark-brand !text-white rounded-l-md h-8 px-3 text-base";
const SECONDARY_BUTTON_CLASSES =
  "bg-lark-base !text-lark-default ring ring-lark-border rounded-r-md h-8 px-3 text-base";

/**
 * TESTABLE EXPORTS - Pure functions that return intermediate data
 */

/**
 * Get parsed base styles
 */
export function getButtonGroupParsedBaseStyles() {
  return parseTailwindClasses(BASE_CLASSES);
}

/**
 * Get parsed styles of the joined buttons
 */
export function getButtonGroupParsedButtonStyles() {
  return {
    primary: parseTailwindClasses(PRIMARY_BUTTON_CLASSES),
    secondary: parseTailwindClasses(SECONDARY_BUTTON_CLASSES),
  };
}

/**
 * Get all data (for snapshot testing)
 */
export function getAllButtonGroupVariantData() {
  const baseStyles = getButtonGroupParsedBaseStyles();
  const buttonStyles = getButtonGroupParsedButtonStyles();

  return {
    baseStyles: {
      raw: BASE_CLASSES,
      parsed: baseStyles,
    },
    buttons: {
      primary: {
        raw: PRIMARY_BUTTON_CLASSES,
        parsed: buttonStyles.primary,
      },
      secondary: {
        raw: SECONDARY_BUTTON_CLASSES,
        parsed: buttonStyles.secondary,
      },
    },
    layout: {
      layoutMode: "HORIZONTAL",
      primaryAxisAlignItems: "CENTER",
      counterAxisAlignItems: "CENTER",
      itemSpacing: baseStyles.gap ?? 0,
      height: buttonStyles.primary.height ?? 32,
      cornerRadius: buttonStyles.primary.borderRadius ?? BORDER_RADIUS.md,
      fontSize: buttonStyles.primary.fontSize ?? FONT_SIZE.base,
    },
  };
}

/**
 * Create the ButtonGroup component
 */
async function createButtonGroupComponent(): Promise<ComponentNode> {
  const baseStyles = getButtonGroupParsedBaseStyles();

  const component = figma.createComponent();
  component.name = "ButtonGroup";
  component.description = "Joins tightly-coupled buttons into a single control";

  component.layoutMode = "HORIZONTAL";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = baseStyles.gap ?? 0;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.fills = [];

  const buttons: { label: string; classes: string; radius: number }[] = [
    {
      label: "Deploy",
      classes: PRIMARY_BUTTON_CLASSES,
      radius: BORDER_RADIUS.md,
    },
    {
      label: "More",
      classes: SECONDARY_BUTTON_CLASSES,
      radius: BORDER_RADIUS.md,
    },
  ];

  for (const button of buttons) {
    const styles = parseTailwindClasses(button.classes);

    const buttonFrame = figma.createFrame();
    buttonFrame.name = "Button: " + button.label;
    buttonFrame.layoutMode = "HORIZONTAL";
    buttonFrame.primaryAxisAlignItems = "CENTER";
    buttonFrame.counterAxisAlignItems = "CENTER";
    buttonFrame.primaryAxisSizingMode = "AUTO";
    buttonFrame.counterAxisSizingMode = "AUTO";
    buttonFrame.itemSpacing = styles.gap ?? SPACING.xs;
    buttonFrame.paddingLeft = styles.paddingX ?? 12;
    buttonFrame.paddingRight = styles.paddingX ?? 12;
    buttonFrame.paddingTop = 0;
    buttonFrame.paddingBottom = 0;
    buttonFrame.cornerRadius = button.radius;

    if (styles.fillVariable) {
      const bgVar = getVariableByName(styles.fillVariable);
      if (bgVar) {
        bindFillToVariable(buttonFrame, bgVar.id);
      }
    } else {
      buttonFrame.fills = [];
    }

    if (styles.strokeVariable) {
      const borderVar = getVariableByName(styles.strokeVariable);
      if (borderVar) {
        bindStrokeToVariable(buttonFrame, borderVar.id, 1);
      }
    }

    const label = await createTextNode(
      button.label,
      styles.fontSize ?? FONT_SIZE.base,
      FALLBACK_VALUES.fontWeight.medium,
    );
    label.name = "Label";
    if (styles.isWhiteText) {
      setWhiteTextColor(label);
    } else if (styles.textVariable) {
      const textVar = getVariableByName(styles.textVariable);
      if (textVar) {
        bindTextColorToVariable(label, textVar.id);
      }
    }
    buttonFrame.appendChild(label);

    component.appendChild(buttonFrame);
  }

  return component;
}

/**
 * Generate the ButtonGroup component
 *
 * @param startY - Y position to start placing the section
 * @returns The Y position after this section (for next section placement)
 */
export async function generateButtonGroupComponents(
  startY: number,
): Promise<number> {
  if (startY === undefined) startY = 100;

  const component = await createButtonGroupComponent();
  const components = [component];

  // @ts-ignore - combineAsVariants works at runtime
  const componentSet = figma.combineAsVariants(components, figma.currentPage);
  componentSet.name = "ButtonGroup";
  componentSet.description = "Joined buttons";

  const nextY = await placeComponentSetSections(
    figma.currentPage,
    componentSet,
    components,
    {
      name: "ButtonGroup",
      startY,
      rowLabels: [{ y: 0, text: "ButtonGroup" }],
      labelColumnWidth: 160,
    },
  );

  logComplete("Generated ButtonGroup component (light + dark)");

  return nextY;
}
