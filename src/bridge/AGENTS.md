<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/bridge — WebView ↔ 네이티브 브리지

## Purpose
`DoLinkWebView`(웹 클라이언트)와 React Native 앱 간의 양방향 메시지 통신을 처리한다. 웹에서 보낸 메시지를 수신하여 적절한 핸들러로 라우팅하고, 결과를 다시 WebView로 전달한다.

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | 브리지 메시지 라우터 — 메시지 타입에 따라 핸들러 디스패치, 타입 가드 포함 |
| `sender.ts` | WebView로 응답 전송 헬퍼 (`sendToWebView`, `sendAuthLoginToWeb` 등) |
| `types.ts` | 브리지 메시지 타입 전체 정의 (요청/응답 페이로드 포함) |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `handlers/authHandler.ts` | 로그인/로그아웃/토큰 재발급 처리 |
| `handlers/draftHandler.ts` | AsyncStorage 기반 폼 초안 저장/불러오기/삭제 |
| `handlers/clipboardHandler.ts` | 네이티브 클립보드 읽기 |
| `handlers/linkHandler.ts` | URL 열기 및 canOpen 체크 |
| `handlers/shareHandler.ts` | 소셜 공유 및 OS 공유 시트 |

## For AI Agents

- 브리지 메시지 프로토콜은 웹 클라이언트의 `src/types/native.ts`와 **반드시 동기화** 유지. 어느 한쪽 변경 시 양쪽 모두 수정 필요
- 새 브리지 기능 추가 절차:
  1. `types.ts`에 요청/응답 타입 추가
  2. `handlers/`에 핸들러 파일 생성
  3. `index.ts`의 라우터에 메시지 타입 케이스 추가
  4. `sender.ts`에 응답 헬퍼 추가 (필요시)
  5. 웹 클라이언트의 `src/utils/nativeBridge.ts`와 `src/types/native.ts` 업데이트
- `src/hooks/useWebViewBridge.ts`가 이 브리지를 `DoLinkWebView`의 `onMessage` 콜백으로 연결함

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
