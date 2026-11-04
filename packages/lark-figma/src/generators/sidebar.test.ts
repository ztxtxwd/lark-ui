/**
 * Sidebar Generator Tests
 *
 * The Sidebar generator reads the rail widths from the Sidebar styling
 * metadata in the registry.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getSidebarVariantConfig,
  getSidebarWidth,
  getSidebarIconWidth,
  getSidebarParsedVariantStyles,
  getAllSidebarVariantData,
} from "./sidebar";
import registry from "@lark-ui/core/ai/component-registry.json";

const sidebarComponent = registry.components
  .Sidebar as typeof registry.components.Sidebar & {
  styling?: { width?: { expanded?: string; icon?: string } };
};

describe("Sidebar Generator - Registry Validation", () => {
  it("should exist in registry", () => {
    expect(sidebarComponent).toBeDefined();
  });

  it("should expose the widths in the styling metadata", () => {
    expect(sidebarComponent.styling?.width?.expanded).toBeDefined();
    expect(sidebarComponent.styling?.width?.icon).toBeDefined();
  });

  it("should have variant values in registry", () => {
    const variantProp = sidebarComponent.props.variant as { values?: string[] };
    expect(variantProp.values).toBeDefined();
    expect(Array.isArray(variantProp.values)).toBe(true);
    expect(variantProp.values!.length).toBeGreaterThan(0);
  });
});

describe("Sidebar Generator - Config Functions", () => {
  it("should return the variant configuration", () => {
    const config = getSidebarVariantConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
    for (const variant of config.values) {
      expect(config.classes[variant]).toBeDefined();
    }
  });

  it("should resolve the widths in pixels", () => {
    expect(getSidebarWidth()).toBeGreaterThan(0);
    expect(getSidebarIconWidth()).toBeGreaterThan(0);
    expect(getSidebarIconWidth()).toBeLessThan(getSidebarWidth());
  });

  it("should parse every variant", () => {
    const config = getSidebarVariantConfig();
    for (const variant of config.values) {
      const parsed = getSidebarParsedVariantStyles(variant).parsed;
      expect(parsed).toBeDefined();
    }
  });
});

describe("Sidebar Generator - All Variant Data", () => {
  it("should include a layout for every variant", () => {
    const allData = getAllSidebarVariantData();
    expect(allData.variants.length).toBe(
      getSidebarVariantConfig().values.length,
    );
    for (const variant of allData.variants) {
      expect(variant.layout.width).toBeGreaterThan(0);
      expect(variant.layout.itemSpacing).toBeGreaterThan(0);
    }
  });

  it("should expose the resolved widths", () => {
    const allData = getAllSidebarVariantData();
    expect(allData.width.expanded).toBeGreaterThan(0);
    expect(allData.width.icon).toBeGreaterThan(0);
  });
});
