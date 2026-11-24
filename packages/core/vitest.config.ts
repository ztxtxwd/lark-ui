import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      "@ui-sdk/react/button",
      "@ui-sdk/react/checkbox",
      "@ui-sdk/react/input",
      "@ui-sdk/react/radio",
      "@ui-sdk/react/switch",
      "@ui-sdk/react/tabs",
      "@ui-sdk/react/toggle",
      "@ui-sdk/react/tooltip",
      "@ui-sdk/react/dialog",
      "@ui-sdk/react/select",
      "@ui-sdk/react/progress",
      "@ui-sdk/react/accordion",
      "@ui-sdk/react/rating",
      "@ui-sdk/react/slider",
      "@ui-sdk/react/number-input",
      "@ui-sdk/react/popover",
      "@ui-sdk/react/timeline",
      "@ui-sdk/react/toast",
      "@ui-sdk/react/field",
      "@ui-sdk/react/date-picker",
      "@ui-sdk/react/calendar",
      "@ui-sdk/react/date-input",
      "@ui-sdk/react/time-input",
      "@ui-sdk/react/tree",
      "@ui-sdk/react/text-match",
      "@ui-sdk/react/file-input",
      "@ui-sdk/react/color-picker",
      "@ui-sdk/react/color",
      "@ui-sdk/react/drawer",
      "@ui-sdk/react/menu",
      "@ui-sdk/react/navigation-menu",
      "@ui-sdk/react/scroll-area",
      "@ui-sdk/react/date",
      "@ui-sdk/react/pagination",
      "axe-core",
    ],
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
