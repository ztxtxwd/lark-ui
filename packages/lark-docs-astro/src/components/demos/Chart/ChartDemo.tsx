import {
  ChartPalette,
  TimeseriesChart,
  Chart,
  ChartLegend,
  LayerCard,
  Select,
  Switch,
} from "@lark-ui/core";
import * as echarts from "echarts/core";
import type { EChartsOption } from "echarts";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIsDarkMode } from "~/lib/use-is-dark-mode";
import {
  AriaComponent,
  AxisPointerComponent,
  BrushComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { LabelLayout, UniversalTransition } from "echarts/features";

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  AxisPointerComponent,
  BrushComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  ToolboxComponent,
  TooltipComponent,
  AriaComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

export function PieChartDemo() {
  const isDarkMode = useIsDarkMode();

  const options = useMemo<EChartsOption>(
    () => ({
      animation: true,
      animationDuration: 2000,
      tooltip: {
        show: true,
      },
      series: [
        {
          type: "pie",
          data: [
            { value: 101, name: "系列 A" },
            { value: 202, name: "系列 B" },
            { value: 303, name: "系列 C" },
            { value: 404, name: "系列 D" },
            { value: 505, name: "系列 E" },
          ],
        },
      ],
    }),
    [],
  );

  return (
    <Chart
      echarts={echarts}
      options={options}
      height={400}
      isDarkMode={isDarkMode}
    />
  );
}

/**
 * 基础折线图示例，展示简单的时间序列数据可视化。
 */
export function BasicLineChartDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "请求数",
        data: buildSeriesData(0, 50, 60_000, 1),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
      {
        name: "错误数",
        data: buildSeriesData(1, 50, 60_000, 0.3),
        color: ChartPalette.semantic("Attention", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <TimeseriesChart
      echarts={echarts}
      isDarkMode={isDarkMode}
      data={data}
      xAxisName="时间（UTC）"
      yAxisName="数量"
    />
  );
}

/**
 * 请求数离散图表，Y 轴刻度为整数。
 */
export function IntegerYAxisChartDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(() => {
    const end = Date.now();
    const values = [0, 1, 3, 2, 5, 4, 7, 3, 6, 2, 4, 1];

    return [
      {
        name: "请求数",
        data: values.map((value, index): [number, number] => [
          end - (values.length - index - 1) * 60_000,
          value,
        ]),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
    ];
  }, [isDarkMode]);

  return (
    <TimeseriesChart
      echarts={echarts}
      isDarkMode={isDarkMode}
      data={data}
      xAxisName="时间（UTC）"
      yAxisName="请求数"
      yAxisMinInterval={1}
    />
  );
}

export function ReferenceMarkersChartDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "请求数",
        data: buildSeriesData(0, 50, 60_000, 1),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
      {
        name: "错误数",
        data: buildSeriesData(1, 50, 60_000, 0.3),
        color: ChartPalette.semantic("Attention", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  const markers = useMemo(
    () => [
      {
        timestamp: data[0].data[15][0],
        label: "变更 a1b2c3d4",
        description: "已应用配置变更",
      },
      {
        timestamp: data[0].data[16][0],
        label: "变更 b2c3d4e5",
        description: "路由规则已更新",
      },
      {
        timestamp: data[0].data[17][0],
        label: "变更 c3d4e5f6",
        description: "限额已调整",
      },
      {
        timestamp: data[0].data[34][0],
        label: "变更 e5f6g7h8",
        description: "已发布新版本",
        lineStyle: "dotted" as const,
      },
    ],
    [data],
  );

  return (
    <TimeseriesChart
      echarts={echarts}
      isDarkMode={isDarkMode}
      data={data}
      markers={markers}
      xAxisName="时间（UTC）"
      yAxisName="数量"
    />
  );
}

export function ThresholdsChartDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "已用内存",
        data: buildSeriesData(0, 50, 60_000, 1),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <TimeseriesChart
      echarts={echarts}
      isDarkMode={isDarkMode}
      data={data}
      thresholds={[
        {
          value: 55,
          label: "内存上限",
          color: ChartPalette.semantic("Attention", isDarkMode),
        },
      ]}
      xAxisName="时间（UTC）"
      yAxisName="内存（MB）"
    />
  );
}

