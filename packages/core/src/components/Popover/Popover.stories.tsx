import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "./Popover";

const trigger = (
  <button
    type="button"
    className="inline-flex h-8 items-center justify-center rounded-lark-md border border-solid border-lark-border bg-lark-canvas px-3 text-lark-14 text-lark-title transition-colors duration-100 hover:bg-[var(--lark-fill-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary"
  >
    查看详情
  </button>
);

const footer = (
  <>
    <PopoverClose>取消</PopoverClose>
    <button
      type="button"
      className="inline-flex h-8 items-center justify-center rounded-lark-md bg-lark-primary px-3 text-lark-14 font-medium text-lark-on-primary transition-colors duration-100 hover:bg-lark-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary"
    >
      确认
    </button>
  </>
);

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "气泡卡片。点击触发元素后在附近浮层展示更多信息或操作。\n\n" +
          "- 背景 float、描边 border-card、圆角 8px、阴影 shadow-4\n" +
          "- 小尺寸内边距 12 / 16px，大尺寸 20 / 24px；最大宽度 420px、最大高度 480px\n" +
          "- 12 × 6 的三角箭头指向触发区域，默认与触发区域间距 4px\n" +
          "- 出现时从触发点缩放淡入，100ms；靠近视口边缘时自动翻转位置",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    size: { control: "select", options: ["sm", "lg"] },
    arrow: { control: "boolean" },
    disabled: { control: "boolean" },
    sideOffset: { control: "number" },
  },
  args: {
    trigger,
    title: "文档权限",
    description: "拥有链接的人都可以查看这份文档。",
    content: "链接将在 7 天后失效，到期后需要重新分享。",
    side: "bottom",
    align: "center",
    size: "sm",
    arrow: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithFooter: Story = {
  args: {
    title: "删除文档？",
    description: "删除后无法恢复，且所有协作成员都将失去访问权限。",
    content: undefined,
    footer,
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    title: "邀请协作者",
    description: "被邀请的人可以编辑这份文档。",
    content: "输入对方的邮箱地址后发送邀请，邀请链接 3 天内有效。",
  },
};

export const WithoutArrow: Story = {
  args: {
    arrow: false,
    title: "无箭头",
    description: "用于不需要指向触发区域的场景。",
  },
};

export const Placements: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-24 p-24">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover
          {...args}
          key={side}
          trigger={<button type="button">{`${side} 侧`}</button>}
          side={side}
          title={`气泡位置：${side}`}
          description={`气泡优先出现在触发区域的 ${side} 侧，空间不足时自动翻转。`}
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "四个方向分别打开一次，观察箭头随实际落点翻转。",
      },
    },
  },
};

export const WithFormContent: Story = {
  args: {
    title: "新建分组",
    description: "分组用于整理团队文档。",
    content: (
      <label className="mt-1 flex flex-col gap-1 text-lark-12 text-lark-caption">
        分组名称
        <input
          aria-label="分组名称"
          className="h-8 rounded-lark-md border border-solid border-lark-border bg-lark-canvas px-2 text-lark-14 text-lark-title outline-none focus:border-lark-primary"
          placeholder="请输入分组名称"
        />
      </label>
    ),
    footer,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Composable: Story = {
  render: () => (
    <PopoverRoot>
      <PopoverTrigger>快捷键</PopoverTrigger>
      <PopoverContent side="bottom" size="lg">
        <PopoverArrow />
        <PopoverTitle>键盘快捷键</PopoverTitle>
        <PopoverDescription>按 ? 查看全部快捷键。</PopoverDescription>
      </PopoverContent>
    </PopoverRoot>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "也可以使用 PopoverRoot / PopoverTrigger / PopoverContent 等可组合部件自行搭建卡片。",
      },
    },
  },
};
