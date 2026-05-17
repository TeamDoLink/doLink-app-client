import NitroCookies from 'react-native-nitro-cookies';
import { Platform } from 'react-native';
import { config } from './envConfig';

async function getDomainCookies(
  useWebKit: boolean,
): Promise<Awaited<ReturnType<typeof NitroCookies.get>> | null> {
  try {
    return await NitroCookies.get(config.domain, useWebKit);
  } catch {
    return null;
  }
}

export async function getRefreshCookieValue(): Promise<string | null> {
  const cookieLookupOrder = Platform.OS === 'ios' ? [true, false] : [false];

  for (const useWebKit of cookieLookupOrder) {
    const cookies = await getDomainCookies(useWebKit);
    const refreshToken = cookies?.refresh?.value ?? null;

    if (refreshToken) {
      return refreshToken;
    }
  }

  return null;
}
