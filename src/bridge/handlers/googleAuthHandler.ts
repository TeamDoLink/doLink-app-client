import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import crashlytics from '@react-native-firebase/crashlytics';
import { Platform } from 'react-native';
import NitroCookies from 'react-native-nitro-cookies';
import useAuthStore from '@/src/stores/useAuthStore';
import { config } from '@/src/utils/envConfig';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

function isGoogleSignInUserCancelled(error: unknown): boolean {
  if (error === null || typeof error !== 'object') return false;
  return (error as { code?: string }).code === statusCodes.SIGN_IN_CANCELLED;
}

function recordGoogleAuthFailure(reason: string, detail?: unknown): void {
  try {
    const inst = crashlytics();
    inst.log(`[GoogleAuth] ${reason}`);
    const err =
      detail instanceof Error
        ? detail
        : new Error(
            detail !== undefined ? `${reason}: ${String(detail)}` : reason,
          );
    inst.recordError(err);
  } catch {
    /* Crashlytics 미연결·개발 환경 등 */
  }
}

/**
 * Google 로그인 진행 후 서버에서 JWT 토큰 발급
 * - Google Sign-In → idToken 획득
 * - POST /v1/auth/oauth/google/native → accessToken + refreshToken 발급
 * - Zustand + SecureStore 저장
 * @returns accessToken (웹으로 전달할 토큰) | null (실패 시)
 */
export const performGoogleLogin = async (): Promise<string | null> => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    const idToken = response.data?.idToken;
    const serverAuthCode = response.data?.serverAuthCode;

    if (!idToken) {
      recordGoogleAuthFailure('missing_id_token');
      return null;
    }

    const serverResponse = await fetch(
      `${config.apiUrl}/v1/auth/oauth/google/native`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, serverAuthCode }),
      },
    );

    if (!serverResponse.ok) {
      let bodySnippet = '';
      try {
        bodySnippet = (await serverResponse.text()).slice(0, 500);
      } catch {
        /* ignore */
      }
      recordGoogleAuthFailure(
        'server_oauth_error',
        new Error(
          `HTTP ${serverResponse.status}${bodySnippet ? ` body: ${bodySnippet}` : ''}`,
        ),
      );
      return null;
    }

    const json = await serverResponse.json();
    const accessToken: string | undefined = json?.result?.accessToken;
    const refreshToken: string | undefined = json?.result?.refreshToken;

    if (!accessToken || !refreshToken) {
      recordGoogleAuthFailure(
        'missing_tokens_in_response',
        `hasAccess=${!!accessToken} hasRefresh=${!!refreshToken}`,
      );
      return null;
    }

    const { setAccessToken, setRefreshToken } = useAuthStore.getState();
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    const webOrigin = config.domain;
    if (webOrigin?.startsWith('http')) {
      try {
        await NitroCookies.set(
          webOrigin,
          {
            name: 'refresh',
            value: refreshToken,
            path: '/',
            secure: webOrigin.startsWith('https'),
            httpOnly: false,
            expires: new Date(
              Date.now() + 90 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          Platform.OS === 'ios',
        );
      } catch {
        /* ignore */
      }
    }

    return accessToken;
  } catch (error: unknown) {
    if (!isGoogleSignInUserCancelled(error)) {
      recordGoogleAuthFailure('google_sign_in_exception', error);
    }
    return null;
  }
};
