import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./Stepper";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "步进器。用于小范围、精确的整数增减。\n\n" +
          "- 高度 28 / 32 / 40px，圆角 6px，默认宽度 160px\n" +
          "- 两侧增减按钮宽 40px，图标 16 × 16\n" +
          "- 数值到达最小值 / 最大值时，对应的减数 / 增数按钮禁用\n" +
          "- 输入超出范围时在提交后收敛到边界；清空并离开时回到最小值\n" +
          "- 使用 @ui-sdk/react/number-input：支持长按连续增减、方向键、Home / End",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    precision: { control: "number" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
  args: {
    label: "数量",
    defaultValue: 2,
    min: 0,
    max: 99,
    step: 1,
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Stepper {...args} size="sm" label="小尺寸" />
      <Stepper {...args} size="md" label="中尺寸" />
      <Stepper {...args} size="lg" label="大尺寸" />
    </div>
  ),
};

export const WithBounds: Story = {
  args: {
    label: "打印份数",
    defaultValue: 1,
    min: 1,
    max: 9,
  },
  parameters: {
    docs: {
      description: {
        story: "范围为 1–9：初始停在最小值，减数按钮禁用；到达最大值后增数按钮禁用。",
      },
    },
  },
};

export const Precision: Story = {
  args: {
    label: "时长",
    defaultValue: 1.5,
    min: 0,
    max: 8,
    step: 0.5,
    precision: 1,
  },
};

export const Disabled: Story = {
  args: {
    label: "数量",
    defaultValue: 3,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: "数量",
    defaultValue: 3,
    readOnly: true,
  },
};

export const HiddenLabel: Story = {
  args: {
    label: "数量",
    hideLabel: true,
    defaultValue: 2,
  },
};
