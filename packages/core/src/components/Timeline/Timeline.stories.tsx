import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertCircleIcon, CheckCircleIcon } from "../../icons";
import { Timeline, TimelineItem } from "./Timeline";

const meta = {
  title: "Components/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "时间轴 Timeline，垂直展示按时间排序的事件。\n\n" +
          "- 结构：单侧（左侧 / 右侧）或双侧（左右交替）\n" +
          "- 节点：默认圆点、状态色、自定义图标、加载中\n" +
          "- 状态：已完成 complete、当前 current、未到达 upcoming，以及成功 / 警示 / 失败校验节点\n" +
          "- 键盘：Tab 进入，上下方向键或 Home / End 在节点之间移动",
      },
    },
  },
  argTypes: {
    mode: { control: "select", options: ["left", "right", "alternate"] },
  },
  args: {
    mode: "left",
    "aria-label": "订单进度",
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem
        title="提交订单"
        time="2026-11-10 09:00"
        dateTime="2026-11-10T09:00"
        description="订单已提交，等待商家确认。"
        status="complete"
      />
      <TimelineItem
        title="商家接单"
        time="2026-11-10 09:12"
        dateTime="2026-11-10T09:12"
        description="商家已确认订单，正在备货。"
        status="complete"
      />
      <TimelineItem
        title="配送中"
        time="2026-11-10 14:32"
        dateTime="2026-11-10T14:32"
        description="骑手已取货，预计 30 分钟后送达。"
        active
      />
      <TimelineItem
        title="已完成"
        time="预计 15:10"
        description="等待骑手送达。"
        status="upcoming"
      />
    </Timeline>
  ),
};

export const Status: Story = {
  render: (args) => (
    <Timeline {...args} aria-label="流程状态">
      <TimelineItem title="已完成节点" status="complete" time="09:00" />
      <TimelineItem title="当前节点" active time="10:00" />
      <TimelineItem title="未到达节点" status="upcoming" time="11:00" />
      <TimelineItem title="成功节点" status="success" time="12:00" />
      <TimelineItem title="警示节点" status="warning" time="13:00" />
      <TimelineItem title="失败节点" status="danger" time="14:00" />
    </Timeline>
  ),
};

export const CustomDot: Story = {
  render: (args) => (
    <Timeline {...args} aria-label="自定义节点">
      <TimelineItem
        title="校验通过"
        description="节点已完成，且校验通过。"
        status="success"
        dot={<CheckCircleIcon size={16} />}
      />
      <TimelineItem
        title="校验失败"
        description="节点已完成，但校验未通过。"
        status="danger"
        dot={<AlertCircleIcon size={16} />}
      />
      <TimelineItem title="进行中" description="当前正在处理该节点。" active />
    </Timeline>
  ),
};

export const Alternate: Story = {
  args: {
    mode: "alternate",
    "aria-label": "双侧时间轴",
  },
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem
        title="发起审批"
        time="2026-11-10 09:00"
        description="王小明发起了采购审批。"
        status="complete"
      />
      <TimelineItem
        title="部门负责人审批"
        time="2026-11-10 10:20"
        description="已同意，进入财务审批。"
        status="complete"
      />
      <TimelineItem title="财务审批" time="2026-11-10 11:05" description="正在核对预算。" active />
      <TimelineItem
        title="完成"
        time="预计 2026-11-11"
        description="审批通过后自动归档。"
        status="upcoming"
      />
    </Timeline>
  ),
};

export const RightAligned: Story = {
  args: {
    mode: "right",
    "aria-label": "右侧时间轴",
  },
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem
        title="创建文档"
        time="2026-11-09 16:40"
        description="在知识库中创建了《产品规划》。"
        status="complete"
      />
      <TimelineItem
        title="更新内容"
        time="2026-11-10 09:15"
        description="补充了第三季度目标。"
        active
      />
    </Timeline>
  ),
};

export const Pending: Story = {
  render: (args) => (
    <Timeline {...args} aria-label="加载中的时间轴">
      <TimelineItem
        title="已加载节点"
        time="2026-11-10 09:00"
        description="更早的记录已加载。"
        status="complete"
      />
      <TimelineItem title="正在加载更多记录" description="请稍候。" pending />
    </Timeline>
  ),
};
