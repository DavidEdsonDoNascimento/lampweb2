import { Platform } from 'react-native';

type DB = {
  query: (sql: string, params?: any[]) => Promise<any[]>;
  exec: (sql: string) => Promise<void>;
  close?: () => Promise<void>;
};

// Implementação para plataformas nativas (iOS/Android)
async function createNative(): Promise<DB> {
  try {
    // Importar o polyfill primeiro para interceptar o expo-sqlite na web
    if (Platform.OS === 'web') {
      require('./sqlite-web-polyfill');
    }

    const SQLite = require('expo-sqlite');

    // Tentar usar a nova API primeiro (expo-sqlite v15+)
    if (SQLite.openDatabaseSync) {
      const db = SQLite.openDatabaseSync('app.db');

      return {
        query(sql: string, params: any[] = []) {
          return new Promise((resolve, reject) => {
            try {
              const result = db.getAllSync(sql, params);
              resolve(result || []);
            } catch (error) {
              reject(error);
            }
          });
        },
        exec(sql: string) {
          return new Promise((resolve, reject) => {
            try {
              db.execSync(sql);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        },
        close() {
          return new Promise(resolve => {
            try {
              db.closeSync();
              resolve();
            } catch (error) {
              console.warn('Erro ao fechar banco:', error);
              resolve();
            }
          });
        },
      };
    } else {
      // Fallback para API antiga
      const db = SQLite.openDatabase('app.db');

      return {
        query(sql: string, params: any[] = []) {
          return new Promise((resolve, reject) => {
            db.readTransaction(tx => {
              tx.executeSql(
                sql,
                params,
                (_tx, result) => resolve(result.rows?._array ?? []),
                (_tx, err) => {
                  reject(err);
                  return true;
                }
              );
            });
          });
        },
        exec(sql: string) {
          return new Promise((resolve, reject) => {
            db.transaction(tx => {
              tx.executeSql(
                sql,
                [],
                () => resolve(),
                (_tx, err) => {
                  reject(err);
                  return true;
                }
              );
            });
          });
        },
      };
    }
  } catch (error) {
    console.error('Erro ao criar SQLite nativo:', error);
    throw error;
  }
}

// Implementação para web (fallback em memória)
async function createWeb(): Promise<DB> {
  console.log('🌐 Usando SQLite em memória para web');

  // Simular um banco em memória
  const memory: Record<string, any[]> = {};
  let nextId = 1;

  return {
    async query(sql: string, params: any[] = []) {
      console.log('🔍 Query web:', sql, params);

      // Simular algumas queries básicas
      if (sql.toLowerCase().includes('select')) {
        const tableName = extractTableName(sql);
        return memory[tableName] || [];
      }

      if (sql.toLowerCase().includes('count')) {
        const tableName = extractTableName(sql);
        return [{ count: memory[tableName]?.length || 0 }];
      }

      return [];
    },

    async exec(sql: string) {
      console.log('⚡ Exec web:', sql);

      if (sql.toLowerCase().includes('create table')) {
        const tableName = extractTableName(sql);
        if (!memory[tableName]) {
          memory[tableName] = [];
        }
        return;
      }

      if (sql.toLowerCase().includes('insert')) {
        const tableName = extractTableName(sql);
        if (!memory[tableName]) {
          memory[tableName] = [];
        }

        // Simular inserção
        const newRecord = { id: nextId++, timestamp: Date.now() };
        memory[tableName].push(newRecord);
        return;
      }

      if (sql.toLowerCase().includes('delete')) {
        const tableName = extractTableName(sql);
        if (memory[tableName]) {
          memory[tableName] = [];
        }
        return;
      }
    },
  };
}

// Função auxiliar para extrair nome da tabela de uma query SQL
function extractTableName(sql: string): string {
  const match = sql.match(/(?:from|into|update|delete from)\s+(\w+)/i);
  return match ? match[1] : 'default';
}

// Função principal que retorna o banco apropriado para a plataforma
export async function getDB(): Promise<DB> {
  if (Platform.OS === 'web') {
    return createWeb();
  }
  return createNative();
}

// Função para testar se o SQLite está funcionando
export async function testSQLite(): Promise<{
  success: boolean;
  platform: string;
  error?: string;
}> {
  try {
    const db = await getDB();

    // Teste básico
    await db.exec(
      'CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)'
    );
    await db.exec('INSERT INTO test (name) VALUES (?)', ['test']);
    const result = await db.query('SELECT * FROM test');

    return {
      success: true,
      platform: Platform.OS,
      error: undefined,
    };
  } catch (error) {
    return {
      success: false,
      platform: Platform.OS,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}
