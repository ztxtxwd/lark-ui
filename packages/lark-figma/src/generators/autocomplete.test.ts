/**
 * Autocomplete Generator Tests
 *
 * The Autocomplete input follows the Input component, so the sizes are read
 * from the Input registry entry.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getAutocompleteSizeConfig,
  getAutocompleteParsedBaseStyles,
  getAutocompleteParsedSizeStyles,
  getAllAutocompleteVariantData,
} from "./autocomplete";
import registry from "@lark-ui/core/ai/component-registry.json";

describe("Autocomplete Generator - Registry Validation", () => {
  it("should exist in registry", () => {
    expect(registry.components.Autocomplete).toBeDefined();
  });

  it("should share the Input sizes", () => {
    const inputSizeProp = registry.components.Input.props.size as {
      values?: string[];
    };
    expect(getAutocompleteSizeConfig().values).toEqual(inputSizeProp.values);
  });
});

describe("Autocomplete Generator - Config Functions", () => {
  it("should return the size configuration", () => {
    const config = getAutocompleteSizeConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
    for (const size of config.values) {
      expect(config.classes[size]).toBeDefined();
    }
  });

  it("should parse the input surface", () => {
    const parsed = getAutocompleteParsedBaseStyles();
    expect(parsed.fillVariable).toBeDefined();
    expect(parsed.strokeVariable).toBeDefined();
  });

  it("should parse the size styles", () => {
    const config = getAutocompleteSizeConfig();
    for (const size of config.values) {
      const parsed = getAutocompleteParsedSizeStyles(size).parsed;
      expect(parsed.height).toBeGreaterThan(0);
      expect(parsed.fontSize).toBeGreaterThan(0);
    }
  });
});

describe("Autocomplete Generator - All Variant Data", () => {
  it("should include a layout for every size", () => {
    const allData = getAllAutocompleteVariantData();
    expect(allData.sizes.length).toBe(
      getAutocompleteSizeConfig().values.length,
    );
    for (const size of allData.sizes) {
      expect(size.layout.width).toBeGreaterThan(0);
      expect(size.layout.height).toBeGreaterThan(0);
      expect(size.layout.cornerRadius).toBeGreaterThan(0);
    }
  });

  it("should parse the suggestion list surface", () => {
    const allData = getAllAutocompleteVariantData();
    expect(allData.popup.parsed.fillVariable).toBeDefined();
    expect(allData.popup.parsed.borderRadius).toBeGreaterThan(0);
    expect(allData.item.parsed.paddingX).toBeGreaterThan(0);
  });
});
