import { defineConfig, triggers } from "cf/config";

/**
 * Deployments select an environment with `--mode`:
 *   cf deploy --mode staging
 */
export default defineConfig((ctx) => {
  const isStaging = ctx.mode === "staging";

  return {
    accountId: "61e3887ff0554f81e1e175d106c3926f",
    worker: {
      name: "lark-storybook",
      compatibilityDate: "2025-12-30",
      previewUrls: true,
      observability: {
        enabled: true,
      },
      triggers: [
        triggers.fetch({
          pattern: isStaging
            ? "storybook.staging.lark-ui.com/*"
            : "storybook.lark-ui.com/*",
          zone: "lark-ui.com",
        }),
      ],
    },
  };
});
