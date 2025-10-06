module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': ['./src'],
            '@app': ['./src/app'],
            '@domain': ['./src/domain'],
            '@data': ['./src/data'],
            '@presentation': ['./src/presentation'],
            '@services': ['./src/services'],
            '@hooks': ['./src/hooks'],
            '@utils': ['./src/utils'],
            '@config': ['./config'],
            '@assets': ['./assets'],
          },
        },
      ],
    ],
  };
};
