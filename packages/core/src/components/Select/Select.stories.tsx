import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const roles = [
  { value: "owner", label: "所有者" },
  { value: "admin", label: "管理员" },
  { value: "member", label: "成员" },
  { value: "guest", label: "访客", disabled: true },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书选择器。选择框遵循 Input 规范：高度 28 / 32 / 40px，圆角 6px，" +
          "最小宽度 240px。下拉列表圆角 8px，最大宽度 420px、最大高度 246px，" +
          "选项圆角 4px、内边距 4px 8px。",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    allowClear: { control: "boolean" },
    multiple: { control: "boolean" },
    searchable: { control: "boolean" },
  },
  args: {
    label: "角色",
    options: roles,
    placeholder: "请选择角色",
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
  args: { defaultValue: "admin" },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "admin" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "admin" },
};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["owner", "member"] },
};

export const Searchable: Story = {
  args: { searchable: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <Select {...args} label="小尺寸" size="sm" />
      <Select {...args} label="中尺寸" size="md" />
      <Select {...args} label="大尺寸" size="lg" />
    </div>
  ),
};

export const WithDescription: Story = {
  args: {
    options: [
      { value: "owner", label: "所有者", description: "拥有全部权限" },
      { value: "admin", label: "管理员", description: "可管理成员与内容" },
      { value: "member", label: "成员", description: "可查看与编辑内容" },
    ],
  },
};
