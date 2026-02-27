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

      const response = await fetch(`${config.domain}/v1/auth/reissue`, {
        method: 'POST',
        headers: {
          Cookie: `refresh=${refreshToken}`,
        },
      });

      // const reissueResponseJson = await response.json();
      const reissueResponseText = await response.text();

      // TODO: access token 이 제대로 적용되지 않는것으로 보임
      console.log(
        'reissueResponseText',
        response,
        'reissueResponseText',
        reissueResponseText,
      );
      // const accessToken = requestAccessTokenResponse?.code;
      // if (accessToken) {
      //   setAccessToken(accessToken);
      // }
    }
  }, []);
};

export default useSyncLoginCookie;
