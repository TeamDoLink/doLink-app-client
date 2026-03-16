<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# app-inbox — 공유 익스텐션 앱 모듈

## Purpose
다른 앱(Instagram, TikTok, Safari 등)에서 공유된 콘텐츠를 doLink에 저장하는 별도 앱 모듈. iOS Share Sheet / Android Share Intent로 진입하며, 메인 앱과 독립적인 컴포넌트 트리를 가진다.

## Key Files & Subdirectories

| Path | Description |
|------|-------------|
| `index.tsx` | 익스텐션 진입점 — NavigationStack, GestureHandler, BottomSheet, `AuthGuard` 마운트 |
| `components/AuthGuard.tsx` | 인증 여부 확인 가드 컴포넌트 |
| `screens/InboxScreen.tsx` | 공유된 콘텐츠를 컬렉션에 추가하는 메인 화면 |
| `screens/AddCollectionScreen.tsx` | 공유 중 새 컬렉션 생성 화면 |
| `types/index.ts` | 공유 익스텐션 전용 TypeScript 타입 |

## For AI Agents

- 이 모듈은 `index.tsx` (`src/index.tsx`)에서 메인 앱과 함께 `registerRootComponent`로 등록됨
- 공유 인텐트 데이터는 `src/components/SharedIntent/index.tsx` Context를 통해 전달됨
- 인증 상태는 `src/stores/useAuthStore.ts`를 공유 사용
- `InboxBottomSheet` UI 컴포넌트는 `src/components/InboxBottomSheet/`에서 가져옴
- **메인 앱 코드와 의존성 공유**: `src/` 하위 hooks, stores, api는 메인 앱과 공유함

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
