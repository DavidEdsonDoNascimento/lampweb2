import { LogEntry, LogsRepository } from '@services/logging/types';
import { memoryLogsRepository } from './memory';
import { getDB, testSQLite } from './sqlite-web-wrapper';

class SQLiteLogsRepository implements LogsRepository {
  private db: any = null;
  private fallbackToMemory = true;
  private isInitialized = false;

  constructor() {
    this.initializeDB();
  }

  private async initializeDB() {
    try {
      const testResult = await testSQLite();
      if (testResult.success) {
        this.db = await getDB();
        this.fallbackToMemory = false;
        this.isInitialized = true;
        console.log(
          '✅ SQLite inicializado com sucesso na plataforma:',
          testResult.platform
        );

        // Criar tabela de logs se não existir
        await this.createLogsTable();
      } else {
        console.warn(
          '⚠️ SQLite falhou, usando fallback em memória:',
          testResult.error
        );
        this.fallbackToMemory = true;
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar SQLite:', error);
      this.fallbackToMemory = true;
    }
  }

  private async createLogsTable() {
    if (!this.db || this.fallbackToMemory) return;

    try {
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          level TEXT NOT NULL,
          message TEXT NOT NULL,
          data TEXT,
          tag TEXT,
          timestamp INTEGER NOT NULL,
          session_id TEXT,
          user_id TEXT
        )
      `);
    } catch (error) {
      console.error('Erro ao criar tabela de logs:', error);
    }
  }

  async save(log: Omit<LogEntry, 'id'>): Promise<number> {
    if (this.fallbackToMemory || !this.db) {
      return memoryLogsRepository.save(log);
    }

    try {
      await this.db.exec(
        'INSERT INTO logs (level, message, data, tag, timestamp, session_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          log.level,
          log.message,
          JSON.stringify(log.data || {}),
          log.tag || '',
          log.timestamp,
          log.sessionId || '',
          log.userId || '',
        ]
      );

      // Buscar o ID do último registro inserido
      const result = await this.db.query('SELECT last_insert_rowid() as id');
      return result[0]?.id || 0;
    } catch (error) {
      console.error('Erro ao salvar log no SQLite:', error);
      return memoryLogsRepository.save(log);
    }
  }

  async findById(id: number): Promise<LogEntry | null> {
    if (this.fallbackToMemory || !this.db) {
      return memoryLogsRepository.findById(id);
    }

    try {
      const result = await this.db.query('SELECT * FROM logs WHERE id = ?', [
        id,
      ]);
      if (result.length === 0) return null;

      const row = result[0];
      return {
        id: row.id,
        level: row.level,
        message: row.message,
        data: row.data ? JSON.parse(row.data) : {},
        tag: row.tag,
        timestamp: row.timestamp,
        sessionId: row.session_id,
        userId: row.user_id,
      };
    } catch (error) {
      console.error('Erro ao buscar log por ID:', error);
      return memoryLogsRepository.findById(id);
    }
  }

  async query(opts?: {
    level?: string[];
    tag?: string;
    from?: number;
    to?: number;
    limit?: number;
    offset?: number;
  }): Promise<LogEntry[]> {
    if (this.fallbackToMemory || !this.db) {
      return memoryLogsRepository.query(opts);
    }

    try {
      let sql = 'SELECT * FROM logs WHERE 1=1';
      const params: any[] = [];

      if (opts?.level && opts.level.length > 0) {
        const placeholders = opts.level.map(() => '?').join(',');
        sql += ` AND level IN (${placeholders})`;
        params.push(...opts.level);
      }

      if (opts?.tag) {
        sql += ' AND tag = ?';
        params.push(opts.tag);
      }

      if (opts?.from) {
        sql += ' AND timestamp >= ?';
        params.push(opts.from);
      }

      if (opts?.to) {
        sql += ' AND timestamp <= ?';
        params.push(opts.to);
      }

      sql += ' ORDER BY timestamp DESC';

      if (opts?.limit) {
        sql += ' LIMIT ?';
        params.push(opts.limit);
      }

      if (opts?.offset) {
        sql += ' OFFSET ?';
        params.push(opts.offset);
      }

      const result = await this.db.query(sql, params);
      return result.map((row: any) => ({
        id: row.id,
        level: row.level,
        message: row.message,
        data: row.data ? JSON.parse(row.data) : {},
        tag: row.tag,
        timestamp: row.timestamp,
        sessionId: row.session_id,
        userId: row.user_id,
      }));
    } catch (error) {
      console.error('Erro ao consultar logs:', error);
      return memoryLogsRepository.query(opts);
    }
  }

  async clear(): Promise<void> {
    if (this.fallbackToMemory || !this.db) {
      return memoryLogsRepository.clear();
    }

    try {
      await this.db.exec('DELETE FROM logs');
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
      return memoryLogsRepository.clear();
    }
  }

  async deleteOldLogs(beforeTimestamp: number): Promise<number> {
    if (this.fallbackToMemory || !this.db) {
      return memoryLogsRepository.deleteOldLogs(beforeTimestamp);
    }

    try {
      await this.db.exec('DELETE FROM logs WHERE timestamp < ?', [
        beforeTimestamp,
      ]);
      const result = await this.db.query('SELECT changes() as count');
      return result[0]?.count || 0;
    } catch (error) {
      console.error('Erro ao deletar logs antigos:', error);
      return memoryLogsRepository.deleteOldLogs(beforeTimestamp);
    }
  }

  async getCount(): Promise<number> {
    if (this.fallbackToMemory || !this.db) {
      return memoryLogsRepository.getCount();
    }

    try {
      const result = await this.db.query('SELECT COUNT(*) as count FROM logs');
      return result[0]?.count || 0;
    } catch (error) {
      console.error('Erro ao contar logs:', error);
      return memoryLogsRepository.getCount();
    }
  }
}

export const sqliteLogsRepository = new SQLiteLogsRepository();
