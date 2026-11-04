import { useState, useEffect, useCallback, useMemo } from "react";
import { matchSorter } from "match-sorter";
import { CommandPalette, Badge, type HighlightRange } from "@lark-ui/core";
import {
  MagnifyingGlassIcon,
  CubeIcon,
  StackIcon,
  SquaresFourIcon,
  BookOpenIcon,
} from "@phosphor-icons/react";
import {
  bilingualName,
  componentKey,
  CATEGORY_NAMES_ZH,
} from "~/lib/component-names";
import { COMPONENT_DESCRIPTIONS } from "~/lib/component-descriptions";

/**
 * Components in the registry that don't have Astro doc pages yet.
 * These are filtered out of search results until docs are written.
 *
 * To add a new component to search:
 * 1. Create the Astro doc page (e.g., /pages/components/my-component.astro)
 * 2. Remove it from this exclusion list
 * 3. Add its description to COMPONENT_DESCRIPTIONS below
 */
const COMPONENTS_WITHOUT_DOCS = new Set([
  "Code", // Deprecated: use CodeHighlighted from @lark-ui/core/code
  "CodeBlock", // Deprecated: use CodeHighlighted from @lark-ui/core/code
  "DateRangePicker", // Deprecated: use DatePicker with mode="range"
  "Field",
  "Icon",
  "MenuBar", // Deprecated; use Tabs with variant="segmented" instead
  "Surface", // Deprecated compatibility export; no dedicated docs page
]);

/**
 * Chart components are auto-discovered from the @lark-ui/core registry, but
 * they are documented under /charts/* rather than /components/*. Map the ones
 * with a dedicated page to their real docs URL so search results link correctly
 * — e.g. searching "bubble" finds BubbleMap and links to /charts/maps#bubble-map
 * instead of a non-existent /components/bubble-map. Components that share a page
 * (BubbleMap + ChoroplethMap live on /charts/maps) deep-link to their section
 * anchor so the result lands on the right content.
 */
const CHART_COMPONENT_URLS: Record<string, string> = {
  SankeyChart: "/charts/sankey",
  TimeseriesChart: "/charts/timeseries",
  BubbleMap: "/charts/maps#bubble-map",
  ChoroplethMap: "/charts/maps#choropleth-map",
  GlobeMap: "/charts/maps#cloudflare-availability-locations",
};

/**
 * Chart components with no dedicated page of their own — they're already
 * represented by curated STATIC_PAGES entries (the "Charts" overview and
 * "Custom Chart"), so we exclude the registry duplicates from search.
 * ChartLegend additionally has no Props type, so it isn't in the registry —
 * listed here for clarity/forward-proofing.
 */
const CHART_COMPONENTS_WITHOUT_OWN_PAGE = new Set(["Chart", "ChartLegend"]);

/**
 * Map registry component names to their doc page slugs.
 * Only needed when the name doesn't match the standard kebab-case conversion.
 */
const SLUG_OVERRIDES: Record<string, string> = {
  CodeHighlighted: "code-highlighted",
  DropdownMenu: "dropdown",
  ResourceListPage: "resource-list",
  Toasty: "toast",
};

/**
 * Static pages that should be included in search.
 * These are top-level documentation pages that aren't in the component registry.
 */
