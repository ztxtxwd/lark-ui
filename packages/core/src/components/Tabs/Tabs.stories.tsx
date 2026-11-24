import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsPanel, TabsTab } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书标签页。支持一级线条式（Line）、次级选项式（Capsule）与卡片式（Card）。\n\n" +
          "线条式字号 16 / 14 / 12px；选中指示器 2px，标签间距 24px。选项式高度 28 / 24px，圆角 6px。",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["line", "capsule", "card"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: { variant: "line", size: "md" },
  decorators: [
    (Story) => (
      <div className="w-[560px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="overview">
      <TabsList aria-label="项目视图">
        <TabsTab value="overview">概览</TabsTab>
        <TabsTab value="members">成员</TabsTab>
        <TabsTab value="activity">动态</TabsTab>
        <TabsTab value="settings" disabled>
          设置
        </TabsTab>
      </TabsList>
      <TabsPanel value="overview">项目概览内容</TabsPanel>
      <TabsPanel value="members">项目成员内容</TabsPanel>
      <TabsPanel value="activity">项目动态内容</TabsPanel>
      <TabsPanel value="settings">项目设置内容</TabsPanel>
    </Tabs>
  ),
};

export const Capsule: Story = {
  args: { variant: "capsule" },
  render: (args) => (
    <Tabs {...args} defaultValue="all">
      <TabsList aria-label="消息筛选">
        <TabsTab value="all">全部</TabsTab>
        <TabsTab value="unread">未读</TabsTab>
        <TabsTab value="mention">@我</TabsTab>
      </TabsList>
      <TabsPanel value="all">全部消息</TabsPanel>
      <TabsPanel value="unread">未读消息</TabsPanel>
      <TabsPanel value="mention">提及我的消息</TabsPanel>
    </Tabs>
  ),
};

export const Card: Story = {
  args: { variant: "card" },
  render: (args) => (
    <Tabs {...args} defaultValue="doc">
      <TabsList aria-label="文档">
        <TabsTab value="doc">文档</TabsTab>
        <TabsTab value="sheet">表格</TabsTab>
      </TabsList>
      <TabsPanel value="doc">文档内容</TabsPanel>
      <TabsPanel value="sheet">表格内容</TabsPanel>
    </Tabs>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Tabs key={size} {...args} size={size} defaultValue="a">
          <TabsList aria-label={`${size} 标签页`}>
            <TabsTab value="a">标签页 A</TabsTab>
            <TabsTab value="b">标签页 B</TabsTab>
          </TabsList>
          <TabsPanel value="a">内容 A</TabsPanel>
          <TabsPanel value="b">内容 B</TabsPanel>
        </Tabs>
      ))}
    </div>
  ),
};
