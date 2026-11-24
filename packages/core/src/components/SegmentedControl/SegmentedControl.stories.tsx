import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tooltip } from "../Tooltip";
import { SegmentedControl, SegmentedControlItem } from "./SegmentedControl";

function AlignLeftIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 12 12" width="12" height="12">
      <path d="M2.83337 0.933292C2.83337 0.786016 2.71398 0.666626 2.56671 0.666626H2.10004C1.95276 0.666626 1.83337 0.786017 1.83337 0.933293V11.0666C1.83337 11.2139 1.95276 11.3333 2.10004 11.3333H2.56671C2.71398 11.3333 2.83337 11.2139 2.83337 11.0666V0.933292Z" />
      <path d="M11.1667 9.06663C11.1667 9.2139 11.0473 9.33329 10.9 9.33329H4.76671C4.61943 9.33329 4.50004 9.2139 4.50004 9.06663V6.93329C4.50004 6.78602 4.61943 6.66663 4.76671 6.66663H10.9C11.0473 6.66663 11.1667 6.78602 11.1667 6.93329V9.06663Z" />
      <path d="M8.90004 5.33329C9.04732 5.33329 9.16671 5.2139 9.16671 5.06663V2.93329C9.16671 2.78602 9.04732 2.66663 8.90004 2.66663H4.76671C4.61943 2.66663 4.50004 2.78602 4.50004 2.93329V5.06663C4.50004 5.2139 4.61943 5.33329 4.76671 5.33329H8.90004Z" />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 12 12" width="12" height="12">
      <path d="M6.9 0.66687C7.04728 0.66687 7.16667 0.786256 7.16667 0.933525V6.66662H10.2333C10.3806 6.66662 10.5 6.78601 10.5 6.93328V9.06652C10.5 9.21379 10.3806 9.33318 10.2333 9.33318H7.16667V11.0664C7.16667 11.2137 7.04728 11.3331 6.9 11.3331H6.43333C6.28606 11.3331 6.16667 11.2137 6.16667 11.0664V9.33318H2.76667C2.61939 9.33318 2.5 9.21379 2.5 9.06652V6.93328C2.5 6.78601 2.61939 6.66662 2.76667 6.66662H6.16667V0.933526C6.16667 0.786256 6.28606 0.66687 6.43333 0.66687H6.9Z" />
      <path d="M3.83333 2.93344C3.83333 2.78617 3.95272 2.66679 4.1 2.66679H8.9C9.04728 2.66679 9.16667 2.78617 9.16667 2.93344V5.06669C9.16667 5.21396 9.04728 5.33334 8.9 5.33334H4.1C3.95272 5.33334 3.83333 5.21396 3.83333 5.06669V2.93344Z" />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 12 12" width="12" height="12">
      <path d="M11.1667 0.933292C11.1667 0.786016 11.0473 0.666626 10.9 0.666626H10.4334C10.2861 0.666626 10.1667 0.786017 10.1667 0.933293V11.0666C10.1667 11.2139 10.2861 11.3333 10.4334 11.3333H10.9C11.0473 11.3333 11.1667 11.2139 11.1667 11.0666V0.933292Z" />
      <path d="M8.50004 9.06663C8.50004 9.2139 8.38065 9.33329 8.23337 9.33329H2.10004C1.95276 9.33329 1.83337 9.2139 1.83337 9.06663V6.93329C1.83337 6.78602 1.95276 6.66663 2.10004 6.66663H8.23337C8.38065 6.66663 8.50004 6.78602 8.50004 6.93329V9.06663Z" />
      <path d="M8.23337 5.33329C8.38065 5.33329 8.50004 5.2139 8.50004 5.06663V2.93329C8.50004 2.78602 8.38065 2.66663 8.23337 2.66663H4.10004C3.95276 2.66663 3.83337 2.78602 3.83337 2.93329V5.06663C3.83337 5.2139 3.95276 5.33329 4.10004 5.33329H8.23337Z" />
    </svg>
  );
}

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书选择组，卡片搭建器 ChoiceSetter 的公开实现。28px 高灰色轨道，4px 内边距、2px 间距；" +
          "选项 20px 高、4px 圆角、12px 字号。选中项使用画布色（浅色 #fff / 深色 #1a1a1a）与标题色。\n\n" +
          "单选：组内只有一个 Tab 停靠点，方向键移动焦点，Space / Enter 选中。纯图标项必须提供 `aria-label`；" +
          "需要悬浮提示时用 `Tooltip` 包裹选项。",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    value: { control: false },
    defaultValue: { control: false },
  },
  args: { "aria-label": "对齐方式", disabled: false },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {
  render: (args) => (
    <SegmentedControl {...args} defaultValue="left">
      <SegmentedControlItem value="left" aria-label="左对齐">
        <AlignLeftIcon />
      </SegmentedControlItem>
      <SegmentedControlItem value="center" aria-label="居中">
        <AlignCenterIcon />
      </SegmentedControlItem>
      <SegmentedControlItem value="right" aria-label="右对齐">
        <AlignRightIcon />
      </SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const TextOptions: Story = {
  render: (args) => (
    <SegmentedControl {...args} aria-label="统计周期" defaultValue="day">
      <SegmentedControlItem value="day">日</SegmentedControlItem>
      <SegmentedControlItem value="week">周</SegmentedControlItem>
      <SegmentedControlItem value="month">月</SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl aria-label="对齐方式（整组禁用）" defaultValue="left" disabled>
        <SegmentedControlItem value="left" aria-label="左对齐">
          <AlignLeftIcon />
        </SegmentedControlItem>
        <SegmentedControlItem value="center" aria-label="居中">
          <AlignCenterIcon />
        </SegmentedControlItem>
        <SegmentedControlItem value="right" aria-label="右对齐">
          <AlignRightIcon />
        </SegmentedControlItem>
      </SegmentedControl>

      <SegmentedControl aria-label="对齐方式（单项禁用）" defaultValue="left">
        <SegmentedControlItem value="left" aria-label="左对齐">
          <AlignLeftIcon />
        </SegmentedControlItem>
        <SegmentedControlItem value="center" aria-label="居中" disabled>
          <AlignCenterIcon />
        </SegmentedControlItem>
        <SegmentedControlItem value="right" aria-label="右对齐">
          <AlignRightIcon />
        </SegmentedControlItem>
      </SegmentedControl>
    </div>
  ),
};

export const WithTooltip: Story = {
  render: (args) => (
    <SegmentedControl {...args} defaultValue="left">
      <Tooltip content="左对齐">
        <SegmentedControlItem value="left" aria-label="左对齐">
          <AlignLeftIcon />
        </SegmentedControlItem>
      </Tooltip>
      <Tooltip content="居中">
        <SegmentedControlItem value="center" aria-label="居中">
          <AlignCenterIcon />
        </SegmentedControlItem>
      </Tooltip>
      <Tooltip content="右对齐">
        <SegmentedControlItem value="right" aria-label="右对齐">
          <AlignRightIcon />
        </SegmentedControlItem>
      </Tooltip>
    </SegmentedControl>
  ),
};

const alignLabels: Record<string, string> = {
  left: "左对齐",
  center: "居中",
  right: "右对齐",
};

function ControlledExample() {
  const [align, setAlign] = useState("left");

  return (
    <div className="flex flex-col items-start gap-3">
      <SegmentedControl aria-label="对齐方式" value={align} onValueChange={setAlign}>
        <SegmentedControlItem value="left" aria-label="左对齐">
          <AlignLeftIcon />
        </SegmentedControlItem>
        <SegmentedControlItem value="center" aria-label="居中">
          <AlignCenterIcon />
        </SegmentedControlItem>
        <SegmentedControlItem value="right" aria-label="右对齐">
          <AlignRightIcon />
        </SegmentedControlItem>
      </SegmentedControl>
      <span className="text-lark-12 text-lark-caption">当前对齐：{alignLabels[align]}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
