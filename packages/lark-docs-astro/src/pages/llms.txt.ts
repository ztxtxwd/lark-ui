import type { APIRoute } from "astro";
import componentRegistry from "@lark-ui/core/ai/component-registry.json";
import { bilingualName } from "../lib/component-names";
import { COMPONENT_DESCRIPTIONS } from "../lib/component-descriptions";

export const prerender = true;

const SITE_URL = "https://lark-ui.com";

const componentDocPages = import.meta.glob("./components/*.{astro,mdx}");
const blockDocPages = import.meta.glob("./blocks/*.{astro,mdx}");
const chartDocPages = import.meta.glob("./charts/*.{astro,mdx}");

// Add an override when the registry component name does not match its docs page slug.
const registryRouteOverrides: Record<string, string> = {
  Code: "code-highlighted",
  DropdownMenu: "dropdown",
  ResourceListPage: "resource-list",
  Toasty: "toast",
};

// Add an override when the docs page slug needs custom capitalization or spacing.
const titleOverrides: Record<string, string> = {
  "code-highlighted": "CodeHighlighted",
  "input-area": "InputArea",
  "input-group": "InputGroup",
  "resource-list": "Resource List",
  "table-of-contents": "Table of Contents",
};

const chartTitleOverrides: Record<string, string> = {
  colors: "Chart Colors",
  custom: "Custom Chart",
  index: "Charts",
};

const chartDescriptions: Record<string, string> = {
  colors: "图表的颜色 token 与配色指引。",
  custom: "自定义图表实现方式的指引。",
  index: "Lark 图表模式总览。",
  maps: "使用 GeoJSON 可视化地理数据的地图图表组件。",
  sankey: "桑基图的使用方式与示例。",
  timeseries: "时间序列图的使用方式与示例。",
};

interface LlmLink {
  title: string;
  path: string;
  description: string;
}

interface RegistryItem {
  name: string;
  description: string;
}

const coreDocs: LlmLink[] = [
  {
    title: "安装",
    path: "/installation.md",
    description: "在应用中安装 Lark 并配置样式。",
  },
  {
    title: "组件与区块",
    path: "/components-vs-blocks.md",
    description: "理解可复用的包内组件与通过 CLI 安装的区块之间的区别。",
  },
  {
    title: "命令行工具",
    path: "/cli.md",
    description: "使用 Lark 命令行工具完成项目初始化与安装区块。",
  },
  {
    title: "贡献指南",
    path: "/contributing.md",
    description: "贡献流程与开发规范。",
  },
  {
    title: "无障碍",
    path: "/accessibility.md",
    description: "使用 Lark 组件构建界面时的无障碍指引。",
  },
  {
    title: "颜色",
    path: "/colors.md",
    description: "语义化颜色 token 与主题行为。",
  },
  {
    title: "Figma 资源",
    path: "/figma.md",
    description: "设计资源与 Figma 集成说明。",
  },
  {
    title: "流式 UI",
    path: "/streaming.md",
    description: "流式界面的模式与示例。",
  },
  {
    title: "组件注册表",
    path: "/registry.md",
    description: "组件注册表参考与元数据。",
  },
  {
    title: "更新日志",
    path: "/changelog.md",
    description: "Lark 的发布说明。",
  },
  {
    title: "开源许可",
    path: "/license.md",
    description: "Lark UI 的开源许可、上游归属与第三方组件说明。",
  },
];

function slugFromPagePath(pagePath: string) {
  return pagePath
    .replace(/^\.\/(components|blocks|charts)\//, "")
    .replace(/\.(astro|mdx)$/, "");
}

function slugFromRegistryName(name: string) {
  return (
    registryRouteOverrides[name] ??
    name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
      .toLowerCase()
  );
}

function titleFromSlug(slug: string, key = slug) {
  const base =
    titleOverrides[slug] ??
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  return bilingualName(base, key);
}

function descriptionSummary(description: string) {
  const normalized = plainAscii(description).replace(/\s+/g, " ").trim();
  if (!normalized) return "";

  const [firstSentence] = normalized.split(/\.\s+(?=[A-Z])/);
  const summary =
    firstSentence.length > 180
      ? `${firstSentence.slice(0, 177)}...`
      : firstSentence;
  return summary.endsWith(".") ? summary : `${summary}.`;
}

function plainAscii(value: string) {
  return value
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/[^\x20-\x7E\n]/g, "");
}

