import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    jsPlugins: [
      "../../lint/lark-plugin.js",
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
    plugins: ["eslint", "typescript", "unicorn", "oxc", "jsx-a11y"],
    categories: {
      correctness: "error",
      suspicious: "warn",
    },
    rules: {
      "lark/no-tailwind-dark-variant": "error",
      "lark/no-primitive-colors": "error",
      "lark/no-cross-package-imports": "error",
      "lark/no-flow-node-custom-render": "error",
      "typescript/no-unsafe-type-assertion": "off",
      "typescript/no-unnecessary-template-expression": "off",
      "typescript/no-unnecessary-type-assertion": "off",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