/** 使用自定义 UTC 时间戳和紧凑数值格式的时间序列图。 */
export function CustomAxisLabelFormatDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "请求数",
        data: buildSeriesData(0, 50, 60_000, 1000),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <TimeseriesChart
      echarts={echarts}
      isDarkMode={isDarkMode}
      data={data}
      xAxisName="时间（UTC）"
      yAxisName="请求数"
      xAxisTickFormat={(timestamp) =>
        new Intl.DateTimeFormat(undefined, {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
        }).format(timestamp)
      }
      yAxisTickFormat={(value) => {
        if (value >= 1000) return `${value / 1000}k`;
        return value.toString();
      }}
      tooltipValueFormat={(value) => `${(value / 1000).toFixed(1)}k 次请求`}
      tooltipTimestampFormat={(timestamp) =>
        new Intl.DateTimeFormat(undefined, {
          timeZone: "UTC",
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(timestamp)
      }
    />
  );
}

export function TimeseriesChartPreviewDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "请求数",
        data: buildSeriesData(0, 30, 60_000, 1),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
      {
        name: "错误数",
        data: buildSeriesData(1, 30, 60_000, 0.3),
        color: ChartPalette.semantic("Attention", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <TimeseriesChart
      yAxisTickCount={2}
      echarts={echarts}
      isDarkMode={isDarkMode}
      data={data}
      height={160}
    />
  );
}

/**
 * 时间序列图，每条折线下方带渐变填充。
 */
export function GradientLineChartDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "请求数",
        data: buildSeriesData(0, 50, 60_000, 1),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
      {
        name: "错误数",
        data: buildSeriesData(1, 50, 60_000, 0.3),
        color: ChartPalette.semantic("Attention", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <TimeseriesChart
      echarts={echarts}
      isDarkMode={isDarkMode}
      data={data}
      xAxisName="时间（UTC）"
      yAxisName="数量"
      gradient
    />
  );
}

/**
 * 时间序列图，高亮显示数据不完整的区域。
 */
export function IncompleteDataChartDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "带宽",
        data: buildSeriesData(0, 50, 60_000, 1),
        color: ChartPalette.categorical(0, isDarkMode),
      },
    ],
    [isDarkMode],
  );

  const incompleteTimestamp = data[0].data[data[0].data.length - 5][0];

  return (
    <TimeseriesChart
      echarts={echarts}
      isDarkMode={isDarkMode}
      data={data}
      xAxisName="时间（UTC）"
      yAxisName="Mbps"
      incomplete={{ after: incompleteTimestamp }}
    />
  );
}

/**
 * 启用了时间范围选择的时间序列图。
 */
export function TimeRangeSelectionChartDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "CPU 使用率",
        data: buildSeriesData(0, 50, 60_000, 1),
        color: ChartPalette.categorical(0, isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <TimeseriesChart
      echarts={echarts}
      isDarkMode={isDarkMode}
      data={data}
      xAxisName="时间（UTC）"
      yAxisName="%"
      onTimeRangeChange={(from, to) => {
        alert(
          `已选时间范围：\n起始：${new Date(from).toLocaleString()}\n结束：${new Date(to).toLocaleString()}`,
        );
      }}
    />
  );
}

export function PieChartPreviewDemo() {
  const isDarkMode = useIsDarkMode();

  const options = useMemo<EChartsOption>(
    () => ({
      toolbox: {
        show: false,
      },
      series: [
        {
          type: "pie",
          data: [
            { value: 101, name: "系列 A" },
            { value: 202, name: "系列 B" },
            { value: 303, name: "系列 C" },
          ],
        },
      ],
    }),
    [],
  );

  return (
    <Chart
      echarts={echarts}
      options={options}
      height={160}
      isDarkMode={isDarkMode}
    />
  );
}

/**
 * 默认变体的图例项，展示语义化颜色。
 */
export function LegendDefaultDemo() {
  const isDarkMode = useIsDarkMode();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">激活状态</h3>

      <div className="flex flex-wrap gap-4 divide-x divide-lark-hairline">
        <ChartLegend.LargeItem
          name="请求数"
          color={ChartPalette.semantic("Neutral", isDarkMode)}
          value="1,234"
          unit="次/秒"
        />
        <ChartLegend.LargeItem
          name="存储"
          color={ChartPalette.semantic("Attention", isDarkMode)}
          value="56"
          unit="GB"
        />
        <ChartLegend.LargeItem
          name="警告数"
          color={ChartPalette.semantic("Warning", isDarkMode)}
          value="128"
        />
      </div>

      <h3 className="mt-12 text-sm font-medium">未激活状态</h3>

      <div className="flex flex-wrap gap-4 divide-x divide-lark-hairline">
        <ChartLegend.LargeItem
          name="请求数"
          color={ChartPalette.semantic("Neutral", isDarkMode)}
          value="1,234"
          unit="次/秒"
          inactive
        />
        <ChartLegend.LargeItem
          name="存储"
          color={ChartPalette.semantic("Attention", isDarkMode)}
          value="56"
          unit="GB"
          inactive
        />
        <ChartLegend.LargeItem
          name="警告数"
          color={ChartPalette.semantic("Warning", isDarkMode)}
          value="128"
          inactive
        />
      </div>

      <h3 className="mt-12 text-sm font-medium">加载状态</h3>

      <div className="flex flex-wrap gap-4 divide-x divide-lark-hairline">
        <ChartLegend.LargeItem loading />
      </div>
    </div>
  );
}

