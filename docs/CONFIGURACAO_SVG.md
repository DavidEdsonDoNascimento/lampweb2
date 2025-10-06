# 🎨 Configuração de SVG - INpunto MVP

**Data**: Janeiro 2025  
**Versão**: 1.0.0  
**Status**: ✅ Implementado e Funcionando  
**Responsável**: Equipe de Desenvolvimento

## 📋 Resumo Executivo

Este documento descreve a implementação e configuração do suporte a arquivos SVG no projeto **INpunto MVP**, permitindo o uso de gráficos vetoriais escaláveis nas telas da aplicação.

### 🎯 Objetivos Alcançados

- ✅ **Suporte completo a SVGs** em componentes React Native
- ✅ **Importação direta** de arquivos `.svg` como componentes React
- ✅ **TypeScript support** com declarações de tipos apropriadas
- ✅ **Integração com Metro bundler** para processamento otimizado
- ✅ **Compatibilidade com Expo SDK 53**

## 🏗️ Arquitetura da Solução

### **Componentes Principais**

```
LAMP-INpunto/
├── assets/                    ← Pasta de recursos estáticos
│   ├── dna.svg               ← Ornamento decorativo
│   └── lampinpuntologo.svg   ← Logo da marca
├── metro.config.js           ← Configuração do Metro bundler
├── babel.config.js           ← Configuração do Babel
├── tsconfig.json             ← Path mapping e tipos
└── src/types/svg.d.ts        ← Declarações de tipos SVG
```

### **Fluxo de Processamento**

1. **Arquivo SVG** → `assets/`
2. **Metro bundler** → Processa via `react-native-svg-transformer`
3. **Componente React** → Importado e renderizado
4. **TypeScript** → Tipagem automática via declarações

## ⚙️ Configurações Implementadas

### **1. Metro Bundler (`metro.config.js`)**

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuração para suportar SVGs
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

// Configuração de extensões de arquivo
config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => ext !== 'svg'
);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;
```

**Propósito**: Configura o Metro para processar arquivos SVG como componentes React.

### **2. Babel (`babel.config.js`)**

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

**Propósito**: Configuração simplificada do Babel (sem plugins desnecessários).

### **3. TypeScript (`tsconfig.json`)**

```json
{
  "compilerOptions": {
    "paths": {
      "@assets/*": ["assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "src/types/*.d.ts"]
}
```

**Propósito**: Path mapping para importações de assets e inclusão de tipos SVG.

### **4. Declarações de Tipos (`src/types/svg.d.ts`)**

```typescript
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
```

**Propósito**: Permite importar SVGs como componentes React tipados.

## 📦 Dependências Utilizadas

### **Produção**

- `react-native-svg@15.11.2` - Renderização de SVGs no React Native

### **Desenvolvimento**

- `react-native-svg-transformer@1.5.1` - Transformação de SVGs para componentes

## 🚀 Como Usar

### **Importação de SVGs**

```typescript
// ✅ Importação direta como componente
import Dna from '@assets/dna.svg';
import Logo from '@assets/lampinpuntologo.svg';

// ✅ Uso em JSX
<Dna width={200} height={100} />
<Logo width={150} height={150} />
```

### **Props Disponíveis**

```typescript
interface SvgProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  // ... todas as props padrão de SVG
}
```

## 🔧 Implementação no LoginScreenWip

### **Arquivo**: `src/presentation/screens/LoginScreenWip.tsx`

```typescript
// ✅ IMPORTS dos SVGs
import Dna from '@assets/dna.svg';
import Logo from '@assets/lampinpuntologo.svg';

// ✅ Uso no header
<View style={styles.header}>
  <View style={styles.dnaWrap} pointerEvents="none">
    <Dna
      width={width * 1.2}
      height={width * 0.45}
    />
  </View>

  <View style={styles.logoWrap}>
    <Logo width={200} height={200} />
  </View>
</View>
```

## 🐛 Troubleshooting

### **Erro**: `Cannot find module 'babel-plugin-react-native-svg-transformer'`

**Causa**: Plugin não instalado ou configuração incorreta.

**Solução**:

1. Reinstalar: `npm uninstall react-native-svg-transformer && npm install react-native-svg-transformer`
2. Limpar cache: `npx expo start --clear`
3. Verificar `metro.config.js`

### **Erro**: SVGs não renderizam

**Causa**: Configuração do Metro incorreta.

**Solução**:

1. Verificar `metro.config.js`
2. Reiniciar bundler com `--clear`
3. Verificar se arquivos SVG existem em `assets/`

### **Erro**: TypeScript não reconhece SVGs

**Causa**: Declarações de tipos ausentes.

**Solução**:

1. Verificar `src/types/svg.d.ts`
2. Verificar `tsconfig.json` inclui tipos
3. Reiniciar TypeScript server

## 📱 Compatibilidade

### **Plataformas Suportadas**

- ✅ **Android** - Suporte completo
- ✅ **iOS** - Suporte completo
- ✅ **Web** - Suporte via Expo Web

### **Versões do Expo**

- ✅ **Expo SDK 53** - Testado e funcionando
- ✅ **Expo SDK 52** - Compatível
- ✅ **Expo SDK 51** - Compatível

## 🔄 Manutenção

### **Atualizações de Dependências**

```bash
# Atualizar react-native-svg
npm update react-native-svg

# Atualizar transformer
npm update react-native-svg-transformer
```

### **Verificação de Funcionamento**

1. **Teste básico**: Importar SVG em componente
2. **Teste de props**: Alterar width/height
3. **Teste de cache**: Limpar cache do Metro
4. **Teste de build**: Verificar se compila

## 📚 Referências

- [React Native SVG Documentation](https://github.com/react-native-svg/react-native-svg)
- [SVG Transformer Documentation](https://github.com/kristerkari/react-native-svg-transformer)
- [Expo Metro Configuration](https://docs.expo.dev/guides/customizing-metro/)

## 📝 Histórico de Alterações

| Data     | Versão | Alteração                      | Responsável |
| -------- | ------ | ------------------------------ | ----------- |
| Jan 2025 | 1.0.0  | Implementação inicial          | Equipe Dev  |
| Jan 2025 | 1.0.1  | Correção de configuração Metro | Equipe Dev  |
| Jan 2025 | 1.0.2  | Adição de tipos TypeScript     | Equipe Dev  |

---

**Próxima Revisão**: Fevereiro 2025  
**Status**: ✅ Documentação Completa e Atualizada
