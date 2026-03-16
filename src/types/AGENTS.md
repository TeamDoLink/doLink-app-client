<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/types — TypeScript 타입 정의

## Purpose
네이티브 앱 전용 TypeScript 타입 및 인터페이스 정의. API 자동 생성 타입과는 별개로 앱 클라이언트 전용 타입을 관리한다.

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | 범용 타입 정의 |
| `shareIntent.ts` | iOS/Android 공유 인텐트 데이터 타입 |
| `taskDraft.ts` | 태스크 폼 초안 타입 (브리지를 통해 AsyncStorage에 저장되는 구조) |
| `svg.d.ts` | SVG 파일 모듈 타입 선언 (TypeScript가 SVG import를 인식하도록) |

## For AI Agents

- 브리지 메시지 타입은 여기가 아니라 `src/bridge/types.ts`에서 관리
- `taskDraft.ts`의 타입은 웹 클라이언트의 `src/types/draft.ts`와 동기화 유지 필요
- `svg.d.ts`는 빌드 설정이므로 수정 불필요

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
