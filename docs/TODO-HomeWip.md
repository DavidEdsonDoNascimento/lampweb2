## TODO - Integração de Hardware na HomeWip

Lista de próximos passos para integrar a leitura do hardware na tela `HomeWip`.

- Integração inicial
  - Importar `useHardwareStatus` de `@services/hardware` na `HomeWip.tsx`.
  - Exibir estado de conexão (Conectado/Desconectado).
  - Renderizar os campos do status: bateria, temperatura do bloco, tempo de aquecimento, status do equipamento e tempo decorrido.

- UX e estados
  - Exibir placeholders/skeleton enquanto o primeiro status não chega.
  - Tratar desconexão e reconexão (mensagem amigável e botão para tentar reconectar, se aplicável).
  - Formatar `hh:mm` com zero à esquerda e ícone para o status (Análise/Standby).

- Transporte real
  - Substituir `MockHardwareTransport` por transporte real (BLE/Serial/Wi‑Fi) implementando `HardwareTransport`.
  - Configurar permissões da plataforma (Android/iOS) para o transporte (ex.: Bluetooth no Android 12+ e iOS 13+).
  - Adicionar tela/fluxo de pareamento (scan, seleção do dispositivo, conexão, persistência do dispositivo preferido).

- Robustez do protocolo
  - Se o hardware enviar múltiplos frames ou pacotes parciais, adicionar framing (header, tamanho, versão, CRC) no `HardwareService`.
  - Implementar fila de comandos, timeouts, retries e backoff para envios.
  - Logar frames recebidos/enviados em nível de debug usando o `LoggerService` para facilitar diagnóstico.

- Ações de UI (envios)
  - Adicionar botões de ação conforme necessário (ex.: iniciar/pausar análise) que disparem envios via `HardwareService`.
  - Validar comandos antes de serializar (faixas de horas/minutos, limites de temperatura, etc.).

- Testes
  - Adicionar testes de componente (React) para `HomeWip` mockando `useHardwareStatus` (estados: conectado, desconectado, sem dados, dados válidos).
  - Adicionar testes de integração para o `HardwareService` com transporte real simulado (erros de conexão, reconexão, pacotes inválidos).

- Observabilidade
  - Métricas/telemetria de conexão (tempo até primeiro frame, quedas de conexão, tempo médio entre frames).
  - Persistência opcional de últimos N frames para inspeção em `LogsScreen`.

- Performance e energia
  - Avaliar frequência de atualização e impacto na bateria do dispositivo móvel.
  - Pausar leitura quando a tela estiver em background, se apropriado.
