import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";
import { SearchIcon } from "../../icons";
import { Input, type InputProps } from "./Input";

/** Any icon can be the scrub handle; this six-dot grip is just an example. */
function GripIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      {[4.5, 8, 11.5].map((y) => (
        <g key={y}>
          <circle cx="6" cy={y} r="1" />
          <circle cx="10" cy={y} r="1" />
        </g>
      ))}
    </svg>
  );
}

const meta: Meta<InputProps> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书输入框。高度 28 / 32 / 40px，圆角 6px，图标距边框 12px、图标与文字间距 8px。\n\n" +
          "状态：默认、悬停、聚焦、错误、禁用、只读。\n\n" +
          "数字输入框：设置 `numeric` 后值为 `number | null`，左侧图标成为拖拽手柄，" +
          "按住鼠标左右拖动即可调值（Shift 大步、Alt 精细步），点击手柄会聚焦并全选输入框。" +
          "键盘方向键、直接输入同样可用。\n\n" +
          "手柄图标通过 `dragIcon` 换成任意图标（`startIcon` 仍可作为兼容入口），默认是左右箭头。",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    allowClear: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    numeric: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    pixelsPerStep: { control: "number" },
    dragIcon: { control: false },
    startIcon: { control: false },
  },
  args: {
    size: "md",
    placeholder: "请输入内容",
    "aria-label": "示例输入框",
  },
  decorators: [
    (Story: () => ReactNode) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
// `typeof meta` collapses the `InputProps` union to `never` in Storybook's
// ArgsFromMeta inference, so give StoryObj the props type directly.
type Story = StoryObj<InputProps>;

export const Basic: Story = {};

export const WithIcon: Story = {
  args: {
    startIcon: <SearchIcon />,
    placeholder: "搜索",
    "aria-label": "搜索",
  },
};

export const WithClear: Story = {
  args: {
    defaultValue: "可清除的文本",
    allowClear: true,
    "aria-label": "可清除输入框",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "格式错误",
    "aria-label": "错误输入框",
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "不可编辑", "aria-label": "禁用输入框" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "只读内容", "aria-label": "只读输入框" },
};

export const Password: Story = {
  args: { type: "password", defaultValue: "larkui", "aria-label": "密码" },
};

export const Sizes: Story = {
  render: (args: InputProps) => (
    <div className="flex flex-col gap-3">
      <Input {...args} aria-label="小尺寸" size="sm" placeholder="Small · 28px" />
      <Input {...args} aria-label="中尺寸" size="md" placeholder="Medium · 32px" />
      <Input {...args} aria-label="大尺寸" size="lg" placeholder="Large · 40px" />
    </div>
  ),
};

export const Numeric: Story = {
  args: {
    numeric: true,
    defaultValue: 14,
    min: 12,
    max: 72,
    allowClear: true,
    dragLabel: "拖动调整字号",
    "aria-label": "字号",
  },
};

export const NumericCustomIcon: Story = {
  args: {
    numeric: true,
    defaultValue: 14,
    min: 12,
    max: 72,
    dragIcon: <GripIcon />,
    dragLabel: "拖动调整字号",
    "aria-label": "字号",
  },
};

export const NumericSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Input numeric aria-label="小尺寸数字" size="sm" defaultValue={14} min={0} max={99} />
      <Input numeric aria-label="中尺寸数字" size="md" defaultValue={32} min={0} max={99} />
      <Input numeric aria-label="大尺寸数字" size="lg" defaultValue={240} min={0} max={999} />
    </div>
  ),
};

function ControlledNumberExample() {
  const [value, setValue] = useState<number | null>(16);
  return (
    <div className="flex flex-col gap-2">
      <Input
        numeric
        aria-label="圆角"
        value={value}
        min={0}
        max={99}
        onValueChange={setValue}
        allowClear
        dragLabel="拖动调整圆角"
      />
      <span className="text-lark-12 text-lark-caption">当前值：{value ?? "空"}</span>
    </div>
  );
}

export const NumericControlled: Story = {
  render: () => <ControlledNumberExample />,
};

export const NumericDisabled: Story = {
  args: {
    numeric: true,
    disabled: true,
    defaultValue: 24,
    min: 0,
    max: 99,
    allowClear: true,
    "aria-label": "禁用数字输入框",
  },
};

export const NumericReadOnly: Story = {
  args: {
    numeric: true,
    readOnly: true,
    defaultValue: 24,
    min: 0,
    max: 99,
    "aria-label": "只读数字输入框",
  },
};
