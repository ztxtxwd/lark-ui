# LarkUI — authoring guide

This repository rebuilds the Feishu Universe Design (UD) component set for React 19.
Every component is evidence-driven: official design docs first, extracted Feishu client CSS second.

## Ground truth

- Official design specification docs live in the larkit truth engine. Read a page with:
  `larkit doc read /tools-and-resources/design-specification/<category>/<component> --limit=300`
- The extracted Feishu 7.72 client is at `/root/code/lark-kumo/.feishu-extracted`.
  Search its UD CSS for exact pixel values, for example:
  `grep -rhoE '[^{}]*\.ud__switch[^{}]*\{[^{}]*\}' .feishu-extracted/asar/messenger/*/*.css | sort -u`
- Design tokens are in `packages/tokens/src/tokens.css`, derived from the client's `theme.css`.
  Never invent a colour, radius or size when a token or client rule exists.

## Component layout

```
src/components/<Name>/
├── index.ts
├── <Name>.tsx
├── <Name>.test.tsx
└── <Name>.stories.tsx
```

Each component folder is self-contained. Do not edit another component's folder.
Only the maintainer edits `src/index.ts`, `src/lib/cn.ts`, `src/icons/index.tsx`, package files and configs.

## Implementation rules

- Behaviour comes from `@ui-sdk/react` (import from the component entry, never the package root).
- Never add `role="..."` to a `div` when ui-sdk already ships the behaviour.
- Use `cva` for variant maps, `cn()` for final class composition.
- Use Tailwind v4 utility classes backed by `--lark-*` tokens. Use `data-[...]` variants for state
  (`data-[checked]:bg-lark-primary`, `data-[disabled]:text-lark-disabled`).
- Do not use inline styles for state. `style` is only for dimensions passed by a consumer.
- Every control needs an accessible name. Label parts with ui-sdk Field parts or `aria-label`.
- Keep interactions faithful to UD: 100ms colour transitions, no invented shadows or gradients.
- `cn()` is configured with the Lark colour scale. If a new `text-*` / `bg-*` / `border-*` token is
  introduced, add its name to `src/lib/cn.ts` or tailwind-merge will drop it.
- Dark mode uses `.dark` / `[data-theme="dark"]`; only use tokens, never raw hex values.

## Stories

- Title: `Components/<Name>`, `tags: ["autodocs"]`.
- Cover the documented variants, all sizes, and interactive states.
- Global a11y runs at `error`; icon-only controls must have `aria-label`.
- Add one story per UD variant and one "AllVariants" or "Sizes" matrix where useful.

## Tests

Vitest Browser Mode (Chromium, real CSS). Test behaviour a user can observe:

- keyboard and pointer interaction
- accessible role/name and ARIA state
- disabled / readOnly / loading paths
- one test per documented state where practical

Run:

```bash
cd /root/code/lark-kumo/larkui
pnpm --filter @larkui/core typecheck
pnpm --filter @larkui/core exec vitest run src/components/<Name>
pnpm --filter @larkui/core build
```

Never run `storybook build` concurrently with another agent.

## Verification and contrast

- Every component gets a browser test file; UI-only tests are not enough.
- The permanent `src/test/a11y.test.tsx` runs axe's color-contrast rule. Add new
  components there when their text sits on tinted surfaces.
- For secondary text use `text-lark-caption` (#646A73, 5.45:1 on white), not
  `text-lark-placeholder` (#8F959E, 3.02:1). Native input placeholders keep the
  UD token; rendered placeholder _text_ uses caption.
- Filled danger buttons use `bg-lark-danger-strong`; white on #F54A45 fails WCAG.
- Tag tones use `--lark-tag-text-*`; Badge statuses use the stronger fills in
  `Badge.tsx`. Do not swap them back to the decorative content tokens.
- The dark theme inverts the neutral scale; use semantic `bg-lark-*` tokens
  when a surface should stay dark.

When adding a new `@ui-sdk/react/<entry>` import, also add it to the
`optimizeDeps.include` list in `packages/core/vitest.config.ts`; otherwise the
first cold test run reloads Vite and reports zero tests.

## Source-of-truth notes

- Button sizes: 24 / 28 / 32 / 40 / 48 with 12/20, 12/20, 14/22, 16/24, 18/26 type.
- Input sizes: 28 / 32 / 40 with 12/20, 14/22, 16/24 type and 6px radius.
- Checkbox and Radio: 16 × 16, gap 8 to label, 14px label, row hit area ≥ 22px.
- Switch: md 40 × 22 with 18px thumb, sm 28 × 16 with 12px thumb, 2px inset.
