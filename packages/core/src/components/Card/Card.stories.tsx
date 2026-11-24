import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import {
  Card,
  CardBody,
  CardCover,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书卡片。用于聚合同类信息或作为详细信息入口，样式与 UD（Universe Design）规范一致：\n\n" +
          "- 背景：N00（描边/无边框）或 N100（填充）\n" +
          "- 圆角：8 / 10 / 12px\n" +
          "- 描边：1px N300；无边框卡片使用 Shadow-S1 投影\n" +
          "- 内边距：12px；标题与内容间距 12px\n" +
          "- 交互：可悬停卡片使用 100ms 过渡与 Shadow-S3 悬停投影",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["outlined", "borderless", "filled"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    hoverable: { control: "boolean" },
  },
  args: {
    variant: "outlined",
    size: "md",
    hoverable: false,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

function SampleCard({
  variant,
  size,
  hoverable,
}: {
  variant?: "outlined" | "borderless" | "filled";
  size?: "sm" | "md" | "lg";
  hoverable?: boolean;
}) {
  return (
    <Card className="w-80" variant={variant} size={size} hoverable={hoverable}>
      <CardHeader>
        <CardTitle>产品设计评审</CardTitle>
        <CardDescription>周三 14:00 · 5 人参与</CardDescription>
      </CardHeader>
      <CardBody>确认卡片、折叠面板与评分组件的视觉规范，并同步本周交付计划。</CardBody>
      <CardFooter className="justify-end">
        <Button appearance="text" tone="neutral" size="sm">
          稍后
        </Button>
        <Button size="sm">查看详情</Button>
      </CardFooter>
    </Card>
  );
}

export const Outlined: Story = {
  render: (args) => <SampleCard {...args} />,
};

export const Borderless: Story = {
  args: { variant: "borderless" },
  render: (args) => <SampleCard {...args} />,
};

export const Filled: Story = {
  args: { variant: "filled" },
  render: (args) => <SampleCard {...args} />,
};

export const Hoverable: Story = {
  args: { hoverable: true },
  render: (args) => <SampleCard {...args} />,
};

export const WithCover: Story = {
  render: (args) => (
    <Card className="w-80" {...args}>
      <CardCover>
        <div className="flex h-32 items-center justify-center bg-lark-filler text-lark-12 text-lark-caption">
          封面区域
        </div>
      </CardCover>
      <CardHeader>
        <CardTitle>设计系统分享会</CardTitle>
        <CardDescription>线上直播 · 60 分钟</CardDescription>
      </CardHeader>
      <CardBody>从设计令牌出发，统一跨端组件的视觉与交互。</CardBody>
    </Card>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Card key={size} className="w-64" {...args} size={size}>
          <CardHeader>
            <CardTitle>{size.toUpperCase()} 卡片</CardTitle>
            <CardDescription>
              圆角 {size === "sm" ? "8" : size === "md" ? "10" : "12"}px
            </CardDescription>
          </CardHeader>
          <CardBody>卡片间距与圆角随尺寸变化，内边距保持 12px。</CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(["outlined", "borderless", "filled"] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-start gap-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Card key={size} className="w-56" {...args} variant={variant} size={size}>
              <CardHeader>
                <CardTitle>
                  {variant} · {size}
                </CardTitle>
                <CardDescription>UD 卡片矩阵</CardDescription>
              </CardHeader>
              <CardBody>不同背景、描边与圆角的组合。</CardBody>
            </Card>
          ))}
        </div>
      ))}
    </div>
  ),
};
