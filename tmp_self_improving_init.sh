#!/usr/bin/env bash
set -euo pipefail
BASE="$HOME/self-improving"
mkdir -p "$BASE"/{projects,domains,archive}

# memory.md (HOT)
if [ ! -f "$BASE/memory.md" ]; then
cat >"$BASE/memory.md" <<'MD'
# Memory (HOT Tier)

## Preferences

## Patterns

## Rules
MD
fi

# corrections.md
if [ ! -f "$BASE/corrections.md" ]; then
cat >"$BASE/corrections.md" <<'MD'
# Corrections Log

| Date | What I Got Wrong | Correct Answer | Status |
|------|-----------------|----------------|--------|
MD
fi

# index.md
if [ ! -f "$BASE/index.md" ]; then
cat >"$BASE/index.md" <<'MD'
# Memory Index

| File | Lines | Last Updated |
|------|-------|--------------|
| memory.md | 0 | — |
| corrections.md | 0 | — |
MD
fi

# heartbeat-state.md
if [ ! -f "$BASE/heartbeat-state.md" ]; then
cat >"$BASE/heartbeat-state.md" <<'MD'
# Self-Improving Heartbeat State

last_heartbeat_started_at: never
last_reviewed_change_at: never
last_heartbeat_result: never

## Last actions
- none yet
MD
fi

echo "Initialized $BASE";
ls -la "$BASE"
