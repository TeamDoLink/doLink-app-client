#!/usr/bin/env bash
# Minimal act runner for `doLink-app-client/.github/workflows/android-playstore-fastlane.yml`.
# - 환경변수 주입은 `op run --env-file=... --` 로 처리
# - 이 스크립트는 워크플로 1개/잡 1개만 실행

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

WORKFLOW=".github/workflows/android-playstore-fastlane.yml"
JOB="deploy-android"
EVENT_FILE="${ACT_EVENT_FILE:-ci/act/act-event-workflow_dispatch.json}"
RUNNER_IMAGE="${ACT_RUNNER_IMAGE:-catthehacker/ubuntu:act-22.04}"

usage() {
  cat <<'EOF'
act-test.sh — android-playstore-fastlane.yml 로컬 실행 (nektos/act)

Usage:
  ci/act/act-test.sh validate
  ci/act/act-test.sh plan
  ci/act/act-test.sh run [--] [extra act args...]
  ci/act/act-test.sh help

설명:
  - `.github/workflows/android-playstore-fastlane.yml`의 `deploy-android` job만 실행합니다.
  - vars/secrets는 `op run --env-file=... --` 로 환경변수로 주입하는 것을 전제로 합니다.

옵션(환경변수):
  ACT_RUNNER_IMAGE    act runner 이미지 (기본 catthehacker/ubuntu:act-22.04)
  ACT_EVENT_FILE      workflow_dispatch 이벤트 JSON 경로 (기본 ci/act/act-event-workflow_dispatch.json)
  ACT_CONTAINER_ARCH  예: linux/amd64 (arm64 환경에서 필요할 수 있음)

예:
  op run --env-file="./ci/act/.env" -- ./ci/act/act-test.sh plan
  op run --env-file="./ci/act/.env" -- ./ci/act/act-test.sh run
EOF
}

platform_flags() {
  PLATFORM_FLAGS=(-P "ubuntu-latest=${RUNNER_IMAGE}")
  local arch="${ACT_CONTAINER_ARCH-}"
  if [[ -n "$arch" ]]; then
    PLATFORM_FLAGS+=(--container-architecture "$arch")
  elif [[ "$(uname -m)" == "arm64" ]]; then
    PLATFORM_FLAGS+=(--container-architecture "linux/amd64")
  fi
}

require_event_file() {
  if [[ ! -f "$EVENT_FILE" ]]; then
    echo "act-test: 이벤트 파일이 없습니다: $EVENT_FILE" >&2
    exit 1
  fi
}

case "${1:-help}" in
  help|-h|--help)
    usage
    ;;
  validate)
    act --validate -W "$WORKFLOW"
    ;;
  plan)
    shift || true
    require_event_file
    platform_flags
    act workflow_dispatch \
      -W "$WORKFLOW" \
      -j "$JOB" \
      -e "$EVENT_FILE" \
      --var ACT=1 \
      "${PLATFORM_FLAGS[@]}" \
      -n \
      --var-file ci/act/.env.vars \
      --secret-file ci/act/.env.secrets \
      "$@"
    ;;
  run)
    shift || true
    require_event_file
    platform_flags
    act workflow_dispatch \
      -W "$WORKFLOW" \
      -j "$JOB" \
      -e "$EVENT_FILE" \
      --var ACT=1 \
      "${PLATFORM_FLAGS[@]}" \
      --var-file ci/act/.env.vars \
      --secret-file ci/act/.env.secrets \
      "$@"
    ;;
  *)
    echo "act-test: 알 수 없는 명령: $1" >&2
    usage >&2
    exit 1
    ;;
esac
