/**
 * InputGroup Generator Tests
 *
 * The InputGroup generator reads the control height and typography from the
 * size variants; the container border comes from the component classes.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getInputGroupSizeConfig,
  getInputGroupParsedContainerStyles,
  getInputGroupParsedSizeStyles,
  getAllInputGroupVariantData,
} from "./input-group";
import registry from "@lark-ui/core/ai/component-registry.json";

const inputGroup = registry.components.InputGroup;

describe("InputGroup Generator - Registry Validation", () => {
  it("should exist in registry", () => {
    expect(inputGroup).toBeDefined();
  });

  it("should have size values in registry", () => {
    const sizeProp = inputGroup.props.size as { values?: string[] };
    expect(sizeProp.values).toBeDefined();
    expect(Array.isArray(sizeProp.values)).toBe(true);
    expect(sizeProp.values!.length).toBeGreaterThan(0);
  });

  it("should have size classes in registry", () => {
    const sizeProp = inputGroup.props.size as {
      classes?: Record<string, string>;
    };
    expect(sizeProp.classes).toBeDefined();
  });
});

describe("InputGroup Generator - Config Functions", () => {
  it("should return the size configuration", () => {
    const config = getInputGroupSizeConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
    for (const size of config.values) {
      expect(config.classes[size]).toBeDefined();
      expect(config.descriptions[size]).toBeDefined();
    }
  });

  it("should parse the container styles", () => {
    const parsed = getInputGroupParsedContainerStyles();
    expect(parsed.borderRadius).toBeGreaterThan(0);
    expect(parsed.strokeVariable).toBeDefined();
  });

  it("should parse the size styles", () => {
    const config = getInputGroupSizeConfig();
    for (const size of config.values) {
      const parsed = getInputGroupParsedSizeStyles(size).parsed;
      expect(parsed.height).toBeGreaterThan(0);
      expect(parsed.fontSize).toBeGreaterThan(0);
    }
  });
});

describe("InputGroup Generator - All Variant Data", () => {
  it("should include a layout for every size", () => {
    const allData = getAllInputGroupVariantData();
    expect(allData.sizes.length).toBe(getInputGroupSizeConfig().values.length);
    for (const size of allData.sizes) {
      expect(size.layout.height).toBeGreaterThan(0);
      expect(size.layout.cornerRadius).toBeGreaterThan(0);
      expect(size.layout.paddingLeft).toBeGreaterThan(0);
    }
  });
});
