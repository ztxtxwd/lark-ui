---
"@lark-ui/core": patch
---

Make the Cloudflare account configurable, and publish through the npm CLI

The account ID in `cloudflare.config.ts` was inherited from the upstream
project and pointed at someone else's Cloudflare account. It now reads
`CLOUDFLARE_ACCOUNT_ID` from the environment, falling back to the previous
value.

The release flow has moved to the npm CLI (`pnpm release:npm`). The npm CLI is
the only client that implements npm's trusted publishing (OIDC), so CI can
publish with the job's OIDC token once a Trusted Publisher is configured on
npmjs.com for the package — no long-lived `NPM_TOKEN` secret.
