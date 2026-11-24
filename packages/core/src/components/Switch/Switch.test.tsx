import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("toggles with pointer and keyboard", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange}>飞行模式</Switch>);

    const control = screen.getByRole("switch", { name: "飞行模式" });
    expect(control).toHaveAttribute("aria-checked", "false");

    await userEvent.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());

    await userEvent.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("does not toggle when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch disabled onCheckedChange={onCheckedChange}>
        自动更新
      </Switch>,
    );

    await userEvent.click(screen.getByRole("switch", { name: "自动更新" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("blocks changes and shows a spinner while loading", async () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Switch loading onCheckedChange={onCheckedChange}>
        同步中
      </Switch>,
    );

    const control = screen.getByRole("switch", { name: "同步中" });
    expect(control).toHaveAttribute("aria-busy", "true");
    const spinner = container.querySelector(".lark-spinner") as HTMLElement;
    expect(spinner).not.toBeNull();
    expect(getComputedStyle(spinner).width).toBe("14px");

    await userEvent.click(control);
    expect(onCheckedChange).not.toHaveBeenCalled();
    // An uncontrolled switch must not move to the other state while it is loading.
    expect(control).toHaveAttribute("aria-checked", "false");
  });

  it("keeps focus and ignores the keyboard while loading", async () => {
    render(<Switch loading>同步中</Switch>);

    const control = screen.getByRole("switch", { name: "同步中" });
    await userEvent.tab();
    expect(control).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(control).toHaveFocus();
  });

  it("tones the loading spinner for each checked state", () => {
    const { container, rerender } = render(<Switch loading>关闭中</Switch>);
    const off = container.querySelector(".lark-spinner") as HTMLElement;
    expect(getComputedStyle(off).color).toBe("rgb(187, 191, 196)");

    rerender(
      <Switch loading checked>
        开启中
      </Switch>,
    );
    const on = container.querySelector(".lark-spinner") as HTMLElement;
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    expect(getComputedStyle(on).color).toBe("rgb(194, 212, 255)");
  });

  it("uses the disabled track token in dark mode", async () => {
    document.documentElement.dataset.theme = "dark";
    try {
      render(<Switch disabled>自动更新</Switch>);
      const control = screen.getByRole("switch", { name: "自动更新" });
      await vi.waitFor(() => {
        expect(getComputedStyle(control).backgroundColor).toBe("rgba(235, 235, 235, 0.15)");
      });
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it("uses the documented small and medium track sizes", () => {
    const { rerender } = render(<Switch size="sm">小开关</Switch>);
    let control = screen.getByRole("switch");
    expect(control).toHaveClass("h-4", "w-7");

    rerender(<Switch size="md">中开关</Switch>);
    control = screen.getByRole("switch");
    expect(control).toHaveClass("h-[22px]", "w-10");
  });

  it("starts checked when defaultChecked is passed", () => {
    render(<Switch defaultChecked>已开启</Switch>);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });
});
