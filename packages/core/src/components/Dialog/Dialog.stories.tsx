import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./Dialog";

const meta = {
  title: "Components/Dialog",
  component: DialogContent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书对话框。宽度 420 / 600 / 840 / 1080px，圆角 8px，标题区内边距 24px，" +
          "遮罩使用 bg-mask，内容区可滚动。支持右上角关闭、ESC 与点击遮罩关闭。",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
  },
  args: { size: "sm" },
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger>打开对话框</DialogTrigger>
      <DialogContent
        {...args}
        title="删除文档"
        description="删除后将无法恢复，请谨慎操作。"
        footer={
          <>
            <DialogClose
              render={
                <Button appearance="outlined" tone="neutral">
                  取消
                </Button>
              }
            />
            <Button tone="danger">删除</Button>
          </>
        }
      >
        确定要删除「项目周报」这份文档吗？
      </DialogContent>
    </Dialog>
  ),
};

export const CustomContent: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger
        render={
          <Button appearance="outlined" tone="primary">
            邀请成员
          </Button>
        }
      />
      <DialogContent
        {...args}
        size="md"
        title="邀请成员加入项目"
        description="成员将获得项目的编辑权限。"
        footer={
          <>
            <DialogClose
              render={
                <Button appearance="outlined" tone="neutral">
                  取消
                </Button>
              }
            />
            <DialogClose render={<Button>发送邀请</Button>} />
          </>
        }
      >
        <div className="rounded-lark-md border border-lark-border-card p-4">
          <p className="text-lark-14">受邀成员会收到一条飞书通知。</p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger
            render={
              <Button appearance="outlined" tone="neutral">
                {size.toUpperCase()}
              </Button>
            }
          />
          <DialogContent {...args} size={size} title={`${size.toUpperCase()} 尺寸对话框`}>
            宽度为 {size === "sm" ? 420 : size === "md" ? 600 : size === "lg" ? 840 : 1080}px。
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const NonModal: Story = {
  render: (args) => (
    <Dialog modal={false} closeOnOutsidePress={false}>
      <DialogTrigger
        render={
          <Button appearance="outlined" tone="primary">
            打开非模态对话框
          </Button>
        }
      />
      <DialogContent
        {...args}
        mask={false}
        title="非模态对话框"
        description="页面保持可用，适合实时保存的设置面板。"
        footer={
          <DialogClose
            render={
              <Button appearance="outlined" tone="neutral">
                取消
              </Button>
            }
          />
        }
      >
        修改会立即生效，不需要阻断页面中的其他操作。
      </DialogContent>
    </Dialog>
  ),
};

export const Closable: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger
        render={
          <Button appearance="outlined" tone="danger">
            危险操作
          </Button>
        }
      />
      <DialogContent
        {...args}
        title="删除空间"
        description="空间内的所有文件都会被永久删除。"
        footer={
          <>
            <DialogClose
              render={
                <Button appearance="outlined" tone="neutral">
                  取消
                </Button>
              }
            />
            <Button tone="danger">确认删除</Button>
          </>
        }
      >
        此操作不可撤销。
      </DialogContent>
    </Dialog>
  ),
};