/**
 * 紧凑变体的图例项，使用分类色板。
 */
export function LegendCompactDemo() {
  const isDarkMode = useIsDarkMode();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">激活状态</h3>
      <div className="flex flex-wrap gap-4">
        <ChartLegend.SmallItem
          name="请求数"
          color={ChartPalette.semantic("Neutral", isDarkMode)}
          value="1,234"
          unit="次/秒"
        />
        <ChartLegend.SmallItem
          name="存储"
          color={ChartPalette.semantic("Attention", isDarkMode)}
          value="56"
          unit="GB"
        />
        <ChartLegend.SmallItem
          name="警告数"
          color={ChartPalette.semantic("Warning", isDarkMode)}
          value="128"
        />
      </div>

      <h3 className="mt-12 text-sm font-medium">未激活状态</h3>
      <div className="flex flex-wrap gap-4">
        <ChartLegend.SmallItem
          name="请求数"
          color={ChartPalette.semantic("Neutral", isDarkMode)}
          value="1,234"
          unit="次/秒"
          inactive
        />
        <ChartLegend.SmallItem
          name="存储"
          color={ChartPalette.semantic("Attention", isDarkMode)}
          value="56"
          unit="GB"
          inactive
        />
        <ChartLegend.SmallItem
          name="警告数"
          color={ChartPalette.semantic("Warning", isDarkMode)}
          value="128"
          inactive
        />
      </div>

      <h3 className="mt-12 text-sm font-medium">加载状态</h3>

      <div className="flex flex-wrap gap-4">
        <ChartLegend.SmallItem loading />
      </div>
    </div>
  );
}

/**
 * 以堆叠柱状图渲染的时间序列图。
 */
export function BarChartDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "age > 10 的请求数",
        data: buildSeriesData(0, 20, 3_600_000, 1),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
      {
        name: "错误数",
        data: buildSeriesData(1, 20, 3_600_000, 0.3),
        color: ChartPalette.semantic("Attention", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <TimeseriesChart
      echarts={echarts}
      isDarkMode={isDarkMode}
      type="bar"
      data={data}
      xAxisName="时间（UTC）"
      yAxisName="数量"
      tooltipValueFormat={(r) => r.toFixed(2)}
    />
  );
}

/**
 * 加载状态下的折线时间序列图，展示平静区域形状的骨架屏。
 */
export function LoadingChartDemo() {
  const isDarkMode = useIsDarkMode();
  return (
    <div className="flex w-full flex-1 flex-col">
      <TimeseriesChart
        echarts={echarts}
        isDarkMode={isDarkMode}
        xAxisName="时间（UTC）"
        yAxisName="数量"
        data={[]}
        loading
      />
    </div>
  );
}

/**
 * 加载状态下的柱状时间序列图，展示与图表 `type="bar"` 输出一致的柱状骨架屏。
 */
export function LoadingBarChartDemo() {
  const isDarkMode = useIsDarkMode();
  return (
    <div className="flex w-full flex-1 flex-col">
      <TimeseriesChart
        echarts={echarts}
        isDarkMode={isDarkMode}
        type="bar"
        xAxisName="时间（UTC）"
        yAxisName="数量"
        data={[]}
        loading
      />
    </div>
  );
}

/**
 * 带开关（Switch）的时间序列图，可在加载骨架与真实图表之间切换，并附带一个小图例，
 * 便于直接对比两种状态。
 */
