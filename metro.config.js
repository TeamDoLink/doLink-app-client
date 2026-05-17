const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { withShareExtension } = require('expo-share-extension/metro');

let config = getDefaultConfig(__dirname);

// SVG transformer 설정
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

config = withShareExtension(config);

module.exports = withNativeWind(config, {
  input: './src/styles/global.css',
  inlineRem: 16,
});
