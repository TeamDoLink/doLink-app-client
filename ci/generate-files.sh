#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

require_env() {
  local k="$1"
  if [[ -z "${!k:-}" ]]; then
    echo "generate-files.sh: 필수 환경 변수가 비어 있습니다: $k" >&2
    exit 1
  fi
}

b64_decode() {
  # GNU base64 (--decode) vs macOS base64 (-D) 호환.
  # 이 함수는 입력을 argv($1)가 아니라 stdin으로 받도록 설계합니다.
  if printf 'Zg==' | base64 --decode >/dev/null 2>&1; then
    base64 --decode
  else
    base64 -D
  fi
}

require_env "ANDROID_KEYSTORE_BASE64"
require_env "PLAY_STORE_SERVICE_ACCOUNT_JSON_BASE64"
require_env "GOOGLE_SERVICES_JSON_BASE64"

# 1Password/Secrets base64 -> 파일 복원
mkdir -p fastlane/credentials

printf '%s' "$ANDROID_KEYSTORE_BASE64" | b64_decode > fastlane/credentials/dolink.keystore

printf '%s' "$PLAY_STORE_SERVICE_ACCOUNT_JSON_BASE64" | b64_decode > fastlane/credentials/playstore.json
if command -v jq >/dev/null 2>&1; then
  jq empty fastlane/credentials/playstore.json
fi

printf '%s' "$GOOGLE_SERVICES_JSON_BASE64" | b64_decode > google-services.json
if command -v jq >/dev/null 2>&1; then
  jq empty google-services.json
fi

echo "generate-files.sh: base64 파일 복원 완료"
