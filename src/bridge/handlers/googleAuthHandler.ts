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
});

function logGoogleAuthError(error: unknown): void {
  console.error('[GoogleAuth] 로그인 오류 (원본)', error);
  if (error !== null && typeof error === 'object') {
    const dump: Record<string, unknown> = {};
    for (const key of Object.getOwnPropertyNames(error)) {
      dump[key] = (error as Record<string, unknown>)[key];
    }
    console.error('[GoogleAuth] 로그인 오류 (전체 필드)', dump);
  }
}

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

    console.log('response', response);
    const idToken = response.data?.idToken;

    console.log('idToken', idToken);
    if (!idToken) {
      console.error('[GoogleAuth] idToken을 받지 못했습니다');
      recordGoogleAuthFailure('missing_id_token');
      return null;
    }

    console.log('config.apiUrl', config.apiUrl);
    const serverResponse = await fetch(
      `${config.apiUrl}/v1/auth/oauth/google/native`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      },
    );

    console.log('serverResponse', serverResponse);
    if (!serverResponse.ok) {
      let bodySnippet = '';
      try {
        bodySnippet = (await serverResponse.text()).slice(0, 500);
      } catch {
        /* ignore */
      }
      console.error(
        '[GoogleAuth] 서버 응답 오류:',
        serverResponse.status,
        bodySnippet ? `body: ${bodySnippet}` : '',
      );
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
      console.error(
        '[GoogleAuth] 서버 응답에 accessToken 또는 refreshToken이 없습니다',
        { hasAccess: !!accessToken, hasRefresh: !!refreshToken },
      );
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
      } catch (e) {
        console.warn('[GoogleAuth] WebView용 refresh 쿠키 동기화 실패', e);
      }
    }

    return accessToken;
  } catch (error: unknown) {
    logGoogleAuthError(error);
    if (!isGoogleSignInUserCancelled(error)) {
      recordGoogleAuthFailure('google_sign_in_exception', error);
    }
    return null;
  }
};