export function LoadingToggleChartDemo() {
  const isDarkMode = useIsDarkMode();
  const [loading, setLoading] = useState(true);

  const data = useMemo(
    () => [
      {
        name: "请求数",
        data: buildSeriesData(0, 50, 60_000, 1),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
      {
        name: "错误数",
        data: buildSeriesData(1, 50, 60_000, 0.3),
        color: ChartPalette.semantic("Attention", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <div className="flex w-full flex-1 flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {data.map((series) => (
            <ChartLegend.SmallItem
              loading={loading}
              key={series.name}
              name={series.name}
              color={series.color}
              value={Math.round(series.data.at(-1)?.[1] ?? 0).toLocaleString()}
            />
          ))}
        </div>
        <Switch label="加载中" checked={loading} onCheckedChange={setLoading} />
      </div>
      <TimeseriesChart
        echarts={echarts}
        isDarkMode={isDarkMode}
        xAxisName="时间（UTC）"
        yAxisName="数量"
        data={loading ? [] : data}
        loading={loading}
      />
    </div>
  );
}

export function ChartExampleDemo() {
  const isDarkMode = useIsDarkMode();

  const data = useMemo(
    () => [
      {
        name: "P99",
        data: buildSeriesData(3, 30, 60_000, 1),
        color: ChartPalette.semantic("Attention", isDarkMode),
      },
      {
        name: "P95",
        data: buildSeriesData(2, 30, 60_000, 0.6),
        color: ChartPalette.semantic("Warning", isDarkMode),
      },
      {
        name: "P75",
        data: buildSeriesData(1, 30, 60_000, 0.4),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
      {
        name: "P50",
        data: buildSeriesData(0, 30, 60_000, 0.2),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <LayerCard>
      <LayerCard.Secondary>读取延迟</LayerCard.Secondary>
      <LayerCard.Primary>
        <div className="mb-2 flex gap-4 divide-x divide-lark-hairline px-2">
          <ChartLegend.LargeItem
            name="P99"
            color={ChartPalette.semantic("Attention", isDarkMode)}
            value="124"
            unit="ms"
          />
          <ChartLegend.LargeItem
            name="P95"
            color={ChartPalette.semantic("Warning", isDarkMode)}
            value="76"
            unit="ms"
          />
          <ChartLegend.LargeItem
            name="P75"
            color={ChartPalette.semantic("Neutral", isDarkMode)}
            value="32"
            unit="ms"
          />
          <ChartLegend.LargeItem
            name="P50"
            color={ChartPalette.semantic("Neutral", isDarkMode)}
            value="10"
            unit="ms"
          />
        </div>
        <TimeseriesChart
          xAxisName="时间（UTC）"
          echarts={echarts}
          isDarkMode={isDarkMode}
          data={data}
          height={300}
          tooltipFooter="百分位数采用 5 分钟滚动窗口计算。"
        />
      </LayerCard.Primary>
    </LayerCard>
  );
}

/**
 * 带图例项的时间序列图，悬停图例项会高亮对应的系列。
 * 悬停时向图表派发高亮动作，并让其他图例项淡出。
 */
export function LegendHighlightDemo() {
  const isDarkMode = useIsDarkMode();
  const chartRef = useRef<echarts.ECharts>(null);
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  const series = useMemo(
    () => [
      {
        name: "P99",
        color: ChartPalette.semantic("Attention", isDarkMode),
        value: "124",
        unit: "ms",
      },
      {
        name: "P95",
        color: ChartPalette.semantic("Warning", isDarkMode),
        value: "76",
        unit: "ms",
      },
      {
        name: "P75",
        color: ChartPalette.semantic("Neutral", isDarkMode),
        value: "32",
        unit: "ms",
      },
      {
        name: "P50",
        color: ChartPalette.semantic("Neutral", isDarkMode),
        value: "10",
        unit: "ms",
      },
    ],
    [isDarkMode],
  );

  const data = useMemo(
    () =>
      series.map((s, i) => ({
        name: s.name,
        data: buildSeriesData(3 - i, 30, 60_000, 1 - i * 0.2),
        color: s.color,
      })),
    [series],
  );

  return (
    <LayerCard>
      <LayerCard.Secondary>读取延迟</LayerCard.Secondary>
      <LayerCard.Primary>
        <div className="mb-2 flex divide-x divide-lark-line px-2">
          {series.map((s) => (
            <ChartLegend.LargeItem
              key={s.name}
              name={s.name}
              color={s.color}
              value={s.value}
              unit={s.unit}
              inactive={hoveredSeries !== null && hoveredSeries !== s.name}
              onPointerEnter={() => {
                setHoveredSeries(s.name);
                chartRef.current?.dispatchAction({
                  type: "highlight",
                  seriesName: s.name,
                });
              }}
              onPointerLeave={() => {
                setHoveredSeries(null);
                chartRef.current?.dispatchAction({
                  type: "downplay",
                  seriesName: s.name,
                });
              }}
              className="not-first:pl-4"
            />
          ))}
        </div>
        <TimeseriesChart
          ref={chartRef}
          xAxisName="时间（UTC）"
          echarts={echarts}
          isDarkMode={isDarkMode}
          data={data}
          height={300}
        />
      </LayerCard.Primary>
    </LayerCard>
  );
}

/**
 * 点击图例项可单独显示某个系列的时间序列图。点击 `ChartLegend` 项会只显示该系列
 * 并隐藏其余系列；再次点击已单独显示的系列可恢复全部系列。可见性通过隐藏的
 * ECharts 图例以及 `legendSelect` / `legendUnSelect` 动作来控制。
 */
export function LegendOnClickDemo() {
  const isDarkMode = useIsDarkMode();
  const chartRef = useRef<echarts.ECharts>(null);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});

  const series = useMemo(
    () => [
      {
        name: "P99",
        color: ChartPalette.semantic("Attention", isDarkMode),
        value: "124",
        unit: "ms",
      },
      {
        name: "P95",
        color: ChartPalette.semantic("Warning", isDarkMode),
        value: "76",
        unit: "ms",
      },
      {
        name: "P75",
        color: ChartPalette.semantic("Neutral", isDarkMode),
        value: "32",
        unit: "ms",
      },
      {
        name: "P50",
        color: ChartPalette.semantic("Neutral", isDarkMode),
        value: "10",
        unit: "ms",
      },
    ],
    [isDarkMode],
  );

  const data = useMemo(
    () =>
      series.map((s, i) => ({
        name: s.name,
        data: buildSeriesData(3 - i, 30, 60_000, 1 - i * 0.2),
        color: s.color,
      })),
    [series],
  );

  // 切换主题会重新初始化 ECharts 实例，并把图例选中状态重置为全部显示。
  // 这里同步重置自身状态，避免图例状态不同步。
  useEffect(() => {
    setHiddenSeries({});
  }, [isDarkMode]);

  // 点击可单独显示某个系列：通过（隐藏的）ECharts 图例只显示被点击的系列、
  // 隐藏其余系列。再次点击已单独显示的系列可恢复全部系列。
  const handleClick = (name: string) => {
    const chart = chartRef.current;
    if (!chart) return;

    setHiddenSeries((prev) => {
      // 已经单独显示该系列了吗？（仅它可见，其余全部隐藏）
      const isIsolated = series.every((s) =>
        s.name === name ? !prev[s.name] : prev[s.name],
      );

      const nextHidden: Record<string, boolean> = {};
      for (const s of series) {
        const shouldHide = isIsolated ? false : s.name !== name;
        nextHidden[s.name] = shouldHide;
        chart.dispatchAction({
          type: shouldHide ? "legendUnSelect" : "legendSelect",
          name: s.name,
        });
      }
      return nextHidden;
    });
  };

  return (
    <LayerCard>
      <LayerCard.Secondary>读取延迟</LayerCard.Secondary>
      <LayerCard.Primary>
        <div className="mb-2 flex divide-x divide-lark-line px-2">
          {series.map((s) => (
            <ChartLegend.LargeItem
              key={s.name}
              name={s.name}
              color={s.color}
              value={s.value}
              unit={s.unit}
              inactive={hiddenSeries[s.name] ?? false}
              onClick={() => handleClick(s.name)}
              className="not-first:pl-4"
            />
          ))}
        </div>
        <TimeseriesChart
          ref={chartRef}
          xAxisName="时间（UTC）"
          echarts={echarts}
          isDarkMode={isDarkMode}
          data={data}
          height={300}
          enableLegendSelection
        />
      </LayerCard.Primary>
    </LayerCard>
  );
}

/**
 * 使用 dangerousHtmlFormatter 的 HTML 工具提示自定义图表。
 * 谨慎使用：dangerousHtmlFormatter 仅可用于可信的 HTML 内容。
 * 请始终使用 echarts.format.encodeHTML 或类似工具对用户提供的数据进行转义，
 * 以防止 XSS 漏洞。
 */
export function CustomTooltipChartDemo() {
  const isDarkMode = useIsDarkMode();

  const options = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          // 重要：把所有动态值都用 echarts/format 的 encodeHTML 转义后再放进 HTML。
          // 这样可以防止恶意数据引发的 XSS 攻击，例如：
          // { name: "<img src=x onerror=alert('xss')>", value: "..." }
          const safeName = echarts.format.encodeHTML(params.name);
          const safeValue = echarts.format.encodeHTML(String(params.value));
          const safePercent = echarts.format.encodeHTML(
            String(Math.round(params.percent)),
          );

          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${safeName}</div>
              <div>数值：<strong>${safeValue}</strong></div>
              <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">
                占总量的 ${safePercent}%
              </div>
            </div>
          `;
        },
      },
      series: [
        {
          type: "pie",
          data: [
            { value: 101, name: "系列 A" },
            { value: 202, name: "系列 B" },
            // 恶意系列名，用于演示 encodeHTML 提供的 XSS 防护。
            // 不做编码时它会弹出一个 alert；使用 encodeHTML 后只会安全地显示为纯文本。
            { value: 150, name: "<img src=x onerror=alert('XSS')>" },
            { value: 303, name: "系列 C" },
            { value: 404, name: "系列 D" },
          ],
        },
      ],
    }),
    [],
  );

  return (
    <Chart
      echarts={echarts}
      options={options}
      height={400}
      isDarkMode={isDarkMode}
    />
  );
}

interface FollowCursorOption {
  label: string;
  value: "both" | "x";
}

const FOLLOW_CURSOR_OPTIONS: FollowCursorOption[] = [
  { label: "两个轴", value: "both" },
  { label: "仅 X 轴", value: "x" },
];

/**
 * 演示 `tooltipFollowCursor` 属性的交互示例。可通过下拉框在不同的光标跟随模式
 * 之间切换，观察工具提示的表现。
 */
export function TooltipFollowCursorDemo() {
  const isDarkMode = useIsDarkMode();
  const [selected, setSelected] = useState<FollowCursorOption>(
    FOLLOW_CURSOR_OPTIONS[0],
  );

  const data = useMemo(
    () => [
      {
        name: "P99",
        data: buildSeriesData(0, 50, 60_000, 1),
        color: ChartPalette.semantic("Attention", isDarkMode),
      },
      {
        name: "P50",
        data: buildSeriesData(1, 50, 60_000, 0.4),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <Select
        label="工具提示跟随光标"
        value={selected}
        onValueChange={(v) => {
          if (v) setSelected(v);
        }}
        renderValue={(v) => v.label}
      >
        {FOLLOW_CURSOR_OPTIONS.map((opt) => (
          <Select.Option key={opt.value} value={opt}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
      <TimeseriesChart
        echarts={echarts}
        isDarkMode={isDarkMode}
        data={data}
        xAxisName="时间（UTC）"
        yAxisName="延迟（ms）"
        tooltipFollowCursor={selected.value}
      />
    </div>
  );
}

/**
 * 演示 `tooltipBoundary` 属性的示例。图表位于一个小的可滚动容器内——工具提示会被
 * 限制在容器内，而不会溢出到页面其他区域。
 */
export function TooltipBoundaryDemo() {
  const isDarkMode = useIsDarkMode();
  const [boundary, setBoundary] = useState<HTMLDivElement | null>(null);
  const boundaryRef = useCallback(
    (el: HTMLDivElement | null) => setBoundary(el),
    [],
  );

  const data = useMemo(
    () => [
      {
        name: "请求数",
        data: buildSeriesData(0, 50, 60_000, 1),
        color: ChartPalette.semantic("Neutral", isDarkMode),
      },
      {
        name: "错误数",
        data: buildSeriesData(1, 50, 60_000, 0.3),
        color: ChartPalette.semantic("Attention", isDarkMode),
      },
    ],
    [isDarkMode],
  );

  return (
    <div
      ref={boundaryRef}
      className="w-full overflow-auto rounded-lg border border-lark-line"
      style={{ height: 300 }}
    >
      <TimeseriesChart
        echarts={echarts}
        isDarkMode={isDarkMode}
        data={data}
        xAxisName="时间（UTC）"
        yAxisName="数量"
        height={280}
        tooltipBoundary={boundary ?? undefined}
      />
    </div>
  );
}

function buildSeriesData(
  seed = 0,
  points = 50,
  stepMs = 60_000,
  timeScale = 1,
): [number, number][] {
  const end = Date.now();
  const start = end - (points - 1) * stepMs;

  return Array.from({ length: points }, (_, i) => {
    const ts = start + i * stepMs;
    const trend = i * 0.15;
    const noise = (Math.random() - 0.5) * 8;
    const value = Math.round((30 + seed * 15 + trend + noise) * 100) / 100;
    return [ts, value * timeScale];
  });
}
