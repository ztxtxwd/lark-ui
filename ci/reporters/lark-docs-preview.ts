/**
 * Lark Docs Preview Reporter
 *
 * Reports the deployed lark-docs preview URL.
 */

import type { CIContext, ReportItem, Reporter } from "./types";

export const larkDocsPreviewReporter: Reporter = {
  id: "lark-docs-preview",
  name: "Lark Docs Preview",

  async collect(context: CIContext): Promise<ReportItem | null> {
    const { larkDocsPreviewUrl, shortSha } = context;

    if (!larkDocsPreviewUrl) {
      return null;
    }

    const content = `**Preview URL:** [${larkDocsPreviewUrl}](${larkDocsPreviewUrl})

This preview deployment (\`${shortSha}\`) contains the latest documentation changes from this MR.`;

    return {
      id: "lark-docs-preview",
      title: "📚 Documentation Preview",
      priority: 30,
      content,
      success: true,
    };
  },
};
