import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Design Tokens",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Universe Design tokens extracted from Feishu 7.72 `theme.css` and the official design specification. " +
          "Every component consumes these variables through the `--lark-*` CSS custom properties and Tailwind utilities.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const brand = [
  ["Primary", "bg-lark-primary", "#1456F0"],
  ["Primary hover", "bg-lark-primary-hover", "#336DF4"],
  ["Primary pressed", "bg-lark-primary-pressed", "#0442D2"],
  ["Primary soft", "bg-lark-primary-soft", "#E0E9FF"],
  ["Primary softer", "bg-lark-primary-softer", "#C2D4FF"],
  ["Primary loading", "bg-lark-primary-loading", "#94B4FF"],
] as const;

const text = [
  ["Title / body", "bg-lark-title", "#1F2329"],
  ["Caption", "bg-lark-caption", "#646A73"],
  ["Placeholder", "bg-lark-placeholder", "#8F959E"],
  ["Disabled", "bg-lark-disabled", "#BBBFC4"],
  ["Link", "bg-lark-link", "#1456F0"],
] as const;

const surfaces = [
  ["Canvas", "bg-lark-canvas", "#FFFFFF"],
  ["Base", "bg-lark-base", "#F2F3F5"],
  ["Overlay", "bg-lark-overlay", "#F5F6F7"],
  ["Content", "bg-lark-content", "#F8F9FA"],
  ["Filler", "bg-lark-filler", "#EFF0F1"],
  ["Border", "bg-lark-border", "#D0D3D6"],
] as const;

const functional = [
  ["Danger", "bg-lark-danger", "#F54A45"],
  ["Success", "bg-lark-success", "#35BD4B"],
  ["Warning", "bg-lark-warning", "#FF811A"],
  ["Info", "bg-lark-info", "#1456F0"],
] as const;

const neutral = [
  ["50", "bg-lark-neutral-50", "#F5F6F7"],
  ["100", "bg-lark-neutral-100", "#F2F3F5"],
  ["200", "bg-lark-neutral-200", "#EFF0F1"],
  ["300", "bg-lark-neutral-300", "#DEE0E3"],
  ["350", "bg-lark-neutral-350", "#D0D3D6"],
  ["400", "bg-lark-neutral-400", "#BBBFC4"],
  ["500", "bg-lark-neutral-500", "#8F959E"],
  ["600", "bg-lark-neutral-600", "#646A73"],
  ["700", "bg-lark-neutral-700", "#373C43"],
  ["800", "bg-lark-neutral-800", "#2B2F36"],
  ["900", "bg-lark-neutral-900", "#1F2329"],
] as const;

const typeScale = [
  ["32 / 40 · Semibold", "text-lark-32 font-semibold", "飞书设计系统"],
  ["24 / 32 · Semibold", "text-lark-24 font-semibold", "页面标题 Heading"],
  ["20 / 28 · Medium", "text-lark-20 font-medium", "模块标题 Section"],
  ["18 / 26 · Medium", "text-lark-18 font-medium", "对话框标题"],
  ["16 / 24 · Medium", "text-lark-16 font-medium", "卡片标题"],
  ["14 / 22 · Regular", "text-lark-14", "正文与表单默认字号"],
  ["12 / 20 · Regular", "text-lark-12", "辅助说明与标签"],
] as const;

