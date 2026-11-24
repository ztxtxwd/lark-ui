import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimePicker } from "./TimePicker";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书时间选择器。触发器遵循 Input 规范：高度 28 / 32 / 40px，圆角 6px；" +
          "点击输入框或时钟按钮都会展开时、分（可选秒、上午/下午）列，" +
          "面板与输入框左对齐，圆角 8px，选中项使用主题色文字，悬停项使用 UD 填充色。\n\n" +
          "支持键入时间与面板选择两种输入方式。24 小时制格式为 HH:mm / HH:mm:ss，" +
          "12 小时制通过格式中的 hh/mm A 启用。`hourStep` / `minuteStep` / " +
          "`secondStep` 控制选项步长，`minTime` / `maxTime` / `disabledTime` 置灰不可选时间。",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    allowClear: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    hourStep: { control: "number" },
    minuteStep: { control: "number" },
    secondStep: { control: "number" },
  },
  args: {
    label: "时间",
    size: "md",
    allowClear: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "09:30" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <TimePicker {...args} label="小尺寸" size="sm" />
      <TimePicker {...args} label="中尺寸" size="md" />
      <TimePicker {...args} label="大尺寸" size="lg" />
    </div>
  ),
};

export const TwelveHour: Story = {
  args: { format: "hh:mm A", defaultValue: "14:30" },
};

export const WithSeconds: Story = {
  args: { format: "HH:mm:ss", defaultValue: "09:30:15" },
};

export const Steps: Story = {
  args: { hourStep: 2, minuteStep: 15, secondStep: 30, format: "HH:mm:ss" },
};

export const MinMax: Story = {
  args: {
    defaultValue: "10:00",
    minTime: "09:00",
    maxTime: "11:30",
  },
};

export const DisabledTimes: Story = {
  args: {
    label: "预约时间",
    disabledTime: (time: { hour: number }) => time.hour >= 12 && time.hour < 14,
  },
};

export const Open: Story = {
  args: { defaultValue: "09:30", defaultOpen: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "09:30" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "09:30" },
};
