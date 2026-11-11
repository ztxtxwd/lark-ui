---
"@lark-ui/core": patch
---

Give the shared portal host the viewport width instead of a zero width. The host is the containing block for Base UI's absolutely positioned positioners, so a zero-width host made every auto-width popup shrink to min-content — a Chinese `Tooltip` was rendered one character per line. The host stays out of flow (`position: absolute`, `height: 0`) at the document origin, so it still adds no scroll height and still keeps the first computed position final.
