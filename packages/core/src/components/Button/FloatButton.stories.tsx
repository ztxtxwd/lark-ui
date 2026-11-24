import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontalIcon, PlusIcon, SearchIcon } from "../../icons";
import { FloatButton } from "./FloatButton";

const meta = {
  title: "Components/Button/FloatButton",
  component: FloatButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "UD 悬浮按钮（Button_Float）：固定在页面某处，高程高于内容并带阴影。\n\n" +
          "- 主要悬浮：蓝底白图标，用于最重要的新建类操作\n" +
          "- 次要悬浮：浮层底色 + 图标色，用于回到顶部、帮助等次级入口\n" +
          "- 尺寸：36 / 40 / 48px；图标按钮必须提供 `aria-label` 或 Tooltip\n" +
          "- 菜单模式：点击展开一组同类操作，菜单向上打开",
      },
    },
  },
  argTypes: {
    tone: { control: "select", options: ["primary", "neutral"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    shape: { control: "select", options: ["circle", "round"] },
    fixed: { control: "boolean" },
    position: {
      control: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    tone: "primary",
    size: "md",
    shape: "circle",
  },
} satisfies Meta<typeof FloatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    "aria-label": "新建",
    tooltip: "新建文档",
    children: <PlusIcon />,
  },
};

export const Secondary: Story = {
  args: {
    tone: "neutral",
    "aria-label": "更多操作",
    tooltip: "更多操作",
    children: <MoreHorizontalIcon />,
  },
};

export const Text: Story = {
  args: {
    shape: "round",
    "aria-label": "免费试用",
    children: "免费试用",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <FloatButton key={size} {...args} size={size} aria-label={`${size} 新建`}>
          <PlusIcon />
        </FloatButton>
      ))}
    </div>
  ),
  args: { tooltip: false },
};

export const Menu: Story = {
  args: {
    "aria-label": "加入用户群",
    menuLabel: "加入用户群",
    children: <SearchIcon />,
    items: [
      { value: "react", label: "React 用户群" },
      { value: "miniapp", label: "小程序用户群" },
      { value: "android", label: "Android 用户群" },
      { value: "ios", label: "iOS 用户群" },
      { value: "taro", label: "Taro 用户群" },
      { value: "native", label: "PC Native 用户群" },
    ],
  },
};

export const Fixed: Story = {
  args: {
    fixed: true,
    position: "bottom-right",
    "aria-label": "回到顶部",
    tooltip: "回到顶部",
    children: <MoreHorizontalIcon />,
  },
};
