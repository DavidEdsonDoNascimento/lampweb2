# 🧪 Botão de Desenvolvimento - Guia Completo

## Visão Geral

O botão "Testes" na tela de login é uma ferramenta de desenvolvimento que permite acesso rápido a telas em desenvolvimento sem precisar navegar pelo fluxo normal da aplicação.

## Como Usar

### 1. Trocar o Destino do Botão

Para redirecionar o botão para uma nova tela em desenvolvimento:

1. **Abra o arquivo `src/app/App.tsx`**
2. **Localize a função `handleNavigateToAvailableTests()`** (linha ~267)
3. **Altere o estado de destino:**

```typescript
// ANTES:
setCurrentState('availabletests');

// DEPOIS:
setCurrentState('minhaNovaTela');
```

### 2. Adicionar Nova Tela ao Sistema

Se a tela ainda não existe no sistema:

1. **Adicione o estado no tipo:**

```typescript
const [currentState, setCurrentState] = useState<
  | 'splash'
  | 'login'
  | 'createaccount'
  | 'homewip'
  | 'logs'
  | 'availabletests'
  | 'minhaNovaTela'
>('splash');
```

2. **Adicione o caso no switch:**

```typescript
case 'minhaNovaTela':
  return <MinhaNovaTela />;
```

3. **Importe a nova tela:**

```typescript
import { MinhaNovaTela } from '@presentation/screens';
```

## Exemplos Práticos

### Exemplo 1: Testar uma nova tela de configurações

```typescript
const handleNavigateToAvailableTests = () => {
  setCurrentState('configuracoes');
};
```

### Exemplo 2: Testar uma nova tela de perfil

```typescript
const handleNavigateToAvailableTests = () => {
  setCurrentState('perfil');
};
```

### Exemplo 3: Voltar para AvailableTests

```typescript
const handleNavigateToAvailableTests = () => {
  setCurrentState('availabletests');
};
```

## Vantagens

- ✅ **Acesso rápido** a telas em desenvolvimento
- ✅ **Não interfere** no fluxo normal da aplicação
- ✅ **Fácil de configurar** - apenas uma linha de código
- ✅ **Logging integrado** - todas as navegações são registradas
- ✅ **Sempre disponível** na tela de login

## Localização dos Arquivos

- **Botão:** `src/presentation/screens/LoginScreenWip.tsx` (linha ~117)
- **Função de navegação:** `src/app/App.tsx` (linha ~267)
- **Renderização:** `src/app/App.tsx` (switch do renderScreen)

## Dicas

- Use nomes descritivos para os estados (ex: `'configuracoes'`, `'perfil'`, `'relatorios'`)
- Mantenha o botão sempre funcional para facilitar testes
- Use o logging para acompanhar quando o botão é usado
- Considere adicionar comentários explicativos quando trocar o destino

---

**💡 Lembre-se:** Este botão é uma ferramenta de desenvolvimento. Em produção, você pode removê-lo ou redirecioná-lo para uma tela específica de testes.
