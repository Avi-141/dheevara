#!/usr/bin/env bash
# Print what this session can use: keys (present or missing, never their values) and reachable hosts.
# Run first in every new session; paste the output into your first message.
set -u
[ -f .env ] && { set -a; . ./.env; set +a; }

echo "Keys"
for k in SARVAM_API_KEY EXA_API_KEY FAL_KEY JEV_API_KEY JEV_BASE_URL VAGDHENU_URL MAX_RUN_USD; do
  if [ -n "${!k:-}" ]; then printf "  %-16s present\n" "$k"; else printf "  %-16s MISSING\n" "$k"; fi
done

echo "Hosts"
check() { code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$2" 2>/dev/null); [ "$code" = "000" ] && s="BLOCKED" || s="ok ($code)"; printf "  %-12s %-40s %s\n" "$1" "${2#https://}" "$s"; }
check fal        https://queue.fal.run
check fal        https://rest.alpha.fal.ai
check fal        https://v3.fal.media
check sarvam     https://api.sarvam.ai
check sarvam     https://docs.sarvam.ai/llms-full.txt
check exa        https://api.exa.ai
check jev        https://docs.typesafe.ai/introduction
[ -n "${JEV_BASE_URL:-}" ] && check jev "$JEV_BASE_URL"
check texts      https://gretil.sub.uni-goettingen.de/gretil.html
check texts      https://sanskritdocuments.org
check texts      https://archive.org
check texts      https://sacred-texts.com
check cdn        https://cdnjs.cloudflare.com
check cdn        https://cdn.jsdelivr.net
check fonts      https://fonts.googleapis.com/css2?family=Geist
check android    https://dl.google.com/dl/android/maven2/index.html
check maven      https://repo.maven.apache.org/maven2/
check gradle     https://plugins.gradle.org/m2/
[ -n "${VAGDHENU_URL:-}" ] && check vagdhenu "$VAGDHENU_URL"

echo "Tools"
for t in node pnpm ffmpeg java gradle python3; do printf "  %-8s %s\n" "$t" "$(command -v $t >/dev/null && ($t --version 2>&1 | grep -v "^Picked up" | head -1) || echo MISSING)"; done
