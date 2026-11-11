/**
 * Parser for `packages/lark/CHANGELOG.md`, used by the /changelog pages.
 *
 * Changesets writes the changeset summary verbatim, so the summary is expected
 * to start with the short commit hash (`- 58a1626: Tabs: ...`). The hash is
 * rendered as a link to the commit, which is why the changelog page needs it.
 */

export type ChangelogBump = "major" | "minor" | "patch";

export interface ParsedEntry {
  /** Short commit hash, or `null` when the changeset had no hash prefix. */
  hash: string | null;
  text: string;
}

export interface ParsedSection {
  type: ChangelogBump;
  entries: ParsedEntry[];
}

export interface ParsedVersion {
  version: string;
  bump: ChangelogBump;
  sections: ParsedSection[];
}

/** A version with both minor and patch sections is a "minor" release. */
const BUMP_PRIORITY: ChangelogBump[] = ["major", "minor", "patch"];

const VERSION_RE = /^## (\d+\.\d+\.\d+)/;
const SECTION_RE = /^### (Major|Minor|Patch) Changes/;

// `- <hash>: <summary>`. The hash is optional on purpose: a summary written
// without it used to be skipped, and a version whose entries were all skipped
// disappeared from the docs changelog even though it had shipped. Entries
// without a hash now render without the commit link instead.
const ENTRY_RE = /^- (?:([0-9a-f]{7,40}): )?(.+)/;

export function parseChangelog(raw: string): ParsedVersion[] {
  const versions: ParsedVersion[] = [];

  let currentVersion: { version: string; sections: ParsedSection[] } | null =
    null;
  let currentSection: ParsedSection | null = null;
  let currentEntry = false;
  let currentHash: string | null = null;
  let currentLines: string[] = [];

  function flushEntry() {
    if (currentSection && currentEntry && currentLines.length > 0) {
      currentSection.entries.push({
        hash: currentHash,
        text: currentLines.join("\n").trimEnd(),
      });
    }
    currentEntry = false;
    currentHash = null;
    currentLines = [];
  }

  function flushSection() {
    flushEntry();
    if (currentVersion && currentSection?.entries.length) {
      currentVersion.sections.push(currentSection);
    }
    currentSection = null;
  }

  function flushVersion() {
    flushSection();
    if (currentVersion?.sections.length) {
      const types = new Set(currentVersion.sections.map((s) => s.type));
      const bump = BUMP_PRIORITY.find((b) => types.has(b)) ?? "patch";
      versions.push({ ...currentVersion, bump });
    }
    currentVersion = null;
  }

  for (const line of raw.split("\n")) {
    const versionMatch = line.match(VERSION_RE);
    if (versionMatch) {
      flushVersion();
      currentVersion = { version: versionMatch[1], sections: [] };
      continue;
    }

    const sectionMatch = line.match(SECTION_RE);
    if (sectionMatch && currentVersion) {
      flushSection();
      currentSection = {
        type: sectionMatch[1].toLowerCase() as ChangelogBump,
        entries: [],
      };
      continue;
    }

    const entryMatch = line.match(ENTRY_RE);
    if (entryMatch && currentSection) {
      flushEntry();
      currentEntry = true;
      currentHash = entryMatch[1] ?? null;
      currentLines.push(entryMatch[2]);
      continue;
    }

    // Continuation lines belong to the current entry (code blocks, lists, ...).
    if (currentEntry && currentSection) {
      currentLines.push(line);
    }
  }

  flushVersion();

  return versions;
}
