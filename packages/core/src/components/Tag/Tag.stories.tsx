import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, InfoIcon } from "../../icons";
import { Tag } from "./Tag";

const meta = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书标签。用于标记内容的属性、维度或状态，尺寸与 UD（Universe Design）规范一致：\n\n" +
          "- 尺寸：20 / 24px\n" +
          "- 语义色：中性、主要、成功、警告、危险\n" +
          "- 状态：默认、悬停、禁用\n" +
          "- 可选：前置图标、移除按钮（真实 button，支持键盘操作）",
      },
    },
  },
  argTypes: {
    tone: { control: "select", options: ["neutral", "primary", "success", "warning", "danger"] },
    size: { control: "select", options: ["sm", "md"] },
    closable: { control: "boolean" },
    closeLabel: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "标签",
    tone: "neutral",
    size: "md",
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Primary: Story = {
  args: { tone: "primary", children: "进行中" },
};

export const Success: Story = {
  args: { tone: "success", children: "已完成" },
};

export const Warning: Story = {
  args: { tone: "warning", children: "待处理" },
};

export const Danger: Story = {
  args: { tone: "danger", children: "已驳回" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["sm", "md"] as const).map((size) => (
        <Tag key={size} {...args} size={size}>
          {size.toUpperCase()}
        </Tag>
      ))}
    </div>
  ),
};

export const Closable: Story = {
  args: { closable: true, children: "可移除" },
};

export const WithStartIcon: Story = {
  args: {
    tone: "success",
    startIcon: <CheckIcon />,
    children: "已完成",
  },
};

export const Disabled: Story = {
  args: { closable: true, disabled: true, children: "不可用" },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["neutral", "primary", "success", "warning", "danger"] as const).map((tone) => (
        <div key={tone} className="flex items-center gap-3">
          {(["sm", "md"] as const).map((size) => (
            <Tag key={size} {...args} tone={tone} size={size}>
              {tone}
            </Tag>
          ))}
          <Tag {...args} tone={tone} closable>
            {tone} · 可移除
          </Tag>
          <Tag {...args} tone={tone} startIcon={<InfoIcon />}>
            {tone} · 图标
          </Tag>
        </div>
      ))}
    </div>
  ),
};
