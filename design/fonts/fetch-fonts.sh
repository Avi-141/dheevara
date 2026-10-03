#!/usr/bin/env bash
# Vendor Google Fonts locally so headless screenshots render the real faces.
# Usage: design/fonts/fetch-fonts.sh   (writes design/fonts/fonts.css + files/)
set -euo pipefail
cd "$(dirname "$0")"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'
URL="https://fonts.googleapis.com/css2?$(cat families.txt | tr '\n' '&' | sed 's/&$//')&display=swap"
mkdir -p files
curl -sS -A "$UA" "$URL" -o remote.css
grep -o 'https://fonts.gstatic.com/[^)]*' remote.css | sort -u | while read -r u; do
  f="files/$(echo "$u" | sed 's#https://fonts.gstatic.com/##; s#/#_#g')"
  [ -s "$f" ] || curl -sS "$u" -o "$f"
done
sed -E 's#https://fonts.gstatic.com/([^)]*)#files/\1#g' remote.css | awk '{ if (match($0,/files\/[^)]*/)) { p=substr($0,RSTART,RLENGTH); q=p; gsub(/\//,"_",q); sub(/^files_/,"files/",q); sub(p,q) } print }' > fonts.css
rm remote.css
echo "$(ls files | wc -l) font files"
