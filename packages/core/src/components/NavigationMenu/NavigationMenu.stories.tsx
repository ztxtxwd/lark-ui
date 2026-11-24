import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchIcon } from "../../icons";
import { NavigationMenu, type NavigationMenuItemData } from "./NavigationMenu";

const items: NavigationMenuItemData[] = [
  { key: "home", label: "首页", href: "#home" },
  {
    key: "products",
    label: "产品",
    children: [
      { key: "docs", label: "文档", href: "#docs", description: "使用指南与 API 参考" },
      { key: "sheets", label: "表格", href: "#sheets", description: "在线协作表格" },
      { key: "base", label: "多维表格", href: "#base", description: "搭建业务系统" },
      { key: "wiki", label: "知识库", href: "#wiki", description: "沉淀团队知识" },
    ],
  },
  { key: "solutions", label: "解决方案", href: "#solutions" },
  { key: "pricing", label: "价格", href: "#pricing" },
];

const brand = (
  <span className="flex items-center gap-2 text-lark-18 font-semibold text-lark-title">
    <span className="flex size-7 items-center justify-center rounded-lark-md bg-lark-primary text-lark-on-primary">
      L
    </span>
    Lark
  </span>
);

const actions = (
  <div className="flex items-center gap-3">
    <button
      type="button"
      aria-label="搜索"
      className="flex size-8 cursor-pointer items-center justify-center rounded-lark-md border-0 bg-transparent text-lark-icon-2 transition-colors duration-100 hover:bg-lark-hover hover:text-lark-title focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lark-primary"
    >
      <SearchIcon size={16} />
    </button>
    <span className="flex size-8 items-center justify-center rounded-full bg-lark-primary-soft text-lark-12 font-medium text-lark-primary-content">
      飞
    </span>
  </div>
);

const meta: Meta<typeof NavigationMenu> = {
  title: "Components/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "导航菜单。顶部水平导航提供全局分类，侧边导航提供页面级导航。\n\n" +
          "- 顶部导航定高 56px，左右边距 24px；品牌区与导航区间距 40px\n" +
          "- 分类标签字号 16px，标签左右内边距 16px（相邻文本间距 32px）\n" +
          "- 选中态指示器与标签等宽、底对齐，高 3px；选中文本使用主色并加粗\n" +
          "- 含次级导航的条目展示下拉箭头，点击或悬停展开下拉面板\n" +
          "- 下拉面板依从 dropdown：宽 200px、圆角 8px、带阴影；面板链接展示选中态\n" +
          "- 键盘：左右方向键切换顶部条目，Enter / Space 打开，Esc 关闭；悬停有 50ms 意图延迟",
      },
    },
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
  args: {
    items,
    label: "主导航",
    defaultActiveKey: "home",
  },
  decorators: [
    (Story) => (
      <div className="min-w-[960px] rounded-lark-lg border border-lark-border-card">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TopNavigation: Story = {
  render: (args) => (
    <NavigationMenu
      {...args}
      brand={brand}
      brandHref="#home"
      brandLabel="Lark 首页"
      actions={actions}
    />
  ),
};

export const Dropdown: Story = {
  args: { defaultActiveKey: "docs", defaultValue: "products" },
  render: (args) => <NavigationMenu {...args} brand={brand} actions={actions} />,
};

export const Vertical: Story = {
  args: { orientation: "vertical", defaultActiveKey: "docs" },
  render: (args) => (
    <div className="flex min-h-[360px] items-stretch bg-lark-canvas">
      <NavigationMenu {...args} brand={brand} actions={actions} />
      <div className="flex-1 p-8 text-lark-14 text-lark-caption">在此区域展示当前导航的内容。</div>
    </div>
  ),
};

export const ActiveBranch: Story = {
  args: { defaultActiveKey: "sheets" },
  render: (args) => <NavigationMenu {...args} brand={brand} actions={actions} />,
};
