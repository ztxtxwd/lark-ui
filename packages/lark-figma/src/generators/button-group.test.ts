/**
 * ButtonGroup Generator Tests
 *
 * A ButtonGroup has no variants of its own — it joins the Button controls
 * into one control, so the generator only exposes the group layout.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getButtonGroupParsedBaseStyles,
  getButtonGroupParsedButtonStyles,
  getAllButtonGroupVariantData,
} from "./button-group";
import registry from "@lark-ui/core/ai/component-registry.json";

describe("ButtonGroup Generator - Registry Validation", () => {
  it("should exist in registry", () => {
    expect(registry.components.ButtonGroup).toBeDefined();
  });
});

describe("ButtonGroup Generator - Config Functions", () => {
  it("should parse the base styles", () => {
    const parsed = getButtonGroupParsedBaseStyles();
    expect(parsed).toBeDefined();
    expect(typeof parsed).toBe("object");
  });

  it("should parse the joined button styles", () => {
    const styles = getButtonGroupParsedButtonStyles();
    expect(styles.primary.height).toBeGreaterThan(0);
    expect(styles.primary.fillVariable).toBeDefined();
    expect(styles.secondary.height).toBeGreaterThan(0);
    expect(styles.secondary.strokeVariable).toBeDefined();
  });
});

describe("ButtonGroup Generator - All Variant Data", () => {
  it("should expose the group layout", () => {
    const allData = getAllButtonGroupVariantData();
    expect(allData.layout.layoutMode).toBe("HORIZONTAL");
    expect(allData.layout.height).toBeGreaterThan(0);
    expect(allData.layout.cornerRadius).toBeGreaterThan(0);
    expect(allData.layout.fontSize).toBeGreaterThan(0);
  });
});
