/**
 * Chinese names for Lark components, blocks and charts, keyed by docs route
 * slug (the path segment after the section prefix).
 *
 * Used by the sidebar navigation and the search dialog so both surfaces show
 * the same bilingual label (`Button 按钮`) and so searching for a Chinese term
 * finds the right component.
 */
export const COMPONENT_NAMES_ZH: Record<string, string> = {
  // Components
  autocomplete: "自动补全",
  badge: "徽标",
  banner: "通告栏",
  breadcrumbs: "面包屑",
  button: "按钮",
  "button-group": "按钮组",
  checkbox: "复选框",
  "clipboard-text": "剪贴板文本",
  "code-highlighted": "代码高亮",
  collapsible: "折叠面板",
  combobox: "组合框",
  "command-palette": "命令面板",
  "date-picker": "日期选择器",
  dialog: "对话框",
  dropdown: "下拉菜单",
  empty: "空状态",
  flow: "流程图",
  grid: "栅格",
  "inline-copy-text": "行内复制",
  input: "输入框",
  "input-area": "文本域",
  "input-group": "输入框组",
  label: "标签",
  "lark-logo": "Lark 标志",
  "layer-card": "分层卡片",
  "layer-dialog": "分层对话框",
  link: "链接",
  loader: "加载指示器",
  meter: "进度指示器",
  pagination: "分页",
  popover: "气泡卡片",
  radio: "单选按钮",
  select: "选择器",
  "sensitive-input": "敏感输入",
  sidebar: "侧边栏",
  "skeleton-line": "骨架行",
  slider: "滑块",
  switch: "开关",
  table: "表格",
  "table-of-contents": "目录",
  "tag-input": "标签输入",
  tabs: "标签页",
  text: "文本",
  toolbar: "工具栏",
  toast: "轻提示",
  tooltip: "工具提示",

  // Charts
  charts: "图表",
  colors: "图表颜色",
  timeseries: "时间序列",
  maps: "地图",
  sankey: "桑基图",
  custom: "自定义图表",
  "bubble-map": "气泡地图",
  "choropleth-map": "分级设色地图",
  "cloudflare-availability-locations": "地球地图",
  "globe-map": "地球地图",
  "sankey-chart": "桑基图",
  "timeseries-chart": "时间序列图",

  // Blocks
  "page-header": "页面头部",
  "resource-list": "资源列表",
  "delete-resource": "删除资源",
};

/**
 * Chinese labels for the registry's category values.
 */
export const CATEGORY_NAMES_ZH: Record<string, string> = {
  Other: "其他",
  Display: "展示",
  Feedback: "反馈",
  "Data Visualization": "数据可视化",
  Action: "操作",
  Input: "输入",
  Navigation: "导航",
  Overlay: "浮层",
  Layout: "布局",
};

/**
 * Registry component names that don't map to their docs slug by kebab-casing.
 */
const REGISTRY_NAME_SLUGS: Record<string, string> = {
  CodeHighlighted: "code-highlighted",
  DropdownMenu: "dropdown",
  ResourceListPage: "resource-list",
  Toasty: "toast",
};

/**
 * Derive a lookup key from a registry component name (`BubbleMap` ->
 * `bubble-map`).
 */
export function keyFromComponentName(name: string): string {
  return (
    REGISTRY_NAME_SLUGS[name] ??
    name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
  );
}

/**
 * Derive the lookup key for a docs href.
 *
 * `/components/button` -> `button`, `/charts` -> `charts`,
 * `/charts/colors` -> `colors`. Chart components that deep-link to a section
 * use the anchor instead: `/charts/maps#bubble-map` -> `bubble-map`.
 */
export function componentKey(href: string): string {
  const [path, hash] = href.split("#");
  if (hash) return hash;

  const segments = path.replace(/^\//, "").split("/");
  return segments.length > 1 ? segments.slice(1).join("/") : segments[0];
}

/**
 * Build a bilingual display name (`Button 按钮`) from an English name and a
 * lookup key. Falls back to the English name when no Chinese name is known.
 */
export function bilingualName(englishName: string, key: string): string {
  const chinese = COMPONENT_NAMES_ZH[key];
  return chinese ? `${englishName} ${chinese}` : englishName;
}
