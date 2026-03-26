#!/usr/bin/env bash
# op run --env-file="./ci/act/.env" -- ./ci/act/act-env.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ACT_DIR="$ROOT/ci/act"

OUT_VARS="$ACT_DIR/.env.vars"
OUT_SECRETS="$ACT_DIR/.env.secrets"

# GitHub Actions vars.* 매핑 키 (상수)
VAR_KEYS=(
  EXPO_PUBLIC_DOMAIN
  EXPO_PUBLIC_API_URL
  EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN
  EXPO_PUBLIC_DEBUG_INBOX
  PLAY_STORE_TRACK
)

# GitHub Actions secrets.* 매핑 키 (상수)
SECRET_KEYS=(
  PLAY_STORE_SERVICE_ACCOUNT_JSON_BASE64
  ANDROID_KEYSTORE_BASE64
  GOOGLE_SERVICES_JSON_BASE64
  ANDROID_KEYSTORE_PASSWORD
  ANDROID_KEY_ALIAS
  ANDROID_KEY_PASSWORD
)

get_value() {
  local key="$1"
  printf '%s' "${!key-}"
}

: > "$OUT_VARS"
: > "$OUT_SECRETS"
chmod 600 "$OUT_VARS" "$OUT_SECRETS" 2>/dev/null || true

for key in "${VAR_KEYS[@]}"; do
  value="$(get_value "$key")"
  if [[ -n "$value" ]]; then
    printf '%s=%s\n' "$key" "$value" >> "$OUT_VARS"
  fi
done

for key in "${SECRET_KEYS[@]}"; do
  value="$(get_value "$key")"
  if [[ -n "$value" ]]; then
    printf '%s=%s\n' "$key" "$value" >> "$OUT_SECRETS"
  fi
done

echo "act-env: generated files"
echo "  vars:    $OUT_VARS"
echo "  secrets: $OUT_SECRETS"

