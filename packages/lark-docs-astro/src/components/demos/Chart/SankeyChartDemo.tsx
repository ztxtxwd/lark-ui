import { useState, useMemo } from "react";
import {
  SankeyChart,
  ChartPalette,
  type SankeyTooltipParams,
  type SankeyNodeData,
} from "@lark-ui/core";
import * as echarts from "echarts/core";
import { SankeyChart as SankeyChartType } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useIsDarkMode } from "~/lib/use-is-dark-mode";

echarts.use([SankeyChartType, TooltipComponent, CanvasRenderer]);

/** 转义 HTML 特殊字符，防止自定义工具提示中出现 XSS */
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const basicNodes = [
  { name: "用户", value: 103600, color: ChartPalette.categorical(0) },
  { name: "网络", value: 84100, color: ChartPalette.categorical(1) },
  { name: "设备", value: 50800, color: ChartPalette.categorical(2) },
  { name: "其他", value: 2000, color: ChartPalette.categorical(3) },
  { name: "应用", value: 122600, color: ChartPalette.categorical(4) },
  { name: "隧道", value: 87800, color: ChartPalette.categorical(5) },
  { name: "BYOIP", value: 29500, color: ChartPalette.categorical(6) },
  { name: "其他目标", value: 600, color: ChartPalette.categorical(7) },
];

const basicLinks = [
  { source: 0, target: 4, value: 80000 },
  { source: 0, target: 5, value: 20000 },
  { source: 0, target: 6, value: 3600 },
  { source: 1, target: 4, value: 30000 },
  { source: 1, target: 5, value: 50000 },
  { source: 1, target: 6, value: 4100 },
  { source: 2, target: 4, value: 10000 },
  { source: 2, target: 5, value: 15000 },
  { source: 2, target: 6, value: 20000 },
  { source: 2, target: 7, value: 5800 },
  { source: 3, target: 5, value: 1400 },
  { source: 3, target: 7, value: 600 },
];

export function SankeyChartBasicDemo() {
  const isDarkMode = useIsDarkMode();
  return (
    <SankeyChart
      echarts={echarts}
      nodes={basicNodes}
      links={basicLinks}
      height={350}
      isDarkMode={isDarkMode}
    />
  );
}

/** 图表索引卡片用的紧凑预览 */
export function SankeyChartPreviewDemo() {
  const isDarkMode = useIsDarkMode();
  const previewNodes = [
    { name: "A", color: ChartPalette.categorical(0) },
    { name: "B", color: ChartPalette.categorical(1) },
    { name: "C", color: ChartPalette.categorical(2) },
    { name: "X", color: ChartPalette.categorical(3) },
    { name: "Y", color: ChartPalette.categorical(4) },
  ];

  const previewLinks = [
    { source: 0, target: 3, value: 30 },
    { source: 0, target: 4, value: 20 },
    { source: 1, target: 3, value: 25 },
    { source: 1, target: 4, value: 15 },
    { source: 2, target: 4, value: 35 },
  ];

  return (
    <SankeyChart
      echarts={echarts}
      nodes={previewNodes}
      links={previewLinks}
      height={200}
      showTooltip={false}
      isDarkMode={isDarkMode}
    />
  );
}

const multiLevelNodes = [
  { name: "输入 1", color: ChartPalette.categorical(0) },
  { name: "输入 2", color: ChartPalette.categorical(1) },
  { name: "流程 A", color: ChartPalette.categorical(2) },
  { name: "流程 B", color: ChartPalette.categorical(3) },
  { name: "输出 X", color: ChartPalette.categorical(4) },
  { name: "输出 Y", color: ChartPalette.categorical(5) },
];

const multiLevelLinks = [
  { source: 0, target: 2, value: 40 },
  { source: 0, target: 3, value: 20 },
  { source: 1, target: 2, value: 30 },
  { source: 1, target: 3, value: 35 },
  { source: 2, target: 4, value: 50 },
  { source: 2, target: 5, value: 20 },
  { source: 3, target: 4, value: 25 },
  { source: 3, target: 5, value: 30 },
];

