const {
  withAndroidManifest,
  withAndroidStyles,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin: Android 공유 기능을 위한 네이티브 설정
 *
 * 2번 방식: 별도의 투명 ShareActivity 사용
 * - MainActivity는 기본 테마 유지 (일반 앱 실행에 영향 없음)
 * - ShareActivity만 투명 테마 적용 (공유 시에만 투명 배경)
 */
module.exports = function withShareNative(config) {
  // 1. styles.xml에 ShareActivity 전용 투명 테마 추가
  config = withAndroidStyles(config, (config) => {
    const styles = config.modResults;
    if (!styles.resources.style) styles.resources.style = [];

    const hasShareTheme = styles.resources.style.some(
      (s) => s.$.name === 'Theme.Share.Transparent',
    );

    if (!hasShareTheme) {
      styles.resources.style.push({
        $: {
          name: 'Theme.Share.Transparent',
          parent: '@android:style/Theme.Translucent.NoTitleBar',
        },
        item: [
          { $: { name: 'android:windowIsTranslucent' }, _: 'true' },
          {
            $: { name: 'android:windowBackground' },
            _: '@android:color/transparent',
          },
          { $: { name: 'android:windowContentOverlay' }, _: '@null' },
          { $: { name: 'android:backgroundDimEnabled' }, _: 'false' },
          { $: { name: 'android:windowIsFloating' }, _: 'false' },
        ],
      });
      console.log(
        'withShareNative: Theme.Share.Transparent added to styles.xml',
      );
    }
    return config;
  });

  // 2. ShareActivity.kt 파일 주입
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const packageName = config.android?.package;
      if (!packageName) {
        throw new Error('withShareNative: android.package is required');
      }

      const packagePath = packageName.split('.').join('/');
      const targetDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'java',
        packagePath,
      );

      fs.mkdirSync(targetDir, { recursive: true });

      const sourceFile = path.join(
        config.modRequest.projectRoot,
        'plugins',
        'native',
        'ShareActivity.kt',
      );

      if (!fs.existsSync(sourceFile)) {
        throw new Error(
          `withShareNative: ShareActivity.kt not found at ${sourceFile}`,
        );
      }

      let activityContent = fs.readFileSync(sourceFile, 'utf-8');
      activityContent = activityContent.replace(
        /\{\{PACKAGE_NAME\}\}/g,
        packageName,
      );

      const targetFile = path.join(targetDir, 'ShareActivity.kt');
      fs.writeFileSync(targetFile, activityContent);

      console.log(`withShareNative: ShareActivity.kt written to ${targetFile}`);
      return config;
    },
  ]);

  // 3. AndroidManifest.xml에 ShareActivity 등록 (MainActivity는 수정하지 않음)
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application?.[0];

    if (!application) {
      throw new Error(
        'withShareNative: application element not found in manifest',
      );
    }

    if (!application.activity) {
      application.activity = [];
    }

    // ShareActivity가 이미 등록되어 있는지 확인
    const hasShareActivity = application.activity.some(
      (activity) => activity.$['android:name'] === '.ShareActivity',
    );

    if (!hasShareActivity) {
      application.activity.push({
        $: {
          'android:name': '.ShareActivity',
          'android:label': 'dolink',
          'android:theme': '@style/Theme.Share.Transparent',
          'android:exported': 'true',
          'android:excludeFromRecents': 'true',
          'android:taskAffinity': '',
          'android:launchMode': 'singleInstance',
          'android:configChanges':
            'orientation|screenSize|keyboard|keyboardHidden',
        },
        'intent-filter': [
          {
            action: [{ $: { 'android:name': 'android.intent.action.SEND' } }],
            category: [
              { $: { 'android:name': 'android.intent.category.DEFAULT' } },
            ],
            data: [{ $: { 'android:mimeType': 'text/plain' } }],
          },
        ],
      });
      console.log(
        'withShareNative: ShareActivity added to AndroidManifest.xml',
      );
    }

    return config;
  });

  return config;
};
