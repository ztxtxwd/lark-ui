import { describe, expect, test } from "vite-plus/test";
import { render } from "vitest-browser-react";
import { Banner } from "./banner";

/**
 * The outlined theme paints a pale tint with a 1px border in the status
 * colour (Feishu `ud__notice--outlined`). These assertions read the computed
 * styles so the whole Tailwind pipeline is covered.
 */
for (const mode of ["light", "dark"]) {
  describe(`Banner outlined theme (${mode})`, () => {
    test("paints a pale tint with a 1px status border", async () => {
      const { container } = await render(
        <div data-mode={mode} data-theme="lark">
          <Banner
            theme="outlined"
            variant="error"
            title="Save failed"
            description="Could not save your changes."
          />
        </div>,
      );

      const banner = container.querySelector<HTMLElement>(
        "[data-banner-theme='outlined']",
      );
      if (!banner) throw new Error("Banner not found");

      const styles = getComputedStyle(banner);

      // --function-danger-50 tint
      expect(styles.backgroundColor).toBe(
        mode === "light" ? "rgb(254, 240, 240)" : "rgb(61, 26, 25)",
      );
      // 1px border in the status colour, one step stronger than the icon
      expect(styles.borderTopWidth).toBe("1px");
      expect(styles.borderTopStyle).toBe("solid");
      expect(styles.borderTopColor).toBe(
        mode === "light" ? "rgb(192, 42, 38)" : "rgb(246, 130, 126)",
      );
      // ud__notice--outlined padding: 15px 3px 15px 19px
      expect(styles.paddingTop).toBe("15px");
      expect(styles.paddingBottom).toBe("15px");
      expect(styles.paddingLeft).toBe("19px");
      expect(styles.paddingRight).toBe("3px");
      // 6px radius
      expect(styles.borderTopLeftRadius).toBe("6px");

      // The message is set semibold, like Feishu's notice title.
      const title = banner.querySelector<HTMLElement>("p");
      if (!title) throw new Error("Banner title not found");
      expect(getComputedStyle(title).fontWeight).toBe("600");
    });

    test("keeps the filled theme flat and borderless", async () => {
      const { container } = await render(
        <div data-mode={mode} data-theme="lark">
          <Banner variant="error" title="Save failed" />
        </div>,
      );

      const banner = container.querySelector<HTMLElement>(
        "[data-banner-theme='filled']",
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
      expect(styles.paddingLeft).toBe("16px");
    });
  });
}
