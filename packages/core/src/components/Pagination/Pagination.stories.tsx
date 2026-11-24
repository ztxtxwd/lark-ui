import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "分页。用于将内容分为多个页面，可快速定位或者切换页码浏览内容。\n\n" +
          "- 普通分页：翻页与数字页码 28 × 28px，圆角 6px，页码内左右间距 4px\n" +
          "- 小型分页：24 × 24px，页码内左右间距 2px，页码间距 4px\n" +
          "- 上一页 / 下一页使用 16px 图标，并提供「上一页」「下一页」可访问名称\n" +
          '- 当前页 `aria-current="page"`；首/末页时对应翻页按钮为 `aria-disabled`\n' +
          "- 页码过多时折叠为省略号，首尾页始终保留",
      },
    },
  },
  argTypes: {
    total: { control: "number" },
    pageSize: { control: "number" },
    current: { control: "number" },
    defaultCurrent: { control: "number" },
    siblingCount: { control: "number" },
    simple: { control: "boolean" },
    disabled: { control: "boolean" },
    size: { control: "select", options: ["default", "small"] },
  },
  args: {
    total: 95,
    pageSize: 10,
    defaultCurrent: 1,
    size: "default",
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTotal: Story = {
  args: {
    showTotal: (total, range) => `共 ${total} 条，当前 ${range[0]}-${range[1]} 条`,
  },
};

export const ManyPages: Story = {
  args: {
    total: 500,
    pageSize: 10,
    defaultCurrent: 12,
  },
};

export const Small: Story = {
  args: {
    size: "small",
    total: 500,
    pageSize: 10,
    defaultCurrent: 12,
  },
};

export const Simple: Story = {
  args: {
    simple: true,
    total: 50,
    pageSize: 10,
    defaultCurrent: 2,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultCurrent: 2,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Pagination {...args} size="default" />
      <Pagination {...args} size="small" />
    </div>
  ),
};

function ControlledExample() {
  const [page, setPage] = useState(3);
  return (
    <Pagination
      total={95}
      pageSize={10}
      current={page}
      onPageChange={(next) => setPage(next)}
      showTotal={(total, range) => `共 ${total} 条，当前 ${range[0]}-${range[1]} 条`}
    />
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
