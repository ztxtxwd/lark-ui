import { describe, it, expect } from "vite-plus/test";
import { discoverComponents, getComponentsWithExports } from "./test-utils";

// Importing a component pulls in its whole dependency graph (react-day-picker,
// ECharts, Base UI…). Under load that easily outruns Vitest's 5s default, and
// these are smoke tests, so give them room.
const IMPORT_TIMEOUT = 20_000;

describe("Deep Import Patterns", () => {
  const allComponents = discoverComponents();
  const componentsWithExports = getComponentsWithExports();

  describe("Components with configured exports", () => {
    componentsWithExports.forEach((componentName: string) => {
      it(
        `should import from @lark-ui/core/components/${componentName}`,
        async () => {
          const module = await import(
            `../../src/components/${componentName}/index.ts`
          );
          expect(module).toBeDefined();
          expect(Object.keys(module).length).toBeGreaterThan(0);
        },
        IMPORT_TIMEOUT,
      );
    });
  });

  describe("All components should have configured exports", () => {
    const componentsWithoutExports = allComponents.filter(
      (name) => !componentsWithExports.includes(name),
    );

    it("should have all components configured in package.json exports", () => {
      if (componentsWithoutExports.length > 0) {
        console.warn("\n⚠️  Components missing from package.json exports:");
        componentsWithoutExports.forEach((name: string) => {
          console.warn(`   - ${name}`);
        });
      } else {
        console.log("\n✅ All components have configured exports!");
      }

      // All components should have exports configured
      expect(componentsWithoutExports.length).toBe(0);
      expect(componentsWithoutExports).toEqual([]);
    });
  });

  describe("All components should have index.ts", () => {
    allComponents.forEach((componentName: string) => {
      it(
        `${componentName} should have an index.ts file`,
        async () => {
          const module = await import(
            `../../src/components/${componentName}/index.ts`
          );
          expect(module).toBeDefined();
        },
        IMPORT_TIMEOUT,
      );
    });
  });
});
