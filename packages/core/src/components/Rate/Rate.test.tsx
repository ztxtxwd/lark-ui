import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Rate } from "./Rate";

const HINTS = ["很差", "较差", "一般", "满意", "非常满意"];

describe("Rate", () => {
  it("renders a named five-star radio group", () => {
    render(<Rate />);

    expect(screen.getByRole("radiogroup", { name: "评分" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(screen.getByRole("radio", { name: "1 / 5 星" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "5 / 5 星" })).toBeInTheDocument();
  });

  it("checks the default score", () => {
    render(<Rate defaultValue={3} />);

    expect(screen.getByRole("radio", { name: "3 / 5 星" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "2 / 5 星" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("picks a score on click", async () => {
    const onValueChange = vi.fn();
    render(<Rate defaultValue={1} onValueChange={onValueChange} />);

    const fourth = screen.getByRole("radio", { name: "4 / 5 星" });
    await userEvent.click(fourth);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toBe(4);
    expect(fourth).toHaveAttribute("aria-checked", "true");
  });

  it("respects a controlled value", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Rate value={2} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "5 / 5 星" }));
    expect(onValueChange.mock.calls[0][0]).toBe(5);
    expect(screen.getByRole("radio", { name: "2 / 5 星" })).toHaveAttribute("aria-checked", "true");

    rerender(<Rate value={5} onValueChange={onValueChange} />);
    expect(screen.getByRole("radio", { name: "5 / 5 星" })).toHaveAttribute("aria-checked", "true");
  });

  it("changes the score with the arrow keys", async () => {
    render(<Rate defaultValue={3} />);

    await userEvent.tab();
    const checked = screen.getByRole("radio", { name: "3 / 5 星" });
    expect(checked).toHaveFocus();

    const star = checked.closest('[data-slot="rating-item"]') as HTMLElement;
    expect(getComputedStyle(star).outlineWidth).toBe("2px");

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "4 / 5 星" })).toHaveAttribute("aria-checked", "true");

    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "3 / 5 星" })).toHaveAttribute("aria-checked", "true");
  });

  it("supports half steps and paints a partial star", async () => {
    const { container } = render(<Rate allowHalf defaultValue={2.5} />);

    expect(screen.getAllByRole("radio")).toHaveLength(10);
    expect(screen.getByRole("radio", { name: "2.5 / 5 星" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    const stars = container.querySelectorAll('[data-slot="rating-item"]');
    expect(stars).toHaveLength(5);
    expect(stars[0]).toHaveAttribute("data-filled");
    expect(stars[1]).toHaveAttribute("data-filled");
    expect(stars[2]).toHaveAttribute("data-partial");

    const overlay = stars[2].querySelectorAll('span[aria-hidden="true"]')[1];
    expect(getComputedStyle(overlay as Element).width).toBe("16px");

    await userEvent.click(screen.getByRole("radio", { name: "0.5 / 5 星" }));
    expect(screen.getByRole("radio", { name: "0.5 / 5 星" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("shows a read-only score as one named image", () => {
    render(<Rate readOnly value={4.2} />);

    expect(screen.getByRole("img", { name: "4.2 / 5 星" })).toBeInTheDocument();
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });

  it("disables every star when disabled", async () => {
    const onValueChange = vi.fn();
    render(<Rate disabled defaultValue={3} onValueChange={onValueChange} />);

    const fourth = screen.getByRole("radio", { name: "4 / 5 星" });
    expect(fourth).toHaveAttribute("aria-disabled", "true");
    expect(fourth).toHaveAttribute("tabindex", "-1");

    await userEvent.click(fourth);
    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.tab();
    expect(fourth).not.toHaveFocus();
  });

  it("clears the score when clearing is allowed", async () => {
    const onValueChange = vi.fn();
    render(<Rate allowClear defaultValue={3} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "3 / 5 星" }));
    expect(onValueChange.mock.calls[0][0]).toBeNull();
  });

  it("shows UD instant hints while hovering and keeps them after selection", async () => {
    const { container } = render(<Rate tooltips={HINTS} defaultValue={1} />);

    expect(screen.getByText("很差")).toBeInTheDocument();

    fireEvent.pointerMove(screen.getByRole("radio", { name: "4 / 5 星" }), {
      pointerType: "mouse",
    });
    expect(screen.getByText("满意")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("radio", { name: "5 / 5 星" }));
    expect(screen.getByText("非常满意")).toBeInTheDocument();

    const rateRoot = container.querySelector('[data-slot="rate"]');
    expect(rateRoot).not.toBeNull();
    fireEvent.pointerLeave(rateRoot as Element);
    expect(screen.getByText("非常满意")).toBeInTheDocument();
  });

  it("shows the hint for a read-only score", () => {
    render(<Rate readOnly value={4.2} tooltips={HINTS} />);

    expect(screen.getByRole("img", { name: "4.2 / 5 星" })).toBeInTheDocument();
    expect(screen.getByText("非常满意")).toBeInTheDocument();
  });

  it("keeps the hint on the accepted score when a change is canceled", async () => {
    const { container } = render(
      <Rate
        defaultValue={2}
        tooltips={HINTS}
        onValueChange={(_next, details) => details.cancel()}
      />,
    );

    await userEvent.click(screen.getByRole("radio", { name: "5 / 5 星" }));
    expect(screen.getByRole("radio", { name: "2 / 5 星" })).toHaveAttribute("aria-checked", "true");

    const rateRoot = container.querySelector('[data-slot="rate"]');
    fireEvent.pointerLeave(rateRoot as Element);
    expect(screen.getByText("较差")).toBeInTheDocument();
  });

  it("centers the hint under the stars", () => {
    render(<Rate tooltips={HINTS} defaultValue={1} />);

    const hint = document.querySelector('[data-slot="rate-hint"]');
    expect(hint).not.toBeNull();
    expect(getComputedStyle(hint as Element).textAlign).toBe("center");
  });

  it("wraps a long hint instead of widening the rating", () => {
    const longHint = "非常满意".repeat(20);
    render(<Rate tooltips={[longHint, ...HINTS.slice(1)]} defaultValue={1} />);

    const group = screen.getByRole("radiogroup");
    const stars = group.querySelectorAll('[data-slot="rating-item"]');
    const firstStar = stars[0];
    const lastStar = stars[stars.length - 1];
    const hint = document.querySelector('[data-slot="rate-hint"]');
    if (
      !(firstStar instanceof HTMLElement) ||
      !(lastStar instanceof HTMLElement) ||
      !(hint instanceof HTMLElement)
    ) {
      throw new Error("Expected the stars and the rate hint");
    }

    const starsWidth =
      lastStar.getBoundingClientRect().right - firstStar.getBoundingClientRect().left;
    expect(hint.getBoundingClientRect().width).toBeLessThanOrEqual(starsWidth + 1);
    expect(hint.getBoundingClientRect().height).toBeGreaterThan(20);
  });

  it("uses the full-star hint for half scores", () => {
    render(<Rate allowHalf tooltips={HINTS} defaultValue={2.5} />);
    expect(screen.getByText("一般")).toBeInTheDocument();
  });

  it("renders a custom character on every star", () => {
    render(<Rate character={<svg data-testid="heart" />} />);

    expect(screen.getByRole("radiogroup", { name: "评分" })).toBeInTheDocument();
    expect(screen.getAllByTestId("heart")).toHaveLength(10);
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("uses the UD 32px boxes, 16px gap, 28px glyph and N300/Y500 colours", () => {
    const { container } = render(<Rate defaultValue={1} />);

    const group = screen.getByRole("radiogroup");
    expect(getComputedStyle(group).columnGap).toBe("16px");

    const star = container.querySelector('[data-slot="rating-item"]');
    expect(star).not.toBeNull();
    const starElement = star as HTMLElement;
    expect(getComputedStyle(starElement).width).toBe("32px");
    expect(getComputedStyle(starElement).height).toBe("32px");

    const glyph = starElement.querySelector("svg");
    expect(glyph).not.toBeNull();
    expect(getComputedStyle(glyph as Element).width).toBe("28px");

    const layers = starElement.querySelectorAll('span[aria-hidden="true"]');
    expect(getComputedStyle(layers[0]).color).toBe("rgb(222, 224, 227)");
    expect(getComputedStyle(layers[1]).color).toBe("rgb(255, 198, 10)");
  });

  it("supports a custom count and accessible name", () => {
    render(<Rate count={3} aria-label="服务评分" />);

    expect(screen.getByRole("radiogroup", { name: "服务评分" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "3 / 3 星" })).toBeInTheDocument();
  });
});
