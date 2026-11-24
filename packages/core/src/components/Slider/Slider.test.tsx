import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("exposes a named range input with its bounds and value", () => {
    render(<Slider aria-label="音量" defaultValue={30} min={0} max={100} />);

    const slider = screen.getByRole("slider", { name: "音量" });
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveValue("30");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("data-slot", "slider-thumb-input");
  });

  it("names the slider group as well as its thumbs", () => {
    render(
      <Slider aria-label="价格" defaultValue={[20, 80]} thumbLabels={["最低价格", "最高价格"]} />,
    );

    expect(screen.getByRole("group", { name: "价格" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "最低价格" })).toBeInTheDocument();
  });

  it("centers a mark's node on the track", () => {
    render(<Slider aria-label="音量" defaultValue={20} marks={{ 0: "0", 50: "50", 100: "100" }} />);

    const track = document.querySelector('[data-slot="slider-track"]');
    const node = screen
      .getByRole("button", { name: "50" })
      .querySelector('span[aria-hidden="true"]');
    if (!(track instanceof HTMLElement) || !(node instanceof HTMLElement)) {
      throw new Error("Expected the track and a mark node");
    }

    const trackBox = track.getBoundingClientRect();
    const nodeBox = node.getBoundingClientRect();
    expect(
      Math.abs(nodeBox.top + nodeBox.height / 2 - (trackBox.top + trackBox.height / 2)),
    ).toBeLessThan(1);
  });

  it("steps with the arrow keys and jumps with Home and End", async () => {
    render(<Slider aria-label="音量" defaultValue={50} step={5} />);

    const slider = screen.getByRole("slider", { name: "音量" });
    await userEvent.tab();
    expect(slider).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(slider).toHaveValue("55");
    await userEvent.keyboard("{ArrowUp}");
    expect(slider).toHaveValue("60");
    await userEvent.keyboard("{ArrowLeft}");
    expect(slider).toHaveValue("55");
    await userEvent.keyboard("{ArrowDown}");
    expect(slider).toHaveValue("50");
    await userEvent.keyboard("{Home}");
    expect(slider).toHaveValue("0");
    await userEvent.keyboard("{End}");
    expect(slider).toHaveValue("100");
  });

  it("uses the large step for Page Up and Page Down", async () => {
    render(<Slider aria-label="音量" defaultValue={50} step={1} largeStep={20} />);

    const slider = screen.getByRole("slider", { name: "音量" });
    await userEvent.tab();
    await userEvent.keyboard("{PageUp}");
    expect(slider).toHaveValue("70");
    await userEvent.keyboard("{PageDown}");
    expect(slider).toHaveValue("50");
  });

  it("renders a range with one named thumb per value", () => {
    render(
      <Slider aria-label="价格" defaultValue={[20, 80]} thumbLabels={["最低价格", "最高价格"]} />,
    );

    const low = screen.getByRole("slider", { name: "最低价格" });
    const high = screen.getByRole("slider", { name: "最高价格" });

    expect(low).toHaveValue("20");
    expect(high).toHaveValue("80");
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("moves the nearest thumb of a range from a mark", async () => {
    render(
      <Slider
        aria-label="价格"
        defaultValue={[20, 80]}
        thumbLabels={["最低价格", "最高价格"]}
        marks={{ 0: "0", 60: "60", 100: "100" }}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "60" }));

    await waitFor(() => {
      expect(screen.getByRole("slider", { name: "最高价格" })).toHaveValue("60");
    });
    expect(screen.getByRole("slider", { name: "最低价格" })).toHaveValue("20");
  });

  it("shows marks and snaps to a pressed mark", async () => {
    render(<Slider aria-label="音量" defaultValue={20} marks={{ 0: "0", 50: "50", 100: "100" }} />);

    await userEvent.click(screen.getByRole("button", { name: "50" }));

    await waitFor(() => {
      expect(screen.getByRole("slider", { name: "音量" })).toHaveValue("50");
    });
  });

  it("formats the tooltip and aria-valuetext", () => {
    render(<Slider aria-label="完成度" defaultValue={40} formatValue={(value) => `${value}%`} />);

    const slider = screen.getByRole("slider", { name: "完成度" });
    expect(slider).toHaveAttribute("aria-valuetext", "40%");
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("can hide the tooltip", () => {
    render(
      <Slider
        aria-label="音量"
        defaultValue={40}
        tooltip={false}
        formatValue={(value) => `${value}%`}
      />,
    );

    expect(screen.queryByText("40%")).not.toBeInTheDocument();
  });

  it("is disabled: no focus and no keyboard changes", async () => {
    render(<Slider aria-label="音量" defaultValue={30} disabled />);

    const slider = screen.getByRole("slider", { name: "音量" });
    expect(slider).toBeDisabled();

    await userEvent.tab();
    expect(slider).not.toHaveFocus();
    expect(slider).toHaveValue("30");
  });

  it("is read-only: focusable but unchangeable", async () => {
    render(<Slider aria-label="音量" defaultValue={30} readOnly />);

    const slider = screen.getByRole("slider", { name: "音量" });
    expect(slider).toHaveAttribute("aria-readonly", "true");

    await userEvent.tab();
    expect(slider).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(slider).toHaveValue("30");
  });

  it("marks a disabled slider's marks as disabled", async () => {
    render(
      <Slider
        aria-label="音量"
        defaultValue={20}
        disabled
        marks={{ 0: "0", 50: "50", 100: "100" }}
      />,
    );

    expect(screen.getByRole("button", { name: "50" })).toBeDisabled();
  });

  it("draws the focus ring on the thumb", async () => {
    render(<Slider aria-label="音量" defaultValue={50} />);

    const slider = screen.getByRole("slider", { name: "音量" });
    await userEvent.tab();
    expect(slider).toHaveFocus();

    const thumb = slider.closest('[data-slot="slider-thumb"]');
    expect(thumb).not.toBeNull();
    expect(thumb?.matches(":has(:focus-visible)")).toBe(true);
    expect(thumb?.className).toContain("focus-ring");
  });

  it("keeps the covered marks when a change is canceled", async () => {
    render(
      <Slider
        aria-label="音量"
        defaultValue={20}
        marks={{ 0: "0", 50: "50", 100: "100" }}
        onValueChange={(_value, details) => details.cancel()}
      />,
    );

    const mark = screen.getByRole("button", { name: "50" });
    await userEvent.click(mark);
    expect(screen.getByRole("slider", { name: "音量" })).toHaveValue("20");

    await userEvent.unhover(mark);
    await vi.waitFor(() => expect(getComputedStyle(mark).color).toBe("rgb(100, 106, 115)"));
  });

  it("shows the tooltip while the thumb is focused", async () => {
    render(<Slider aria-label="音量" defaultValue={50} formatValue={(value) => `${value}%`} />);

    const slider = screen.getByRole("slider", { name: "音量" });
    await userEvent.tab();
    expect(slider).toHaveFocus();

    const tooltip = screen.getByText("50%");
    await vi.waitFor(() => expect(getComputedStyle(tooltip).opacity).toBe("1"));
  });

  it("supports a controlled value", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Slider aria-label="音量" value={25} onValueChange={onValueChange} />,
    );

    const slider = screen.getByRole("slider", { name: "音量" });
    expect(slider).toHaveValue("25");

    rerender(<Slider aria-label="音量" value={60} onValueChange={onValueChange} />);
    expect(screen.getByRole("slider", { name: "音量" })).toHaveValue("60");
  });

  it("lays out the vertical axis and accepts a height", () => {
    const { container } = render(
      <Slider aria-label="音量" orientation="vertical" defaultValue={30} height={160} />,
    );

    const slider = screen.getByRole("slider", { name: "音量" });
    expect(slider).toHaveAttribute("aria-orientation", "vertical");
    expect(container.firstElementChild).toHaveStyle({ height: "160px" });
  });
});
