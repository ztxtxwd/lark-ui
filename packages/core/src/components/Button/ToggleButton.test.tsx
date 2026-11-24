import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EyeIcon } from "../../icons";
import { ToggleButton } from "./ToggleButton";

describe("ToggleButton", () => {
  it("toggles aria-pressed with pointer presses", async () => {
    render(<ToggleButton>订阅</ToggleButton>);

    const button = screen.getByRole("button", { name: "订阅" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles from the keyboard", async () => {
    render(<ToggleButton>关注</ToggleButton>);

    await userEvent.tab();
    const button = screen.getByRole("button", { name: "关注" });
    expect(button).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("starts pressed with defaultPressed", () => {
    render(<ToggleButton defaultPressed>已关注</ToggleButton>);
    expect(screen.getByRole("button", { name: "已关注" })).toHaveAttribute("aria-pressed", "true");
  });

  it("supports controlled pressed state and reports changes", async () => {
    const onPressedChange = vi.fn();
    const { rerender } = render(
      <ToggleButton pressed={false} onPressedChange={onPressedChange}>
        收藏
      </ToggleButton>,
    );

    const button = screen.getByRole("button", { name: "收藏" });
    await userEvent.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
    expect(button).toHaveAttribute("aria-pressed", "false");

    rerender(
      <ToggleButton pressed onPressedChange={onPressedChange}>
        收藏
      </ToggleButton>,
    );
    expect(screen.getByRole("button", { name: "收藏" })).toHaveAttribute("aria-pressed", "true");
  });

  it("does not press when disabled", async () => {
    const onPressedChange = vi.fn();
    render(
      <ToggleButton disabled onPressedChange={onPressedChange}>
        停用
      </ToggleButton>,
    );

    await userEvent.click(screen.getByRole("button", { name: "停用" }));
    expect(onPressedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "停用" })).toHaveAttribute("aria-pressed", "false");
  });

  it("uses the pressed Selected fill for icon buttons", async () => {
    render(
      <ToggleButton appearance="icon" aria-label="星标">
        <EyeIcon />
      </ToggleButton>,
    );

    const button = screen.getByRole("button", { name: "星标" });
    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button.className).toContain("aria-pressed:bg-lark-primary-soft");
    // The 100ms colour transition means the fill lands just after the press.
    await vi.waitFor(() => {
      expect(getComputedStyle(button).backgroundColor).toBe("rgb(224, 233, 255)");
    });
  });
});
