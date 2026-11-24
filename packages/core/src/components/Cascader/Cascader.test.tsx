import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { Cascader, type CascaderOption } from "./Cascader";

const regions: CascaderOption[] = [
  {
    value: "zhejiang",
    label: "浙江",
    children: [
      {
        value: "hangzhou",
        label: "杭州",
        children: [
          { value: "xihu", label: "西湖" },
          { value: "binjiang", label: "滨江", disabled: true },
        ],
      },
      {
        value: "ningbo",
        label: "宁波",
        children: [{ value: "yinzhou", label: "鄞州" }],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "江苏",
    children: [
      {
        value: "nanjing",
        label: "南京",
        children: [{ value: "xuanwu", label: "玄武" }],
      },
    ],
  },
];

describe("Cascader", () => {
  it("opens, expands columns and selects a leaf", async () => {
    const onChange = vi.fn();
    render(
      <Cascader label="所在地区" options={regions} placeholder="请选择地区" onChange={onChange} />,
    );

    const trigger = screen.getByRole("combobox", { name: "所在地区" });
    expect(trigger).toHaveTextContent("请选择地区");

    await userEvent.click(trigger);
    const firstColumn = await screen.findByRole("listbox", { name: "第 1 级选项" });
    expect(getComputedStyle(firstColumn).width).toBe("160px");
    const zhejiang = screen.getByRole("option", { name: "浙江" });
    expect(getComputedStyle(zhejiang).height).toBe("30px");
    // The first option is active as soon as the panel opens, as in Select.
    expect(zhejiang).toHaveAttribute("data-active", "");

    await userEvent.click(zhejiang);
    expect(await screen.findByRole("listbox", { name: "第 2 级选项" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("option", { name: "杭州" }));
    await userEvent.click(await screen.findByRole("option", { name: "西湖" }));

    expect(onChange).toHaveBeenLastCalledWith(["zhejiang", "hangzhou", "xihu"], expect.any(Array));
    expect(trigger).toHaveTextContent("浙江/杭州/西湖");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });

  it("marks only the selected value, not its ancestors, while the panel is open", async () => {
    render(
      <Cascader
        label="所在地区"
        options={regions}
        defaultValue={["zhejiang", "hangzhou", "xihu"]}
      />,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "所在地区" }));
    await screen.findByRole("listbox", { name: "第 3 级选项" });

    const zhejiang = screen.getByRole("option", { name: "浙江" });
    const hangzhou = screen.getByRole("option", { name: "杭州" });
    const xihu = screen.getByRole("option", { name: "西湖" });

    // UD colours only the chosen node; ancestors are active, not selected.
    expect(zhejiang).toHaveAttribute("aria-selected", "false");
    expect(hangzhou).toHaveAttribute("aria-selected", "false");
    expect(xihu).toHaveAttribute("aria-selected", "true");
    expect(xihu).toHaveClass("text-lark-primary");
    expect(zhejiang).not.toHaveClass("text-lark-primary");
    expect(hangzhou).not.toHaveClass("text-lark-primary");

    // Browsing another branch must not leave a stale blue ancestor behind.
    await userEvent.click(screen.getByRole("option", { name: "江苏" }));
    await screen.findByRole("option", { name: "南京" });

    expect(zhejiang).toHaveAttribute("aria-selected", "false");
    expect(zhejiang).not.toHaveClass("text-lark-primary");
    expect(screen.getByRole("option", { name: "江苏" })).toHaveAttribute("data-active", "");
    expect(screen.getByRole("option", { name: "江苏" })).toHaveAttribute("aria-selected", "false");
  });

  it("fills options on hover even when expandTrigger is click", async () => {
    render(<Cascader label="所在地区" options={regions} />);

    await userEvent.click(screen.getByRole("combobox", { name: "所在地区" }));
    const jiangsu = await screen.findByRole("option", { name: "江苏" });
    expect(getComputedStyle(jiangsu).backgroundColor).toBe("rgba(0, 0, 0, 0)");

    await page.getByRole("option", { name: "江苏" }).hover();
    // The row fades in over 100ms, so poll for the settled colour.
    await waitFor(() =>
      expect(getComputedStyle(jiangsu).backgroundColor).toBe("rgba(31, 35, 41, 0.08)"),
    );

    await page.getByRole("combobox", { name: "所在地区" }).hover();
    await waitFor(() => expect(getComputedStyle(jiangsu).backgroundColor).toBe("rgba(0, 0, 0, 0)"));
  });

  it("selects a parent with changeOnSelect and keeps the panel open", async () => {
    const onChange = vi.fn();
    render(<Cascader label="所在地区" options={regions} changeOnSelect onChange={onChange} />);

    const trigger = screen.getByRole("combobox", { name: "所在地区" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "浙江" }));

    expect(onChange).toHaveBeenLastCalledWith(["zhejiang"], expect.any(Array));
    expect(trigger).toHaveTextContent("浙江");
    expect(await screen.findByRole("listbox", { name: "第 2 级选项" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "浙江" })).toHaveAttribute("data-active", "");
  });

  it("supports keyboard navigation across columns", async () => {
    const onChange = vi.fn();
    render(<Cascader label="所在地区" options={regions} onChange={onChange} />);

    await userEvent.click(screen.getByRole("combobox", { name: "所在地区" }));
    const firstColumn = await screen.findByRole("listbox", { name: "第 1 级选项" });
    await waitFor(() => expect(firstColumn).toHaveFocus());

    await userEvent.keyboard("{ArrowRight}");
    const secondColumn = await screen.findByRole("listbox", { name: "第 2 级选项" });
    await waitFor(() => expect(secondColumn).toHaveFocus());

    await userEvent.keyboard("{ArrowRight}");
    const thirdColumn = await screen.findByRole("listbox", { name: "第 3 级选项" });
    await waitFor(() => expect(thirdColumn).toHaveFocus());

    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenLastCalledWith(["zhejiang", "hangzhou", "xihu"], expect.any(Array));
    expect(screen.getByRole("combobox", { name: "所在地区" })).toHaveTextContent("浙江/杭州/西湖");
  });

  it("filters full label paths with search", async () => {
    const onChange = vi.fn();
    render(<Cascader label="所在地区" options={regions} showSearch onChange={onChange} />);

    await userEvent.click(screen.getByRole("combobox", { name: "所在地区" }));
    const search = await screen.findByRole("searchbox", { name: "搜索选项" });
    await userEvent.type(search, "玄武");

    const result = await screen.findByRole("option", { name: "江苏/南京/玄武" });
    expect(screen.queryByRole("option", { name: "浙江" })).not.toBeInTheDocument();

    await userEvent.click(result);

    expect(onChange).toHaveBeenLastCalledWith(["jiangsu", "nanjing", "xuanwu"], expect.any(Array));
    expect(screen.getByRole("combobox", { name: "所在地区" })).toHaveTextContent("江苏/南京/玄武");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });

  it("shows an empty state when there are no options", async () => {
    render(<Cascader label="所在地区" options={[]} emptyText="暂无可选地区" />);

    await userEvent.click(screen.getByRole("combobox", { name: "所在地区" }));

    expect(await screen.findByText("暂无可选地区")).toBeInTheDocument();
  });

  it("opens from the trigger with ArrowDown and activates the first option", async () => {
    render(<Cascader label="所在地区" options={regions} />);

    const trigger = screen.getByRole("combobox", { name: "所在地区" });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");

    const firstColumn = await screen.findByRole("listbox", { name: "第 1 级选项" });
    await waitFor(() => expect(firstColumn).toHaveFocus());
    expect(screen.getByRole("option", { name: "浙江" })).toHaveAttribute("data-active", "");
  });

  it("shows an empty state when search matches nothing", async () => {
    render(<Cascader label="所在地区" options={regions} showSearch />);

    await userEvent.click(screen.getByRole("combobox", { name: "所在地区" }));
    await userEvent.type(
      await screen.findByRole("searchbox", { name: "搜索选项" }),
      "没有这个地区",
    );

    expect(await screen.findByText("暂无匹配选项")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "搜索选项" })).not.toHaveAttribute(
      "aria-controls",
    );
  });

  it("expands on hover when expandTrigger is hover", async () => {
    const onChange = vi.fn();
    render(
      <Cascader label="所在地区" options={regions} expandTrigger="hover" onChange={onChange} />,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "所在地区" }));
    await userEvent.hover(await screen.findByRole("option", { name: "浙江" }));
    await userEvent.click(await screen.findByRole("option", { name: "杭州" }));
    await userEvent.click(await screen.findByRole("option", { name: "西湖" }));

    expect(onChange).toHaveBeenLastCalledWith(["zhejiang", "hangzhou", "xihu"], expect.any(Array));
  });

  it("clears the selected path", async () => {
    const onChange = vi.fn();
    render(
      <Cascader
        label="所在地区"
        options={regions}
        defaultValue={["zhejiang", "hangzhou", "xihu"]}
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "所在地区" });
    expect(trigger).toHaveTextContent("浙江/杭州/西湖");

    await userEvent.click(screen.getByRole("button", { name: "清除" }));

    expect(trigger).toHaveTextContent("请选择");
    expect(trigger).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith(null, []);
  });

  it("does not open when disabled and ignores selection when readOnly", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Cascader label="所在地区" options={regions} disabled onChange={onChange} />,
    );

    const disabledTrigger = screen.getByRole("combobox", { name: "所在地区" });
    expect(disabledTrigger).toBeDisabled();
    await userEvent.click(disabledTrigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    rerender(
      <Cascader
        label="所在地区"
        options={regions}
        readOnly
        value={["jiangsu", "nanjing", "xuanwu"]}
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "所在地区" });
    expect(trigger).toHaveAttribute("aria-readonly", "true");
    expect(screen.queryByRole("button", { name: "清除" })).not.toBeInTheDocument();

    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", { name: "浙江" }));
    await userEvent.click(await screen.findByRole("option", { name: "宁波" }));

    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent("江苏/南京/玄武");
  });

  it("applies the documented trigger heights", () => {
    const { rerender } = render(<Cascader label="所在地区" options={regions} size="sm" />);
    let trigger = screen.getByRole("combobox", { name: "所在地区" });
    expect(trigger).toHaveClass("min-h-7");

    rerender(<Cascader label="所在地区" options={regions} size="md" />);
    trigger = screen.getByRole("combobox", { name: "所在地区" });
    expect(trigger).toHaveClass("min-h-8");

    rerender(<Cascader label="所在地区" options={regions} size="lg" />);
    trigger = screen.getByRole("combobox", { name: "所在地区" });
    expect(trigger).toHaveClass("min-h-10");
  });
});
