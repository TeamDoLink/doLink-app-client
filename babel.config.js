module.exports = function (api) {
  api.cache(false);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@/src': './src',
            '@/app': './app',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
