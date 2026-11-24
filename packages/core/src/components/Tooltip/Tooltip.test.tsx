import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("shows its text when the pointer rests on the trigger", async () => {
    render(
      <Tooltip content="创建新文档">
        <button type="button" aria-label="创建">
          创建
        </button>
      </Tooltip>,
    );

    await userEvent.hover(screen.getByRole("button", { name: "创建" }));
    const tooltip = await screen.findByRole("tooltip", {}, { timeout: 1000 });
    expect(tooltip).toHaveTextContent("创建新文档");
  });

  it("supports a controlled open state", () => {
    render(
      <Tooltip content="始终显示" defaultOpen>
        <button type="button">触发</button>
      </Tooltip>,
    );

    expect(screen.getByRole("tooltip")).toHaveTextContent("始终显示");
  });

  it("names an icon-only trigger from the tooltip", () => {
    render(
      <Tooltip content="更多操作" type="label" defaultOpen>
        <button type="button">•••</button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "更多操作" })).toBeInTheDocument();
  });

  it("uses the UD tooltip surface styles", () => {
    render(
      <Tooltip content="提示" defaultOpen>
        <button type="button">触发</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("bg-lark-tips");
    expect(tooltip.className).toContain("rounded-lark-lg");
    expect(tooltip.className).toContain("text-lark-12");
  });

  it("wraps unbroken text inside the UD 320px maximum width", () => {
    render(
      <Tooltip content={"a".repeat(120)} defaultOpen>
        <button type="button">触发</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.getBoundingClientRect().width).toBeLessThanOrEqual(320);
    expect(tooltip.scrollWidth).toBeLessThanOrEqual(tooltip.clientWidth);
  });

  it("draws the UD 12 × 6 arrow on the landed side", () => {
    render(
      <Tooltip content="提示" defaultOpen>
        <button type="button">触发</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole("tooltip");
    const arrow = tooltip.querySelector('[data-slot="tooltip-arrow"]') as HTMLElement;
    expect(arrow).not.toBeNull();
    expect(arrow).toHaveAttribute("data-side");
    expect(arrow.className).toContain("data-[side=top]:bottom-[-6px]");

    const style = getComputedStyle(arrow);
    expect(style.width).toBe("12px");
    expect(style.height).toBe("6px");

    const shape = arrow.querySelector('[class*="border-t-lark-tips"]') as HTMLElement;
    expect(shape).not.toBeNull();
    const arrowRect = arrow.getBoundingClientRect();
    const shapeRect = shape.getBoundingClientRect();
    expect(
      Math.abs(arrowRect.left + arrowRect.width / 2 - (shapeRect.left + shapeRect.width / 2)),
    ).toBeLessThan(1);
    expect(
      Math.abs(arrowRect.top + arrowRect.height / 2 - (shapeRect.top + shapeRect.height / 2)),
    ).toBeLessThan(1);
  });

  it("aligns the arrow with the trigger's center on each side", async () => {
    for (const side of ["top", "bottom", "left", "right"] as const) {
      const { unmount } = render(
        <div className="flex justify-center py-16">
          <Tooltip content="提示" side={side} defaultOpen>
            <button type="button">触发</button>
          </Tooltip>
        </div>,
      );

      const tooltip = await waitFor(() => {
        const el = screen.getByRole("tooltip");
        // Wait for the positioner's first placement pass to settle.
        if (!el.style.getPropertyValue("--arrow-offset")) {
          throw new Error("not placed yet");
        }
        return el;
      });

      const arrow = tooltip.querySelector('[data-slot="tooltip-arrow"]') as HTMLElement;
      expect(arrow.getAttribute("data-side")).toBe(side);

      const tooltipRect = tooltip.getBoundingClientRect();
      const arrowRect = arrow.getBoundingClientRect();
      const vertical = side === "top" || side === "bottom";
      const pokesOut = vertical
        ? Math.abs(
            (side === "top" ? arrowRect.bottom : arrowRect.top) -
              (side === "top" ? tooltipRect.bottom + 6 : tooltipRect.top - 6),
          )
        : Math.abs(
            // side=left puts the arrow on the tooltip's right edge and
            // side=right on its left edge, both pointing back at the trigger.
            (side === "left" ? arrowRect.right : arrowRect.left) -
              (side === "left" ? tooltipRect.right + 6 : tooltipRect.left - 6),
          );
      // Arrow pokes 6px out of the edge the tooltip landed on.
      expect(pokesOut).toBeLessThanOrEqual(1);

      // The triangle's tip lands near the middle of the trigger along the
      // shared axis, within the positioner's rounding tolerance.
      const triggerRect = screen.getByRole("button", { name: "触发" }).getBoundingClientRect();
      const shape = arrow.querySelector('[class*="border-t-lark-tips"]') as HTMLElement;
      expect(shape).not.toBeNull();
      const shapeRect = shape.getBoundingClientRect();
      const tipX = shapeRect.left + shapeRect.width / 2;
      const tipY = shapeRect.top + shapeRect.height / 2;
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      const triggerCenterY = triggerRect.top + triggerRect.height / 2;
      expect(
        vertical ? Math.abs(tipX - triggerCenterX) : Math.abs(tipY - triggerCenterY),
      ).toBeLessThanOrEqual(1);

      // The base triangle points down; each non-top side rotates the
      // arrow container so the tip faces its trigger. Tailwind v4 emits
      // the standalone `rotate` property, whose computed value is a
      // plain deg string ("180deg", "-90deg") or "none".
      const style = getComputedStyle(arrow);
      const expectedAngle = { top: 0, bottom: 180, left: -90, right: 90 }[side];
      const rotateValue = style.rotate === "none" ? 0 : parseFloat(style.rotate);
      expect(rotateValue).toBe(expectedAngle);

      unmount();
    }
  });
});
