<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/assets — 정적 에셋

## Purpose
네이티브 앱에서 사용하는 아이콘, 이미지, 폰트 등 정적 파일 모음.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `icons/` | SVG 아이콘 파일 |
| `images/` | 이미지 파일 |

## For AI Agents

- 폰트(Pretendard 계열)는 `app.config.js`의 `expo-font` 플러그인 설정에서 로드됨
- 새 에셋 추가 후 `src/constants/images.ts`에 경로 상수 등록
- Expo에서 SVG를 컴포넌트로 사용하려면 Metro의 SVG 트랜스포머(`metro.config.js`) 설정이 필요하며 이미 구성되어 있음

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
