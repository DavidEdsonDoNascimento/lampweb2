# Solução: SQLite no Expo Web

## Problema

Ao tentar exportar o projeto LampInpunt para web com `npx expo export --platform web`, ocorria o seguinte erro:

```
Error: Unable to resolve module ./wa-sqlite/wa-sqlite.wasm from C:\Users\david\projetos\INpunto\MVP\LampInpunt\node_modules\expo-sqlite\web\worker.ts
```

O problema ocorre porque o `expo-sqlite` depende de um arquivo WASM (WebAssembly) que não está incluído no pacote e não funciona corretamente na web.

## Solução Implementada

### 1. Wrapper SQLite Compatível com Web

Criamos um wrapper (`sqlite-web-wrapper.ts`) que detecta a plataforma e usa:

- **SQLite nativo** para iOS/Android (usando a API do expo-sqlite)
- **Implementação em memória** para web (fallback)

### 2. Arquivos Criados

#### a) `src/data/storage/sqlite-web-wrapper.ts`

- Função `getDB()`: Retorna o banco de dados apropriado para a plataforma
- Função `testSQLite()`: Testa se o SQLite está funcionando
- Suporte para ambas as APIs do expo-sqlite (antiga e nova)

#### b) `src/data/storage/expo-sqlite-web.ts`

- Implementação completa do SQLite em memória para web
- Compatível com a API do expo-sqlite

#### c) `src/data/storage/sqlite-web-polyfill.ts`

- Polyfill para interceptar o expo-sqlite na web

### 3. Modificações no Metro Config

Atualizamos o `metro.config.js` para substituir o expo-sqlite na web:

```javascript
config.resolver.alias = {
  ...config.resolver.alias,
  'expo-sqlite': path.resolve(__dirname, 'src/data/storage/expo-sqlite-web.ts'),
  'expo-sqlite/web': path.resolve(
    __dirname,
    'src/data/storage/expo-sqlite-web.ts'
  ),
  'expo-sqlite/web/worker': path.resolve(
    __dirname,
    'src/data/storage/worker.ts'
  ),
  'expo-sqlite/web/wa-sqlite/wa-sqlite': path.resolve(
    __dirname,
    'src/data/storage/wa-sqlite.ts'
  ),
  'expo-sqlite/web/wa-sqlite/wa-sqlite.wasm': path.resolve(
    __dirname,
    'src/data/storage/wa-sqlite-wasm.js'
  ),
};
```

### 4. Substituição Temporária do Worker

Como última solução, substituímos temporariamente o arquivo `node_modules/expo-sqlite/web/worker.ts` por uma implementação vazia para evitar o erro de importação do WASM.

**IMPORTANTE**: Esta modificação em `node_modules` será perdida após `npm install` ou `yarn install`. Para manter a solução, você precisa:

1. Criar um script que substitua o arquivo após a instalação
2. Ou adicionar esta modificação no `postinstall` do package.json

### 5. Repositórios Atualizados

#### a) `src/data/storage/sqlite.ts`

- Agora usa o wrapper `sqlite-web-wrapper.ts`
- Fallback automático para memória se SQLite falhar
- Funciona em todas as plataformas (iOS, Android, Web)

#### b) `src/data/storage/hybrid-repository.ts`

- Usa o SQLite como repositório principal
- Fallback automático para memória

### 6. Testes Atualizados

#### a) `src/data/storage/test-sqlite.ts`

- Usa o novo wrapper em vez do expo-sqlite direto

#### b) `src/data/storage/sqlite-test.ts`

- Usa o novo wrapper em vez do expo-sqlite direto

## Como Usar

### Desenvolvimento

```bash
# Iniciar em desenvolvimento
cd LampInpunt
npx expo start

# Web
npx expo start --web

# iOS
npx expo start --ios

# Android
npx expo start --android
```

### Build para Produção

```bash
# Exportar para web
cd LampInpunt
npx expo export --platform web

# A pasta dist será criada com o build pronto para deploy
```

### Deploy na Vercel

1. Faça login na Vercel: https://vercel.com
2. Crie um novo projeto
3. Conecte ao repositório Git ou faça upload manual da pasta `dist`
4. Configure o projeto:
   - Framework Preset: Other
   - Root Directory: dist
   - Build Command: (deixe vazio, já está buildado)
   - Output Directory: . (ponto)
5. Deploy!

## Alternativas para Persistência na Web

A solução atual usa memória para web, o que significa que os dados são perdidos ao recarregar a página. Para persistência na web, considere:

### 1. IndexedDB

- API nativa do navegador para armazenamento local
- Suporta grandes volumes de dados
- Assíncrona
- Biblioteca recomendada: `idb` ou `dexie`

### 2. LocalStorage

- API simples do navegador
- Limite de ~5-10MB
- Síncrona
- Boa para dados pequenos

### 3. Backend REST API

- Armazenamento no servidor
- Sincronização entre dispositivos
- Requer backend

### 4. Firebase/Supabase

- Backend as a Service
- Sincronização em tempo real
- Fácil de implementar

## Manutenção

### Após npm install / yarn install

Após reinstalar as dependências, você precisa substituir novamente o arquivo worker.ts:

```bash
# Criar um script post-install
# Adicione no package.json:
{
  "scripts": {
    "postinstall": "node scripts/fix-expo-sqlite.js"
  }
}
```

Crie o arquivo `scripts/fix-expo-sqlite.js`:

```javascript
const fs = require('fs');
const path = require('path');

const workerPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-sqlite',
  'web',
  'worker.ts'
);
const workerContent = `// Substituição temporária do worker.ts do expo-sqlite para web
// Este arquivo substitui o worker.ts problemático para evitar erros de importação do WASM

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
export const SQLiteWorkerMessageType = {};`;

try {
  fs.writeFileSync(workerPath, workerContent, 'utf8');
  console.log('✅ worker.ts do expo-sqlite substituído com sucesso!');
} catch (error) {
  console.error('❌ Erro ao substituir worker.ts:', error);
}
```

## Conclusão

A solução implementada permite que o projeto LampInpunt seja exportado para web sem erros, usando:

- SQLite nativo para iOS/Android
- Fallback em memória para web
- Compatibilidade com ambas as APIs do expo-sqlite

Para produção, considere implementar uma das alternativas de persistência mencionadas acima para garantir que os dados não sejam perdidos ao recarregar a página na web.
