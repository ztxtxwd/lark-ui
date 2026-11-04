# Screenshot Worker (`@lark-ui/screenshot-worker`)

Cloudflare Worker that uses Puppeteer + Browser Rendering to capture screenshots of Lark docs pages. Used for visual regression testing.

**Parent:** See [root AGENTS.md](../../AGENTS.md) for monorepo context.

## STRUCTURE

```
lark-screenshot-worker/
├── src/
│   └── index.ts          # Worker entry — auth, validation, screenshot logic
├── cloudflare.config.ts  # Worker config (no secrets committed)
├── tsconfig.json         # Workers + DOM lib (DOM needed for evaluate() callbacks)
├── .dev.vars.example     # Template for local secrets
└── AGENTS.md             # This file
```

## SETUP

**Local dev:**

```bash
cp .dev.vars.example .dev.vars   # then fill in API_KEY
pnpm --filter @lark-ui/screenshot-worker dev
```

**Deploy:**

```bash
# Set secret (one-time per environment):
pnpm --filter @lark-ui/screenshot-worker exec cf workers secrets update API_KEY --type secret_text

# Deploy:
pnpm --filter @lark-ui/screenshot-worker deploy
```

## SECRETS

| Name      | How set                                                | Description                                      |
| --------- | ------------------------------------------------------ | ------------------------------------------------ |
| `API_KEY` | `cf workers secrets update API_KEY --type secret_text` | Shared secret sent as `X-API-Key` request header |

**Never commit secret values.** `.dev.vars` is gitignored at the root level.

## API

All requests require `X-API-Key: <API_KEY>` header.

### `POST /batch`

```json
{
  "baseUrl": "https://lark-ui.com",
  "pages": [
    {
      "url": "/components/button",
      "captureSections": true,
      "viewport": { "width": 1440, "height": 900 }
    }
  ]
}
```

Returns `{ results: ScreenshotResult[] }` where each result has a base64-encoded `image` or an `error` string.

**Limits:** max 50 pages per batch, max 64 KB per `css` action payload.

### Section Capture

When `captureSections: true`, the worker looks for elements with `data-vr-demo`, `data-vr-section`, and `data-vr-title` attributes in the DOM. These are set via `vrSection` and `vrTitle` props on `ComponentExample.astro` in the docs site.

## SECURITY NOTES

- **URL validation**: all Browser Rendering targets must be `https://` and match the explicit Lark docs allowlist (`lark-ui.com`, `staging.lark-ui.com`, and Lark docs preview deployments). Do not replace this with a private-IP denylist; IP notation edge cases can bypass incomplete filters.
- **Selector injection prevention**: `sectionSelector` from the request is passed as a parameter to `page.evaluate()`, never interpolated into eval strings.
- **CORS**: restricted to the same Lark docs allowlist used for navigation targets.

## COMMANDS

```bash
pnpm --filter @lark-ui/screenshot-worker dev        # Local dev server
pnpm --filter @lark-ui/screenshot-worker run deploy # Deploy to Cloudflare
pnpm --filter @lark-ui/screenshot-worker typecheck  # TypeScript check
pnpm --filter @lark-ui/screenshot-worker lint       # vp lint (Oxlint)
```

## NOTES

- `tsconfig.json` includes `"DOM"` in `lib` — required so TypeScript understands the DOM code inside `page.evaluate()` callbacks, even though the Worker host has no DOM.
- `Buffer` usage requires the `nodejs_compat` compatibility flag in `cloudflare.config.ts` (already set).
- Worker types are generated from `cloudflare.config.ts` into `.cloudflare/types/index.d.ts` (committed). Regenerate with `pnpm --filter @lark-ui/screenshot-worker cf-typegen`.
- A fresh browser page is created per URL to prevent cookie/localStorage/style bleed between pages.
- External endpoint: `lark-screenshot-worker.design-engineering.workers.dev`
