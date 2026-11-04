import { useState, useMemo } from "react";
import {
  Badge,
  Button,
  cn,
  DropdownMenu,
  Input,
  LayerCard,
  Pagination,
  Select,
  Table,
  Tooltip,
} from "@lark-ui/core";
import {
  Article,
  ChatCircle,
  DotsThree,
  Eye,
  Gear,
  House,
  Images,
  Minus,
  Moon,
  Newspaper,
  Palette,
  PencilSimple,
  Plus,
  PlugsConnected,
  Sun,
  Trash,
  User,
  Users,
  Wrench,
} from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// WordPress theme token overrides
// ---------------------------------------------------------------------------
const wpThemeStyles = `
[data-theme="wordpress"] {
  /* WP Admin primary brand — the classic blue */
  --color-lark-brand: #2271b1;
  --color-lark-brand-hover: #135e96;
  --text-color-lark-brand: #2271b1;

  /* WP surfaces */
  --color-lark-base: #ffffff;
  --color-lark-elevated: #f0f0f1;
  --color-lark-recessed: #dcdcde;
  --color-lark-overlay: #ffffff;
  --color-lark-control: #ffffff;
  --color-lark-tint: #f0f0f1;
  --color-lark-fill: #dcdcde;
  --color-lark-fill-hover: #c3c4c7;
  --color-lark-contrast: #1d2327;
  --color-lark-interact: #c3c4c7;

  /* WP borders — very subtle gray */
  --color-lark-hairline: #c3c4c7;
  --color-lark-hairline: #2271b1;

  /* WP text hierarchy */
  --text-color-lark-default: #1d2327;
  --text-color-lark-strong: #50575e;
  --text-color-lark-subtle: #787c82;
  --text-color-lark-inactive: #a7aaad;
  --text-color-lark-link: #2271b1;

  /* WP semantic colors */
  --color-lark-info: #72aee6;
  --color-lark-info-tint: #e7f4fe;
  --color-lark-success: #00a32a;
  --color-lark-success-tint: #edfaef;
  --color-lark-warning: #dba617;
  --color-lark-warning-tint: #fcf9e8;
  --color-lark-danger: #d63638;
  --color-lark-danger-tint: #fcf0f1;
  --text-color-lark-success: #00a32a;
  --text-color-lark-danger: #d63638;
  --text-color-lark-warning: #dba617;
}
`;

// ---------------------------------------------------------------------------
// Sample post data
// ---------------------------------------------------------------------------
interface Post {
  id: string;
  title: string;
  author: string;
  categories: string[];
  tags: string[];
  comments: number;
  date: string;
  status: "published" | "draft" | "pending" | "trash";
}

const samplePosts: Post[] = [
  {
    id: "1",
    title: "你好，世界！",
    author: "admin",
    categories: ["未分类"],
    tags: [],
    comments: 1,
    date: "2026-03-10",
    status: "published",
  },
  {
    id: "2",
    title: "LarkPress 入门",
    author: "admin",
    categories: ["教程", "入门"],
    tags: ["lark", "introduction"],
    comments: 12,
    date: "2026-03-09",
    status: "published",
  },
  {
    id: "3",
    title: "自定义你的主题",
    author: "editor",
    categories: ["设计"],
    tags: ["themes", "css", "customization"],
    comments: 5,
    date: "2026-03-08",
    status: "published",
  },
  {
    id: "4",
    title: "草稿：LarkPress 2.0 即将推出的新功能",
    author: "admin",
    categories: ["新闻"],
    tags: ["release", "features"],
    comments: 0,
    date: "2026-03-07",
    status: "draft",
  },
  {
    id: "5",
    title: "使用 Lark 组件搭建模块",
    author: "contributor",
    categories: ["开发", "教程"],
    tags: ["components", "react", "blocks"],
    comments: 8,
    date: "2026-03-06",
    status: "published",
  },
  {
    id: "6",
    title: "性能优化指南",
    author: "admin",
    categories: ["开发"],
    tags: ["performance", "optimization"],
    comments: 3,
    date: "2026-03-05",
    status: "pending",
  },
  {
    id: "7",
    title: "社区聚焦：2026 年 3 月",
    author: "editor",
    categories: ["社区"],
    tags: ["community", "spotlight"],
    comments: 15,
    date: "2026-03-04",
    status: "published",
  },
  {
    id: "8",
    title: "无障碍最佳实践",
    author: "contributor",
    categories: ["开发", "无障碍"],
    tags: ["a11y", "aria", "wcag"],
    comments: 7,
    date: "2026-03-03",
    status: "published",
  },
  {
    id: "9",
    title: "旧版迁移说明",
    author: "admin",
    categories: ["内部"],
    tags: ["migration"],
    comments: 0,
    date: "2026-02-15",
    status: "trash",
  },
  {
    id: "10",
    title: "API 参考文档",
    author: "admin",
    categories: ["文档"],
    tags: ["api", "reference"],
    comments: 2,
    date: "2026-03-02",
    status: "draft",
  },
];

