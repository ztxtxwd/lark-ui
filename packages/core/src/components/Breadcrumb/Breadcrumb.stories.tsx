import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./Breadcrumb";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "面包屑。显示当前页面在系统层级结构中的位置，并能向上返回。\n\n" +
          "- 单个层级文本 14/22px，左右间距 4px，圆角 6px，最大宽度 162px\n" +
          "- 层级间距 4px，分割符图标 16 × 16px\n" +
          '- 当前层级使用 `aria-current="page"`；祖先层级为链接\n' +
          "- 超出 `maxItems` 时保留首尾层级，中间折叠为省略号，悬停显示被折叠路径",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    maxItems: { control: "number" },
    separator: { control: "text" },
  },
  args: {
    label: "面包屑",
    items: [{ label: "首页", href: "#" }, { label: "项目", href: "#" }, { label: "文档详情" }],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomSeparator: Story = {
  args: { separator: "/" },
};

export const Collapsed: Story = {
  args: {
    maxItems: 4,
    items: [
      { label: "首页", href: "#" },
      { label: "工作台", href: "#" },
      { label: "项目", href: "#" },
      { label: "产品设计", href: "#" },
      { label: "文档", href: "#" },
      { label: "文件夹", href: "#" },
      { label: "需求文档" },
    ],
  },
};

export const LongLabels: Story = {
  args: {
    items: [
      { label: "首页", href: "#" },
      { label: "这是一个超过一百六十二像素后会被省略的层级名称", href: "#" },
      { label: "当前页面" },
    ],
  },
};

export const Composition: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">首页</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">项目</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>文档详情</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
