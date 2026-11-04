/**
 * Toolbar Generator Tests
 *
 * The Toolbar generator reads the control typography from the size variants
 * and the card surface from the component's root classes.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getToolbarSizeConfig,
  getToolbarParsedBaseStyles,
  getToolbarParsedSizeStyles,
  getAllToolbarVariantData,
} from "./toolbar";
import registry from "@lark-ui/core/ai/component-registry.json";

const toolbarComponent = registry.components.Toolbar;

describe("Toolbar Generator - Registry Validation", () => {
  it("should exist in registry", () => {
    expect(toolbarComponent).toBeDefined();
  });

  it("should have size values in registry", () => {
    const sizeProp = toolbarComponent.props.size as { values?: string[] };
    expect(sizeProp.values).toBeDefined();
    expect(Array.isArray(sizeProp.values)).toBe(true);
    expect(sizeProp.values!.length).toBeGreaterThan(0);
  });

  it("should have size classes in registry", () => {
    const sizeProp = toolbarComponent.props.size as {
      classes?: Record<string, string>;
    };
    expect(sizeProp.classes).toBeDefined();
  });
});

describe("Toolbar Generator - Config Functions", () => {
  it("should return the size configuration", () => {
    const config = getToolbarSizeConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
    for (const size of config.values) {
      expect(config.classes[size]).toBeDefined();
      expect(config.descriptions[size]).toBeDefined();
    }
  });

  it("should parse the card surface", () => {
    const parsed = getToolbarParsedBaseStyles();
    expect(parsed.fillVariable).toBeDefined();
    expect(parsed.strokeVariable).toBeDefined();
    expect(parsed.borderRadius).toBeGreaterThan(0);
  });

  it("should parse the size typography", () => {
    const config = getToolbarSizeConfig();
    for (const size of config.values) {
      const parsed = getToolbarParsedSizeStyles(size).parsed;
      expect(parsed.fontSize).toBeGreaterThan(0);
    }
  });
});

describe("Toolbar Generator - All Variant Data", () => {
  it("should include a layout for every size", () => {
    const allData = getAllToolbarVariantData();
    expect(allData.sizes.length).toBe(getToolbarSizeConfig().values.length);
    for (const size of allData.sizes) {
      expect(size.layout.paddingLeft).toBeGreaterThan(0);
      expect(size.layout.cornerRadius).toBeGreaterThan(0);
      expect(size.layout.fontSize).toBeGreaterThan(0);
    }
  });
});