const STATIC_PAGES: Array<{
  name: string;
  description: string;
  url: string;
  category: string;
  type?: "component" | "block" | "layout" | "page";
}> = [
  {
    name: "安装",
    description: "如何在项目中安装并配置 Lark。",
    url: "/installation",
    category: "快速开始",
  },
  {
    name: "贡献指南",
    description: "参与 Lark 组件库贡献的指南。",
    url: "/contributing",
    category: "快速开始",
  },
  {
    name: "无障碍",
    description: "Lark 组件的无障碍标准与最佳实践。",
    url: "/accessibility",
    category: "快速开始",
  },
  {
    name: "组件与区块",
    description: "理解组件（component）与区块（block）的区别。",
    url: "/components-vs-blocks",
    category: "快速开始",
  },
  {
    name: "颜色",
    description: "了解 Lark 的语义化颜色 token 与主题系统。",
    url: "/colors",
    category: "指南",
  },
  {
    name: "图表",
    description: "基于 ECharts 构建的图表。",
    url: "/charts",
    category: "图表",
  },
  {
    name: "图表颜色",
    description: "图表的语义化、分类与连续型配色指引。",
    url: "/charts/colors",
    category: "图表",
  },
  {
    name: "地图",
    description: "使用 GeoJSON 可视化地理数据的地图图表组件。",
    url: "/charts/maps",
    category: "图表",
  },
  {
    name: "自定义图表",
    description: "使用 Chart 组件构建自定义图表的示例。",
    url: "/charts/custom",
    category: "图表",
  },
  {
    name: "命令行工具",
    description: "使用 Lark CLI 向项目中添加组件和区块。",
    url: "/cli",
    category: "指南",
  },
  {
    name: "流式 UI",
    description: "Lark 中的服务端渲染与流式渲染支持。",
    url: "/streaming",
    category: "指南",
  },
  {
    name: "Figma",
    description: "配合 Lark Figma 插件在 Figma 中使用 Lark 组件。",
    url: "/figma",
    category: "指南",
  },
  {
    name: "组件注册表",
    description: "浏览和探索完整的 Lark 组件注册表。",
    url: "/registry",
    category: "指南",
  },
  {
    name: "CodeHighlighted 代码高亮",
    description: "由 Shiki 驱动的语法高亮代码块。",
    url: "/components/code-highlighted",
    category: "组件",
    type: "component",
  },
  {
    name: "Flow 流程图",
    description: "用于可视化顺序与并行工作流的图表组件。",
    url: "/components/flow",
    category: "组件",
    type: "component",
  },
];

interface ComponentRegistryEntry {
  name: string;
  type: "component" | "block" | "layout";
  description: string;
  category: string;
  props?: Record<string, unknown>;
}

interface ComponentRegistry {
  version: string;
  components: Record<string, ComponentRegistryEntry>;
}

interface SearchItem {
  name: string;
  type: "component" | "block" | "layout" | "page";
  description: string;
  category: string;
  url: string;
}

