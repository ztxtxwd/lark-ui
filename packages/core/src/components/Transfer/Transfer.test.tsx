import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";
import { Transfer, type TransferItem } from "./Transfer";

const items: TransferItem[] = [
  { key: "design", title: "设计稿" },
  { key: "docs", title: "需求文档" },
  { key: "archive", title: "归档资料", disabled: true },
];

function panels() {
  return {
    source: screen.getByRole("region", { name: "全部选项" }),
    target: screen.getByRole("region", { name: "已选" }),
  };
}

describe("Transfer", () => {
  it("moves selected items to the target panel and reports the moved keys", async () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={items} onChange={onChange} />);

    const { source, target } = panels();
    expect(within(source).getByText("全部选项（0/3）")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "移到右侧" })).toBeDisabled();

    const design = within(source).getByRole("checkbox", { name: "设计稿" });
    await userEvent.click(design);

    expect(within(source).getByRole("checkbox", { name: "全选全部选项" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );

    await userEvent.click(screen.getByRole("button", { name: "移到右侧" }));

    expect(onChange).toHaveBeenLastCalledWith(["design"], "right", ["design"]);
    expect(within(target).getByRole("checkbox", { name: "设计稿" })).toBeInTheDocument();
    expect(within(source).queryByRole("checkbox", { name: "设计稿" })).not.toBeInTheDocument();
    expect(within(source).getByText("全部选项（0/2）")).toBeInTheDocument();
    expect(within(target).getByText("已选（1）")).toBeInTheDocument();
  });

  it("selects an option by pressing anywhere on its row", async () => {
    render(<Transfer dataSource={items} />);

    const { source } = panels();
    await userEvent.click(within(source).getByText("设计稿"));

    expect(within(source).getByRole("checkbox", { name: "设计稿" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("button", { name: "移到右侧" })).toBeEnabled();
  });

  it("selects and moves with the keyboard", async () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={items} onChange={onChange} />);

    const { source } = panels();
    const design = within(source).getByRole("checkbox", { name: "设计稿" });
    design.focus();
    await userEvent.keyboard(" ");
    expect(design).toHaveAttribute("aria-checked", "true");

    const move = screen.getByRole("button", { name: "移到右侧" });
    move.focus();
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenLastCalledWith(["design"], "right", ["design"]);
    expect(within(panels().target).getByRole("checkbox", { name: "设计稿" })).toBeInTheDocument();
  });

  it("filters with the search box and lets the header checkbox select every result", async () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={items} showSearch onChange={onChange} />);

    const { source } = panels();
    const search = within(source).getByRole("textbox", { name: "搜索" });
    await userEvent.type(search, "设计");

    expect(within(source).getByRole("checkbox", { name: "设计稿" })).toBeInTheDocument();
    expect(within(source).queryByRole("checkbox", { name: "需求文档" })).not.toBeInTheDocument();
    expect(within(source).getByText("全部选项（0/1）")).toBeInTheDocument();

    const selectAll = within(source).getByRole("checkbox", { name: "全选全部选项" });
    await userEvent.click(selectAll);
    expect(selectAll).toHaveAttribute("aria-checked", "true");

    await userEvent.click(screen.getByRole("button", { name: "移到右侧" }));

    expect(onChange).toHaveBeenLastCalledWith(["design"], "right", ["design"]);
    expect(screen.getByRole("region", { name: "已选" })).toHaveTextContent("已选（1）");
  });

  it("does not select or move disabled items", async () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={items} onChange={onChange} />);

    const { source } = panels();
    const archived = within(source).getByRole("checkbox", { name: "归档资料" });
    expect(archived).toBeDisabled();

    await userEvent.click(archived);
    expect(archived).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("button", { name: "移到右侧" })).toBeDisabled();

    await userEvent.click(within(source).getByRole("checkbox", { name: "需求文档" }));
    await userEvent.click(screen.getByRole("button", { name: "移到右侧" }));

    expect(onChange).toHaveBeenLastCalledWith(["docs"], "right", ["docs"]);
  });

  it("selects every target item from its header and moves them back", async () => {
    const onChange = vi.fn();
    render(
      <Transfer dataSource={items} defaultTargetKeys={["design", "docs"]} onChange={onChange} />,
    );

    const { target } = panels();
    const selectAll = within(target).getByRole("checkbox", { name: "全选已选" });
    await userEvent.click(selectAll);
    expect(selectAll).toHaveAttribute("aria-checked", "true");

    await userEvent.click(screen.getByRole("button", { name: "移到左侧" }));

    expect(onChange).toHaveBeenLastCalledWith([], "left", ["design", "docs"]);
    expect(within(target).getByText("已选（0）")).toBeInTheDocument();
    expect(within(panels().source).getByRole("checkbox", { name: "设计稿" })).toBeInTheDocument();
  });

  it("supports a controlled target list", () => {
    render(<Transfer dataSource={items} targetKeys={["docs"]} />);

    const { source, target } = panels();
    expect(within(target).getByRole("checkbox", { name: "需求文档" })).toBeInTheDocument();
    expect(within(source).queryByRole("checkbox", { name: "需求文档" })).not.toBeInTheDocument();
    expect(within(source).getByText("全部选项（0/2）")).toBeInTheDocument();
  });

  it("hides the reverse action in one-way mode", () => {
    render(<Transfer dataSource={items} defaultTargetKeys={["design"]} oneWay />);

    const { target } = panels();
    expect(screen.queryByRole("button", { name: "移到左侧" })).not.toBeInTheDocument();
    expect(within(target).queryByRole("checkbox", { name: "全选已选" })).not.toBeInTheDocument();
    expect(within(target).getByRole("checkbox", { name: "设计稿" })).toBeDisabled();
    expect(within(target).getByText("已选（1）")).toBeInTheDocument();
  });

  it("disables every control when disabled", async () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={items} disabled showSearch onChange={onChange} />);

    const { source } = panels();
    expect(within(source).getByRole("checkbox", { name: "设计稿" })).toBeDisabled();
    expect(within(source).getByRole("checkbox", { name: "全选全部选项" })).toBeDisabled();
    expect(within(source).getByRole("textbox", { name: "搜索" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "移到右侧" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "移到左侧" })).toBeDisabled();

    await userEvent.click(within(source).getByRole("checkbox", { name: "设计稿" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("uses custom panel titles", () => {
    render(<Transfer dataSource={items} titles={["候选成员", "已选成员"]} />);

    expect(screen.getByRole("region", { name: "候选成员" })).toHaveTextContent("候选成员（0/3）");
    expect(screen.getByRole("region", { name: "已选成员" })).toHaveTextContent("已选成员（0）");
  });

  it("keeps the empty state readable on the panel surface", async () => {
    const { container } = render(<Transfer dataSource={[]} />);

    const result = await axe.run(container, {
      runOnly: { type: "rule", values: ["color-contrast"] },
      resultTypes: ["violations"],
    });
    expect(result.violations).toEqual([]);
  });
});
