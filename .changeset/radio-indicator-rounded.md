---
"@lark-ui/core": patch
---

Round the dot in the middle of a checked radio

The indicator element carried the dot's white fill but had no border radius,
so it painted a white 6×6 square around the round dot sitting inside it. The
indicator is now `rounded-full`, matching Feishu's circular dot.
