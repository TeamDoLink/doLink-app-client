<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/components — React Native UI 컴포넌트

## Purpose
네이티브 앱 전용 React Native 컴포넌트 모음. 메인 앱과 공유 익스텐션(`app-inbox/`) 모두에서 사용된다.

## Key Files & Subdirectories

| Path | Description |
|------|-------------|
| `DoLinkWebView.tsx` | **핵심 컴포넌트** — 웹 클라이언트를 WebView로 렌더링. 딥링크, 브리지, 인증, 뒤로가기 통합 |
| `DebugButton.tsx` | 개발 디버그 토글 버튼 |
| `ArchiveSocialMediaListItem.tsx` | 공유 익스텐션용 소셜 미디어 아카이브 아이템 |
| `AddCollectionView.tsx` | 새 컬렉션 생성 뷰 (공유 익스텐션에서 사용) |
| `Portal/index.tsx` | 모달을 루트에 렌더링하는 Portal 컴포넌트 |
| `SharedIntent/index.tsx` | 공유 인텐트 데이터 Context Provider |
| `InboxBottomSheet/` | 공유 익스텐션 바텀 시트 UI (8개 서브 컴포넌트: BottomSheet, Layout, Header, Footer, Content, Handle, Overlay, context) |
| `common/Button.tsx` | 범용 버튼 컴포넌트 |
| `common/inputField/TextInput.tsx` | 텍스트 입력 필드 |
| `common/inputField/searchInputField.tsx` | 검색 입력 필드 |
| `common/backButton/index.tsx` | 뒤로가기 버튼 |

## For AI Agents

- `DoLinkWebView.tsx`는 앱의 핵심 컴포넌트. 수정 시 WebView 브리지, 딥링크, 키보드 처리에 모두 영향을 미치므로 주의
- `InboxBottomSheet/`는 공유 익스텐션 전용 UI로 `context.tsx`에서 상태를 관리하는 복합 컴포넌트
- `SharedIntent/index.tsx` Context는 `app-inbox/index.tsx`에서 Provider로 마운트됨

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
