import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  commitsMatch,
  getCfPreviewUrl,
  getWorkerPreviewUrl,
  parsePreviewCommit,
} from "./preview";

describe("preview contract", () => {
  it("derives the public URL from a Worker Builds details URL", () => {
    assert.equal(
      getWorkerPreviewUrl(
        "https://dash.cloudflare.com/account/workers/services/view/lark-docs/production/previews/feature-branch",
      ),
      "https://feature-branch-lark-docs.design-engineering.workers.dev",
    );
  });

  it("rejects details URLs for other Workers", () => {
    assert.throws(() =>
      getWorkerPreviewUrl(
        "https://dash.cloudflare.com/account/workers/services/view/other/production/previews/feature-branch",
      ),
    );
  });

  it("parses a valid docs build commit", () => {
    assert.equal(parsePreviewCommit('{"commit":"abcdef1"}'), "abcdef1");
  });

  it("matches short and full forms of the same commit", () => {
    assert.equal(commitsMatch("abcdef1234567890", "abcdef1"), true);
    assert.equal(commitsMatch("abcdef1", "1234567"), false);
  });

  it("reads the preview URL from the cf output", () => {
    assert.equal(
      getCfPreviewUrl(
        "",
        "Uploaded version: https://abcdef12-lark-docs.design-engineering.workers.dev",
      ),
      "https://abcdef12-lark-docs.design-engineering.workers.dev",
    );
  });

  it("derives the preview URL from a cf version result", () => {
    assert.equal(
      getCfPreviewUrl(
        JSON.stringify({
          result: {
            id: "abcdef12-3456-7890-abcd-ef1234567890",
            created_on: "2026-11-03T00:00:00Z",
          },
        }),
        "",
      ),
      "https://abcdef12-lark-docs.design-engineering.workers.dev",
    );
  });

  it("ignores worker ids when looking for the version id", () => {
    assert.equal(
      getCfPreviewUrl(
        JSON.stringify({
          worker_id: "11111111-2222-3333-4444-555555555555",
          result: {
            version_id: "abcdef12-3456-7890-abcd-ef1234567890",
          },
        }),
        "",
      ),
      "https://abcdef12-lark-docs.design-engineering.workers.dev",
    );
  });

  it("rejects invalid cf output", () => {
    assert.throws(() => getCfPreviewUrl("", "Upload failed"));
  });
});
