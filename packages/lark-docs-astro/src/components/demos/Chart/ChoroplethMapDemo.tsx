import { ChoroplethMap, type MapGeoJson } from "@lark-ui/core";
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";
import { VisualMapComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useIsDarkMode } from "~/lib/use-is-dark-mode";

echarts.use([MapChart, VisualMapComponent, TooltipComponent, CanvasRenderer]);

interface ChoroplethMapDemoProps {
  geoJson: MapGeoJson | null;
}

/** 一行国家级流量数据——通过 `country` 与 GeoJSON 要素关联。 */
interface CountryTraffic {
  /** 必须与 GeoJSON 要素的 `name` 属性一致。 */
  country: string;
  requests: number;
}

// 国家级流量。颜色为连续色阶；如果你的数据分布不均，可在传入前在父级做转换
//（例如先变换数值）再传入。
const countries: CountryTraffic[] = [
  { country: "United States of America", requests: 4200 },
  { country: "Germany", requests: 3100 },
  { country: "United Kingdom", requests: 2800 },
  { country: "Japan", requests: 2500 },
  { country: "France", requests: 2200 },
  { country: "Brazil", requests: 1700 },
  { country: "India", requests: 1500 },
  { country: "Canada", requests: 1300 },
  { country: "Australia", requests: 1100 },
  { country: "Spain", requests: 900 },
  { country: "Netherlands", requests: 700 },
  { country: "Mexico", requests: 600 },
  { country: "Argentina", requests: 420 },
  { country: "Nigeria", requests: 300 },
  { country: "South Africa", requests: 220 },
];

const fmt = (n: number) =>
  `${n >= 1000 ? `${(n / 1000).toLocaleString()}k` : n.toString()} 次请求`;

/**
 * 分级设色地图——按数值给区域着色，并通过名称与 GeoJSON 要素关联。
 * 使用默认的连续线性色阶。
 */
export function ChoroplethMapBasicDemo({ geoJson }: ChoroplethMapDemoProps) {
  const isDarkMode = useIsDarkMode();

  if (!geoJson) return null;

  return (
    <ChoroplethMap<CountryTraffic>
      echarts={echarts}
      geoJson={geoJson}
      data={countries}
      name="country"
      value="requests"
      valueFormat={fmt}
      isDarkMode={isDarkMode}
    />
  );
}
