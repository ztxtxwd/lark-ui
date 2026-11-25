# LarkUI

飞书（Feishu / Lark）Universe Design 的高保真 React 组件库。基于 **React 19**、**@ui-sdk/react** 的可访问行为层与 **Tailwind CSS v4**，从官方设计规范与飞书 7.72 客户端中逐项还原尺寸、颜色、间距与交互状态。

> 状态：`0.1.1`，已完成飞书开放平台设计规范中的**全部 44 个组件**，含 **666 个浏览器测试**与完整 Storybook。

## 技术栈

| 层          | 选型                                                           |
| ----------- | -------------------------------------------------------------- |
| 视图        | React 19（Strict Mode）                                        |
| 行为 / a11y | `@ui-sdk/core` + `@ui-sdk/react`（键盘、焦点、弹层、表单语义） |
| 样式        | Tailwind CSS v4（CSS-first，无 PostCSS 插件）                  |
| 变体        | `cva` + `tailwind-merge` + `clsx`                              |
| 测试        | Vitest 5 Browser Mode（Chromium）+ Testing Library             |
| 文档        | Storybook 10 + `addon-a11y` + `addon-docs`                     |
| 工程        | pnpm Workspaces + Turborepo + Biome                            |

## 快速开始

```bash
pnpm install
pnpm storybook        # http://localhost:6006
pnpm test             # Vitest Browser Mode
pnpm build            # 构建 dist/index.js + dist/index.css
pnpm typecheck
```

在应用中使用：

```tsx
import { Button, Dialog, DialogContent, DialogTrigger, Input, Select } from "@larkui/core";
import "@larkui/core/styles.css";

export function Example() {
  return (
    <>
      <Input aria-label="搜索" placeholder="搜索文档" size="md" allowClear />
      <Select
        label="角色"
        options={[
          { value: "owner", label: "所有者" },
          { value: "admin", label: "管理员" },
        ]}
        placeholder="请选择角色"
      />
      <Dialog>
        <DialogTrigger>打开对话框</DialogTrigger>
        <DialogContent title="确认删除" footer={<Button tone="danger">删除</Button>}>
          删除后将无法恢复。
        </DialogContent>
      </Dialog>
    </>
  );
}
```

深色模式通过 `.dark` 或 `[data-theme="dark"]` 切换；所有颜色、圆角、阴影与字号均来自 CSS 变量，可在 `packages/tokens/src/tokens.css` 覆盖。

`@larkui/core/styles.css` 包含 Tailwind v4 preflight、`@layer ui-sdk` 声明与基础 body 字体/背景层，请在应用入口或根布局中只导入一次。

## 目录结构

```text
larkui/
├── packages/
│   ├── tokens/                 # UD design tokens + Tailwind theme bridge
│   │   └── src/tokens.css
│   └── core/
│       └── src/
│           ├── components/
│           │   └── Button/
│           │       ├── index.ts
│           │       ├── Button.tsx
│           │       ├── Button.test.tsx
│           │       └── Button.stories.tsx
│           ├── icons/          # UD 风格 16px 线性图标
│           ├── lib/cn.ts       # 配置了 Lark 色阶的 tailwind-merge
│           ├── styles/index.css
│           └── foundations/    # Storybook 设计基础页
├── apps/
│   └── storybook/
└── AGENTS.md                   # 组件实现契约与真相来源
```

每个组件独立目录、独立导出、独立测试与 Storybook 用例。行为一律来自 `@ui-sdk/react`，不手写 ARIA 弹层或焦点漫游。

## 设计真相来源

实现任何组件前按以下优先级取证据：

1. **飞书开放平台设计规范**（larkit 真值引擎）：
   `larkit doc read /tools-and-resources/design-specification/<category>/<component>`
2. **飞书 7.72 客户端解包 CSS**：
   `/root/code/lark-kumo/.feishu-extracted/asar/messenger/**/*.css`
   提取 `ud__*` 规则、`theme.css` 中的语义 token、精确高度/内边距/圆角/阴影。
3. 所有 token 汇总在 `packages/tokens/src/tokens.css`，组件中禁止硬编码十六进制颜色。

已还原的关键规格（示例）：

- Button：24 / 28 / 32 / 40 / 48px；12/20、12/20、14/22、16/24、18/26；圆角 6px；文字按钮 2px 4px 内边距。
- Input / Select：28 / 32 / 40px；圆角 6px；图标距边 12px、图标与文字间距 8px。
- Checkbox / Radio：16 × 16px；Checkbox 圆角 4px；与标签间距 8px；行热区 ≥ 22px。
- Switch：40 × 22px（18px 滑块）与 28 × 16px（12px 滑块），内缩 2px。
- Dialog：420 / 600 / 840 / 1080px；圆角 8px；标题区 24px 内边距；遮罩 `bg-mask`。
- Tooltip：12/20 字；8px 12px 内边距；最大宽度 320px；圆角 8px；Shadow/S4。
- Tabs：线条式 16/14/12px，2px 选中指示器，标签间距 24px；选项式高 28/24px。

## 组件清单

完整清单与规格见 [COMPONENTS.md](./COMPONENTS.md)。44 项全部完成：

**数据录入（17）** Button、Input、Checkbox、Radio、Switch、Select、Form、Slider、Stepper、Rate、Cascader、ColorPicker、DatePicker、TimePicker、Transfer、TreeSelect、Upload
**数据展示（13）** Tag、Badge、Avatar、Card、Collapse、Tabs、Tooltip、Timeline、Empty、Popover、Table、ImageViewer、Placeholder
**反馈（7）** Dialog、Drawer、Notice、Notification、Loading、Progress、Toast
**导航（7）** Anchor、Breadcrumb、Dropdown、NavigationMenu、Pagination、ScrollBar、Steps

## 工程约定

- 使用 `data-slot` / `data-checked` / `data-open` 等状态属性做样式，不写内联状态样式。
- 新颜色若要在 `text-*` / `bg-*` / `border-*` 中与字号类安全合并，必须同步登记到 `src/lib/cn.ts`。
- 每个组件必须提供：可访问名称、键盘路径、禁用/只读/加载状态测试、Storybook autodocs。
- 仅在确有浏览器差异、无障碍规则或权衡时写注释，注释控制在两行内。

## License

MIT
