import type { Meta, StoryObj } from "@storybook/react-vite";
import { EyeIcon, PlusIcon, SearchIcon } from "../../icons";
import { ToggleButton } from "./ToggleButton";

const meta = {
  title: "Components/Button/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "UD 状态切换按钮（Button_Toggle）。基础、文字、图标按钮都可以切换；\n" +
          "选中态使用设计系统的 Selected 类型：浅色调背景 + 同色描边 + 同色文字。\n\n" +
          "- `defaultPressed` 非受控，`pressed` + `onPressedChange` 受控\n" +
          "- `aria-pressed` 由 ui-sdk Toggle 自动维护\n" +
          "- 选中后悬停/按下在当前选中样式上叠加",
      },
    },
  },
  argTypes: {
    appearance: {
      control: "select",
      options: ["filled", "outlined", "text", "icon"],
    },
    tone: { control: "select", options: ["primary", "neutral", "danger", "success"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["default", "round", "circle"] },
    defaultPressed: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "订阅",
    appearance: "outlined",
    tone: "primary",
    size: "md",
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressed: Story = {
  args: { defaultPressed: true, children: "已订阅" },
};

export const Filled: Story = {
  args: { appearance: "filled", defaultPressed: true, children: "已订阅" },
};

export const Text: Story = {
  args: { appearance: "text", children: "筛选" },
};

export const IconOnly: Story = {
  args: {
    appearance: "icon",
    "aria-label": "关注",
    children: <PlusIcon />,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-20 text-lark-12 text-lark-caption">基础</span>
        <ToggleButton>订阅</ToggleButton>
        <ToggleButton defaultPressed>已订阅</ToggleButton>
        <ToggleButton disabled>订阅</ToggleButton>
        <ToggleButton defaultPressed disabled>
          已订阅
        </ToggleButton>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-20 text-lark-12 text-lark-caption">面性</span>
        <ToggleButton appearance="filled">订阅</ToggleButton>
        <ToggleButton appearance="filled" defaultPressed>
          已订阅
        </ToggleButton>
        <ToggleButton appearance="filled" tone="success">
          加入
        </ToggleButton>
        <ToggleButton appearance="filled" tone="success" defaultPressed>
          已加入
        </ToggleButton>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-20 text-lark-12 text-lark-caption">文字</span>
        <ToggleButton appearance="text">筛选</ToggleButton>
        <ToggleButton appearance="text" defaultPressed>
          已筛选
        </ToggleButton>
        <ToggleButton appearance="text" tone="neutral">
          文本
        </ToggleButton>
        <ToggleButton appearance="text" tone="neutral" defaultPressed>
          文本
        </ToggleButton>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-20 text-lark-12 text-lark-caption">图标</span>
        <ToggleButton appearance="icon" aria-label="搜索">
          <SearchIcon />
        </ToggleButton>
        <ToggleButton appearance="icon" aria-label="搜索" defaultPressed>
          <SearchIcon />
        </ToggleButton>
        <ToggleButton appearance="icon" tone="neutral" aria-label="预览">
          <EyeIcon />
        </ToggleButton>
        <ToggleButton appearance="icon" tone="neutral" aria-label="预览" defaultPressed>
          <EyeIcon />
        </ToggleButton>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <ToggleButton key={size} size={size} defaultPressed>
          {size.toUpperCase()}
        </ToggleButton>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, children: "停用" },
};
