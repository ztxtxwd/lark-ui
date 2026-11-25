import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书文字提示。12px 文字，左右 12px / 上下 8px 内边距，最大宽度 320px，圆角 8px，" +
          "使用 Shadow/S4 投影。悬停 100ms 后出现，箭头 12 × 6px。",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    arrow: { control: "boolean" },
  },
  args: {
    content: "创建新的云文档",
    side: "top",
    align: "center",
    arrow: true,
    children: <span />,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button appearance="outlined" tone="neutral">
        悬停查看提示
      </Button>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} {...args} side={side} content={`${side} 方向`}>
          <Button size="sm" appearance="outlined" tone="neutral">
            {side}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const LongText: Story = {
  args: {
    content:
      "这是一段较长的提示文字，用于说明某个操作的具体含义。文字提示的最大宽度为 320px，超出后自动换行。",
  },
  render: Basic.render,
};

export const IconTrigger: Story = {
  args: { content: "更多操作", type: "label" },
  render: (args) => (
    <Tooltip {...args}>
      <Button appearance="icon" tone="neutral" aria-label="更多">
        •••
      </Button>
    </Tooltip>
  ),
};

export const DisabledButton: Story = {
  name: "Disabled button",
  args: { content: "当前空间已满，无法创建文档" },
  parameters: {
    docs: {
      description: {
        story:
          "禁用按钮不在 Tab 顺序里、也收不到指针事件，直接套 Tooltip 既看不到提示，" +
          "ui-sdk 还会报警告。给触发元素加 `focusableWhenDisabled`：按钮改用 " +
          "`aria-disabled` 保持可聚焦，按下仍然无效，键盘和鼠标都能读到禁用原因。",
      },
    },
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button disabled focusableWhenDisabled>
        创建文档
      </Button>
    </Tooltip>
  ),
};
