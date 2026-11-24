import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Steps } from "./Steps";

const flow = [
  { title: "填写信息", description: "输入项目名称" },
  { title: "选择成员", description: "邀请协作者" },
  { title: "完成创建", description: "确认并提交" },
];

describe("Steps", () => {
  it("renders a semantic ordered list and marks the current step", () => {
    render(<Steps items={flow} current={1} aria-label="创建项目" />);

    const list = screen.getByRole("list", { name: "创建项目" });
    expect(list.tagName).toBe("OL");

    const steps = within(list).getAllByRole("listitem");
    expect(steps).toHaveLength(3);
    expect(steps[0]).toHaveAttribute("data-status", "finish");
    expect(steps[1]).toHaveAttribute("data-status", "process");
    expect(steps[1]).toHaveAttribute("aria-current", "step");
    expect(steps[2]).toHaveAttribute("data-status", "wait");
    expect(steps[0]).not.toHaveAttribute("aria-current");
    expect(steps[2]).not.toHaveAttribute("aria-current");
  });

  it("derives statuses from current and honours per-item overrides", () => {
    render(
      <Steps
        aria-label="发布流程"
        current={2}
        items={[{ title: "编辑" }, { title: "检查", status: "error" }, { title: "发布" }]}
      />,
    );

    const steps = screen.getAllByRole("listitem");
    expect(steps[0]).toHaveAttribute("data-status", "finish");
    expect(steps[1]).toHaveAttribute("data-status", "error");
    expect(steps[2]).toHaveAttribute("data-status", "process");
    expect(steps[2]).toHaveAttribute("aria-current", "step");
  });

  it("calls onChange with the pressed index and ignores disabled steps", async () => {
    const onChange = vi.fn();
    render(
      <Steps
        aria-label="可点击步骤"
        items={[{ title: "一" }, { title: "二", disabled: true }, { title: "三" }]}
        current={0}
        onChange={onChange}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);

    await userEvent.click(buttons[2]);
    expect(onChange).toHaveBeenCalledWith(2);

    await userEvent.click(buttons[1]);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(buttons[1]).toBeDisabled();
    expect(buttons[1]).toHaveAttribute("aria-disabled", "true");
  });

  it("shows the pointer affordance only on non-current clickable steps", () => {
    render(
      <Steps
        aria-label="可点击步骤"
        items={[{ title: "一" }, { title: "二" }, { title: "三" }]}
        current={1}
        onChange={() => {}}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0].className).toContain("cursor-pointer");
    expect(buttons[1].className).not.toContain("cursor-pointer");
    expect(buttons[2].className).toContain("cursor-pointer");
  });

  it("runs a clickable step from the keyboard", async () => {
    const onChange = vi.fn();
    render(
      <Steps
        aria-label="键盘步骤"
        items={[{ title: "开始" }, { title: "结束" }]}
        current={0}
        onChange={onChange}
      />,
    );

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("renders non-interactive steps when onChange is absent", () => {
    render(<Steps items={flow} current={0} />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("shows number, check, error and loading glyphs", () => {
    const { container } = render(
      <Steps
        aria-label="状态步骤"
        current={2}
        status="process"
        items={[
          { title: "完成" },
          { title: "失败", status: "error" },
          { title: "进行中", loading: true },
        ]}
      />,
    );

    const icons = container.querySelectorAll('[data-slot="steps-icon"]');
    expect(icons[0].querySelector("svg")).not.toBeNull();
    expect(icons[1].querySelector("svg")).not.toBeNull();
    expect(icons[1].className).toContain("bg-lark-danger");
    expect(icons[2].querySelector(".lark-spinner")).not.toBeNull();
    expect(icons[2].className).toContain("bg-lark-primary");
  });

  it("colours finished and error connectors", () => {
    const { rerender } = render(
      <Steps items={[{ title: "一" }, { title: "二" }, { title: "三" }]} current={2} />,
    );

    let connectors = screen
      .getAllByRole("listitem")[0]
      .querySelectorAll('[data-slot="steps-connector"]');
    expect(connectors).toHaveLength(1);
    expect(connectors[0].className).toContain("bg-lark-primary-content");

    rerender(
      <Steps
        items={[{ title: "一" }, { title: "二", status: "error" }, { title: "三" }]}
        current={1}
      />,
    );

    const errorStep = screen.getAllByRole("listitem")[1];
    const errorNode = errorStep.querySelector('[data-slot="steps-icon"]');
    connectors = screen
      .getAllByRole("listitem")[0]
      .querySelectorAll('[data-slot="steps-connector"]');
    expect(connectors[0].className).toContain("bg-lark-danger-strong");
    // The line leading into the failed step is the same red as its node.
    expect(errorNode?.className).toContain("bg-lark-danger-strong");
  });

  it("supports vertical, centered-label and size variants", () => {
    const { container, rerender } = render(
      <Steps items={flow} current={1} direction="vertical" size="sm" />,
    );

    expect(container.querySelector('[data-slot="steps"]')?.className).toContain("grid");
    expect(container.querySelector('[data-slot="steps"]')?.className).toContain("auto-rows-fr");
    expect(container.querySelector('[data-slot="steps-icon"]')?.className).toContain("size-6");
    expect(container.querySelector('[data-slot="steps-icon"]')?.className).toContain(
      "text-lark-12",
    );

    rerender(<Steps items={flow} current={1} labelPlacement="vertical" size="md" />);

    const step = container.querySelector('[data-slot="steps-item"]');
    expect(step?.firstElementChild?.className).toContain("flex-col");
    expect(step?.firstElementChild?.className).toContain("items-center");
    expect(container.querySelector('[data-slot="steps-icon"]')?.className).toContain("size-7");
  });

  it("clamps long titles and descriptions to two lines", () => {
    render(
      <Steps
        items={[
          {
            title: "很长的步骤标题".repeat(20),
            description: "很长的辅助说明".repeat(20),
          },
          { title: "结束" },
        ]}
        current={0}
      />,
    );

    const first = screen.getAllByRole("listitem")[0];
    const title = first.querySelector(".line-clamp-2") as HTMLElement;
    const description = first.querySelectorAll(".line-clamp-2")[1] as HTMLElement;

    expect(getComputedStyle(title).webkitLineClamp).toBe("2");
    expect(title.getBoundingClientRect().height).toBeLessThanOrEqual(44);
    expect(title.scrollHeight).toBeGreaterThan(title.clientHeight);
    expect(description.getBoundingClientRect().height).toBeLessThanOrEqual(40);
  });

  it("puts the horizontal label on the node line with UD's 8px gaps", () => {
    const { container } = render(
      <Steps items={[{ title: "填写", description: "辅助说明" }, { title: "完成" }]} current={0} />,
    );

    const icon = container.querySelector('[data-slot="steps-icon"]') as HTMLElement;
    const title = screen.getByText("填写");
    const connector = container.querySelector('[data-slot="steps-connector"]') as HTMLElement;
    const iconBox = icon.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    const connectorBox = connector.getBoundingClientRect();

    // UD `.ud__steps__item-icon { margin-right: 8px }`.
    expect(titleBox.left - iconBox.right).toBeCloseTo(8, 0);
    // Node, title line and connector share one centre line, even with a description.
    expect(
      Math.abs(iconBox.top + iconBox.height / 2 - (titleBox.top + titleBox.height / 2)),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(connectorBox.top + connectorBox.height / 2 - (titleBox.top + titleBox.height / 2)),
    ).toBeLessThanOrEqual(1);
    // UD starts the line after the title's 8px padding, not after the description.
    expect(connectorBox.left).toBeCloseTo(titleBox.right, 0);
    expect(getComputedStyle(title).paddingRight).toBe("8px");
  });

  it("keeps UD's vertical rhythm and leaves 8px around the connector", () => {
    const { container } = render(
      <Steps
        direction="vertical"
        current={0}
        items={[
          { title: "一", description: "说明" },
          { title: "二", description: "说明" },
        ]}
      />,
    );

    const items = [...container.querySelectorAll('[data-slot="steps-item"]')];
    const icons = [...container.querySelectorAll('[data-slot="steps-icon"]')];
    const connector = container.querySelector('[data-slot="steps-connector"]') as HTMLElement;
    const itemBox = items[0].getBoundingClientRect();
    const iconBox = icons[0].getBoundingClientRect();
    const nextIconBox = icons[1].getBoundingClientRect();
    const connectorBox = connector.getBoundingClientRect();

    // UD `.ud__steps--vertical .ud__steps__item { padding-top: 8px }`.
    expect(iconBox.top - itemBox.top).toBeCloseTo(8, 0);
    // The line runs from 8px under the node to 8px above the next node.
    expect(connectorBox.top - iconBox.bottom).toBeCloseTo(8, 0);
    expect(nextIconBox.top - connectorBox.bottom).toBeCloseTo(8, 0);
    // …centred on the node.
    expect(connectorBox.left + connectorBox.width / 2).toBeCloseTo(
      iconBox.left + iconBox.width / 2,
      0,
    );
  });

  it("draws pending connectors at UD's N900 30%", () => {
    const { container } = render(<Steps items={[{ title: "一" }, { title: "二" }]} current={0} />);

    const connector = container.querySelector('[data-slot="steps-connector"]') as HTMLElement;
    expect(connector.className).toContain("bg-lark-neutral-900/30");
    expect(getComputedStyle(connector).backgroundColor).toContain("/ 0.3)");
  });

  it("keeps centered steps equally wide so connectors stop before the next node", () => {
    const { container } = render(
      <div style={{ width: 720 }}>
        <Steps
          labelPlacement="vertical"
          current={1}
          items={[
            { title: "第一步很长的标题文字" },
            { title: "第二步也很长" },
            { title: "第三步" },
            { title: "四" },
          ]}
        />
      </div>,
    );

    const items = [...container.querySelectorAll('[data-slot="steps-item"]')];
    const icons = [...container.querySelectorAll('[data-slot="steps-icon"]')];
    const connectors = [...container.querySelectorAll('[data-slot="steps-connector"]')];
    const widths = items.map((item) => item.getBoundingClientRect().width);

    for (const width of widths) {
      expect(Math.abs(width - widths[0])).toBeLessThan(1);
    }
    connectors.forEach((connector, index) => {
      const nextIcon = icons[index + 1].getBoundingClientRect();
      expect(connector.getBoundingClientRect().right).toBeLessThanOrEqual(nextIcon.left + 1);
    });
  });

  it("gives vertical steps equal heights", () => {
    render(
      <Steps
        direction="vertical"
        items={[
          { title: "一", description: "短" },
          { title: "二", description: "很长的说明文本".repeat(6) },
          { title: "三" },
        ]}
        current={0}
      />,
    );

    const heights = screen
      .getAllByRole("listitem")
      .map((item) => item.getBoundingClientRect().height);
    expect(new Set(heights).size).toBe(1);
  });

  it("uses UD node metrics and switches tokens in dark mode", async () => {
    const { container } = render(
      <Steps items={[{ title: "一" }, { title: "二" }]} current={0} size="sm" />,
    );
    const icon = container.querySelector('[data-slot="steps-icon"]') as HTMLElement;
    const iconStyle = getComputedStyle(icon);
    expect(iconStyle.width).toBe("24px");
    expect(iconStyle.height).toBe("24px");
    expect(iconStyle.backgroundColor).toBe("rgb(20, 86, 240)");
    expect(iconStyle.color).toBe("rgb(255, 255, 255)");
    expect(iconStyle.borderRadius).toBe("9999px");

    document.documentElement.classList.add("dark");
    try {
      await vi.waitFor(() => {
        expect(getComputedStyle(icon).backgroundColor).toBe("rgb(51, 112, 235)");
      });
      const waitTitle = screen.getByText("二");
      await vi.waitFor(() => {
        expect(getComputedStyle(waitTitle).color).toBe("rgb(166, 166, 166)");
      });
    } finally {
      document.documentElement.classList.remove("dark");
    }
  });

  it("accepts a custom node icon and a description", () => {
    render(
      <Steps
        items={[
          {
            title: "自定义",
            description: "辅助说明",
            icon: <span data-testid="custom-icon">★</span>,
          },
        ]}
      />,
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.getByText("辅助说明")).toBeInTheDocument();
  });
});
