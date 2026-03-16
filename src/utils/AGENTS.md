<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/utils — 유틸리티 함수

## Purpose
네이티브 앱 전용 범용 유틸리티. 환경 설정, 공유 익스텐션 종료, 메인 앱 열기 등을 처리한다.

## Key Files

| File | Description |
|------|-------------|
| `envConfig.ts` | `EXPO_PUBLIC_*` 환경 변수 로드 및 검증 |
| `closeShareOrExitApp.ts` | 공유 익스텐션 모달 닫기 또는 앱 종료 로직 |
| `openMainApp.ts` | 공유 익스텐션에서 메인 앱을 딥링크로 열기 |

## For AI Agents

- 환경 변수 접근은 항상 `envConfig.ts`를 통해 — 컴포넌트에서 `process.env` 직접 접근 금지
- `closeShareOrExitApp`은 `app-inbox/` 화면에서 사용자가 취소/완료 시 호출됨

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
