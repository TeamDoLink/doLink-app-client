import NitroCookies from 'react-native-nitro-cookies';
import { AuthMessageType, AuthPayload, AuthResponse } from '../types';
import { config } from '@/src/utils/envConfig';
import useAuthStore from '@/src/stores/useAuthStore';
import { issueAccessToken } from '@/src/api/generated/endpoints/auth/auth';

/**
 * 쿠키로 reissue 요청 후 스토어에 반영하고 access token을 반환한다.
 * 로그인 성공 감지 또는 auth:reissue 처리에서 공통 사용.
 */
export const performReissueFromCookies = async (): Promise<string | null> => {
  const { setAccessToken, setRefreshToken } = useAuthStore.getState();
  const cookies = await NitroCookies.get(config.domain);

  if (!cookies) return null;

  const refreshToken = cookies['refresh']?.value;
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }

  try {
    const { data: requestAccessTokenResponse } = await issueAccessToken();
    const accessToken = await requestAccessTokenResponse.text();
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
      return handleLogin();
    case 'auth:logout':
      return handleLogout();
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
