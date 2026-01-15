// src/utils/envConfig.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const isDev = __DEV__;
const isAndroid = Platform.OS === 'android';

function getDomain() {
  if (!isDev) {
    return process.env.EXPO_PUBLIC_DOMAIN;
  }

  // DEV 모드
  if (isAndroid) {
    // Android 에뮬레이터 체크: modelName에 'sdk' 또는 'Emulator'가 포함되어 있음
    const modelName = Constants.platform?.android?.modelName || '';
    const isEmulator =
      modelName.includes('sdk') || modelName.includes('Emulator');

    if (isEmulator) {
      return process.env.EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN;
    }
  }

  // iOS 실기기/시뮬레이터, Android 실기기
  return process.env.EXPO_PUBLIC_DOMAIN;
}

export const config = {
  mode: isDev ? 'development' : 'production',
  domain: getDomain(),
  apiUrl: process.env.EXPO_PUBLIC_API_URL!,
  isDev,
  isProd: !isDev,
};
