/**
 * TableOfContents Generator Tests
 *
 * The TableOfContents generator mirrors Feishu's `ud__anchor`: the item
 * states come from the component's variant definitions.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  getTableOfContentsStateConfig,
  getTableOfContentsParsedBaseStyles,
  getTableOfContentsParsedStateStyles,
  getAllTableOfContentsVariantData,
} from "./table-of-contents";

describe("TableOfContents Generator - Config Functions", () => {
  it("should expose the item states", () => {
    const config = getTableOfContentsStateConfig();
    expect(config.values.length).toBeGreaterThan(0);
    expect(config.default).toBeDefined();
    for (const state of config.values) {
      expect(config.classes[state]).toBeDefined();
      expect(config.classes[state].length).toBeGreaterThan(0);
    }
  });

  it("should parse the item base styles", () => {
    const parsed = getTableOfContentsParsedBaseStyles();
    expect(parsed.fontSize).toBeGreaterThan(0);
    expect(parsed.paddingLeft).toBeGreaterThan(0);
  });

  it("should parse every state", () => {
    const config = getTableOfContentsStateConfig();
    for (const state of config.values) {
      const parsed = getTableOfContentsParsedStateStyles(state).parsed;
      expect(parsed).toBeDefined();
    }
  });
});

describe("TableOfContents Generator - All Variant Data", () => {
  it("should include a layout for every state", () => {
    const allData = getAllTableOfContentsVariantData();
    expect(allData.states.length).toBe(
      getTableOfContentsStateConfig().values.length,
    );
    for (const state of allData.states) {
      expect(state.layout.itemSpacing).toBeGreaterThan(0);
      expect(state.layout.fontSize).toBeGreaterThan(0);
    }
  });

  it("should parse the list and title styles", () => {
    const allData = getAllTableOfContentsVariantData();
    expect(allData.list.parsed.gap).toBeGreaterThan(0);
    expect(allData.title.parsed.fontSize).toBeGreaterThan(0);
  });
});
