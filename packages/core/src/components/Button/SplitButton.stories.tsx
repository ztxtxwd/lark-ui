import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon, SearchIcon } from "../../icons";
import { SplitButton, type SplitButtonItem } from "./SplitButton";

const items: SplitButtonItem[] = [
  { value: "copy", label: "复制" },
  { value: "share", label: "分享", icon: <SearchIcon /> },
  { value: "export", label: "导出" },
  { value: "delete", label: "删除", danger: true },
];

const meta = {
  title: "Components/Button/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "UD 分裂按钮 / 菜单按钮。\n\n" +
          "- **分裂按钮（split）**：主操作与次级操作分成两个热区，中间是通栏分割线。\n" +
          "- **菜单按钮（menu）**：没有分割线，整个按钮点击后打开菜单。\n\n" +
          "两者都用点击触发下拉菜单，而不是 hover；菜单展开时按钮保持交互态。",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["split", "menu"] },
    appearance: { control: "select", options: ["filled", "outlined"] },
    tone: { control: "select", options: ["primary", "neutral", "danger", "success"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    block: { control: "boolean" },
  },
  args: {
    children: "新建",
    items,
    variant: "split",
    appearance: "filled",
    tone: "primary",
    size: "md",
    startIcon: <PlusIcon />,
    menuLabel: "更多操作",
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Split: Story = {};

export const Outlined: Story = {
  args: { appearance: "outlined" },
};

export const MenuButton: Story = {
  name: "Menu button",
  args: {
    variant: "menu",
    children: "操作",
    startIcon: undefined,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <SplitButton key={size} {...args} size={size}>
          {size.toUpperCase()}
        </SplitButton>
      ))}
    </div>
  ),
};

export const Danger: Story = {
  args: {
    tone: "danger",
    children: "删除",
    startIcon: undefined,
    items: [
      { value: "delete", label: "删除文档", danger: true },
      { value: "trash", label: "移到回收站" },
    ],
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledWithReason: Story = {
  name: "Disabled with tooltip",
  args: {
    disabled: true,
    tooltip: "当前空间没有创建权限",
  },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Block: Story = {
  render: (args) => (
    <div className="w-80">
      <SplitButton {...args} block />
    </div>
  ),
};
