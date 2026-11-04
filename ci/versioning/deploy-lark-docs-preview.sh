#!/bin/bash
set -euo pipefail

# Lark Docs Preview Deployment Script
# Uploads a new version to lark-docs worker, outputs report artifact
#
# PREREQUISITES:
# - Preview URLs must be enabled in Cloudflare dashboard:
#   Workers & Pages > lark-docs > Settings > Domains & Routes > Preview URLs > Enable
# - cloudflare.config.ts must have "previewUrls: true" (already configured)

echo "📚 Starting lark-docs preview deployment..."

# Verify Cloudflare credentials
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required"
  exit 1
fi

echo "🔨 Building @lark-ui/core library..."
pnpm --filter @lark-ui/core build

echo "🔨 Building lark-docs..."
pnpm --filter @lark-ui/docs-astro build

echo "🚀 Uploading version to lark-docs worker..."
cd packages/lark-docs-astro
echo "  Using cf version: $(pnpm exec cf --version)"

# Package the build output into a Build Output Specification. `cf` uploads
# that specification when it runs with `--prebuilt`.
echo "  Packaging build output..."
pnpm run build:cf

# Upload version - capture output regardless of exit code
COMMIT_SHORT="${GITHUB_SHA:0:7}"
COMMIT_SHORT="${COMMIT_SHORT:-local}"
VERSION_STDOUT=$(mktemp)
VERSION_STDERR=$(mktemp)
pnpm exec cf workers versions create --prebuilt \
  --message "Preview for ${COMMIT_SHORT}" \
  >"$VERSION_STDOUT" 2>"$VERSION_STDERR" || true

cat "$VERSION_STDOUT" "$VERSION_STDERR"

# `cf` prints the structured result as JSON on stdout.
VERSION_ID=$(jq -r '.. | .version_id? // .versionId? // empty' "$VERSION_STDOUT" 2>/dev/null | head -1)
if [ -z "$VERSION_ID" ]; then
  VERSION_ID=$(jq -r '.. | objects | select(has("created_on") or has("number")) | .id? // empty' "$VERSION_STDOUT" 2>/dev/null | head -1)
fi

if [ -z "$VERSION_ID" ]; then
  echo "❌ Failed to upload version - no Worker version ID in output"
  exit 1
fi

# Prefer a preview URL printed by `cf`; otherwise construct it from the version
# ID. Format: https://<version-prefix>-<worker-name>.<subdomain>.workers.dev
PREVIEW_URL=$(cat "$VERSION_STDOUT" "$VERSION_STDERR" |
  grep -oE 'https://[a-z0-9-]+-lark-docs\.design-engineering\.workers\.dev' | head -1)

if [ -z "$PREVIEW_URL" ]; then
  echo "  cf did not output preview URL, constructing from version ID..."
  VERSION_PREFIX=$(echo "$VERSION_ID" | cut -c1-8)
  WORKER_NAME="lark-docs"
  SUBDOMAIN="design-engineering"
  PREVIEW_URL="https://${VERSION_PREFIX}-${WORKER_NAME}.${SUBDOMAIN}.workers.dev"
  echo "  Constructed preview URL: $PREVIEW_URL"
fi

rm -f "$VERSION_STDOUT" "$VERSION_STDERR"

echo "✅ Version uploaded successfully"

cd ../..

export LARK_DOCS_PREVIEW_URL="$PREVIEW_URL"
echo "✅ Lark docs preview available: $LARK_DOCS_PREVIEW_URL"

# Output report artifact for the PR reporter job
echo "📄 Writing report artifact..."
pnpm tsx ci/scripts/write-lark-docs-report.ts

echo "🎉 Lark docs preview deployment complete!"