function TokenGrid({
  title,
  tokens,
}: {
  title: string;
  tokens: readonly (readonly [string, string, string])[];
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lark-16 font-medium text-lark-title">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {tokens.map(([name, className, value]) => (
          <div
            key={name}
            className="overflow-hidden rounded-lark-md border border-lark-border-card bg-lark-canvas"
          >
            <div className={`h-14 ${className} border-b border-lark-border-card`} />
            <div className="space-y-0.5 px-3 py-2">
              <p className="text-lark-12 leading-5 font-medium text-lark-title">{name}</p>
              <p className="font-mono text-[11px] leading-4 text-lark-caption">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const Colors: Story = {
  render: () => (
    <div className="min-h-screen space-y-8 bg-lark-canvas p-8">
      <header className="space-y-1">
        <p className="text-lark-12 text-lark-caption">Foundations</p>
        <h1 className="text-lark-24 font-semibold text-lark-title">色彩 Colors</h1>
        <p className="text-lark-14 text-lark-caption">
          UD 色彩系统：品牌蓝 #1456F0，中性色 N00–N900，功能色与交互填充。
        </p>
      </header>
      <TokenGrid title="品牌色 Brand" tokens={brand} />
      <TokenGrid title="文字 Text" tokens={text} />
      <TokenGrid title="背景与描边 Surfaces & borders" tokens={surfaces} />
      <TokenGrid title="功能色 Functional" tokens={functional} />
      <TokenGrid title="中性色 Neutral" tokens={neutral} />
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="min-h-screen space-y-8 bg-lark-canvas p-8">
      <header className="space-y-1">
        <p className="text-lark-12 text-lark-caption">Foundations</p>
        <h1 className="text-lark-24 font-semibold text-lark-title">字体 Typography</h1>
        <p className="text-lark-14 text-lark-caption">
          飞书 PC 字阶。常规 400，强调 500，大标题 600；行高按官方规范绑定。
        </p>
      </header>
      <div className="space-y-5 rounded-lark-lg border border-lark-border-card bg-lark-canvas p-6">
        {typeScale.map(([spec, className, sample]) => (
          <div
            key={spec}
            className="flex items-baseline gap-6 border-b border-lark-border-card pb-4 last:border-0 last:pb-0"
          >
            <span className="w-44 shrink-0 font-mono text-[11px] text-lark-caption">{spec}</span>
            <span className={`${className} text-lark-title`}>{sample}</span>
          </div>
        ))}
      </div>
      <section className="space-y-3">
        <h2 className="text-lark-16 font-medium text-lark-title">字体家族 Font stack</h2>
        <p className="rounded-lark-md border border-lark-border-card bg-lark-canvas p-4 font-mono text-[12px] leading-6 text-lark-caption">
          Inter, SF Pro Text, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino
          Sans GB, LarkHaiti, Helvetica Neue, Arial, sans-serif
        </p>
      </section>
    </div>
  ),
};

export const RadiusAndShadow: Story = {
  render: () => (
    <div className="min-h-screen space-y-8 bg-lark-canvas p-8">
      <header className="space-y-1">
        <p className="text-lark-12 text-lark-caption">Foundations</p>
        <h1 className="text-lark-24 font-semibold text-lark-title">
          圆角与投影 Radius & elevation
        </h1>
      </header>
      <section className="space-y-3">
        <h2 className="text-lark-16 font-medium text-lark-title">圆角 Radius</h2>
        <div className="flex flex-wrap gap-6">
          {[
            ["xs · 2px", "rounded-lark-xs"],
            ["sm · 4px", "rounded-lark-sm"],
            ["md · 6px", "rounded-lark-md"],
            ["lg · 8px", "rounded-lark-lg"],
            ["xl · 12px", "rounded-lark-xl"],
            ["2xl · 16px", "rounded-lark-2xl"],
            ["full", "rounded-lark-full"],
          ].map(([label, className]) => (
            <div key={label} className="space-y-2 text-center">
              <div
                className={`size-20 border border-lark-border-card bg-lark-primary-soft ${className}`}
              />
              <p className="text-lark-12 text-lark-caption">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-lark-16 font-medium text-lark-title">投影 Elevation</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {[
            ["s1", "shadow-lark-1"],
            ["s2", "shadow-lark-2"],
            ["s3", "shadow-lark-3"],
            ["s4", "shadow-lark-4"],
            ["s5", "shadow-lark-5"],
          ].map(([label, className]) => (
            <div
              key={label}
              className={`flex h-24 items-center justify-center rounded-lark-lg bg-lark-canvas ${className}`}
            >
              <span className="text-lark-14 text-lark-caption">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
