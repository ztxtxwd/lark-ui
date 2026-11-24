import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "./Popover";

describe("Popover", () => {
  it("opens on press and is named by its title", async () => {
    render(
      <Popover
        trigger={<button type="button">查看详情</button>}
        title="文档权限"
        description="拥有链接的人都可以查看"
        content={<p>链接将在 7 天后失效</p>}
      />,
    );

    const trigger = screen.getByRole("button", { name: "查看详情" });
    await userEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "文档权限" });
    expect(dialog).toHaveTextContent("拥有链接的人都可以查看");
    expect(dialog).toHaveTextContent("链接将在 7 天后失效");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    render(
      <Popover
        trigger={<button type="button">筛选</button>}
        title="筛选条件"
        content="按负责人筛选"
      />,
    );

    const trigger = screen.getByRole("button", { name: "筛选" });
    await userEvent.click(trigger);
    await screen.findByRole("dialog", { name: "筛选条件" });

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("closes on a press outside", async () => {
    render(<Popover trigger={<button type="button">设置</button>} title="设置" content="内容" />);

    await userEvent.click(screen.getByRole("button", { name: "设置" }));
    await screen.findByRole("dialog", { name: "设置" });

    await userEvent.click(document.body);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes from a footer action and renders a full-width divider", async () => {
    render(
      <Popover
        trigger={<button type="button">删除</button>}
        title="删除文档？"
        content="删除后无法恢复。"
        footer={
          <>
            <PopoverClose>取消</PopoverClose>
            <PopoverClose>删除</PopoverClose>
          </>
        }
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "删除" }));
    const dialog = await screen.findByRole("dialog", { name: "删除文档？" });
    expect(dialog.querySelector(".border-t")).not.toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "取消" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("draws the UD arrow by default and can hide it", async () => {
    const { rerender } = render(
      // Away from the viewport edges, so the positioner doesn't clamp
      // the arrow short of the trigger's middle.
      <div className="flex justify-center pt-24">
        <Popover trigger={<button type="button">打开</button>} title="带箭头" content="内容" />
      </div>,
    );

    await userEvent.click(screen.getByRole("button", { name: "打开" }));
    let dialog = await screen.findByRole("dialog", { name: "带箭头" });
    const arrow = dialog.querySelector('[data-slot="popover-arrow"]') as HTMLElement;
    expect(arrow).not.toBeNull();
    expect(arrow).toHaveAttribute("aria-hidden", "true");
    expect(arrow.className).toContain("data-[side=top]");

    const arrowStyle = getComputedStyle(arrow);
    expect(arrowStyle.width).toBe("12px");
    expect(arrowStyle.height).toBe("6px");

    const shape = arrow.querySelector('[class*="border-t-lark-border-card"]') as HTMLElement;
    expect(shape).not.toBeNull();
    const arrowRect = arrow.getBoundingClientRect();
    const shapeRect = shape.getBoundingClientRect();
    expect(
      Math.abs(arrowRect.left + arrowRect.width / 2 - (shapeRect.left + shapeRect.width / 2)),
    ).toBeLessThan(1);
    expect(
      Math.abs(arrowRect.top + arrowRect.height / 2 - (shapeRect.top + shapeRect.height / 2)),
    ).toBeLessThan(1);

    // The arrow points at the middle of the trigger, within the
    // positioner's rounding tolerance. Placement settles on a rAF, so
    // wait for the positioner to write its offset first.
    await waitFor(() => {
      expect(dialog.style.getPropertyValue("--arrow-offset")).not.toBe("");
    });
    const triggerRect = screen.getByRole("button", { name: "打开" }).getBoundingClientRect();
    const placedRect = arrow.getBoundingClientRect();
    expect(
      Math.abs(placedRect.left + placedRect.width / 2 - (triggerRect.left + triggerRect.width / 2)),
    ).toBeLessThanOrEqual(1);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    rerender(
      <Popover
        trigger={<button type="button">打开</button>}
        title="无箭头"
        content="内容"
        arrow={false}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "打开" }));
    dialog = await screen.findByRole("dialog", { name: "无箭头" });
    expect(dialog.querySelector('[data-slot="popover-arrow"]')).toBeNull();
  });

  it("applies the requested alignment, size and custom class", async () => {
    render(
      <Popover
        trigger={<button type="button">打开</button>}
        title="大尺寸"
        content="内容"
        side="top"
        align="start"
        size="lg"
        contentClassName="custom-panel"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "打开" }));
    const dialog = await screen.findByRole("dialog", { name: "大尺寸" });

    expect(dialog.className).toContain("custom-panel");
    expect(dialog.className).toContain("bg-lark-float");
    expect(dialog.className).toContain("rounded-lark-lg");
    expect(dialog.className).toContain("shadow-lark-4");
    expect(dialog.querySelector(".px-6")).not.toBeNull();
    expect(["top", "bottom"]).toContain(dialog.getAttribute("data-side"));
    expect(dialog.getAttribute("data-align")).toBe("start");
  });

  it("wraps long content inside the UD 420px maximum width", async () => {
    render(
      <Popover
        trigger={<button type="button">打开</button>}
        title="长文本"
        content={"b".repeat(120)}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "打开" }));
    const dialog = await screen.findByRole("dialog", { name: "长文本" });
    expect(getComputedStyle(dialog).overflowWrap).toBe("break-word");
    expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(420);
  });

  it("renders falsy body content such as zero", async () => {
    render(<Popover trigger={<button type="button">打开</button>} title="计数" content={0} />);

    await userEvent.click(screen.getByRole("button", { name: "打开" }));
    const dialog = await screen.findByRole("dialog", { name: "计数" });
    expect(dialog).toHaveTextContent("0");
  });

  it("is named by the trigger when there is no title", async () => {
    render(<Popover trigger={<button type="button">帮助</button>} content="快捷键是 ?" />);

    await userEvent.click(screen.getByRole("button", { name: "帮助" }));
    expect(await screen.findByRole("dialog", { name: "帮助" })).toBeInTheDocument();
  });

  it("does not open from a disabled trigger", async () => {
    render(
      <Popover
        trigger={<button type="button">打开</button>}
        title="标题"
        content="内容"
        disabled
      />,
    );

    const trigger = screen.getByRole("button", { name: "打开" });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("reports a controlled open change without opening", async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button type="button">打开</button>}
        title="受控"
        content="内容"
        open={false}
        onOpenChange={onOpenChange}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "打开" }));
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("composes from the exported parts", async () => {
    render(
      <PopoverRoot>
        <PopoverTrigger>快捷键</PopoverTrigger>
        <PopoverContent side="bottom">
          <PopoverTitle>键盘快捷键</PopoverTitle>
          <PopoverDescription>按 ? 查看全部快捷键。</PopoverDescription>
        </PopoverContent>
      </PopoverRoot>,
    );

    await userEvent.click(screen.getByRole("button", { name: "快捷键" }));
    const dialog = await screen.findByRole("dialog", { name: "键盘快捷键" });
    expect(dialog).toHaveTextContent("按 ? 查看全部快捷键。");
  });
});
