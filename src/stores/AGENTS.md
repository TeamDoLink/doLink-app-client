<!-- Generated: 2026-03-16 | Updated: 2026-03-16 -->

# src/stores — 전역 상태 관리 (Zustand + Secure Storage)

## Purpose
네이티브 앱의 전역 상태 관리. 웹 클라이언트와 달리 인증 토큰을 Expo Secure Store에 암호화 저장하여 보안을 강화한다.

## Key Files

| File | Description |
|------|-------------|
| `useAuthStore.ts` | 인증 상태 관리 — accessToken, refreshToken을 Secure Store에 영속화, rehydration 상태 추적 |
| `secureStorage.ts` | Expo Secure Store 추상화 레이어 (get/set/remove) |

## For AI Agents

- 토큰은 반드시 `secureStorage.ts`를 통해 Expo Secure Store에 저장. AsyncStorage나 메모리에 토큰 저장 금지 (보안)
- `useAuthStore`의 rehydration이 완료되기 전(`isRehydrated: false`)에는 앱 UI를 렌더링하지 않도록 `app/_layout.tsx`에서 처리됨
- 공유 익스텐션(`app-inbox/`)도 동일한 스토어를 사용하여 인증 상태를 공유

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
