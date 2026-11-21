---
"@lark-ui/core": major
---

Toast: adopt the Feishu client's outlined toast design. The white notification card with a leading colour bar is gone. A toast is now a floating status notice anchored at the top centre of the viewport: a pale status tint with a 1px border in the status colour, an 8px radius, `shadow-lark-popover` (Feishu's `--shadow-s4-down`), 20px by 16px padding, a 16px filled status icon and a semibold 14px/22px title. Multiple toasts stack downwards in a full column, 16px apart, and slide in from above.

Banner: remove the `theme` prop and the outlined surface. Banner is the inline `ud__notice--filled` notice only — a flat status tint with no border and a 6px radius. The bordered treatment now belongs to Toast, so the two components no longer overlap.

- `Banner` no longer accepts `theme`; remove `theme="filled"` / `theme="outlined"` from callers.
- Toast status variants (`success`, `error`, `warning`, `info`) use the pale outlined tints and `lark-*-outline` borders; the `default` variant keeps the neutral elevated surface with a hairline border.
- The outlined tints moved from banner to toast naming: `lark-banner-{info,success,warning,danger}-outlined` is now `lark-toast-{info,success,warning,danger}-outlined`.
- The default toast no longer renders the internal close button or the 4px accent bar. It dismisses on its timeout or by swiping up; `Toast.Close` is still available to consumers building custom toast content.
