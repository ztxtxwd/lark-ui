import { defineConfig, triggers } from "cf/config";

/**
 * Deployments select an environment with `--mode`:
 *   cf deploy --mode staging
 * `previewUrls` keeps the `<version>-<worker>.workers.dev` preview URLs that
 * the PR preview flow relies on.
 *
 * `CLOUDFLARE_ACCOUNT_ID` picks the account to deploy into. The default is the
 * account the upstream Kumo project used — set the variable to target your
 * own account.
 */
export default defineConfig((ctx) => {
  const isStaging = ctx.mode === "staging";

  return {
    accountId:
      process.env.CLOUDFLARE_ACCOUNT_ID ?? "61e3887ff0554f81e1e175d106c3926f",
    worker: {
      name: isStaging ? "lark-docs-staging" : "lark-docs",
      compatibilityDate: "2025-04-04",
      previewUrls: true,
      assets: {
        notFoundHandling: "404-page",
      },
      observability: {
        enabled: true,
      },
      triggers: [
        triggers.fetch({
          pattern: isStaging
            ? "staging.lark-ui.tapeless.eu.org/*"
            : "lark-ui.tapeless.eu.org/*",
          zone: "tapeless.eu.org",
        }),
      ],
    },
  };
});
