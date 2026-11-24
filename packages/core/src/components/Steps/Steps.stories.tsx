import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Steps } from "./Steps";

const items = [
  { title: "填写基本信息", description: "输入项目名称和描述" },
  { title: "配置权限", description: "选择可见范围" },
  { title: "邀请成员", description: "添加协作者" },
  { title: "完成创建", description: "确认后立即生效" },
];

const meta: Meta<typeof Steps> = {
  title: "Components/Steps",
  component: Steps,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书步骤条。用于引导用户按顺序完成复杂任务，语义结构为 `ol` / `li`，" +
          '当前步骤带 `aria-current="step"`。\n\n' +
          "- 方向：水平、垂直\n" +
          "- 标题位置：与节点同行或位于节点下方\n" +
          "- 节点尺寸：24px（sm）/ 28px（md）\n" +
          "- 状态：wait、process、finish、error，支持加载与自定义图标\n" +
          "- 传入 `onChange` 后节点变为可点击按钮",
      },
    },
  },
  argTypes: {
    current: { control: { type: "number", min: 0, max: items.length - 1 } },
    status: { control: "select", options: ["wait", "process", "finish", "error"] },
    direction: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["sm", "md"] },
    labelPlacement: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: {
    items,
    current: 1,
    status: "process",
    direction: "horizontal",
    size: "md",
    labelPlacement: "horizontal",
  },
  decorators: [
    (Story) => (
      <div className="w-[720px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => <Steps {...args} aria-label="创建项目" />,
};

export const Vertical: Story = {
  args: { direction: "vertical" },
  render: (args) => (
    <div className="w-[420px] max-w-full">
      <Steps {...args} aria-label="创建项目" />
    </div>
  ),
};

export const LabelVertical: Story = {
  args: { labelPlacement: "vertical" },
  render: (args) => <Steps {...args} aria-label="创建项目" />,
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      {(["sm", "md"] as const).map((size) => (
        <Steps
          key={size}
          {...args}
          size={size}
          labelPlacement="vertical"
          aria-label={`${size} 步骤条`}
        />
      ))}
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    current: 1,
    status: "error",
    items: [
      { title: "填写基本信息" },
      { title: "校验失败", description: "请检查必填项" },
      ...items.slice(2),
    ],
  },
  render: (args) => <Steps {...args} aria-label="创建失败" />,
};

export const WithLoading: Story = {
  args: {
    current: 2,
    items: items.map((item, index) => (index === 2 ? { ...item, loading: true } : item)),
  },
  render: (args) => <Steps {...args} aria-label="正在创建" />,
};

export const Clickable: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(1);
    return <Steps {...args} current={current} onChange={setCurrent} aria-label="可点击步骤" />;
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Steps {...args} current={1} aria-label="水平步骤条" />
      <Steps {...args} current={2} labelPlacement="vertical" aria-label="居中标签步骤条" />
      <div className="w-[420px] max-w-full">
        <Steps {...args} current={1} direction="vertical" aria-label="垂直步骤条" />
      </div>
    </div>
  ),
};
