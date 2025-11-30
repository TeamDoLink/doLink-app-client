// src/utils/domainConfig.ts

const MODE = __DEV__ ? 'development' : 'production';

const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN;
// localhost:5000 임시
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const config = {
  mode: MODE,
  domain: DOMAIN,
  api: API_URL,
  isDev: MODE === 'development',
  isProd: MODE === 'production',
};
