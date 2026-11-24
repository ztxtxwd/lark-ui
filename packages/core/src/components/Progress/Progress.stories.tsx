import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress, type ProgressStatus } from "./Progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书进度条。用于展示可确定或不可确定的操作进度：\n\n" +
          "- 轨道高度：小 2px / 默认 4px / 大 8px（UD 默认 4px，圆角 2px）\n" +
          "- 状态：正常、成功、警告、失败；进度值与轨道间距 12px\n" +
          "- 可确定进度填充 0–100%，不可确定进度沿固定轨道往复移动\n" +
          "- 行为与无障碍由 `@ui-sdk/react/progress` 提供（progressbar / aria-valuenow / aria-valuetext）",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    status: { control: "select", options: ["normal", "success", "warning", "danger"] },
    showInfo: { control: "boolean" },
    indeterminate: { control: "boolean" },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    max: { control: "number" },
  },
  args: {
    value: 40,
    max: 100,
    size: "md",
    status: "normal",
    showInfo: true,
    indeterminate: false,
    "aria-label": "进度",
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { children: "上传文件" },
};

export const WithoutInfo: Story = {
  args: { showInfo: false },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, value: undefined, showInfo: false, children: "正在连接服务器" },
};

export const CustomFormat: Story = {
  args: {
    value: 3,
    max: 12,
    format: (value: number) => `${value} / 12 个文件`,
  },
};

export const Complete: Story = {
  args: { value: 100, status: "success" },
};

export const Statuses: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-5">
      {(["normal", "success", "warning", "danger"] as const).map((status: ProgressStatus) => (
        <Progress
          key={status}
          {...args}
          value={status === "normal" ? 40 : 72}
          status={status}
          aria-label={`状态：${status}`}
        />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-5">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Progress key={size} {...args} size={size} value={65} aria-label={`尺寸：${size}`} />
      ))}
    </div>
  ),
};

export const IndeterminateSizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-5">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Progress
          key={size}
          {...args}
          size={size}
          indeterminate
          value={undefined}
          showInfo={false}
          aria-label={`不可确定进度：${size}`}
        />
      ))}
    </div>
  ),
};
