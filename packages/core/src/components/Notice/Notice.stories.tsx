import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import type { NoticeTone } from "./Notice";
import { Notice } from "./Notice";

const meta = {
  title: "Components/Notice",
  component: Notice,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "常驻提示 Notice，用于展示需要用户关注的信息。\n\n" +
          "- 非浮层、始终展示，不会自动消失；用户可主动关闭\n" +
          "- 语义：普通 info、成功 success、警告 warning、错误 danger\n" +
          "- 可包含标题、正文、文字按钮与关闭按钮",
      },
    },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger", "neutral"],
    },
    size: { control: "select", options: ["sm", "md"] },
    title: { control: "text" },
    description: { control: "text" },
    showIcon: { control: "boolean" },
    closable: { control: "boolean" },
  },
  args: {
    tone: "info",
    size: "md",
    title: "标题",
    description: "常驻提示用于展示背景条件、规范要求或当前状态等需要用户关注的信息。",
    showIcon: true,
    closable: false,
  },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

const toneCopy: Record<NoticeTone, { title: string; description: string }> = {
  info: {
    title: "普通提示",
    description: "展示背景条件、规范要求、当前状态等客观内容。",
  },
  success: {
    title: "成功提示",
    description: "展示完成操作后的成功状态。",
  },
  warning: {
    title: "警告提示",
    description: "展示可能会导致某种后果的警示性信息。",
  },
  danger: {
    title: "错误提示",
    description: "展示报错信息；多个报错条件建议合并为一组整体提示。",
  },
  neutral: {
    title: "中性提示",
    description: "用于需要提示但不带有明确语义色的场景。",
  },
};

export const Info: Story = {};

export const AllTones: Story = {
  render: (args) => (
    <div className="flex w-[640px] flex-col gap-3">
      {(Object.keys(toneCopy) as NoticeTone[]).map((tone) => (
        <Notice
          key={tone}
          {...args}
          tone={tone}
          title={toneCopy[tone].title}
          description={toneCopy[tone].description}
        />
      ))}
    </div>
  ),
};

export const Closable: Story = {
  args: {
    title: "可关闭的提示",
    description: "常驻提示不会自动消失，用户点击关闭后不再展示。",
    closable: true,
  },
};

export const WithAction: Story = {
  args: {
    title: "需要处理",
    description: "当前文档的共享设置已过期，请重新设置共享范围。",
    closable: true,
    action: (
      <Button appearance="link" size="sm">
        重新设置
      </Button>
    ),
  },
};

export const WithoutIcon: Story = {
  args: {
    showIcon: false,
    description: "隐藏状态图标，仅展示文案。",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-[640px] flex-col gap-3">
      <Notice {...args} size="sm" title="紧凑尺寸" />
      <Notice {...args} size="md" title="标准尺寸" />
    </div>
  ),
};
