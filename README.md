# INpunto MVP - Sistema de Logs Centralizado

MVP de aplicativo mobile **Expo** com arquitetura limpa e sistema de logs centralizado persistido localmente.

## 🚀 Características

- **Expo SDK 53** com TypeScript 5.x
- **Arquitetura limpa** em camadas (Domain, Data, Presentation)
- **Sistema de logs centralizado** com persistência SQLite (Expo)
- **Patch automático do console** (console.log → logger)
- **UI moderna** com tema consistente
- **Navegação** entre Splash → Login → Home → Logs
- **Filtros e exportação** de logs (JSON/CSV)
- **Testes unitários** com Jest e Testing Library
- **Qualidade de código** com ESLint, Prettier e Husky

## 📱 Stack Tecnológica

- **Expo**: SDK 53 (versão mais recente e estável)
- **React Native**: 0.79.5
- **TypeScript**: 5.x com configuração estrita
- **Navegação**: @react-navigation/native + stack
- **Banco de Dados**: expo-sqlite
- **Estado**: Context API + useReducer
- **Testes**: Jest + @testing-library/react-native
- **Qualidade**: ESLint + Prettier + Husky

## 🏗️ Arquitetura Implementada

### Estrutura de Camadas (Clean Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Screens │ Components │ Navigation │ Theme                 │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Entities │ Use Cases │ Business Rules                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Repositories │ Storage │ External APIs │ BLE Services     │
└─────────────────────────────────────────────────────────────┘
```

### Organização de Pastas

```
src/
├── app/                    # Aplicação principal
├── domain/                 # Regras de negócio
│   ├── entities/          # Entidades do domínio
│   └── use-cases/         # Casos de uso
├── data/                   # Dados e infraestrutura
│   ├── repositories/      # Repositórios de dados
│   └── storage/           # Persistência local (Expo SQLite)
├── presentation/           # Interface do usuário
│   ├── components/        # Componentes reutilizáveis
│   ├── navigation/        # Configuração de navegação
│   ├── screens/           # Telas da aplicação
│   └── theme/             # Sistema de design
├── services/               # Serviços da aplicação
│   └── logging/           # Sistema de logs
├── hooks/                  # Hooks customizados
└── utils/                  # Utilitários
```

## 📊 Sistema de Logs Centralizado

### Arquitetura do Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Console API   │───▶│  Logger Service │───▶│ Expo SQLite     │
│   (Patched)     │    │                 │    │ Storage         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Console Logs   │    │  Log Entries    │    │  Database       │
│  (Original)     │    │  (Structured)   │    │  (Persistent)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Componentes Principais

#### 1. LoggerService (`src/services/logging/logger.ts`)

- **Responsabilidades**:
  - Gerenciar níveis de log (debug, info, warn, error)
  - Manter contexto global (sessionId, userId, deviceId)
  - Interface para consultas e exportação
  - Manutenção automática (limpeza de logs antigos)

#### 2. ConsolePatch (`src/services/logging/consolePatch.ts`)

- **Funcionalidades**:
  - Intercepta todas as chamadas `console.*`
  - Redireciona para o logger centralizado
  - Mantém funcionalidade original do console
  - Permite restauração se necessário

#### 3. SQLiteRepository (`src/data/storage/sqlite.ts`)

- **Características**:
  - Tabela `logs` com índices otimizados
  - Suporte a metadados JSON
  - Consultas com filtros múltiplos
  - Limpeza automática de logs antigos

## 🎨 Sistema de Design

### Tema Consistente

#### Cores (`src/presentation/theme/colors.ts`)

```typescript
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
};
```

#### Espaçamento (`src/presentation/theme/spacing.ts`)

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

## 🧪 Sistema de Testes

### Configuração Jest

#### `jest.config.js`

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|@expo|victory-native)',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
```

### Estrutura de Testes

```
tests/
├── services/
│   └── logging/
│       └── logger.test.ts      # Testes do LoggerService
├── presentation/
│   └── screens/
│       └── LogsScreen.test.ts  # Testes das telas
└── setup.ts                     # Configuração global
```

## 🔒 Qualidade e Padrões

### ESLint + Prettier

#### Configuração ESLint

- Regras estritas para Expo/React Native
- Integração com TypeScript
- Plugins para React e React Hooks
- Configuração compartilhada com Prettier

#### Configuração Prettier

- Formatação automática de código
- Regras consistentes para todo o projeto
- Integração com ESLint para evitar conflitos

### Husky + lint-staged

#### Git Hooks

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

#### Pre-commit

- Execução automática de linting
- Formatação automática de código
- Verificação de tipos TypeScript
- Execução de testes básicos

## 🚀 Scripts e Comandos

### Desenvolvimento

```bash
# Iniciar Expo
yarn start

# Executar no Android
yarn android

# Executar no iOS
yarn ios

# Executar na Web
yarn web
```

