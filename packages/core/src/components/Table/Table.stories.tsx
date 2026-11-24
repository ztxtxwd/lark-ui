import type { Meta, StoryObj } from "@storybook/react-vite";
import { type Key, useState } from "react";
import { Button } from "../Button";
import { Tag } from "../Tag";
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
  role: "所有者" | "管理员" | "成员" | "访客";
  joined: string;
  score: number;
};

const people: Person[] = [
  { id: 1, name: "张三", team: "设计", role: "所有者", joined: "2023-01-02", score: 96 },
  { id: 2, name: "李四", team: "研发", role: "管理员", joined: "2023-03-14", score: 88 },
  { id: 3, name: "王五", team: "研发", role: "成员", joined: "2022-11-08", score: 91 },
  { id: 4, name: "赵六", team: "产品", role: "成员", joined: "2024-02-19", score: 84 },
  { id: 5, name: "陈七", team: "市场", role: "访客", joined: "2021-09-27", score: 79 },
  { id: 6, name: "周八", team: "设计", role: "成员", joined: "2023-07-05", score: 93 },
];

const columns: TableColumn<Person>[] = [
  { key: "name", title: "姓名", dataIndex: "name", width: 160 },
  { key: "team", title: "团队", dataIndex: "team", width: 140 },
  { key: "role", title: "角色", dataIndex: "role", width: 160 },
  { key: "joined", title: "加入时间", dataIndex: "joined", width: 180 },
  { key: "score", title: "绩效分", dataIndex: "score", width: 120, align: "right" },
];

const sortableColumns: TableColumn<Person>[] = columns.map((column) => ({
  ...column,
  sortable: column.key === "name" || column.key === "joined" || column.key === "score",
}));

function roleTone(role: Person["role"]) {
  if (role === "所有者") {
    return "primary" as const;
  }
  if (role === "管理员") {
    return "success" as const;
  }
  if (role === "访客") {
    return "warning" as const;
  }
  return "neutral" as const;
}

const customColumns: TableColumn<Person>[] = [
  {
    key: "name",
    title: "成员",
    dataIndex: "name",
    render: (value, record) => (
      <span className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-lark-primary-soft text-lark-12 font-medium text-lark-primary-content"
        >
          {String(value).slice(0, 1)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate">{record.name}</span>
          <span className="text-lark-12 leading-5 text-lark-caption">{record.team}</span>
        </span>
      </span>
    ),
  },
  {
    key: "role",
    title: "角色",
    dataIndex: "role",
    render: (value) => (
      <Tag size="sm" tone={roleTone(value as Person["role"])}>
        {String(value)}
      </Tag>
    ),
  },
  {
    key: "joined",
    title: "加入时间",
    dataIndex: "joined",
    ellipsis: true,
  },
  {
    key: "score",
    title: "绩效分",
    dataIndex: "score",
    align: "right",
    render: (value) => <span className="font-medium tabular-nums">{String(value)}</span>,
  },
];

const fixedColumns: TableColumn<Person>[] = [
  { ...columns[0], width: 180, fixed: "left" },
  { ...columns[1], width: 140, fixed: "left" },
  { ...columns[2], width: 200 },
  { ...columns[3], width: 180 },
  {
    key: "actions",
    title: "操作",
    width: 120,
    fixed: "right",
    render: (_value, record) => (
      <Button appearance="text" size="sm" aria-label={`查看 ${record.name}`}>
        查看
      </Button>
    ),
  },
];

const meta = {
  title: "Components/Table",
  component: Table as typeof Table<Person>,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "表格。将大量数据结构化展示，并承载排序、选择、固定列与分页等操作。\n\n" +
          "- 字号 14px、行高 22px；单元格左右内边距 12px，勾选列固定 40px\n" +
          "- 尺寸：紧凑型 8px、基础型 12px、宽松型 16px 上下内边距\n" +
          "- 分割线 1px N900 15%；表头 14px Medium N600；行悬停使用 N 系填充\n" +
          "- 排序：单击升序，再次降序，第三次恢复默认；同时只按一列排序\n" +
          "- 固定列使用 Shadow-S1 方向投影；吸顶表头需配合 `maxHeight` 形成内部滚动\n" +
          "- 空状态距表头 28px；首次加载行高 68px，刷新使用 60% 画布遮罩",
      },
    },
  },
  argTypes: {
    columns: { control: false },
    dataSource: { control: false },
    rowKey: { control: false },
    rowSelection: { control: false },
    pagination: { control: false },
    onRow: { control: false },
    onSortChange: { control: false },
    size: { control: "select", options: ["sm", "md", "lg"] },
    tableLayout: { control: "select", options: ["auto", "fixed"] },
    bordered: { control: "boolean" },
    stickyHeader: { control: "boolean" },
    hoverable: { control: "boolean" },
    loading: { control: "boolean" },
  },
  args: {
    caption: "团队成员",
    columns,
    dataSource: people,
    rowKey: "id",
    size: "md",
    tableLayout: "auto",
    bordered: false,
    stickyHeader: false,
    hoverable: true,
    loading: false,
  },
} satisfies Meta<typeof Table<Person>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Sorting: Story = {
  args: {
    caption: "可排序成员（单列）",
    columns: sortableColumns,
  },
};

