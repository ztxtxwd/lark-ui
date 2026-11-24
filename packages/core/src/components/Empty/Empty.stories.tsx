import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Empty } from "./Empty";

const meta = {
  title: "Components/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书空状态。用于内容为空、结果为空或操作完成后的即时反馈：\n\n" +
          "- 组成：插画、标题（可选）、描述、行动按钮（可选）\n" +
          "- 插画：60 / 120 / 150px（小 / 中 / 大），默认灰色中性插画\n" +
          "- 文案：标题 N900，描述 N600，14px；整体最大宽度 250px\n" +
          "- 间距：插画与文案 16px，标题与描述 4px，操作区 16px\n" +
          "- 操作按钮优先使用面性按钮；可通过 `action` 或 `children` 传入",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    title: { control: "text" },
    description: { control: "text" },
  },
  args: {
    title: "暂无内容",
    description: "当有新内容时会显示在这里",
    size: "md",
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    title: "还没有文档",
    description: "创建第一篇文档，开始记录你的想法",
    action: <Button>新建文档</Button>,
  },
};

export const TitleOnly: Story = {
  args: { title: "暂无搜索结果", description: "" },
};

export const WithoutIllustration: Story = {
  args: { illustration: null },
};

export const CustomIllustration: Story = {
  args: {
    illustration: (
      <svg aria-hidden="true" className="h-full w-full" fill="none" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="44" className="fill-lark-primary-soft" />
        <path
          d="M42 60h36M60 42v36"
          className="stroke-lark-primary-content"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    ),
    description: "使用自定义插画表达品牌情感",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-start gap-12">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Empty key={size} {...args} size={size} title={`尺寸 ${size}`} description="空状态" />
      ))}
    </div>
  ),
};

export const ActionRow: Story = {
  args: {
    title: "还没有群聊",
    description: "发起群聊，邀请同事一起协作",
    action: (
      <>
        <Button>发起群聊</Button>
        <Button appearance="outlined" tone="neutral">
          取消
        </Button>
      </>
    ),
  },
};
