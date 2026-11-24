import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  type TableColumn,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

type Person = {
  id: number;
  name: string;
  team: string;
  joined: string;
  score: number;
};

const people: Person[] = [
  { id: 1, name: "张三", team: "设计", joined: "2023-01-02", score: 96 },
  { id: 2, name: "李四", team: "研发", joined: "2023-03-14", score: 88 },
  { id: 3, name: "王五", team: "研发", joined: "2022-11-08", score: 91 },
];

const columns: TableColumn<Person>[] = [
  { key: "name", title: "姓名", dataIndex: "name" },
  { key: "team", title: "团队", dataIndex: "team" },
  { key: "joined", title: "加入时间", dataIndex: "joined" },
];

const sortableNameColumns: TableColumn<Person>[] = [{ ...columns[0], sortable: true }];

function OwnerSortState() {
  const [order, setOrder] = useState<"asc" | "desc" | null>(null);
  return (
    <>
      <span data-testid="order">{order ?? "none"}</span>
      <Table
        caption="外部状态"
        columns={sortableNameColumns}
        dataSource={people}
        rowKey="id"
        onSortChange={(next) => setOrder(next ? (next.order === "ascend" ? "asc" : "desc") : null)}
      />
    </>
  );
}

describe("Table", () => {
  it("renders native table semantics, a caption and column headers", () => {
    render(<Table caption="团队成员" columns={columns} dataSource={people} rowKey="id" />);

    const table = screen.getByRole("table", { name: "团队成员" });
    expect(table.tagName).toBe("TABLE");
    expect(screen.getByText("团队成员").tagName).toBe("CAPTION");

    const nameHeader = screen.getByRole("columnheader", { name: "姓名" });
    expect(nameHeader).toHaveAttribute("scope", "col");
    expect(nameHeader).toHaveAttribute("data-slot", "table-head");
    expect(screen.getByRole("cell", { name: "张三" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(people.length + 1);
  });

  it("takes its accessible name from aria-label when the caption is hidden", () => {
    render(
      <Table
        aria-label="全体成员"
        caption="仅供屏幕阅读器"
        captionHidden
        columns={columns}
        dataSource={people}
        rowKey="id"
      />,
    );

    expect(screen.getByRole("table", { name: "全体成员" })).toBeInTheDocument();
    expect(screen.getByText("仅供屏幕阅读器")).toHaveClass("sr-only");
  });

  it("cycles a sortable column through ascend, descend and default", async () => {
    const onSortChange = vi.fn();
    const sortableColumns: TableColumn<Person>[] = [
      { ...columns[0], sortable: true },
      { ...columns[1], sortable: true },
      columns[2],
    ];

    render(
      <Table
        aria-label="可排序成员"
        columns={sortableColumns}
        dataSource={people}
        rowKey="id"
        onSortChange={onSortChange}
      />,
    );

    const nameHeader = screen.getByRole("columnheader", { name: /姓名/ });
    const joinedHeader = screen.getByRole("columnheader", { name: "加入时间" });
    expect(nameHeader).not.toHaveAttribute("aria-sort");
    expect(within(joinedHeader).queryByRole("button")).toBeNull();

    await userEvent.click(within(nameHeader).getByRole("button", { name: "按姓名升序排序" }));
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    expect(onSortChange).toHaveBeenLastCalledWith({ columnKey: "name", order: "ascend" });

    await userEvent.click(within(nameHeader).getByRole("button", { name: "按姓名降序排序" }));
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    expect(onSortChange).toHaveBeenLastCalledWith({ columnKey: "name", order: "descend" });

    await userEvent.click(within(nameHeader).getByRole("button", { name: "恢复姓名默认排序" }));
    expect(nameHeader).not.toHaveAttribute("aria-sort");
    expect(onSortChange).toHaveBeenLastCalledWith(null);

    await userEvent.click(
      within(screen.getByRole("columnheader", { name: /团队/ })).getByRole("button", {
        name: "按团队升序排序",
      }),
    );
    expect(nameHeader).not.toHaveAttribute("aria-sort");
    expect(screen.getByRole("columnheader", { name: /团队/ })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });

  it("follows controlled sort state and still reports the next state", async () => {
    const onSortChange = vi.fn();
    const sortableColumns: TableColumn<Person>[] = [{ ...columns[0], sortable: true }, columns[1]];
    const { rerender } = render(
      <Table
        aria-label="受控排序"
        columns={sortableColumns}
        dataSource={people}
        rowKey="id"
        sort={null}
        onSortChange={onSortChange}
      />,
    );

    const header = screen.getByRole("columnheader", { name: /姓名/ });
    await userEvent.click(within(header).getByRole("button", { name: "按姓名升序排序" }));
    expect(onSortChange).toHaveBeenCalledWith({ columnKey: "name", order: "ascend" });
    expect(header).not.toHaveAttribute("aria-sort");

    rerender(
      <Table
        aria-label="受控排序"
        columns={sortableColumns}
        dataSource={people}
        rowKey="id"
        sort={{ columnKey: "name", order: "descend" }}
        onSortChange={onSortChange}
      />,
    );
    expect(header).toHaveAttribute("aria-sort", "descending");
  });

  it("activates sorting from the keyboard", async () => {
    const sortableColumns: TableColumn<Person>[] = [{ ...columns[0], sortable: true }, columns[1]];
    render(
      <Table aria-label="键盘排序" columns={sortableColumns} dataSource={people} rowKey="id" />,
    );

    const header = screen.getByRole("columnheader", { name: /姓名/ });
    const button = within(header).getByRole("button", { name: "按姓名升序排序" });
    button.focus();
    expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(header).toHaveAttribute("aria-sort", "ascending");

    await userEvent.keyboard(" ");
    expect(header).toHaveAttribute("aria-sort", "descending");
  });

  it("selects rows with an indeterminate select-all header", async () => {
    const onChange = vi.fn();
    render(
      <Table
        caption="选择成员"
        columns={columns}
        dataSource={people}
        rowKey="id"
        rowSelection={{ onChange }}
      />,
    );

    const selectAll = screen.getByRole("checkbox", { name: "全选" });
    const zhang = screen.getByRole("checkbox", { name: "选择 张三" });
    expect(selectAll).toHaveAttribute("aria-checked", "false");

    await userEvent.click(zhang);
    expect(zhang).toHaveAttribute("aria-checked", "true");
    expect(selectAll).toHaveAttribute("aria-checked", "mixed");
    expect(onChange).toHaveBeenLastCalledWith([1], [people[0]]);

    await userEvent.click(selectAll);
    expect(selectAll).toHaveAttribute("aria-checked", "true");
    expect(onChange).toHaveBeenLastCalledWith([1, 2, 3], [people[0], people[1], people[2]]);

    await userEvent.click(selectAll);
    expect(selectAll).toHaveAttribute("aria-checked", "false");
    expect(onChange).toHaveBeenLastCalledWith([], []);
  });

  it("centers selection checkboxes on the header and row text line", () => {
    const centerOf = (target: Element | Range) => {
      const rect = target.getBoundingClientRect();
      return rect.top + rect.height / 2;
    };
    const textCenterOf = (el: Element) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return centerOf(range);
    };

    for (const size of ["sm", "md", "lg"] as const) {
      const { unmount } = render(
        <Table
          caption={`选择对齐 ${size}`}
          columns={columns}
          dataSource={people}
          rowKey="id"
          rowSelection={{}}
          size={size}
        />,
      );

      const selectAll = screen.getByRole("checkbox", { name: "全选" });
      const headerTitle = screen
        .getByRole("columnheader", { name: "姓名" })
        .querySelector("span") as Element;
      expect(Math.abs(centerOf(selectAll) - centerOf(headerTitle))).toBeLessThanOrEqual(1);

      const rowCheckbox = screen.getByRole("checkbox", { name: "选择 张三" });
      const nameCell = screen.getByRole("cell", { name: "张三" });
      expect(Math.abs(centerOf(rowCheckbox) - textCenterOf(nameCell))).toBeLessThanOrEqual(1);

      unmount();
    }
  });

  it("ignores disabled rows during selection and select-all", async () => {
    const onChange = vi.fn();
    render(
      <Table
        caption="禁用行"
        columns={columns}
        dataSource={people}
        rowKey="id"
        rowSelection={{
          onChange,
          getCheckboxProps: (record) => (record.id === 2 ? { disabled: true } : {}),
        }}
      />,
    );

    const selectAll = screen.getByRole("checkbox", { name: "全选" });
    const disabled = screen.getByRole("checkbox", { name: "选择 李四" });

    await userEvent.click(disabled);
    expect(disabled).toHaveAttribute("aria-checked", "false");
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.click(selectAll);
    expect(screen.getByRole("checkbox", { name: "选择 张三" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("checkbox", { name: "选择 王五" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(disabled).toHaveAttribute("aria-checked", "false");
    expect(onChange).toHaveBeenLastCalledWith([1, 3], [people[0], people[2]]);
  });

  it("keeps controlled selection under the owner's control", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Table
        caption="受控选择"
        columns={columns}
        dataSource={people}
        rowKey="id"
        rowSelection={{ selectedRowKeys: [1], onChange }}
      />,
    );

    const zhang = screen.getByRole("checkbox", { name: "选择 张三" });
    const li = screen.getByRole("checkbox", { name: "选择 李四" });
    expect(zhang).toHaveAttribute("aria-checked", "true");
    expect(li).toHaveAttribute("aria-checked", "false");

    await userEvent.click(li);
    expect(onChange).toHaveBeenCalledWith([1, 2], [people[0], people[1]]);
    expect(li).toHaveAttribute("aria-checked", "false");

    rerender(
      <Table
        caption="受控选择"
        columns={columns}
        dataSource={people}
        rowKey="id"
        rowSelection={{ selectedRowKeys: [2], onChange }}
      />,
    );
    expect(zhang).toHaveAttribute("aria-checked", "false");
    expect(li).toHaveAttribute("aria-checked", "true");
  });

  it("renders the empty state and a custom empty node", () => {
    const { rerender } = render(<Table caption="空表" columns={columns} dataSource={[]} />);

    expect(screen.getByRole("table", { name: "空表" })).toBeInTheDocument();
    const emptyText = screen.getByText("暂无数据");
    expect(emptyText).toBeInTheDocument();
    expect(emptyText.closest("tr")).not.toBeNull();
    expect(emptyText.closest("td")).toHaveAttribute("colspan", "3");

    rerender(
      <Table
        caption="空表"
        columns={columns}
        dataSource={[]}
        empty={<span>没有匹配的成员</span>}
      />,
    );
    expect(screen.getByText("没有匹配的成员")).toBeInTheDocument();
    expect(screen.queryByText("暂无数据")).toBeNull();
  });

  it("overlays existing rows while loading and shows a loading row when empty", () => {
    const { container, rerender } = render(
      <Table caption="加载" columns={columns} dataSource={people} rowKey="id" loading />,
    );

    expect(screen.getByRole("status", { name: "加载中" })).toBeInTheDocument();
    expect(container.querySelector("table")).toHaveAttribute("aria-busy", "true");

    rerender(<Table caption="加载" columns={columns} dataSource={[]} rowKey="id" loading />);
    expect(screen.getByRole("status", { name: "加载中" })).toBeInTheDocument();
    expect(screen.queryByText("暂无数据")).toBeNull();
    const loadingBox = container.querySelector("tbody td div");
    expect(loadingBox).not.toBeNull();
    expect(getComputedStyle(loadingBox as Element).height).toBe("68px");
  });

  it("calls the row click hook", async () => {
    const onClick = vi.fn();
    render(
      <Table
        caption="可点击行"
        columns={columns}
        dataSource={people}
        rowKey="id"
        onRow={(record) => ({ onClick: () => onClick(record.id) })}
      />,
    );

    const cell = screen.getByRole("cell", { name: "张三" });
    await userEvent.click(cell);
    expect(onClick).toHaveBeenCalledWith(1);
    expect(cell.closest("tr")).toHaveAttribute("data-clickable");
  });

  it("renders custom cell content and truncates with a title", () => {
    const customColumns: TableColumn<Person>[] = [
      { key: "name", title: "姓名", dataIndex: "name", ellipsis: true },
      {
        key: "score",
        title: "评分",
        dataIndex: "score",
        align: "right",
        render: (value) => <strong>{String(value)} 分</strong>,
      },
    ];

    render(
      <Table caption="自定义内容" columns={customColumns} dataSource={[people[0]]} rowKey="id" />,
    );

    expect(screen.getByRole("cell", { name: "96 分" })).toBeInTheDocument();
    const nameCell = screen.getByRole("cell", { name: "张三" });
    expect(nameCell.querySelector("span")).toHaveAttribute("title", "张三");
    expect(getComputedStyle(screen.getByRole("columnheader", { name: "评分" })).textAlign).toBe(
      "right",
    );
  });

  it("uses the documented 8/12/16px padding and 22px line height", () => {
    const { rerender } = render(
      <Table caption="尺寸" columns={columns} dataSource={[people[0], people[1]]} rowKey="id" />,
    );
    let cell = screen.getByRole("cell", { name: "张三" });
    expect(getComputedStyle(cell).paddingTop).toBe("12px");
    expect(getComputedStyle(cell).paddingBottom).toBe("12px");
    expect(getComputedStyle(cell).lineHeight).toBe("22px");
    expect(getComputedStyle(cell).borderBottomWidth).toBe("1px");
    expect(Math.round(cell.getBoundingClientRect().height)).toBe(47);

    rerender(
      <Table
        caption="尺寸"
        columns={columns}
        dataSource={[people[0], people[1]]}
        rowKey="id"
        size="sm"
      />,
    );
    cell = screen.getByRole("cell", { name: "张三" });
    expect(getComputedStyle(cell).paddingTop).toBe("8px");
    expect(getComputedStyle(cell).paddingBottom).toBe("8px");

    rerender(
      <Table
        caption="尺寸"
        columns={columns}
        dataSource={[people[0], people[1]]}
        rowKey="id"
        size="lg"
      />,
    );
    cell = screen.getByRole("cell", { name: "张三" });
    expect(getComputedStyle(cell).paddingTop).toBe("16px");
    expect(getComputedStyle(cell).paddingBottom).toBe("16px");
  });

  it("stacks fixed columns with sticky offsets and edge shadows", () => {
    const fixedColumns: TableColumn<Person>[] = [
      { key: "name", title: "姓名", dataIndex: "name", width: 120, fixed: "left" },
      { key: "team", title: "团队", dataIndex: "team", width: 160, fixed: "left" },
      { key: "joined", title: "加入时间", dataIndex: "joined", width: 140, fixed: "right" },
    ];

    const { container } = render(
      <Table
        caption="固定列"
        columns={fixedColumns}
        dataSource={[people[0]]}
        rowKey="id"
        stickyHeader
        tableLayout="fixed"
        maxHeight={200}
      />,
    );

    const nameCell = screen.getByRole("cell", { name: "张三" });
    const teamCell = screen.getByRole("cell", { name: "设计" });
    const joinedCell = screen.getByRole("cell", { name: "2023-01-02" });
    const nameHeader = screen.getByRole("columnheader", { name: "姓名" });

    expect(getComputedStyle(nameCell).position).toBe("sticky");
    expect(getComputedStyle(nameCell).left).toBe("0px");
    expect(getComputedStyle(teamCell).left).toBe("120px");
    expect(getComputedStyle(joinedCell).position).toBe("sticky");
    expect(getComputedStyle(joinedCell).right).toBe("0px");
    expect(getComputedStyle(teamCell).boxShadow).not.toBe("none");
    expect(getComputedStyle(nameCell).boxShadow).toBe("none");
    expect(getComputedStyle(nameHeader).position).toBe("sticky");
    expect(getComputedStyle(nameHeader).top).toBe("0px");
    expect(getComputedStyle(container.querySelector("table") as Element).tableLayout).toBe("fixed");
  });

  it("draws the UD bordered grid", () => {
    render(
      <Table
        caption="有边界表格"
        bordered
        columns={columns}
        dataSource={[people[0], people[1]]}
        rowKey="id"
      />,
    );

    const table = screen.getByRole("table", { name: "有边界表格" });
    const cell = screen.getByRole("cell", { name: "张三" });
    expect(getComputedStyle(table).borderLeftWidth).toBe("1px");
    expect(getComputedStyle(cell).borderRightWidth).toBe("1px");
    expect(getComputedStyle(cell).borderBottomWidth).toBe("1px");
  });

  it("renders the composable semantic parts", () => {
    const { container } = render(
      <Table>
        <TableCaption>季度数据</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>项目</TableHead>
            <TableHead align="right">金额</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead scope="row">收入</TableHead>
            <TableCell align="right">120</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>合计</TableCell>
            <TableCell align="right">120</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByRole("table", { name: "季度数据" })).toBeInTheDocument();
    expect(screen.getByRole("caption", { name: "季度数据" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "项目" })).toHaveAttribute("scope", "col");
    expect(screen.getByRole("rowheader", { name: "收入" })).toHaveAttribute("scope", "row");
    expect(
      within(container.querySelector("tbody") as HTMLElement).getByRole("cell", { name: "120" }),
    ).toBeInTheDocument();
    expect(container.querySelector("tfoot")).not.toBeNull();
  });

  it("draws one hairline between the last body row, the footer and the table edge", () => {
    render(
      <Table caption="汇总">
        <TableHeader>
          <TableRow hoverable={false}>
            <TableHead>项目</TableHead>
            <TableHead align="right">合计</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead scope="row">成本</TableHead>
            <TableCell align="right">81,000</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow hoverable={false}>
            <TableCell>利润</TableCell>
            <TableCell align="right">193,000</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const table = screen.getByRole("table", { name: "汇总" });
    const cost = screen.getByRole("rowheader", { name: "成本" });
    const profit = screen.getByRole("cell", { name: "利润" });

    // The footer's top border is the only divider under the last body row.
    expect(getComputedStyle(cost).borderBottomWidth).toBe("0px");
    expect(getComputedStyle(profit).borderTopWidth).toBe("1px");
    // The table's own bottom border closes the footer instead of doubling it.
    expect(getComputedStyle(profit).borderBottomWidth).toBe("0px");
    expect(getComputedStyle(table).borderBottomWidth).toBe("1px");
  });

  it("integrates the pagination bar with the UD 16px vertical margin", async () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Table
        caption="分页"
        columns={columns}
        dataSource={people}
        rowKey="id"
        pagination={{
          total: 25,
          pageSize: 10,
          defaultCurrent: 1,
          onPageChange,
        }}
      />,
    );

    const bar = container.querySelector('[data-slot="table-pagination"]') as HTMLElement;
    expect(getComputedStyle(bar).marginTop).toBe("16px");
    expect(getComputedStyle(bar).marginBottom).toBe("16px");

    await userEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange.mock.calls[0][0]).toBe(2);
  });

  it("reports each uncontrolled sort transition so an owner can drive the data", async () => {
    render(<OwnerSortState />);
    await userEvent.click(screen.getByRole("button", { name: "按姓名升序排序" }));
    expect(screen.getByTestId("order")).toHaveTextContent("asc");
    await userEvent.click(screen.getByRole("button", { name: "按姓名降序排序" }));
    expect(screen.getByTestId("order")).toHaveTextContent("desc");
    await userEvent.click(screen.getByRole("button", { name: "恢复姓名默认排序" }));
    expect(screen.getByTestId("order")).toHaveTextContent("none");
  });
});