export function SankeyChartMultiLevelDemo() {
  const isDarkMode = useIsDarkMode();
  return (
    <SankeyChart
      echarts={echarts}
      nodes={multiLevelNodes}
      links={multiLevelLinks}
      height={350}
      nodeWidth={20}
      nodePadding={15}
      isDarkMode={isDarkMode}
    />
  );
}

export function SankeyChartCustomColorsDemo() {
  const isDarkMode = useIsDarkMode();
  const nodes = [
    { name: "收入", color: ChartPalette.categorical(0) },
    { name: "成本", color: ChartPalette.semantic("Attention") },
    { name: "利润", color: ChartPalette.categorical(2) },
    { name: "税费", color: ChartPalette.semantic("Warning") },
    { name: "净利润", color: ChartPalette.categorical(4) },
  ];

  const links = [
    { source: 0, target: 2, value: 70 },
    { source: 1, target: 2, value: -30 },
    { source: 2, target: 3, value: 15 },
    { source: 2, target: 4, value: 55 },
  ];

  return (
    <SankeyChart
      echarts={echarts}
      nodes={nodes}
      links={links}
      height={250}
      linkOpacity={0.6}
      isDarkMode={isDarkMode}
    />
  );
}

/** 带详细工具提示数据的示例 */
export function SankeyChartTooltipDemo() {
  const isDarkMode = useIsDarkMode();
  const nodes: SankeyNodeData[] = [
    {
      name: "应用",
      value: 122600,
      color: ChartPalette.categorical(0),
      tooltipData: { 应用: 166, 会话数: 122600 },
    },
    {
      name: "隧道",
      value: 31800,
      color: ChartPalette.categorical(1),
      tooltipData: { 隧道: 42, 会话数: 31800 },
    },
    {
      name: "用户",
      value: 103600,
      color: ChartPalette.categorical(2),
      tooltipData: { 用户: 1250, 会话数: 103600 },
    },
    {
      name: "设备",
      value: 50800,
      color: ChartPalette.categorical(3),
      tooltipData: { 设备: 890, 会话数: 50800 },
    },
  ];

  const links = [
    { source: 2, target: 0, value: 80000 },
    { source: 2, target: 1, value: 23600 },
    { source: 3, target: 0, value: 42600 },
    { source: 3, target: 1, value: 8200 },
  ];

  return (
    <SankeyChart
      echarts={echarts}
      nodes={nodes}
      links={links}
      height={300}
      isDarkMode={isDarkMode}
    />
  );
}

/** 使用自定义富文本工具提示格式化器的示例 */
export function SankeyChartRichTooltipDemo() {
  const isDarkMode = useIsDarkMode();
  const nodes: SankeyNodeData[] = [
    {
      name: "应用",
      value: 122600,
      color: ChartPalette.categorical(0),
      tooltipData: { 应用: 166, 会话数: 122600 },
    },
    {
      name: "隧道",
      value: 31800,
      color: ChartPalette.categorical(1),
      tooltipData: { 隧道: 42, 会话数: 31800 },
    },
    {
      name: "用户",
      value: 103600,
      color: ChartPalette.categorical(2),
      tooltipData: { 用户: 1250, 会话数: 103600 },
    },
    {
      name: "设备",
      value: 50800,
      color: ChartPalette.categorical(3),
      tooltipData: { 设备: 890, 会话数: 50800 },
    },
  ];

  const links = [
    { source: 2, target: 0, value: 80000 },
    { source: 2, target: 1, value: 23600 },
    { source: 3, target: 0, value: 42600 },
    { source: 3, target: 1, value: 8200 },
  ];

  const customTooltip = (params: SankeyTooltipParams) => {
    if (params.type === "node" && params.node) {
      const { tooltipData } = params.node;
      const safeName = escapeHtml(params.name);
      let html = `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${params.color}"></span>
        <strong>${safeName}</strong>
      </div>`;

      if (tooltipData) {
        for (const [key, val] of Object.entries(tooltipData)) {
          const safeKey = escapeHtml(key);
          const formatted =
            typeof val === "number"
              ? val.toLocaleString()
              : escapeHtml(String(val));
          html += `<div style="display:flex;justify-content:space-between;gap:16px;">
            <span>${safeKey}</span><strong>${formatted}</strong>
          </div>`;
        }
      }
      return html;
    }

    if (params.type === "link" && params.link) {
      const safeSource = escapeHtml(params.link.source);
      const safeTarget = escapeHtml(params.link.target);
      return `${safeSource} → ${safeTarget}: <strong>${params.link.value.toLocaleString()}</strong>`;
    }

    return "";
  };

  return (
    <SankeyChart
      echarts={echarts}
      nodes={nodes}
      links={links}
      height={300}
      tooltipFormatter={customTooltip}
      isDarkMode={isDarkMode}
    />
  );
}

