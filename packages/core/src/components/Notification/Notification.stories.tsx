import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useEffect, useMemo } from "react";
import { Button } from "../Button";
import {
  createNotificationApiFor,
  createToaster,
  type NotificationApi,
  NotificationProvider,
} from "./Notification";

/**
 * Every docs canvas owns its queue. Sharing the module-level `notification`
 * singleton would render one click's notification in every mounted story
 * region at the same viewport spot — overlapping cards and stacked shadows.
 */
function Demo({
  children,
  args,
}: {
  children: (api: NotificationApi) => ReactNode;
  args: Record<string, unknown>;
}) {
  const toaster = useMemo(() => createToaster<ReactNode>({ duration: 4000 }), []);
  const api = useMemo(() => createNotificationApiFor(toaster), [toaster]);
  useEffect(() => {
    return () => api.destroy();
  }, [api]);

  return (
    <NotificationProvider {...args} toaster={toaster}>
      <div className="flex flex-wrap items-center gap-3 p-6">{children(api)}</div>
    </NotificationProvider>
  );
}

const meta = {
  title: "Components/Notification",
  component: NotificationProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "通知提醒框 Notification，用于全局展示需要用户知晓的提醒信息。\n\n" +
          "- 位于页面右上角，距顶部与右端 24px，卡片自上而下堆叠，间距 16px\n" +
          "- 基础卡片宽 360px，内容较多的通知可用 400px；整体内边距 24px\n" +
          "- 图标 24px、标题 16/24 medium、正文 14/22；浅色底 + 1px 卡片描边 + s5 平滑阴影\n" +
          "- 默认 4 秒后自动消失；悬停或聚焦时暂停计时；带操作的通知默认常驻\n" +
          "- 语义：info、success、warning、error；错误会以 assertive 方式播报\n" +
          "- 命令式 API 支持 key/update/destroy，便于将「上传中」更新为「上传完成」",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom"] },
    align: { control: "select", options: ["start", "center", "end"] },
    size: { control: "select", options: ["sm", "md"] },
    offset: { control: { type: "number", min: 0, max: 120 } },
    maxVisible: { control: { type: "number", min: 1, max: 8 } },
  },
  args: {
    side: "top",
    align: "end",
    size: "sm",
    offset: 24,
    maxVisible: 5,
  },
} satisfies Meta<typeof NotificationProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => (
        <Button
          onClick={() =>
            api.info({
              title: "有新版本可用",
              description: "飞书 7.72 已准备好安装，重启后生效。",
            })
          }
        >
          普通通知
        </Button>
      )}
    </Demo>
  ),
};

export const AllTones: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => (
        <>
          <Button
            onClick={() =>
              api.info({ title: "普通通知", description: "系统将在今晚 23:00 进行维护。" })
            }
          >
            info
          </Button>
          <Button
            onClick={() =>
              api.success({ title: "保存成功", description: "所有更改已同步到云端。" })
            }
          >
            success
          </Button>
          <Button
            onClick={() =>
              api.warning({ title: "存储空间即将用尽", description: "剩余空间不足 1GB。" })
            }
          >
            warning
          </Button>
          <Button
            onClick={() => api.error({ title: "保存失败", description: "网络异常，请稍后重试。" })}
          >
            error
          </Button>
        </>
      )}
    </Demo>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => (
        <Button
          onClick={() =>
            api.info({
              title: "已删除 1 个文件",
              description: "文件已移至回收站，30 天内可恢复。",
              action: {
                label: "撤销",
                onAction: () => api.success({ title: "文件已恢复" }),
              },
            })
          }
        >
          删除文件
        </Button>
      )}
    </Demo>
  ),
};

export const Duration: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => (
        <>
          <Button
            onClick={() =>
              api.info({
                title: "短暂通知",
                description: "2 秒后自动消失。",
                duration: 2000,
              })
            }
          >
            2 秒
          </Button>
          <Button
            onClick={() =>
              api.info({
                title: "默认时长",
                description: "4 秒后自动消失；悬停可暂停计时。",
              })
            }
          >
            默认 4 秒
          </Button>
          <Button
            onClick={() =>
              api.info({
                title: "常驻通知",
                description: "需要用户手动关闭。",
                duration: Infinity,
              })
            }
          >
            常驻
          </Button>
        </>
      )}
    </Demo>
  ),
};

export const Stacking: Story = {
  render: (args) => {
    let count = 0;
    return (
      <Demo args={args}>
        {(api) => (
          <Button
            onClick={() => {
              count += 1;
              api.info({
                title: `第 ${count} 条通知`,
                description: "新通知出现在栈顶，较早的通知依次下移。",
                duration: 6000,
              });
            }}
          >
            连续触发
          </Button>
        )}
      </Demo>
    );
  },
};

export const UpdateInPlace: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => (
        <Button
          onClick={() => {
            const key = api.info({
              title: "正在上传报告…",
              description: "请稍候，完成后会在原位置更新。",
              duration: Infinity,
            });
            window.setTimeout(() => {
              api.update(key, {
                type: "success",
                title: "报告上传完成",
                description: "已保存到云端，可继续编辑。",
              });
            }, 1200);
          }}
        >
          上传报告
        </Button>
      )}
    </Demo>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => (
        <>
          <Button
            onClick={() =>
              api.info({
                title: "标准宽度 360px",
                description: "适合普通的一行标题与两行正文。",
                duration: Infinity,
              })
            }
          >
            360px
          </Button>
          <Button
            onClick={() =>
              api.info({
                title: "宽通知 400px",
                description: "内容较长或需要操作按钮时使用。",
                size: "md",
                duration: Infinity,
              })
            }
          >
            400px
          </Button>
        </>
      )}
    </Demo>
  ),
};
