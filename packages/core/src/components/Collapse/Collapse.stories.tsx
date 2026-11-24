import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDownIcon } from "../../icons";
import { Tag } from "../Tag";
import { Collapse, CollapseHeader, CollapseItem, CollapsePanel, CollapseTrigger } from "./Collapse";

const meta = {
  title: "Components/Collapse",
  component: Collapse,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书折叠面板。用于在有限空间内收纳可隐藏的内容，样式与 UD（Universe Design）规范一致：\n\n" +
          "- 标题行最小高度 40px，左右内边距 8px\n" +
          "- 分割线：1px N900*15%\n" +
          "- 箭头：16 × 16px，N600；右侧线性箭头（下/上）或左侧面性箭头（右/下）\n" +
          "- 动画：高度与透明度 200ms cubic-bezier(.34,.69,.1,1)，遵循减少动态效果设置\n" +
          "- 基础模式可同时展开多项；传 `multiple={false}` 切换为手风琴模式",
      },
    },
  },
  argTypes: {
    multiple: { control: "boolean" },
    bordered: { control: "boolean" },
    iconPosition: { control: "select", options: ["left", "right"] },
  },
  args: {
    multiple: true,
    bordered: true,
    iconPosition: "right",
    defaultValue: ["1"],
  },
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: "1",
    title: "项目概览",
    content: "汇总项目的里程碑、负责人和当前进度，便于快速了解整体状态。",
  },
  {
    value: "2",
    title: "成员与权限",
    content: "管理项目成员、角色以及文档的访问权限。",
  },
  {
    value: "3",
    title: "交付记录",
    content: "按时间查看已交付的版本和对应的变更说明。",
  },
];

export const Basic: Story = {
  render: (args) => (
    <Collapse {...args}>
      {items.map((item) => (
        <CollapseItem key={item.value} value={item.value} title={item.title}>
          {item.content}
        </CollapseItem>
      ))}
    </Collapse>
  ),
};

export const Accordion: Story = {
  args: { multiple: false },
  render: (args) => (
    <Collapse {...args}>
      {items.map((item) => (
        <CollapseItem key={item.value} value={item.value} title={item.title}>
          {item.content}
        </CollapseItem>
      ))}
    </Collapse>
  ),
};

export const WithExtra: Story = {
  render: (args) => (
    <Collapse {...args}>
      {items.map((item) => (
        <CollapseItem
          key={item.value}
          value={item.value}
          title={item.title}
          extra={<Tag tone="primary">进行中</Tag>}
        >
          {item.content}
        </CollapseItem>
      ))}
    </Collapse>
  ),
};

export const DisabledItem: Story = {
  render: (args) => (
    <Collapse {...args}>
      {items.map((item) => (
        <CollapseItem
          key={item.value}
          value={item.value}
          title={item.title}
          disabled={item.value === "2"}
        >
          {item.content}
        </CollapseItem>
      ))}
    </Collapse>
  ),
};

export const IconLeft: Story = {
  args: { iconPosition: "left" },
  render: (args) => (
    <Collapse {...args}>
      {items.map((item) => (
        <CollapseItem key={item.value} value={item.value} title={item.title}>
          {item.content}
        </CollapseItem>
      ))}
    </Collapse>
  ),
};

export const Borderless: Story = {
  args: { bordered: false },
  render: (args) => (
    <Collapse {...args}>
      {items.map((item) => (
        <CollapseItem key={item.value} value={item.value} title={item.title}>
          {item.content}
        </CollapseItem>
      ))}
    </Collapse>
  ),
};

export const Composed: Story = {
  render: (args) => (
    <Collapse {...args}>
      {items.map((item) => (
        <CollapseItem key={item.value} value={item.value}>
          <CollapseHeader>
            <CollapseTrigger>
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
              <ChevronDownIcon
                size={16}
                aria-hidden="true"
                className="shrink-0 text-lark-icon-2 transition-transform duration-200 ease-lark motion-reduce:transition-none group-data-[open]/collapse-header:rotate-180"
              />
            </CollapseTrigger>
          </CollapseHeader>
          <CollapsePanel>{item.content}</CollapsePanel>
        </CollapseItem>
      ))}
    </Collapse>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-lark-12 text-lark-caption">Multiple · right arrow</span>
        <Collapse {...args} multiple defaultValue={["1"]}>
          {items.map((item) => (
            <CollapseItem key={item.value} value={item.value} title={item.title}>
              {item.content}
            </CollapseItem>
          ))}
        </Collapse>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-lark-12 text-lark-caption">Accordion · left arrow</span>
        <Collapse {...args} multiple={false} iconPosition="left" defaultValue={["1"]}>
          {items.map((item) => (
            <CollapseItem key={item.value} value={item.value} title={item.title}>
              {item.content}
            </CollapseItem>
          ))}
        </Collapse>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-lark-12 text-lark-caption">Borderless · disabled item</span>
        <Collapse {...args} bordered={false} defaultValue={["1"]}>
          {items.map((item) => (
            <CollapseItem
              key={item.value}
              value={item.value}
              title={item.title}
              disabled={item.value === "2"}
              extra={<Tag>附加</Tag>}
            >
              {item.content}
            </CollapseItem>
          ))}
        </Collapse>
      </div>
    </div>
  ),
};
