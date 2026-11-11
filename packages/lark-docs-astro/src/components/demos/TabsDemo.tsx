import { useState } from "react";
import { Tabs } from "@lark-ui/core";

const productionLikeTabs = [
  { value: "overview", label: "概览" },
  { value: "metrics", label: "指标" },
  { value: "deployments", label: "部署" },
  { value: "observability", label: "可观测性" },
  { value: "domains", label: "域名" },
  { value: "access", label: "访问" },
  { value: "settings", label: "设置" },
];

const productionLikeExtraTabs = [
  { value: "analytics", label: "分析" },
  { value: "logs", label: "日志" },
  { value: "security", label: "安全" },
];

export function TabsDefaultDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div>
        <p className="mb-2 text-sm text-lark-subtle">分段（默认）</p>
        <Tabs
          variant="segmented"
          tabs={[
            { value: "tab1", label: "标签页 1" },
            { value: "tab2", label: "标签页 2" },
            { value: "tab3", label: "标签页 3" },
          ]}
          selectedValue="tab1"
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-lark-subtle">下划线</p>
        <Tabs
          variant="underline"
          tabs={[
            { value: "tab1", label: "标签页 1" },
            { value: "tab2", label: "标签页 2" },
            { value: "tab3", label: "标签页 3" },
          ]}
          selectedValue="tab1"
        />
      </div>
    </div>
  );
}

export function TabsSegmentedDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div>
        <p className="mb-2 text-sm text-lark-subtle">贴合文字（默认）</p>
        <Tabs
          variant="segmented"
          tabs={[
            { value: "tab1", label: "标签页 1" },
            { value: "tab2", label: "标签页 2" },
            { value: "tab3", label: "标签页 3" },
          ]}
          selectedValue="tab1"
        />
      </div>
      <div className="w-64">
        <p className="mb-2 text-sm text-lark-subtle">撑满轨道（fill）</p>
        <Tabs
          variant="segmented"
          fill
          tabs={[
            { value: "tab1", label: "标签页 1" },
            { value: "tab2", label: "标签页 2" },
            { value: "tab3", label: "标签页 3" },
          ]}
          selectedValue="tab1"
        />
      </div>
    </div>
  );
}

export function TabsFillDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-64">
        <p className="mb-2 text-sm text-lark-subtle">三段等分</p>
        <Tabs
          variant="segmented"
          fill
          tabs={[
            { value: "adaptive", label: "自适应" },
            { value: "weighted", label: "按权重" },
            { value: "custom", label: "自定义" },
          ]}
          selectedValue="weighted"
        />
      </div>
      <div className="w-64">
        <p className="mb-2 text-sm text-lark-subtle">两段等分</p>
        <Tabs
          variant="segmented"
          fill
          tabs={[
            { value: "auto", label: "自动" },
            { value: "manual", label: "手动" },
          ]}
          selectedValue="auto"
        />
      </div>
    </div>
  );
}

export function TabsUnderlineDemo() {
  return (
    <Tabs
      variant="underline"
      tabs={[
        { value: "tab1", label: "标签页 1" },
        { value: "tab2", label: "标签页 2" },
        { value: "tab3", label: "标签页 3" },
      ]}
      selectedValue="tab1"
    />
  );
}

export function TabsControlledDemo() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { value: "tab1", label: "Tab 1" },
          { value: "tab2", label: "Tab 2" },
          { value: "tab3", label: "Tab 3" },
        ]}
        value={activeTab}
        onValueChange={setActiveTab}
      />
      <p className="text-sm text-lark-subtle">
        当前标签页：<code className="text-sm">{activeTab}</code>
      </p>
    </div>
  );
}

export function TabsManyDemo() {
  return (
    <div className="w-full max-w-md">
      <Tabs
        tabs={[
          { value: "overview", label: "概览" },
          { value: "analytics", label: "分析" },
          { value: "reports", label: "报告" },
          { value: "notifications", label: "通知" },
          { value: "settings", label: "设置" },
          { value: "billing", label: "计费" },
          { value: "security", label: "安全" },
          { value: "integrations", label: "集成" },
          { value: "logs", label: "日志" },
          { value: "audit", label: "审计" },
          { value: "members", label: "成员" },
          { value: "advanced", label: "高级" },
        ]}
        selectedValue="overview"
      />
    </div>
  );
}

export function TabsOverflowDemo() {
  return (
    <div className="w-full max-w-xs">
      <Tabs
        tabs={[
          { value: "overview", label: "概览" },
          { value: "analytics", label: "分析" },
          { value: "reports", label: "报告" },
          { value: "notifications", label: "通知" },
          { value: "settings", label: "设置" },
          { value: "billing", label: "计费" },
          { value: "security", label: "安全" },
          { value: "integrations", label: "集成" },
        ]}
        selectedValue="overview"
      />
    </div>
  );
}

export function TabsDynamicCountDemo() {
  const [showExtraTabs, setShowExtraTabs] = useState(true);
  const tabs = showExtraTabs
    ? [...productionLikeTabs, ...productionLikeExtraTabs]
    : productionLikeTabs;

  return (
    <div className="space-y-3">
      <div className="w-full max-w-[420px]">
        <Tabs tabs={tabs} selectedValue="settings" />
      </div>
      <div className="flex items-center gap-3 text-sm text-lark-subtle">
        <button
          type="button"
          className="rounded-md border border-lark-line bg-lark-base px-2.5 py-1 text-lark-default hover:bg-lark-tint focus:ring-2 focus:ring-lark-brand focus:outline-none"
          onClick={() => setShowExtraTabs((current) => !current)}
        >
          切换额外标签页
        </button>
        <span>{showExtraTabs ? "10 个标签页" : "7 个标签页"}</span>
      </div>
    </div>
  );
}

export function TabsSmDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div>
        <p className="mb-2 text-sm text-lark-subtle">分段 sm</p>
        <Tabs
          variant="segmented"
          size="sm"
          tabs={[
            { value: "tab1", label: "标签页 1" },
            { value: "tab2", label: "标签页 2" },
            { value: "tab3", label: "标签页 3" },
          ]}
          selectedValue="tab1"
        />
      </div>
      <div className="w-60">
        <p className="mb-2 text-sm text-lark-subtle">分段 sm · fill</p>
        <Tabs
          variant="segmented"
          size="sm"
          fill
          tabs={[
            { value: "tab1", label: "标签页 1" },
            { value: "tab2", label: "标签页 2" },
            { value: "tab3", label: "标签页 3" },
          ]}
          selectedValue="tab1"
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-lark-subtle">下划线 sm</p>
        <Tabs
          variant="underline"
          size="sm"
          tabs={[
            { value: "tab1", label: "标签页 1" },
            { value: "tab2", label: "标签页 2" },
            { value: "tab3", label: "标签页 3" },
          ]}
          selectedValue="tab1"
        />
      </div>
    </div>
  );
}

export function TabsRenderPropDemo() {
  return (
    <Tabs
      tabs={[
        {
          value: "tab1",
          label: "普通标签页",
        },
        {
          value: "tab2",
          label: "链接标签页",
          nativeButton: false,
          render: (props) => <a {...props} href="#tab2" />,
        },
        {
          value: "tab3",
          label: "Lark",
          nativeButton: false,
          render: (props) => (
            <a {...props} href="https://cloudflare.com" target="_blank" />
          ),
        },
      ]}
      selectedValue="tab1"
    />
  );
}
