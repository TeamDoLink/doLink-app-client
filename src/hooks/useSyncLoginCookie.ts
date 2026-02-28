import { useCallback } from 'react';
import NitroCookies from 'react-native-nitro-cookies';
import useAuthStore from '../stores/useAuthStore';
import { config } from '../utils/envConfig';
import axios, { Axios, AxiosResponse } from 'axios';
import { issueAccessToken } from '../api/generated/endpoints/auth/auth';
import { ApiResponseString } from '../api/generated/models';

const useSyncLoginCookie = () => {
  const { setAccessToken, setRefreshToken } = useAuthStore();

  return useCallback(async () => {
    const cookies = await NitroCookies.get(config.domain);
    if (cookies) {
      const refreshToken = cookies['refresh']?.value;
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }

      const response = await fetch(`${config.apiUrl}/v1/auth/reissue`, {
        method: 'POST',
        headers: {
          Cookie: `refresh=${refreshToken}`,
        },
      });

      // const reissueResponseJson = await response.json();
      const reissueResponseJson = await response.json();

      const accessToken = reissueResponseJson?.code;
      if (accessToken) {
        setAccessToken(accessToken);
      }
    }
  }, []);
};

export default useSyncLoginCookie;
