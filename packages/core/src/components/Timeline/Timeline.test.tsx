import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Timeline, TimelineItem } from "./Timeline";

describe("Timeline", () => {
  it("renders a named list in source order", () => {
    const { container } = render(
      <Timeline aria-label="审批记录">
        <TimelineItem title="提交申请" time="09:00" description="发起流程" />
        <TimelineItem title="审批通过" time="10:00" />
        <TimelineItem title="完成" time="11:00" />
      </Timeline>,
    );

    const list = screen.getByRole("list", { name: "审批记录" });
    expect(list).toBeInTheDocument();
    // `.ud__timeline { margin: 0; padding: 8px 0 0 }`
    expect(getComputedStyle(list).paddingTop).toBe("8px");
    expect(getComputedStyle(list).paddingRight).toBe("0px");
    expect(getComputedStyle(list).paddingBottom).toBe("0px");
    expect(getComputedStyle(list).paddingLeft).toBe("0px");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(
      items.map((item) => item.querySelector('[data-slot="timeline-title"]')?.textContent),
    ).toEqual(["提交申请", "审批通过", "完成"]);
    expect(within(items[0]).getByText("发起流程")).toBeInTheDocument();

    // `.ud__timeline-item { font-size: 14px; line-height: 1.4286 }`
    const itemStyle = getComputedStyle(items[0]);
    expect(itemStyle.fontSize).toBe("14px");
    expect(parseFloat(itemStyle.lineHeight)).toBeCloseTo(20, 0);

    const connectors = container.querySelectorAll('[data-slot="timeline-connector"]');
    expect(getComputedStyle(connectors[0]).display).not.toBe("none");
    expect(getComputedStyle(connectors[2]).display).toBe("none");
  });

  it("marks the current item as the current step", () => {
    render(
      <Timeline aria-label="订单进度">
        <TimelineItem title="已提交" status="complete" />
        <TimelineItem title="处理中" active />
        <TimelineItem title="待处理" status="upcoming" />
      </Timeline>,
    );

    const items = screen.getAllByRole("listitem");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[0]).toHaveAttribute("data-complete");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[1]).toHaveAttribute("data-current");
    expect(items[2]).toHaveAttribute("data-upcoming");
  });

  it("draws status dots and accepts a custom dot", () => {
    const { container } = render(
      <Timeline aria-label="节点">
        <TimelineItem title="成功" status="success" />
        <TimelineItem title="失败" status="danger" />
        <TimelineItem title="自定义" dot={<span data-testid="custom-dot">★</span>} />
      </Timeline>,
    );

    const dots = container.querySelectorAll('[data-slot="timeline-dot"]');
    expect(dots).toHaveLength(3);
    expect(getComputedStyle(dots[0]).backgroundColor).toBe("rgb(50, 166, 69)");
    expect(getComputedStyle(dots[1]).backgroundColor).toBe("rgb(245, 74, 69)");
    expect(dots[2]).toContainElement(screen.getByTestId("custom-dot"));
  });

  it("shows a loading node for pending items", () => {
    const { container } = render(
      <Timeline aria-label="加载">
        <TimelineItem title="加载中" pending />
      </Timeline>,
    );

    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("data-pending");
    expect(item).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector(".lark-spinner")).not.toBeNull();
    expect(screen.getByText("加载中")).toHaveClass("text-lark-caption");
  });

  it("renders the node time as a machine-readable time element", async () => {
    const { container } = render(
      <Timeline aria-label="发布时间">
        <TimelineItem title="发布" time="2026-11-10" dateTime="2026-11-10T14:32" />
      </Timeline>,
    );

    const time = container.querySelector("time");
    expect(time).not.toBeNull();
    expect(time).toHaveAttribute("datetime", "2026-11-10T14:32");
    expect(time).toHaveTextContent("2026-11-10");

    const item = screen.getByRole("listitem");
    await vi.waitFor(() => {
      expect(item.getAttribute("aria-describedby")).toContain(time?.id);
    });
  });

  it("moves between items with the keyboard", async () => {
    render(
      <Timeline aria-label="键盘时间轴">
        <TimelineItem title="第一步" />
        <TimelineItem title="第二步" />
      </Timeline>,
    );

    const items = screen.getAllByRole("listitem");
    await userEvent.tab();
    expect(items[0]).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    expect(items[1]).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(items[0]).toHaveFocus();

    await userEvent.keyboard("{End}");
    expect(items[1]).toHaveFocus();
  });

  it("alternates sides in the two-sided layout", () => {
    const { container } = render(
      <Timeline aria-label="双侧时间轴" mode="alternate">
        <TimelineItem title="第一步" time="09:00" />
        <TimelineItem title="第二步" time="10:00" />
      </Timeline>,
    );

    expect(container.querySelector("ol")).toHaveAttribute("data-mode", "alternate");

    const contents = container.querySelectorAll('[data-slot="timeline-content"]');
    const labels = container.querySelectorAll('[data-slot="timeline-label"]');

    expect(getComputedStyle(contents[0]).gridColumnStart).toBe("2");
    expect(getComputedStyle(contents[1]).gridColumnStart).toBe("1");
    expect(getComputedStyle(labels[0]).gridColumnStart).toBe("1");
    expect(getComputedStyle(labels[1]).gridColumnStart).toBe("2");
  });

  it("uses the UD 18px / 11px gutters in the two-sided layout", () => {
    const { container } = render(
      <Timeline aria-label="双侧间距" mode="alternate">
        <TimelineItem title="第一步" time="09:00" />
        <TimelineItem title="第二步" time="10:00" />
      </Timeline>,
    );

    const contents = container.querySelectorAll('[data-slot="timeline-content"]');
    const labels = container.querySelectorAll('[data-slot="timeline-label"]');

    // Right-side content keeps the 18px gutter; left-side content and the
    // mirrored time label use the client's 11px gutter.
    expect(getComputedStyle(contents[0]).paddingLeft).toBe("18px");
    expect(getComputedStyle(labels[0]).paddingRight).toBe("18px");
    expect(getComputedStyle(contents[1]).paddingRight).toBe("11px");
    expect(getComputedStyle(labels[1]).paddingLeft).toBe("11px");
  });

  it("keeps alternating across fragments", () => {
    const { container } = render(
      <Timeline aria-label="分片时间轴" mode="alternate">
        {/* biome-ignore lint/complexity/noUselessFragments: exercises fragment-aware indexing */}
        <>
          <TimelineItem title="第一步" time="09:00" />
          <TimelineItem title="第二步" time="10:00" />
        </>
        <TimelineItem title="第三步" time="11:00" />
      </Timeline>,
    );

    const contents = container.querySelectorAll('[data-slot="timeline-content"]');
    expect(Array.from(contents, (content) => getComputedStyle(content).gridColumnStart)).toEqual([
      "2",
      "1",
      "2",
    ]);
  });

  it("takes description from children", () => {
    render(
      <Timeline aria-label="说明">
        <TimelineItem title="节点">来自 children 的辅助信息</TimelineItem>
      </Timeline>,
    );

    expect(screen.getByText("来自 children 的辅助信息")).toBeInTheDocument();
  });
});
