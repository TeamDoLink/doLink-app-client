import path from 'path';

export default {
  expo: {
    owner: 'dolinkcore',
    scheme: 'dolink',
    name: 'dolink',
    slug: 'dolink',
    version: '1.1.3',
    runtimeVersion: '1.1.3',
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
      googleServicesFile: './GoogleService-Info.plist',
      buildNumber: '24',
      infoPlist: {
        LSApplicationQueriesSchemes: ['http', 'https', 'tel', 'mailto'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      googleServicesFile: './google-services.json',
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.teamdolink.dolink',
      versionCode: 25,
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'app.dolink.team',
              pathPrefix: '/',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '0a769e3d-3c00-416a-8acb-4c676425c6c1',
      },
    },
    updates: {
      url: 'https://u.expo.dev/0a769e3d-3c00-416a-8acb-4c676425c6c1',
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
      './plugins/withShareExtensionBundleFix',
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
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
          android: {
            hardwareAccelerated: true,
          },
        },
      ],
      '@react-native-firebase/app',
      '@react-native-firebase/crashlytics',
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
