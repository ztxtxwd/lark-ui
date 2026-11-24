import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const photo =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">' +
      '<rect width="160" height="160" fill="#5083fb"/>' +
      '<circle cx="80" cy="62" r="26" fill="#ffffff"/>' +
      '<path d="M32 160c4-38 24-58 48-58s44 20 48 58Z" fill="#ffffff"/>' +
      "</svg>",
  );

const brokenPhoto = "data:image/png;base64,AAAA";

function AppIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  );
}

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书头像。使用圆形或矩形头像代表用户或事物，遵循 UD（Universe Design）规范：\n\n" +
          "- 尺寸：20 / 24 / 32 / 40 / 48px，或自定义 4N 像素尺寸\n" +
          "- 形状：圆形（人物）、矩形（应用 / 企业 / 部门，12.5% 圆角）\n" +
          "- 内容：图片、图标或文字；图片加载中与加载失败时自动回退\n" +
          "- 取字：圆形头像中文取姓名后两字、英文取姓名首字母（「七七」「JS」）；矩形头像（应用 / 部门）取名称前两字",
      },
    },
  },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["circle", "square"] },
    fallback: { control: false },
    icon: { control: false },
  },
  args: {
    alt: "林七七",
    size: "md",
    shape: "circle",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-3">
      {(
        [
          ["xs", "林七七"],
          ["sm", "张三"],
          ["md", "John Smith"],
          ["lg", "欧阳娜娜"],
          ["xl", "Alice"],
        ] as const
      ).map(([size, name]) => (
        <Avatar key={size} {...args} size={size} alt={name} />
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} shape="circle" alt="林七七" />
      <Avatar {...args} shape="square" alt="应用" fallback="APP" />
      <Avatar {...args} shape="circle" alt="John Smith" />
      <Avatar {...args} shape="square" alt="设计部" fallback="设计" />
    </div>
  ),
};

export const Initials: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} alt="林七七" />
      <Avatar {...args} alt="欧阳娜娜" />
      <Avatar {...args} alt="John Smith" />
      <Avatar {...args} alt="Alice" />
    </div>
  ),
};

export const SquareInitials: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} shape="square" alt="设计部" />
      <Avatar {...args} shape="square" alt="应用中心" />
      <Avatar {...args} shape="square" alt="Acme" />
      <Avatar {...args} shape="square" alt="John Smith" />
    </div>
  ),
};

export const Image: Story = {
  args: { src: photo, alt: "林七七" },
};

export const ImageError: Story = {
  args: { src: brokenPhoto, alt: "林七七" },
};

export const Icon: Story = {
  args: { alt: "应用", icon: <AppIcon /> },
};

export const CustomFallback: Story = {
  args: { alt: "应用", fallback: "APP" },
};

export const PixelSize: Story = {
  args: { alt: "林七七", size: 64 },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(["circle", "square"] as const).map((shape) => (
        <div key={shape} className="flex items-center gap-3">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
            <Avatar key={size} {...args} shape={shape} size={size} alt="林七七" />
          ))}
          <Avatar {...args} shape={shape} size="lg" src={photo} alt="林七七" />
          <Avatar {...args} shape={shape} size="lg" alt="应用" icon={<AppIcon />} />
          <Avatar {...args} shape={shape} size="lg" alt="John Smith" src={brokenPhoto} />
        </div>
      ))}
    </div>
  ),
};
