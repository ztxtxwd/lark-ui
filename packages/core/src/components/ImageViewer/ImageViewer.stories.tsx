import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ImageViewer, type ImageViewerImage, type ImageViewerProps } from "./ImageViewer";

function makeImage(label: string, from: string, to: string) {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">',
    "<defs>",
    `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0" stop-color="${from}" />`,
    `<stop offset="1" stop-color="${to}" />`,
    "</linearGradient>",
    "</defs>",
    '<rect width="1200" height="800" fill="url(#g)" />',
    '<circle cx="960" cy="180" r="130" fill="rgba(255,255,255,0.16)" />',
    '<circle cx="1080" cy="680" r="90" fill="rgba(255,255,255,0.12)" />',
    `<text x="80" y="440" fill="#ffffff" font-family="system-ui, sans-serif" font-size="84" font-weight="600">${label}</text>`,
    "</svg>",
  ].join("");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const gallery: ImageViewerImage[] = [
  { src: makeImage("设计稿", "#1456f0", "#00bcd4"), alt: "设计稿" },
  { src: makeImage("流程图", "#8f5cf7", "#f54a45"), alt: "流程图" },
  { src: makeImage("数据看板", "#00b96b", "#ffc60a"), alt: "数据看板" },
];

const triggerClass = [
  "inline-flex h-8 items-center justify-center rounded-lark-md",
  "border border-solid border-lark-border bg-lark-canvas px-3",
  "text-lark-14 text-lark-title transition-colors duration-100",
  "hover:bg-[var(--lark-fill-hover)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary",
].join(" ");

function Preview({
  triggerLabel = "预览图片",
  ...args
}: ImageViewerProps & { triggerLabel?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-64 items-center justify-center">
      <button type="button" className={triggerClass} onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>
      <ImageViewer {...args} open={open} onOpenChange={setOpen} />
    </div>
  );
}

const meta = {
  title: "Components/ImageViewer",
  component: ImageViewer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "图片预览。全窗口浮层，背景为 80% 黑色遮罩，图片居中展示并支持上一张/下一张、" +
          "缩放、旋转与下载。\n\n" +
          "- 工具栏高 40px，圆角 4px，背景 75% 黑色，距底部 20px 居中\n" +
          "- 关闭按钮为右上角黑色圆形按钮，距顶部/右侧 20px\n" +
          "- 图片默认适配窗口，最大宽 80vw，缩放每次 10%\n" +
          "- 加载失败时以占位符替换图片，工具栏仍可下载\n" +
          "- 快捷键：←/→ 切换图片，↑/↓ 或 +/- 缩放，0 重置，Esc 关闭\n" +
          "- 基于 ui-sdk dialog，焦点锁定在浮层内，关闭后返回触发元素\n\n" +
          "受控用法：`<ImageViewer open={open} onOpenChange={setOpen} images={images} />`。",
      },
    },
  },
  argTypes: {
    showToolbar: { control: "boolean" },
    index: { control: "number" },
    images: { control: "object" },
  },
  args: {
    images: gallery,
    "aria-label": "图片预览",
    showToolbar: true,
  },
} satisfies Meta<typeof ImageViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    images: [gallery[0]],
  },
  render: (args) => <Preview {...args} triggerLabel="预览单张图片" />,
};

export const Multiple: Story = {
  render: (args) => <Preview {...args} triggerLabel="预览 3 张图片" />,
};

export const Toolbar: Story = {
  args: {
    defaultIndex: 1,
  },
  render: (args) => <Preview {...args} triggerLabel="打开工具栏示例" />,
  parameters: {
    docs: {
      description: {
        story: "翻页、缩放与其他操作由两条分割线分为三个区块，右上角关闭。",
      },
    },
  },
};

export const WithoutToolbar: Story = {
  args: {
    showToolbar: false,
  },
  render: (args) => <Preview {...args} triggerLabel="无工具栏" />,
};

export const FailedImage: Story = {
  args: {
    images: [{ src: "data:image/png;base64,AAAA", alt: "加载失败的图片" }],
  },
  render: (args) => <Preview {...args} triggerLabel="预览损坏的图片" />,
  parameters: {
    docs: {
      description: {
        story: "图片加载失败时使用 UD 加载失败占位符替换图片。",
      },
    },
  },
};

export const CustomContent: Story = {
  args: {
    images: [gallery[2]],
    children: (
      <span className="rounded-lark-sm bg-black/60 px-2 py-1 text-lark-12 text-white">
        数据看板 · 2026 Q4
      </span>
    ),
    toolbarExtra: (
      <button
        type="button"
        className="h-10 cursor-pointer rounded-lark-xs px-3 text-lark-12 text-white transition-colors duration-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
      >
        收藏
      </button>
    ),
  },
  render: (args) => <Preview {...args} triggerLabel="自定义内容" />,
  parameters: {
    docs: {
      description: {
        story: "通过 `children` 在左上角放自定义内容，通过 `toolbarExtra` 在工具栏追加自定义操作。",
      },
    },
  },
};
