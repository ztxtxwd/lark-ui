import { describe, expect, test } from "vite-plus/test";
import { render } from "vitest-browser-react";
import { Toasty, useLarkToastManager } from "./toast";

/**
 * Toast follows the Feishu client design: a floating, outlined status notice
 * with a pale tint, a 1px status border and an elevated shadow. These
 * assertions read the computed styles so the whole Tailwind pipeline is
 * covered.
 */
function ToastTrigger() {
  const manager = useLarkToastManager();
  return (
    <button
      type="button"
      onClick={() =>
        manager.add({
          title: "Deploy failed",
          description: "Could not connect to the server.",
          variant: "error",
        })
      }
    >
      Show error toast
    </button>
  );
}

function TwoToastTrigger() {
  const manager = useLarkToastManager();
  return (
    <button
      type="button"
      onClick={() => {
        manager.add({ id: "first", title: "First toast" });
        manager.add({ id: "second", title: "Second toast" });
      }}
    >
      Show two toasts
    </button>
  );
}

describe("Toast viewport", () => {
  test("stacks toasts in a top-centred column with 16px gaps", async () => {
    const { getByRole } = await render(
      <Toasty>
        <TwoToastTrigger />
      </Toasty>,
    );

    await getByRole("button", { name: "Show two toasts" }).click();

    await expect
      .poll(
        () =>
          document.querySelectorAll<HTMLElement>('[data-lark-part="surface"]')
            .length,
      )
      .toBe(2);

    const sortedRects = () =>
      [...document.querySelectorAll<HTMLElement>('[data-lark-part="surface"]')]
        .map((surface) => surface.getBoundingClientRect())
        .sort((a, b) => a.top - b.top);

    // Newest toast sits at the top inset; older toasts follow 16px below.
    await expect.poll(() => Math.round(sortedRects()[0].top)).toBe(16);
    await expect
      .poll(() => Math.round(sortedRects()[1].top - sortedRects()[0].bottom))
      .toBe(16);

    // The column is centred in the viewport.
    const [first] = sortedRects();
    expect((first.left + first.right) / 2).toBeCloseTo(
      window.innerWidth / 2,
      0,
    );
  });
});

for (const mode of ["light", "dark"]) {
  describe(`Toast outlined surface (${mode})`, () => {
    test("paints a pale tint with a 1px status border", async () => {
      document.documentElement.setAttribute("data-mode", mode);
      document.documentElement.setAttribute("data-theme", "lark");

      const { getByRole } = await render(
        <Toasty>
          <ToastTrigger />
        </Toasty>,
      );

      await getByRole("button", { name: "Show error toast" }).click();

      await expect
        .poll(() =>
          document.querySelector<HTMLElement>('[data-lark-part="surface"]'),
        )
        .not.toBeNull();

      const surface = document.querySelector<HTMLElement>(
        '[data-lark-part="surface"]',
      );
      if (!surface) throw new Error("Toast surface not found");

      const styles = getComputedStyle(surface);

      // The toast hugs its content instead of collapsing to the icon width.
      expect(surface.getBoundingClientRect().width).toBeGreaterThan(200);

      // --function-danger-50 tint
      expect(styles.backgroundColor).toBe(
        mode === "light" ? "rgb(254, 240, 240)" : "rgb(61, 26, 25)",
      );
      // 1px border in the status colour (one step stronger than the icon)
      expect(styles.borderTopWidth).toBe("1px");
      expect(styles.borderTopStyle).toBe("solid");
      expect(styles.borderTopColor).toBe(
        mode === "light" ? "rgb(192, 42, 38)" : "rgb(246, 130, 126)",
      );
      // 8px radius, px-5 py-4 padding
      expect(styles.borderTopLeftRadius).toBe("8px");
      expect(styles.paddingTop).toBe("16px");
      expect(styles.paddingBottom).toBe("16px");
      expect(styles.paddingLeft).toBe("20px");
      expect(styles.paddingRight).toBe("20px");

      // The title is semibold and the status icon is a 16px filled glyph.
      const title = surface.querySelector<HTMLElement>("[data-toast-title]");
      if (!title) throw new Error("Toast title not found");
      expect(getComputedStyle(title).fontWeight).toBe("600");

      const icon = surface.querySelector<HTMLElement>("[data-toast-icon]");
      if (!icon) throw new Error("Toast icon not found");
      const iconBox = icon.getBoundingClientRect();
      expect(iconBox.width).toBe(16);
      expect(iconBox.height).toBe(16);
      expect(getComputedStyle(icon).color).toBe(
        mode === "light" ? "rgb(245, 74, 69)" : "rgb(240, 91, 86)",
      );
    });
  });
}
