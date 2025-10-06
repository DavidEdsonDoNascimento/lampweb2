import { LogEntry, LogsRepository } from '@services/logging/types';
import { memoryLogsRepository } from './memory';
import { sqliteLogsRepository } from './sqlite';

class HybridLogsRepository implements LogsRepository {
  private repository: LogsRepository;

  constructor() {
    // Usar SQLite como principal, com fallback para memória
    this.repository = sqliteLogsRepository;
    console.log('🔄 Usando repositório híbrido (SQLite + fallback memória)');
  }

  async save(log: Omit<LogEntry, 'id'>): Promise<number> {
    return this.repository.save(log);
  }

  async findById(id: number): Promise<LogEntry | null> {
    return this.repository.findById(id);
  }

  async query(opts?: {
    level?: string[];
    tag?: string;
    from?: number;
    to?: number;
    limit?: number;
    offset?: number;
  }): Promise<LogEntry[]> {
    return this.repository.query(opts as any);
  }

  async clear(): Promise<void> {
    return this.repository.clear();
  }

  async deleteOldLogs(beforeTimestamp: number): Promise<number> {
    return this.repository.deleteOldLogs(beforeTimestamp);
  }

  async getCount(): Promise<number> {
    return this.repository.getCount();
  }

  // Método para verificar qual repositório está sendo usado
  getCurrentRepositoryType(): string {
    return 'Hybrid (SQLite + Memory Fallback)';
  }

  // Método para verificar se SQLite está realmente funcionando
  async testSQLiteFunctionality(): Promise<boolean> {
    try {
      // Testar se o SQLite está funcionando
      const count = await this.repository.getCount();
      console.log('✅ SQLite funcionando, total de logs:', count);
      return true;
    } catch (error) {
      console.log('⚠️ SQLite com problemas, usando fallback:', error);
      return false;
    }
  }
}

export const hybridLogsRepository = new HybridLogsRepository();
