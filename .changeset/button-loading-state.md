---
"@lark-ui/core": patch
---

Button: keep the loading state inside the variant's own colour family instead of painting it like a disabled button.

Feishu treats loading and disabled as two different states. `loading` renders `disabled` on the `<button>`, so it inherited the disabled styling and a loading primary button was the same grey solid as a disabled one.

- Filled buttons (`primary`, `destructive`) keep the brand (or danger) hue and only step the fill back one ramp, with the label and spinner white — Feishu's `--primary-fill-loading` / `--function-danger-fill-loading`.
- Bordered and text buttons (`secondary`, `outline`, `ghost`) keep their surface and border, and mute the label to `--udtoken-component-text-disabled-loading` (N500). `secondary-destructive` mutes to the danger loading tint and tints its border to match.
- The grey fill is reserved for `disabled`, and a loading button uses Feishu's `cursor: default` instead of `not-allowed`.

New theme tokens: `lark-brand-loading` (`#94b4ff` / `#2655b6`) and `lark-danger-loading` (`#f89e9b` / `#a03331`).

Also drops the `!important` from `secondary`'s `text-lark-default` and `secondary-destructive`'s `text-lark-danger`. It was beating every `disabled:text-*` utility, so disabled labels on those two variants never muted.
