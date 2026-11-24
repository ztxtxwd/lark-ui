import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Drawer, DrawerClose, DrawerContent, type DrawerSide, DrawerTrigger } from "./Drawer";

const meta = {
  title: "Components/Drawer",
  component: DrawerContent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书抽屉（侧拉窗）。从窗体右侧滑入，覆盖或挤压部分父窗体内容。\n\n" +
          "- 尺寸：小 350px、中 480px、大 680px；右侧/左侧为宽度，顶部/底部为高度\n" +
          "- 标题区固定吸顶，无描述时高 56px；标题 16/24 medium，描述 14/22 caption\n" +
          "- 内容区可滚动，操作区固定吸底；遮罩为 55% 黑色\n" +
          "- 支持模态/非模态、ESC、点击遮罩、关闭按钮；ui-sdk 负责焦点陷阱与焦点归还\n" +
          "- 底部抽屉可传入 snapPoints 并开启 resizable，获得拖拽与吸附高度",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    closable: { control: "boolean" },
    mask: { control: "boolean" },
    resizable: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
  },
  args: {
    size: "sm",
    closable: true,
    mask: true,
    resizable: false,
    title: "成员详情",
    description: "查看成员信息并管理其项目权限",
  },
} satisfies Meta<typeof DrawerContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Drawer>
      <DrawerTrigger>打开抽屉</DrawerTrigger>
      <DrawerContent
        {...args}
        footer={
          <>
            <DrawerClose
              render={
                <Button appearance="outlined" tone="neutral">
                  取消
                </Button>
              }
            />
            <Button>保存</Button>
          </>
        }
      >
        <p className="m-0">抽屉用于在当前任务流中承载附加信息，操作完成后可以平滑回到原任务。</p>
        <p className="mt-3 mb-0">这里可以放置表单、表格或详情内容。</p>
      </DrawerContent>
    </Drawer>
  ),
};

export const CustomFooter: Story = {
  render: (args) => (
    <Drawer>
      <DrawerTrigger
        render={
          <Button appearance="outlined" tone="primary">
            邀请成员
          </Button>
        }
      />
      <DrawerContent
        {...args}
        size="md"
        title="邀请成员加入项目"
        description="成员将获得项目的编辑权限。"
        footer={
          <>
            <Button appearance="outlined" tone="neutral">
              稍后再说
            </Button>
            <DrawerClose
              render={
                <Button appearance="outlined" tone="primary">
                  复制邀请链接
                </Button>
              }
            />
            <DrawerClose render={<Button>发送邀请</Button>} />
          </>
        }
      >
        <div className="rounded-lark-md border border-lark-border-card p-4">
          <p className="m-0 text-lark-14">受邀成员会收到一条飞书通知。</p>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Drawer key={size}>
          <DrawerTrigger
            render={
              <Button appearance="outlined" tone="neutral">
                {size.toUpperCase()}
              </Button>
            }
          />
          <DrawerContent {...args} size={size} title={`${size.toUpperCase()} 尺寸抽屉`}>
            宽度为 {size === "sm" ? 350 : size === "md" ? 480 : 680}px，高度与窗口等高。
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

const sides: { side: DrawerSide; label: string; title: string; content: string }[] = [
  { side: "right", label: "右侧", title: "右侧抽屉", content: "飞书抽屉的默认方向。" },
  { side: "left", label: "左侧", title: "左侧抽屉", content: "用于导航或辅助面板。" },
  { side: "top", label: "顶部", title: "顶部抽屉", content: "尺寸作为抽屉高度。" },
  { side: "bottom", label: "底部", title: "底部抽屉", content: "尺寸作为抽屉高度。" },
];

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      {sides.map(({ side, label, title, content }) => (
        <Drawer key={side} side={side}>
          <DrawerTrigger
            render={
              <Button appearance="outlined" tone="neutral">
                {label}
              </Button>
            }
          />
          <DrawerContent
            {...args}
            size={side === "top" || side === "bottom" ? "sm" : args.size}
            title={title}
            description={content}
            footer={
              <DrawerClose
                render={
                  <Button appearance="outlined" tone="neutral">
                    关闭
                  </Button>
                }
              />
            }
          >
            从 {label} 滑入，按 ESC、点击遮罩或关闭按钮均可关闭。
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

export const NonModal: Story = {
  args: { size: "sm" },
  render: (args) => (
    <Drawer modal={false} closeOnOutsidePress={false}>
      <DrawerTrigger
        render={
          <Button appearance="outlined" tone="primary">
            打开非模态抽屉
          </Button>
        }
      />
      <DrawerContent
        {...args}
        mask={false}
        title="非模态抽屉"
        description="点击页面空白处不会关闭，适合实时保存的筛选面板。"
      >
        <p className="m-0">调整筛选条件会立即生效，无需确认。</p>
      </DrawerContent>
    </Drawer>
  ),
};

export const Scrollable: Story = {
  args: { size: "md" },
  render: (args) => (
    <Drawer>
      <DrawerTrigger>打开长内容抽屉</DrawerTrigger>
      <DrawerContent
        {...args}
        title="项目动态"
        description="标题区固定，内容区独立滚动。"
        footer={
          <DrawerClose
            render={
              <Button appearance="outlined" tone="neutral">
                关闭
              </Button>
            }
          />
        }
      >
        {Array.from(
          { length: 30 },
          (_, index) => `第 ${index + 1} 条动态：成员更新了项目文档。`,
        ).map((line) => (
          <p key={line} className="mt-0 mb-3">
            {line}
          </p>
        ))}
      </DrawerContent>
    </Drawer>
  ),
};

export const Draggable: Story = {
  args: { size: "md" },
  render: (args) => (
    <Drawer side="bottom" snapPoints={[0.3, 0.6, 0.95]} defaultSnapPoint={0.3}>
      <DrawerTrigger>打开可拖拽抽屉</DrawerTrigger>
      <DrawerContent
        {...args}
        size="md"
        resizable
        handleLabel="调整抽屉高度"
        title="可拖拽抽屉"
        description="拖动手柄或抽屉空白处，可在 30% / 60% / 95% 三个吸附高度间切换。"
      >
        <p className="m-0">ui-sdk 提供拖拽、吸附点、键盘 Home/End 调整与减少动态效果支持。</p>
      </DrawerContent>
    </Drawer>
  ),
};
