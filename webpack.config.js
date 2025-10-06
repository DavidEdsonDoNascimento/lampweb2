// Configuração Webpack para resolver problemas do expo-sqlite na web
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'expo-sqlite': path.resolve(
        __dirname,
        'src/data/storage/expo-sqlite-web.ts'
      ),
    },
    fallback: {
      'expo-sqlite': path.resolve(
        __dirname,
        'src/data/storage/expo-sqlite-web.ts'
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/[name].[hash][ext]',
        },
      },
    ],
  },
};
