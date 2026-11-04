/**
 * Chinese translations for component prop descriptions.
 *
 * The component registry (`@lark-ui/core/ai/component-registry.json`) is generated
 * from the library sources and ships in English. This map overlays Chinese copy
 * for the props rendered by `<PropsTable />` so the docs read in one language.
 *
 * Keys are `<ComponentName>.<propName>`; sub-components use the dotted form
 * (e.g. `Popover.Popup.portal`).
 *
 * `prop-descriptions.test.ts` asserts every rendered prop has an entry here, so
 * new props added to the library fail the test until they are translated.
 */
export const PROP_DESCRIPTIONS_ZH: Record<string, string> = {
  "Autocomplete.items": "下拉菜单中要展示的选项数组",
  "Autocomplete.value": "受控的输入值",
  "Autocomplete.open": "弹出层是否展开（受控）",
  "Autocomplete.children": "自动补全的内容（输入框组、弹出层内容）",
  "Autocomplete.className": "额外的 CSS 类名",
  "Autocomplete.label": "标签内容（用于启用 Field 包裹层）",
  "Autocomplete.required": "该字段是否必填",
  "Autocomplete.labelTooltip": "显示在标签旁的工具提示内容",
  "Autocomplete.description": "显示在字段下方的辅助说明文字",
  "Autocomplete.error": "错误信息或校验错误对象",
  "Badge.variant":
    '徽标的颜色变体。推荐的语义化变体：\n- `"primary"` — 主要徽标\n- `"secondary"` — 次要徽标\n- `"error"` — 错误徽标\n- `"warning"` — 警告徽标\n- `"success"` — 成功徽标\n- `"info"` — 信息徽标\n\n其他 token 变体：\n- `"red"`、`"orange"`、`"green"`、`"teal"`、`"blue"`、`"purple"`、`"neutral"`\n- `"teal-subtle"`、`"neutral-subtle"`\n- `"inverted"`\n- `"outline"` — 使用基础背景的描边徽标\n- `"beta"` — 用于 beta/实验性功能的虚线边框徽标',
  "Badge.className": "通过 `cn()` 合并的额外 CSS 类名。",
  "Badge.children": "渲染在徽标内部的内容。",
  "Badge.appearance":
    '徽标的外观样式。\n- `"filled"` — 使用变体颜色的填充背景（默认）\n- `"dot"` — 带彩色圆点的描边徽标。只有 `success`、`warning`、`error` 和 `neutral` 变体会显示圆点。圆点徽标不接受图标。',
  "Badge.icon":
    "来自 `@phosphor-icons/react` 的图标或 React 元素。渲染在子元素之前。",
  "Banner.className": "通过 `cn()` 合并的额外 CSS 类名。",
  "Banner.icon":
    "渲染在通告栏内容之前的图标元素（例如来自 `@phosphor-icons/react`）。",
  "Banner.title": "通告栏的主标题文字。用于注入国际化文案。",
  "Banner.description": "显示在标题下方的次要描述文字。用于注入国际化文案。",
  "Banner.action":
    "用于放置 CTA 按钮或链接的操作插槽。紧凑型通告栏会把 Lark `Link` 内联渲染在描述旁；CTA 则渲染在末尾。使用 `Banner.Action` 可获得随通告栏变体自适应的强调型 CTA；其他节点按原样渲染。可以在 Fragment 中传入多个操作。仅在结构化模式（带 `title` 或 `description`）下使用。",
  "Banner.variant":
    '通告栏的视觉样式。\n- `"default"` — 用于一般信息的蓝色通告栏\n- `"alert"` — 用于警示信息的黄色通告栏\n- `"error"` — 用于严重问题的红色通告栏\n- `"secondary"` — 用于次要信息的中性通告栏',
  "Banner.size":
    '通告栏的尺寸。`"sm"` 通告栏使用更紧凑的间距和 `text-sm`，将 Lark `Link` 操作内联渲染在描述旁，并把它内部的 `Banner.Action` 子元素设为 `"xs"` 尺寸——适合对话框等空间紧凑的场景。',
  "Banner.theme":
    '通告栏的表面处理方式。\n- `"filled"` — 平铺的淡色底（默认）\n- `"outlined"` — 淡色底加 1px 状态色边框',
  "Breadcrumbs.size":
    '面包屑导航的尺寸。\n- `"sm"` — 适用于信息密集界面的紧凑面包屑导航\n- `"base"` — 默认面包屑导航尺寸',
  "Breadcrumbs.className": "通过 `cn()` 合并的额外 CSS 类名。",
  "Button.className": "额外的 CSS 类名",
  "Button.children": "子元素",
  "Button.icon":
    "来自 `@phosphor-icons/react` 的图标或 React 元素。渲染在子元素之前。",
  "ButtonGroup.className":
    "通过 `cn()` 合并的额外 CSS 类名。仅使用 lark 语义化 token。",
  "ButtonGroup.children":
    "需要组合在一起、联系紧密的控件。通常是两个 `Button`：一个主要操作和一个下拉触发器（“分体按钮”）。",
  "Checkbox.variant":
    "视觉变体：“default”，或在校验失败时使用“error”（仅视觉表现，不显示错误文字）",
  "Checkbox.label":
    "复选框的标签内容（启用内置的 Field 包裹层）——可以是字符串或任意 React 节点",
  "Checkbox.labelTooltip": "通过信息图标显示在标签旁的工具提示内容",
  "Checkbox.controlFirst":
    "为 true（默认）时复选框显示在标签之前；为 false 时标签显示在复选框之前。",
  "Checkbox.checked": "复选框是否选中（受控）",
  "Checkbox.indeterminate": "复选框是否处于半选状态",
  "Checkbox.disabled": "复选框是否禁用",
  "Checkbox.name": "表单提交使用的名称",
  "Checkbox.required": "该字段是否必填",
  "Checkbox.className": "额外的类名",
  "Checkbox.Group.legend":
    "分组标题文字。如需更多控制标题样式，请省略此属性，改用 `<Checkbox.Legend>` 作为子元素。",
  "Checkbox.Group.children":
    "子级的 Checkbox.Item 组件（也可以包含 Checkbox.Legend）",
  "Checkbox.Group.error": "分组的错误信息（仅在分组中显示，单个复选框不显示）",
  "Checkbox.Group.description": "分组的辅助说明文字",
  "Checkbox.Group.value": "需要处于选中状态的复选框取值（受控）",
  "Checkbox.Group.allValues": "所有可选的复选框取值（父子复选框模式必填）",
  "Checkbox.Group.disabled": "分组内所有复选框是否禁用",
  "Checkbox.Group.orientation": "复选项的排列方向",
  "Checkbox.Group.appearance":
    '应用到所有 Checkbox.Item 子元素的外观样式。- `"default"` — 标准行内复选项 - `"card"` — 带边框、内边距和高亮选中态的选项卡片 单个复选项可以用自己的 `appearance` 属性覆盖该样式。',
  "Checkbox.Group.controlFirst":
    "为 true 时复选框显示在标签之前；为 false 时标签显示在复选框之前。默认外观下为 true，卡片外观下为 false。",
  "Checkbox.Group.className": "额外的 CSS 类名",
  "Checkbox.Legend.children": "标题内容",
  "Checkbox.Legend.className":
    "额外的 CSS 类名（例如用 “sr-only” 在视觉上隐藏标题）",
  "ClipboardText.size":
    '剪贴板文本的尺寸。\n- `"sm"` — 适合紧凑界面的小型剪贴板文本\n- `"base"` — 默认剪贴板文本尺寸\n- `"lg"` — 适合突出展示的大型剪贴板文本',
  "ClipboardText.text": "要展示并复制到剪贴板的文本。",
  "ClipboardText.textToCopy":
    "如果提供，则复制这段文本到剪贴板，而不是 `text` 属性的内容。",
  "ClipboardText.masked": "初始时掩码显示文本，并提供显示或隐藏的控件。",
  "ClipboardText.className": "通过 `cn()` 合并的额外 CSS 类名。",
  "ClipboardText.tooltip":
    "工具提示配置。悬停时显示工具提示，点击时显示锚定在元素上的轻提示。",
  "ClipboardText.labels": "用于国际化的无障碍标签。",
  "Combobox.size":
    '组合框触发器的尺寸。与 Input 组件的尺寸一致。\n- `"xs"` — 适合紧凑界面的超小尺寸（h-5 / 20px）\n- `"sm"` — 适合次要字段的小尺寸（h-6.5 / 26px）\n- `"base"` — 默认尺寸（h-9 / 36px）\n- `"lg"` — 适合突出字段的大尺寸（h-10 / 40px）',
  "Combobox.inputSide":
    '多选模式下文本输入框相对于标签块的位置。\n- `"right"` — 输入框内联在标签块右侧\n- `"top"` — 输入框位于标签块上方',
  "Combobox.items": "下拉菜单中要展示的选项数组",
  "Combobox.value": "当前选中的值",
  "Combobox.children": "组合框的内容（触发器、内容、选项）",
  "Combobox.className": "额外的 CSS 类名",
  "Combobox.label":
    "组合框的标签内容（启用 Field 包裹层）——可以是字符串或任意 React 节点",
  "Combobox.required": "组合框是否必填",
  "Combobox.labelTooltip": "通过信息图标显示在标签旁的工具提示内容",
  "Combobox.description": "显示在组合框下方的辅助说明文字",
  "Combobox.error": "错误信息或校验错误对象",
  "Combobox.onValueChange": "选中项变化时的回调",
  "Combobox.multiple": "是否允许多选",
  "Combobox.isItemEqualToValue": "用于比较选项的自定义相等判断函数",
  "DeleteResource.open": "对话框是否展开",
  "DeleteResource.resourceType":
    "被删除资源的类型（例如“Zone”、“Worker”、“KV Namespace”）",
  "DeleteResource.resourceName": "被删除的具体资源名称",
  "DeleteResource.isDeleting": "删除操作是否正在进行",
  "DeleteResource.caseSensitive": "确认输入框是否区分大小写（默认：true）",
  "DeleteResource.deleteButtonText":
    "自定义删除按钮文字（默认为“Delete {resourceType}”）",
  "DeleteResource.className": "对话框的额外 className",
  "DeleteResource.errorMessage": "删除操作失败时显示的错误信息",
  "Dialog.className": "通过 `cn()` 合并的额外 CSS 类名。",
  "Dialog.children":
    "对话框内容（通常是 Title、Description、Close 和操作按钮）。",
  "Dialog.container":
    "传送层的容器元素。可用于把对话框渲染到 Shadow DOM 或自定义容器内。会覆盖 `LarkPortalProvider` 上下文。",
  "Dialog.size":
    '对话框宽度。\n- `"sm"` — 小尺寸（288px），用于简单确认\n- `"base"` — 默认（384px）\n- `"lg"` — 大尺寸（512px），用于复杂内容\n- `"xl"` — 超大尺寸（768px），用于详情视图',
  "DropdownMenu.variant":
    '下拉菜单项的视觉样式。\n- `"default"` — 标准菜单项外观\n- `"danger"` — 红色文字的危险操作',
  "DropdownMenu.CheckboxItem.checked": "该菜单项是否选中。",
  "DropdownMenu.CheckboxItem.defaultChecked":
    "该菜单项初始是否选中（非受控）。",
  "DropdownMenu.CheckboxItem.onCheckedChange": "选中状态变化时的回调。",
  "DropdownMenu.CheckboxItem.closeOnClick": "点击该菜单项后菜单是否关闭。",
  "DropdownMenu.CheckboxItem.disabled": "为 true 时该菜单项无法交互。",
  "DropdownMenu.Content.sideOffset": "与触发元素之间的距离（像素）。",
  "DropdownMenu.Content.container":
    "传送层的容器元素。可用于在 Shadow DOM 或自定义容器内渲染。",
  "DropdownMenu.Item.icon": "显示在标签前的图标。",
  "DropdownMenu.Item.variant": "菜单项的视觉样式。",
  "DropdownMenu.Item.selected": "为 true 时显示勾选标记。",
  "DropdownMenu.Item.inset": "增加左侧内边距，以便与带图标的菜单项对齐。",
  "DropdownMenu.Item.onClick": "点击菜单项时的回调。",
  "DropdownMenu.Item.closeOnClick": "点击该菜单项后菜单是否关闭。",
  "DropdownMenu.Item.disabled": "为 true 时该菜单项无法交互。",
  "DropdownMenu.LinkItem.href": "点击后跳转的 URL。",
  "DropdownMenu.LinkItem.icon": "显示在标签前的图标。",
  "DropdownMenu.LinkItem.variant": "菜单项的视觉样式。",
  "DropdownMenu.LinkItem.inset": "增加左侧内边距，以便与带图标的菜单项对齐。",
  "DropdownMenu.LinkItem.target":
    "链接的 target 属性（例如用 “_blank” 在新标签页打开）。",
  "DropdownMenu.LinkItem.render":
    "渲染为链接的自定义元素。用于接入框架路由（例如 Next.js 的 Link）。",
  "DropdownMenu.RadioGroup.value": "当前选中单选项的受控值。",
  "DropdownMenu.RadioGroup.defaultValue": "初始选中的值（非受控）。",
  "DropdownMenu.RadioGroup.onValueChange": "选中值变化时的回调。",
  "DropdownMenu.RadioGroup.disabled": "为 true 时分组内所有单选项均禁用。",
  "DropdownMenu.RadioItem.value": "该单选项的值。",
  "DropdownMenu.RadioItem.icon": "显示在标签前的图标。",
  "DropdownMenu.RadioItem.inset": "增加左侧内边距，以便与带图标的菜单项对齐。",
  "DropdownMenu.RadioItem.closeOnClick": "点击该菜单项后菜单是否关闭。",
  "DropdownMenu.RadioItem.disabled": "为 true 时该菜单项无法交互。",
  "DropdownMenu.SubTrigger.icon": "显示在标签前的图标。",
  "DropdownMenu.SubTrigger.inset": "增加左侧内边距，以便与带图标的菜单项对齐。",
  "Empty.size":
    '空状态容器的尺寸。\n- `"sm"` — 适合较小容器的紧凑空状态\n- `"base"` — 默认空状态尺寸\n- `"lg"` — 适合突出展示的大型空状态',
  "Empty.icon":
    "显示在标题上方的装饰性图标（例如来自 `@phosphor-icons/react`）。",
  "Empty.title": "空状态的主标题文字。",
  "Empty.description": "显示在标题下方的次要描述文字。",
  "Empty.commandLine": "显示在可复制代码块中的 Shell 命令。",
  "Empty.contents": "显示在描述下方的额外内容（按钮、链接）。",
  "Empty.className": "通过 `cn()` 合并的额外 CSS 类名。",
  "Grid.children": "要渲染的栅格项。",
  "Grid.className": "通过 `cn()` 合并的额外 CSS 类名。",
  "Grid.mobileDivider":
    '在移动端显示栅格项之间的分隔线（仅对 `"4up"` 变体有效）。',
  "Grid.gap":
    '栅格项之间的间距。\n- `"none"` — 无间距\n- `"sm"` — 12px 间距\n- `"base"` — 响应式间距（8px → 24px → 32px）\n- `"lg"` — 32px 间距',
  "Grid.variant":
    '响应式列布局变体。\n- `"2up"` — 1 列 → md 断点下 2 列\n- `"side-by-side"` — 始终 2 列\n- `"2-1"` — md 断点下 66%/33% 分栏\n- `"1-2"` — md 断点下 33%/66% 分栏\n- `"3up"` — 1 → 2 → 3 列\n- `"4up"` — 1 → 2 → 3 → 4 列\n- `"6up"` — 2 → 3 → 4 → 6 列\n- `"1-2-4up"` — 1 → 2 → 4 列',
  "InlineCopyText.labels": "用于本地化的无障碍标签。",
  "InlineCopyText.children":
    "要展示的内容。除非提供 `value`，否则字符串子元素会被复制。",
  "InlineCopyText.value": "要复制的值。`children` 不是字符串时必填。",
  "InlineCopyText.size": "文字尺寸。可选值取决于文字变体。",
  "InlineCopyText.bold": "是否使用中等字重。仅适用于正文字体变体。",
  "InlineCopyText.as":
    '要渲染的 HTML 元素。支持标题（`"h1"`–`"h6"`）、块级文字（`"p"`、`"pre"`）、行内文字（`"span"`、`"code"`、`"em"`、`"strong"`、`"small"`、`"abbr"`、`"time"`）、表单相关（`"label"`、`"legend"`）、列表/定义（`"dt"`、`"dd"`、`"li"`），以及 `"figcaption"`。\n\n- `"heading"` 变体**可选**（默认为 `"span"`）。请传入与该文字在文档大纲中层级相对应的标题元素。\n- 已废弃的标题变体（`"heading1"`、`"heading2"`、`"heading3"`）**必填**。\n- 正文变体（默认为 `"p"`）和等宽变体（默认为 `"span"`）**可选**。',
  "InlineCopyText.truncate":
    "是否用省略号截断溢出的文字。会添加 `truncate min-w-0` 类名。",
  "InlineCopyText.variant": "文字样式变体。支持除标题变体外的所有 Text 变体。",
  "Input.label":
    "输入框的标签内容（启用 Field 包裹层）——可以是字符串或任意 React 节点",
  "Input.labelTooltip": "通过信息图标显示在标签旁的工具提示内容",
  "Input.description": "显示在输入框下方的辅助说明文字",
  "Input.error": "错误信息或校验错误对象",
  "Input.passwordManagerIgnore":
    "在非凭据类输入框上屏蔽浏览器扩展密码管理器的浮层。",
  "Input.size":
    '输入框尺寸。\n- `"xs"` — 适合紧凑界面的超小尺寸\n- `"sm"` — 适合次要字段的小尺寸\n- `"base"` — 默认尺寸\n- `"lg"` — 适合突出字段的大尺寸',
  "Input.variant":
    '视觉变体。\n- `"default"` — 标准输入框\n- `"error"` — 校验失败时的错误状态',
  "InputArea.size":
    '输入框尺寸。\n- `"xs"` — 适合紧凑界面的超小尺寸\n- `"sm"` — 适合次要字段的小尺寸\n- `"base"` — 默认尺寸\n- `"lg"` — 适合突出字段的大尺寸',
  "InputArea.variant": "文本域的视觉变体。",
  "InputArea.label":
    "文本域的标签内容（启用 Field 包裹层）——可以是字符串或任意 React 节点。",
  "InputArea.labelTooltip": "通过信息图标显示在标签旁的工具提示内容。",
  "InputArea.description": "显示在文本域下方的辅助说明文字。",
  "InputArea.error": "错误信息或校验错误对象。",
  "InputArea.autoResize": "根据内容自动调整文本域高度。",
  "InputArea.minRows": "启用 `autoResize` 时最少显示的行数。",
  "InputArea.maxRows":
    "启用 `autoResize` 时最多扩展到的行数；超出部分将滚动显示。",
  "InputArea.onValueChange": "每次变化时以新的字符串值触发回调。",
  "InputGroup.label": "标签内容——可以是字符串或任意 React 节点。",
  "InputGroup.description":
    "显示在控件下方的辅助说明文字（存在 `error` 时隐藏）。",
  "InputGroup.error": "带错误信息和浏览器 `ValidityState` 匹配键的校验错误。",
  "InputGroup.required":
    "显式设为 `false` 时，在标签后显示灰色的“(optional)”文字。设为 `true` 或 `undefined` 时不显示任何标识。",
  "InputGroup.labelTooltip": "通过信息图标显示在标签旁的工具提示内容。",
  "InputGroup.Addon.align": "相对于输入框的位置。",
  "InputGroup.Addon.className": "额外的 CSS 类名。",
  "InputGroup.Button.tooltip":
    "提供时用 Tooltip 包裹按钮。若传入字符串值，会自动设置 aria-label。",
  "InputGroup.Button.tooltipSide": "工具提示弹出层偏好的显示位置。",
  "InputGroup.Button.variant": "按钮的视觉样式。默认为 ghost。",
  "InputGroup.Button.size": "按钮尺寸。",
  "InputGroup.Suffix.className": "额外的 CSS 类名。",
  "LayerCard.render":
    "允许用其他标签替换组件的 HTML 元素，或与其他组件组合。\n\n接受 `ReactElement` 或返回待渲染元素的函数。",
  "LayerDialog.Actions.children":
    "恰好一个操作。向 LayerDialog.Action 传入 `menu` 可承载“Save as draft”之类的相关操作。",
  "LayerDialog.Actions.dismissLabel":
    "自动关闭按钮的文字。只有当流程确实存在取消结果时才写“Cancel”。非英语产品请翻译该文案。",
  "LayerDialog.Content.container":
    "传送层的容器元素。会覆盖 `LarkPortalProvider` 上下文。",
  "LayerDialog.Content.size": "仅桌面端生效的宽度。移动端对话框始终为全宽。",
  "LayerDialog.Content.verticalAlign":
    "仅桌面端生效的定位方式。移动端对话框始终从底部弹出。",
  "LayerDialog.Content.closeLabel":
    "自动关闭 X 按钮的无障碍名称。会覆盖 LarkLocaleProvider 中的 `close` 译文。",
  "Loader.className": "通过 `cn()` 合并的额外 CSS 类名。",
  "Loader.size":
    '加载指示器的尺寸。可使用预设名称或自定义像素值。\n- `"sm"` — 16px，适合行内使用\n- `"base"` — 24px，默认尺寸\n- `"lg"` — 32px，适合醒目的加载状态',
  "Meter.customValue":
    "自定义格式化后的数值文本（例如“750 / 1,000”），用于代替百分比显示。",
  "Meter.label": "显示在进度条上方的标签文字。",
  "Meter.showValue": "是否在标签旁显示百分比数值。",
  "Meter.trackClassName": "进度条轨道（背景条）的额外 CSS 类名。",
  "Meter.indicatorClassName": "进度指示条（填充条）的额外 CSS 类名。",
  "Meter.value": "进度指示器当前的值",
  "Meter.max": "进度指示器的最大值（默认 100）",
  "Meter.min": "进度指示器的最小值（默认 0）",
  "Pagination.setPage": "页码变化时的回调",
  "Pagination.page": "当前页码（从 1 开始）。",
  "Pagination.perPage": "每页显示的条目数。",
  "Pagination.totalCount": "所有页的条目总数。",
  "Pagination.hasNextPage":
    "当总数未知时是否还有下一页。提供 `totalCount` 时该属性无效。总数未知时只使用顺序翻页控件。",
  "Pagination.className": "容器的额外 CSS 类名",
  "Pagination.labels":
    "用于国际化 aria-label 的标签。所有标签默认提供英文文案。\n\n对于“Showing X of Y”这类可见文字，请使用子组件的 render props：\n- 信息文字使用 `Pagination.Info` 的 children\n- “Per page:”文字使用 `Pagination.PageSize` 的 label 属性",
  "Pagination.children":
    "用于自定义布局的复合组件子元素。可使用 Pagination.Info、Pagination.PageSize、Pagination.Controls 和 Pagination.Separator。",
  "Popover.side":
    '气泡卡片显示在触发元素的哪一侧。\n- `"top"` — 触发元素上方\n- `"bottom"` — 触发元素下方\n- `"left"` — 触发元素左侧\n- `"right"` — 触发元素右侧',
  "Radio.Group.legend":
    "分组标题文字（无障碍访问必需）。如需更多控制标题样式，请省略此属性，改用 `<Radio.Legend>` 作为子元素。",
  "Radio.Group.children": "子级的 Radio.Item 组件（也可以包含 Radio.Legend）",
  "Radio.Group.orientation": "单选项的排列方向",
  "Radio.Group.appearance":
    '应用到所有 Radio.Item 子元素的外观样式。- `"default"` — 标准行内单选项 - `"card"` — 带边框、内边距和高亮选中态的选项卡片 - `"segmented"` — 适合少量选项的单行紧凑分组 单个单选项可以覆盖默认和卡片外观；分段式仅用于分组，不能被单个单选项覆盖。',
  "Radio.Group.error": "分组的错误信息",
  "Radio.Group.description": "分组的辅助说明文字",
  "Radio.Group.value": "选中单选项的受控值。",
  "Radio.Group.disabled": "分组内所有单选按钮是否禁用",
  "Radio.Group.controlPosition":
    "单选控件相对标签的位置：“start”把单选按钮放在标签之前，“end”把标签放在单选按钮之前。默认外观下为“start”，卡片外观下为“end”。",
  "Radio.Group.name": "单选分组在表单提交时使用的名称",
  "Radio.Group.className": "额外的 CSS 类名",
  "Radio.Group.defaultValue": "选中单选项的初始值（非受控）。",
  "Radio.Group.onValueChange":
    "选中值变化时触发的回调。第二个参数携带关于本次交互的原生事件信息。",
  "Radio.Legend.children": "标题内容",
  "Radio.Legend.className":
    "额外的 CSS 类名（例如用 “sr-only” 在视觉上隐藏标题）",
  "Select.align": "弹出层相对指定边缘的对齐方式。",
  "Select.alignItemWithTrigger":
    "是否让定位层与触发元素重叠，使选中项文字与触发元素的取值文字对齐。仅对鼠标输入生效，空间不足时会自动禁用。",
  "Select.alignOffset":
    "沿对齐轴的额外偏移量（像素）。也可以传入一个返回偏移量的函数，该函数可读取锚点元素与定位层元素的尺寸，以及它们的边缘和对齐方式。\n\n该函数接收一个 `data` 对象参数，包含以下属性：\n- `data.anchor`：锚点元素的尺寸，包含 `width` 和 `height` 属性。\n- `data.positioner`：定位层元素的尺寸，包含 `width` 和 `height` 属性。\n- `data.side`：定位层对齐在锚点元素的哪一侧。\n- `data.align`：定位层相对指定边缘的对齐方式。",
  "Select.anchor":
    "弹出层定位所依据的元素。默认情况下，弹出层会相对于触发元素定位。",
  "Select.arrowPadding":
    "箭头与弹出层边缘之间保持的最小距离。\n\n用于防止箭头元素超出弹出层的圆角。",
  "Select.collisionAvoidance":
    "决定弹出层定位时如何处理碰撞。\n\n`side` 控制首选放置轴（`top`/`bottom` 或 `left`/`right`）上的溢出处理：\n- `'flip'`：能放下时保持请求的边缘，否则尝试相对的一侧（`top` 与 `bottom`，或 `left` 与 `right`）。\n- `'shift'`：不改变边缘，保持请求的边缘并在裁剪边界内移动弹出层，使其保持可见。\n- `'none'`：不修正边缘轴上的溢出。\n\n`align` 控制对齐轴（`start`/`center`/`end`）上的溢出处理：\n- `'flip'`：保持边缘，但当请求的对齐方式溢出时互换 `start` 与 `end`。\n- `'shift'`：保持边缘和请求的对齐方式，然后沿对齐轴微调弹出层位置以适应空间。\n- `'none'`：不修正对齐轴上的溢出。\n\n`fallbackAxisSide` 控制首选轴无法容纳时在垂直轴上的回退行为：\n- `'start'`：允许回退到垂直轴，并优先尝试逻辑起始侧（LTR 下先 `top` 后 `bottom`，或先 `left` 后 `right`）。\n- `'end'`：允许回退到垂直轴，并优先尝试逻辑结束侧（LTR 下先 `bottom` 后 `top`，或先 `right` 后 `left`）。\n- `'none'`：不回退到垂直轴。\n\n当 `side` 为 `'shift'` 时，显式设置 `align` 只支持 `'shift'` 或 `'none'`。省略 `align` 时默认为 `'flip'`。",
  "Select.collisionBoundary": "限定弹出层活动区域的元素或矩形。",
  "Select.collisionPadding": "与碰撞边界边缘之间保持的额外间距。",
  "Select.disableAnchorTracking": "是否禁止弹出层跟随定位锚点的布局变化。",
  "Select.positionMethod": "使用哪个 CSS `position` 属性。",
  "Select.side": "弹出层对齐在锚点元素的哪一侧。为避免碰撞可能会自动改变。",
  "Select.sideOffset":
    "锚点元素与弹出层之间的距离（像素）。也可以传入一个返回距离的函数，该函数可读取锚点元素与定位层元素的尺寸，以及它们的边缘和对齐方式。\n\n该函数接收一个 `data` 对象参数，包含以下属性：\n- `data.anchor`：锚点元素的尺寸，包含 `width` 和 `height` 属性。\n- `data.positioner`：定位层元素的尺寸，包含 `width` 和 `height` 属性。\n- `data.side`：定位层对齐在锚点元素的哪一侧。\n- `data.align`：定位层相对指定边缘的对齐方式。",
  "Select.sticky": "当锚点元素滚出视口后，是否让弹出层保持在视口内。",
  "Select.className": "通过 `cn()` 合并的额外 CSS 类名。",
  "Select.render": "替换触发元素，同时保留 Select 的行为。",
  "Select.size": "选择器触发器的尺寸。与 Input 组件的尺寸一致。",
  "Select.label":
    "选择器的标签内容。提供后会在选择器上方启用带可见标签的 Field 包裹层。若需要无障碍支持但不想显示标签，请改用 `aria-label`。",
  "Select.placeholder": "未选中任何值时显示的占位符文字。",
  "Select.loading": "为 `true` 时，用骨架加载指示器代替选中值显示。",
  "Select.disabled": "选择器是否禁用。",
  "Select.required": "选择器是否必填。为 `false` 时显示“(optional)”文字。",
  "Select.labelTooltip": "通过信息图标显示在标签旁的工具提示内容。",
  "Select.value": "当前选中的值（受控模式）。",
  "Select.children": "在下拉菜单中渲染的 `Select.Option` 元素。",
  "Select.description": "显示在选择器下方的辅助说明文字。",
  "Select.error": "错误信息字符串，或带 `match` 键的校验错误对象。",
  "Select.onValueChange": "选中项变化时的回调",
  "Select.defaultValue": "非受控模式下的初始值",
  "Select.renderValue":
    "返回 ReactNode 的函数，用于格式化触发元素中显示的选中值。使用对象值时必填。空状态请使用 `placeholder`。",
  "Select.items":
    '弹出层中渲染的选项数据结构。接受普通对象映射（`{ key: "Label" }`）或 `{ label, value }` 数组，用于对象或复杂值。',
  "Select.isItemEqualToValue":
    "用于比较选项的自定义相等判断函数。值为对象时必填，因为对象引用（`===`）在不同渲染之间无法匹配。",
  "SensitiveInput.value": "受控的值",
  "SensitiveInput.size":
    '输入框尺寸。\n- `"xs"` — 适合紧凑界面的超小尺寸\n- `"sm"` — 适合次要字段的小尺寸\n- `"base"` — 默认输入框尺寸\n- `"lg"` — 适合突出字段的大尺寸',
  "SensitiveInput.variant":
    '输入框的样式变体。\n- `"default"` — 默认输入框外观\n- `"error"` — 校验失败时的错误状态',
  "SensitiveInput.label":
    "输入框的标签内容（启用 Field 包裹层并设置掩码状态的标签）——可以是字符串或任意 React 节点",
  "SensitiveInput.labelTooltip": "通过信息图标显示在标签旁的工具提示内容",
  "SensitiveInput.description": "显示在输入框下方的辅助说明文字",
  "SensitiveInput.error": "错误信息或校验错误对象",
  "Slider.label": "显示在滑块轨道上方的标签。",
  "Slider.getAriaLabel":
    "每个滑块手柄的无障碍名称。没有可见的 `label` 时使用它，或用于区分范围滑块中的各个手柄。",
  "Slider.value": "受控值。传入数组可为每个值渲染一个手柄（范围）。",
  "Slider.defaultValue":
    "非受控的初始值。传入数组可为每个值渲染一个手柄（范围）。",
  "Slider.onValueChange": "拖动或通过键盘操作导致值变化时调用",
  "Slider.min": "滑块的最小值（默认 0）",
  "Slider.max": "滑块的最大值（默认 100）",
  "Slider.step": "每一步的值变化量（默认 1）",
  "Slider.format": "格式化数值徽标、范围标签以及朗读给辅助技术的数值",
  "Slider.disabled": "滑块是否禁用",
  "Switch.variant":
    "视觉变体：“default”（胶囊形、品牌色）或“neutral”（方形圆角、单色）",
  "Switch.label":
    "开关的标签内容（内置 Field 包裹层）——可以是字符串或任意 React 节点。单独用于纯视觉展示时可省略。",
  "Switch.labelTooltip": "通过信息图标显示在标签旁的工具提示内容",
  "Switch.required":
    "开关是否必填。显式设为 false 时，在标签后显示“(optional)”文字。",
  "Switch.controlFirst":
    "为 true（默认）时开关显示在标签之前；为 false 时标签显示在开关之前。",
  "Switch.onClick": "点击开关时的回调",
  "Switch.Group.legend":
    "分组标题文字。如需更多控制标题样式，请省略此属性，改用 `<Switch.Legend>` 作为子元素。",
  "Switch.Group.children":
    "子级的 Switch.Item 组件（也可以包含 Switch.Legend）",
  "Switch.Group.error": "分组的错误信息（仅在分组中显示，单个开关不显示）",
  "Switch.Group.description": "分组的辅助说明文字",
  "Switch.Group.disabled": "分组内所有开关是否禁用",
  "Switch.Group.controlFirst":
    "为 true（默认）时开关显示在标签之前；为 false 时标签显示在开关之前。",
  "Switch.Group.className": "额外的 CSS 类名",
  "Switch.Legend.children": "标题内容",
  "Switch.Legend.className":
    "额外的 CSS 类名（例如用 “sr-only” 在视觉上隐藏标题）",
  "Table.className": "额外的 CSS 类名",
  "Table.children": "子元素",
  "TableOfContents.Group.label": "显示在该分组条目上方的标签。",
  "TableOfContents.Group.href":
    "分组标签链接到的 URL。提供后，标签会渲染为带条目样式的可点击链接。",
  "TableOfContents.Group.active":
    "该分组的标签是否表示当前激活的章节。仅在提供 `href` 时生效。",
  "TableOfContents.Item.active": "该条目是否表示当前激活的章节。",
  "TableOfContents.Item.render":
    "渲染为链接的自定义元素。用于接入框架路由（例如 Next.js 的 `<Link>`、React Router 的 `<NavLink>`）。该元素会接收包括 `href`、`className` 和 `children` 在内的所有锚点属性。",
  "Tabs.tabs": "要渲染的标签页项数组。",
  "Tabs.value": "受控值。设置后组件变为受控模式。",
  "Tabs.selectedValue": "非受控模式下的默认选中值。设置 `value` 后该属性无效。",
  "Tabs.activateOnFocus":
    "为 `true` 时，标签页通过方向键获得焦点后立即激活。为 `false`（默认）时，标签页只获得焦点，需要按 Enter/空格键才能激活。",
  "Tabs.className": "根元素的额外 CSS 类名。",
  "Tabs.listClassName": "标签页列表元素的额外 CSS 类名。",
  "Tabs.indicatorClassName": "指示器元素的额外 CSS 类名。",
  "Tabs.labels": "用于国际化 aria-label 的标签。所有标签默认提供英文文案。",
  "Tabs.variant":
    '标签页样式。\n- `"segmented"` — 填充轨道上的胶囊形指示器\n- `"underline"` — 标签文字下方的下划线指示器',
  "Tabs.size":
    '标签页尺寸。\n- `"base"` — 默认尺寸（h-8, text-base）\n- `"sm"` — 紧凑尺寸（h-6, text-xs）——与 Input 的 size="sm" 一致',
  "Tabs.onValueChange": "激活标签页变化时的回调",
  "TagInput.name": "以该名称将每个已接受的标签作为独立的表单值提交。",
  "TagInput.readOnly": "禁止添加或删除标签，同时保持输入框可聚焦。",
  "TagInput.required":
    "原生表单校验要求至少有一个已接受的标签。与原生输入框一样，`readOnly` 的 TagInput 不参与校验。",
  "TagInput.labels": "生成的输入、操作和校验文案所对应的翻译标签。",
  "Text.variant":
    '文字样式变体。决定颜色、字体和字重。\n- `"heading"` — 标题文字（默认 16px，`size="lg"` 时为 20px；半粗）\n- `"heading1"` — 已废弃，请使用 `"heading"`（30px，半粗）\n- `"heading2"` — 已废弃，请使用 `"heading"`（24px，半粗）\n- `"heading3"` — 已废弃，请使用 `"heading"`（16px，半粗）\n- `"body"` — 默认正文\n- `"secondary"` — 次要信息的弱化文字\n- `"success"` — 成功状态文字\n- `"error"` — 错误状态文字\n- `"mono"` — 代码等宽文字\n- `"mono-secondary"` — 弱化的等宽文字',
  "Text.size":
    '文字尺寸。可选值取决于变体：\n- `"heading"` — 省略时为 16px，设为 `"lg"` 时为 20px\n- 正文变体 — `"xs"`（12px）、`"sm"`（13px）、`"base"`（14px）或 `"lg"`（16px）\n- 等宽变体 — 省略时为 13px，设为 `"lg"` 时为 14px',
  "Text.bold": "是否使用粗体字重（仅适用于正文变体）。",
  "Text.truncate":
    "是否用省略号截断溢出的文字。会添加 `truncate min-w-0` 类名。",
  "Text.as":
    '要渲染的 HTML 元素。支持标题（`"h1"`–`"h6"`）、块级文字（`"p"`、`"pre"`）、行内文字（`"span"`、`"code"`、`"em"`、`"strong"`、`"small"`、`"abbr"`、`"time"`）、表单相关（`"label"`、`"legend"`）、列表/定义（`"dt"`、`"dd"`、`"li"`），以及 `"figcaption"`。\n\n- `"heading"` 变体**可选**（默认为 `"span"`）。请传入与该文字在文档大纲中层级相对应的标题元素。\n- 已废弃的标题变体（`"heading1"`、`"heading2"`、`"heading3"`）**必填**。\n- 正文变体（默认为 `"p"`）和等宽变体（默认为 `"span"`）**可选**。',
  "Text.children": "文字内容。",
  "Toasty.children": "应用内容。轻提示通过传送层渲染在其上方。",
  "Toasty.container":
    "传送层的容器元素。可用于在 Shadow DOM 或自定义容器内渲染轻提示。会覆盖 `LarkPortalProvider` 上下文。",
  "Toasty.toastManager":
    "由 `createLarkToastManager()` 创建的可选轻提示管理器。提供后，React 树之外的代码（定时器、模块加载回调、查询缓存监听器）也能通过 `useLarkToastManager()` 在树内返回的同一个支持去重的管理器来触发轻提示。该属性会透传给底层的 `@base-ui/react/toast` `Toast.Provider` 的 `toastManager` 属性——上游基础组件参见 https://base-ui.com/react/components/toast。",
  "Tooltip.className": "额外的 CSS 类名",
  "Tooltip.children": "子元素",
  "Tooltip.content": "工具提示中显示的内容",
  "Tooltip.Provider.delay":
    "指针进入触发元素后，延迟多少毫秒（ms）打开工具提示。",
  "Tooltip.Provider.closeDelay": "延迟多少毫秒（ms）关闭工具提示。",
  "Tooltip.Provider.timeout":
    "宽限期（ms），在此期间新打开的工具提示会跳过刚关闭工具提示的延迟。",
  "BubbleMap.echarts":
    "由使用方导入的 ECharts 核心实例（传入以便 tree-shaking）。需要 `MapChart`、`ScatterChart`、`TooltipComponent`，以及通过 `echarts.use([...])` 注册的渲染器。",
  "BubbleMap.geoJson": "用作陆地区底图的 GeoJSON `FeatureCollection`。",
  "BubbleMap.mapName":
    "可选的、稳定的 ECharts 地图注册名。当同一份 GeoJSON 在多次挂载时被解析为新的对象实例时，请设置该属性，以复用同一个全局 ECharts 注册。",
  "BubbleMap.data": "原始数据行。经纬度、数值和名称通过下面的访问器读取。",
  "BubbleMap.lng": "经度访问器（`T` 的键名或 `(row) => number`）。",
  "BubbleMap.lat": "纬度访问器（`T` 的键名或 `(row) => number`）。",
  "BubbleMap.value": "数值访问器——用于决定气泡大小。",
  "BubbleMap.name": "可选的名称访问器——默认工具提示会使用它。",
  "BubbleMap.minRadius": "最小气泡半径，单位为 px。默认：`6`。",
  "BubbleMap.maxRadius": "最大气泡半径，单位为 px。默认：`26`。",
  "BubbleMap.bubbleSize":
    "显式指定的气泡半径 `(value) => px`。会覆盖默认的 `minRadius`/`maxRadius` 缩放。",
  "BubbleMap.bubbleColor":
    "气泡填充色——可以是固定值，也可以是 `(row) => color`。默认为图表蓝色。",
  "BubbleMap.bubbleBorderColor":
    "气泡边框颜色——可以是固定值，也可以是 `(row) => color`。默认：`transparent`。",
  "BubbleMap.bubbleBorderWidth":
    "气泡边框宽度——可以是固定值，也可以是 `(row) => px`。默认：`0`。",
  "BubbleMap.center":
    "地图中心，格式为 `[longitude, latitude]`。默认为自动适配。",
  "BubbleMap.zoom": "缩放级别——会乘以自动适配得到的缩放比例。默认：`1.25`。",
  "BubbleMap.roam": "启用拖拽平移和滚轮缩放。默认：`false`。",
  "BubbleMap.projection":
    "地理投影。默认为限制纬度的墨卡托投影（扁平 2D 网页地图效果）。可传入其他 d3-geo 投影来覆盖，或传入 `null` 使用 ECharts 原生的等距圆柱投影绘图。请使用稳定的引用（模块级或经过 memo 缓存）：每次渲染都创建新对象会重建视图，并重置已平移或缩放的地图。",
  "BubbleMap.showTooltip": "显示工具提示。默认：`true`。",
  "BubbleMap.valueFormat":
    "默认工具提示中数值的格式化方式。默认：`toLocaleString()`。",
  "BubbleMap.tooltipFormatter":
    "自定义某一行的工具提示内容。返回由 ECharts 自带工具提示渲染的 HTML 字符串。**谨慎使用**：返回值会作为 HTML 注入。请对任何用户提供的字符串进行转义，以避免 XSS。",
  "BubbleMap.aspectRatio":
    '容器宽高比，写作 `width / height`（例如 `1.7` 或 `"16 / 9"`）。高度由渲染后的宽度推导，使地图铺满画框而不留黑边。默认为显示窗口的投影宽高比，使陆地刚好铺满边缘。也可传入 `height` 来固定像素高度。',
  "BubbleMap.height":
    "固定的图表高度，单位为像素。设置后覆盖 `aspectRatio`。留空则按宽高比计算尺寸（默认行为），使地图填满容器。",
  "ChoroplethMap.echarts":
    "由使用方导入的 ECharts 核心实例（传入以便 tree-shaking）。需要 `MapChart`、`VisualMapComponent`、`TooltipComponent`，以及通过 `echarts.use([...])` 注册的渲染器。",
  "ChoroplethMap.geoJson":
    "按数值着色的 GeoJSON `FeatureCollection`，其中的区域会被分级设色。",
  "ChoroplethMap.mapName":
    "可选的、稳定的 ECharts 地图注册名。当同一份 GeoJSON 在多次挂载时被解析为新的对象实例时，请设置该属性，以复用同一个全局 ECharts 注册。",
  "ChoroplethMap.data": "原始数据行。区域键名和数值通过下面的访问器读取。",
  "ChoroplethMap.name":
    "区域键访问器（`T` 的键名或 `(row) => string`）。每一行会与 `nameProperty` 等于该值的 GeoJSON 要素关联。",
  "ChoroplethMap.value": "数值访问器——用于决定区域的填充色。",
  "ChoroplethMap.nameProperty":
    '用于关联的 GeoJSON 要素属性。默认：`"name"`。真实数据通常用 ISO 代码属性来匹配会更可靠（例如 `"iso_a2"`）。',
  "ChoroplethMap.colorRange":
    "顺序色阶（由低到高）。默认为 Lark 分级设色地图的蓝色系，已调校为与无数据填充色明显区分。颜色分布在整条连续渐变上。",
  "ChoroplethMap.noDataColor":
    "没有匹配数据行的区域所使用的填充色。默认为中性的陆地灰色。",
  "ChoroplethMap.showLegend": "显示 visualMap 颜色图例。默认：`false`。",
  "ChoroplethMap.showTooltip": "显示工具提示。默认：`true`。",
  "ChoroplethMap.valueFormat":
    "默认工具提示中数值的格式化方式。默认：`toLocaleString()`。",
  "ChoroplethMap.tooltipFormatter":
    "自定义某一行的工具提示内容。返回由 ECharts 自带工具提示渲染的 HTML 字符串。**谨慎使用**：返回值会作为 HTML 注入。请对任何用户提供的字符串进行转义，以避免 XSS。",
  "ChoroplethMap.center":
    "地图中心，格式为 `[longitude, latitude]`。默认为自动适配。",
  "ChoroplethMap.zoom":
    "缩放级别——会乘以自动适配得到的缩放比例。默认：`1.25`。",
  "ChoroplethMap.roam": "启用拖拽平移和滚轮缩放。默认：`false`。",
  "ChoroplethMap.projection":
    "地理投影。默认为限制纬度的墨卡托投影（扁平 2D 网页地图效果）。可传入其他 d3-geo 投影来覆盖，或传入 `null` 使用 ECharts 原生的等距圆柱投影绘图。请使用稳定的引用（模块级或经过 memo 缓存）：每次渲染都创建新对象会重建视图，并重置已平移或缩放的地图。",
  "ChoroplethMap.aspectRatio":
    '容器宽高比，写作 `width / height`（例如 `1.7` 或 `"16 / 9"`）。高度由渲染后的宽度推导，使地图铺满画框而不留黑边。默认为显示窗口的投影宽高比，使区域刚好铺满边缘。也可传入 `height` 来固定像素高度。',
  "ChoroplethMap.height":
    "固定的图表高度，单位为像素。设置后覆盖 `aspectRatio`。留空则按宽高比计算尺寸（默认行为），使地图填满容器。",
  "GlobeMap.landColor":
    "斜线填充陆地的描边颜色。默认为 Lark 地图区域的中性色。",
  "GlobeMap.landHatchSpacing":
    "陆地斜线之间的间距，单位为 view-box 像素。默认：`10`。",
  "GlobeMap.oceanColor": "陆地和经纬网底层的填充色。默认为 Lark 基础表面色。",
  "GlobeMap.markers":
    "绘制在陆地上方的地理点位。接近地平线的点位会淡出，背面的点位会被隐藏。",
  "GlobeMap.markerColor": "标记的默认填充色。默认为 Lark 图表蓝色。",
  "GlobeMap.markerRadius": "标记的默认半径，单位为 view-box 像素。默认：`7`。",
  "GlobeMap.defaultRotation":
    "地球的初始旋转，格式为 `[longitude, latitude, roll]`。",
  "GlobeMap.autoRotate": "让地球持续水平旋转。默认：`false`。",
  "GlobeMap.autoRotateSpeed": "水平自动旋转速度，单位为度/秒。默认：`4`。",
  "GlobeMap.showGraticule": "绘制经纬辅助线。默认：`false`。",
  "GlobeMap.showTooltip": "显示 Lark 样式的标记工具提示。默认：`true`。",
  "GlobeMap.height": "固定的组件高度。否则地球会采用正方形宽高比。",
  "SankeyChart.echarts":
    "由使用方导入的 ECharts 核心实例。之所以由外部传入而不是在组件内部直接导入，是为了让使用方自行决定打包进产物的 ECharts 模块（tree-shaking）。",
  "SankeyChart.nodes": "桑基图中的节点数组",
  "SankeyChart.links": "按索引连接节点的连线数组",
  "SankeyChart.height": "图表高度，单位为像素",
  "SankeyChart.showNodeValues":
    "在标签上方显示节点数值（只要有任一节点带数值，就默认为 true）",
  "SankeyChart.nodeLabelLayout":
    "当 `showNodeValues` 为 true 时节点标签的布局方式。\n- 'stacked'：数值在上、名称在下（默认）\n- 'inline'：\"value name\" 排在同一行（更适合小节点）",
  "SankeyChart.formatValue": "节点数值的格式化函数（默认为 `toLocaleString`）",
  "SankeyChart.tooltipFormatter":
    "自定义工具提示格式化函数。返回 HTML 字符串，或返回空字符串以隐藏工具提示。",
  "SankeyChart.left":
    "桑基图布局在图表容器中的左侧内边距。可接受数字（px）或百分比字符串。ECharts 默认值：'5%'。",
  "SankeyChart.right":
    "桑基图布局在图表容器中的右侧内边距。可接受数字（px）或百分比字符串。ECharts 默认值：'5%'。",
  "SankeyChart.linkColor":
    "连线的填充样式：'gradient' 表示从源节点颜色渐变到目标节点颜色，'gray' 表示使用纯灰色",
  "Sidebar.defaultOpen": "非受控模式下的初始展开状态。",
  "Sidebar.open": "受控的展开状态。",
  "Sidebar.variant": "侧边栏的布局变体。",
  "Sidebar.side": "侧边栏位于哪一侧。",
  "Sidebar.resizable": "启用侧边栏边缘的拖拽调整宽度。",
  "Sidebar.defaultWidth": "可调整宽度时的初始宽度，单位为像素。",
  "Sidebar.minWidth": "调整宽度时的最小宽度，单位为像素。",
  "Sidebar.maxWidth": "调整宽度时的最大宽度，单位为像素。",
  "Sidebar.contained":
    "为 true 时，收起的侧边栏使用绝对定位而不是固定定位，作用范围限制在有边界的父容器内。适合用于演示和嵌入式侧边栏。",
  "Sidebar.peekable":
    '为 true 时，鼠标悬停或键盘聚焦收起的侧边栏会临时展开它。展开预览期间，`state` 为 `"peeking"`。移开之后会再次收起。',
  "Sidebar.animationDuration": "侧边栏展开/收起动画的时长，单位为毫秒。",
  "Sidebar.mobileBreakpoint":
    "视口宽度（单位为 px）低于该值时，侧边栏会渲染为移动端对话框面板，而不是桌面端的侧边栏轨道。",
  "Sidebar.children": "内容——通常是 `<Sidebar>` 加上主体内容。",
  "Sidebar.className": "外层 div 的额外 CSS 类名。",
  "Sidebar.MenuButton.size":
    '按钮尺寸。\n- `"base"` — 标准导航项\n- `"sm"` — 紧凑导航项',
  "Sidebar.MenuButton.target": "链接的 target——仅在提供了 `href` 时才有意义。",
  "Sidebar.MenuButton.itemId":
    "`useSidebar().scrollToItem(id)` 使用的锚点 id。",
  "Sidebar.MenuSubButton.active": "将该子项标记为当前激活/选中。",
  "Sidebar.MenuSubButton.href":
    "跳转地址。设置后通过 LinkProvider 渲染为链接。",
  "Sidebar.MenuSubButton.target":
    "链接的 target——仅在提供了 `href` 时才有意义。",
  "Sidebar.Provider.defaultOpen": "非受控模式下的初始展开状态。",
  "Sidebar.Provider.open": "受控的展开状态。",
  "Sidebar.Provider.variant": "侧边栏的布局变体。",
  "Sidebar.Provider.side": "侧边栏位于哪一侧。",
  "Sidebar.Provider.resizable": "启用侧边栏边缘的拖拽调整宽度。",
  "Sidebar.Provider.defaultWidth": "可调整宽度时的初始宽度，单位为像素。",
  "Sidebar.Provider.minWidth": "调整宽度时的最小宽度，单位为像素。",
  "Sidebar.Provider.maxWidth": "调整宽度时的最大宽度，单位为像素。",
  "Sidebar.Provider.contained":
    "为 true 时，收起的侧边栏使用绝对定位而不是固定定位，作用范围限制在有边界的父容器内。适合用于演示和嵌入式侧边栏。",
  "Sidebar.Provider.peekable":
    '为 true 时，鼠标悬停或键盘聚焦收起的侧边栏会临时展开它。展开预览期间，`state` 为 `"peeking"`。移开之后会再次收起。',
  "Sidebar.Provider.animationDuration":
    "侧边栏展开/收起动画的时长，单位为毫秒。",
  "Sidebar.Provider.mobileBreakpoint":
    "视口宽度（单位为 px）低于该值时，侧边栏会渲染为移动端对话框面板，而不是桌面端的侧边栏轨道。",
  "Sidebar.Provider.children": "内容——通常是 `<Sidebar>` 加上主体内容。",
  "Sidebar.Provider.className": "外层 div 的额外 CSS 类名。",
};
