import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { Anchor, type AnchorItem, type AnchorProps } from "./Anchor";

const sections = [
  {
    id: "overview",
    title: "概览",
    body: "项目概览汇总了目标、进度与最近动态，帮助团队快速对齐。",
  },
  {
    id: "members",
    title: "成员",
    body: "查看项目成员、角色与权限，邀请新成员加入协作。",
  },
  {
    id: "activity",
    title: "动态",
    body: "项目内所有变更都会记录在动态中，可按时间回溯。",
  },
  {
    id: "settings",
    title: "设置",
    body: "配置项目基础信息、通知策略与安全选项。",
  },
  {
    id: "advanced",
    title: "高级设置",
    body: "管理 Webhook、开放接口与数据导出。",
  },
];

// Flat modules, the UD 标准锚点导航. Most stories use this list so the
// hierarchy only appears where it is the subject of the story.
const items: AnchorItem[] = [
  { key: "overview", href: "#overview", title: "概览" },
  { key: "members", href: "#members", title: "成员" },
  { key: "activity", href: "#activity", title: "动态" },
  { key: "settings", href: "#settings", title: "设置" },
];

// The UD 层级锚点导航: 设置 owns the advanced entry, indented by 16px.
const nestedItems: AnchorItem[] = [
  ...items.slice(0, 3),
  {
    key: "settings",
    href: "#settings",
    title: "设置",
    children: [{ key: "advanced", href: "#advanced", title: "高级设置" }],
  },
];

function SectionList() {
  return (
    <div className="flex flex-1 flex-col">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="min-h-[240px] border-b border-lark-divider py-6 last:border-b-0"
        >
          <h3 className="m-0 text-lark-18 font-medium text-lark-title">{section.title}</h3>
          <p className="mt-3 text-lark-14 leading-[22px] text-lark-caption">{section.body}</p>
          <div className="mt-4 h-20 rounded-lark-md bg-lark-filler" />
        </section>
      ))}
    </div>
  );
}

function AnchorDemo({ anchorProps }: { anchorProps?: Partial<Omit<AnchorProps, "getContainer">> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const config: Omit<AnchorProps, "getContainer"> = {
    items,
    defaultActiveKey: "overview",
    offsetTop: 8,
    ...anchorProps,
  };

  return (
    <div
      ref={containerRef}
      className="h-[420px] overflow-auto rounded-lark-lg border border-lark-border-card bg-lark-canvas"
    >
      <div className="flex items-start gap-6 p-6">
        <Anchor {...config} getContainer={() => containerRef.current} />
        <SectionList />
      </div>
    </div>
  );
}

function HorizontalDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-[420px] overflow-auto rounded-lark-lg border border-lark-border-card bg-lark-canvas"
    >
      <div className="sticky top-0 z-10 bg-lark-canvas px-6 pt-4">
        <Anchor
          items={items}
          defaultActiveKey="overview"
          direction="horizontal"
          offsetTop={8}
          getContainer={() => containerRef.current}
        />
      </div>
      <div className="px-6 pb-6">
        <SectionList />
      </div>
    </div>
  );
}

const meta: Meta<typeof Anchor> = {
  title: "Components/Anchor",
  component: Anchor,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "锚点。用于长页面的页内导航，快速定位各个纵向信息模块。\n\n" +
          "- 标题 14/22px，默认宽度 200px，最宽 400px\n" +
          "- 定位线宽 2px，选中指示器（ink）宽 2px，圆角 2px，切换动画 300ms\n" +
          "- 层级缩进 16px；悬停与选中使用主色，颜色过渡 100ms\n" +
          '- 当前项使用 `aria-current="location"`；滚动监听基于 IntersectionObserver\n' +
          "- 支持常规型（sticky）与静态型（fixed）两种滚动位置",
      },
    },
  },
  argTypes: {
    direction: { control: "inline-radio", options: ["vertical", "horizontal"] },
    variant: { control: "inline-radio", options: ["line", "simple"] },
    offsetTop: { control: "number" },
    sticky: { control: "boolean" },
    fixed: { control: "boolean" },
  },
  args: {
    items,
    direction: "vertical",
    variant: "line",
    offsetTop: 8,
    defaultActiveKey: "overview",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: (args) => <AnchorDemo anchorProps={args} />,
};

export const Nested: Story = {
  args: { items: nestedItems },
  render: (args) => <AnchorDemo anchorProps={args} />,
};

export const Sticky: Story = {
  args: { sticky: true, stickyTop: 8 },
  render: (args) => <AnchorDemo anchorProps={args} />,
};

export const Horizontal: Story = {
  render: () => <HorizontalDemo />,
};

export const Simple: Story = {
  args: { variant: "simple" },
  render: (args) => <AnchorDemo anchorProps={args} />,
};
