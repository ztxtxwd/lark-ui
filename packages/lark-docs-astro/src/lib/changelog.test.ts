import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";
import { parseChangelog } from "./changelog";

const sample = `# @lark-ui/core

## 3.1.0

### Minor Changes

- 58a1626: Tabs: segmented tracks hug their labels.

### Patch Changes

- e8b013b: Anchor overlays to a portal host.

## 3.0.3

### Patch Changes

- ec4a350: ClipboardText: match the icon button width.
  Continuation line with a nested list:
  - nested item

## 3.0.2

### Patch Changes

- No hash on this one.
`;

describe("parseChangelog", () => {
  it("parses versions, sections and entries", () => {
    const versions = parseChangelog(sample);

    expect(versions.map((v) => v.version)).toEqual(["3.1.0", "3.0.3", "3.0.2"]);
    expect(versions[0].bump).toBe("minor");
    expect(versions[0].sections).toHaveLength(2);
    expect(versions[0].sections[1].entries).toEqual([
      { hash: "e8b013b", text: "Anchor overlays to a portal host." },
    ]);
  });

  it("keeps continuation lines inside the entry", () => {
    const entries = parseChangelog(sample)[1].sections[0].entries;

    expect(entries).toHaveLength(1);
    expect(entries[0].text).toBe(
      "ClipboardText: match the icon button width.\n" +
        "  Continuation line with a nested list:\n" +
        "  - nested item",
    );
  });

  // Regression: a changeset whose summary has no `- <hash>: ` prefix used to be
  // skipped, and a version with no parsed entries disappeared from the docs
  // changelog entirely — 3.1.0 shipped that way.
  it("keeps entries that have no commit hash", () => {
    const version = parseChangelog(sample)[2];

    expect(version.sections[0].entries).toEqual([
      { hash: null, text: "No hash on this one." },
    ]);
  });

  it("reads every released version from the package changelog", () => {
    const raw = readFileSync(
      join(import.meta.dirname, "../../../lark/CHANGELOG.md"),
      "utf-8",
    );
    const versions = parseChangelog(raw);

    expect(versions[0].version).toBe("3.1.0");
    expect(versions[0].sections.flatMap((s) => s.entries)).toHaveLength(2);
    expect(versions.every((v) => v.sections.length > 0)).toBe(true);
  });
});