// ---------------------------------------------------------------------------
// Sidebar nav items
// ---------------------------------------------------------------------------
const sidebarNav = [
  { icon: House, label: "仪表板", active: false },
  { icon: Article, label: "文章", active: true },
  { icon: Images, label: "媒体", active: false },
  { icon: Newspaper, label: "页面", active: false },
  { icon: ChatCircle, label: "评论", active: false },
  { icon: Palette, label: "外观", active: false },
  { icon: PlugsConnected, label: "插件", active: false },
  { icon: Users, label: "用户", active: false },
  { icon: Wrench, label: "工具", active: false },
  { icon: Gear, label: "设置", active: false },
];

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------
function statusBadgeVariant(
  status: Post["status"],
): "primary" | "secondary" | "destructive" | "success" | "outline" {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "secondary";
    case "pending":
      return "outline";
    case "trash":
      return "destructive";
  }
}

const STATUS_LABELS: Record<Post["status"], string> = {
  published: "已发布",
  draft: "草稿",
  pending: "待审核",
  trash: "回收站",
};

function statusLabel(status: Post["status"]) {
  return STATUS_LABELS[status];
}

// ---------------------------------------------------------------------------
// WP Admin Sidebar Component
// ---------------------------------------------------------------------------
function WPSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col bg-[#1d2327] text-white transition-all duration-300",
        collapsed ? "w-[48px]" : "w-[200px]",
      )}
    >
      {/* WP Logo area */}
      <div className="flex h-[48px] items-center gap-2 border-b border-white/10 px-3">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide text-white/90">
            LarkPress
          </span>
        )}
        {collapsed && (
          <span className="mx-auto text-sm font-bold text-white/90">K</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-px py-2">
        {sidebarNav.map((item) => (
          <button
            key={item.label}
            type="button"
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm transition-colors",
              "hover:bg-white/10",
              item.active
                ? "bg-[#2271b1] text-white"
                : "text-white/70 hover:text-white",
            )}
          >
            <item.icon size={18} weight={item.active ? "fill" : "regular"} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/10 p-2">
        <div className="flex items-center justify-center text-xs text-white/40">
          {!collapsed && "收起菜单"}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WP Admin Top Bar
// ---------------------------------------------------------------------------
function WPTopBar({
  darkMode,
  onToggleDarkMode,
}: {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}) {
  return (
    <div className="flex h-[48px] items-center justify-between border-b border-lark-hairline bg-lark-elevated px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-lark-default">文章</h1>
        <Button variant="primary" size="sm">
          <Plus size={14} weight="bold" />
          新建文章
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          aria-label="搜索文章"
          placeholder="搜索文章…"
          size="sm"
          className="w-[200px]"
        />
        <Tooltip content={darkMode ? "浅色模式" : "深色模式"}>
          <Button
            variant="ghost"
            size="sm"
            shape="square"
            aria-label={darkMode ? "浅色模式" : "深色模式"}
            onClick={onToggleDarkMode}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </Tooltip>
        <Tooltip content="查看站点">
          <Button
            variant="ghost"
            size="sm"
            shape="square"
            aria-label="查看站点"
          >
            <Eye size={16} />
          </Button>
        </Tooltip>
        <Button variant="ghost" size="sm" shape="circle" aria-label="用户资料">
          <User size={16} />
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Posts Dashboard Demo
// ---------------------------------------------------------------------------
export function LarkPressDemo() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Derive status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: samplePosts.length };
    for (const post of samplePosts) {
      counts[post.status] = (counts[post.status] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return samplePosts.filter((post) => {
      if (statusFilter !== "all" && post.status !== statusFilter) return false;
      if (categoryFilter !== "all" && !post.categories.includes(categoryFilter))
        return false;
      return true;
    });
  }, [statusFilter, categoryFilter]);

  // Derive unique categories
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const post of samplePosts) {
      for (const cat of post.categories) {
        cats.add(cat);
      }
    }
    return Array.from(cats).sort();
  }, []);

  // Selection helpers
  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredPosts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPosts.map((p) => p.id)));
    }
  };

  return (
    <>
      {/* Inject WP theme tokens */}
      <style dangerouslySetInnerHTML={{ __html: wpThemeStyles }} />

      <div
        data-theme="wordpress"
        data-mode={darkMode ? "dark" : undefined}
        className="flex h-[720px] overflow-hidden rounded-xl border border-lark-hairline bg-lark-elevated font-sans shadow-lg"
      >
        {/* Sidebar */}
        <div
          className="flex-none cursor-pointer"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <WPSidebar collapsed={sidebarCollapsed} />
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <WPTopBar
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />

          <div className="flex-1 overflow-y-auto bg-lark-elevated p-6">
            {/* Status tabs — the WordPress filter bar */}
            <div className="mb-4 flex items-center gap-1 text-sm">
              {[
                { key: "all", label: "全部" },
                { key: "published", label: "已发布" },
                { key: "draft", label: "草稿" },
                { key: "pending", label: "待审核" },
                { key: "trash", label: "回收站" },
              ].map((tab, idx, arr) => (
                <span key={tab.key} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter(tab.key);
                      setPage(1);
                    }}
                    className={cn(
                      "transition-colors hover:text-lark-default",
                      statusFilter === tab.key
                        ? "font-semibold text-lark-default"
                        : "text-lark-link",
                    )}
                  >
                    {tab.label}
                    <span className="ml-1 text-lark-subtle">
                      ({statusCounts[tab.key] || 0})
                    </span>
                  </button>
                  {idx < arr.length - 1 && (
                    <span className="mx-2 text-lark-subtle">|</span>
                  )}
                </span>
              ))}
            </div>

            {/* Bulk actions bar */}
            <div className="mb-4 flex items-center gap-3">
              <Select
                aria-label="批量操作"
                placeholder="批量操作"
                className="w-[160px]"
                value={bulkAction}
                onValueChange={(v) => setBulkAction(v as string | null)}
                items={{ edit: "编辑", trash: "移至回收站" }}
              />
              <Button
                variant="secondary"
                size="sm"
                disabled={!bulkAction || selectedIds.size === 0}
              >
                应用
              </Button>

              <div className="flex-1" />

              <Select
                aria-label="按分类筛选"
                placeholder="全部分类"
                className="w-[180px]"
                value={categoryFilter === "all" ? null : categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter((v as string) || "all");
                  setPage(1);
                }}
                items={allCategories.reduce(
                  (acc, cat) => {
                    acc[cat] = cat;
                    return acc;
                  },
                  {} as Record<string, string>,
                )}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setCategoryFilter("all");
                  setPage(1);
                }}
              >
                筛选
              </Button>
            </div>

            {/* Posts table */}
            <LayerCard>
              <LayerCard.Primary className="w-full overflow-x-auto p-0">
                <Table layout="fixed">
                  <colgroup>
                    <col style={{ width: "40px" }} />
                    <col />
                    <col style={{ width: "120px" }} />
                    <col style={{ width: "160px" }} />
                    <col style={{ width: "120px" }} />
                    <col style={{ width: "70px" }} />
                    <col style={{ width: "130px" }} />
                    <col style={{ width: "50px" }} />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.CheckHead
                        checked={
                          filteredPosts.length > 0 &&
                          selectedIds.size === filteredPosts.length
                        }
                        indeterminate={
                          selectedIds.size > 0 &&
                          selectedIds.size < filteredPosts.length
                        }
                        onValueChange={toggleAll}
                        aria-label="选择所有文章"
                      />
                      <Table.Head>标题</Table.Head>
                      <Table.Head>作者</Table.Head>
                      <Table.Head>分类</Table.Head>
                      <Table.Head>标签</Table.Head>
                      <Table.Head>
                        <span className="flex items-center gap-1">
                          <ChatCircle size={14} />
                        </span>
                      </Table.Head>
                      <Table.Head>日期</Table.Head>
                      <Table.Head />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredPosts.length === 0 ? (
                      <Table.Row>
                        <Table.Cell
                          colSpan={8}
                          className="py-12 text-center text-lark-subtle"
                        >
                          未找到文章。
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      filteredPosts.map((post) => (
                        <Table.Row
                          key={post.id}
                          variant={
                            selectedIds.has(post.id) ? "selected" : "default"
                          }
                        >
                          <Table.CheckCell
                            checked={selectedIds.has(post.id)}
                            onValueChange={() => toggleRow(post.id)}
                            aria-label={`选择“${post.title}”`}
                          />
                          <Table.Cell>
                            <div className="flex flex-col gap-0.5">
                              <span className="cursor-pointer font-medium text-lark-link hover:underline">
                                {post.title}
                              </span>
                              {post.status !== "published" && (
                                <Badge
                                  variant={statusBadgeVariant(post.status)}
                                >
                                  {statusLabel(post.status)}
                                </Badge>
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <span className="cursor-pointer text-lark-link hover:underline">
                              {post.author}
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex flex-wrap gap-1">
                              {post.categories.map((cat) => (
                                <span
                                  key={cat}
                                  className="cursor-pointer text-xs text-lark-link hover:underline"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex flex-wrap gap-1">
                              {post.tags.length > 0 ? (
                                post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="cursor-pointer text-xs text-lark-link hover:underline"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <Minus
                                  size={14}
                                  className="text-lark-inactive"
                                />
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <span
                              className={cn(
                                "tabular-nums",
                                post.comments > 0
                                  ? "text-lark-link"
                                  : "text-lark-subtle",
                              )}
                            >
                              {post.comments}
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex flex-col text-xs">
                              <span className="text-lark-default">
                                {post.status === "published"
                                  ? "已发布"
                                  : "最后修改"}
                              </span>
                              <span className="text-lark-subtle">
                                {post.date}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <DropdownMenu>
                              <DropdownMenu.Trigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    shape="square"
                                    aria-label="文章操作"
                                  >
                                    <DotsThree weight="bold" size={16} />
                                  </Button>
                                }
                              />
                              <DropdownMenu.Content>
                                <DropdownMenu.Item icon={PencilSimple}>
                                  编辑
                                </DropdownMenu.Item>
                                <DropdownMenu.Item icon={Eye}>
                                  查看
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item
                                  icon={Trash}
                                  variant="danger"
                                >
                                  移至回收站
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table>
              </LayerCard.Primary>
            </LayerCard>

            {/* Pagination */}
            <div className="mt-4">
              <Pagination
                page={page}
                setPage={setPage}
                perPage={perPage}
                totalCount={filteredPosts.length}
              >
                <Pagination.Info />
                <Pagination.Separator />
                <Pagination.PageSize
                  value={perPage}
                  onChange={(size) => {
                    setPerPage(size);
                    setPage(1);
                  }}
                  options={[10, 20, 50]}
                />
                <Pagination.Controls />
              </Pagination>
            </div>

            {/* Quick Stats row — inspired by WP dashboard widgets */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <LayerCard>
                <LayerCard.Primary className="p-4">
                  <div className="text-xs font-medium tracking-wide text-lark-subtle uppercase">
                    已发布
                  </div>
                  <div className="mt-1 text-2xl font-bold text-lark-default">
                    {statusCounts.published || 0}
                  </div>
                </LayerCard.Primary>
              </LayerCard>
              <LayerCard>
                <LayerCard.Primary className="p-4">
                  <div className="text-xs font-medium tracking-wide text-lark-subtle uppercase">
                    草稿
                  </div>
                  <div className="mt-1 text-2xl font-bold text-lark-default">
                    {statusCounts.draft || 0}
                  </div>
                </LayerCard.Primary>
              </LayerCard>
              <LayerCard>
                <LayerCard.Primary className="p-4">
                  <div className="text-xs font-medium tracking-wide text-lark-subtle uppercase">
                    评论总数
                  </div>
                  <div className="mt-1 text-2xl font-bold text-lark-default">
                    {samplePosts.reduce((sum, p) => sum + p.comments, 0)}
                  </div>
                </LayerCard.Primary>
              </LayerCard>
              <LayerCard>
                <LayerCard.Primary className="p-4">
                  <div className="text-xs font-medium tracking-wide text-lark-subtle uppercase">
                    分类
                  </div>
                  <div className="mt-1 text-2xl font-bold text-lark-default">
                    {allCategories.length}
                  </div>
                </LayerCard.Primary>
              </LayerCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
