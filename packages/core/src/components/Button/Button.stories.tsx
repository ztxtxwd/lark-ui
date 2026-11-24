import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon, SearchIcon } from "../../icons";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书基础按钮。尺寸、状态与 UD（Universe Design）规范一致：\n\n" +
          "- 尺寸：24 / 28 / 32 / 40 / 48px\n" +
          "- 变体：主要、主要危险、蓝色次要、次要危险、次要、成功、文字、链接、图标\n" +
          "- 状态：默认、悬停、按下、选中（Toggle）、聚焦、加载、禁用",
      },
    },
  },
  argTypes: {
    appearance: {
      control: "select",
      options: ["filled", "outlined", "text", "link", "icon"],
    },
    tone: { control: "select", options: ["primary", "neutral", "danger", "success"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["default", "round", "circle"] },
    loading: { control: "boolean" },
    block: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "创建",
    appearance: "filled",
    tone: "primary",
    size: "md",
    shape: "default",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const PrimaryDanger: Story = {
  args: { tone: "danger", children: "删除" },
};

export const SecondaryPrimary: Story = {
  args: { appearance: "outlined", tone: "primary", children: "提交" },
};

export const Secondary: Story = {
  args: { appearance: "outlined", tone: "neutral", children: "取消" },
};

export const SecondaryDanger: Story = {
  args: { appearance: "outlined", tone: "danger", children: "删除" },
};

export const Success: Story = {
  args: { tone: "success", children: "加入" },
};

export const SuccessOutlined: Story = {
  args: { appearance: "outlined", tone: "success", children: "加入" },
};

export const Text: Story = {
  args: { appearance: "text", tone: "neutral", children: "编辑" },
};

export const Link: Story = {
  args: { appearance: "link", tone: "primary", children: "查看详情" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    startIcon: <PlusIcon />,
    children: "新建文档",
  },
};

export const IconOnly: Story = {
  args: {
    appearance: "icon",
    tone: "neutral",
    "aria-label": "搜索",
    children: <SearchIcon />,
  },
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button>默认</Button>
      <Button shape="round">全圆角</Button>
      <Button shape="circle" appearance="icon" aria-label="搜索">
        <SearchIcon />
      </Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["primary", "neutral", "danger", "success"] as const).map((tone) => (
        <div key={tone} className="flex flex-wrap items-center gap-3">
          {(["filled", "outlined", "text", "link", "icon"] as const).map((appearance) => (
            <Button
              key={appearance}
              appearance={appearance}
              tone={tone}
              {...(appearance === "icon" ? { "aria-label": `${tone} ${appearance}` } : {})}
            >
              {appearance === "icon" ? <SearchIcon /> : `${tone} ${appearance}`}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Selected: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["primary", "neutral", "danger", "success"] as const).map((tone) => (
        <div key={tone} className="flex flex-wrap items-center gap-3">
          <Button appearance="filled" tone={tone} selected>
            已选
          </Button>
          <Button appearance="outlined" tone={tone} selected>
            已选
          </Button>
          <Button appearance="text" tone={tone} selected>
            已选
          </Button>
          <Button appearance="icon" tone={tone} selected aria-label={`${tone} 已选`}>
            <SearchIcon />
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const MenuTriggerExpanded: Story = {
  name: "Menu trigger (expanded)",
  render: () => (
    <div className="flex items-center gap-3">
      <Button aria-expanded>全部</Button>
      <Button appearance="outlined" aria-expanded>
        全部
      </Button>
      <Button appearance="text" tone="neutral" aria-expanded>
        全部
      </Button>
      <Button appearance="icon" tone="neutral" aria-expanded aria-label="更多">
        <SearchIcon />
      </Button>
    </div>
  ),
};

export const IconOutlined: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button appearance="outlined" shape="circle" aria-label="添加成员">
        <PlusIcon />
      </Button>
      <Button appearance="outlined" tone="primary" shape="circle" aria-label="搜索">
        <SearchIcon />
      </Button>
      <Button appearance="outlined" tone="danger" shape="circle" aria-label="删除">
        <PlusIcon />
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: "保存中" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "不可用" },
};
