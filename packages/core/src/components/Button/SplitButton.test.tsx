import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { PlusIcon } from "../../icons";
import { SplitButton } from "./SplitButton";

const items = [
  { value: "copy", label: "复制" },
  { value: "share", label: "分享" },
  { value: "export", label: "导出" },
  { value: "delete", label: "删除", danger: true },
];

function Demo({
  onAction,
  onSelect,
  ...props
}: {
  onAction?: () => void;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  block?: boolean;
  variant?: "split" | "menu";
  tooltip?: ReactNode | false;
  "aria-label"?: string;
}) {
  return (
    <SplitButton
      items={items}
      startIcon={<PlusIcon />}
      onClick={onAction}
      onSelect={onSelect}
      {...props}
    >
      新建
    </SplitButton>
  );
}

describe("SplitButton", () => {
  it("runs the main action from the left segment", async () => {
    const onAction = vi.fn();
    render(<Demo onAction={onAction} />);

    await userEvent.click(screen.getByRole("button", { name: "新建" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("opens the action menu from the divided segment", async () => {
    const onAction = vi.fn();
    const onSelect = vi.fn();
    render(<Demo onAction={onAction} onSelect={onSelect} />);

    const trigger = screen.getByRole("button", { name: "更多操作" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Open keeps the filled segment in its hover look and flips the chevron.
    await vi.waitFor(() => {
      expect(getComputedStyle(trigger).backgroundColor).toBe("rgb(51, 109, 244)");
      expect(getComputedStyle(trigger.querySelector("svg") as SVGElement).rotate).toBe("180deg");
    });

    const menu = await screen.findByRole("menu", { name: "更多操作" });
    expect(within(menu).getAllByRole("menuitem")).toHaveLength(4);

    await userEvent.click(within(menu).getByRole("menuitem", { name: "分享" }));
    expect(onSelect).toHaveBeenCalledWith("share");
    expect(onAction).not.toHaveBeenCalled();
  });

  it("draws the UD full-height divider and separate hit areas", () => {
    render(<Demo />);

    const main = screen.getByRole("button", { name: "新建" });
    const trigger = screen.getByRole("button", { name: "更多操作" });

    expect(main.className).toContain("rounded-r-none");
    expect(trigger.className).toContain("rounded-l-none");
    expect(trigger.className).toContain("-ml-px");
    expect(trigger.className).toContain("border-l-lark-on-primary");
    expect(trigger.className).toContain("w-8");

    const triggerStyle = getComputedStyle(trigger);
    expect(triggerStyle.borderLeftColor).toBe("rgb(255, 255, 255)");
    expect(triggerStyle.borderTopLeftRadius).toBe("0px");
    expect(triggerStyle.width).toBe("32px");
    expect(getComputedStyle(main).borderTopRightRadius).toBe("0px");
  });

  it("keeps the whole menu button as one hit area", async () => {
    render(<Demo variant="menu" />);

    const button = screen.getByRole("button", { name: "新建" });
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(button.className).not.toContain("rounded-l-none");

    await userEvent.click(button);
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("shows a hover tooltip describing the dropdown segment", async () => {
    render(<Demo />);

    await userEvent.hover(screen.getByRole("button", { name: "更多操作" }));
    const tooltip = await screen.findByRole("tooltip", {}, { timeout: 1000 });
    expect(tooltip).toHaveTextContent("更多操作");
  });

  it("disables both segments", () => {
    render(<Demo disabled />);

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });

  it("drops the default menu hint instead of hanging it on a disabled segment", () => {
    render(<Demo disabled />);

    const trigger = screen.getByRole("button", { name: "更多操作" });
    expect(trigger).toHaveAttribute("disabled");
    expect(trigger).not.toHaveAttribute("aria-disabled");
    // A mounted Tooltip would describe the trigger even while closed.
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

  it("keeps a disabled segment focusable when a tooltip explains why", async () => {
    const onSelect = vi.fn();
    render(<Demo disabled tooltip="当前空间没有操作权限" onSelect={onSelect} />);

    const trigger = screen.getByRole("button", { name: "更多操作" });
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(trigger).not.toHaveAttribute("disabled");
    // The focusable path still renders the UD disabled fill.
    expect(trigger).toHaveAttribute("data-disabled");
    expect(getComputedStyle(trigger).backgroundColor).toBe("rgb(187, 191, 196)");

    await userEvent.tab();
    expect(trigger).toHaveFocus();
    expect(await screen.findByRole("tooltip", {}, { timeout: 1000 })).toHaveTextContent(
      "当前空间没有操作权限",
    );

    await userEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("stretches the main action for block layouts", () => {
    render(<Demo block />);

    const main = screen.getByRole("button", { name: "新建" });
    expect(main.parentElement?.className).toContain("flex");
    expect(main.parentElement?.className).toContain("w-full");
    expect(main.className).toContain("flex-1");
  });
});
