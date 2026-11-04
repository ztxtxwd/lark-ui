import { Button, LayerCard, Text } from "@lark-ui/core";
import { CodeHighlighted } from "@lark-ui/core/code";
import { WarningIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { CollapseSizeExample } from "./CollapseSizeExample";

export interface DesignTipExample {
  variant: "good" | "bad";
  exampleCode?: string;
  jsx: ReactNode;
}

export interface DesignTip {
  id: string;
  title: string;
  description?: string;
  examples: DesignTipExample[];
}

interface CodeExampleProps {
  code: string;
}

export function CodeExample({ code }: CodeExampleProps) {
  return (
    <CodeHighlighted
      className="code-block p-2 p-6 [&_pre]:text-base!"
      code={code}
      lang="tsx"
      variant="plain"
    />
  );
}

export const designTips = [
  {
    id: "content-text-size",
    title: "正文文字使用 14px",
    description:
      "所有正文文字——正文、按钮、数据以及其他可交互元素——字号都必须为 14px。16px 及以上仅限用于标题和副标题。",
    examples: [
      {
        variant: "good",
        exampleCode: `<Text>正文文字</Text>`,
        jsx: (
          <LayerCard className="grid w-full gap-1 p-5">
            <Text as="h3" variant="heading">
              API 令牌
            </Text>
            <Text>生产令牌将在 30 天后过期。</Text>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text size="lg">正文文字</Text>`,
        jsx: (
          <LayerCard className="grid w-full gap-1 p-5">
            <Text as="h3" variant="heading">
              API 令牌
            </Text>
            <Text size="lg">生产令牌将在 30 天后过期。</Text>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "heading-case",
    title: "标题始终使用句首大写（sentence case）",
    description:
      "标题不要首字母大写，也不要全大写。产品名称则应使用标题式大写（title case）。",
    examples: [
      {
        variant: "good",
        exampleCode: `<Text as="h2">Recent requests</Text>`,
        jsx: (
          <LayerCard>
            <LayerCard.Secondary>Recent requests</LayerCard.Secondary>
            <LayerCard.Primary />
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text as="h2">Recent Requests</Text>`,
        jsx: (
          <LayerCard>
            <LayerCard.Secondary>
              <span className="capitalize">Recent Requests</span>
            </LayerCard.Secondary>
            <LayerCard.Primary />
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text as="h2" DANGEROUS_className="uppercase">Recent requests</Text>`,
        jsx: (
          <LayerCard>
            <LayerCard.Secondary>
              <span className="uppercase">Recent Requests</span>
            </LayerCard.Secondary>
            <LayerCard.Primary />
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "font-tracking",
    title: "不要改变字体的字间距",
    description: "不要使用 `tracking-*` 类来改变字符之间的间距。",
    examples: [
      {
        variant: "good",
        jsx: <span className="text-lg">Worker 指标</span>,
      },
      {
        variant: "bad",
        jsx: <span className="text-lg tracking-tight">Worker 指标</span>,
      },
    ],
  },
  {
    id: "font-weight",
    title: "不要使用 `font-bold`",
    description: "标题使用 `font-semibold`，加粗的行内文字使用 `font-medium`。",
    examples: [
      {
        variant: "good",
        exampleCode: `<Text as="h3" variant="heading">账户设置</Text>
<Text as="strong" bold>必需</Text>`,
        jsx: (
          <div className="grid gap-1">
            <Text as="h3" variant="heading">
              账户设置
            </Text>
            <Text>
              此操作是{" "}
              <Text as="strong" bold>
                必需
              </Text>
              。
            </Text>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text as="h3" DANGEROUS_className="font-bold">账户设置</Text>
<Text as="strong" DANGEROUS_className="font-bold">必需</Text>`,
        jsx: (
          <div className="grid gap-1">
            <Text as="h3" DANGEROUS_className="text-lg font-bold">
              账户设置
            </Text>
            <Text>
              此操作是{" "}
              <Text as="strong" DANGEROUS_className="font-bold">
                必需
              </Text>
              。
            </Text>
          </div>
        ),
      },
    ],
  },
  {
    id: "related-text-spacing",
    title: "让相关文字靠得更近",
    description: "相关文字周围的间距应小于它所属内容的间距。",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="grid gap-6">
  <div className="grid gap-1.5">
    <Text as="h3" variant="heading">Web Analytics</Text>
    <Text>无需改动代码即可衡量站点流量。</Text>
  </div>
  <Button>配置</Button>
</div>`,
        jsx: (
          <LayerCard className="w-full p-5">
            <div className="grid gap-6">
              <div className="grid gap-1.5">
                <Text as="h3" variant="heading">
                  Web Analytics
                </Text>
                <Text variant="secondary" DANGEROUS_className="text-pretty">
                  无需改动代码即可衡量站点流量。
                </Text>
              </div>
              <Button className="justify-self-start">配置</Button>
            </div>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="grid gap-4">
  <Text as="h3" variant="heading">Web Analytics</Text>
  <Text>无需改动代码即可衡量站点流量。</Text>
  <Button>配置</Button>
</div>`,
        jsx: (
          <LayerCard className="w-full p-5">
            <div className="grid gap-4">
              <Text as="h3" variant="heading">
                Web Analytics
              </Text>
              <Text variant="secondary" DANGEROUS_className="text-pretty">
                无需改动代码即可衡量站点流量。
              </Text>
              <Button className="justify-self-start">配置</Button>
            </div>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "text-spacing",
    title: "让文字周围的间距在视觉上对齐",
    description:
      "文字周围的间距应考虑其行高。通常这意味着垂直间距应略小于水平间距。",
    examples: [
      {
        variant: "good",
        exampleCode: `<LayerCard className="px-5 py-4">...</LayerCard>`,
        jsx: (
          <LayerCard className="px-5 py-4">
            <Text bold>生产环境</Text>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<LayerCard className="p-5">...</LayerCard>`,
        jsx: (
          <LayerCard className="p-5">
            <Text bold>生产环境</Text>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "hover-color-transitions",
    title: "悬停状态不要使用颜色过渡",
    description:
      "悬停时的颜色变化必须是即时的。快速交互中的过渡动画会让界面显得迟缓。",
    examples: [
      {
        variant: "good",
        exampleCode: `<button className="hover:bg-lark-tint">...</button>`,
        jsx: (
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-lark-base px-4 py-2 font-medium ring ring-lark-line hover:bg-lark-tint"
          >
            悬停试试
          </button>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<button className="transition-colors duration-300 hover:bg-lark-tint">...</button>`,
        jsx: (
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-lark-base px-4 py-2 font-medium ring ring-lark-line transition-colors duration-300 hover:bg-lark-tint"
          >
            悬停试试
          </button>
        ),
      },
    ],
  },
  {
    id: "shadow-borders",
    title: "不要同时使用边框和投影",
    description: "使用 `ring ring-lark-line` 打造透明边框，同时保持边缘锐利。",
    examples: [
      {
        variant: "good",
        exampleCode: `<LayerCard className="shadow-md ring ring-lark-line">...</LayerCard>`,
        jsx: (
          <LayerCard className="w-full shadow-md ring ring-lark-line">
            <LayerCard.Primary className="grid gap-1 p-5">
              <Text as="h3" variant="heading">
                Workers API
              </Text>
              <Text variant="secondary">4 分钟前完成部署</Text>
            </LayerCard.Primary>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<LayerCard className="border border-lark-line shadow-md">...</LayerCard>`,
        jsx: (
          <LayerCard className="w-full border border-lark-line shadow-md ring-0">
            <LayerCard.Primary className="grid gap-1 p-5 ring-0">
              <Text as="h3" variant="heading">
                Workers API
              </Text>
              <Text variant="secondary">4 分钟前完成部署</Text>
            </LayerCard.Primary>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "concentric-border-radius",
    title: "使用同心圆角",
    description:
      "当边框或描边（ring）相距不超过 8px 时，它们的圆角必须在数学上同心：外圆角 = 内圆角 + 内边距。",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="rounded-xl p-1">
  <div className="rounded-lg">...</div>
</div>`,
        jsx: (
          <div className="size-40 overflow-hidden">
            <div className="size-80 rounded-[48px] bg-lark-tint p-4 ring-2 ring-lark-line ring-inset">
              <div className="size-full rounded-4xl bg-lark-base ring-2 ring-lark-line ring-inset" />
            </div>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="rounded-xl p-1">
  <div className="rounded-xl">...</div>
</div>`,
        jsx: (
          <div className="size-40 overflow-hidden">
            <div className="size-80 rounded-[48px] bg-lark-tint p-4 ring-2 ring-lark-line ring-inset">
              <div className="size-full rounded-[48px] bg-lark-base ring-2 ring-lark-line ring-inset" />
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "icon-alignment",
    title: "让图标与文字首行对齐",
    description:
      "行内图标必须在视觉上与文字等大，并与文字垂直居中。多行对齐请使用 `h-lh flex items-center`。",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="flex items-start gap-2">
  <span className="h-lh flex items-center"><Icon /></span>
  <Text>可能换行成多行的文字</Text>
</div>`,
        jsx: (
          <div className="flex max-w-64 items-start gap-2">
            <span className="flex h-lh shrink-0 items-center">
              <WarningIcon aria-hidden="true" size={14} />
            </span>
            <Text>API 令牌的权限在创建后无法更改。</Text>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="flex items-start gap-2">
  <span className="flex items-center"><Icon /></span>
  <Text>可能换行成多行的文字</Text>
</div>`,
        jsx: (
          <div className="flex max-w-64 items-start gap-2">
            <span className="flex shrink-0 items-center">
              <WarningIcon aria-hidden="true" size={14} />
            </span>
            <Text>API 令牌的权限在创建后无法更改。</Text>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="flex items-center gap-2">
  <Icon />
  <Text>可能换行成多行的文字</Text>
</div>`,
        jsx: (
          <div className="flex max-w-64 items-center gap-2">
            <WarningIcon aria-hidden="true" className="shrink-0" size={14} />
            <Text>API 令牌的权限在创建后无法更改。</Text>
          </div>
        ),
      },
    ],
  },
  {
    id: "inline-monospace-size",
    title: "缩小行内等宽文字的字号",
    description: "等宽文字与常规文字混排时，字号应略小一些（约 0.9em）。",
    examples: [
      {
        variant: "good",
        jsx: (
          <Text size="lg">
            编辑{" "}
            <span className="font-mono text-[0.9em]">cloudflare.config.ts</span>{" "}
            后继续。
          </Text>
        ),
      },
      {
        variant: "bad",
        jsx: (
          <Text size="lg">
            编辑 <span className="font-mono">cloudflare.config.ts</span>{" "}
            后继续。
          </Text>
        ),
      },
    ],
  },
  {
    id: "sticky-borders",
    title: "使用 `border` 将粘性元素与内容分隔开",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="sticky top-0 border-b border-lark-line">...</div>`,
        jsx: (
          <LayerCard className="h-56 w-full overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-lark-line bg-lark-base px-3 py-2">
              <Text bold>API 令牌</Text>
              <Button size="sm">创建</Button>
            </div>
            <div className="grid gap-4 p-3">
              <Text>生产令牌</Text>
              <Text>预览令牌</Text>
              <Text>预发布令牌</Text>
              <Text>开发令牌</Text>
              <Text>测试令牌</Text>
              <Text>生产令牌</Text>
              <Text>预览令牌</Text>
              <Text>预发布令牌</Text>
              <Text>开发令牌</Text>
              <Text>测试令牌</Text>
            </div>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="sticky top-0">...</div>`,
        jsx: (
          <LayerCard className="h-56 w-full overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-lark-base px-3 py-2">
              <Text bold>API 令牌</Text>
              <Button size="sm">创建</Button>
            </div>
            <div className="grid gap-4 p-3">
              <Text>生产令牌</Text>
              <Text>预览令牌</Text>
              <Text>预发布令牌</Text>
              <Text>开发令牌</Text>
              <Text>测试令牌</Text>
              <Text>生产令牌</Text>
              <Text>预览令牌</Text>
              <Text>预发布令牌</Text>
              <Text>开发令牌</Text>
              <Text>测试令牌</Text>
            </div>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "collapse-content-size",
    title: "折叠动画期间保持内容尺寸",
    description:
      "折叠面板（Collapsible）在收起过程中必须保持内容尺寸，避免内容在动画期间发生位移。",
    examples: [
      {
        variant: "good",
        exampleCode: `<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-64">...</div>
</motion.div>`,
        jsx: <CollapseSizeExample preserveContentSize />,
      },
      {
        variant: "bad",
        exampleCode: `<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-full min-w-0">...</div>
</motion.div>`,
        jsx: <CollapseSizeExample />,
      },
    ],
  },
  {
    id: "layer-card-nesting",
    title: "不要让分层卡片（`LayerCard`）相互堆叠嵌套",
    examples: [
      {
        variant: "good",
        exampleCode: `<div>
  <Text as="h3">最近的请求</Text>
  <LayerCard>...</LayerCard>
</div>`,
        jsx: (
          <div className="grid w-full">
            <div className="flex h-10 items-center">
              <Text as="h3" bold>
                最近的请求
              </Text>
            </div>
            <LayerCard>
              <LayerCard.Secondary className="grid h-12 grid-cols-3 items-center gap-4 px-3 py-0">
                <Text bold size="sm">
                  时间
                </Text>
                <Text bold size="sm">
                  状态
                </Text>
                <Text bold size="sm">
                  查询
                </Text>
              </LayerCard.Secondary>
              <LayerCard.Primary className="grid h-10 grid-cols-3 items-center gap-4 px-3 py-0">
                <Text size="sm">00:50 UTC</Text>
                <Text size="sm" variant="error">
                  错误
                </Text>
                <Text size="sm">lark</Text>
              </LayerCard.Primary>
            </LayerCard>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<LayerCard>
  <Text as="h3">最近的请求</Text>
  <LayerCard>...</LayerCard>
</LayerCard>`,
        jsx: (
          <LayerCard className="w-full">
            <div className="flex h-10 items-center px-3">
              <Text as="h3" bold>
                最近的请求
              </Text>
            </div>
            <LayerCard>
              <LayerCard.Secondary className="grid h-12 grid-cols-3 gap-4 px-3 py-0">
                <Text bold>时间</Text>
                <Text bold>状态</Text>
                <Text bold>查询</Text>
              </LayerCard.Secondary>
              <LayerCard.Primary className="grid h-10 grid-cols-3 items-center gap-4 px-3 py-0">
                <Text>00:50 UTC</Text>
                <Text variant="error">错误</Text>
                <Text>lark</Text>
              </LayerCard.Primary>
            </LayerCard>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "dialog-rendering",
    title: "不要按条件渲染对话框",
    description:
      "按条件渲染对话框（Dialog）会让它的开关动画失效。请使用 `open` 属性来决定对话框是否可见。",
    examples: [
      {
        variant: "good",
        jsx: (
          <CodeExample
            code={`<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog>
    <Dialog.Title>编辑 Worker</Dialog.Title>
    <Dialog.Description>更新此 Worker 的设置。</Dialog.Description>
  </Dialog>
</Dialog.Root>`}
          />
        ),
      },
      {
        variant: "bad",
        jsx: (
          <CodeExample
            code={`{open && (
  <Dialog.Root open>
    <Dialog>
      <Dialog.Title>编辑 Worker</Dialog.Title>
    </Dialog>
  </Dialog.Root>
)}`}
          />
        ),
      },
    ],
  },
] satisfies DesignTip[];
