import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书日期选择器。触发器遵循 Input 规范：高度 28 / 32 / 40px，圆角 6px；" +
          "日历面板圆角 8px，阴影使用 UD 的浮层阴影。\n\n" +
          "点击输入框或日历图标都会展开面板，打开后可用方向键在日历中移动。" +
          "单日期与范围两种模式。今日日期以主题色标记，选中日期为实心主题色，" +
          "范围中间日期使用浅蓝色填充，不可选日期置灰且仍可被键盘聚焦。\n\n" +
          "底栏可放置「今天」和「清除」快捷操作。支持受控 `open`、" +
          "`disabledDate`、`min` / `max` 以及 `valueFormat` / `format`。",
      },
    },
  },
  argTypes: {
    mode: { control: "radio", options: ["single", "range"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    allowClear: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    footer: { control: "boolean" },
  },
  args: {
    label: "日期",
    placeholder: "请选择日期",
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
  args: { defaultValue: "2026-10-16" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <DatePicker {...args} label="小尺寸" size="sm" />
      <DatePicker {...args} label="中尺寸" size="md" />
      <DatePicker {...args} label="大尺寸" size="lg" />
    </div>
  ),
};

export const Range: Story = {
  args: {
    mode: "range",
    label: "入住日期",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    defaultValue: ["2026-10-12", "2026-10-16"],
  },
};

export const MinMax: Story = {
  args: {
    defaultValue: "2026-10-16",
    min: "2026-10-10",
    max: "2026-10-24",
  },
};

export const DisabledDates: Story = {
  args: {
    defaultValue: "2026-10-16",
    disabledDate: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

export const WithFooter: Story = {
  args: { footer: true },
};

export const CustomFormat: Story = {
  args: {
    label: "交付日期",
    format: "YYYY.MM.DD",
    valueFormat: "YYYY/MM/DD",
    defaultValue: "2026/10/16",
  },
};

export const Open: Story = {
  args: { defaultValue: "2026-10-16", defaultOpen: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "2026-10-16" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "2026-10-16" },
};
