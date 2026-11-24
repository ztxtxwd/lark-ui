import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "滑动输入条。在固定范围内拖动滑块设置数值。\n\n" +
          "- 滑轨 4px、圆角 2px，已滑过部分使用主色，未滑过部分使用分隔线色\n" +
          "- 滑块 16 × 16，1px 描边；悬停、聚焦和拖动时描边变为 2px 主色\n" +
          "- 节点 8 × 8，点击节点或节点文案可直接定位\n" +
          "- 支持单值、双滑块范围、竖向、文字提示与格式化",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    tooltip: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
  args: {
    "aria-label": "音量",
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    orientation: "horizontal",
    tooltip: true,
    marks: undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Range: Story = {
  args: {
    "aria-label": "价格区间",
    defaultValue: [25, 75],
    thumbLabels: ["最低价格", "最高价格"],
  },
};

export const WithMarks: Story = {
  args: {
    "aria-label": "缩放比例",
    defaultValue: 50,
    step: 25,
    marks: { 0: "0%", 25: "25%", 50: "50%", 75: "75%", 100: "100%" },
  },
};

export const Formatted: Story = {
  args: {
    "aria-label": "完成度",
    defaultValue: 40,
    formatValue: (value: number) => `${value}%`,
  },
};

export const Vertical: Story = {
  args: {
    "aria-label": "音量",
    orientation: "vertical",
    defaultValue: 60,
    height: 160,
  },
  decorators: [
    (Story) => (
      <div className="h-48 p-6">
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 40,
    marks: { 0: "0", 50: "50", 100: "100" },
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 40,
  },
};

export const RangeWithMarks: Story = {
  args: {
    "aria-label": "工作时间",
    defaultValue: [9, 18],
    thumbLabels: ["开始时间", "结束时间"],
    marks: { 0: "0:00", 6: "6:00", 12: "12:00", 18: "18:00", 24: "24:00" },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6">
        <Story />
      </div>
    ),
  ],
};
