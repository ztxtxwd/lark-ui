/**
 * InlineCopyText Generator Tests
 *
 * The InlineCopyText generator reads its container styles from the
 * InlineCopyText styling metadata and its text colours from the Text
 * component's registry entry.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getInlineCopyTextVariantConfig,
  getInlineCopyTextParsedBaseStyles,
  getInlineCopyTextParsedVariantStyles,
  getAllInlineCopyTextVariantData,
} from "./inline-copy-text";
import registry from "@lark-ui/core/ai/component-registry.json";

const inlineCopyText = registry.components.InlineCopyText;

describe("InlineCopyText Generator - Registry Validation", () => {
  it("should exist in registry", () => {
    expect(inlineCopyText).toBeDefined();
  });

  it("should expose the base classes in the styling metadata", () => {
    const styling = (
      inlineCopyText as unknown as {
        styling?: { baseClasses?: string };
      }
    ).styling;
    expect(styling?.baseClasses).toBeDefined();
    expect(typeof styling?.baseClasses).toBe("string");
  });

  it("should have variant values in the registry", () => {
    const variantProp = inlineCopyText.props.variant as { values?: string[] };
    expect(variantProp.values).toBeDefined();
    expect(Array.isArray(variantProp.values)).toBe(true);
    expect(variantProp.values!.length).toBeGreaterThan(0);
  });
});

describe("InlineCopyText Generator - Config Functions", () => {
  it("should return the variant configuration", () => {
    const config = getInlineCopyTextVariantConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
  });

  it("should resolve text classes for every variant", () => {
    const config = getInlineCopyTextVariantConfig();
    for (const variant of config.values) {
      expect(config.classes[variant]).toBeDefined();
      expect(typeof config.classes[variant]).toBe("string");
    }
  });

  it("should parse the base styles", () => {
    const parsed = getInlineCopyTextParsedBaseStyles();
    expect(parsed).toBeDefined();
    expect(parsed.gap).toBeGreaterThan(0);
    expect(parsed.borderRadius).toBeGreaterThan(0);
  });

  it("should parse every variant", () => {
    const config = getInlineCopyTextVariantConfig();
    for (const variant of config.values) {
      const parsed = getInlineCopyTextParsedVariantStyles(variant).parsed;
      expect(parsed).toBeDefined();
    }
  });
});

describe("InlineCopyText Generator - All Variant Data", () => {
  it("should include a layout for every variant", () => {
    const allData = getAllInlineCopyTextVariantData();
    expect(allData.variants.length).toBe(
      getInlineCopyTextVariantConfig().values.length,
    );
    for (const variant of allData.variants) {
      expect(variant.layout.itemSpacing).toBeGreaterThan(0);
      expect(variant.layout.cornerRadius).toBeGreaterThan(0);
      expect(variant.text.fontSize).toBeGreaterThan(0);
      expect(variant.icon.iconSize).toBeGreaterThan(0);
    }
  });
});
