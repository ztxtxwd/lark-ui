import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "lark-screenshot-worker",
    compatibilityDate: "2025-09-01",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "src/index.ts",
    observability: {
      logs: {
        enabled: true,
      },
      traces: {
        enabled: true,
      },
    },
    env: {
      // Secret set with `cf workers secrets update --worker lark-screenshot-worker`.
      API_KEY: bindings.secret(),
      BROWSER: bindings.browser({}),
      SCREENSHOTS: bindings.r2({
        name: "lark-visual-regression",
      }),
      // The workers.dev subdomain of the account this worker runs in. Preview
      // deployments of the docs site are served from it, and the worker only
      // navigates to hosts on the allowlist.
      WORKERS_SUBDOMAIN: bindings.text("design-engineering"),
    },
  },
});
