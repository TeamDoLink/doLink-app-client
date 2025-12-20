// src/utils/envConfig.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const isDev = __DEV__;
const isAndroid = Platform.OS === 'android';
const isDevice = Constants.isDevice;

function getDomain() {
  if (!isDev) {
    return process.env.EXPO_PUBLIC_DOMAIN!;
  }

  // DEV
  if (isAndroid && !isDevice) {
    // Android Emulator
    return process.env.EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN!;
  }

  // DEV 실기기 (iOS + Android)
  // 시뮬레이터
  return process.env.EXPO_PUBLIC_DEVICE_DOMAIN!;
}

export const config = {
  mode: isDev ? 'development' : 'production',
  domain: getDomain(),
  apiUrl: process.env.EXPO_PUBLIC_API_URL!,
  isDev,
  isProd: !isDev,
};
