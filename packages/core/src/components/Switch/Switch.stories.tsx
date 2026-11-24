import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书开关。大尺寸 40 × 22px，小尺寸 28 × 16px，滑块内缩 2px。\n\n" +
          "状态：开启、关闭、加载中、禁用。开关标签在两种状态下保持不变。",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
  args: { children: "接收新消息通知", size: "md" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};

export const On: Story = {
  args: { defaultChecked: true, children: "接收新消息通知" },
};

export const Small: Story = {
  args: { size: "sm", defaultChecked: true, children: "小尺寸" },
};

export const Loading: Story = {
  args: { loading: true, defaultChecked: true, children: "开启 · 同步中" },
};

export const LoadingOff: Story = {
  args: { loading: true, children: "关闭 · 同步中" },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch disabled>关闭且禁用</Switch>
      <Switch disabled defaultChecked>
        开启且禁用
      </Switch>
    </div>
  ),
};