## 📱 Como Executar o Projeto

### Pré-requisitos para Desenvolvimento

#### 1. **Node.js e Yarn**

- **Node.js**: Versão 18.x ou superior
- **Yarn**: Versão 1.22.x ou superior
- **npm**: Alternativa ao Yarn (versão 9.x ou superior)

#### 2. **Expo CLI**

```bash
# Instalar Expo CLI globalmente
npm install -g @expo/cli
# ou
yarn global add @expo/cli

# Verificar versão
expo --version
```

#### 3. **Android Studio e SDK** (para desenvolvimento Android)

- **Android Studio**: Versão mais recente
- **Android SDK**: API Level 33 (Android 13) ou superior
- **Android SDK Platform-Tools**
- **Android Emulator** ou **Dispositivo físico**

### 🚀 Executando no Dispositivo Android

#### Opção 1: Expo Go App (Mais Simples)

1. **Instalar Expo Go** no seu dispositivo Android
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [APK direto](https://expo.dev/tools#client)

2. **Conectar dispositivo e computador na mesma rede Wi-Fi**

3. **Executar o projeto**:

   ```bash
   # Na pasta do projeto
   cd inpunto

   # Instalar dependências
   yarn install

   # Iniciar o servidor Expo
   yarn start
   ```

4. **Escaneie o QR Code** com o app Expo Go

#### Opção 2: Build Nativo (Para Produção)

1. **Configurar variáveis de ambiente**:

   ```bash
   # Criar arquivo .env na raiz do projeto
   EXPO_PUBLIC_API_URL=sua_api_url
   ```

2. **Build para Android**:

   ```bash
   # Build de desenvolvimento
   expo run:android

   # Build de produção
   expo build:android
   ```

3. **Instalar APK** no dispositivo Android

### 🔧 Configuração do Ambiente Android

#### 1. **Variáveis de Ambiente**

```bash
# Windows (PowerShell)
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"

# Linux/macOS
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 2. **Configuração do Android Studio**

- Abrir **Android Studio**
- Ir em **Tools > SDK Manager**
- Instalar:
  - **Android SDK Platform 33** (ou superior)
  - **Android SDK Build-Tools**
  - **Android SDK Platform-Tools**
  - **Android Emulator**

#### 3. **Configuração do Dispositivo Android**

- Ativar **Modo desenvolvedor**:
  - Configurações > Sobre o telefone > Toque 7x no "Número da versão"
- Ativar **Depuração USB**:
  - Configurações > Opções do desenvolvedor > Depuração USB
- Ativar **Instalar via USB**:
  - Configurações > Opções do desenvolvedor > Instalar via USB

### 📱 Testando no Dispositivo

#### 1. **Via USB (Recomendado para desenvolvimento)**

```bash
# Conectar dispositivo via USB
# Verificar se está sendo reconhecido
adb devices

# Executar projeto
yarn android
```

#### 2. **Via Wi-Fi (Para testes rápidos)**

```bash
# Iniciar servidor Expo
yarn start

# Escanear QR Code com Expo Go
# Ou digitar URL manualmente no app
```

### 🚨 Solução de Problemas Comuns

#### 1. **Erro "Metro bundler not found"**

```bash
# Limpar cache do Metro
npx expo start --clear

# Ou reinstalar dependências
rm -rf node_modules
yarn install
```

#### 2. **Dispositivo não reconhecido**

```bash
# Verificar drivers USB
# Reinstalar Android USB Driver
# Verificar cabo USB (alguns só carregam, não transferem dados)
```

#### 3. **Erro de build Android**

```bash
# Limpar cache do Gradle
cd android
./gradlew clean
cd ..

# Rebuild
expo run:android
```

#### 4. **Problemas de rede**

- Verificar firewall
- Desativar VPN temporariamente
- Usar rede 2.4GHz em vez de 5GHz
- Verificar se computador e dispositivo estão na mesma rede

### 📋 Checklist de Configuração

- [ ] Node.js 18+ instalado
- [ ] Yarn instalado
- [ ] Expo CLI instalado
- [ ] Android Studio configurado
- [ ] Android SDK instalado
- [ ] Dispositivo Android configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Projeto executando sem erros
- [ ] Dispositivo conectado e reconhecido
- [ ] App funcionando no dispositivo

### Qualidade

```bash
# Verificar código
yarn lint

# Corrigir problemas automaticamente
yarn lint:fix

# Formatar código
yarn format

# Verificar tipos
yarn typecheck
```

### Testes

```bash
# Executar todos os testes
yarn test

# Testes em modo watch
yarn test:watch

# Testes com coverage
yarn test --coverage
```

## 📱 Funcionalidades MVP

### ✅ Implementado

- [x] **Arquitetura limpa** com separação de camadas
- [x] **Sistema de logs centralizado** com Expo SQLite
- [x] **Patch automático do console** para interceptação
- [x] **UI básica** com tema consistente
- [x] **Navegação** entre todas as telas
- [x] **Filtros e exportação** de logs
- [x] **Testes unitários** com Jest
- [x] **Configuração de qualidade** (ESLint, Prettier, Husky)
- [x] **TypeScript estrito** com path mapping
- [x] **Estrutura escalável** para futuras funcionalidades

### 🚧 Próximas Implementações

- [ ] **Integração BLE** com dispositivos
- [ ] **Sistema de testes de hardware** automatizados
- [ ] **Gráficos e visualizações** com Victory Native
- [ ] **Reconhecimento de voz** para comandos
- [ ] **Autenticação real** com backend
- [ ] **Sincronização** de logs com servidor
- [ ] **Notificações push** para alertas
- [ ] **Modo offline** com sincronização posterior

## 🔮 Roadmap Técnico

### Fase 1: Fundação (✅ Concluído)

- Arquitetura limpa implementada
- Sistema de logs funcionando
- Testes básicos configurados
- Qualidade de código estabelecida

### Fase 2: Funcionalidades Core (🔄 Em desenvolvimento)

- Integração BLE completa
- Sistema de testes de hardware
- Gráficos e visualizações
- Reconhecimento de voz

### Fase 3: Integração (📋 Planejado)

- Backend e autenticação
- Sincronização de dados
- Notificações e alertas
- Analytics e métricas

### Fase 4: Produção (📋 Planejado)

- Deploy em stores
- Monitoramento e observabilidade
- Performance e otimizações
- Escalabilidade

## 🤝 Contribuição e Desenvolvimento

### Padrões de Commit

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: adicionar funcionalidade de exportação CSV
fix: corrigir bug na paginação de logs
docs: atualizar README com novos scripts
style: ajustar espaçamento dos componentes
refactor: reorganizar estrutura de pastas
test: adicionar testes para LogsScreen
chore: atualizar dependências
```

### Workflow de Desenvolvimento

1. **Criar branch** para nova funcionalidade

   ```bash
   git checkout -b feat/nova-funcionalidade
   ```

2. **Desenvolver** seguindo padrões estabelecidos
   - Usar TypeScript strict mode
   - Seguir arquitetura limpa
   - Implementar testes unitários
   - Documentar mudanças

3. **Commit** seguindo convenção

   ```bash
   git commit -m "feat: implementar sistema de filtros avançados"
   ```

4. **Push e Pull Request**
   - Criar PR com descrição detalhada
   - Revisão de código obrigatória
   - Testes passando obrigatórios

## 📚 Recursos e Referências

### Documentação Oficial

- [Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### Ferramentas e Bibliotecas

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)

### Padrões e Convenções

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Expo Best Practices](https://docs.expo.dev/guides/best-practices/)
- [React Native Best Practices](https://reactnative.dev/docs/performance)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

## 🆘 Suporte e Manutenção

### Problemas Comuns

#### 1. Erros de TypeScript

- Verificar configuração em `tsconfig.json`
- Executar `yarn typecheck` para identificar problemas
- Verificar imports e path mapping

#### 2. Problemas de ESLint

- Executar `yarn lint:fix` para correção automática
- Verificar regras em `.eslintrc.js`
- Consultar documentação das regras

#### 3. Testes falhando

- Verificar mocks e configuração em `tests/setup.ts`
- Executar `yarn test --verbose` para detalhes
- Verificar dependências e versões

### Contatos

- **Equipe de Desenvolvimento**: dev@inpunto.com
- **Tech Lead**: techlead@inpunto.com
- **Documentação**: docs@inpunto.com

---

## 📄 Resumo Executivo

O projeto **INpunto MVP** estabeleceu com sucesso uma **fundação técnica sólida** baseada em **Expo** com:

1. **Arquitetura limpa** com separação clara de responsabilidades
2. **Sistema de logs robusto** com persistência Expo SQLite e interceptação automática
3. **Padrões de qualidade** com ESLint, Prettier e Husky
4. **Estrutura de testes** com Jest e Testing Library
5. **TypeScript estrito** com configuração otimizada
6. **UI/UX consistente** com sistema de design padronizado

Esta base permite o desenvolvimento **rápido e seguro** de novas funcionalidades, mantendo a **qualidade e manutenibilidade** do código. O sistema está preparado para escalar e integrar com funcionalidades avançadas como BLE, reconhecimento de voz e sincronização com backend.

**Status**: ✅ MVP - Fundação Concluída  
**Próximo Milestone**: 🚧 Funcionalidades Core  
**Data de Criação**: Agosto 2025  
**Versão**: 1.0.0
"# lampweb2" 
