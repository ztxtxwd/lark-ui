/**
 * LayerDialog Generator Tests
 *
 * The LayerDialog generator reads the desktop width from the size variants
 * (`sm:max-w-md` …) and renders the drawer surface.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getLayerDialogSizeConfig,
  getLayerDialogVerticalAlignConfig,
  getLayerDialogParsedPanelStyles,
  getLayerDialogParsedSizeStyles,
  getAllLayerDialogVariantData,
} from "./layer-dialog";

describe("LayerDialog Generator - Config Functions", () => {
  it("should expose the size variants", () => {
    const config = getLayerDialogSizeConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
    for (const size of config.values) {
      expect(config.classes[size]).toBeDefined();
    }
  });

  it("should expose the vertical alignment variants", () => {
    const config = getLayerDialogVerticalAlignConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
  });

  it("should parse the panel surface", () => {
    const parsed = getLayerDialogParsedPanelStyles();
    expect(parsed.fillVariable).toBeDefined();
    expect(parsed.borderRadius).toBeGreaterThan(0);
  });

  it("should parse the desktop width of every size", () => {
    const config = getLayerDialogSizeConfig();
    for (const size of config.values) {
      const parsed = getLayerDialogParsedSizeStyles(size).parsed;
      expect(parsed.maxWidth).toBeGreaterThan(0);
    }
  });
});

describe("LayerDialog Generator - All Variant Data", () => {
  it("should include a layout for every size", () => {
    const allData = getAllLayerDialogVariantData();
    expect(allData.sizes.length).toBe(getLayerDialogSizeConfig().values.length);
    for (const size of allData.sizes) {
      expect(size.layout.width).toBeGreaterThan(0);
      expect(size.layout.cornerRadius).toBeGreaterThan(0);
    }
  });

  it("should grow with the size", () => {
    const allData = getAllLayerDialogVariantData();
    const widths = allData.sizes.map((size) => size.layout.width);
    for (let index = 1; index < widths.length; index++) {
      expect(widths[index]).toBeGreaterThan(widths[index - 1]);
    }
  });
});
