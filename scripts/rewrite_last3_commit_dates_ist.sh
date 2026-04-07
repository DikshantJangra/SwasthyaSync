#!/usr/bin/env bash
set -euo pipefail

# This script is meant to be used with:
#   git rebase --exec "bash scripts/rewrite_last3_commit_dates_ist.sh" HEAD~3
#
# It will run once per commit during the rebase (oldest -> newest).
# Each run amends the current commit date to Apr 8, 2026 with different IST times.

COUNTER_FILE=".git/rewrite-date-counter"

# Read current counter (default 0) and increment.
count=0
if [[ -f "$COUNTER_FILE" ]]; then
  count="$(cat "$COUNTER_FILE")"
fi
count=$((count + 1))
echo "$count" > "$COUNTER_FILE"

# Pick the target time based on which commit we're on (1..3).
case "$count" in
  1) time="10:00:00" ;;
  2) time="10:10:00" ;;
  3) time="10:20:00" ;;
  *)
    echo "Error: expected to run 3 times, but ran $count times." >&2
    exit 1
    ;;
esac

date_str="2026-04-08T${time}+05:30"

# Amend commit dates (author + committer) without changing message/content.
GIT_AUTHOR_DATE="$date_str" \
GIT_COMMITTER_DATE="$date_str" \
git commit --amend --no-edit --date "$date_str" >/dev/null

