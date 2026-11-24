import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TreeSelect, type TreeSelectNode } from "./TreeSelect";

const departments: TreeSelectNode[] = [
  {
    value: "rd",
    title: "产品研发中心",
    children: [
      {
        value: "design",
        title: "设计部",
        children: [
          { value: "ui", title: "UI 设计组" },
          { value: "ux", title: "UX 设计组" },
        ],
      },
      {
        value: "frontend",
        title: "前端开发部",
        children: [
          { value: "web", title: "Web 组" },
          { value: "app", title: "App 组" },
        ],
      },
    ],
  },
  {
    value: "sales",
    title: "销售中心",
    children: [{ value: "east", title: "华东销售部" }],
  },
  { value: "admin", title: "行政部", disabled: true },
];

describe("TreeSelect", () => {
  it("opens the tree, selects a leaf and stays open", async () => {
    const onChange = vi.fn();
    render(
      <TreeSelect label="部门" treeData={departments} treeDefaultExpandAll onChange={onChange} />,
    );

    const trigger = screen.getByRole("combobox", { name: "部门" });
    expect(trigger).toHaveTextContent("请选择");

    await userEvent.click(trigger);
    expect(await screen.findByRole("tree", { name: "部门" })).toBeInTheDocument();

    const leaf = screen.getByRole("treeitem", { name: "UI 设计组" });
    // Third level: 8px base padding + 2 × 16px indent, as in the UD tree CSS.
    const row = leaf.querySelector('[data-slot="tree-label"]');
    expect(row).not.toBeNull();
    expect(getComputedStyle(row as Element).paddingLeft).toBe("40px");
    expect(getComputedStyle(leaf).height).toBe("30px");

    await userEvent.click(leaf);

    expect(onChange).toHaveBeenLastCalledWith("ui", [
      expect.objectContaining({ value: "ui", title: "UI 设计组" }),
    ]);
    expect(trigger).toHaveTextContent("UI 设计组");
    expect(screen.getByRole("tree", { name: "部门" })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("tree", { name: "部门" })).not.toBeInTheDocument(),
    );
  });

  it("selects a parent and expands its children", async () => {
    const onChange = vi.fn();
    render(<TreeSelect label="部门" treeData={departments} onChange={onChange} />);

    const trigger = screen.getByRole("combobox", { name: "部门" });
    await userEvent.click(trigger);

    const parent = await screen.findByRole("treeitem", { name: "产品研发中心" });
    expect(parent).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(parent);

    expect(onChange).toHaveBeenLastCalledWith("rd", [expect.objectContaining({ value: "rd" })]);
    expect(parent).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveTextContent("产品研发中心");
    expect(await screen.findByRole("treeitem", { name: "设计部" })).toBeInTheDocument();
  });

  it("supports keyboard expand and select", async () => {
    const onChange = vi.fn();
    render(<TreeSelect label="部门" treeData={departments} onChange={onChange} />);

    await userEvent.click(screen.getByRole("combobox", { name: "部门" }));
    const parent = await screen.findByRole("treeitem", { name: "产品研发中心" });
    parent.focus();

    await userEvent.keyboard("{ArrowRight}");
    expect(parent).toHaveAttribute("aria-expanded", "true");
    await waitFor(() =>
      expect(screen.getByRole("treeitem", { name: "设计部" })).toBeInTheDocument(),
    );

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenLastCalledWith("design", [
      expect.objectContaining({ value: "design" }),
    ]);
    expect(screen.getByRole("combobox", { name: "部门" })).toHaveTextContent("设计部");
  });

  it("opens from the trigger with ArrowDown and focuses the first row", async () => {
    render(<TreeSelect label="部门" treeData={departments} />);

    const trigger = screen.getByRole("combobox", { name: "部门" });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");

    expect(await screen.findByRole("tree", { name: "部门" })).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("treeitem", { name: "产品研发中心" })).toHaveFocus(),
    );
  });

  it("filters the tree and auto-expands ancestors when searching", async () => {
    const onChange = vi.fn();
    render(<TreeSelect label="部门" treeData={departments} showSearch onChange={onChange} />);

    await userEvent.click(screen.getByRole("combobox", { name: "部门" }));
    const search = await screen.findByRole("searchbox", { name: "搜索选项" });
    await userEvent.type(search, "UI");

    await waitFor(() => {
      expect(screen.getByRole("treeitem", { name: "UI 设计组" })).toBeVisible();
      expect(screen.getByRole("treeitem", { name: "产品研发中心" })).toBeInTheDocument();
      expect(screen.getByRole("treeitem", { name: "设计部" })).toBeInTheDocument();
      expect(screen.queryByRole("treeitem", { name: "前端开发部" })).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("treeitem", { name: "UI 设计组" }));

    expect(onChange).toHaveBeenLastCalledWith("ui", [expect.objectContaining({ value: "ui" })]);
    expect(screen.getByRole("combobox", { name: "部门" })).toHaveTextContent("UI 设计组");
  });

  it("checks a whole branch and reports a mixed parent", async () => {
    const onChange = vi.fn();
    render(
      <TreeSelect
        label="部门"
        treeData={departments}
        treeCheckable
        treeDefaultExpandAll
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "部门" });
    await userEvent.click(trigger);

    const parent = await screen.findByRole("treeitem", { name: "产品研发中心" });
    parent.focus();
    await userEvent.keyboard(" ");

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(["rd"], expect.any(Array)));
    expect(parent).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("treeitem", { name: "UI 设计组" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(trigger).toHaveTextContent("产品研发中心");

    const ui = screen.getByRole("treeitem", { name: "UI 设计组" });
    ui.focus();
    await userEvent.keyboard(" ");

    await waitFor(() => expect(parent).toHaveAttribute("aria-checked", "mixed"));
    const checked = onChange.mock.calls.at(-1)?.[0] as string[];
    expect(checked).not.toContain("ui");
    expect(checked).toEqual(expect.arrayContaining(["ux", "frontend"]));
    expect(trigger).not.toHaveTextContent("产品研发中心");
    expect(trigger).toHaveTextContent("UX 设计组");
  });

  it("toggles several rows in multiple mode", async () => {
    const onChange = vi.fn();
    render(
      <TreeSelect
        label="部门"
        treeData={departments}
        multiple
        treeDefaultExpandAll
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "部门" });
    await userEvent.click(trigger);

    await userEvent.click(await screen.findByRole("treeitem", { name: "UI 设计组" }));
    await userEvent.click(screen.getByRole("treeitem", { name: "Web 组" }));

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith(
        ["ui", "web"],
        expect.arrayContaining([
          expect.objectContaining({ value: "ui" }),
          expect.objectContaining({ value: "web" }),
        ]),
      ),
    );
    expect(trigger).toHaveTextContent("UI 设计组");
    expect(trigger).toHaveTextContent("Web 组");
  });

  it("clears the selection", async () => {
    const onChange = vi.fn();
    render(
      <TreeSelect label="部门" treeData={departments} defaultValue="ui" onChange={onChange} />,
    );

    const trigger = screen.getByRole("combobox", { name: "部门" });
    expect(trigger).toHaveTextContent("UI 设计组");

    await userEvent.click(screen.getByRole("button", { name: "清除" }));

    expect(trigger).toHaveTextContent("请选择");
    expect(trigger).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith(null, []);
  });

  it("does not open when disabled and ignores selection when readOnly", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <TreeSelect label="部门" treeData={departments} disabled onChange={onChange} />,
    );

    const disabledTrigger = screen.getByRole("combobox", { name: "部门" });
    // The combobox is a div, so being disabled means the ARIA state and a
    // missing tab stop rather than the native attribute.
    expect(disabledTrigger).toHaveAttribute("aria-disabled", "true");
    expect(disabledTrigger).toHaveAttribute("tabindex", "-1");
    await userEvent.click(disabledTrigger);
    expect(screen.queryByRole("tree")).not.toBeInTheDocument();

    rerender(
      <TreeSelect
        label="部门"
        treeData={departments}
        treeDefaultExpandAll
        readOnly
        value="ui"
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "部门" });
    expect(trigger).toHaveAttribute("aria-readonly", "true");
    expect(screen.queryByRole("button", { name: "清除" })).not.toBeInTheDocument();

    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("treeitem", { name: "Web 组" }));

    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent("UI 设计组");
  });

  it("searches from inside the trigger and keeps the panel open", async () => {
    render(<TreeSelect label="部门" treeData={departments} showSearch />);

    const trigger = screen.getByRole("combobox", { name: "部门" });
    await userEvent.click(trigger);

    const search = screen.getByRole("searchbox", { name: "搜索选项" });
    await userEvent.type(search, "设计");

    // Typing in the trigger's search must not toggle the panel closed.
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => {
      expect(screen.getByRole("treeitem", { name: "UI 设计组" })).toBeVisible();
      expect(screen.queryByRole("treeitem", { name: "销售中心" })).not.toBeInTheDocument();
    });
  });

  it("highlights the matched text without changing the row name", async () => {
    render(<TreeSelect label="部门" treeData={departments} showSearch />);

    await userEvent.click(screen.getByRole("combobox", { name: "部门" }));
    await userEvent.type(await screen.findByRole("searchbox", { name: "搜索选项" }), "UI");

    const row = await screen.findByRole("treeitem", { name: "UI 设计组" });
    const mark = row.querySelector("mark");
    expect(mark).toHaveTextContent("UI");
    expect(mark).toHaveClass("text-lark-primary");
  });

  it("closes after a single choice and shows the value dimmed while open", async () => {
    render(<TreeSelect label="部门" treeData={departments} showSearch defaultValue="ui" />);

    const trigger = screen.getByRole("combobox", { name: "部门" });
    await userEvent.click(trigger);
    expect(trigger).toHaveTextContent("UI 设计组");
    // UD dims the standing value to 50% while the panel is open.
    expect(within(trigger).getByText("UI 设计组")).toHaveClass("opacity-50");

    await userEvent.click(await screen.findByRole("treeitem", { name: "UX 设计组" }));

    await waitFor(() => expect(screen.queryByRole("tree")).not.toBeInTheDocument());
    expect(trigger).toHaveTextContent("UX 设计组");
  });

  it("renders chips with per-chip remove buttons in multiple mode", async () => {
    const onChange = vi.fn();
    render(
      <TreeSelect
        label="部门"
        treeData={departments}
        multiple
        treeDefaultExpandAll
        defaultValue={["ui", "web"]}
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "部门" });
    expect(trigger).toHaveTextContent("UI 设计组");
    expect(trigger).toHaveTextContent("Web 组");

    const removeUi = screen.getByRole("button", { name: "移除 UI 设计组" });
    await userEvent.click(removeUi);

    expect(onChange).toHaveBeenLastCalledWith(["web"], [expect.objectContaining({ value: "web" })]);
    expect(screen.queryByRole("button", { name: "移除 UI 设计组" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "移除 Web 组" })).toBeInTheDocument();
  });

  it("shows an overflow count past maxDisplayLabels and removes the last chip with Backspace", async () => {
    const onChange = vi.fn();
    render(
      <TreeSelect
        label="部门"
        treeData={departments}
        multiple
        treeDefaultExpandAll
        defaultValue={["ui", "web", "ux"]}
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "部门" });
    expect(trigger).toHaveTextContent("+1");

    trigger.focus();
    await userEvent.keyboard("{Backspace}");

    expect(onChange).toHaveBeenLastCalledWith(
      ["ui", "web"],
      expect.arrayContaining([expect.objectContaining({ value: "ui" })]),
    );
    expect(trigger).not.toHaveTextContent("+1");
  });

  it("clears from the hover-revealed clear button", async () => {
    const onChange = vi.fn();
    render(
      <TreeSelect
        label="部门"
        treeData={departments}
        multiple
        treeDefaultExpandAll
        defaultValue={["ui"]}
        onChange={onChange}
      />,
    );

    const clear = screen.getByRole("button", { name: "清除" });
    // Hover-only affordance: hidden until the trigger is hovered or focused.
    expect(clear).toHaveClass("opacity-0");
    await userEvent.click(clear);

    expect(onChange).toHaveBeenLastCalledWith([], []);
    expect(screen.getByRole("combobox", { name: "部门" })).toHaveTextContent("请选择");
  });

  it("applies the documented trigger heights", () => {
    const { rerender } = render(<TreeSelect label="部门" treeData={departments} size="sm" />);
    let trigger = screen.getByRole("combobox", { name: "部门" });
    expect(trigger).toHaveClass("min-h-7");

    rerender(<TreeSelect label="部门" treeData={departments} size="md" />);
    trigger = screen.getByRole("combobox", { name: "部门" });
    expect(trigger).toHaveClass("min-h-8");

    rerender(<TreeSelect label="部门" treeData={departments} size="lg" />);
    trigger = screen.getByRole("combobox", { name: "部门" });
    expect(trigger).toHaveClass("min-h-10");
  });
});
