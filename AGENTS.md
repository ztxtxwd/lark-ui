# LARK KNOWLEDGE BASE

**Generated:** 2026-03-18 | **Commit:** 38518e34 | **Branch:** rozenmd/fix-preview

## OVERVIEW

Lark's React component library (`@lark-ui/core`). pnpm monorepo: component library (Base UI + Tailwind v4), Astro docs site, Figma plugin, screenshot worker. ESM-only, Node 24+.

## STRUCTURE

```
lark/
├── packages/
│   ├── lark/                     # Component library → see packages/lark/AGENTS.md
│   ├── lark-docs-astro/          # Astro docs site → see packages/lark-docs-astro/AGENTS.md
│   ├── lark-figma/               # Figma plugin → see packages/lark-figma/AGENTS.md
│   └── lark-screenshot-worker/   # Visual regression Worker → see packages/lark-screenshot-worker/AGENTS.md
├── ci/                           # CI/CD scripts → see ci/AGENTS.md
├── lint/                         # Custom oxlint rules (5 rules in package, 4 at root)
├── .changeset/                   # Changeset files
├── .github/workflows/            # 6 workflow YAMLs (release, pullrequest, preview, etc.)
└── .vite-hooks/                  # Git hooks (Vite+): pre-commit codegen+staged, pre-push changeset validation
```

## WHERE TO LOOK

| Task                 | Location                                         | Notes                                                    |
| -------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| Component API        | `packages/lark/ai/component-registry.{json,md}`  | Source of truth. Query with `jq` or CLI                  |
| Component source     | `packages/lark/src/components/{name}/{name}.tsx` | Standard pattern                                         |
| Design spec          | `packages/lark/DESIGN-SPEC.md`                   | Control scale, focus rules, colours for every component  |
| Blocks (installable) | `packages/lark/src/blocks/`                      | NOT library exports; installed via CLI                   |
| Semantic tokens      | `packages/lark/src/styles/theme-lark.css`        | AUTO-GENERATED; edit `scripts/theme-generator/config.ts` |
| Custom lint rules    | `lint/` (4 rules) + `packages/lark/lint/` (+1)   | Package copy adds `no-deprecated-props`                  |
| Demo examples        | `packages/lark-docs-astro/src/components/demos/` | Feed into registry codegen                               |
| CI scripts           | `ci/`                                            | Reporter system, versioning, deployment                  |
| Figma generators     | `packages/lark-figma/src/generators/`            | 37 component generators                                  |

## CONVENTIONS

### Styling (CRITICAL)

- **ONLY semantic tokens**: `bg-lark-base`, `text-lark-default`, `border-lark-line`, `ring-lark-hairline`
- **NEVER raw Tailwind colors**: `bg-blue-500`, `text-gray-900` → fails lint
- **NEVER `dark:` variant**: dark mode automatic via `light-dark()` in CSS custom properties
- **Exceptions**: `bg-white`, `bg-black`, `text-white`, `text-black`, `transparent`
- **`cn()` utility**: Always compose classNames via `cn("base", conditional && "extra", className)`
- **Surface hierarchy**: `bg-lark-base` → `bg-lark-elevated` → `bg-lark-recessed`
- **Mode/theme**: `data-mode="light"|"dark"` + `data-theme="lark"` on parent element
- **Design spec**: control sizes, focus behaviour and colours follow
  `packages/lark/DESIGN-SPEC.md`

### Portal stacking (CRITICAL)

- Lark floating components portal to a shared out-of-flow host element
  (`[data-lark-portal-host]`) that `getPortalHost()` pins to the document origin
  in `<body>` — not directly into `<body>`. Keep it out of flow but full-width:
  an in-flow portal container at the end of the document makes Base UI's
  absolutely positioned popups grow the document scroll height on their first
  frame (a scrollbar flashes in, the viewport narrows, right-aligned controls
  shift and hover-opened popups close themselves), while a zero-width container
  becomes the popups' containing block and squeezes auto-width content to
  min-content (a Chinese tooltip renders one character per line). Consumers
  should create an app-root stacking context with `isolation: isolate`
  (Tailwind: `className="isolate"`).
