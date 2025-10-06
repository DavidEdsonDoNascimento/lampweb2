# 📱 AppHeader - Componente Reutilizável

## Visão Geral

O `AppHeader` é um componente reutilizável que fornece um cabeçalho padronizado para as telas da aplicação, incluindo botões de navegação (Voltar, Home, Histórico).

## Características

- ✅ **Reutilizável** - Pode ser usado em qualquer tela
- ✅ **Flexível** - Permite mostrar/ocultar botões conforme necessário
- ✅ **Consistente** - Mantém o mesmo visual em todas as telas
- ✅ **Acessível** - Inclui labels de acessibilidade
- ✅ **Customizável** - Permite personalizar texto do botão voltar

## Uso Básico

```tsx
import { AppHeader } from '@presentation/components';

// Uso simples com todos os botões
<AppHeader
  onBack={() => navigation.goBack()}
  onGoHome={() => navigation.navigate('Home')}
  onOpenHistory={() => navigation.navigate('History')}
/>;
```

## Props

| Prop                | Tipo         | Padrão     | Descrição                                   |
| ------------------- | ------------ | ---------- | ------------------------------------------- |
| `onBack`            | `() => void` | -          | Função chamada ao clicar no botão voltar    |
| `onGoHome`          | `() => void` | -          | Função chamada ao clicar no botão home      |
| `onOpenHistory`     | `() => void` | -          | Função chamada ao clicar no botão histórico |
| `showBackButton`    | `boolean`    | `true`     | Se deve mostrar o botão voltar              |
| `showHomeButton`    | `boolean`    | `true`     | Se deve mostrar o botão home                |
| `showHistoryButton` | `boolean`    | `true`     | Se deve mostrar o botão histórico           |
| `backButtonText`    | `string`     | `'Voltar'` | Texto do botão voltar                       |

## Exemplos de Uso

### 1. Cabeçalho Completo

```tsx
<AppHeader
  onBack={() => navigation.goBack()}
  onGoHome={() => navigation.navigate('Home')}
  onOpenHistory={() => navigation.navigate('History')}
/>
```

### 2. Apenas Botão Voltar

```tsx
<AppHeader
  onBack={() => navigation.goBack()}
  showHomeButton={false}
  showHistoryButton={false}
/>
```

### 3. Botão Voltar Customizado

```tsx
<AppHeader
  onBack={() => navigation.goBack()}
  backButtonText="Retornar"
  showHomeButton={false}
  showHistoryButton={false}
/>
```

### 4. Apenas Botões da Direita

```tsx
<AppHeader
  onGoHome={() => navigation.navigate('Home')}
  onOpenHistory={() => navigation.navigate('History')}
  showBackButton={false}
/>
```

## Estilos

O componente usa as seguintes cores padrão:

- **GOLD**: `#b8860b` - Cor principal dos ícones e texto
- **GOLD_BG**: `#fcf5e6` - Cor de fundo dos botões

## Integração com BottomBar

O `AppHeader` funciona perfeitamente com o componente `BottomBar` para criar uma interface consistente:

```tsx
<SafeAreaView style={styles.container}>
  <AppHeader
    onBack={() => navigation.goBack()}
    onGoHome={() => navigation.navigate('Home')}
    onOpenHistory={() => navigation.navigate('History')}
  />

  {/* Conteúdo da tela */}
  <View style={styles.content}>{/* ... */}</View>

  {/* Barra dourada fixa */}
  <BottomBar fixed={true} />
</SafeAreaView>
```

## Localização

- **Arquivo**: `src/presentation/components/AppHeader.tsx`
- **Exportação**: `src/presentation/components/index.ts`

## Telas que Usam

- ✅ `AvailableTests` - Implementado
- 🔄 Futuras telas podem usar facilmente

## Dicas de Uso

1. **Sempre passe as funções necessárias** - O componente só renderiza botões quando as funções são fornecidas
2. **Use props condicionais** - Para telas que não precisam de todos os botões
3. **Mantenha consistência** - Use o mesmo padrão em todas as telas
4. **Teste acessibilidade** - O componente inclui labels de acessibilidade

---

**💡 Lembre-se:** Este componente foi criado para facilitar o desenvolvimento de novas telas e manter consistência visual em toda a aplicação.
