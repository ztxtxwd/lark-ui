/**
 * TagInput Generator Tests
 *
 * The TagInput generator reads the field container and the neutral chip
 * styles from the TagInput styling metadata.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getTagInputVariantConfig,
  getTagInputParsedBaseStyles,
  getTagInputParsedChipStyles,
  getAllTagInputVariantData,
} from "./tag-input";
import registry from "@lark-ui/core/ai/component-registry.json";

const tagInput = registry.components
  .TagInput as typeof registry.components.TagInput & {
  styling?: { baseClasses?: string; chipClasses?: string };
};

describe("TagInput Generator - Registry Validation", () => {
  it("should exist in registry", () => {
    expect(tagInput).toBeDefined();
  });

  it("should expose the container and chip classes in the styling metadata", () => {
    expect(tagInput.styling?.baseClasses).toBeDefined();
    expect(tagInput.styling?.chipClasses).toBeDefined();
  });

  it("should have variant values in the registry", () => {
    const variantProp = tagInput.props.variant as { values?: string[] };
    expect(variantProp.values).toBeDefined();
    expect(Array.isArray(variantProp.values)).toBe(true);
  });
});

describe("TagInput Generator - Config Functions", () => {
  it("should return the variant configuration", () => {
    const config = getTagInputVariantConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
  });

  it("should parse the container styles", () => {
    const parsed = getTagInputParsedBaseStyles();
    expect(parsed).toBeDefined();
    expect(parsed.gapX).toBeGreaterThan(0);
    expect(parsed.gapY).toBeGreaterThan(0);
    expect(parsed.paddingY).toBeGreaterThan(0);
  });

  it("should parse the chip styles", () => {
    const parsed = getTagInputParsedChipStyles();
    expect(parsed).toBeDefined();
    expect(parsed.height).toBeGreaterThan(0);
    expect(parsed.borderRadius).toBeGreaterThan(0);
    expect(parsed.fillVariable).toBeDefined();
  });
});

describe("TagInput Generator - All Variant Data", () => {
  it("should include a layout for every variant", () => {
    const allData = getAllTagInputVariantData();
    expect(allData.variants.length).toBe(
      getTagInputVariantConfig().values.length,
    );
    for (const variant of allData.variants) {
      expect(variant.layout.itemSpacing).toBeGreaterThanOrEqual(0);
      expect(variant.layout.cornerRadius).toBeGreaterThan(0);
      expect(variant.chip.height).toBeGreaterThan(0);
      expect(variant.chip.fontSize).toBeGreaterThan(0);
    }
  });
});
