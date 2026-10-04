#!/usr/bin/env bash
# Point git at .githooks so the gitleaks pre-commit hook runs. Called by `pnpm install` (prepare).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
if git rev-parse --git-dir >/dev/null 2>&1; then
  git config core.hooksPath .githooks
else
  echo "install-hooks: not a git checkout; skipping hook install" >&2
fi
