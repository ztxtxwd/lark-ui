import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";
import { NavigationMenu, type NavigationMenuItemData } from "./NavigationMenu";

async function contrastViolations(element: Element) {
  const result = await axe.run(element, {
    runOnly: { type: "rule", values: ["color-contrast"] },
    resultTypes: ["violations"],
  });
  return result.violations.map((violation) => violation.nodes.map((node) => node.target.join(" ")));
}

const items: NavigationMenuItemData[] = [
  { key: "home", label: "首页", href: "#home" },
  {
    key: "products",
    label: "产品",
    children: [
      { key: "docs", label: "文档", href: "#docs", description: "使用指南与 API" },
      { key: "sheets", label: "表格", href: "#sheets" },
    ],
  },
  { key: "pricing", label: "价格", href: "#pricing" },
];

describe("NavigationMenu", () => {
  it("renders a named navigation landmark with brand, links and actions", () => {
    render(
      <NavigationMenu
        label="主导航"
        brand={<span>Lark</span>}
        brandHref="/"
        brandLabel="Lark 首页"
        actions={<button type="button">搜索</button>}
        items={items}
        defaultActiveKey="home"
      />,
    );

    const nav = screen.getByRole("navigation", { name: "主导航" });
    expect(nav).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByRole("link", { name: "Lark 首页" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "搜索" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "首页" })).toHaveAttribute("href", "#home");
    expect(screen.getByRole("button", { name: "产品" })).toBeInTheDocument();
  });

  it("marks the active link with aria-current and the UD underline", () => {
    render(<NavigationMenu items={items} defaultActiveKey="home" />);

    const home = screen.getByRole("link", { name: "首页" });
    expect(home).toHaveAttribute("aria-current", "page");
    expect(home).toHaveAttribute("data-active");
    expect(screen.getByRole("link", { name: "价格" })).not.toHaveAttribute("data-active");

    const after = getComputedStyle(home, "::after");
    expect(after.height).toBe("3px");
    expect(after.opacity).toBe("1");
    expect(getComputedStyle(screen.getByRole("link", { name: "价格" }), "::after").opacity).toBe(
      "0",
    );
  });

  it("changes the active item on click when uncontrolled", async () => {
    const onSelect = vi.fn();
    render(<NavigationMenu items={items} defaultActiveKey="home" onSelect={onSelect} />);

    await userEvent.click(screen.getByRole("link", { name: "价格" }));

    expect(onSelect).toHaveBeenCalledWith("pricing");
    expect(screen.getByRole("link", { name: "价格" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "首页" })).not.toHaveAttribute("data-active");
  });

  it("respects a controlled active item", async () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <NavigationMenu items={items} activeKey="home" onSelect={onSelect} />,
    );

    await userEvent.click(screen.getByRole("link", { name: "价格" }));
    expect(onSelect).toHaveBeenCalledWith("pricing");
    expect(screen.getByRole("link", { name: "首页" })).toHaveAttribute("aria-current", "page");

    rerender(<NavigationMenu items={items} activeKey="pricing" onSelect={onSelect} />);
    expect(screen.getByRole("link", { name: "价格" })).toHaveAttribute("aria-current", "page");
  });

  it("opens a dropdown with the keyboard and closes it with Escape", async () => {
    render(<NavigationMenu items={items} defaultActiveKey="home" />);

    const trigger = screen.getByRole("button", { name: "产品" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");

    const docs = await screen.findByRole("link", { name: /文档/ });
    expect(docs).toHaveAttribute("href", "#docs");
    expect(screen.getByText("使用指南与 API")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard("{Escape}");
    await vi.waitFor(() => {
      expect(screen.queryByRole("link", { name: /文档/ })).not.toBeInTheDocument();
    });
  });

  it("opens a dropdown on hover intent", async () => {
    render(<NavigationMenu items={items} defaultActiveKey="home" />);

    await userEvent.hover(screen.getByRole("button", { name: "产品" }));

    expect(await screen.findByRole("link", { name: /文档/ })).toBeInTheDocument();
  });

  it("keeps the current panel link readable on its tint in dark mode", async () => {
    document.documentElement.dataset.theme = "dark";
    try {
      render(<NavigationMenu items={items} activeKey="docs" defaultValue="products" />);

      const docs = await screen.findByRole("link", { name: /文档/ });
      expect(docs).toHaveAttribute("aria-current", "page");

      const panel = docs.closest('[data-slot="navigation-menu-content"]') as HTMLElement;
      // Let the open transition finish; axe skips a fully transparent panel.
      await vi.waitFor(() => expect(getComputedStyle(panel).opacity).toBe("1"));
      expect(await contrastViolations(panel)).toEqual([]);
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it("activates the branch when a panel link is chosen", async () => {
    const onSelect = vi.fn();
    render(<NavigationMenu items={items} defaultActiveKey="home" onSelect={onSelect} />);

    const trigger = screen.getByRole("button", { name: "产品" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("link", { name: /文档/ }));

    expect(onSelect).toHaveBeenCalledWith("docs");
    await vi.waitFor(() => {
      expect(trigger).toHaveAttribute("data-active");
      expect(trigger).toHaveAttribute("aria-current", "true");
    });
  });

  it("uses UD top navigation metrics", () => {
    render(<NavigationMenu items={items} defaultActiveKey="home" />);

    const home = screen.getByRole("link", { name: "首页" });
    const styles = getComputedStyle(home);
    expect(styles.height).toBe("56px");
    expect(styles.fontSize).toBe("16px");
    expect(styles.paddingLeft).toBe("16px");
    expect(styles.paddingRight).toBe("16px");
  });

  it("caps a long top-level label at the documented 320px and truncates it", () => {
    const longLabel =
      "这是一个非常长的导航分类标签名称用于验证超出三百二十像素之后的省略号截断行为";
    render(
      <NavigationMenu
        items={[
          { key: "long", label: longLabel, href: "#long" },
          {
            key: "menu",
            label: longLabel,
            children: [{ key: "child", label: "子项" }],
          },
        ]}
      />,
    );

    const link = screen.getByRole("link", { name: longLabel });
    const linkSpan = link.querySelector("span") as HTMLElement;
    expect(linkSpan.getBoundingClientRect().width).toBeLessThanOrEqual(320);
    expect(getComputedStyle(linkSpan).textOverflow).toBe("ellipsis");
    expect(link.getBoundingClientRect().width).toBeLessThanOrEqual(352);

    const trigger = screen.getByRole("button", { name: longLabel });
    const triggerSpan = trigger.querySelector("span") as HTMLElement;
    expect(triggerSpan.getBoundingClientRect().width).toBeLessThanOrEqual(320);
    expect(getComputedStyle(triggerSpan).textOverflow).toBe("ellipsis");
  });

  it("shows a visible focus ring on keyboard-focused entries", async () => {
    render(<NavigationMenu items={items} defaultActiveKey="home" />);

    await userEvent.tab();
    const home = screen.getByRole("link", { name: "首页" });
    expect(home).toHaveFocus();
    expect(home.matches(":focus-visible")).toBe(true);
    const style = getComputedStyle(home);
    expect(style.outlineStyle).toBe("solid");
    expect(style.outlineWidth).toBe("2px");
  });

  it("supports the vertical sidebar and arrow-key navigation", async () => {
    render(
      <NavigationMenu
        label="侧边导航"
        orientation="vertical"
        items={items}
        defaultActiveKey="home"
      />,
    );

    const nav = screen.getByRole("navigation", { name: "侧边导航" });
    expect(nav).toHaveAttribute("data-orientation", "vertical");

    const home = screen.getByRole("link", { name: "首页" });
    expect(getComputedStyle(home).height).toBe("40px");
    expect(getComputedStyle(home).fontSize).toBe("14px");
    expect(home).toHaveAttribute("data-active");

    home.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "产品" })).toHaveFocus();
  });

  it("renders a top-level entry without href as a focusable button", async () => {
    const onSelect = vi.fn();
    render(
      <NavigationMenu items={[{ key: "notifications", label: "通知" }]} onSelect={onSelect} />,
    );

    const action = screen.getByRole("button", { name: "通知" });
    expect(screen.queryByRole("link", { name: "通知" })).not.toBeInTheDocument();

    await userEvent.tab();
    expect(action).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("notifications");
  });

  it("renders a panel entry without href as a focusable button", async () => {
    const onSelect = vi.fn();
    render(
      <NavigationMenu
        items={[
          {
            key: "products",
            label: "产品",
            children: [{ key: "new", label: "新建产品" }],
          },
        ]}
        onSelect={onSelect}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "产品" }));
    const action = await screen.findByRole("button", { name: "新建产品" });
    expect(screen.queryByRole("link", { name: "新建产品" })).not.toBeInTheDocument();

    await userEvent.click(action);
    expect(onSelect).toHaveBeenCalledWith("new");
  });

  it("does not select a disabled entry", async () => {
    const onSelect = vi.fn();
    render(
      <NavigationMenu
        items={[
          { key: "home", label: "首页", href: "#home" },
          { key: "beta", label: "灰度", href: "#beta", disabled: true },
        ]}
        defaultActiveKey="home"
        onSelect={onSelect}
      />,
    );

    await userEvent.click(screen.getByRole("link", { name: "灰度" }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "灰度" })).toHaveAttribute("aria-disabled", "true");
  });
});
