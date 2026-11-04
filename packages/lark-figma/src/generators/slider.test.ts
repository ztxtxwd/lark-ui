/**
 * Slider Generator Tests
 *
 * The Slider generator reads the rail height from the size variants and
 * derives the thumb size from the component's size styles.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getSliderSizeConfig,
  getSliderParsedBaseStyles,
  getSliderParsedSizeStyles,
  getAllSliderVariantData,
} from "./slider";
import registry from "@lark-ui/core/ai/component-registry.json";

const sliderComponent = registry.components.Slider;

describe("Slider Generator - Registry Validation", () => {
  it("should exist in registry", () => {
    expect(sliderComponent).toBeDefined();
  });

  it("should have size values in registry", () => {
    const sizeProp = sliderComponent.props.size as { values?: string[] };
    expect(sizeProp.values).toBeDefined();
    expect(Array.isArray(sizeProp.values)).toBe(true);
    expect(sizeProp.values!.length).toBeGreaterThan(0);
  });

  it("should have size classes in registry", () => {
    const sizeProp = sliderComponent.props.size as {
      classes?: Record<string, string>;
    };
    expect(sizeProp.classes).toBeDefined();
    for (const size of Object.keys(sizeProp.classes!)) {
      expect(sizeProp.classes![size]).toBeDefined();
      expect(sizeProp.classes![size].length).toBeGreaterThan(0);
    }
  });
});

describe("Slider Generator - Config Functions", () => {
  it("should return the size configuration", () => {
    const config = getSliderSizeConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
    for (const size of config.values) {
      expect(config.classes[size]).toBeDefined();
      expect(config.descriptions[size]).toBeDefined();
    }
  });

  it("should parse the base styles", () => {
    const parsed = getSliderParsedBaseStyles();
    expect(parsed.gap).toBeGreaterThan(0);
  });

  it("should parse the size and thumb styles", () => {
    const config = getSliderSizeConfig();
    for (const size of config.values) {
      const sizeData = getSliderParsedSizeStyles(size);
      expect(sizeData.parsed.height).toBeGreaterThan(0);
      expect(sizeData.thumb.width).toBeGreaterThan(0);
    }
  });
});

describe("Slider Generator - All Variant Data", () => {
  it("should include a layout for every size", () => {
    const allData = getAllSliderVariantData();
    expect(allData.sizes.length).toBe(getSliderSizeConfig().values.length);
    for (const size of allData.sizes) {
      expect(size.layout.railHeight).toBeGreaterThan(0);
      expect(size.layout.thumbSize).toBeGreaterThan(0);
    }
  });

  it("should parse the rail and indicator fills", () => {
    const allData = getAllSliderVariantData();
    expect(allData.track.parsed.fillVariable).toBeDefined();
    expect(allData.indicator.parsed.fillVariable).toBeDefined();
  });
});
