# LARK DOCS KNOWLEDGE BASE

**Generated:** 2026-09-03 | **Commit:** 9b4eb70 | **Branch:** rozenmd/test-preview

## OVERVIEW

Astro documentation site for `@lark-ui/core`. Static output uses React islands,
MDX reference pages, Tailwind v4, and Cloudflare Workers static assets.

**Parent:** See [root AGENTS.md](../../AGENTS.md) for monorepo-wide rules.

## STRUCTURE

```text
lark-docs-astro/
├── src/
│   ├── components/
│   │   ├── demos/       # Executable examples; registry codegen input
│   │   ├── docs/        # MDX/Astro documentation building blocks
│   │   ├── lark/        # CLI-installed blocks owned by this site
│   │   └── skill/       # Interactive design-skill content
│   ├── layouts/         # Base shell, navigation, and document layouts
│   ├── lib/             # Vite plugins, Markdown conversion, registry access
│   ├── pages/           # File-based routes and API/static text endpoints
│   └── styles/global.css
├── scripts/             # Demo metadata and design-skill generators
├── astro.config.mjs     # Astro, MDX, React, Tailwind, and custom plugins
├── vite.config.ts       # Type-aware lint rules
├── cloudflare.config.ts # Worker config: routes, environments, assets
└── wrangler.config.ts   # Bundler config: static assets directory
```

## WHERE TO LOOK

| Task                    | Location                               | Notes                                           |
| ----------------------- | -------------------------------------- | ----------------------------------------------- |
| Component reference     | `src/pages/components/`                | MDX joins demos, props, and VR metadata         |
| Demo behavior           | `src/components/demos/`                | Also feeds registry metadata                    |
| Page chrome             | `src/layouts/`                         | `BaseLayout` -> `MainLayout` -> document layout |
| Navigation              | `src/components/SidebarNav.tsx`        | Route lists are manual                          |
| Docs building blocks    | `src/components/docs/`                 | Examples, props, code, headings, TOC            |
| Registry data           | `src/lib/component-registry.ts`        | Server-side access                              |
| Client registry         | `src/lib/vite-plugin-lark-registry.ts` | Provides `virtual:lark-registry`                |
| Development HMR         | `src/lib/vite-plugin-lark-hmr.ts`      | Rewrites Lark imports to source                 |
| Demo extraction         | `scripts/extract-demo-examples.ts`     | Writes `dist/demo-metadata.json`                |
| Design skill generation | `scripts/generate-design-skill.mjs`    | Writes `public/skill.md`                        |
| Worker deployment       | `cloudflare.config.ts`                 | `dist` assets; production and staging routes    |

## DATA FLOW

```text
src/components/demos/*Demo.tsx
  -> codegen:demos
  -> dist/demo-metadata.json
  -> Lark component-registry codegen

src/components/skill/*
  -> generate-design-skill
  -> public/skill.md
```

`vp run build:docs` builds `@lark-ui/core` first. Production Astro builds use
the package output, while development aliases Lark imports to source for HMR.

## CONVENTIONS

- Use `~/*` for package-local imports; it maps to `src/*`.
- Standard component pages use `MdxDocLayout`, then present the primary demo,
  installation, usage, examples, and registry-backed props.
- Give visual-regression examples stable `vrSection` slugs and `vrTitle` values.
- Use semantic Lark tokens only. Raw Tailwind colors and `dark:` variants fail lint.
- Compose Lark component classes with established package patterns; do not bypass
  `lark/no-cross-package-imports`.
- Server-side Astro code imports `~/lib/component-registry.ts`. React islands use
  `virtual:lark-registry`.
- Choose hydration by behavior: `client:visible` for ordinary demos,
  `client:load` for immediately interactive UI, and `client:only="react"` only for
  known SSR mismatches.
- Keep `@lark-ui/core/styles` before Tailwind imports. Keep the Lark `@source`
  directive so Tailwind discovers package classes.
- View transitions persist parts of the page shell. Browser state that follows
  navigation must listen for Astro lifecycle events.

### Localization (Simplified Chinese)

The site's human-readable copy is Simplified Chinese. When editing it:

- Translate prose, headings, frontmatter `title`/`description`, button labels,
  and `aria-label`/`title` attributes.
- Keep code identifiers in English: component, prop and type names, import
  paths, CLI commands, file paths, and enum values (`variant="primary"`).
- Component page titles are bilingual (`Button 按钮`); guide page titles are
  Chinese-only (`安装`). `src/lib/component-names.ts` holds the shared
  slug-to-Chinese-name map used by the sidebar and the search dialog.
- Never change `demo`, `vrSection`, or `vrTitle` values — visual regression
  matches screenshots by them.
- Never add `{#custom-id}` to MDX headings; the MDX pipeline does not support
  that syntax. Heading IDs come from Astro's `rehypeHeadingIds`, which handles
  CJK text.
- Prop descriptions come from the component registry in `packages/lark` and
  ship in English. `src/lib/prop-descriptions.ts` overlays Chinese copy for
  every prop rendered by `<PropsTable>`; `src/lib/prop-descriptions.test.ts`
  fails when a prop is missing a translation, so add an entry when the library
  gains a prop.

## ANTI-PATTERNS

- Do not edit `dist/`, `.astro/`, or `public/skill.md`; builds regenerate them.
- Do not put `AGENTS.md` or other non-route Markdown under `src/pages/`. Astro
  treats Markdown there as a route and emits unwanted build output.
- Do not treat blocks in `src/components/lark/` as package exports. They are
  installed source owned by the docs site.
- Do not add a route without updating the applicable list in `SidebarNav.tsx`.
- Do not import the server registry module into hydrated React components.
- Do not assume `astro preview` models Cloudflare routing; deployment serves
  `dist` through the static-assets Worker configuration.

## COMMANDS

```bash
pnpm --filter @lark-ui/docs-astro dev
pnpm --filter @lark-ui/docs-astro build
pnpm --filter @lark-ui/docs-astro test
pnpm --filter @lark-ui/docs-astro typecheck
pnpm --filter @lark-ui/docs-astro lint
pnpm vp run build:docs
```

## NOTES

- `dist/demo-metadata.json` is a build intermediate but is also consumed across
  packages. Missing it produces incomplete component registry data.
- Build metadata in `astro.config.mjs` reads both package versions and Git state,
  then injects constants used by the site shell and version endpoint.
- Deployments run through the `cf` CLI. `pnpm run build:cf` packages `dist/`
  into a Build Output Specification (`.cloudflare/output/`), and `cf deploy
--prebuilt` uploads it. The staging environment is selected with `--mode
staging` (see `cloudflare.config.ts`).
- Docs-only changes do not normally require a changeset.
