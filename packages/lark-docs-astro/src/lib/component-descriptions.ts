/**
 * Chinese descriptions for Lark components, blocks and charts.
 *
 * Keyed by the same lookup key as `component-names.ts` (the docs route slug,
 * or the anchor for chart components that deep-link to a section).
 *
 * Used by the search dialog and by the generated `llms.txt` index so both
 * surfaces describe components in the same language.
 */
export const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  autocomplete:
    "可自由输入的文本框，可附带经过筛选的建议列表。与组合框不同，它的取值不受选项列表限制。",
  badge: "用于展示状态、分类或元信息的小标签。",
  banner: "展示信息、提醒或错误等状态的行内消息。",
  breadcrumbs: "展示当前页面在导航层级中位置的组件。",
  button: "展示一个按钮，或外观类似按钮的组件。",
  "button-group": "将主操作与下拉触发器组合成一个分体按钮。",
  checkbox: "允许用户在选中与未选中之间切换的控件。",
  "clipboard-text": "带有一键复制按钮的文本组件。",
  "code-highlighted": "由 Shiki 驱动的语法高亮代码块，支持主题定制与懒加载。",
  collapsible: "由多个可交互标题组成的纵向堆叠面板，点击可展开内容。",
  combobox: "可搜索的选择组件，用于筛选并从选项中选择。",
  "command-palette": "由键盘驱动的命令菜单，用于搜索和导航。",
  "date-picker": "支持单选、多选和范围选择三种模式的日期选择日历。",
  dialog: "叠加在主窗口或另一个对话框上的模态窗口。",
  dropdown: "展示由按钮触发的一组操作或功能菜单。",
  empty: "用于空状态的占位组件，可包含命令输入与操作项。",
  flow: "用于构建带节点与连线的有向流程图的组件集合。",
  grid: "用于将内容整理为多列的响应式栅格布局组件。",
  "inline-copy-text": "用于短文本值的紧凑无边框复制控件。",
  input: "带内置标签、描述与错误提示的文本输入框。",
  "input-area": "面向较长内容的多行文本输入框，带内置标签、描述与错误提示。",
  "input-group":
    "将输入框与前后缀、图标、按钮及文本组合，构成更丰富的表单字段。",
  label: "表单字段的标签组件，支持必填/选填标识。",
  "lark-logo": "官方 Lark（飞书）标志，取自 Universe Design 资源集。",
  "layer-card": "带分层视觉效果的卡片，适用于导航或重点展示。",
  "layer-dialog": "严格的响应式对话框组合，标题固定在可滚动正文顶部。",
  link: "带多种样式的文本链接组件，支持变体与组合使用。",
  loader: "用于表示加载状态的加载指示器。",
  meter: "在已知数值范围内展示当前值的可视化指示器。",
  pagination: "用于分页内容的导航控件。",
  popover: "锚定在触发元素上的无障碍弹出层。",
  radio: "允许从一组选项中选择单项的控件。",
  select: "供用户挑选的选项列表。",
  "sensitive-input":
    "适用于 API Key、密码等敏感值的掩码输入框，点击可显示原文。",
  sidebar: "支持展开与收起的响应式侧边导航面板。",
  "skeleton-line": "文本内容的骨架屏占位块。",
  slider: "通过拖动滑块在轨道上选择数值或两个数值之间区间的输入控件。",
  switch: "可在开启与关闭之间切换的双态按钮。",
  table: "用于展示表格数据的表格组件，支持选中、行变体与列宽调整。",
  "table-of-contents": "带高亮指示条的章节导航展示型复合组件。",
  tabs: "一次只展示一个的分层内容区块（标签面板）。",
  "tag-input": "可创建的多值输入框，用于没有预置选项列表的值。",
  text: "提供多种标题与正文样式的排版组件。",
  toolbar: "将一组工具栏控件组合成一张简洁的分组卡片。",
  toast: "短暂显示、不打断操作的轻提示通知。",
  tooltip: "在元素获得键盘焦点或鼠标悬停时显示信息的弹出层。",

  // Blocks
  "page-header": "将面包屑与标签页组合起来的页面导航组件。",
  "resource-list": "带标题和侧边栏的资源列表布局。",
  "delete-resource":
    "用于安全删除资源的确认对话框，要求用户输入资源名称以确认。",

  // Charts
  chart: "Chart —— 对 Apache ECharts 的轻量封装。",
  "bubble-map": "使用 GeoJSON 数据在地图上以气泡展示地理数据的图表组件。",
  "choropleth-map": "使用 GeoJSON 数据在地图上按数值分级设色展示的图表组件。",
  "cloudflare-availability-locations":
    "以正交投影地球仪展示地理分布的 SVG 组件。",
  "globe-map": "以正交投影地球仪展示地理分布的 SVG 组件。",
  sankey: "以桑基图展示节点之间流量关系的图表组件。",
  "sankey-chart": "以桑基图展示节点之间流量关系的图表组件。",
  timeseries: "展示基于时间的数据的折线图或柱状图。",
  "timeseries-chart": "展示基于时间的数据的折线图或柱状图。",

  // Deprecated or undocumented registry entries — still listed in the
  // registry browser, so they need a description too.
  code: "代码组件（已废弃，请改用 CodeHighlighted）。",
  "date-range-picker":
    '双日历日期范围选择器（已废弃，请改用 mode="range" 的 DatePicker）。',
  field: "提供标签、可选描述和错误展示的表单字段包裹组件。",
  "menu-bar":
    '横向图标按钮工具栏，支持方向键导航（已废弃，请改用 variant="segmented" 的 Tabs）。',
  surface: "表面组件（已废弃的兼容导出，暂无独立文档页）。",
};
