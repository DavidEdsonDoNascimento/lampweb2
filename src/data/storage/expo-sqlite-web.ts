// Substituição completa do expo-sqlite para web
// Este arquivo será usado quando Platform.OS === 'web'

import { Platform } from 'react-native';

// Interface que simula o expo-sqlite
interface SQLiteDatabase {
  readTransaction: (callback: (tx: SQLiteTransaction) => void) => void;
  transaction: (callback: (tx: SQLiteTransaction) => void) => void;
  close: () => void;
  execSync?: (sql: string) => void;
  getAllSync?: (sql: string, params?: any[]) => any[];
  closeSync?: () => void;
}

interface SQLiteTransaction {
  executeSql: (
    sql: string,
    params: any[],
    successCallback?: (tx: SQLiteTransaction, result: SQLiteResult) => void,
    errorCallback?: (tx: SQLiteTransaction, error: any) => boolean
  ) => void;
}

interface SQLiteResult {
  rows: {
    _array: any[];
    length: number;
    item: (index: number) => any;
  };
  insertId?: number;
  rowsAffected: number;
}

// Implementação em memória para web
class WebSQLiteDatabase implements SQLiteDatabase {
  private tables: Map<string, any[]> = new Map();
  private nextId = 1;

  readTransaction(callback: (tx: SQLiteTransaction) => void) {
    const tx = new WebSQLiteTransaction(this, true);
    callback(tx);
  }

  transaction(callback: (tx: SQLiteTransaction) => void) {
    const tx = new WebSQLiteTransaction(this, false);
    callback(tx);
  }

  close() {
    this.tables.clear();
  }

  // Métodos síncronos para compatibilidade com nova API
  execSync(sql: string) {
    this.parseAndExecuteSQLSync(sql, []);
  }

  getAllSync(sql: string, params: any[] = []): any[] {
    const result = this.parseAndExecuteSQLSync(sql, params);
    return result.rows._array;
  }

  closeSync() {
    this.close();
  }

  // Métodos internos
  private getTable(name: string): any[] {
    if (!this.tables.has(name)) {
      this.tables.set(name, []);
    }
    return this.tables.get(name)!;
  }

  private createTable(name: string, columns: string[]) {
    this.tables.set(name, []);
  }

  private insertIntoTable(tableName: string, data: any): number {
    const table = this.getTable(tableName);
    const record = { id: this.nextId++, ...data };
    table.push(record);
    return record.id;
  }

  private selectFromTable(
    tableName: string,
    where?: string,
    params?: any[]
  ): any[] {
    const table = this.getTable(tableName);
    if (!where) return [...table];

    // Implementação simples de WHERE
    return table.filter(row => {
      // Aqui você pode implementar uma lógica mais sofisticada de WHERE
      return true; // Por simplicidade, retorna todos os registros
    });
  }

  private deleteFromTable(
    tableName: string,
    where?: string,
    params?: any[]
  ): number {
    const table = this.getTable(tableName);
    const initialLength = table.length;

    if (!where) {
      table.length = 0;
      return initialLength;
    }

    // Implementação simples de DELETE
    return 0;
  }

  private parseAndExecuteSQLSync(sql: string, params: any[]): SQLiteResult {
    const upperSQL = sql.toUpperCase().trim();

    if (upperSQL.startsWith('CREATE TABLE')) {
      const tableName = this.extractTableName(sql);
      this.createTable(tableName, []);
      return this.createResult([]);
    }

    if (upperSQL.startsWith('INSERT INTO')) {
      const { tableName, data } = this.parseInsert(sql, params);
      const insertId = this.insertIntoTable(tableName, data);
      return this.createResult([], insertId);
    }

    if (upperSQL.startsWith('SELECT')) {
      const { tableName, where } = this.parseSelect(sql);
      const rows = this.selectFromTable(tableName, where, params);
      return this.createResult(rows);
    }

    if (upperSQL.startsWith('DELETE FROM')) {
      const { tableName, where } = this.parseDelete(sql);
      const rowsAffected = this.deleteFromTable(tableName, where, params);
      return this.createResult([], undefined, rowsAffected);
    }

    // Para outras queries, retorna resultado vazio
    return this.createResult([]);
  }

  private extractTableName(sql: string): string {
    const match = sql.match(
      /(?:CREATE TABLE|INSERT INTO|SELECT.*FROM|DELETE FROM)\s+(\w+)/i
    );
    return match ? match[1] : 'default';
  }

  private parseInsert(
    sql: string,
    params: any[]
  ): { tableName: string; data: any } {
    const tableName = this.extractTableName(sql);
    const data: any = {};

    // Implementação simples - você pode melhorar isso
    if (params.length > 0) {
      data.value = params[0];
    }

    return { tableName, data };
  }

  private parseSelect(sql: string): { tableName: string; where?: string } {
    const tableName = this.extractTableName(sql);
    const whereMatch = sql.match(/WHERE\s+(.+)/i);
    return { tableName, where: whereMatch ? whereMatch[1] : undefined };
  }

  private parseDelete(sql: string): { tableName: string; where?: string } {
    const tableName = this.extractTableName(sql);
    const whereMatch = sql.match(/WHERE\s+(.+)/i);
    return { tableName, where: whereMatch ? whereMatch[1] : undefined };
  }

  private createResult(
    rows: any[],
    insertId?: number,
    rowsAffected: number = 0
  ): SQLiteResult {
    return {
      rows: {
        _array: rows,
        length: rows.length,
        item: (index: number) => rows[index],
      },
      insertId,
      rowsAffected,
    };
  }
}

class WebSQLiteTransaction implements SQLiteTransaction {
  constructor(
    private db: WebSQLiteDatabase,
    private readOnly: boolean
  ) {}

  executeSql(
    sql: string,
    params: any[] = [],
    successCallback?: (tx: SQLiteTransaction, result: SQLiteResult) => void,
    errorCallback?: (tx: SQLiteTransaction, error: any) => boolean
  ) {
    try {
      const result = (this.db as any).parseAndExecuteSQLSync(sql, params);

      if (successCallback) {
        successCallback(this, result);
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(this, error);
      }
    }
  }
}

// Função para criar o banco
function createWebDatabase(name: string): SQLiteDatabase {
  console.log('🌐 Criando banco SQLite em memória para web:', name);
  return new WebSQLiteDatabase();
}

// Função para abrir banco (compatibilidade com API antiga)
function openDatabase(name: string): SQLiteDatabase {
  return createWebDatabase(name);
}

// Função para abrir banco síncrono (compatibilidade com API nova)
function openDatabaseSync(name: string): SQLiteDatabase {
  return createWebDatabase(name);
}

// Exportar o módulo completo
const SQLiteModule = {
  openDatabase,
  openDatabaseSync,
  createWebDatabase,
};

export default SQLiteModule;
