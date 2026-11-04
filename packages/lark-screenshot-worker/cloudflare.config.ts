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
    },
  },
});
