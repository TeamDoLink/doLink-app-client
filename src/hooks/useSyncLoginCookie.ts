import { useCallback } from 'react';
import NitroCookies from 'react-native-nitro-cookies';
import useAuthStore from '../stores/useAuthStore';
import { config } from '../utils/envConfig';
import axios, { Axios } from 'axios';
import { issueAccessToken } from '../api/generated/endpoints/auth/auth';

const useSyncLoginCookie = () => {
  const { setAccessToken, setRefreshToken } = useAuthStore();

  return useCallback(async () => {
    const cookies = await NitroCookies.get(config.domain);

    if (cookies) {
      const refreshToken = cookies['refresh']?.value;
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }

      const { data: requestAccessTokenResponse } = await issueAccessToken();

      const accessToken = await requestAccessTokenResponse.text();
      console.log('accessToken', accessToken);
      if (accessToken) {
        setAccessToken(accessToken);
      }
    }
  }, [setAccessToken, setRefreshToken]);
};

export default useSyncLoginCookie;