interface SearchGroup {
  label: string;
  items: SearchItem[];
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Build URL path from component type and name */
function getComponentUrl(type: string, name: string): string {
  // Chart components are documented under /charts/*, not /components/*.
  if (CHART_COMPONENT_URLS[name]) {
    return CHART_COMPONENT_URLS[name];
  }

  const slug =
    SLUG_OVERRIDES[name] ??
    name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  switch (type) {
    case "block":
      return `/blocks/${slug}`;
    case "layout":
      return `/layouts/${slug}`;
    default:
      return `/components/${slug}`;
  }
}

/** Get better description from mapping, falling back to registry */
function getDescription(key: string, registryDescription: string): string {
  return COMPONENT_DESCRIPTIONS[key] || registryDescription;
}

/** Find all matching ranges in text for a query (for highlighting) */
function findHighlightRanges(text: string, query: string): HighlightRange[] {
  if (!query.trim()) return [];

  const ranges: HighlightRange[] = [];
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  let startIndex = 0;
  while (true) {
    const index = textLower.indexOf(queryLower, startIndex);
    if (index === -1) break;
    // HighlightRange is [start, end] tuple (end is inclusive)
    ranges.push([index, index + queryLower.length - 1]);
    startIndex = index + 1;
  }

  return ranges;
}

/** Group items by category (used when browsing without a query) */
function groupByCategory(items: SearchItem[]): SearchGroup[] {
  const groups: Record<string, SearchItem[]> = {};

  for (const item of items) {
    const category = item.category || "其他";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
  }

  // Define category order: 快速开始 and 指南 first, Block/Layout last
  const categoryOrder = (cat: string): number => {
    if (cat === "快速开始") return 0;
    if (cat === "指南") return 1;
    if (cat === "区块" || cat === "布局") return 100;
    return 50; // Component categories in the middle
  };

  const sortedCategories = Object.keys(groups).sort((a, b) => {
    const orderDiff = categoryOrder(a) - categoryOrder(b);
    if (orderDiff !== 0) return orderDiff;
    return a.localeCompare(b);
  });

  return sortedCategories.map((category) => ({
    label: category,
    items: groups[category],
  }));
}

/** Return items as a single "Results" group (used when searching) */
function asSearchResults(items: SearchItem[]): SearchGroup[] {
  if (items.length === 0) return [];
  return [{ label: "搜索结果", items }];
}

/** Get icon for item type */
function getTypeIcon(type: "component" | "block" | "layout" | "page") {
  switch (type) {
    case "block":
      return <StackIcon size={16} weight="duotone" />;
    case "layout":
      return <SquaresFourIcon size={16} weight="duotone" />;
    case "page":
      return <BookOpenIcon size={16} weight="duotone" />;
    default:
      return <CubeIcon size={16} weight="duotone" />;
  }
}

/** Get badge for item type (only shown when searching, not when grouped by category) */
function getTypeBadge(
  type: "component" | "block" | "layout" | "page",
  isSearching: boolean,
) {
  if (!isSearching) return null; // Don't show badge when grouped - category label is enough

  switch (type) {
    case "block":
      return <Badge variant="neutral">区块</Badge>;
    case "layout":
      return <Badge variant="neutral">布局</Badge>;
    case "page":
      return <Badge variant="neutral">指南</Badge>;
    default:
      return null;
  }
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [registry, setRegistry] = useState<ComponentRegistry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch component registry
  useEffect(() => {
    async function fetchRegistry() {
      try {
        setLoading(true);
        const response = await fetch("/api/component-registry");
        if (!response.ok) {
          throw new Error(`Failed to fetch registry: ${response.status}`);
        }
        const data = await response.json();
        setRegistry(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load component registry:", err);
        setError("搜索索引加载失败");
      } finally {
        setLoading(false);
      }
    }

    if (open && !registry) {
      void fetchRegistry();
    }
  }, [open, registry]);

  // Convert registry to searchable items and include static pages
  const allItems = useMemo<SearchItem[]>(() => {
    // Always include static pages
    const staticItems: SearchItem[] = STATIC_PAGES.map((page) => ({
      name: page.name,
      type: page.type ?? "page",
      description: page.description,
      category: page.category,
      url: page.url,
    }));

    if (!registry?.components) return staticItems;

    const componentItems = Object.values(registry.components)
      .filter(
        (component) =>
          !COMPONENTS_WITHOUT_DOCS.has(component.name) &&
          !CHART_COMPONENTS_WITHOUT_OWN_PAGE.has(component.name),
      )
      .map((component) => {
        const url = getComponentUrl(component.type, component.name);
        const key = componentKey(url);
        return {
          name: bilingualName(component.name, key),
          type: component.type,
          description: getDescription(key, component.description),
          category: CATEGORY_NAMES_ZH[component.category] ?? component.category,
          url,
        };
      });

    return [...staticItems, ...componentItems];
  }, [registry]);

  // Filter and group items based on query using match-sorter
  const filteredGroups = useMemo<SearchGroup[]>(() => {
    if (!query.trim()) {
      return groupByCategory(allItems);
    }

    const filtered = matchSorter(allItems, query, {
      keys: [
        { key: "name", threshold: matchSorter.rankings.CONTAINS },
        { key: "description", threshold: matchSorter.rankings.CONTAINS },
        { key: "category", threshold: matchSorter.rankings.CONTAINS },
      ],
    });

    return asSearchResults(filtered);
  }, [allItems, query]);

  // Get flat list of all filtered items for keyboard navigation
  const getSelectableItems = useCallback(
    (groups: SearchGroup[]) => groups.flatMap((g) => g.items),
    [],
  );

  // Handle item selection
  const handleSelect = useCallback(
    (item: SearchItem, options: { newTab: boolean }) => {
      if (options.newTab) {
        window.open(item.url, "_blank");
      } else {
        window.location.href = item.url;
      }
      onOpenChange(false);
    },
    [onOpenChange],
  );

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const hasResults = filteredGroups.some((g) => g.items.length > 0);
  const totalResults = filteredGroups.reduce(
    (sum, g) => sum + g.items.length,
    0,
  );
  const isSearching = query.trim().length > 0;

  return (
    <CommandPalette.Root<SearchGroup, SearchItem>
      open={open}
      onOpenChange={onOpenChange}
      items={filteredGroups}
      value={query}
      onValueChange={setQuery}
      itemToStringValue={(group: SearchGroup) => group.label}
      onSelect={handleSelect}
      getSelectableItems={getSelectableItems}
      filter={() => true}
    >
      <CommandPalette.Input
        placeholder="搜索文档..."
        leading={
          <MagnifyingGlassIcon
            className="h-4 w-4 text-lark-subtle"
            weight="bold"
          />
        }
      />
      <CommandPalette.List>
        {loading ? (
          <CommandPalette.Loading />
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-lark-subtle">{error}</p>
          </div>
        ) : !hasResults ? (
          <CommandPalette.Empty>
            {query.trim()
              ? `未找到与「${query}」相关的结果`
              : "输入关键词搜索文档"}
          </CommandPalette.Empty>
        ) : (
          <CommandPalette.Results>
            {(group: SearchGroup) => (
              <CommandPalette.Group key={group.label} items={group.items}>
                <CommandPalette.GroupLabel>
                  {group.label}
                </CommandPalette.GroupLabel>
                <CommandPalette.Items>
                  {(item: SearchItem) => (
                    <CommandPalette.Item<SearchItem>
                      key={item.name}
                      value={item}
                      onClick={(e: React.MouseEvent) => {
                        const newTab = e.metaKey || e.ctrlKey;
                        handleSelect(item, { newTab });
                      }}
                    >
                      <div className="flex w-full items-center gap-3">
                        <div className="flex-shrink-0 text-lark-subtle">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <CommandPalette.HighlightedText
                              text={item.name}
                              highlights={findHighlightRanges(item.name, query)}
                              className="text-base font-medium text-lark-default"
                            />
                            {getTypeBadge(item.type, isSearching)}
                          </div>
                          <CommandPalette.HighlightedText
                            text={item.description}
                            highlights={findHighlightRanges(
                              item.description,
                              query,
                            )}
                            className="block truncate text-sm text-lark-subtle"
                          />
                        </div>
                      </div>
                    </CommandPalette.Item>
                  )}
                </CommandPalette.Items>
              </CommandPalette.Group>
            )}
          </CommandPalette.Results>
        )}
      </CommandPalette.List>
      <CommandPalette.Footer>
        <span className="text-lark-subtle">
          {hasResults ? `${totalResults} 条结果` : ""}
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-lark-hairline bg-lark-base px-1.5 py-0.5">
              ↑
            </kbd>
            <kbd className="rounded border border-lark-hairline bg-lark-base px-1.5 py-0.5">
              ↓
            </kbd>
            <span>导航</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-lark-hairline bg-lark-base px-1.5 py-0.5">
              ↵
            </kbd>
            <span>打开</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-lark-hairline bg-lark-base px-1.5 py-0.5">
              ⌘↵
            </kbd>
            <span>新标签页</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-lark-hairline bg-lark-base px-1.5 py-0.5">
              esc
            </kbd>
            <span>关闭</span>
          </span>
        </div>
      </CommandPalette.Footer>
    </CommandPalette.Root>
  );
}
