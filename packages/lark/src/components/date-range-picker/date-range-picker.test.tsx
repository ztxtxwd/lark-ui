import { describe, expect, test } from "vite-plus/test";
import { fireEvent, render } from "@testing-library/react";
import { DateRangePicker } from "./date-range-picker";

function getDayCells(container: HTMLElement) {
  return [...container.querySelectorAll("button")].filter((button) =>
    /^\d+$/.test(button.textContent ?? ""),
  );
}

describe("DateRangePicker", () => {
  test("has a display name", () => {
    expect(DateRangePicker.name).toBe("DateRangePicker");
  });

  test("paints the range with Feishu's brand colours", () => {
    const { container } = render(
      <DateRangePicker
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
      />,
    );
    const cells = getDayCells(container);
    const enabled = cells.find((cell) => cell.textContent === "15");
    if (!enabled) {
      throw new Error("DateRangePicker test day not found");
    }

    // A free day only reacts to hover, with the brand tint.
    expect(enabled.className).toContain("hover:bg-lark-brand-tint");
    expect(enabled.className).toContain("transition-colors");
    expect(enabled.className).toContain("duration-200");
    // The nav chevrons turn brand-coloured instead of taking a fill.
    const previous = container.querySelector('[aria-label="Previous month"]');
    expect(previous?.className).toContain("hover:text-lark-brand");
    expect(previous?.className).not.toContain("bg-lark-interact");

    fireEvent.click(enabled);

    const start = getDayCells(container).find(
      (cell) => cell.textContent === "15",
    );
    if (!start) {
      throw new Error("DateRangePicker test start not found");
    }
    // The end of a range is filled with the brand colour.
    expect(start.className).toContain("!bg-lark-brand");
    expect(start.className).toContain("!text-white");
  });
});
