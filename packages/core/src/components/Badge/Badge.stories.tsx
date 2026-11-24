import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../Avatar";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书徽标。红点、数字或文字，用于提示待处理事物或更新数量，遵循 UD（Universe Design）规范：\n\n" +
          "- 点状：6 / 8 / 10px，组件默认 8px\n" +
          "- 字符：高度 16px、圆角 8px、12px Medium 字重\n" +
          "- 超限：超过 `overflowCount` 显示 `99+`，屏幕阅读器仍读取完整数量\n" +
          "- 空值：`count` 为 0 或未提供且无文字时，徽标不渲染\n" +
          "- 状态色：默认、成功、警告、危险、信息",
      },
    },
  },
  argTypes: {
    count: { control: "number" },
    overflowCount: { control: "number" },
    dot: { control: "boolean" },
    status: { control: "select", options: ["default", "success", "warning", "danger", "info"] },
    text: { control: "text" },
    standalone: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    count: 5,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {};

export const Overflow: Story = {
  args: { count: 120 },
};

export const CustomOverflow: Story = {
  args: { count: 12, overflowCount: 9 },
};

export const Counts: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {[1, 9, 99, 100, 1000].map((count) => (
        <Badge key={count} {...args} count={count} />
      ))}
    </div>
  ),
};

export const Dot: Story = {
  args: { dot: true, count: undefined, label: "有新消息" },
};

export const Zero: Story = {
  args: { count: 0 },
  render: (args) => (
    <div className="flex items-center gap-4 text-lark-14 text-lark-caption">
      <Badge {...args} count={0}>
        <span className="inline-flex h-10 items-center rounded-lark-md bg-lark-tag-fill px-3 text-lark-title">
          收件箱
        </span>
      </Badge>
      <span>0 条未读时不渲染徽标</span>
    </div>
  ),
};

export const Text: Story = {
  args: { count: undefined, text: "New" },
};

export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["default", "success", "warning", "danger", "info"] as const).map((status) => (
        <div key={status} className="flex items-center gap-4">
          <Badge {...args} status={status} count={8} />
          <Badge {...args} status={status} dot count={undefined} />
          <span className="text-lark-14 text-lark-body">{status}</span>
        </div>
      ))}
    </div>
  ),
};

export const Standalone: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Badge {...args} count={8} standalone />
      <Badge {...args} count={120} standalone />
      <Badge {...args} dot count={undefined} standalone />
    </div>
  ),
};

export const WithChildren: Story = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <Badge {...args} count={12}>
        <Avatar alt="林七七" size="lg" />
      </Badge>
      <Badge {...args} count={3}>
        <span className="inline-flex h-10 items-center rounded-lark-md bg-lark-tag-fill px-3 text-lark-14 text-lark-title">
          收件箱
        </span>
      </Badge>
      <Badge {...args} dot count={undefined} label="有新消息">
        <Avatar alt="John Smith" size="lg" shape="square" />
      </Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["default", "success", "warning", "danger", "info"] as const).map((status) => (
        <div key={status} className="flex items-center gap-4">
          <Badge {...args} status={status} count={1} />
          <Badge {...args} status={status} count={99} />
          <Badge {...args} status={status} count={120} />
          <Badge {...args} status={status} dot count={undefined} />
          <Badge {...args} status={status} count={undefined} text="New" />
          <Badge {...args} status={status} count={5} standalone />
        </div>
      ))}
    </div>
  ),
};
