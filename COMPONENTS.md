# 组件清单与完成状态

依据飞书开放平台「设计应用 / 组件」清单逐项实现，**44 / 44 已完成**。

状态图例：✅ 已实现（组件、Vitest Browser Mode 测试、Storybook autodocs、深浅色对比度审计）。

## 反馈 Feedback（7）

| 组件                    | 状态 | 能力                                                      |
| ----------------------- | ---- | --------------------------------------------------------- |
| Dialog 对话框           | ✅   | 420/600/840/1080px，ESC/遮罩/关闭按钮，焦点陷阱与焦点归还 |
| Drawer 抽屉             | ✅   | 左/右/上/下，350/480/680，可拖拽/吸附，固定头尾与滚动内容 |
| Loading 加载中          | ✅   | 14/24/40px spinner，骨架屏，tip/overlay，role=status      |
| Notice 常驻提示         | ✅   | info/success/warning/danger/neutral，可关闭、可带操作     |
| Notification 通知提醒框 | ✅   | 右上角栈、四种 tone、自动关闭、悬停暂停、update/destroy   |
| Progress 进度条         | ✅   | 线性、状态色、不确定态、格式化文案                        |
| Toast 临时提示          | ✅   | info/success/warning/error/loading，action、时长、堆叠    |

## 数据展示 Data display（13）

| 组件                 | 状态 | 能力                                                 |
| -------------------- | ---- | ---------------------------------------------------- |
| Avatar 头像          | ✅   | 20/24/32/40/48，圆形/方形/首字母/图片回退            |
| Badge 徽标           | ✅   | 数字溢出、点状、五种状态色、内容包裹                 |
| Card 卡片            | ✅   | Header/Body/Footer/Cover，outlined/borderless/filled |
| Collapse 折叠面板    | ✅   | 多项/手风琴、右侧线性箭头/左侧面性箭头、禁用、动画   |
| Empty 空状态         | ✅   | 标题/描述/操作/插画，尺寸                            |
| ImageViewer 图片预览 | ✅   | 缩放/旋转/重置/前后导航/下载，键盘与焦点陷阱         |
| Placeholder 占位符   | ✅   | 图片缺失/加载失败，36px 默认、N400、可自定义         |
| Popover 气泡卡片     | ✅   | 标题/描述/footer、方向/对齐/箭头、受控 open          |
| Table 表格           | ✅   | 排序、行选择、固定列/表头、分页、加载/空状态         |
| Tabs 标签页          | ✅   | 线条/选项/卡片，2px 指示器，键盘方向键               |
| Tag 标签             | ✅   | 五种语义色、可关闭、图标、尺寸                       |
| Timeline 时间轴      | ✅   | 状态/自定义节点/交替布局/加载节点                    |
| Tooltip 文字提示     | ✅   | 100ms 延迟、翻转、箭头、最大宽度 320px               |

## 数据录入 Data entry（17）

| 组件                   | 状态 | 能力                                                  |
| ---------------------- | ---- | ----------------------------------------------------- |
| Button 按钮            | ✅   | 5 尺寸 × 5 形态 × 4 语气，成功/选中切换、分裂/菜单、按钮组、悬浮 |
| Cascader 级联选择      | ✅   | 多列、搜索、changeOnSelect、isLeaf                    |
| Checkbox 复选框        | ✅   | 16px、indeterminate、描述、禁用/只读                  |
| ColorPicker 颜色选择器 | ✅   | 预设色板、HEX、透明度、清空                           |
| DatePicker 日期选择器  | ✅   | 单选/范围、格式化、min/max、disabledDate、footer      |
| Form 表单              | ✅   | vertical/horizontal、必填标识、描述/错误、分组        |
| Input 输入框           | ✅   | 28/32/40px、清空、错误、图标、禁用/只读、数字拖拽调值 |
| Radio 单选框           | ✅   | RadioGroup、方向键、横/竖排、描述                     |
| Rate 评分              | ✅   | 半星、清除、提示文案、只读/禁用、自定义字符           |
| Select 选择器          | ✅   | 单选/多选/搜索/清空、描述、错误、尺寸                 |
| Slider 滑动输入条      | ✅   | 单值/范围、marks、tooltip、垂直、只读/禁用            |
| Stepper 步进器         | ✅   | 上下限、精度、步进、尺寸、键盘                        |
| Switch 开关            | ✅   | 40×22 / 28×16、加载态、禁用                           |
| TimePicker 时间选择器  | ✅   | 时/分/秒、12/24h、步进、min/max、disabledTime         |
| Transfer 穿梭框        | ✅   | 双列、搜索、单/双向、全选、禁用项                     |
| TreeSelect 树选择      | ✅   | 单选/多选、搜索、级联勾选、展开                       |
| Upload 上传            | ✅   | 按钮/拖拽、文件列表、进度、重试、图片列表             |

## 导航 Navigation（7）

| 组件                    | 状态 | 能力                                          |
| ----------------------- | ---- | --------------------------------------------- |
| Anchor 锚点             | ✅   | 滚动监听、嵌套、水平/垂直、sticky/fixed       |
| Breadcrumb 面包屑       | ✅   | 折叠、链接、当前页、aria-current              |
| Dropdown 下拉菜单       | ✅   | 菜单/分组/子菜单/上下文菜单、键盘与 typeahead |
| NavigationMenu 导航菜单 | ✅   | 顶栏/侧栏、下拉面板、键盘、激活态             |
| Pagination 分页         | ✅   | 截断、简单分页、总数、受控/非受控             |
| ScrollBar 滚动条        | ✅   | 垂直/水平、自动隐藏、拖拽、键盘/滚轮          |
| Steps 步骤条            | ✅   | 水平/垂直、状态、可点击、加载/错误            |

## 质量基线

每个 ✅ 组件均包含：

- 官方规范与客户端 CSS 证据（见 `AGENTS.md`）
- `Component.tsx` / `index.ts` / `Component.test.tsx` / `Component.stories.tsx`
- 可访问名称、键盘路径、禁用/只读/加载状态测试
- 深色模式与 axe color-contrast 审计
- Storybook autodocs + `addon-a11y`

后续增强方向（不属于当前 44 项验收范围）：多级表头/树形表格、Cascader 多选、Upload 图片墙、移动端导航折叠、表格虚拟滚动。
