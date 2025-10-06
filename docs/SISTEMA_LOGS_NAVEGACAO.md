# Sistema de Logs de Navegação - INpunto

## Visão Geral

O sistema de logs de navegação foi implementado para capturar automaticamente todas as ações de navegação, carregamento de telas e interações do usuário no aplicativo INpunto. Este sistema substitui os logs manuais anteriores e fornece rastreamento completo da jornada do usuário.

## Características Principais

### 1. Logs Automáticos de Navegação

- **Carregamento de Telas**: Cada tela registra automaticamente quando é carregada e descarregada
- **Transições de Estado**: Todas as mudanças de tela são registradas com contexto completo
- **Ações do Usuário**: Botões, navegações e interações são capturados automaticamente

### 2. Contexto de Sessão

- **Session ID**: Identificador único para cada sessão do aplicativo
- **Device ID**: Identificador único para cada dispositivo
- **User ID**: Identificador do usuário logado (quando aplicável)
- **Platform**: Informações sobre a plataforma (iOS/Android)

### 3. Hook Personalizado: `useNavigationLogger`

```typescript
const { logNavigation, logUserAction } = useNavigationLogger({
  screenName: 'HomeScreen',
  additionalContext: { hasUser: true },
});
```

## Implementação nas Telas

### SplashScreen

- Log automático de carregamento
- Log de finalização com duração
- Contexto de navegação para próxima tela

### LoginScreenWip

- Log de tentativas de login (telefone/Google)
- Log de sucesso/erro de autenticação
- Log de ações de registro

### HomeWip

- Log de ações de busca e compartilhamento
- Log de início de teste
- Log de navegação de volta

### LogsScreen

- Log de todas as ações administrativas
- Log de testes de SQLite e fallback
- Log de exportação e limpeza de logs

## Estrutura dos Logs

### Tags Utilizadas

- `app`: Logs do aplicativo principal
- `navigation`: Logs de navegação entre telas
- `auth`: Logs de autenticação e usuário
- `user_action`: Logs de ações do usuário
- `test`: Logs relacionados a testes
- `sqlite`: Logs de operações SQLite
- `logs`: Logs do sistema de logs
- `export`: Logs de exportação

### Metadados Padrão

```typescript
{
  screen: string,           // Nome da tela atual
  action: string,           // Ação realizada
  from?: string,           // Tela de origem
  to?: string,             // Tela de destino
  trigger?: string,        // Gatilho da ação
  user?: string,           // Usuário atual
  timestamp: string,       // Timestamp ISO
  sessionId: string,       // ID da sessão
  deviceId: string         // ID do dispositivo
}
```

## Gerenciamento de Sessão

### SessionContextManager

```typescript
// Atualizar contexto com usuário
sessionContextManager.updateContext({ userId: 'usuario@email.com' });

// Gerar nova sessão (logout)
sessionContextManager.refreshSession();

// Obter contexto atual
const context = sessionContextManager.getSessionContext();
```

### Atualização Automática

O logger atualiza automaticamente o contexto da sessão quando:

- Um usuário faz login
- Um usuário faz logout
- Uma nova sessão é iniciada

## Exemplos de Uso

### Log de Navegação

```typescript
logNavigation('iniciada');
logNavigation('finalizada', 'login');
```

### Log de Ação do Usuário

```typescript
logUserAction('button_pressed', { buttonType: 'primary' });
logUserAction('login_attempt', { method: 'google' });
```

### Log com Contexto Adicional

```typescript
const { logUserAction } = useNavigationLogger({
  screenName: 'HomeScreen',
  additionalContext: {
    hasNotifications: true,
    userType: 'premium',
  },
});
```

## Benefícios

1. **Rastreabilidade Completa**: Todas as ações do usuário são registradas
2. **Debugging Melhorado**: Facilita a identificação de problemas
3. **Analytics**: Dados para análise de uso e comportamento
4. **Manutenção**: Histórico completo de navegação para troubleshooting
5. **Performance**: Logs assíncronos não impactam a UI

## Configuração

### Dependências

- React Native
- Expo File System
- Expo Sharing
- SQLite (com fallback para memória)

### Variáveis de Ambiente

- `__DEV__`: Habilita logs no console em desenvolvimento
- Configurações de SQLite para persistência

## Monitoramento

### Logs em Produção

- Logs são salvos localmente no dispositivo
- Sistema de rotação automática (30 dias)
- Exportação para análise externa

### Logs em Desenvolvimento

- Exibição no console para debugging
- Logs detalhados com metadados completos
- Testes automatizados disponíveis

## Testes

### Função de Teste

```typescript
import { testNavigationLogging } from '@services/logging';

// Executar teste completo
const result = await testNavigationLogging();
```

### Cobertura de Testes

- Logs de navegação
- Mudanças de usuário
- Contexto de sessão
- Tratamento de erros

## Manutenção

### Limpeza Automática

- Logs antigos são removidos automaticamente
- Configurável via `deleteOldLogs()`
- Padrão: 30 dias

### Exportação

- Formato JSON ou CSV
- Compartilhamento via sistema nativo
- Backup para análise externa

## Troubleshooting

### Problemas Comuns

1. **Logs não aparecem**: Verificar permissões de arquivo
2. **SQLite não funciona**: Sistema fallback automático para memória
3. **Performance lenta**: Logs são assíncronos por padrão

### Logs de Debug

- Todos os erros do sistema são logados
- Contexto completo incluído em erros
- Rastreamento de sessão mantido

## Próximos Passos

1. **Integração com Analytics**: Envio de logs para serviços externos
2. **Filtros Avançados**: Busca e filtragem de logs por critérios
3. **Alertas**: Notificações para eventos críticos
4. **Dashboard**: Interface visual para análise de logs
5. **Machine Learning**: Análise automática de padrões de uso
