import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { requiresLarkChangeset } from "./validate-lark-changeset";

describe("requiresLarkChangeset", () => {
  it("ignores a package README-only change", () => {
    assert.equal(requiresLarkChangeset(["packages/lark/README.md"]), false);
  });

  it("requires a changeset for package source changes", () => {
    assert.equal(
      requiresLarkChangeset([
        "packages/lark/README.md",
        "packages/lark/src/index.ts",
      ]),
      true,
    );
  });
});