function registryDocs(
  pagePaths: Record<string, unknown>,
  registryItems: RegistryItem[],
  routePrefix: "blocks" | "components",
) {
  const documentedSlugs = new Set(Object.keys(pagePaths).map(slugFromPagePath));
  const registryLinks = registryItems
    .map((item) => ({ item, slug: slugFromRegistryName(item.name) }))
    .filter(({ slug }) => documentedSlugs.has(slug));
  const registrySlugs = new Set(registryLinks.map(({ slug }) => slug));
  const fallbackLinks = [...documentedSlugs]
    .filter((slug) => !registrySlugs.has(slug))
    .map((slug) => ({
      title: titleFromSlug(slug),
      path: `/${routePrefix}/${slug}.md`,
      description:
        COMPONENT_DESCRIPTIONS[slug] ??
        `${titleFromSlug(slug)} 的文档、用法与示例。`,
    }));
  const links = registryLinks.map(({ item, slug }) => ({
    title: titleFromSlug(slug),
    path: `/${routePrefix}/${slug}.md`,
    description:
      COMPONENT_DESCRIPTIONS[slug] ?? descriptionSummary(item.description),
  }));

  return [...links, ...fallbackLinks].toSorted((a, b) =>
    a.title.localeCompare(b.title),
  );
}

function pageDocs(
  pagePaths: Record<string, unknown>,
  routePrefix: "charts",
  descriptions: Record<string, string>,
  titles: Record<string, string>,
) {
  return Object.keys(pagePaths)
    .map(slugFromPagePath)
    .map((slug) => {
      // The charts index lives at /charts, so it keys off "charts" rather
      // than the "index" file name.
      const key = slug === "index" ? "charts" : slug;
      const title = titles[slug]
        ? bilingualName(titles[slug], key)
        : titleFromSlug(slug, key);
      return {
        title,
        path:
          slug === "index"
            ? `/${routePrefix}.md`
            : `/${routePrefix}/${slug}.md`,
        description:
          descriptions[slug] ??
          COMPONENT_DESCRIPTIONS[key] ??
          `${title} 的文档、用法与示例。`,
      };
    })
    .toSorted((a, b) => {
      if (a.path === `/${routePrefix}.md`) return -1;
      if (b.path === `/${routePrefix}.md`) return 1;
      return a.title.localeCompare(b.title);
    });
}

const components = registryDocs(
  componentDocPages,
  Object.values(componentRegistry.components),
  "components",
);

const charts = pageDocs(
  chartDocPages,
  "charts",
  chartDescriptions,
  chartTitleOverrides,
);

const blocks = registryDocs(
  blockDocPages,
  Object.values(componentRegistry.blocks),
  "blocks",
);

function formatSection(title: string, links: LlmLink[]) {
  return [
    `## ${title}`,
    "",
    ...links.map(
      (link) =>
        `- [${link.title}](${SITE_URL}${link.path}): ${link.description}`,
    ),
  ].join("\n");
}

const content = [
  "# Lark",
  "",
  "> Lark 的 React 组件库，用于构建产品界面。",
  "",
  "本文件是面向 LLM 的精选索引。它以链接形式指向 Lark 文档页的 Markdown 版本，而不是在文件内嵌完整文档。",
  "",
  formatSection("核心文档", coreDocs),
  "",
  formatSection("组件", components),
  "",
  formatSection("图表", charts),
  "",
  formatSection("区块", blocks),
  "",
].join("\n");

export const GET: APIRoute = () => {
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
