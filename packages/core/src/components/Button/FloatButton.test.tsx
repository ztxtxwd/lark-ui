import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MoreHorizontalIcon, PlusIcon } from "../../icons";
import { FloatButton } from "./FloatButton";

describe("FloatButton", () => {
  it("renders a primary circular float with elevation", async () => {
    const onClick = vi.fn();
    render(
      <FloatButton aria-label="新建" onClick={onClick}>
        <PlusIcon />
      </FloatButton>,
    );

    const button = screen.getByRole("button", { name: "新建" });
    expect(button.className).toContain("size-10");
    expect(button.className).toContain("rounded-lark-full");
    expect(button.className).toContain("shadow-lark-3");
    expect(getComputedStyle(button).backgroundColor).toBe("rgb(20, 86, 240)");

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders the secondary float on the floating surface", () => {
    render(
      <FloatButton tone="neutral" size="lg" aria-label="回到顶部">
        <MoreHorizontalIcon />
      </FloatButton>,
    );

    const button = screen.getByRole("button", { name: "回到顶部" });
    expect(button.className).toContain("bg-lark-float");
    expect(button.className).toContain("size-12");
    expect(getComputedStyle(button).backgroundColor).toBe("rgb(255, 255, 255)");
  });

  it("supports the 36 / 40 / 48px sizes", () => {
    const { rerender } = render(<FloatButton aria-label="小">+</FloatButton>);
    expect(screen.getByRole("button")).toHaveClass("size-10");

    rerender(
      <FloatButton size="sm" aria-label="小">
        +
      </FloatButton>,
    );
    expect(screen.getByRole("button", { name: "小" })).toHaveClass("size-9");

    rerender(
      <FloatButton size="lg" aria-label="大">
        +
      </FloatButton>,
    );
    expect(screen.getByRole("button", { name: "大" })).toHaveClass("size-12");
  });

  it("pins to a viewport corner when fixed", () => {
    render(
      <FloatButton fixed position="bottom-left" aria-label="帮助">
        ?
      </FloatButton>,
    );

    const button = screen.getByRole("button", { name: "帮助" });
    expect(button.className).toContain("fixed");
    expect(button.className).toContain("bottom-6");
    expect(button.className).toContain("left-6");
    expect(button.className).toContain("z-50");
  });

  it("renders a text pill when shape is round", () => {
    render(
      <FloatButton shape="round" aria-label="立即体验">
        立即体验
      </FloatButton>,
    );

    const button = screen.getByRole("button", { name: "立即体验" });
    expect(button.className).toContain("rounded-lark-full");
    expect(button.className).toContain("h-10");
    expect(button.className).toContain("px-4");
  });

  it("shows an icon tooltip on hover", async () => {
    render(
      <FloatButton aria-label="新建" tooltip="新建文档">
        <PlusIcon />
      </FloatButton>,
    );

    await userEvent.hover(screen.getByRole("button", { name: "新建" }));
    expect(await screen.findByRole("tooltip", {}, { timeout: 1000 })).toHaveTextContent("新建文档");
  });

  it("keeps a disabled float focusable when a tooltip explains why", async () => {
    const onClick = vi.fn();
    render(
      <FloatButton aria-label="新建" tooltip="空间已满，无法新建" disabled onClick={onClick}>
        <PlusIcon />
      </FloatButton>,
    );

    const button = screen.getByRole("button", { name: "新建" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toHaveAttribute("disabled");
    expect(button).toHaveAttribute("data-disabled");

    await userEvent.tab();
    expect(button).toHaveFocus();
    expect(await screen.findByRole("tooltip", {}, { timeout: 1000 })).toHaveTextContent(
      "空间已满，无法新建",
    );

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps a disabled menu trigger focusable when a tooltip explains why", async () => {
    render(
      <FloatButton
        aria-label="加入用户群"
        menuLabel="加入用户群"
        tooltip="当前空间未开通用户群"
        disabled
        items={[{ value: "react", label: "React 用户群" }]}
      >
        <MoreHorizontalIcon />
      </FloatButton>,
    );

    const trigger = screen.getByRole("button", { name: "加入用户群" });
    expect(trigger).toHaveAttribute("aria-disabled", "true");
    expect(trigger).not.toHaveAttribute("disabled");
    expect(trigger).toHaveAttribute("data-disabled");

    await userEvent.tab();
    expect(trigger).toHaveFocus();
    expect(await screen.findByRole("tooltip", {}, { timeout: 1000 })).toHaveTextContent(
      "当前空间未开通用户群",
    );

    await userEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("drops the default menu hint instead of hanging it on a disabled trigger", () => {
    render(
      <FloatButton
        aria-label="加入用户群"
        menuLabel="加入用户群"
        disabled
        items={[{ value: "react", label: "React 用户群" }]}
      >
        <MoreHorizontalIcon />
      </FloatButton>,
    );

    const trigger = screen.getByRole("button", { name: "加入用户群" });
    expect(trigger).toHaveAttribute("disabled");
    expect(trigger).not.toHaveAttribute("aria-disabled");
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

  it("opens a menu of related actions above the float", async () => {
    const onSelect = vi.fn();
    render(
      <FloatButton
        aria-label="加入用户群"
        menuLabel="加入用户群"
        onSelect={onSelect}
        items={[
          { value: "react", label: "React 用户群" },
          { value: "miniapp", label: "小程序用户群" },
          { value: "android", label: "Android 用户群" },
        ]}
      >
        <MoreHorizontalIcon />
      </FloatButton>,
    );

    const trigger = screen.getByRole("button", { name: "加入用户群" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await userEvent.click(trigger);

    const menu = await screen.findByRole("menu", { name: "加入用户群" });
    expect(within(menu).getAllByRole("menuitem")).toHaveLength(3);
    await userEvent.click(within(menu).getByRole("menuitem", { name: "React 用户群" }));
    expect(onSelect).toHaveBeenCalledWith("react");
  });
});
