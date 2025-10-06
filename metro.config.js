const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuração para suportar SVGs
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

// Configuração de extensões de arquivo
config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => ext !== 'svg'
);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// Configuração de resolução de módulos para alias
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@app': path.resolve(__dirname, 'src/app'),
  '@domain': path.resolve(__dirname, 'src/domain'),
  '@data': path.resolve(__dirname, 'src/data'),
  '@presentation': path.resolve(__dirname, 'src/presentation'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@hooks': path.resolve(__dirname, 'src/hooks'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@config': path.resolve(__dirname, 'config'),
  '@assets': path.resolve(__dirname, 'assets'),
};

// Resolver para expo-sqlite na web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configuração para resolver problemas do expo-sqlite na web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Ignorar arquivos WASM problemáticos na web
config.resolver.blockList = [
  /node_modules\/expo-sqlite\/web\/wa-sqlite\/.*\.wasm$/,
];

// Substituir expo-sqlite por nossa implementação web
config.resolver.alias = {
  ...config.resolver.alias,
  'expo-sqlite': path.resolve(__dirname, 'src/data/storage/expo-sqlite-web.ts'),
  'expo-sqlite/web': path.resolve(
    __dirname,
    'src/data/storage/expo-sqlite-web.ts'
  ),
  'expo-sqlite/web/worker': path.resolve(
    __dirname,
    'src/data/storage/worker.ts'
  ),
  'expo-sqlite/web/wa-sqlite/wa-sqlite': path.resolve(
    __dirname,
    'src/data/storage/wa-sqlite.ts'
  ),
  'expo-sqlite/web/wa-sqlite/wa-sqlite.wasm': path.resolve(
    __dirname,
    'src/data/storage/wa-sqlite-wasm.js'
  ),
};

// Configuração adicional para resolver problemas de módulos
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
