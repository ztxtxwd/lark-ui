import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../Button";
import { Loading } from "./Loading";
import { Skeleton, SkeletonAvatar, SkeletonContent } from "./Skeleton";

const meta = {
  title: "Components/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书加载中。骨架屏用于初始空页面加载，Spin 用于较小的局部加载或使用中的状态切换：\n\n" +
          "- 尺寸：14 / 24 / 40px，对应小 / 中 / 大，遵循 4N 规则\n" +
          "- 颜色：主色 B500、深色背景 N00、灰色占位 N400\n" +
          "- 描述：14px Regular N600，纵向小 / 中间距 0 / 4px，大 12px；横向间距 8px\n" +
          "- 蒙层：覆盖当前模块，60% 画布色蒙层，模块内容 inert\n" +
          "- 骨架屏：N900 5% → 8% 渐变，2s 线性扫光；头像 32px 圆形、文本 14px / 2px 圆角、图片与真实图片同尺寸，仅用于初始空页面加载\n" +
          "- 无障碍：role=status + aria-live=polite，默认名称「加载中」",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    tone: { control: "select", options: ["primary", "neutral", "inverse"] },
    direction: { control: "select", options: ["vertical", "horizontal"] },
    centered: { control: "boolean" },
    overlay: { control: "boolean" },
  },
  args: {
    size: "md",
    tone: "primary",
    direction: "vertical",
    centered: false,
    overlay: false,
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTip: Story = {
  args: { tip: "正在加载" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-10">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Loading key={size} {...args} size={size} tip={size.toUpperCase()} />
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <Loading {...args} tone="primary" tip="主色" />
      <Loading {...args} tone="neutral" tip="中性色" />
      <div className="rounded-lark-lg bg-lark-neutral-900 p-6">
        <Loading {...args} tone="inverse" aria-label="反白加载" />
      </div>
    </div>
  ),
};

export const Horizontal: Story = {
  args: { tip: "正在同步", direction: "horizontal" },
};

export const Centered: Story = {
  render: (args) => (
    <div className="w-96 rounded-lark-lg border border-lark-border-card py-12">
      <Loading {...args} centered tip="正在加载列表" />
    </div>
  ),
};

export const Overlay: Story = {
  render: (args) => (
    <Loading {...args} overlay tip="正在保存">
      <div className="w-96 rounded-lark-lg border border-lark-border-card p-6">
        <div className="mb-4 h-4 w-40 rounded-lark-xs bg-lark-filler" />
        <div className="mb-4 h-4 w-full rounded-lark-xs bg-lark-filler" />
        <div className="h-4 w-2/3 rounded-lark-xs bg-lark-filler" />
      </div>
    </Loading>
  ),
};

function SkeletonCard({ loading }: { loading: boolean }) {
  return (
    <Skeleton
      loading={loading}
      className="w-96"
      placeholder={
        <div className="rounded-lark-lg border border-lark-border-card p-4">
          <div className="flex items-center gap-3">
            <SkeletonAvatar size={40} />
            <div className="flex-1 space-y-2">
              <SkeletonContent width="35%" />
              <SkeletonContent width="55%" />
            </div>
          </div>
          <SkeletonContent className="mt-4" height={120} shape="image" />
          <SkeletonContent className="mt-4" />
          <SkeletonContent className="mt-2" width="80%" />
        </div>
      }
    >
      <div className="w-96 rounded-lark-lg border border-lark-border-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lark-full bg-lark-primary-soft text-lark-primary-content">
            林
          </div>
          <div>
            <div className="text-lark-title">林晓</div>
            <div className="text-lark-12 text-lark-caption">产品设计 · 刚刚</div>
          </div>
        </div>
        <div className="mt-4 flex h-[120px] items-center justify-center rounded-lark-md bg-lark-filler text-lark-caption">
          图片
        </div>
        <p className="mt-4 text-lark-body">
          骨架屏用可预估的内容形态替代空白页面，加载完成后立即显示真实内容。
        </p>
      </div>
    </Skeleton>
  );
}

export const SkeletonScreen: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);

    return (
      <div className="flex flex-col items-start gap-4">
        <Button appearance="outlined" size="sm" onClick={() => setLoading((value) => !value)}>
          {loading ? "显示已加载内容" : "重新加载"}
        </Button>
        <SkeletonCard loading={loading} />
      </div>
    );
  },
};

export const SkeletonElements: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex items-center gap-3">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <SkeletonContent width="45%" />
          <SkeletonContent width="30%" />
        </div>
      </div>
      <SkeletonContent height={120} shape="image" />
      <div className="space-y-2">
        <SkeletonContent />
        <SkeletonContent />
        <SkeletonContent width="65%" />
      </div>
    </div>
  ),
};

export const SkeletonStatic: Story = {
  render: () => (
    <Skeleton
      animation={false}
      className="w-80"
      placeholder={
        <div className="space-y-2">
          <SkeletonContent />
          <SkeletonContent />
          <SkeletonContent width="65%" />
        </div>
      }
    />
  ),
};
