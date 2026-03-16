<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# plugins — 커스텀 Expo 플러그인

## Purpose
`app.config.js`에서 사용하는 커스텀 Expo Config Plugin 모음. 기본 Expo 플러그인으로 처리하기 어려운 네이티브 설정을 자동화한다.

## Key Files

| File | Description |
|------|-------------|
| `withShareNative.js` | iOS/Android 공유 익스텐션을 위한 네이티브 설정 자동화 플러그인 |

## For AI Agents

- Expo Config Plugin은 `npm run prebuild` 시 `android/` 및 `ios/` 네이티브 파일을 자동 수정함
- 네이티브 설정 변경이 필요하면 직접 `android/`나 `ios/`를 수정하는 대신 플러그인으로 처리 (재생성 시 덮어써짐)
- `withShareNative.js` 수정 후에는 `npm run prebuild`를 실행하여 변경사항 적용

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
