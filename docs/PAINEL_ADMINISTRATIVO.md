# Painel Administrativo - INpunto

## Visão Geral

O painel administrativo é uma funcionalidade secreta que permite acesso a recursos avançados do sistema, incluindo a visualização de logs e informações do sistema. Este painel é acessado através de uma sequência secreta na tela de login.

## 🚪 Acesso Secreto

### Como Acessar

1. **Na tela de login**, clique **5 vezes** no canto superior esquerdo da tela
2. Os cliques devem ser feitos em sequência rápida (dentro de 3 segundos)
3. Após o 5º clique, você será redirecionado para o painel administrativo

### Segurança

- **Timeout**: Se passar mais de 3 segundos entre cliques, a sequência é resetada
- **Logs**: Todas as tentativas de acesso são registradas no sistema de logs
- **Invisível**: A área de clique é completamente invisível para o usuário comum

## 🔐 Sistema de Senha

### Senha Padrão

- **Senha**: `1234`
- **Formato**: 4 dígitos numéricos
- **Tentativas**: Máximo de 3 tentativas incorretas

### Funcionalidades do Teclado

- **Teclas numéricas**: 0-9 para inserir a senha
- **Tecla C**: Limpa toda a senha
- **Tecla ⌫**: Remove o último dígito inserido
- **Botão ACESSAR**: Ativa quando 4 dígitos são inseridos

### Medidas de Segurança

- **Bloqueio automático**: Após 3 tentativas incorretas
- **Reset de sessão**: Volta para a tela de login
- **Logs de segurança**: Registra todas as tentativas de acesso

## 🎛️ Interface do Painel

### Estado Bloqueado

- **Display de senha**: Mostra pontos preenchidos (●) e vazios (○)
- **Contador de tentativas**: Exibe tentativas restantes
- **Teclado numérico**: Funcional para inserção da senha
- **Botão de acesso**: Ativo apenas com senha completa

### Estado Desbloqueado

- **Ícone de sucesso**: 🔓 com fundo verde
- **Mensagem de boas-vindas**: Confirmação de acesso
- **Opções administrativas**: Lista de funcionalidades disponíveis

## 📱 Funcionalidades Disponíveis

### 1. 📊 Acessar Logs do Sistema

- **Descrição**: Navega diretamente para a tela de logs
- **Uso**: Monitoramento e análise do sistema
- **Logs**: Registra o acesso aos logs via painel administrativo

### 2. ℹ️ Informações do Sistema

- **Descrição**: Exibe detalhes técnicos da aplicação
- **Informações**: Versão, plataforma, modo de operação
- **Logs**: Registra visualização das informações

### 3. 🧪 Status da máquina

- **Descrição**: Abre um modal exibindo os dados recebidos do hardware
- **Campos exibidos**: Bateria, Temp. do bloco, Tempo de aquecimento, Status do equipamento (Análise/Standby), Tempo decorrido
- **Conexão**: Mostra estado de conexão (conectado/desconectado)
- **Origem dos dados**: `useHardwareStatus` (transport mock por padrão)
- **Logs**: `admin_panel_machine_status_open`

## 🔍 Sistema de Logs

### Logs de Acesso

```typescript
// Tentativas de acesso
logUserAction('access_attempt', { passwordLength: 4, attempts: 1 });
logUserAction('access_denied', { attempts: 1, remaining: 2 });
logUserAction('access_granted', { success: true });

// Bloqueio por tentativas
logUserAction('admin_panel_locked', { attempts: 3, maxAttempts: 3 });
```

### Logs de Navegação

```typescript
// Acesso via sequência secreta
logUserAction('secret_click', { clickNumber: 3, totalNeeded: 5 });
logUserAction('admin_panel_activated', { action: 'secret_sequence_completed' });

// Navegação entre telas
logUserAction('access_logs_from_admin', { action: 'navigate_to_logs' });
```

### Logs de Segurança

