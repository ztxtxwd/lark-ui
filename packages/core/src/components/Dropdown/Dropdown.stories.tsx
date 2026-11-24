import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "../../icons";
import {
  Dropdown,
  DropdownContent,
  DropdownContextTrigger,
  DropdownGroup,
  DropdownGroupLabel,
  DropdownItem,
  DropdownSeparator,
  DropdownSubmenu,
  DropdownSubmenuContent,
  DropdownSubmenuTrigger,
  DropdownTrigger,
} from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "飞书下拉菜单。用于收纳一组操作命令，点击触发区域展开，点击菜单项执行动作。\n\n" +
          "- 下拉面板：背景 `bg-float`，圆角 8px，投影 `shadow-s4`，最大高度 480px，最大宽度 420px\n" +
          "- 菜单项：高度 28px，左右内边距 8px，圆角 4px；距离面板左右各 4px\n" +
          "- 分割线：通栏 1px，上下间距 4px；危险项使用红色文字与图标\n" +
          "- 支持图标、快捷键、选中勾选、禁用、分组、级联菜单与右键上下文菜单\n" +
          "- 键盘：方向键、Home / End、Enter / Space、Escape、字符跳跃；关闭后焦点回到触发区域",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex h-[360px] w-full items-start justify-center p-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const triggerClass =
  "inline-flex h-8 cursor-pointer items-center gap-1 rounded-lark-md border border-solid border-lark-border bg-lark-canvas px-3 text-lark-14 text-lark-title transition-colors duration-100 hover:bg-[var(--lark-fill-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary";

export const Basic: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger className={triggerClass}>
        更多操作
        <ChevronDownIcon size={12} />
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem value="edit" shortcut="mod+e">
          编辑
        </DropdownItem>
        <DropdownItem value="duplicate">创建副本</DropdownItem>
        <DropdownItem value="copy">复制链接</DropdownItem>
        <DropdownSeparator />
        <DropdownItem value="move" shortcut="mod+shift+m">
          移动到
        </DropdownItem>
        <DropdownItem value="delete" danger>
          删除
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

export const Icons: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger aria-label="新建" className={triggerClass}>
        <PlusIcon />
        <ChevronDownIcon size={12} />
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem value="doc" icon={<PlusIcon />}>
          新建文档
        </DropdownItem>
        <DropdownItem value="sheet" icon={<CheckCircleIcon />}>
          新建表格
        </DropdownItem>
        <DropdownItem value="search" icon={<SearchIcon />} shortcut="mod+k">
          搜索
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

export const Selected: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger className={triggerClass}>排序方式</DropdownTrigger>
      <DropdownContent>
        <DropdownItem value="updated" selected>
          最近更新
        </DropdownItem>
        <DropdownItem value="created">最近创建</DropdownItem>
        <DropdownItem value="name">按名称</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

export const Danger: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger className={triggerClass}>删除</DropdownTrigger>
      <DropdownContent>
        <DropdownItem value="archive" icon={<AlertCircleIcon />}>
          归档
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem value="delete" icon={<XIcon />} danger>
          永久删除
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger className={triggerClass}>权限</DropdownTrigger>
      <DropdownContent>
        <DropdownItem value="edit">可编辑</DropdownItem>
        <DropdownItem value="comment" disabled>
          可评论（已停用）
        </DropdownItem>
        <DropdownItem value="view">仅查看</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger className={triggerClass}>添加</DropdownTrigger>
      <DropdownContent>
        <DropdownGroup>
          <DropdownGroupLabel>内容</DropdownGroupLabel>
          <DropdownItem value="doc">文档</DropdownItem>
          <DropdownItem value="sheet">表格</DropdownItem>
        </DropdownGroup>
        <DropdownSeparator />
        <DropdownGroup>
          <DropdownGroupLabel>其他</DropdownGroupLabel>
          <DropdownItem value="folder">文件夹</DropdownItem>
        </DropdownGroup>
      </DropdownContent>
    </Dropdown>
  ),
};

export const Submenu: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger className={triggerClass}>分享</DropdownTrigger>
      <DropdownContent>
        <DropdownItem value="copy" shortcut="mod+c">
          复制链接
        </DropdownItem>
        <DropdownSubmenu>
          <DropdownSubmenuTrigger icon={<SearchIcon />}>分享到</DropdownSubmenuTrigger>
          <DropdownSubmenuContent>
            <DropdownItem value="chat">聊天</DropdownItem>
            <DropdownItem value="docs">云文档</DropdownItem>
            <DropdownItem value="calendar">日历</DropdownItem>
          </DropdownSubmenuContent>
        </DropdownSubmenu>
        <DropdownSeparator />
        <DropdownItem value="settings">分享设置</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

export const IconTrigger: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger aria-label="更多操作" className={triggerClass}>
        <MoreHorizontalIcon />
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem value="edit">编辑</DropdownItem>
        <DropdownItem value="delete" danger>
          删除
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};

export const ContextMenu: Story = {
  render: () => (
    <Dropdown>
      <DropdownContextTrigger className="flex h-40 w-72 items-center justify-center rounded-lark-lg border border-dashed border-lark-border bg-lark-base text-lark-14 text-lark-caption">
        在此区域点击右键
      </DropdownContextTrigger>
      <DropdownContent>
        <DropdownItem value="paste">粘贴</DropdownItem>
        <DropdownItem value="select-all">全选</DropdownItem>
        <DropdownSeparator />
        <DropdownItem value="delete" danger>
          删除
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};
