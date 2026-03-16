<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/api — API 통신 레이어

## Purpose
백엔드 서버와의 HTTP 통신을 담당한다. 웹 클라이언트와 동일한 OpenAPI 스펙에서 생성된 타입 안전 API 클라이언트를 포함하며, 네이티브 환경에 맞게 Axios 설정이 다르다.

## Key Files

| File | Description |
|------|-------------|
| `axios-instance.ts` | Axios 인스턴스 설정 — Expo Secure Store에서 토큰 로드, 401 시 자동 토큰 갱신, 갱신 중 요청 큐잉 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `generated/endpoints/` | Orval 자동 생성 API 엔드포인트 (웹 클라이언트와 동일) |
| `generated/models/` | Orval 자동 생성 TypeScript 타입 정의 |

## For AI Agents

- **`generated/` 하위 파일 절대 수정 금지**: `npm run orval`로 재생성
- 웹 클라이언트의 `axios-instance.ts`와 달리 토큰을 Expo Secure Store에서 가져옴 (`src/stores/secureStorage.ts`)
- 401 응답 시 자동 토큰 갱신 후 실패한 요청을 재시도하는 로직이 있음 — 리프레시 토큰 만료 시에는 로그아웃 처리

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
