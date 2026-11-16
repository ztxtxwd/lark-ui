import { describe, expect, test } from "vite-plus/test";
import { render } from "vitest-browser-react";
import { Button } from "./button";

/*
 * Feishu never greys out a loading solid button — it steps the fill one ramp
 * back inside the variant's own colour family (`--primary-fill-loading` /
 * `--function-danger-fill-loading`). The tokens resolve through `light-dark()`,
 * so these contracts read the computed fill instead of a pixel snapshot.
 */
const fillOf = (element: Element) => getComputedStyle(element).backgroundColor;

const WHITE = "rgb(255, 255, 255)";

// Feishu `--primary-fill-loading` / `--function-danger-fill-loading`.
const BRAND_LOADING = { light: "rgb(148, 180, 255)", dark: "rgb(38, 85, 182)" };
const DANGER_LOADING = {
  light: "rgb(248, 158, 155)",
  dark: "rgb(160, 51, 49)",
};
// Feishu `--fill-disabled` (`--N400`).
const DISABLED = { light: "rgb(187, 191, 196)", dark: "rgb(95, 95, 95)" };
// Feishu `--text-disabled` (`--N400`) — the muted label of a disabled button.
const DISABLED_LABEL = DISABLED;
// Feishu `--udtoken-component-text-disabled-loading` (`--N500`) — a loading
// outlined/text button keeps its surface and only mutes the label.
const MUTED_LABEL = { light: "rgb(143, 149, 158)", dark: "rgb(117, 117, 117)" };

async function withMode(mode: "light" | "dark", run: () => Promise<void>) {
  document.documentElement.dataset.mode = mode;
  try {
    await run();
  } finally {
    delete document.documentElement.dataset.mode;
  }
}

describe.each(["light", "dark"] as const)(
  "Button loading fill (%s)",
  (mode) => {
    test("keeps a loading primary button in the brand family", async () => {
      await withMode(mode, async () => {
        const { getByRole } = await render(
          <Button variant="primary" loading>
            Save
          </Button>,
        );

        const button = getByRole("button").element();
        expect(button.hasAttribute("disabled")).toBe(true);
        expect(fillOf(button)).toBe(BRAND_LOADING[mode]);
        // Label and spinner stay white on top of the tinted fill.
        expect(getComputedStyle(button).color).toBe(WHITE);
        expect(getComputedStyle(getByRole("status").element()).color).toBe(
          WHITE,
        );
      });
    });

    test("keeps a loading destructive button in the danger family", async () => {
      await withMode(mode, async () => {
        const { getByRole } = await render(
          <Button variant="destructive" loading>
            Delete
          </Button>,
        );

        const button = getByRole("button").element();
        expect(fillOf(button)).toBe(DANGER_LOADING[mode]);
        expect(getComputedStyle(getByRole("status").element()).color).toBe(
          WHITE,
        );
      });
    });

    test("still greys a disabled button", async () => {
      await withMode(mode, async () => {
        const { getByRole } = await render(
          <Button variant="primary" disabled>
            Save
          </Button>,
        );

        expect(fillOf(getByRole("button").element())).toBe(DISABLED[mode]);
      });
    });

    test("greys a button that is loading and disabled at once", async () => {
      await withMode(mode, async () => {
        const { getByRole } = await render(
          <Button variant="primary" loading disabled>
            Save
          </Button>,
        );

        expect(fillOf(getByRole("button").element())).toBe(DISABLED[mode]);
      });
    });

    test("leaves the outlined variants on their own surface", async () => {
      await withMode(mode, async () => {
        const { getByRole } = await render(
          <Button variant="secondary" loading>
            Save
          </Button>,
        );

        const button = getByRole("button").element();
        // Secondary keeps `bg-lark-base`; only the label mutes to
        // `--udtoken-component-text-disabled-loading` (Feishu N500).
        expect(fillOf(button)).toBe(
          mode === "light" ? WHITE : "rgb(26, 26, 26)",
        );
        expect(getComputedStyle(button).color).toBe(MUTED_LABEL[mode]);
        // The spinner keeps the Loader's brand default rather than turning white.
        expect(getComputedStyle(getByRole("status").element()).color).not.toBe(
          WHITE,
        );
      });
    });

    test("still mutes a disabled outlined button's label", async () => {
      await withMode(mode, async () => {
        const { getByRole } = await render(
          <Button variant="secondary" disabled>
            Save
          </Button>,
        );

        expect(getComputedStyle(getByRole("button").element()).color).toBe(
          DISABLED_LABEL[mode],
        );
      });
    });

    test("keeps a loading outlined-destructive button in the danger family", async () => {
      await withMode(mode, async () => {
        const { getByRole } = await render(
          <Button variant="secondary-destructive" loading>
            Delete
          </Button>,
        );

        const button = getByRole("button").element();
        expect(fillOf(button)).toBe(
          mode === "light" ? WHITE : "rgb(26, 26, 26)",
        );
        // Feishu `.ud__button--outlined-danger-loading`.
        expect(getComputedStyle(button).color).toBe(DANGER_LOADING[mode]);
      });
    });
  },
);
