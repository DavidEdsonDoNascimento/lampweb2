// Substituição completa do worker.ts do expo-sqlite
// Este arquivo substitui o worker.ts problemático

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
export const SQLiteWorkerMessageType = {};
