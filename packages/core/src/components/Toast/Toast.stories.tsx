import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useEffect, useMemo } from "react";
import { Button } from "../Button";
import { createToastApiFor, createToastToaster, type ToastApi, ToastProvider } from "./Toast";

/**
 * Every docs canvas owns its queue. Sharing the module-level `toast` singleton
 * would render one click's toast in every mounted story region at the same
 * viewport spot — overlapping cards and stacked shadows.
 */
function Demo({
  children,
  args,
}: {
  children: (api: ToastApi) => ReactNode;
  args: Record<string, unknown>;
}) {
  const toaster = useMemo(() => createToastToaster<ReactNode>(), []);
  const api = useMemo(() => createToastApiFor(toaster), [toaster]);
  useEffect(() => {
    return () => api.dismiss();
  }, [api]);

  return (
    <ToastProvider {...args} toaster={toaster}>
      <div className="flex flex-wrap items-center gap-3 p-6">{children(api)}</div>
    </ToastProvider>
  );
}

const meta = {
  title: "Components/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "临时提示 Toast，用于操作后的轻量、非阻断反馈。\n\n" +
          "- 五种语义：普通 info、成功 success、警告 warning、错误 error、加载中 loading\n" +
          "- 浅色语义底 + 1px 语义边框，6px 圆角，14/22 文本，s4 平滑阴影，最大宽度 600px\n" +
          "- Web 端默认顶部居中、距顶 32px；默认同时展示 2 条，最新一条在下方\n" +
          "- 默认 5s 自动消失；带文字按钮时 6s；悬停暂停计时，可关闭或无限常驻",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom"] },
    align: { control: "select", options: ["start", "center", "end"] },
    maxVisible: { control: { type: "number", min: 1, max: 6 } },
    offset: { control: { type: "number", min: 0, max: 120 } },
  },
  args: {
    side: "top",
    align: "center",
    maxVisible: 2,
    offset: 32,
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => <Button onClick={() => api("已复制到剪贴板")}>普通提示</Button>}
    </Demo>
  ),
};

export const AllTones: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => (
        <>
          <Button onClick={() => api.info("有新版本可用")}>普通 info</Button>
          <Button onClick={() => api.success("更改已保存")}>成功 success</Button>
          <Button onClick={() => api.warning("存储空间即将用尽")}>警告 warning</Button>
          <Button onClick={() => api.error("保存失败，请重试")}>错误 error</Button>
          <Button
            onClick={() => api.loading("正在上传文件…", { closable: true, duration: Infinity })}
          >
            加载中 loading
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
            api("已删除 1 个文件", {
              action: {
                label: "撤销",
                onAction: () => api.success("文件已恢复"),
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

export const ClosableAndDuration: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => (
        <>
          <Button onClick={() => api("2 秒后消失", { duration: 2000 })}>短提示 2s</Button>
          <Button onClick={() => api("这条提示可以手动关闭", { closable: true, duration: 8000 })}>
            可关闭 8s
          </Button>
          <Button
            onClick={() =>
              api("这条提示会一直保留，直到关闭", {
                closable: true,
                duration: Infinity,
              })
            }
          >
            常驻提示
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
              api.info(`第 ${count} 条提示`, { duration: 4000, closable: true });
            }}
          >
            连续触发
          </Button>
        )}
      </Demo>
    );
  },
};

export const LoadingThenSuccess: Story = {
  render: (args) => (
    <Demo args={args}>
      {(api) => (
        <Button
          onClick={() => {
            const id = api.loading("正在上传报告…");
            window.setTimeout(() => {
              api.update(id, "报告上传完成", { type: "success" });
            }, 1200);
          }}
        >
          上传报告
        </Button>
      )}
    </Demo>
  ),
};

export const BottomRight: Story = {
  args: { side: "bottom", align: "end", offset: 24 },
  render: (args) => (
    <Demo args={args}>
      {(api) => <Button onClick={() => api.success("已保存到草稿箱")}>底部右侧</Button>}
    </Demo>
  ),
};
