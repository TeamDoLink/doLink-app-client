import NitroCookies from 'react-native-nitro-cookies';
import { AuthMessageType, AuthPayload, AuthResponse } from '../types';
import { config } from '@/src/utils/envConfig';
import useAuthStore from '@/src/stores/useAuthStore';
import { issueAccessToken } from '@/src/api/generated/endpoints/auth/auth';

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
  const { setAccessToken, setRefreshToken } = useAuthStore.getState();

  const cookies = await NitroCookies.get(config.domain);

  if (cookies) {
    const refreshToken = cookies['refresh']?.value;
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    const response = await issueAccessToken();
    const accessToken = (response as any)?.result;
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }

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