- Do **not** fix a popup that appears below consumer content by adding `z-index`
  to Lark popup components, targeting Base UI internal data attributes, or
  applying `isolation` to `<body>`.

### Components

- **Scaffold new**: `pnpm --filter @lark-ui/core new:component` (never create manually)
- **Registry first**: Always check `component-registry.json` before using/modifying a component
- See `packages/lark/AGENTS.md` for component conventions (variants, forwardRef, displayName)

### Imports

- **No cross-package relative imports**: Use `@lark-ui/core` not `../../lark/src/...` (lint-enforced)
- **ESM-only**: `"type": "module"` throughout. No CJS.

### Changesets

- **Enforced for `packages/lark/`**: Pre-push hook requires changeset for npm-published library
- **Optional for `lark-docs-astro`**: Version appears in `/api/version` endpoint (debugging) but nothing depends on it
- **Not needed for `lark-figma`**: Figma plugin, not published to npm
- **Pre-push hook**: `.vite-hooks/pre-push` validates before push. Bypass: `git push --no-verify` (or `VITE_GIT_HOOKS=0`)
- **Prefix the summary with the short commit hash** (`- 58a1626: Tabs: …`). `changesets version` copies the summary into `packages/lark/CHANGELOG.md` verbatim, and `/changelog` renders that hash as a link to the commit. A summary without it still ships, but loses the link.

### Releasing

Agents may run the release commands — versioning and publishing are part of the
normal workflow, not something to hand off.

| Command                               | What it does                                               |
| ------------------------------------- | ---------------------------------------------------------- |
| `pnpm version`                        | Apply changesets: bump versions, rewrite CHANGELOGs        |
| `pnpm release:npm`                    | Publish to npm (this is what CI runs)                      |
| `NPM_TAG=beta pnpm release:npm`       | Publish on the `beta` dist-tag                             |
| `ci/versioning/release-production.sh` | Manual production release: branch, tag, publish, open a PR |

Publishing goes through the **npm CLI**, not `changeset publish`: the npm CLI
is the only client that implements npm's trusted publishing (OIDC). With a
Trusted Publisher configured on npmjs.com for the package (GitHub Actions →
this repo → `release.yml`), CI publishes with the job's OIDC token and needs
no `NPM_TOKEN` secret. `pnpm release` still exists, but it shells out to pnpm,
which cannot do the OIDC exchange.

### Pull Request Descriptions

PR descriptions are validated by CI. Include this checklist at the end of your PR body:

```markdown
- Reviews
- [ ] bonk has reviewed the change
- [x] automated review not possible because: <your reason here>
- Tests
- [ ] Tests included/updated
- [ ] Automated tests not possible - manual testing has been completed as follows: <description>
- [x] Additional testing not necessary because: <your reason here>
```

Rules:

- Check ONE option in each section (Reviews and Tests)
- If providing a justification (`because:` or `as follows:`), text must follow on the same line
- Indentation is flexible — nested under headers is fine
- Skip validation entirely with the `skip-pr-description-validation` label

## ANTI-PATTERNS

| Pattern                        | Why                                                          | Instead                                     |
| ------------------------------ | ------------------------------------------------------------ | ------------------------------------------- |
| `bg-blue-500`, `text-gray-*`   | Breaks theming, fails lint                                   | `bg-lark-brand`, `text-lark-default`        |
| `dark:bg-black`                | Redundant; tokens auto-adapt                                 | Remove `dark:` prefix                       |
| Missing `displayName`          | Breaks React DevTools                                        | Set `.displayName` on forwardRef components |
| Manual component file creation | Misses vite/package.json/index updates                       | Use scaffolding tool                        |
| Editing auto-generated files   | `theme-lark.css`, `ai/schemas.ts`, `ai/component-registry.*` | Edit source configs, run codegen            |

