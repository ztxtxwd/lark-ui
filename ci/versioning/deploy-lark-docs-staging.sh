#!/bin/bash
set -euo pipefail

# Lark Docs Staging Deployment Script
# Deploys lark-docs to staging environment on merge to main

echo "📚 Starting lark-docs staging deployment..."

# Verify Cloudflare credentials
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required"
  exit 1
fi

echo "🔨 Building @lark-ui/core library..."
pnpm --filter @lark-ui/core build

echo "🔨 Building lark-docs..."
pnpm --filter @lark-ui/docs-astro build

echo "🚀 Deploying to staging..."
# `deploy:staging` packages the build output into a Build Output Specification
# for the staging environment and deploys it with `cf`.
pnpm --filter @lark-ui/docs-astro deploy:staging

echo "🎉 Lark docs staging deployment complete!"
