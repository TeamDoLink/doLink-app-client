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
          parent: 'Theme.AppCompat.NoActionBar',
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
          { $: { name: 'android:windowNoTitle' }, _: 'true' },
          { $: { name: 'android:windowActionBar' }, _: 'false' },
          { $: { name: 'android:colorBackgroundCacheHint' }, _: '@null' },
        ],
      });
      console.log('withShareNative: styles.xml에 투명 테마가 추가되었습니다.');
    }
    return config;
  });

  // 2. ShareActivity.kt 파일 주입
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const packageName = config.android?.package;
      if (!packageName) {
        throw new Error('withShareNative: android.package 설정이 필요합니다.');
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
          `withShareNative: 원본 파일을 찾을 수 없습니다: ${sourceFile}`,
        );
      }

      // 파일 내용을 읽어서 패키지명을 실제 앱 패키지명으로 치환
      let activityContent = fs.readFileSync(sourceFile, 'utf-8');
      activityContent = activityContent.replace(
        /\{\{PACKAGE_NAME\}\}/g,
        packageName,
      );

      // 실제 안드로이드 프로젝트 내부로 파일 쓰기
      const targetFile = path.join(targetDir, 'ShareActivity.kt');
      fs.writeFileSync(targetFile, activityContent);

      console.log(
        `withShareNative: ShareActivity.kt 파일이 생성되었습니다: ${targetFile}`,
      );
      return config;
    },
  ]);

  // 3. AndroidManifest.xml에 ShareActivity 등록
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application = manifest.manifest.application?.[0];

    if (!application) {
      throw new Error(
        'withShareNative: AndroidManifest에서 application 태그를 찾을 수 없습니다.',
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
          'android:name': '.ShareActivity', // 2단계에서 만든 파일명
          'android:label': 'dolink', // 사용자에게 보여질 이름
          'android:theme': '@style/Theme.Share.Transparent', // 1단계에서 만든 투명 테마 적용
          'android:exported': 'true', // 외부 앱에서 호출 가능하도록 설정
          'android:excludeFromRecents': 'true', // 최근 사용 앱 목록에 표시 안 함
          'android:taskAffinity': '', // 별도의 작업 단위로 분리
          'android:launchMode': 'singleInstance', // 항상 독립적인 인스턴스로 실행
          'android:configChanges':
            'orientation|screenSize|keyboard|keyboardHidden',
        },
        'intent-filter': [
          {
            // '공유하기' 액션을 받았을 때 실행됨
            action: [{ $: { 'android:name': 'android.intent.action.SEND' } }],
            category: [
              { $: { 'android:name': 'android.intent.category.DEFAULT' } },
            ],
            // '텍스트' 형태의 공유 데이터만 받음
            data: [{ $: { 'android:mimeType': 'text/plain' } }],
          },
        ],
      });
      console.log(
        'withShareNative: AndroidManifest.xml에 ShareActivity가 등록되었습니다.',
      );
    }

    return config;
  });

  return config;
};
