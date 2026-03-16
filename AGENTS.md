<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# doLink-app-client

## Purpose
doLink 서비스의 React Native 모바일 클라이언트 (iOS / Android). Expo 기반 하이브리드 아키텍처로, `doLink-web-client`를 WebView로 래핑하여 네이티브 기능(클립보드, 딥링크, 공유 익스텐션, Firebase 등)을 덧붙인다. EAS로 클라우드 빌드하고 Fastlane으로 Google Play 배포를 자동화한다.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | 의존성 및 npm 스크립트 |
| `app.config.js` | Expo 앱 설정 (iOS/Android 설정, 플러그인, Firebase, 공유 익스텐션) |
| `eas.json` | EAS 빌드 프로파일 (development, preview, production) |
| `metro.config.js` | Metro 번들러 설정 (NativeWind, SVG 트랜스포머) |
| `babel.config.js` | Babel 설정 (NativeWind JSX 변환, 모듈 리졸버) |
| `tsconfig.json` | TypeScript 설정 (`@/src/*`, `@/app/*`, `@/assets/*` 경로 별칭) |
| `index.tsx` | 앱 진입점 (메인 앱 + 공유 익스텐션 등록) |
| `tailwind.config.js` | Tailwind CSS 설정 (모바일) |
| `orval.config.js` | OpenAPI 스펙으로부터 API 코드 자동 생성 |
| `.env` | 환경 변수 (도메인 URL, 에뮬레이터 설정) |
| `firebase.json` | Firebase 설정 |
| `google-services.json` | Google Play Services 설정 |
| `Gemfile` | Fastlane Ruby 의존성 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | Expo Router 파일 기반 라우팅 (index.tsx: WebView 메인 화면, _layout.tsx: 루트 레이아웃) |
| `app-inbox/` | 공유 익스텐션 (별도 앱 컴포넌트 — 다른 앱에서 공유된 콘텐츠 수신 처리) |
| `src/api/` | Axios 인스턴스 및 Orval 자동 생성 API 클라이언트 |
| `src/components/` | React Native 컴포넌트 (DoLinkWebView, InboxBottomSheet, SharedIntent 등) |
| `src/hooks/` | 커스텀 훅 (WebView 브리지, 로그인 핸들러, 뒤로가기, 앱 상태 등) |
| `src/stores/` | Zustand 상태 (auth + Expo Secure Store 연동) |
| `src/bridge/` | WebView ↔ 네이티브 양방향 브리지 로직 |
| `src/utils/` | 유틸리티 (envConfig, closeShareOrExitApp, openMainApp 등) |
| `src/lib/` | NativeWind 초기화 등 라이브러리 래퍼 |
| `src/types/` | TypeScript 타입 정의 |
| `src/constants/` | 앱 상수 |
| `src/assets/` | 폰트(Pretendard), 아이콘, 이미지, 로고 |
| `android/` | Android 네이티브 코드 (Gradle, AndroidManifest, 네이티브 모듈) |
| `ios/` | iOS 네이티브 코드 (Xcode 프로젝트, Podfile, 네이티브 모듈) |
| `plugins/` | 커스텀 Expo 플러그인 (`withShareNative.js` 등) |
| `fastlane/` | Android 빌드/배포 자동화 (Fastfile, credentials/) |
| `scripts/` | 빌드 및 유틸리티 스크립트 |
| `targets/` | 빌드 타깃 설정 |

## For AI Agents

### Working In This Directory
- **하이브리드 구조 이해 필수**: 대부분의 UI는 `doLink-web-client`(WebView)에서 렌더링되고, 이 앱은 네이티브 기능 래퍼 역할을 함
- **경로 별칭**: `@/src/` → `src/`, `@/app/` → `app/`, `@/assets/` → `assets/`
- **API 코드 직접 수정 금지**: `src/api/generated/`는 Orval 자동 생성 파일. 변경 시 `npm run orval` 재실행
- **공유 익스텐션**: `app-inbox/`는 별도 앱으로 동작하며 독립적인 컴포넌트 트리를 가짐
- **네이티브 빌드 변경 시**: `android/`나 `ios/` 하위 파일을 수동 수정한 경우 `npm run prebuild`로 클린 재생성 필요
- **환경 변수**: `EXPO_PUBLIC_` 접두사 변수만 클라이언트에서 접근 가능 (Expo 규칙)

