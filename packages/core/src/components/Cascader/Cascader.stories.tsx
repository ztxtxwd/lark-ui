import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cascader, type CascaderOption } from "./Cascader";

const regions: CascaderOption[] = [
  {
    value: "zhejiang",
    label: "浙江",
    children: [
      {
        value: "hangzhou",
        label: "杭州",
        children: [
          { value: "xihu", label: "西湖区" },
          { value: "binjiang", label: "滨江区" },
          { value: "yuhang", label: "余杭区" },
        ],
      },
      {
        value: "ningbo",
        label: "宁波",
        children: [
          { value: "haishu", label: "海曙区" },
          { value: "yinzhou", label: "鄞州区" },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "江苏",
    children: [
      {
        value: "nanjing",
        label: "南京",
        children: [
          { value: "xuanwu", label: "玄武区" },
          { value: "gulou", label: "鼓楼区" },
        ],
      },
      {
        value: "suzhou",
        label: "苏州",
        children: [
          { value: "gusu", label: "姑苏区" },
          { value: "wuzhong", label: "吴中区" },
        ],
      },
    ],
  },
  {
    value: "guangdong",
    label: "广东",
    children: [
      {
        value: "shenzhen",
        label: "深圳",
        children: [{ value: "nanshan", label: "南山区" }],
      },
    ],
  },
];

const meta: Meta<typeof Cascader> = {
  title: "Components/Cascader",
  component: Cascader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书级联选择。单选逐级展开：父级点击展开下一列，子级点击后收起并回显全路径。" +
          "每列宽 160px，面板总宽最大 720px，选项内边距 4px 8px、圆角 4px、行高 22px；" +
          "触发框与下拉选择对齐：高度 28 / 32 / 40px，圆角 6px。",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    expandTrigger: { control: "select", options: ["click", "hover"] },
    changeOnSelect: { control: "boolean" },
    showSearch: { control: "boolean" },
    allowClear: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
  args: {
    label: "所在地区",
    options: regions,
    placeholder: "请选择地区",
    size: "md",
    expandTrigger: "click",
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
  args: { defaultValue: ["zhejiang", "hangzhou", "xihu"] },
};

export const Searchable: Story = {
  args: { showSearch: true },
};

export const ChangeOnSelect: Story = {
  args: { changeOnSelect: true, expandTrigger: "hover" },
};

export const HoverExpand: Story = {
  args: { expandTrigger: "hover" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ["jiangsu", "nanjing", "xuanwu"] },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: ["guangdong", "shenzhen", "nanshan"] },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <Cascader {...args} label="小尺寸" size="sm" />
      <Cascader {...args} label="中尺寸" size="md" />
      <Cascader {...args} label="大尺寸" size="lg" />
    </div>
  ),
};

export const ReadOnlyAndDisabledMatrix: Story = {
  name: "States",
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <Cascader {...args} label="默认" />
      <Cascader {...args} label="已选择" defaultValue={["zhejiang", "hangzhou", "xihu"]} />
      <Cascader {...args} label="只读" readOnly defaultValue={["jiangsu", "nanjing", "gulou"]} />
      <Cascader {...args} label="禁用" disabled defaultValue={["jiangsu", "nanjing", "gulou"]} />
    </div>
  ),
};
