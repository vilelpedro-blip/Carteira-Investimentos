#!/usr/bin/env bash
set -euo pipefail
# Wrapper around the OpenClaw openai-whisper-api skill.
# Usage: ./transcribe_audio.sh /path/to/audio.m4a [--language pt] [--prompt "..."] [--json]

SKILL_DIR="/usr/local/lib/node_modules/openclaw/skills/openai-whisper-api"
exec bash "${SKILL_DIR}/scripts/transcribe.sh" "$@"
