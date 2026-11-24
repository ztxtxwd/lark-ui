import type { Meta, StoryObj } from "@storybook/react-vite";
import { Placeholder } from "./Placeholder";

const meta: Meta<typeof Placeholder> = {
  title: "Components/Placeholder",
  component: Placeholder,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书占位符。用于图片缺失或加载失败等无内容场景，默认 36 × 36px，图标色 N400，可自定义尺寸与内容。",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["image", "error"] },
    size: { control: "number" },
    muted: { control: "boolean" },
    decorative: { control: "boolean" },
  },
  args: { variant: "image", size: 36 },
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {};

export const FailedToLoad: Story = {
  args: { variant: "error" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {[24, 36, 48, 64, 96].map((size) => (
        <Placeholder key={size} {...args} size={size} label={`${size}px`} />
      ))}
    </div>
  ),
};

export const Muted: Story = {
  args: { muted: true, size: 64 },
};

export const InContainer: Story = {
  render: () => (
    <div className="flex size-40 items-center justify-center rounded-lark-lg border border-dashed border-lark-border bg-lark-content">
      <Placeholder size={48} label="没有图片" />
    </div>
  ),
};
