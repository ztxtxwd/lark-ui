import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontalIcon, PlusIcon, SearchIcon } from "../../icons";
import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "Components/Button/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "UD 按钮组（ButtonGroup）：按 8 / 12 / 16px 间距排列同组按钮。\n" +
          "主要按钮、次要按钮和图标按钮可以混排；一组内建议不超过两种按钮样式。",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    spacing: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: {
    orientation: "horizontal",
    spacing: "md",
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="表单操作">
      <Button>确定</Button>
      <Button appearance="outlined" tone="neutral">
        取消
      </Button>
    </ButtonGroup>
  ),
};

export const Toolbar: Story = {
  render: () => (
    <ButtonGroup aria-label="文档操作" spacing="sm">
      <Button startIcon={<PlusIcon />}>分享</Button>
      <Button appearance="outlined" tone="neutral">
        权限
      </Button>
      <Button appearance="icon" tone="neutral" aria-label="搜索">
        <SearchIcon />
      </Button>
      <Button appearance="icon" tone="neutral" aria-label="更多操作">
        <MoreHorizontalIcon />
      </Button>
    </ButtonGroup>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((spacing) => (
        <div key={spacing} className="flex items-center gap-4">
          <span className="w-10 text-lark-12 text-lark-caption">{spacing}</span>
          <ButtonGroup spacing={spacing} aria-label={`${spacing} 间距`}>
            <Button>主要</Button>
            <Button appearance="outlined" tone="neutral">
              次要
            </Button>
            <Button appearance="outlined" tone="neutral">
              次要
            </Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="操作">
      <Button>主要操作</Button>
      <Button appearance="outlined" tone="neutral">
        次要操作
      </Button>
      <Button appearance="outlined" tone="neutral">
        更多
      </Button>
    </ButtonGroup>
  ),
};
