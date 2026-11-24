import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollBar } from "./ScrollBar";

function Rows({ count = 24 }: { count?: number }) {
  const versions = Array.from({ length: count }, (_, index) => count - index);

  return (
    <div className="flex flex-col">
      {versions.map((version) => (
        <div
          key={version}
          className="flex items-center justify-between border-b border-lark-divider px-3 py-2 text-lark-14 text-lark-title last:border-b-0"
        >
          <span>版本 v1.2.0-beta.{version}</span>
          <span className="text-lark-12 text-lark-caption">
            2026-11-{String((version % 28) + 1).padStart(2, "0")}
          </span>
        </div>
      ))}
    </div>
  );
}

function Cards() {
  const projects = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <div className="flex w-max gap-3 p-3">
      {projects.map((project) => (
        <div
          key={project}
          className="flex h-32 w-40 shrink-0 flex-col justify-between rounded-lark-lg border border-lark-border-card bg-lark-canvas p-3"
        >
          <span className="text-lark-14 font-medium text-lark-title">项目 {project}</span>
          <span className="text-lark-12 leading-[20px] text-lark-caption">
            横向排列的项目卡片，用于演示水平滚动条。
          </span>
        </div>
      ))}
    </div>
  );
}

const meta: Meta<typeof ScrollBar> = {
  title: "Components/ScrollBar",
  component: ScrollBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "滚动条。用于浏览超出视窗区域的内容，并提示内容总量与当前位置。\n\n" +
          "- Thumb 热区宽 11px：可见宽度 7px，四周各 2px 透明边距\n" +
          "- Track 宽 11px 且透明；Thumb 最小高度 24px（含边距）\n" +
          "- 颜色：N900 30%，Hover / Pressed 为 60%；仅颜色变化，尺寸不变\n" +
          "- 位于滚动视窗右侧或底部，贴边放置，层级高于内容\n" +
          "- 支持滚动时显示（auto / scroll / hover）与始终显示（always）\n" +
          "- 原生滚轮、触控板、键盘与读屏滚动保持不变；Thumb 可拖拽、Track 可点击翻页",
      },
    },
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["vertical", "horizontal", "both"] },
    visibility: { control: "inline-radio", options: ["auto", "always", "scroll", "hover"] },
    thickness: { control: { type: "number", min: 4, max: 12 } },
    minThumbSize: { control: { type: "number", min: 16, max: 64 } },
    maxHeight: { control: "number" },
  },
  args: {
    label: "版本列表",
    orientation: "vertical",
    visibility: "auto",
    thickness: 7,
    minThumbSize: 24,
    maxHeight: 280,
  },
  decorators: [
    (Story) => (
      <div className="w-[480px] overflow-hidden rounded-lark-lg border border-lark-border-card bg-lark-canvas">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: (args) => (
    <ScrollBar {...args}>
      <Rows />
    </ScrollBar>
  ),
};

export const Horizontal: Story = {
  args: { label: "项目卡片", orientation: "horizontal", maxHeight: undefined },
  render: (args) => (
    <ScrollBar {...args}>
      <Cards />
    </ScrollBar>
  ),
};

export const AlwaysVisible: Story = {
  args: { label: "始终显示的列表", visibility: "always" },
  render: (args) => (
    <ScrollBar {...args}>
      <Rows />
    </ScrollBar>
  ),
};

export const AutoHide: Story = {
  args: { label: "悬停显示的列表", visibility: "hover" },
  render: (args) => (
    <ScrollBar {...args}>
      <Rows />
    </ScrollBar>
  ),
};

export const ScrollOnly: Story = {
  args: { label: "滚动时显示的列表", visibility: "scroll" },
  render: (args) => (
    <ScrollBar {...args}>
      <Rows />
    </ScrollBar>
  ),
};

export const BothAxes: Story = {
  args: { label: "双向滚动", orientation: "both", maxHeight: undefined },
  render: (args) => (
    <ScrollBar {...args} className="h-[260px] w-[420px]">
      <div style={{ height: 640, width: 720 }} className="p-3">
        <p className="m-0 text-lark-14 text-lark-title">
          内容在两个方向上都超出视窗，因此同时展示垂直与水平滚动条，两条轨道错开、不交叉。
        </p>
      </div>
    </ScrollBar>
  ),
};

export const Thickness: Story = {
  args: { label: "加粗滚动条", thickness: 9, minThumbSize: 32 },
  render: (args) => (
    <ScrollBar {...args}>
      <Rows />
    </ScrollBar>
  ),
};
