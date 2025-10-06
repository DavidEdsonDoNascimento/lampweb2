// Wrapper para interceptar e prevenir o uso do SQLite problemático
let isSQLiteBlocked = false;

export function blockSQLite() {
  isSQLiteBlocked = true;
  console.log('🚫 SQLite bloqueado - usando repositório em memória');
}

export function unblockSQLite() {
  isSQLiteBlocked = false;
  console.log('✅ SQLite desbloqueado');
}

export function isSQLiteBlockedStatus(): boolean {
  return isSQLiteBlocked;
}

// Interceptar require('expo-sqlite') para prevenir uso
const originalRequire = (global as any).require;
if (originalRequire) {
  (global as any).require = function (moduleName: string) {
    if (moduleName === 'expo-sqlite' && isSQLiteBlocked) {
      console.log('🚫 Tentativa de usar SQLite bloqueado interceptada');
      throw new Error(
        'SQLite está bloqueado devido a problemas de compatibilidade'
      );
    }
    return originalRequire(moduleName);
  };
}

// Interceptar import dinâmico se disponível
if (typeof global !== 'undefined' && (global as any).__importDynamic) {
  const originalImportDynamic = (global as any).__importDynamic;
  (global as any).__importDynamic = function (moduleName: string) {
    if (moduleName === 'expo-sqlite' && isSQLiteBlocked) {
      console.log(
        '🚫 Tentativa de import dinâmico do SQLite bloqueado interceptada'
      );
      throw new Error(
        'SQLite está bloqueado devido a problemas de compatibilidade'
      );
    }
    return originalImportDynamic(moduleName);
  };
}
