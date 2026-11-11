import { describe, expect, test } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { render } from "vitest-browser-react";
import { Text } from "../text/text";
import { Tooltip } from "./tooltip";

describe("Tooltip visual contracts", () => {
  test("gives an auto-width popup the viewport width to size against", async () => {
    const { getByRole } = await render(
      <Tooltip
        content="左右拖动调整图片圆角"
        delay={0}
        render={<button type="button" />}
      >
        Hover me
      </Tooltip>,
    );

    await userEvent.hover(getByRole("button", { name: "Hover me" }));

    await expect
      .poll(() => document.querySelector<HTMLElement>(".lark-tooltip-popup"))
      .not.toBeNull();

    const popup = document.querySelector<HTMLElement>(".lark-tooltip-popup")!;
    const rect = popup.getBoundingClientRect();

    // 零宽度的 portal host 会让 flex-col 的浮层退化成 min-content，
    // 中文内容一字一行；正常宽度应接近一行文字的宽度。
    expect(rect.width).toBeGreaterThan(100);
    expect(rect.height).toBeLessThan(60);
  });

  test("keeps a truncating Text trigger visible", async () => {
    const { getByTestId } = await render(
      <div className="w-24" data-testid="tooltip-text-trigger">
        <Tooltip content="Network range details">
          <Text as="span" size="sm" truncate>
            192.0.2.0/24
          </Text>
        </Tooltip>
      </div>,
    );

    await expect
      .element(getByTestId("tooltip-text-trigger"))
      .toMatchScreenshot("truncating-text-trigger");
  });
});
