/**
 * Tests for toast.ts component generator
 *
 * These tests validate the generator's behavior without coupling to
 * specific design decisions. If toast styling changes, these tests
 * should NOT break - only the Figma output changes.
 *
 * Test philosophy:
 * - Test that the generator correctly reads from the registry
 * - Test that the parser produces valid Figma-compatible output
 * - Test structural invariants, not specific values
 * - DO NOT test specific colors, sizes, or token names
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getContainerConfig,
  getTitleConfig,
  getDescriptionConfig,
  getIconConfig,
  getToastVariantConfig,
  getToastParsedVariantStyles,
  getAllVariantData,
} from "./toast";
import { expectValidRegistryProp, type VariantProp } from "./_test-utils";

// Import registry as source of truth
import registry from "@lark-ui/core/ai/component-registry.json";

const toastComponent = (registry.components as any).Toasty;
const toastStyling = toastComponent.styling;
const variantProp = toastComponent.props.variant as VariantProp;

describe("Toast Generator - Registry Structure", () => {
  it("should have Toasty component in registry", () => {
    expect(toastComponent).toBeDefined();
    expect(toastComponent.name).toBe("Toasty");
  });

  it("should have styling metadata defined", () => {
    expect(toastStyling).toBeDefined();
    expect(toastStyling.container).toBeDefined();
    expect(toastStyling.title).toBeDefined();
    expect(toastStyling.description).toBeDefined();
    expect(toastStyling.icon).toBeDefined();
  });

  it("should have a valid variant prop", () => {
    expectValidRegistryProp(variantProp, "variant");
  });

  describe("container styling", () => {
    it("should have all required container properties", () => {
      expect(toastStyling.container.width).toBeDefined();
      expect(toastStyling.container.padding).toBeDefined();
      expect(toastStyling.container.paddingY).toBeDefined();
      expect(toastStyling.container.borderRadius).toBeDefined();
      expect(toastStyling.container.background).toBeDefined();
      expect(toastStyling.container.border).toBeDefined();
      expect(toastStyling.container.shadow).toBeDefined();
      expect(toastStyling.container.gap).toBeDefined();
    });

    it("should have correct types for container properties", () => {
      expect(typeof toastStyling.container.width).toBe("number");
      expect(typeof toastStyling.container.padding).toBe("number");
      expect(typeof toastStyling.container.paddingY).toBe("number");
      expect(typeof toastStyling.container.borderRadius).toBe("number");
      expect(typeof toastStyling.container.background).toBe("string");
      expect(typeof toastStyling.container.border).toBe("string");
      expect(typeof toastStyling.container.shadow).toBe("string");
      expect(typeof toastStyling.container.gap).toBe("number");
    });

    it("should have positive numeric values for dimensions", () => {
      expect(toastStyling.container.width).toBeGreaterThan(0);
      expect(toastStyling.container.padding).toBeGreaterThanOrEqual(0);
      expect(toastStyling.container.paddingY).toBeGreaterThanOrEqual(0);
      expect(toastStyling.container.borderRadius).toBeGreaterThanOrEqual(0);
      expect(toastStyling.container.gap).toBeGreaterThanOrEqual(0);
    });
  });

  describe("title styling", () => {
    it("should have all required title properties", () => {
      expect(toastStyling.title.fontSize).toBeDefined();
      expect(toastStyling.title.fontWeight).toBeDefined();
      expect(toastStyling.title.color).toBeDefined();
    });

    it("should have correct types for title properties", () => {
      expect(typeof toastStyling.title.fontSize).toBe("number");
      expect(typeof toastStyling.title.fontWeight).toBe("number");
      expect(typeof toastStyling.title.color).toBe("string");
    });

    it("should have positive numeric values for typography", () => {
      expect(toastStyling.title.fontSize).toBeGreaterThan(0);
      expect(toastStyling.title.fontWeight).toBeGreaterThan(0);
    });
  });

  describe("description styling", () => {
    it("should have all required description properties", () => {
      expect(toastStyling.description.fontSize).toBeDefined();
      expect(toastStyling.description.fontWeight).toBeDefined();
      expect(toastStyling.description.color).toBeDefined();
    });

    it("should have correct types for description properties", () => {
      expect(typeof toastStyling.description.fontSize).toBe("number");
      expect(typeof toastStyling.description.fontWeight).toBe("number");
      expect(typeof toastStyling.description.color).toBe("string");
    });

    it("should have positive numeric values for typography", () => {
      expect(toastStyling.description.fontSize).toBeGreaterThan(0);
      expect(toastStyling.description.fontWeight).toBeGreaterThanOrEqual(0);
    });
  });

  describe("icon styling", () => {
    it("should have all required icon properties", () => {
      expect(toastStyling.icon.size).toBeDefined();
      expect(toastStyling.icon.defaultIconName).toBeDefined();
    });

    it("should have correct types for icon properties", () => {
      expect(typeof toastStyling.icon.size).toBe("number");
      expect(typeof toastStyling.icon.defaultIconName).toBe("string");
    });

    it("should have positive numeric values for dimensions", () => {
      expect(toastStyling.icon.size).toBeGreaterThan(0);
    });
  });
});

describe("Toast Generator - Config Functions", () => {
  it("getContainerConfig should return registry config", () => {
    const config = getContainerConfig();
    expect(config.width).toBe(toastStyling.container.width);
    expect(config.padding).toBe(toastStyling.container.padding);
    expect(config.paddingY).toBe(toastStyling.container.paddingY);
    expect(config.borderRadius).toBe(toastStyling.container.borderRadius);
    expect(config.gap).toBe(toastStyling.container.gap);
    expect(typeof config.background).toBe("string");
    expect(typeof config.border).toBe("string");
    expect(typeof config.shadow).toBe("string");
  });

  it("getTitleConfig should return title config", () => {
    const config = getTitleConfig();
    expect(config.raw).toEqual(toastStyling.title);
    expect(config.fontSize).toBe(toastStyling.title.fontSize);
    expect(config.fontWeight).toBe(toastStyling.title.fontWeight);
    expect(config.color).toBe(toastStyling.title.color);
  });

  it("getDescriptionConfig should return description config", () => {
    const config = getDescriptionConfig();
    expect(config.raw).toEqual(toastStyling.description);
    expect(config.fontSize).toBe(toastStyling.description.fontSize);
    expect(config.fontWeight).toBe(toastStyling.description.fontWeight);
    expect(config.color).toBe(toastStyling.description.color);
  });

  it("getIconConfig should return icon config", () => {
    const config = getIconConfig();
    expect(config.raw).toEqual(toastStyling.icon);
    expect(config.size).toBe(toastStyling.icon.size);
  });

  it("getToastVariantConfig should return registry variant data", () => {
    const config = getToastVariantConfig();
    expect(config.values).toEqual(variantProp.values);
    expect(config.classes).toEqual(variantProp.classes);
    expect(config.descriptions).toEqual(variantProp.descriptions);
    expect(config.default).toBe(variantProp.default);
  });
});

describe("Toast Generator - Variant Styles", () => {
  it("should parse every variant and resolve a fill and border", () => {
    for (const variant of variantProp.values) {
      const result = getToastParsedVariantStyles(variant);
      expect(result.variant).toBe(variant);
      expect(result.classes).toBe(variantProp.classes[variant]);
      expect(result.parsed.fillVariable).toBeDefined();
      expect(result.parsed.strokeVariable).toBeDefined();
      expect(result.parsed.hasBorder).toBe(true);
    }
  });
});

describe("Toast Generator - getAllVariantData", () => {
  it("should return complete data structure", () => {
    const allData = getAllVariantData();

    expect(allData.styling).toBeDefined();
    expect(allData.container).toBeDefined();
    expect(allData.title).toBeDefined();
    expect(allData.description).toBeDefined();
    expect(allData.icon).toBeDefined();
    expect(allData.variants).toBeDefined();
    expect(allData.variants.length).toBe(variantProp.values.length);
  });

  it("should include parsed styles and icon data for each variant", () => {
    const allData = getAllVariantData();

    for (const variant of allData.variants) {
      expect(variant.variant).toBeDefined();
      expect(variant.parsed).toBeDefined();
      expect(variant.icon).toBeDefined();
    }
  });
});
