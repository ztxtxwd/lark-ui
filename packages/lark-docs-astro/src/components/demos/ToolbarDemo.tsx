import { Combobox, InputGroup, Select, Toolbar } from "@lark-ui/core";
import {
  BookOpenIcon,
  DownloadSimpleIcon,
  FunnelSimpleIcon,
  GearSixIcon,
  MagnifyingGlassIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";

/** 基础工具栏（Toolbar），包含一个 InputGroup 和相邻的操作按钮。 */
export function ToolbarDemo() {
  return (
    <Toolbar className="w-full max-w-md">
      <Toolbar.InputGroup aria-label="搜索 DNS 记录" className="flex-1">
        <InputGroup.Addon>
          <MagnifyingGlassIcon />
        </InputGroup.Addon>
        <InputGroup.Input placeholder="搜索 DNS 记录" />
      </Toolbar.InputGroup>
      <Toolbar.Button icon={FunnelSimpleIcon} aria-label="筛选" />
      <Toolbar.Button icon={GearSixIcon} aria-label="设置" />
    </Toolbar>
  );
}

/** @deprecated 工具栏尺寸自定义仅为兼容性而保留。 */
export function ToolbarSizesDemo() {
  return (
    <div className="grid gap-3">
      {(["xs", "sm", "base", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-10 text-sm text-lark-subtle">{size}</span>
          <Toolbar size={size} className="w-fit">
            <Toolbar.Input aria-label={`${size} 搜索`} placeholder="搜索……" />
            <Toolbar.Button>应用</Toolbar.Button>
          </Toolbar>
        </div>
      ))}
    </div>
  );
}

/** 工具栏可以使用更简洁的 Input 简写形式。 */
export function ToolbarMixedControlsDemo() {
  return (
    <Toolbar className="w-full max-w-md">
      <Toolbar.Input
        aria-label="搜索 DNS 记录"
        placeholder="搜索 DNS 记录"
        className="flex-1"
      />
      <Toolbar.Button icon={FunnelSimpleIcon} aria-label="筛选" />
      <Toolbar.Button icon={GearSixIcon} aria-label="设置" />
    </Toolbar>
  );
}

/** 工具栏可以将 InputGroup 与相邻操作组合在一起。 */
export function ToolbarInputGroupDemo() {
  return (
    <Toolbar className="w-full max-w-lg">
      <Toolbar.InputGroup aria-label="Worker 子域名" className="flex-1">
        <InputGroup.Input placeholder="my-worker" />
        <InputGroup.Suffix>.workers.dev</InputGroup.Suffix>
      </Toolbar.InputGroup>
      <Toolbar.Button>访问</Toolbar.Button>
    </Toolbar>
  );
}

/** 工具栏按钮始终使用低调的工具栏样式。 */
export function ToolbarActionsDemo() {
  return (
    <Toolbar>
      <Toolbar.Button icon={UploadSimpleIcon}>上传</Toolbar.Button>
      <Toolbar.Button icon={DownloadSimpleIcon}>下载</Toolbar.Button>
    </Toolbar>
  );
}

/** 工具栏链接使用 LinkButton 实现导航，并采用工具栏样式。 */
export function ToolbarLinksDemo() {
  return (
    <Toolbar>
      <Toolbar.Link href="/components/button" icon={BookOpenIcon}>
        按钮文档
      </Toolbar.Link>
      <Toolbar.Button icon={DownloadSimpleIcon}>下载</Toolbar.Button>
    </Toolbar>
  );
}

/** 工具栏条目使用 aria-label 提供紧凑的无障碍名称。 */
export function ToolbarLabelsDemo() {
  return (
    <Toolbar className="w-full max-w-lg">
      <Toolbar.Input
        aria-label="搜索记录"
        className="flex-1"
        placeholder="搜索"
      />
      <Toolbar.Button icon={MagnifyingGlassIcon} aria-label="搜索" />
    </Toolbar>
  );
}

/** 选择器通过 Toolbar.Button 组合出其触发器。 */
export function ToolbarSelectDemo() {
  return (
    <Toolbar>
      <Toolbar.Button icon={FunnelSimpleIcon}>筛选</Toolbar.Button>
      <Select
        aria-label="排序记录"
        defaultValue="name"
        items={{ name: "名称", created: "创建日期", status: "状态" }}
        render={<Toolbar.Button />}
      />
      <Toolbar.Button icon={GearSixIcon} aria-label="查看设置" />
    </Toolbar>
  );
}

const toolbarComboboxItems = ["全部记录", "启用", "暂停", "失败"];

/** 组合框通过 Toolbar.Input 组合出其可编辑触发器。 */
export function ToolbarComboboxDemo() {
  return (
    <Toolbar className="w-full max-w-md">
      <Toolbar.Button icon={FunnelSimpleIcon}>状态</Toolbar.Button>
      <Combobox items={toolbarComboboxItems}>
        <Combobox.TriggerInput
          aria-label="筛选状态"
          className="flex-1"
          placeholder="筛选状态……"
          render={<Toolbar.Input />}
        />
        <Combobox.Content>
          <Combobox.List>
            {(item: string) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
          <Combobox.Empty>没有匹配的状态。</Combobox.Empty>
        </Combobox.Content>
      </Combobox>
    </Toolbar>
  );
}