```typescript
// Tentativas de senha incorreta
logUserAction('access_denied', { attempts: 2, remaining: 1 });
logUserAction('access_denied_max_attempts', { attempts: 3 });

// Reset de sessão
logUserAction('admin_panel_reset', { action: 'reset_session' });
```

## 🎨 Design e UX

### Paleta de Cores

- **GOLD (#b8860b)**: Cor principal e destaque
- **GOLD_BG (#fcf5e6)**: Fundo dos botões de ação
- **SUCCESS_GREEN (#10b981)**: Botão de acesso e sucesso
- **ERROR_RED (#ef4444)**: Mensagens de erro e bloqueio
- **TEXT (#1f2937)**: Texto principal
- **MUTED (#6b7280)**: Texto secundário

### Elementos Visuais

- **Teclado numérico**: Botões com sombras e bordas arredondadas
- **Display de senha**: Pontos visuais para feedback
- **Estados visuais**: Cores diferentes para diferentes estados
- **Animações**: Feedback visual para ações do usuário

### Responsividade

- **Layout adaptativo**: Funciona em diferentes tamanhos de tela
- **Touch targets**: Botões com tamanho adequado para toque
- **Espaçamento**: Sistema de spacing consistente

## 🛡️ Considerações de Segurança

### Boas Práticas

1. **Não compartilhar** a sequência de acesso
2. **Alterar a senha padrão** em produção
3. **Monitorar logs** de tentativas de acesso
4. **Implementar rate limiting** se necessário

### Recomendações

- **Senha forte**: Usar senhas mais complexas em produção
- **Autenticação adicional**: Considerar 2FA para acesso administrativo
- **Auditoria**: Revisar regularmente os logs de acesso
- **Backup**: Manter backup das configurações administrativas

## 🔧 Configuração

### Personalização

```typescript
// Alterar senha padrão
const CORRECT_PASSWORD = '1234'; // Alterar para senha desejada

// Alterar número máximo de tentativas
const MAX_ATTEMPTS = 3; // Ajustar conforme necessário

// Alterar timeout da sequência secreta
if (currentTime - lastClickTime > 3000) {
  // 3 segundos
  // Reset da sequência
}
```

### Integração

- **Sistema de logs**: Integrado automaticamente
- **Navegação**: Funciona com o sistema de rotas existente
- **Estado**: Gerenciado pelo App principal
- **Contexto**: Inclui informações de usuário e sessão

## 📋 Checklist de Implementação

### ✅ Funcionalidades Implementadas

- [x] Acesso secreto com 5 cliques
- [x] Sistema de senha numérica
- [x] Teclado numérico funcional
- [x] Medidas de segurança (bloqueio após 3 tentativas)
- [x] Interface desbloqueada com opções administrativas
- [x] Navegação para tela de logs
- [x] Sistema de logs completo
- [x] Design consistente com outras telas
- [x] Responsividade e acessibilidade

### 🔄 Melhorias Futuras

- [ ] Configuração de senha via arquivo de configuração
- [ ] Múltiplos níveis de acesso administrativo
- [ ] Histórico de acessos administrativos
- [ ] Notificações de tentativas de acesso
- [ ] Integração com sistema de autenticação externo
- [ ] Backup e restauração de configurações

## 🚨 Troubleshooting

### Problemas Comuns

1. **Sequência não funciona**: Verificar se os cliques estão dentro do timeout
2. **Senha não aceita**: Confirmar que são exatamente 4 dígitos
3. **Painel bloqueado**: Aguardar reset ou usar botão de voltar
4. **Navegação não funciona**: Verificar se o estado está correto

### Debug

- **Logs**: Verificar logs de acesso e navegação
- **Estado**: Confirmar estado atual da aplicação
- **Props**: Verificar se as props estão sendo passadas corretamente
- **Console**: Verificar erros no console do React Native

## 📚 Referências

- **Sistema de Logs**: Ver documentação do sistema de logs
- **Navegação**: Ver documentação de navegação entre telas
- **Design System**: Ver documentação de cores e componentes
- **Segurança**: Ver boas práticas de segurança em React Native
