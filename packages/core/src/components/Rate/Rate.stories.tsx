import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Rate } from "./Rate";

const HINTS = ["很差", "较差", "一般", "满意", "非常满意"];

const meta = {
  title: "Components/Rate",
  component: Rate,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书评分。用于展示评分或收集用户评分，尺寸与 UD（Universe Design）规范一致：\n\n" +
          "- 星星容器 32 × 32px，间隔 16px\n" +
          "- 星星图标 28 × 28px，悬停放大至 32 × 32px\n" +
          "- 色彩：未选中 N300，悬停/选中 Y500\n" +
          "- 步长：1（默认）或 0.5；可配置即时提示文案\n" +
          "- 状态：默认、悬停、选中、只读、禁用",
      },
    },
  },
  argTypes: {
    count: { control: { type: "number", min: 1, max: 10 } },
    allowHalf: { control: "boolean" },
    allowClear: { control: "boolean" },
    readOnly: { control: "boolean" },
    disabled: { control: "boolean" },
    tooltips: { control: "object" },
  },
  args: {
    count: 5,
    allowHalf: false,
    allowClear: false,
    readOnly: false,
    disabled: false,
  },
} satisfies Meta<typeof Rate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { defaultValue: 3 },
};

export const HalfStep: Story = {
  args: { allowHalf: true, defaultValue: 3.5 },
};

export const Clearable: Story = {
  args: { allowClear: true, defaultValue: 4 },
};

export const WithHints: Story = {
  args: { defaultValue: 3, tooltips: HINTS },
};

export const HalfStepHints: Story = {
  args: { allowHalf: true, defaultValue: 2.5, tooltips: HINTS },
};

export const ReadOnly: Story = {
  args: { readOnly: true, value: 4.2 },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3 },
};

export const CustomCharacter: Story = {
  args: {
    defaultValue: 3,
    character: <HeartGlyph className="size-7" />,
  },
};

function HeartGlyph({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 13.4 2.9 8.6a3.1 3.1 0 0 1 0-4.5 3.35 3.35 0 0 1 4.65 0L8 4.55l.45-.45a3.35 3.35 0 0 1 4.65 0 3.1 3.1 0 0 1 0 4.5L8 13.4Z" />
    </svg>
  );
}

function ControlledDemo() {
  const [value, setValue] = useState<number | null>(3);
  return (
    <div className="flex flex-col gap-2">
      <Rate value={value} onValueChange={(next) => setValue(next)} tooltips={HINTS} />
      <span className="text-lark-12 text-lark-caption">当前评分：{value ?? "未评分"}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-lark-12 text-lark-caption">Basic · 3 / 5</span>
        <Rate {...args} aria-label="基础评分" defaultValue={3} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-lark-12 text-lark-caption">Half step · 3.5 / 5</span>
        <Rate {...args} aria-label="半星评分" allowHalf defaultValue={3.5} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-lark-12 text-lark-caption">Read only · 4.2 / 5</span>
        <Rate {...args} readOnly value={4.2} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-lark-12 text-lark-caption">Disabled · 3 / 5</span>
        <Rate {...args} aria-label="禁用评分" disabled defaultValue={3} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-lark-12 text-lark-caption">Instant hints</span>
        <Rate {...args} aria-label="提示评分" defaultValue={3} tooltips={HINTS} />
      </div>
    </div>
  ),
};
