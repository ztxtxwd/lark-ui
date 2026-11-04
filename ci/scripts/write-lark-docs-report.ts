#!/usr/bin/env tsx

/**
 * Write Lark Docs Preview Report Artifact
 *
 * Outputs a report artifact for the lark-docs preview deployment.
 * Called by deploy-lark-docs-preview.sh after successful deployment.
 *
 * Required environment variables:
 * - LARK_DOCS_PREVIEW_URL: Deployed preview URL
 * - GITHUB_SHA: Commit SHA (GitHub Actions)
 */

import {
  writeReportArtifact,
  larkDocsPreviewReporter,
  buildContextFromEnv,
} from "../reporters";

async function main() {
  const context = buildContextFromEnv();

  if (!context.larkDocsPreviewUrl) {
    console.error("❌ LARK_DOCS_PREVIEW_URL environment variable is required");
    process.exit(1);
  }

  const item = await larkDocsPreviewReporter.collect(context);

  if (item) {
    writeReportArtifact(item);
    console.log("✅ Lark docs preview report artifact written");
  } else {
    console.log("ℹ️  No report item generated");
  }
}

main().catch((error) => {
  console.error("❌ Failed to write Lark docs report:", error);
  process.exit(1);
});