export const Selection: Story = {
  args: {
    caption: "选择成员",
    rowSelection: {
      defaultSelectedRowKeys: [2],
      getCheckboxProps: (record) => (record.role === "访客" ? { disabled: true } : {}),
    },
  },
};

function ControlledSelectionExample() {
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([1, 3]);
  return (
    <Table
      caption={`已选择 ${selectedKeys.length} 人`}
      columns={columns}
      dataSource={people}
      rowKey="id"
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: (keys) => setSelectedKeys(keys),
      }}
    />
  );
}

export const ControlledSelection: Story = {
  render: () => <ControlledSelectionExample />,
};

export const Bordered: Story = {
  args: {
    caption: "有边界表格",
    bordered: true,
  },
};

export const FixedAndSticky: Story = {
  args: {
    caption: "固定列与吸顶表头",
    columns: fixedColumns,
    tableLayout: "fixed",
    stickyHeader: true,
    maxHeight: 260,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Table {...args} caption="紧凑型（8px）" size="sm" dataSource={people.slice(0, 3)} />
      <Table {...args} caption="基础型（12px）" size="md" dataSource={people.slice(0, 3)} />
      <Table {...args} caption="宽松型（16px）" size="lg" dataSource={people.slice(0, 3)} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    caption: "空状态",
    dataSource: [],
  },
};

export const EmptyCustom: Story = {
  args: {
    caption: "自定义空状态",
    dataSource: [],
    empty: (
      <div className="py-7 text-center text-lark-14 text-lark-caption">
        没有匹配的成员，试试调整筛选条件。
      </div>
    ),
  },
};

export const Loading: Story = {
  args: {
    caption: "加载中",
    loading: true,
  },
};

export const LoadingEmpty: Story = {
  args: {
    caption: "首次加载",
    dataSource: [],
    loading: true,
  },
};

export const CustomRender: Story = {
  args: {
    caption: "自定义单元格",
    columns: customColumns,
    dataSource: people.slice(0, 4),
  },
};

export const Composable: Story = {
  args: {
    caption: undefined,
    columns: undefined,
    dataSource: undefined,
  },
  render: () => (
    <Table caption="季度汇总" bordered>
      <TableHeader>
        <TableRow hoverable={false}>
          <TableHead>项目</TableHead>
          <TableHead align="right">Q1</TableHead>
          <TableHead align="right">Q2</TableHead>
          <TableHead align="right">合计</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead scope="row">收入</TableHead>
          <TableCell align="right">128,000</TableCell>
          <TableCell align="right">146,000</TableCell>
          <TableCell align="right">274,000</TableCell>
        </TableRow>
        <TableRow>
          <TableHead scope="row">成本</TableHead>
          <TableCell align="right">42,000</TableCell>
          <TableCell align="right">39,000</TableCell>
          <TableCell align="right">81,000</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow hoverable={false}>
          <TableCell>利润</TableCell>
          <TableCell align="right">86,000</TableCell>
          <TableCell align="right">107,000</TableCell>
          <TableCell align="right">193,000</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

function PaginatedExample() {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const pageRows = people.slice((page - 1) * pageSize, page * pageSize);
  return (
    <Table
      caption="分页成员"
      columns={columns}
      dataSource={pageRows}
      rowKey="id"
      pagination={{
        total: people.length,
        pageSize,
        current: page,
        onPageChange: (next) => setPage(next),
        showTotal: (total, range) => `共 ${total} 条，当前 ${range[0]}-${range[1]} 条`,
      }}
    />
  );
}

export const WithPagination: Story = {
  render: () => <PaginatedExample />,
};

export const ComposableCaption: Story = {
  args: {
    caption: undefined,
    columns: undefined,
    dataSource: undefined,
  },
  render: () => (
    <Table aria-label="可组合表格">
      <TableCaption>通过子组件拼装的表格</TableCaption>
      <TableHeader>
        <TableRow hoverable={false}>
          <TableHead>字段</TableHead>
          <TableHead>说明</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>caption</TableCell>
          <TableCell>可见标题，自动成为表格的可访问名称</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>aria-label</TableCell>
          <TableCell>没有可见标题时必填</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
