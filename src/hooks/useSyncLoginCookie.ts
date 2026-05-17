import { useCallback } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { config } from '../utils/envConfig';
import { getRefreshCookieValue } from '../utils/authCookies';

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

const useSyncLoginCookie = () => {
  const { accessToken, refreshToken, setAccessToken, setRefreshToken } =
    useAuthStore();

  return useCallback(async () => {
    const nextRefreshToken = await getRefreshCookieValue();
    if (!nextRefreshToken) {
      return;
    }

    const refreshChanged = nextRefreshToken !== refreshToken;

    if (refreshChanged) {
      setRefreshToken(nextRefreshToken);
    }

    if (accessToken && !refreshChanged) {
      return;
    }

    const response = await fetch(`${config.apiUrl}/v1/auth/reissue`, {
      method: 'POST',
      headers: {
        Cookie: `refresh=${nextRefreshToken}`,
      },
    });

    const responseText = await response.text();
    let reissueResponseJson: unknown = null;

    try {
      reissueResponseJson = JSON.parse(responseText);
    } catch {
      reissueResponseJson = null;
    }

    const nextAccessToken = getAccessTokenFromResponse(reissueResponseJson);
    if (nextAccessToken) {
      setAccessToken(nextAccessToken);
      return;
    }
  }, [accessToken, refreshToken, setAccessToken, setRefreshToken]);
};

export default useSyncLoginCookie;
