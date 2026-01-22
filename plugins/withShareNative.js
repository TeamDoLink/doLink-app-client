const {
  withAndroidManifest,
  withDangerousMod,
  withAndroidStyles,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * withShareNative - 안드로이드 네이티브 공유 BottomSheet를 위한 Expo Config Plugin
 *
 * 이 플러그인은 다음 작업을 수행합니다:
 * 1. ShareActivity.kt를 적절한 경로에 주입
 * 2. share_layout.xml 및 drawable 리소스 주입
 * 3. AndroidManifest.xml에 ShareActivity 등록 (process=":share" 포함)
 * 4. styles.xml에 투명 테마 추가
 */

const PLUGIN_NAME = 'withShareNative';

/**
 * 1. ShareActivity.kt 파일 주입
 */
function withShareActivityKotlin(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const packageName = config.android?.package;
      if (!packageName) {
        throw new Error(`${PLUGIN_NAME}: android.package is required`);
      }

      // 대상 경로 계산
      const packagePath = packageName.split('.').join('/');
      const targetDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'java',
        packagePath,
      );

      // 디렉토리 생성
      fs.mkdirSync(targetDir, { recursive: true });

      // ShareActivity.kt 원본 읽기 및 패키지명 치환
      const sourceFile = path.join(
        config.modRequest.projectRoot,
        'plugins',
        'native',
        'ShareActivity.kt',
      );

      if (!fs.existsSync(sourceFile)) {
        throw new Error(
          `${PLUGIN_NAME}: ShareActivity.kt not found at ${sourceFile}`,
        );
      }

      let activityContent = fs.readFileSync(sourceFile, 'utf-8');

      // 패키지명 플레이스홀더 치환
      activityContent = activityContent.replace(
        /\{\{PACKAGE_NAME\}\}/g,
        packageName,
      );

      // 대상 파일에 쓰기
      const targetFile = path.join(targetDir, 'ShareActivity.kt');
      fs.writeFileSync(targetFile, activityContent);

      console.log(`${PLUGIN_NAME}: ShareActivity.kt written to ${targetFile}`);

      return config;
    },
  ]);
}

/**
 * 2. Layout XML 파일 주입
 */
function withShareLayoutXml(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const layoutDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'res',
        'layout',
      );

      // 디렉토리 생성
      fs.mkdirSync(layoutDir, { recursive: true });

      // share_layout.xml 복사
      const sourceFile = path.join(
        config.modRequest.projectRoot,
        'plugins',
        'native',
        'share_layout.xml',
      );

      if (!fs.existsSync(sourceFile)) {
        throw new Error(
          `${PLUGIN_NAME}: share_layout.xml not found at ${sourceFile}`,
        );
      }

      const targetFile = path.join(layoutDir, 'share_layout.xml');
      fs.copyFileSync(sourceFile, targetFile);

      console.log(`${PLUGIN_NAME}: share_layout.xml written to ${targetFile}`);

      return config;
    },
  ]);
}

/**
 * 3. Drawable 리소스 파일들 주입
 */
function withShareDrawables(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const drawableDir = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'res',
        'drawable',
      );

      // 디렉토리 생성
      fs.mkdirSync(drawableDir, { recursive: true });

      // 복사할 drawable 파일 목록
      const drawableFiles = [
        'share_bottom_sheet_bg.xml',
        'share_handle_bg.xml',
        'share_card_bg.xml',
        'share_save_button_bg.xml',
        'ic_share.xml',
      ];

      const nativeDir = path.join(
        config.modRequest.projectRoot,
        'plugins',
        'native',
      );

      for (const file of drawableFiles) {
        const sourceFile = path.join(nativeDir, file);
        if (!fs.existsSync(sourceFile)) {
          console.warn(`${PLUGIN_NAME}: ${file} not found, skipping`);
          continue;
        }

        const targetFile = path.join(drawableDir, file);
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`${PLUGIN_NAME}: ${file} written to ${targetFile}`);
      }

      return config;
    },
  ]);
}

/**
 * 4. styles.xml에 ShareActivity용 투명 테마 추가
 */
function withShareTransparentTheme(config) {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults;

    // Theme.Share.Transparent 테마가 이미 있는지 확인
    const hasShareTheme = styles.resources.style?.some(
      (style) => style.$.name === 'Theme.Share.Transparent',
    );

    if (!hasShareTheme) {
      if (!styles.resources.style) {
        styles.resources.style = [];
      }

      // ShareActivity 전용 투명 테마 추가
      styles.resources.style.push({
        $: {
          name: 'Theme.Share.Transparent',
          parent: 'Theme.AppCompat.DayNight.NoActionBar',
        },
        item: [
          { $: { name: 'android:windowIsTranslucent' }, _: 'true' },
          {
            $: { name: 'android:windowBackground' },
            _: '@android:color/transparent',
          },
          { $: { name: 'android:windowContentOverlay' }, _: '@null' },
          { $: { name: 'android:windowNoTitle' }, _: 'true' },
          { $: { name: 'android:windowIsFloating' }, _: 'false' },
          { $: { name: 'android:backgroundDimEnabled' }, _: 'false' },
          {
            $: { name: 'android:statusBarColor' },
            _: '@android:color/transparent',
          },
          {
            $: { name: 'android:navigationBarColor' },
            _: '@android:color/transparent',
          },
          { $: { name: 'android:windowAnimationStyle' }, _: '@null' },
        ],
      });

      console.log(
        `${PLUGIN_NAME}: Theme.Share.Transparent added to styles.xml`,
      );
    }

    return config;
  });
}

/**
 * 5. AndroidManifest.xml에 ShareActivity 등록
 */
function withShareManifest(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application?.[0];

    if (!application) {
      throw new Error(
        `${PLUGIN_NAME}: application element not found in manifest`,
      );
    }

    // activity 배열 초기화
    if (!application.activity) {
      application.activity = [];
    }

    // ShareActivity가 이미 등록되어 있는지 확인
    const hasShareActivity = application.activity.some(
      (activity) => activity.$['android:name'] === '.ShareActivity',
    );

    if (!hasShareActivity) {
      // ShareActivity 등록
      application.activity.push({
        $: {
          'android:name': '.ShareActivity',
          'android:label': 'dolink',
          'android:theme': '@style/Theme.Share.Transparent',
          'android:exported': 'true',
          'android:process': ':share', // 메인 앱과 분리된 프로세스
          'android:excludeFromRecents': 'true', // 최근 앱 목록에서 제외
          'android:taskAffinity': '', // 별도의 task로 실행
          'android:launchMode': 'singleInstance', // 단일 인스턴스
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

      console.log(`${PLUGIN_NAME}: ShareActivity added to AndroidManifest.xml`);
    }

    return config;
  });
}

/**
 * 메인 플러그인 함수
 */
function withShareNative(config, props = {}) {
  // 순서대로 플러그인 적용
  config = withShareTransparentTheme(config); // 1. 테마 추가
  config = withShareActivityKotlin(config); // 2. Kotlin 파일 주입
  config = withShareLayoutXml(config); // 3. Layout XML 주입
  config = withShareDrawables(config); // 4. Drawable 리소스 주입
  config = withShareManifest(config); // 5. Manifest 수정

  return config;
}

module.exports = withShareNative;
