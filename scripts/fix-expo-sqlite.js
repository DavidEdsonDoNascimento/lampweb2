const fs = require('fs');
const path = require('path');

const workerPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-sqlite',
  'web',
  'worker.ts'
);
const workerContent = `// Substituição temporária do worker.ts do expo-sqlite para web
// Este arquivo substitui o worker.ts problemático para evitar erros de importação do WASM

// Implementação vazia para evitar erros de importação
export default class SQLiteWorker {
  constructor() {
    console.log('🌐 SQLiteWorker substituído por implementação web');
  }
  
  postMessage() {}
  terminate() {}
  onmessage = null;
  onerror = null;
}

// Exportar também como módulo ES6
export const SQLiteWorkerMessage = {};
export const SQLiteWorkerMessageType = {};`;

try {
  // Verificar se o arquivo existe
  if (fs.existsSync(workerPath)) {
    fs.writeFileSync(workerPath, workerContent, 'utf8');
    console.log('✅ worker.ts do expo-sqlite substituído com sucesso!');
  } else {
    console.log('⚠️  worker.ts do expo-sqlite não encontrado. Pulando...');
  }
} catch (error) {
  console.error('❌ Erro ao substituir worker.ts:', error);
  // Não falhar o build se houver erro
  process.exit(0);
}
