import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs, TabsList, TabsPanel, TabsTab } from "./Tabs";

function BasicTabs(props: { variant?: "line" | "capsule" | "card" }) {
  return (
    <Tabs defaultValue="overview" variant={props.variant}>
      <TabsList aria-label="视图">
        <TabsTab value="overview">概览</TabsTab>
        <TabsTab value="members">成员</TabsTab>
        <TabsTab value="settings" disabled>
          设置
        </TabsTab>
      </TabsList>
      <TabsPanel value="overview">概览内容</TabsPanel>
      <TabsPanel value="members">成员内容</TabsPanel>
      <TabsPanel value="settings">设置内容</TabsPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders a named tablist with the first panel selected", () => {
    render(<BasicTabs />);

    expect(screen.getByRole("tablist", { name: "视图" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "概览" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("概览内容")).toBeInTheDocument();
  });

  it("switches panels on pointer and keyboard", async () => {
    render(<BasicTabs />);

    await userEvent.click(screen.getByRole("tab", { name: "成员" }));
    expect(screen.getByRole("tab", { name: "成员" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("成员内容")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "概览" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "成员" })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps a disabled tab focusable but not selectable", async () => {
    render(<BasicTabs />);

    const settings = screen.getByRole("tab", { name: "设置" });
    expect(settings).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(settings);
    expect(screen.getByRole("tab", { name: "概览" })).toHaveAttribute("aria-selected", "true");
  });

  it("positions the UD 2px selected indicator under the active tab", () => {
    const { container } = render(<BasicTabs />);

    const indicator = container.querySelector('[data-slot="tabs-indicator"]');
    expect(indicator).not.toBeNull();
    expect(indicator?.getBoundingClientRect().width).toBeGreaterThan(0);
    expect(indicator?.className).toContain("h-0.5");
    expect(indicator?.className).toContain("bg-lark-primary-content");
    expect(getComputedStyle(indicator as Element).transitionProperty).toBe("none");

    const list = screen.getByRole("tablist");
    expect(getComputedStyle(list).borderBottomWidth).toBe("0px");
    expect(getComputedStyle(list, "::after").backgroundColor).toBe("rgba(31, 35, 41, 0.15)");
  });

  it("renders the capsule and card variants", () => {
    const { rerender } = render(<BasicTabs variant="capsule" />);
    expect(screen.getByRole("tab", { name: "概览" }).className).toContain("rounded-lark-md");

    rerender(<BasicTabs variant="card" />);
    expect(screen.getByRole("tab", { name: "概览" }).className).toContain("rounded-t-lark-md");
  });

  it("paints the selected card tab with the panel surface so they join", () => {
    render(<BasicTabs variant="card" />);

    const selected = screen.getByRole("tab", { name: "概览" });
    const panel = screen.getByText("概览内容");

    expect(getComputedStyle(selected).backgroundColor).toBe(
      getComputedStyle(panel).backgroundColor,
    );
    expect(getComputedStyle(selected).backgroundColor).toBe("rgb(242, 243, 245)");
    expect(getComputedStyle(selected).borderBottomColor).toBe("rgba(0, 0, 0, 0)");
    expect(getComputedStyle(selected).zIndex).toBe("10");

    const list = screen.getByRole("tablist");
    expect(getComputedStyle(list).borderBottomWidth).toBe("0px");
    const divider = getComputedStyle(list, "::after");
    expect(divider.content).not.toBe("none");
    expect(divider.height).toBe("1px");
    expect(divider.backgroundColor).toBe("rgb(222, 224, 227)");
  });

  it("shows a visible focus ring on the selected tab", async () => {
    render(<BasicTabs />);

    await userEvent.tab();
    const selected = screen.getByRole("tab", { name: "概览" });
    expect(selected).toHaveFocus();
    expect(selected.matches(":focus-visible")).toBe(true);

    const style = getComputedStyle(selected);
    expect(style.outlineStyle).toBe("solid");
    expect(style.outlineWidth).toBe("2px");
  });

  it("keeps disabled line and card tabs dimmed on hover", async () => {
    const { rerender } = render(<BasicTabs />);
    const lineDisabled = screen.getByRole("tab", { name: "设置" });
    await userEvent.hover(lineDisabled);
    expect(getComputedStyle(lineDisabled).color).toBe("rgb(187, 191, 196)");

    rerender(<BasicTabs variant="card" />);
    const cardDisabled = screen.getByRole("tab", { name: "设置" });
    await userEvent.hover(cardDisabled);
    expect(getComputedStyle(cardDisabled).color).toBe("rgb(187, 191, 196)");
  });
});
