import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeSelect, type TreeSelectNode } from "./TreeSelect";

const departments: TreeSelectNode[] = [
  {
    value: "rd",
    title: "产品研发中心",
    children: [
      {
        value: "design",
        title: "设计部",
        children: [
          { value: "ui", title: "UI 设计组" },
          { value: "ux", title: "UX 设计组" },
          { value: "brand", title: "品牌设计组" },
        ],
      },
      {
        value: "frontend",
        title: "前端开发部",
        children: [
          { value: "web", title: "Web 组" },
          { value: "app", title: "App 组" },
        ],
      },
      {
        value: "backend",
        title: "后端开发部",
        children: [
          { value: "service", title: "服务端组" },
          { value: "data", title: "数据组", checkable: false },
        ],
      },
    ],
  },
  {
    value: "sales",
    title: "销售中心",
    children: [
      { value: "east", title: "华东销售部" },
      { value: "south", title: "华南销售部" },
    ],
  },
  { value: "admin", title: "行政部", disabled: true },
  { value: "legal", title: "法务部" },
];

const meta: Meta<typeof TreeSelect> = {
  title: "Components/TreeSelect",
  component: TreeSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书树选择。选择框遵循 Input / Select 规范：高度 28 / 32 / 40px，圆角 6px，" +
          "多选时自动增高至 188px。下拉树行高 30px（4px 8px 内边距、圆角 4px、14/22 字体），" +
          "每级缩进 16px，面板最大高度 256px、最大宽度 420px。",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    multiple: { control: "boolean" },
    treeCheckable: { control: "boolean" },
    treeDefaultExpandAll: { control: "boolean" },
    showSearch: { control: "boolean" },
    allowClear: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: {
    label: "所属部门",
    treeData: departments,
    placeholder: "请选择部门",
    size: "md",
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
  args: { defaultValue: "ui", treeDefaultExpandAll: true },
};

export const Searchable: Story = {
  args: { showSearch: true },
};

export const Multiple: Story = {
  args: { multiple: true, treeDefaultExpandAll: true, defaultValue: ["ui", "web"] },
};

export const Checkable: Story = {
  args: {
    treeCheckable: true,
    treeDefaultExpandAll: true,
    defaultValue: ["design", "web"],
  },
};

export const SearchableCheckable: Story = {
  args: { showSearch: true, treeCheckable: true, treeDefaultExpandAll: true },
};

export const DefaultExpandAll: Story = {
  args: { treeDefaultExpandAll: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "design", treeDefaultExpandAll: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "ui", treeDefaultExpandAll: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <TreeSelect {...args} label="小尺寸" size="sm" />
      <TreeSelect {...args} label="中尺寸" size="md" />
      <TreeSelect {...args} label="大尺寸" size="lg" />
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All Variants",
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <TreeSelect {...args} label="单选" defaultValue="ui" treeDefaultExpandAll />
      <TreeSelect
        {...args}
        label="多选"
        multiple
        defaultValue={["ui", "web"]}
        treeDefaultExpandAll
      />
      <TreeSelect
        {...args}
        label="勾选型"
        treeCheckable
        defaultValue={["design", "web"]}
        treeDefaultExpandAll
      />
      <TreeSelect {...args} label="禁用" disabled defaultValue="design" />
    </div>
  ),
};
