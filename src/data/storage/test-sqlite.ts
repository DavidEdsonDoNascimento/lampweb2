import { getDB, testSQLite } from './sqlite-web-wrapper';

export async function testSQLiteInitialization() {
  try {
    console.log('Testando inicialização do SQLite...');

    // Usar nosso wrapper que funciona em todas as plataformas
    const result = await testSQLite();

    if (result.success) {
      console.log('✅ SQLite funcionando na plataforma:', result.platform);
      return true;
    } else {
      console.error('❌ SQLite falhou:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Erro ao testar SQLite:', error);
    return false;
  }
}
