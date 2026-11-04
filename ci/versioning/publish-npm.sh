#!/bin/bash
set -euo pipefail

# Publish the workspace packages to npm.
#
# The npm CLI is used on purpose: it is the only client that implements npm's
# trusted publishing (OIDC). Once a Trusted Publisher is configured on
# npmjs.com for a package (GitHub Actions → this repo → this workflow), CI can
# publish with the job's OIDC token and no long-lived NPM_TOKEN secret. Locally
# this falls back to whatever npm auth is configured in ~/.npmrc.
#
# Publishing is idempotent: a package whose version is already on the registry
# is skipped, so the job can run on every push to main.

NPM_TAG="${NPM_TAG:-latest}"
REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org}"

# npm refuses to run inside a pnpm-managed repo: the root package.json
# declares devEngines.packageManager, and npm aborts when it is not the
# running package manager. NPM_CONFIG_FORCE downgrades that to a warning.
npm_read() {
  NPM_CONFIG_FORCE=true npm "$@"
}

# Collect the publishable workspace packages: everything that is not private.
readarray -t PACKAGES < <(
  pnpm list -r --depth -1 --json | node -e '
    let raw = "";
    process.stdin.on("data", (chunk) => (raw += chunk));
    process.stdin.on("end", () => {
      for (const pkg of JSON.parse(raw)) {
        if (pkg.private || !pkg.name || !pkg.version) continue;
        console.log(pkg.name + "\t" + pkg.path);
      }
    });
  '
)

if [ "${#PACKAGES[@]}" -eq 0 ]; then
  echo "No publishable packages found."
  exit 0
fi

PUBLISHED=0

for entry in "${PACKAGES[@]}"; do
  NAME="${entry%%$'\t'*}"
  PACKAGE_PATH="${entry#*$'\t'}"
  VERSION=$(node -p "require(require('path').resolve('${PACKAGE_PATH}/package.json')).version")

  if npm_read view "${NAME}@${VERSION}" version --registry "${REGISTRY}" > /dev/null 2>&1; then
    echo "↷ ${NAME}@${VERSION} is already published — skipping."
    continue
  fi

  echo "→ Publishing ${NAME}@${VERSION} (tag: ${NPM_TAG})"
  (cd "${PACKAGE_PATH}" && npm publish --access public --tag "${NPM_TAG}" --registry "${REGISTRY}")
  PUBLISHED=$((PUBLISHED + 1))
done

if [ "${PUBLISHED}" -eq 0 ]; then
  echo "Nothing to publish."
else
  echo "Published ${PUBLISHED} package(s)."
fi
