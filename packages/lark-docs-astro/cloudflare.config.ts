import { defineConfig, triggers } from "cf/config";

/**
 * Deployments select an environment with `--mode`:
 *   cf deploy --mode staging
 * `previewUrls` keeps the `<version>-<worker>.workers.dev` preview URLs that
 * the PR preview flow relies on.
 */
export default defineConfig((ctx) => {
  const isStaging = ctx.mode === "staging";

  return {
    accountId: "61e3887ff0554f81e1e175d106c3926f",
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
          pattern: isStaging ? "staging.lark-ui.com/*" : "lark-ui.com/*",
          zone: "lark-ui.com",
        }),
      ],
    },
  };
});
