import { AuthMessageType, AuthPayload, AuthResponse } from '../types';
import { config } from '@/src/utils/envConfig';
import useAuthStore from '@/src/stores/useAuthStore';
import { getRefreshCookieValue } from '@/src/utils/authCookies';

function getAccessTokenFromResponse(value: unknown): string | null {
  if (
    value &&
    typeof value === 'object' &&
    'result' in value &&
    typeof value.result === 'string'
  ) {
    return value.result;
  }

  return null;
}

/**
 * 쿠키로 reissue 요청 후 스토어에 반영하고 access token을 반환한다.
 * 로그인 성공 감지 또는 auth:reissue 처리에서 공통 사용.
 */
export const performReissueFromCookies = async (): Promise<string | null> => {
  const {
    setAccessToken,
    setRefreshToken,
    refreshToken: storedRefresh,
  } = useAuthStore.getState();
  const cookieRefresh = await getRefreshCookieValue();

  const refreshToken = cookieRefresh ?? storedRefresh ?? null;

  if (!refreshToken) {
    return null;
  }

  if (cookieRefresh) {
    setRefreshToken(cookieRefresh);
  } else if (storedRefresh) {
    setRefreshToken(storedRefresh);
  }

  try {
    const requestAccessTokenResponse = await fetch(
      `${config.apiUrl}/v1/auth/reissue`,
      {
        method: 'POST',
        headers: {
          Cookie: `refresh=${refreshToken}`,
        },
      },
    );

    const responseText = await requestAccessTokenResponse.text();
    let requestAccessTokenResponseJson: unknown = null;

    try {
      requestAccessTokenResponseJson = JSON.parse(responseText);
    } catch {
      requestAccessTokenResponseJson = null;
    }

    const accessToken = getAccessTokenFromResponse(
      requestAccessTokenResponseJson,
    );
    if (accessToken) {
      setAccessToken(accessToken);
      return accessToken;
    }
  } catch {
    // reissue 실패 시 null 반환
  }
  return null;
};

export const authHandler = async (
  type: AuthMessageType,
  payload: AuthPayload,
): Promise<AuthResponse> => {
  switch (type) {
    case 'auth:login':
      return await handleLogin();
    case 'auth:logout':
      return await handleLogout();
    default:
      return {
        type,
        success: false,
      };
  }
};

const handleLogin = async (): Promise<AuthResponse> => {
  await performReissueFromCookies();
  return {
    type: 'auth:login',
    success: true,
  };
};

const handleLogout = async (): Promise<AuthResponse> => {
  useAuthStore.getState().clearAuth();

  return {
    type: 'auth:logout',
    success: true,
  };
};
