import { describe, expect, test } from "vite-plus/test";
import { render } from "vitest-browser-react";
import { Input } from "./input";

describe("Input disabled styling", () => {
  test.each(["light", "dark"] as const)(
    "disabled text uses the placeholder token in %s mode",
    async (mode) => {
      const { getByRole, getByTestId } = await render(
        <div data-mode={mode}>
          <Input aria-label="Enabled" defaultValue="Example" />
          <Input aria-label="Disabled" defaultValue="Example" disabled />
          <span data-testid="placeholder" className="text-lark-placeholder">
            Reference
          </span>
        </div>,
      );

      const enabled = getByRole("textbox", { name: "Enabled" }).element();
      const disabled = getByRole("textbox", { name: "Disabled" }).element();
      const reference = getByTestId("placeholder").element();

      expect((disabled as HTMLInputElement).disabled).toBe(true);

      const enabledColor = getComputedStyle(enabled).color;
      const disabledColor = getComputedStyle(disabled).color;
      const placeholderColor = getComputedStyle(reference).color;

      expect(disabledColor).not.toBe(enabledColor);
      // Feishu mutes a disabled input with `--text-placeholder`.
      expect(disabledColor).toBe(placeholderColor);
    },
  );
});
