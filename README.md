# Lark UI

A component library for building modern web applications, in the Universe
Design style.

Lark UI provides accessible, design-system-compliant components built on [Base UI](https://base-ui.com/) and Tailwind CSS v4. Tokens follow the Universe Design palette and are exposed as semantic `lark-*` utilities with automatic `light-dark()` theming. It handles keyboard navigation, focus management, and ARIA attributes so you can build accessible applications without thinking through every detail.

> **A fork of Cloudflare's [Kumo](https://github.com/cloudflare/kumo).** Lark UI
> started as Kumo and keeps its MIT licence and its full commit history. See
> [NOTICE](./NOTICE) for the details.

## Installation

```bash
pnpm add @lark-ui/core
```

### Peer Dependencies

```bash
pnpm add react react-dom @phosphor-icons/react
```

Icons are inlined SVG from [Phosphor Icons](https://phosphoricons.com) (MIT),
so there is no font to download. Import `LarkIcon` and any of the supported
names from `@lark-ui/core`.

```tsx
import { LarkIcon } from "@lark-ui/core";

<LarkIcon name="check" />;
```

## Usage

```tsx
import { Button, Input, Dialog } from "@lark-ui/core";
import "@lark-ui/core/styles";
```

### Granular Imports (Tree-Shaking)

```tsx
import { Button } from "@lark-ui/core/components/button";
```

### Base UI Primitives

Lark re-exports all Base UI primitives for advanced use cases:

```tsx
import { Popover } from "@lark-ui/core/primitives/popover";
```

## CLI

Query component documentation from the command line:

```bash
npx @lark-ui/core ls          # List all components
npx @lark-ui/core doc Button  # Get component docs
npx @lark-ui/core docs        # Get all docs
```

## Development

See [AGENTS.md](./AGENTS.md) for comprehensive development documentation including:

- Component patterns and styling system
- Semantic color tokens
- Development workflows
- CI/CD pipeline
- Figma plugin

### Quick Start

```bash
pnpm install
pnpm dev                    # Start docs site at localhost:4321
pnpm --filter @lark-ui/core test
```

### Figma Plugin

```bash
# Optional: enable token sync during build
# cp packages/lark-figma/scripts/.env.example packages/lark-figma/scripts/.env
# $EDITOR packages/lark-figma/scripts/.env  # set FIGMA_TOKEN (and optionally FIGMA_FILE_KEY)

pnpm --filter @lark-ui/figma build
# In Figma: Plugins > Development > Import plugin from manifest...
# Select: packages/lark-figma/src/manifest.json
```

### Creating Components

```bash
pnpm --filter @lark-ui/core new-component
```

## Documentation

- **Live Docs**: [lark-ui.tapeless.eu.org](https://lark-ui.tapeless.eu.org)
- **AI/Agent Guide**: [AGENTS.md](./AGENTS.md)

## Trademarks

"Lark" and "Feishu" are trademarks of their respective owners. The Lark
logomark and the Lark brand palette in this repository are used under the terms
agreed with the trademark owner.

This project is a fork of Kumo and is not affiliated with, sponsored by, or
endorsed by Cloudflare, Inc.

## License

MIT — see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
