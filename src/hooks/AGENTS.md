<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/hooks — 커스텀 React 훅

## Purpose
네이티브 앱 전용 비즈니스 로직 훅. WebView 브리지 통신, 네이티브 뒤로가기, 인증, 앱 생명주기 등을 처리한다.

## Key Files

| File | Description |
|------|-------------|
| `useWebViewBridge.ts` | `src/bridge/index.ts`를 래핑하여 WebView의 `onMessage` 핸들러로 연결 |
| `useWebViewBackHandler.ts` | Android 물리 뒤로가기 버튼 동작 처리 (WebView 히스토리 우선) |
| `useLoginHandler.ts` | 로그인 후 리다이렉트/네비게이션 처리 |
| `useSyncLoginCookie.ts` | 앱 마운트 시 인증 쿠키 동기화 |
| `useAppState.ts` | 앱 포그라운드/백그라운드 전환 감지 및 처리 |
| `useWebViewMessage.ts` | WebView에서 수신된 메시지 파싱 및 라우팅 |

## For AI Agents

- `useWebViewBridge`는 `src/components/DoLinkWebView.tsx`에서 사용됨
- Android 뒤로가기는 WebView 내 히스토리가 있으면 WebView 히스토리 뒤로 이동, 없으면 앱 종료 동작을 `useWebViewBackHandler`가 처리
- `useAppState`는 앱이 백그라운드에서 포그라운드로 돌아올 때 토큰 갱신 등의 작업 트리거에 활용

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
