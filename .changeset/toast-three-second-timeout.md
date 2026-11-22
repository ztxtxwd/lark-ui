---
"@lark-ui/core": patch
---

Toast: auto-dismiss after 3 seconds, matching the Feishu client. Feishu's toast manager uses `duration: 3e3`; Base UI's 5 second default made Lark toasts linger noticeably longer. `Toasty` now passes `LARK_TOAST_DEFAULT_TIMEOUT` (3000) to the provider, while a per-toast `timeout` option still overrides it.
