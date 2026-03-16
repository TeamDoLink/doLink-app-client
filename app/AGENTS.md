<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# app — Expo Router 메인 라우트

## Purpose
Expo Router의 파일 기반 라우팅 진입점. 각 파일이 하나의 화면/라우트에 대응한다.

## Key Files

| File | Description |
|------|-------------|
| `_layout.tsx` | 루트 레이아웃 — ReactQueryClient, KeyboardProvider, SafeAreaProvider 설정 |
| `index.tsx` | 메인 홈 화면 — `DoLinkWebView` 컴포넌트를 렌더링하며 딥링크 지원 |
| `[...unmatched].tsx` | 매칭되지 않는 경로 처리 (catch-all) |
| `test.tsx` | 개발용 BottomSheet 컴포넌트 테스트 페이지 |

## For AI Agents

- 새 네이티브 화면이 필요하면 이 폴더에 파일 추가 (Expo Router 파일 기반 라우팅 규칙 준수)
- 대부분의 UI는 `index.tsx`의 `DoLinkWebView`를 통해 웹 클라이언트에서 렌더링됨
- `_layout.tsx`에서 앱 전역 Provider를 등록하므로, 새 Provider 추가 시 이 파일에 추가

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
