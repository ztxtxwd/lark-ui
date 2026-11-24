import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroup } from "./Radio";

const meta = {
  title: "Components/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书单选框。固定 16 × 16px 圆形，与标签间距 8px，整行热区最小高度 22px。\n\n" +
          "选项建议不超过 6 个，默认竖排、选项间距 8px；横排时间距 24px。",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    disabled: { control: "boolean" },
  },
  args: { "aria-label": "选项组", orientation: "vertical" },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="day">
      <Radio value="day">按天</Radio>
      <Radio value="hour">按小时</Radio>
      <Radio value="half-day">按半天</Radio>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <RadioGroup {...args} defaultValue="list">
      <Radio value="list">列表视图</Radio>
      <Radio value="board">看板视图</Radio>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup aria-label="禁用选项组" disabled defaultValue="a">
      <Radio value="a">已选中且禁用</Radio>
      <Radio value="b">未选中且禁用</Radio>
    </RadioGroup>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <RadioGroup aria-label="通知方式" defaultValue="all">
      <Radio value="all" description="所有消息都会通知">
        全部消息
      </Radio>
      <Radio value="mention" description="只有被 @ 时通知">
        仅提及我的消息
      </Radio>
    </RadioGroup>
  ),
};
