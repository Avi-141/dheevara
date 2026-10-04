#!/usr/bin/env bash
# Run the pinned gitleaks (rule 8: nothing committed holds a key).
#   scripts/gitleaks.sh --path     print the binary's path, installing it first if needed
#   scripts/gitleaks.sh <args>     run gitleaks with <args>
# Installs into .tools/bin (gitignored): the release tarball checked against its sha256 list,
# or, where GitHub releases are unreachable, a build through the Go module proxy (verified by
# Go's checksum database). If neither works it fails; there is no unchecked fallback.
set -euo pipefail
VERSION=8.30.1
root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
bin="$root/.tools/bin/gitleaks"

have() { [ -x "$bin" ] && [ "$("$bin" version 2>/dev/null)" = "$VERSION" ]; }

from_release() {
  local os arch name base tmp
  os=$(uname -s | tr '[:upper:]' '[:lower:]')
  case "$(uname -m)" in x86_64|amd64) arch=x64 ;; arm64|aarch64) arch=arm64 ;; *) return 1 ;; esac
  name="gitleaks_${VERSION}_${os}_${arch}.tar.gz"
  base="https://github.com/gitleaks/gitleaks/releases/download/v${VERSION}"
  tmp=$(mktemp -d)
  trap 'rm -rf "$tmp"' RETURN
  curl -fsSL --max-time 60 -o "$tmp/$name" "$base/$name" || return 1
  curl -fsSL --max-time 30 -o "$tmp/sums.txt" "$base/gitleaks_${VERSION}_checksums.txt" || return 1
  (cd "$tmp" && grep " $name\$" sums.txt | sha256sum -c --status) || { echo "gitleaks: checksum mismatch for $name" >&2; return 1; }
  tar -xzf "$tmp/$name" -C "$tmp" gitleaks && install -m 0755 "$tmp/gitleaks" "$bin"
}

from_go() {
  command -v go >/dev/null || return 1
  GOBIN="$root/.tools/bin" GOFLAGS=-mod=mod go install \
    -ldflags "-X github.com/zricethezav/gitleaks/v8/version.Version=$VERSION" \
    "github.com/zricethezav/gitleaks/v8@v$VERSION"
}

if ! have; then
  mkdir -p "$root/.tools/bin"
  echo "gitleaks $VERSION not found in .tools/bin; installing" >&2
  from_release 2>/dev/null || from_go >&2 || {
    echo "gitleaks: could not install $VERSION (no GitHub release download and no Go toolchain)." >&2
    echo "Install it by hand into $bin and re-run." >&2
    exit 1
  }
  have || { echo "gitleaks: installed binary does not report version $VERSION" >&2; exit 1; }
fi

if [ "${1:-}" = "--path" ]; then echo "$bin"; else exec "$bin" "$@"; fi
