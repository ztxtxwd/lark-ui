/**
 * Reporter Registry
 *
 * Central registry of all available reporters.
 * Add new reporters here to include them in PR comments.
 */

import type { Reporter } from "./types";
import { npmReleaseReporter } from "./npm-release";
import { larkDocsPreviewReporter } from "./lark-docs-preview";
import { visualRegressionReporter } from "./visual-regression";
import { bundleSizeReporter } from "./bundle-size";

export const reporters: Reporter[] = [
  npmReleaseReporter,
  larkDocsPreviewReporter,
  visualRegressionReporter,
  bundleSizeReporter,
];

export * from "./types";
export {
  REPORTS_DIR,
  writeReportArtifact,
  readReportArtifacts,
  buildContextFromEnv,
} from "./types";
export { npmReleaseReporter } from "./npm-release";
export { larkDocsPreviewReporter } from "./lark-docs-preview";
export { visualRegressionReporter } from "./visual-regression";
export { bundleSizeReporter } from "./bundle-size";
