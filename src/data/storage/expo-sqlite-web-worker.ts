// Substituição do worker do expo-sqlite para web
// Este arquivo substitui o worker.ts problemático

export default {
  // Implementação vazia para evitar erros de importação
  postMessage: () => {},
  terminate: () => {},
  onmessage: null,
  onerror: null,
};