## COMMANDS

```bash
# Cross-cutting
pnpm dev                                          # Docs dev server (localhost:4321)
pnpm lint                                         # oxlint + custom rules
pnpm typecheck                                    # TypeScript check all packages
pnpm changeset                                    # Create changeset (required for lark changes)

# Package-specific (see child AGENTS.md for full lists)
pnpm --filter @lark-ui/core build              # Build library
pnpm --filter @lark-ui/core test               # Vitest
pnpm --filter @lark-ui/core codegen:registry   # Regenerate component-registry
pnpm --filter @lark-ui/figma build        # Build Figma plugin
```

## BUILD PIPELINE

```
lark-docs-astro demos → dist/demo-metadata.json
                              ↓
lark codegen:registry → ai/component-registry.{json,md} + ai/schemas.ts
                              ↓
lark-figma build:data → generated/*.json → vp pack (tsdown) → code.js (IIFE, ES2017)
```

Cross-package dependency: registry codegen requires docs demo metadata. Run `codegen:demos` in docs before `codegen:registry` in lark.

## TOOLCHAIN

| Tool       | Version       | Notes                                                      |
| ---------- | ------------- | ---------------------------------------------------------- |
| Node       | ^24.12.0      | Engine constraint (`.node-version`)                        |
| pnpm       | ^12.3.4       | Workspace manager                                          |
| Vite+      | 0.3.1         | Unified toolchain (`vp` CLI): build, test, lint, fmt       |
| TypeScript | 5.9.2         | Via pnpm catalog                                           |
| Vite       | 8.x           | Bundled via vite-plus; library mode (lark), docs server    |
| Tailwind   | 4.1.17        | v4 with `light-dark()` tokens                              |
| Oxlint     | bundled       | Via `vp lint`; config in vite.config.ts + custom JS rules  |
| Oxfmt      | bundled       | Via `vp fmt`; replaced Prettier                            |
| Vitest     | bundled       | Via `vp test`; happy-dom env, v8 coverage                  |
| Changesets | latest        | Version management                                         |
| Astro      | 7.x           | Docs framework                                             |
| cf         | 1.0.0-beta.26 | Cloudflare CLI (`cf deploy`, `cf dev`, `cf workers types`) |
| Wrangler   | 4.156.0       | Bundler behind `cf` (`cf-wrangler` delegate)               |

Lint/format/test config lives in `vite.config.ts` (root and per-package) — there
are no `.oxlintrc.json` / `.prettierrc` files. `vp check` runs format + lint.
The [global Vite+ CLI](https://viteplus.dev/) is optional but recommended for contributors: the binary ships with the local `vite-plus` dependency (`pnpm vp …`), and hooks resolve it from `node_modules/.bin`.

## SECURITY

- **NEVER commit** Figma tokens, npm tokens, or API keys
- `.env` files are gitignored
- `cloudflare.config.ts` contains Cloudflare account IDs (not secret but don't expose)

## NOTES

- `ai/component-registry.json`, `ai/component-registry.md` are auto-generated at build time and gitignored (shipped in npm package). `ai/schemas.ts` is a stub for fresh clones (full version generated during build)
- `src/primitives/` (40 files) are auto-generated Base UI re-exports
- Blocks in `src/blocks/` are NOT exported from package index; installed via CLI `lark-ui add`
- `src/catalog/` is a runtime JSON-UI rendering module (separate concern from component library)
- Single linter: Oxlint via `vp lint` (custom lark JS rules + native jsx-a11y rules; type-aware + type-checked)
- `PLOP_INJECT_EXPORT` and `PLOP_INJECT_COMPONENT_ENTRY` markers in source for scaffolding
- GitHub Actions workflows live in `.github/workflows/`, including release, PR validation, previews, Bonk, and automatic PR reviews
