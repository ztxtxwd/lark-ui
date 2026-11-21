import { describe, expect, test } from "vite-plus/test";
import { render } from "vitest-browser-react";
import { Banner } from "./banner";

/**
 * Banner uses Feishu's `ud__notice--filled` treatment: a flat status tint with
 * no border. These assertions read the computed styles so the whole Tailwind
 * pipeline is covered.
 */
for (const mode of ["light", "dark"]) {
  describe(`Banner filled surface (${mode})`, () => {
    test("paints a flat status tint without a border", async () => {
      const { container } = await render(
        <div data-mode={mode} data-theme="lark">
          <Banner
            variant="error"
            data-testid="banner"
            title="Save failed"
            description="Could not save your changes."
          />
        </div>,
      );

      const banner = container.querySelector<HTMLElement>(
        "[data-testid='banner']",
      );
      if (!banner) throw new Error("Banner not found");

      const styles = getComputedStyle(banner);

      // --function-danger-100 tint
      expect(styles.backgroundColor).toBe(
        mode === "light" ? "rgb(253, 226, 226)" : "rgb(61, 26, 25)",
      );
      expect(styles.borderTopWidth).toBe("0px");
      // ud__notice--filled padding: 9px 0 9px 16px
      expect(styles.paddingTop).toBe("9px");
      expect(styles.paddingBottom).toBe("9px");
      expect(styles.paddingLeft).toBe("16px");
      // 6px radius
      expect(styles.borderTopLeftRadius).toBe("6px");

      // The message is set semibold, like Feishu's notice title.
      const title = banner.querySelector<HTMLElement>("p");
      if (!title) throw new Error("Banner title not found");
      expect(getComputedStyle(title).fontWeight).toBe("600");
    });

    test("uses the informational tint for the default variant", async () => {
      const { container } = await render(
        <div data-mode={mode} data-theme="lark">
          <Banner data-testid="banner" title="Update available" />
        </div>,
      );

      const banner = container.querySelector<HTMLElement>(
        "[data-testid='banner']",
      );
      if (!banner) throw new Error("Banner not found");

      const styles = getComputedStyle(banner);

      // --function-info-100 tint
      expect(styles.backgroundColor).toBe(
        mode === "light" ? "rgb(225, 234, 255)" : "rgb(21, 35, 64)",
      );
      expect(styles.borderTopWidth).toBe("0px");
    });
  });
}
