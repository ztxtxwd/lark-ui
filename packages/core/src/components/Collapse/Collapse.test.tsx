import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Collapse, CollapseHeader, CollapseItem, CollapsePanel, CollapseTrigger } from "./Collapse";

function BasicCollapse({ multiple }: { multiple?: boolean }) {
  return (
    <Collapse defaultValue={["a"]} multiple={multiple}>
      <CollapseItem value="a" title="标题 A">
        内容 A
      </CollapseItem>
      <CollapseItem value="b" title="标题 B">
        内容 B
      </CollapseItem>
    </Collapse>
  );
}

describe("Collapse", () => {
  it("renders triggers inside headings and labels their panels", async () => {
    render(<BasicCollapse />);

    const trigger = screen.getByRole("button", { name: "标题 A" });
    expect(trigger.closest("h3")).not.toBeNull();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-controls");
    });

    const panel = screen.getByRole("region", { name: "标题 A" });
    expect(panel).toHaveTextContent("内容 A");
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
    expect(screen.queryByText("内容 B")).not.toBeInTheDocument();
  });

  it("toggles when the rest of the header row is pressed", async () => {
    render(<BasicCollapse />);

    const trigger = screen.getByRole("button", { name: "标题 B" });
    const header = trigger.closest("h3") as HTMLElement;
    await userEvent.click(header);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("内容 B")).toBeInTheDocument();
  });

  it("opens several panels by default, following the UD basic behaviour", async () => {
    render(<BasicCollapse />);

    await userEvent.click(screen.getByRole("button", { name: "标题 B" }));
    expect(screen.getByRole("button", { name: "标题 A" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "标题 B" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("内容 B")).toBeInTheDocument();
  });

  it("keeps a single panel open in accordion mode", async () => {
    render(<BasicCollapse multiple={false} />);

    await userEvent.click(screen.getByRole("button", { name: "标题 B" }));
    expect(screen.getByRole("button", { name: "标题 B" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "标题 A" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await waitFor(() => {
      expect(screen.queryByText("内容 A")).not.toBeInTheDocument();
    });
  });

  it("closes an open panel when its trigger is pressed again", async () => {
    render(<BasicCollapse />);

    await userEvent.click(screen.getByRole("button", { name: "标题 A" }));
    expect(screen.getByRole("button", { name: "标题 A" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await waitFor(() => {
      expect(screen.queryByText("内容 A")).not.toBeInTheDocument();
    });
  });

  it("toggles with Enter and Space from the keyboard", async () => {
    render(
      <Collapse>
        <CollapseItem value="a" title="键盘标题">
          键盘内容
        </CollapseItem>
      </Collapse>,
    );

    await userEvent.tab();
    const trigger = screen.getByRole("button", { name: "键盘标题" });
    expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard(" ");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("shows a visible focus ring on the trigger", async () => {
    render(<BasicCollapse />);

    await userEvent.tab();
    const trigger = screen.getByRole("button", { name: "标题 A" });
    expect(trigger).toHaveFocus();
    expect(trigger.matches(":focus-visible")).toBe(true);

    const style = getComputedStyle(trigger);
    expect(style.outlineStyle).toBe("solid");
    expect(style.outlineWidth).toBe("2px");
  });

  it("keeps a disabled trigger focusable but inert", async () => {
    render(
      <Collapse>
        <CollapseItem value="a" title="禁用标题" disabled>
          禁用内容
        </CollapseItem>
      </Collapse>,
    );

    const trigger = screen.getByRole("button", { name: "禁用标题" });
    expect(trigger).toHaveAttribute("aria-disabled", "true");

    await userEvent.tab();
    expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("禁用内容")).not.toBeInTheDocument();
  });

  it("renders extra content outside the trigger so controls do not toggle", async () => {
    render(
      <Collapse>
        <CollapseItem value="a" title="通知设置" extra={<button type="button">配置</button>}>
          通知内容
        </CollapseItem>
      </Collapse>,
    );

    const trigger = screen.getByRole("button", { name: "通知设置" });
    await userEvent.click(screen.getByRole("button", { name: "配置" }));

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("通知内容")).not.toBeInTheDocument();
  });

  it("supports composed headers and panels without the title shorthand", () => {
    render(
      <Collapse defaultValue={["x"]}>
        <CollapseItem value="x">
          <CollapseHeader>
            <CollapseTrigger>自定义标题</CollapseTrigger>
          </CollapseHeader>
          <CollapsePanel>自定义内容</CollapsePanel>
        </CollapseItem>
      </Collapse>,
    );

    expect(screen.getByRole("button", { name: "自定义标题" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("region", { name: "自定义标题" })).toHaveTextContent("自定义内容");
  });

  it("aligns left-positioned arrows with the panel content", () => {
    render(
      <Collapse defaultValue={["a"]} iconPosition="left" bordered={false}>
        <CollapseItem value="a" title="左侧箭头" extra="附加信息">
          左侧内容
        </CollapseItem>
      </Collapse>,
    );

    const trigger = screen.getByRole("button", { name: "左侧箭头" });
    expect(trigger).toHaveClass("pl-0");

    const chevron = trigger.closest("h3")?.querySelector("svg");
    expect(chevron).toHaveAttribute("width", "10");
    expect(chevron).toHaveClass("-rotate-90");
    expect(chevron).toHaveClass("group-data-[open]/collapse-header:rotate-0");

    const item = trigger.closest('[data-slot="accordion-item"]');
    expect(item).not.toHaveClass("border-t");

    const content = screen.getByText("左侧内容");
    expect(content).toHaveClass("ps-6");
    expect(content).toHaveClass("pe-2");
  });

  it("leaves the documented 8px gap between the left arrow and the title", () => {
    render(
      <Collapse iconPosition="left">
        <CollapseItem value="a" title="左侧间距">
          间距内容
        </CollapseItem>
      </Collapse>,
    );

    const title = screen.getByText("左侧间距");
    const chevron = title.closest("h3")?.querySelector("svg") as SVGSVGElement;
    const gap = title.getBoundingClientRect().left - chevron.getBoundingClientRect().right;
    expect(Math.round(gap)).toBe(8);
  });

  it("uses the UD 40px header, 8px padding and 200ms panel transition", () => {
    render(
      <Collapse defaultValue={["a"]}>
        <CollapseItem value="a" title="尺寸标题">
          尺寸内容
        </CollapseItem>
      </Collapse>,
    );

    const trigger = screen.getByRole("button", { name: "尺寸标题" });
    const triggerStyle = getComputedStyle(trigger);
    expect(triggerStyle.minHeight).toBe("40px");
    expect(triggerStyle.paddingTop).toBe("8px");
    expect(triggerStyle.paddingLeft).toBe("8px");

    const item = trigger.closest('[data-slot="accordion-item"]') as HTMLElement;
    expect(getComputedStyle(item).borderTopWidth).toBe("1px");

    const panel = screen.getByRole("region", { name: "尺寸标题" });
    expect(getComputedStyle(panel).transitionDuration).toContain("0.2s");

    const chevron = trigger.closest("h3")?.querySelector("svg");
    expect(chevron).toHaveClass("group-data-[open]/collapse-header:rotate-180");
  });

  it("uses the UD divider and reduced-motion animation classes", () => {
    render(
      <Collapse defaultValue={["a"]}>
        <CollapseItem value="a" title="动画标题">
          动画内容
        </CollapseItem>
      </Collapse>,
    );

    const trigger = screen.getByRole("button", { name: "动画标题" });
    const item = trigger.closest('[data-slot="accordion-item"]');
    expect(item).toHaveClass("border-t");
    expect(item).toHaveClass("border-lark-divider");

    const panel = screen.getByRole("region", { name: "动画标题" });
    expect(panel).toHaveClass("duration-200");
    expect(panel).toHaveClass("ease-lark");
    expect(panel).toHaveClass("motion-reduce:transition-none");
    expect(panel).toHaveClass("data-[starting-style]:h-0");
  });
});
