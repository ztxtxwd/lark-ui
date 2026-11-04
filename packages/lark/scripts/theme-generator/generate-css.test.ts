import { describe, expect, it } from "vite-plus/test";
import { THEME_CONFIG, AVAILABLE_THEMES } from "./config";
import {
  generateAllThemes,
  generateLarkThemeCSS,
  generateThemeOverrideCSS,
} from "./generate-css";

describe("theme css generator", () => {
  it("emits lark runtime fallback selectors inside base layer", () => {
    const css = generateLarkThemeCSS(THEME_CONFIG);

    expect(css).toContain("@layer base {");
    expect(css).toContain(':root, [data-theme="lark"] {');
    expect(css).toContain(
      ':root[data-mode="dark"], [data-mode="dark"]:not([data-theme]), [data-mode="dark"] [data-theme="lark"], [data-theme="lark"][data-mode="dark"], [data-theme="lark"] [data-mode="dark"] {',
    );
  });

  it("ships only the lark theme", () => {
    expect(AVAILABLE_THEMES).toEqual(["lark"]);
    const files = generateAllThemes({ outputDir: "" });
    expect([...files.keys()]).toEqual(["theme-lark.css"]);
    expect(() => generateThemeOverrideCSS(THEME_CONFIG, "lark")).toThrow();
  });

  it("emits Universe Design brand and surface tokens", () => {
    const css = generateLarkThemeCSS(THEME_CONFIG);
    expect(css).toContain("--color-lark-brand: light-dark(");
    expect(css).toContain("#3370ff");
    expect(css).toContain("#4c88ff");
    expect(css).toContain("--color-lark-base: light-dark(");
    expect(css).toContain("#1a1a1a");
  });
});