/** 通过 left={0} 和 right={0} 实现全宽布局、去掉默认内边距的示例 */
export function SankeyChartFullWidthDemo() {
  const isDarkMode = useIsDarkMode();
  return (
    <SankeyChart
      echarts={echarts}
      nodes={basicNodes}
      links={basicLinks}
      height={350}
      left={0}
      right={0}
      isDarkMode={isDarkMode}
    />
  );
}

export function SankeyChartInteractiveDemo() {
  const isDarkMode = useIsDarkMode();
  const handleNodeClick = (node: { name: string }) => {
    console.log("节点已点击：", node.name);
  };

  const handleLinkClick = (link: {
    source: number;
    target: number;
    value: number;
  }) => {
    console.log("连线已点击：", link);
  };

  return (
    <SankeyChart
      echarts={echarts}
      nodes={basicNodes}
      links={basicLinks}
      height={350}
      onNodeClick={handleNodeClick}
      onLinkClick={handleLinkClick}
      isDarkMode={isDarkMode}
    />
  );
}

/** 点击节点时筛选数据以实现下钻的示例 */
export function SankeyChartDrillDownDemo() {
  const isDarkMode = useIsDarkMode();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // 完整数据集
  const allNodes = [
    { name: "用户", value: 103600, color: ChartPalette.categorical(0) },
    { name: "网络", value: 84100, color: ChartPalette.categorical(1) },
    { name: "设备", value: 50800, color: ChartPalette.categorical(2) },
    { name: "应用", value: 122600, color: ChartPalette.categorical(3) },
    { name: "隧道", value: 87800, color: ChartPalette.categorical(4) },
    { name: "BYOIP", value: 29500, color: ChartPalette.categorical(5) },
  ];

  const allLinks = [
    { source: 0, target: 3, value: 80000 },
    { source: 0, target: 4, value: 20000 },
    { source: 0, target: 5, value: 3600 },
    { source: 1, target: 3, value: 30000 },
    { source: 1, target: 4, value: 50000 },
    { source: 1, target: 5, value: 4100 },
    { source: 2, target: 3, value: 12600 },
    { source: 2, target: 4, value: 17800 },
    { source: 2, target: 5, value: 20400 },
  ];

  // 源节点与目标节点的名称
  const sourceNames = ["用户", "网络", "设备"];
  const targetNames = ["应用", "隧道", "BYOIP"];

  // 同时计算过滤后的节点与连线，避免循环依赖，并按过滤后的连线重新计算节点数值
  const { filteredNodes, filteredLinks } = useMemo(() => {
    if (!selectedSource && !selectedTarget) {
      return { filteredNodes: allNodes, filteredLinks: allLinks };
    }

    // 先确定需要包含哪些连线
    let relevantLinks = allLinks;
    if (selectedSource && selectedTarget) {
      const sourceIdx = allNodes.findIndex((n) => n.name === selectedSource);
      const targetIdx = allNodes.findIndex((n) => n.name === selectedTarget);
      relevantLinks = allLinks.filter(
        (l) => l.source === sourceIdx && l.target === targetIdx,
      );
    } else if (selectedSource) {
      const sourceIdx = allNodes.findIndex((n) => n.name === selectedSource);
      relevantLinks = allLinks.filter((l) => l.source === sourceIdx);
    } else if (selectedTarget) {
      const targetIdx = allNodes.findIndex((n) => n.name === selectedTarget);
      relevantLinks = allLinks.filter((l) => l.target === targetIdx);
    }

    // 确定相关连线涉及哪些节点
    const involvedNodeIndices = new Set<number>();
    for (const link of relevantLinks) {
      involvedNodeIndices.add(link.source);
      involvedNodeIndices.add(link.target);
    }

    // 基于连线流量重新计算数值，构建过滤后的节点
    const nodeValueMap = new Map<string, number>();
    for (const link of relevantLinks) {
      const sourceName = allNodes[link.source]?.name;
      const targetName = allNodes[link.target]?.name;
      if (sourceName) {
        nodeValueMap.set(
          sourceName,
          (nodeValueMap.get(sourceName) ?? 0) + link.value,
        );
      }
      if (targetName) {
        nodeValueMap.set(
          targetName,
          (nodeValueMap.get(targetName) ?? 0) + link.value,
        );
      }
    }

    const nodes = allNodes
      .filter((_, idx) => involvedNodeIndices.has(idx))
      .map((node) => ({
        ...node,
        value: nodeValueMap.get(node.name) ?? node.value,
      }));

    // 将连线索引重新映射到新的过滤后节点数组
    const nodeIndexMap = new Map(nodes.map((n, idx) => [n.name, idx]));
    const links = relevantLinks.map((link) => ({
      ...link,
      source: nodeIndexMap.get(allNodes[link.source]?.name ?? "") ?? 0,
      target: nodeIndexMap.get(allNodes[link.target]?.name ?? "") ?? 0,
    }));

    return { filteredNodes: nodes, filteredLinks: links };
  }, [selectedSource, selectedTarget]);

  const handleNodeClick = (node: { name: string }) => {
    if (sourceNames.includes(node.name)) {
      // 切换源节点的选中状态
      setSelectedSource((prev) => (prev === node.name ? null : node.name));
    } else if (targetNames.includes(node.name)) {
      // 切换目标节点的选中状态
      setSelectedTarget((prev) => (prev === node.name ? null : node.name));
    }
  };

  const resetFilters = () => {
    setSelectedSource(null);
    setSelectedTarget(null);
  };

  const hasSelection = selectedSource || selectedTarget;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2 text-sm text-lark-subtle">
        <span>
          {hasSelection
            ? `显示：${[selectedSource, selectedTarget].filter(Boolean).join(" → ")}`
            : "点击节点进行筛选"}
        </span>
        {hasSelection && (
          <button
            onClick={resetFilters}
            className="text-lark-brand hover:underline"
          >
            重置
          </button>
        )}
      </div>
      <SankeyChart
        echarts={echarts}
        nodes={filteredNodes}
        links={filteredLinks}
        height={300}
        onNodeClick={handleNodeClick}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

/** 为小节点展示行内标签布局的示例 */
export function SankeyChartInlineLabelDemo() {
  const isDarkMode = useIsDarkMode();

  // 包含大量小节点的数据，堆叠标签会相互重叠
  const nodes = [
    { name: "工作负载", value: 109870 },
    { name: "用户", value: 45 },
    { name: "API 管理", value: 42 },
    { name: "设备注册", value: 38 },
    { name: "服务令牌", value: 109870 },
    { name: "自托管", value: 109826 },
    { name: "隧道", value: 87 },
    { name: "网格", value: 87 },
  ];

  const links = [
    { source: 0, target: 4, value: 80000 },
    { source: 0, target: 5, value: 29870 },
    { source: 1, target: 5, value: 45 },
    { source: 2, target: 6, value: 42 },
    { source: 3, target: 7, value: 38 },
  ];

  return (
    <SankeyChart
      echarts={echarts}
      nodes={nodes}
      links={links}
      height={300}
      nodeLabelLayout="inline"
      isDarkMode={isDarkMode}
    />
  );
}
