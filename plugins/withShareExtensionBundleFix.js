const { withDangerousMod, IOSConfig } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * expo-share-extension이 생성하는 ShareExtensionViewController.swift의
 * 번들 루트를 `.expo/.virtual-metro-entry`에서 `index`로 패치합니다.
 *
 * expo-share-extension의 metro 플러그인은 `?shareExtension=true` 쿼리가 포함된
 * 요청에서 `index.bundle`을 `index.share.bundle`로 재작성합니다.
 * 번들 루트가 `.expo/.virtual-metro-entry`이면 패턴이 일치하지 않아
 * 메인 앱 번들이 로드되고 `shareExtension` 컴포넌트 미등록 에러가 발생합니다.
 */
module.exports = function withShareExtensionBundleFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const targetName = `${IOSConfig.XcodeUtils.sanitizedName(config.name)}ShareExtension`;
      const swiftFilePath = path.join(
        config.modRequest.platformProjectRoot,
        targetName,
        'ShareExtensionViewController.swift',
      );

      if (!fs.existsSync(swiftFilePath)) {
        console.warn(
          `withShareExtensionBundleFix: Swift 파일을 찾을 수 없습니다: ${swiftFilePath}`,
        );
        return config;
      }

      let content = fs.readFileSync(swiftFilePath, 'utf-8');

      const original = 'forBundleRoot: ".expo/.virtual-metro-entry"';
      const patched = 'forBundleRoot: "index"';

      if (!content.includes(original)) {
        console.log(
          'withShareExtensionBundleFix: 이미 패치되었거나 패턴을 찾을 수 없습니다.',
        );
        return config;
      }

      content = content.replace(original, patched);
      fs.writeFileSync(swiftFilePath, content);

      console.log(
        `withShareExtensionBundleFix: 번들 루트가 "index"로 패치되었습니다: ${swiftFilePath}`,
      );

      return config;
    },
  ]);
};
