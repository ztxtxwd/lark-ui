---
name: lark-design
description: Cloudflare 产品设计规范。在设计、实现或评审 Cloudflare 控制台界面、Lark UI、响应式样式、对话框或前端测试时使用。
---

# Cloudflare 设计规范

在设计、实现或评审 Cloudflare 产品界面时，请遵循以下规则。请参照标为「推荐」的示例，并避开标为「避免」的模式。

## 规则

### `content-text-size` 正文文字使用 14px

所有正文文字——正文、按钮、数据以及其他可交互元素——字号都必须为 14px。16px 及以上仅限用于标题和副标题。

**推荐**

```tsx
<Text>正文文字</Text>
```

**避免**

```tsx
<Text size="lg">正文文字</Text>
```

### `heading-case` 标题始终使用句首大写（sentence case）

标题不要首字母大写，也不要全大写。产品名称则应使用标题式大写（title case）。

**推荐**

```tsx
<Text as="h2">Recent requests</Text>
```

**避免**

```tsx
<Text as="h2">Recent Requests</Text>
```

```tsx
<Text as="h2" DANGEROUS_className="uppercase">
  Recent requests
</Text>
```

### `font-tracking` 不要改变字体的字间距

不要使用 `tracking-*` 类来改变字符之间的间距。

**推荐**

```tsx
<span className="text-lg">Worker 指标</span>
```

**避免**

```tsx
<span className="text-lg tracking-tight">Worker 指标</span>
```

### `font-weight` 不要使用 `font-bold`

标题使用 `font-semibold`，加粗的行内文字使用 `font-medium`。

**推荐**

```tsx
<Text as="h3" variant="heading">账户设置</Text>
<Text as="strong" bold>必需</Text>
```

**避免**

```tsx
<Text as="h3" DANGEROUS_className="font-bold">账户设置</Text>
<Text as="strong" DANGEROUS_className="font-bold">必需</Text>
```

### `related-text-spacing` 让相关文字靠得更近

相关文字周围的间距应小于它所属内容的间距。

**推荐**

```tsx
<div className="grid gap-6">
  <div className="grid gap-1.5">
    <Text as="h3" variant="heading">
      Web Analytics
    </Text>
    <Text>无需改动代码即可衡量站点流量。</Text>
  </div>
  <Button>配置</Button>
</div>
```

**避免**

```tsx
<div className="grid gap-4">
  <Text as="h3" variant="heading">
    Web Analytics
  </Text>
  <Text>无需改动代码即可衡量站点流量。</Text>
  <Button>配置</Button>
</div>
```

### `text-spacing` 让文字周围的间距在视觉上对齐

文字周围的间距应考虑其行高。通常这意味着垂直间距应略小于水平间距。

**推荐**

```tsx
<LayerCard className="px-5 py-4">...</LayerCard>
```

**避免**

```tsx
<LayerCard className="p-5">...</LayerCard>
```

### `hover-color-transitions` 悬停状态不要使用颜色过渡

悬停时的颜色变化必须是即时的。快速交互中的过渡动画会让界面显得迟缓。

**推荐**

```tsx
<button className="hover:bg-lark-tint">...</button>
```

**避免**

```tsx
<button className="transition-colors duration-300 hover:bg-lark-tint">
  ...
</button>
```

### `shadow-borders` 不要同时使用边框和投影

使用 `ring ring-lark-line` 打造透明边框，同时保持边缘锐利。

**推荐**

```tsx
<LayerCard className="shadow-md ring ring-lark-line">...</LayerCard>
```

**避免**

```tsx
<LayerCard className="border border-lark-line shadow-md">...</LayerCard>
```

### `concentric-border-radius` 使用同心圆角

当边框或描边（ring）相距不超过 8px 时，它们的圆角必须在数学上同心：外圆角 = 内圆角 + 内边距。

**推荐**

```tsx
<div className="rounded-xl p-1">
  <div className="rounded-lg">...</div>
</div>
```

**避免**

```tsx
<div className="rounded-xl p-1">
  <div className="rounded-xl">...</div>
</div>
```

### `icon-alignment` 让图标与文字首行对齐

行内图标必须在视觉上与文字等大，并与文字垂直居中。多行对齐请使用 `h-lh flex items-center`。

**推荐**

```tsx
<div className="flex items-start gap-2">
  <span className="h-lh flex items-center">
    <Icon />
  </span>
  <Text>可能换行成多行的文字</Text>
</div>
```

**避免**

```tsx
<div className="flex items-start gap-2">
  <span className="flex items-center">
    <Icon />
  </span>
  <Text>可能换行成多行的文字</Text>
</div>
```

```tsx
<div className="flex items-center gap-2">
  <Icon />
  <Text>可能换行成多行的文字</Text>
</div>
```

### `inline-monospace-size` 缩小行内等宽文字的字号

等宽文字与常规文字混排时，字号应略小一些（约 0.9em）。

**推荐**

```tsx
<Text size="lg">
  编辑 <span className="font-mono text-[0.9em]">cloudflare.config.ts</span>{" "}
  后继续。
</Text>
```

**避免**

```tsx
<Text size="lg">
  编辑 <span className="font-mono">cloudflare.config.ts</span> 后继续。
</Text>
```

### `sticky-borders` 使用 `border` 将粘性元素与内容分隔开

**推荐**

```tsx
<div className="sticky top-0 border-b border-lark-line">...</div>
```

**避免**

```tsx
<div className="sticky top-0">...</div>
```

### `collapse-content-size` 折叠动画期间保持内容尺寸

折叠面板（Collapsible）在收起过程中必须保持内容尺寸，避免内容在动画期间发生位移。

**推荐**

```tsx
<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-64">...</div>
</motion.div>
```

**避免**

```tsx
<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-full min-w-0">...</div>
</motion.div>
```

### `layer-card-nesting` 不要让分层卡片（`LayerCard`）相互堆叠嵌套

**推荐**

```tsx
<div>
  <Text as="h3">最近的请求</Text>
  <LayerCard>...</LayerCard>
</div>
```

**避免**

```tsx
<LayerCard>
  <Text as="h3">最近的请求</Text>
  <LayerCard>...</LayerCard>
</LayerCard>
```

### `dialog-rendering` 不要按条件渲染对话框

按条件渲染对话框（Dialog）会让它的开关动画失效。请使用 `open` 属性来决定对话框是否可见。

**推荐**

```tsx
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog>
    <Dialog.Title>编辑 Worker</Dialog.Title>
    <Dialog.Description>更新此 Worker 的设置。</Dialog.Description>
  </Dialog>
</Dialog.Root>
```

**避免**

```tsx
{
  open && (
    <Dialog.Root open>
      <Dialog>
        <Dialog.Title>编辑 Worker</Dialog.Title>
      </Dialog>
    </Dialog.Root>
  );
}
```
