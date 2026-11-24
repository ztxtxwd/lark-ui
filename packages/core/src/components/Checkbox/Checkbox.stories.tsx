import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书复选框。固定 16 × 16px、4px 圆角，与标签间距 8px，整行热区最小高度 22px。\n\n" +
          "状态：未选中、已选中、部分选中、禁用。",
      },
    },
  },
  argTypes: {
    checked: { control: "select", options: [false, true, "indeterminate"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: { children: "选项内容" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true, children: "已选中" },
};

export const Indeterminate: Story = {
  // Uncontrolled so the demo follows the documented indeterminate → checked → unchecked cycle.
  args: { defaultChecked: "indeterminate", children: "部分选中" },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox disabled>未选中的禁用项</Checkbox>
      <Checkbox disabled defaultChecked>
        已选中的禁用项
      </Checkbox>
      <Checkbox disabled checked="indeterminate">
        部分选中的禁用项
      </Checkbox>
    </div>
  ),
};

export const WithDescription: Story = {
  args: {
    children: "订阅每周摘要",
    description: "每周一上午 9:00 发送到你的邮箱",
  },
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox defaultChecked>设计</Checkbox>
      <Checkbox>研发</Checkbox>
      <Checkbox defaultChecked>产品</Checkbox>
    </div>
  ),
};
