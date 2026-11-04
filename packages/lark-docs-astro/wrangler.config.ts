import { defineWranglerConfig } from "wrangler/experimental-config";

/**
 * Tooling-side config for the Wrangler bundler that `cf` drives. Runtime
 * asset settings live in `cloudflare.config.ts` under `worker.assets`.
 */
export default defineWranglerConfig(() => ({
  assetsDirectory: "./dist",
}));
