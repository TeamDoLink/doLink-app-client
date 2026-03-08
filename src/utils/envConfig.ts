const isDev = __DEV__;
function getDomain() {
  if (isDev) {
    return process.env.EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN;
  }
  return process.env.EXPO_PUBLIC_DOMAIN;
}

export const config = {
  mode: isDev ? 'development' : 'production',
  domain: getDomain() ?? 'http://localhost:3000', // Fallback
  apiUrl: process.env.EXPO_PUBLIC_API_URL!,
  isDev,
  isProd: !isDev,
};
