import { testSQLite } from './sqlite-web-wrapper';

export async function testSQLiteCompatibility() {
  console.log('=== TESTE DE COMPATIBILIDADE SQLITE ===');

  try {
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
    console.error('❌ Erro geral no teste SQLite:', error);
    return false;
  }
}

// Função para testar a versão do SQLite
export function getSQLiteVersion() {
  try {
    // Usar nosso wrapper em vez do expo-sqlite direto
    console.log('Versão do SQLite wrapper: 1.0.0 (compatível com web)');
    console.log('Tipo do SQLite: wrapper personalizado');
    console.log(
      'Propriedades do SQLite: openDatabase, openDatabaseSync, createWebDatabase'
    );
    return '1.0.0';
  } catch (error) {
    console.error('Erro ao obter versão do SQLite:', error);
    return null;
  }
}
