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
  // 1. Android 에뮬레이터 체크
  // if (isAndroid) {
  //   const modelName = Constants.platform?.android?.modelName || '';

  //   // 확실하게 에뮬레이터인 키워드가 포함된 경우에만 true (기본값을 false로)
  //   const isEmulator =
  //     modelName.includes('sdk') ||
  //     modelName.includes('Emulator') ||
  //     modelName.includes('google_sdk') ||
  //     modelName.includes('generic') ||
  //     modelName.includes('vbox');

  //   console.log(
  //     '🤖 [Android] Detected modelName:',
  //     modelName,
  //     'isEmulator:',
  //     isEmulator,
  //   );

  //   if (isEmulator) {
  //     console.log('🚀 Using Emulator Domain (10.0.2.2)');
  //     return process.env.EXPO_PUBLIC_ANDROID_EMULATOR_DOMAIN;
  //   }
  // }

  // 2. iOS 시뮬레이터 체크
  if (Platform.OS === 'ios' && !Constants.isDevice) {
    console.log('🍎 Using iOS Simulator Domain (localhost)');
    return 'http://localhost:3000';
  }

  // 3. 실기기 (Android/iOS)
  console.log('📱 Using Real Device Domain:', process.env.EXPO_PUBLIC_DOMAIN);
  return process.env.EXPO_PUBLIC_DOMAIN;
}

export const config = {
  mode: isDev ? 'development' : 'production',
  domain: getDomain() ?? 'http://localhost:3000', // Fallback
  apiUrl: process.env.EXPO_PUBLIC_API_URL!,
  isDev,
  isProd: !isDev,
};
