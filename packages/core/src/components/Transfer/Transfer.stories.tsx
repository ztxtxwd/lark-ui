import type { Meta, StoryObj } from "@storybook/react-vite";
import { Transfer } from "./Transfer";

const dataSource = [
  { key: "design", title: "设计稿", description: "2024 年品牌升级" },
  { key: "docs", title: "需求文档", description: "产品需求说明书" },
  { key: "research", title: "用户研究", description: "访谈与问卷记录" },
  { key: "archive", title: "归档资料（无权限）", disabled: true },
];

const meta = {
  title: "Components/Transfer",
  component: Transfer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书穿梭框。双栏选择：左侧为全部选项，右侧为已选项，通过中间按钮在两栏之间移动。\n\n" +
          "- 标题由 Checkbox 与计数组成，默认「全部选项（已选/全部）」与「已选（数量）」\n" +
          "- 支持搜索、自定义选项内容与单向移动\n" +
          "- UD 建议整体最小 544 × 240px；面板为 240px，中间按钮栏 32px，间距 16px",
      },
    },
  },
  argTypes: {
    showSearch: { control: "boolean" },
    disabled: { control: "boolean" },
    oneWay: { control: "boolean" },
  },
  args: {
    dataSource,
    defaultTargetKeys: ["docs"],
    showSearch: false,
    disabled: false,
    oneWay: false,
  },
} satisfies Meta<typeof Transfer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Search: Story = {
  args: { showSearch: true },
};

export const EmptyTarget: Story = {
  args: { defaultTargetKeys: [] },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const OneWay: Story = {
  args: { oneWay: true, defaultTargetKeys: [] },
};

export const CustomRender: Story = {
  args: {
    render: (item) => (
      <span className="flex items-center gap-2">
        <span className="flex size-4 items-center justify-center rounded-full bg-lark-primary-soft text-[10px] text-lark-primary-content">
          {String(item.title).slice(0, 1)}
        </span>
        <span>{item.title}</span>
      </span>
    ),
  },
};
