import { describe, it, expect } from "vite-plus/test";

// Test the detection logic directly by importing and testing the pattern matching
// Note: We can't easily test oxlint rules in isolation, so we test the core logic

const PACKAGE_DIRS = new Set(["lark", "lark-docs-astro", "lark-figma"]);
const CROSS_PACKAGE_PATTERN = /^((?:\.\.\/)+)([a-z0-9-]+)\//;

function getCrossPackageImport(importPath: string): string | null {
  if (!importPath || !importPath.startsWith("..")) {
    return null;
  }

  const match = importPath.match(CROSS_PACKAGE_PATTERN);
  if (!match) {
    return null;
  }

  const traversal = match[1];
  const packageDir = match[2];

  const levelsUp = (traversal.match(/\.\.\//g) || []).length;

  if (levelsUp < 2) {
    return null;
  }

  if (PACKAGE_DIRS.has(packageDir)) {
    return packageDir;
  }

  return null;
}

describe("no-cross-package-imports", () => {
  describe("should detect cross-package imports", () => {
    it("detects ../../lark/path", () => {
      expect(getCrossPackageImport("../../lark/src/button")).toBe("lark");
    });

    it("detects ../../../lark/path (deeper nesting)", () => {
      expect(getCrossPackageImport("../../../lark/src/button")).toBe("lark");
    });

    it("detects ../../lark-docs-astro/path", () => {
      expect(getCrossPackageImport("../../lark-docs-astro/src/foo")).toBe(
        "lark-docs-astro",
      );
    });

    it("detects ../../lark-figma/path", () => {
      expect(getCrossPackageImport("../../lark-figma/src/bar")).toBe(
        "lark-figma",
      );
    });
  });

  describe("should NOT detect local imports", () => {
    it("ignores ../lark/path (single level up)", () => {
      expect(getCrossPackageImport("../lark/button")).toBeNull();
    });

    it("ignores ./lark/path (same directory)", () => {
      expect(getCrossPackageImport("./lark/button")).toBeNull();
    });

    it("ignores ../components/button (not a package dir)", () => {
      expect(getCrossPackageImport("../components/button")).toBeNull();
    });

    it("ignores ../../components/button (not a package dir)", () => {
      expect(getCrossPackageImport("../../components/button")).toBeNull();
    });

    it("ignores relative paths without package names", () => {
      expect(getCrossPackageImport("../../utils/helpers")).toBeNull();
    });

    it("ignores absolute paths", () => {
      expect(getCrossPackageImport("/absolute/path")).toBeNull();
    });

    it("ignores package imports", () => {
      expect(getCrossPackageImport("@lark-ui/core")).toBeNull();
    });

    it("ignores node_modules imports", () => {
      expect(getCrossPackageImport("react")).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("handles empty string", () => {
      expect(getCrossPackageImport("")).toBeNull();
    });

    it("handles path with only traversal", () => {
      expect(getCrossPackageImport("../../")).toBeNull();
    });

    it("handles path ending at package dir (no subpath)", () => {
      // This matches but lark/ needs something after it
      expect(getCrossPackageImport("../../lark/")).toBe("lark");
    });
  });
});
