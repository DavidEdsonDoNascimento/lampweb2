// Substituição do wa-sqlite.ts do expo-sqlite
// Este arquivo substitui o wa-sqlite.ts problemático

export default class WaSQLiteFactory {
  constructor() {
    console.log('🌐 WaSQLiteFactory substituído por implementação web');
  }

  // Implementação vazia para evitar erros
  create() {
    return {
      exec: () => {},
      close: () => {},
    };
  }
}
