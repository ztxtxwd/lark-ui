import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl, SegmentedControlItem } from "./SegmentedControl";

function Options() {
  return (
    <>
      <SegmentedControlItem value="left">左对齐</SegmentedControlItem>
      <SegmentedControlItem value="center">居中</SegmentedControlItem>
      <SegmentedControlItem value="right">右对齐</SegmentedControlItem>
    </>
  );
}

function Icons() {
  return (
    <>
      <SegmentedControlItem value="left" aria-label="左对齐">
        <svg aria-hidden="true" viewBox="0 0 12 12" />
      </SegmentedControlItem>
      <SegmentedControlItem value="center" aria-label="居中">
        <svg aria-hidden="true" viewBox="0 0 12 12" />
      </SegmentedControlItem>
      <SegmentedControlItem value="right" aria-label="右对齐">
        <svg aria-hidden="true" viewBox="0 0 12 12" />
      </SegmentedControlItem>
    </>
  );
}

describe("SegmentedControl", () => {
  it("selects one option at a time and reports the value", async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl aria-label="对齐方式" defaultValue="left" onValueChange={onValueChange}>
        <Options />
      </SegmentedControl>,
    );

    const group = screen.getByRole("group", { name: "对齐方式" });
    const left = screen.getByRole("button", { name: "左对齐" });
    const center = screen.getByRole("button", { name: "居中" });

    expect(group).toContainElement(left);
    expect(left).toHaveAttribute("aria-pressed", "true");
    expect(center).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(center);
    expect(center).toHaveAttribute("aria-pressed", "true");
    expect(left).toHaveAttribute("aria-pressed", "false");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "center",
      expect.objectContaining({ reason: "item-press" }),
    );

    // Deselectable is off: pressing the checked option again keeps it checked.
    await userEvent.click(center);
    expect(center).toHaveAttribute("aria-pressed", "true");
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("keeps one tab stop and moves focus with arrow keys", async () => {
    render(
      <SegmentedControl aria-label="对齐方式" defaultValue="left">
        <Options />
      </SegmentedControl>,
    );

    const left = screen.getByRole("button", { name: "左对齐" });
    const center = screen.getByRole("button", { name: "居中" });

    await userEvent.tab();
    expect(left).toHaveFocus();
    expect(left).toHaveAttribute("tabindex", "0");
    expect(center).toHaveAttribute("tabindex", "-1");

    await userEvent.keyboard("{ArrowRight}");
    expect(center).toHaveFocus();
    expect(center).toHaveAttribute("tabindex", "0");
    // Arrow keys only move focus; Space presses the toggle.
    expect(center).toHaveAttribute("aria-pressed", "false");

    await userEvent.keyboard(" ");
    expect(center).toHaveAttribute("aria-pressed", "true");
    expect(left).toHaveAttribute("aria-pressed", "false");
  });

  it("follows a controlled value and can show no selection", () => {
    const { rerender } = render(
      <SegmentedControl aria-label="对齐方式" value="left">
        <Options />
      </SegmentedControl>,
    );

    const left = screen.getByRole("button", { name: "左对齐" });
    const center = screen.getByRole("button", { name: "居中" });
    expect(left).toHaveAttribute("aria-pressed", "true");

    rerender(
      <SegmentedControl aria-label="对齐方式" value="center">
        <Options />
      </SegmentedControl>,
    );
    expect(center).toHaveAttribute("aria-pressed", "true");
    expect(left).toHaveAttribute("aria-pressed", "false");

    rerender(
      <SegmentedControl aria-label="对齐方式" value={null}>
        <Options />
      </SegmentedControl>,
    );
    expect(left).toHaveAttribute("aria-pressed", "false");
    expect(center).toHaveAttribute("aria-pressed", "false");
  });

  it("disables the whole group but keeps the options focusable", async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="对齐方式"
        defaultValue="left"
        disabled
        onValueChange={onValueChange}
      >
        <Options />
      </SegmentedControl>,
    );

    const center = screen.getByRole("button", { name: "居中" });
    expect(center).toHaveAttribute("aria-disabled", "true");
    expect(center).not.toHaveAttribute("disabled");

    await userEvent.click(center);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(center).toHaveAttribute("aria-pressed", "false");
  });

  it("skips a single disabled option", async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl aria-label="对齐方式" defaultValue="left" onValueChange={onValueChange}>
        <SegmentedControlItem value="left">左对齐</SegmentedControlItem>
        <SegmentedControlItem value="center" disabled>
          居中
        </SegmentedControlItem>
      </SegmentedControl>,
    );

    const center = screen.getByRole("button", { name: "居中" });
    expect(center).toHaveAttribute("aria-disabled", "true");

    await userEvent.click(center);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(center).toHaveAttribute("aria-pressed", "false");
  });

  it("names icon-only options and renders the 28px track", () => {
    render(
      <SegmentedControl aria-label="对齐方式" defaultValue="left">
        <Icons />
      </SegmentedControl>,
    );

    const group = screen.getByRole("group", { name: "对齐方式" });
    const left = screen.getByRole("button", { name: "左对齐" });
    const center = screen.getByRole("button", { name: "居中" });

    expect(getComputedStyle(group).height).toBe("28px");
    expect(getComputedStyle(group).borderRadius).toBe("6px");
    expect(getComputedStyle(group).backgroundColor).toBe("rgb(242, 243, 245)");
    expect(getComputedStyle(left).height).toBe("20px");
    expect(getComputedStyle(left).borderRadius).toBe("4px");
    expect(getComputedStyle(left).backgroundColor).toBe("rgb(255, 255, 255)");
    expect(getComputedStyle(left).color).toBe("rgb(31, 35, 41)");
    expect(getComputedStyle(center).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(getComputedStyle(center).color).toBe("rgb(100, 106, 115)");
  });

  it("dims the track and keeps the checked chip when disabled", () => {
    render(
      <SegmentedControl aria-label="对齐方式" defaultValue="left" disabled>
        <Options />
      </SegmentedControl>,
    );

    const group = screen.getByRole("group", { name: "对齐方式" });
    const left = screen.getByRole("button", { name: "左对齐" });
    const center = screen.getByRole("button", { name: "居中" });

    expect(getComputedStyle(group).backgroundColor).toBe("rgb(222, 224, 227)");
    expect(getComputedStyle(left).backgroundColor).toBe("rgb(245, 246, 247)");
    expect(getComputedStyle(left).color).toBe("rgb(100, 106, 115)");
    expect(getComputedStyle(center).color).toBe("rgb(187, 191, 196)");
  });

  it("uses the inverted neutral scale in dark mode", async () => {
    document.documentElement.dataset.theme = "dark";
    try {
      render(
        <SegmentedControl aria-label="对齐方式" defaultValue="left">
          <Options />
        </SegmentedControl>,
      );

      const group = screen.getByRole("group", { name: "对齐方式" });
      const left = screen.getByRole("button", { name: "左对齐" });
      const center = screen.getByRole("button", { name: "居中" });

      await vi.waitFor(() => {
        expect(getComputedStyle(group).backgroundColor).toBe("rgb(18, 18, 18)");
        expect(getComputedStyle(left).backgroundColor).toBe("rgb(26, 26, 26)");
        expect(getComputedStyle(center).color).toBe("rgb(166, 166, 166)");
      });
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });
});
