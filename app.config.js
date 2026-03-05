import path from 'path';

export default {
  expo: {
    scheme: 'dolink',
    name: 'dolink',
    slug: 'dolink',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    androidNavigationBar: {
      backgroundColor: '#ffffff',
      barStyle: 'dark-content',
    },
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.teamdolink.dolink',
      infoPlist: {
        LSApplicationQueriesSchemes: ['http', 'https', 'tel', 'mailto'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.teamdolink.dolink',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-share-extension',
        {
          backgroundColor: {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
          },
          activationRules: [
            {
              type: 'url',
            },
            {
              type: 'text',
            },
          ],
        },
      ],
      './plugins/withShareNative',
      [
        'expo-dev-client',
        {
          launchMode: 'most-recent',
        },
      ],
      [
        'expo-secure-store',
        {
          configureAndroidBackup: false,
          faceIDPermission:
            'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/Pretendard-Black.otf',
            './assets/fonts/Pretendard-Bold.otf',
            './assets/fonts/Pretendard-ExtraBold.otf',
            './assets/fonts/Pretendard-ExtraLight.otf',
            './assets/fonts/Pretendard-Light.otf',
            './assets/fonts/Pretendard-Medium.otf',
            './assets/fonts/Pretendard-Regular.otf',
            './assets/fonts/Pretendard-SemiBold.otf',
            './assets/fonts/Pretendard-Thin.otf',
          ],
        },
      ],
      [
        '@dexical/expo-store-signing',
        {
          storeFile: path.resolve(
            __dirname,
            './fastlane/credentials/dolink.keystore',
          ),
          storePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
          keyAlias: process.env.ANDROID_KEY_ALIAS,
          keyPassword: process.env.ANDROID_KEY_PASSWORD,
        },
      ],
    ],
  },
};