### Build & Deploy Commands
```bash
npm run start           # Expo 개발 서버 시작
npm run android         # Android 에뮬레이터/디바이스 실행
npm run ios             # iOS 시뮬레이터/디바이스 실행
npm run web             # 웹 버전 실행
npm run lint            # ESLint 검사
npm run lint:fix        # ESLint 자동 수정
npm run format          # Prettier 포맷
npm run orval           # OpenAPI 스펙으로부터 API 코드 재생성
npm run prebuild        # 네이티브 환경 클린 재생성
npm run build:android   # Android APK/AAB 빌드 (Fastlane)
npm run deploy          # Google Play Store 배포 (Fastlane)
npm run build:deploy    # prebuild + build + deploy 일괄 실행
npm run ota             # EAS OTA(Over-the-Air) 업데이트 배포
```

### Architecture Overview
```
doLink-app-client (React Native / Expo)
  ├── app/_layout.tsx         ← QueryClient, SafeArea, Keyboard Provider
  └── app/index.tsx           ← 메인 화면
        |
  src/components/DoLinkWebView.tsx   ← WebView 래퍼
        |
  doLink-web-client (https://app.dolink.team)
        |
  ← WebView Bridge (postMessage) →
  src/hooks/useWebViewBridge.ts
  src/bridge/
        |
  Native Features
    ├── Clipboard (Expo Clipboard)
    ├── Secure Storage (Expo Secure Store)
    ├── Firebase (Crashlytics, Analytics)
    ├── Deep Linking (Expo Router)
    └── Share Extension (app-inbox/)
```

**공유 익스텐션 흐름:**
```
다른 앱에서 공유 → iOS Share Sheet / Android Intent
      |
app-inbox/ (별도 앱 진입점)
      |
InboxBottomSheet → API 호출 → 컬렉션/링크 저장
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_DOMAIN` | 웹 클라이언트 URL (기본: `https://app.dolink.team`) |
| `EXPO_PUBLIC_API_URL` | API 서버 URL (기본: `https://api.dolink.team`) |
| `EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN` | Android 에뮬레이터용 URL |
| `EXPO_PUBLIC_DEBUG_INBOX` | 공유 익스텐션 디버그 모드 활성화 |
| `ANDROID_KEYSTORE_PASSWORD` | Android 서명 키스토어 비밀번호 |
| `ANDROID_KEY_ALIAS` | Android 서명 키 별칭 |
| `ANDROID_KEY_PASSWORD` | Android 서명 키 비밀번호 |

## Dependencies

### Runtime
- `expo` ~54.0.33 — React Native 프레임워크
- `react` 19.1.0, `react-native` 0.81.5
- `expo-router` ^6.0.23 — 파일 기반 네이티브 라우팅
- `nativewind` ^4.2.1 — React Native용 Tailwind CSS
- `zustand` ^5.0.8 — 경량 전역 상태 관리
- `@tanstack/react-query` ^5.90.20 — 서버 상태 및 데이터 페칭
- `axios` ^1.13.4 — HTTP 클라이언트
- `expo-secure-store` — 토큰 보안 저장소
- `@react-native-firebase/crashlytics`, `@react-native-firebase/analytics` — Firebase

### Dev
- `typescript` — 타입 시스템
- `orval` — OpenAPI → TypeScript API 클라이언트 코드 생성
- `eslint`, `prettier` — 코드 품질
- `eas-cli` — EAS 빌드 및 OTA 배포
- Fastlane (Ruby) — Android 빌드/배포 자동화

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
