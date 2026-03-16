<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# fastlane — 빌드/배포 자동화

## Purpose
Android 앱 빌드 및 Google Play Store 배포 자동화. `npm run build:android`, `npm run deploy`, `npm run build:deploy` 명령으로 실행된다.

## Key Files

| File | Description |
|------|-------------|
| `Fastfile` | Fastlane 레인 정의 — APK/AAB 빌드, Google Play 배포 레인 |
| `credentials/` | Android 키스토어 및 서명 인증서 (환경 변수로도 제공 가능) |

## For AI Agents

- `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` 환경 변수가 빌드에 필요
- 배포 전 `npm run prebuild`로 네이티브 환경이 최신 상태인지 확인 필요
- iOS 빌드/배포는 EAS(`eas.json`)를 통해 처리 — Fastlane은 Android 전용
- `credentials/` 폴더의 키스토어 파일은 절대 git에 커밋하지 말 것

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
