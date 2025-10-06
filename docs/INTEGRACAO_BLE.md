## Integração via Bluetooth (BLE)

Este documento descreve como o app receberá os frames de status (9 bytes) do equipamento via BLE, como enviaremos comandos, e quais informações precisamos do time de hardware.

### Visão geral

- Modelo de dados: um "frame" binário fixo de 9 bytes com snapshot completo dos status (bateria, temperatura, tempos, estado), já definido em `INTEGRACAO_HARDWARE.md`.
- Transporte: BLE GATT com característica de NOTIFICAÇÃO para telemetria (read/notify) e característica de ESCRITA para comandos (write/without response).
- O app terá um `HardwareTransport` específico para BLE (substitui o simulador), conectado ao `HardwareService` existente. O parser (`parseHardwareFrame`) permanece igual.

### Fluxo no app (alto nível)

1. Pedir permissões BLE (Android 12+: `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`; iOS: Bluetooth Always).
2. Scan por dispositivo alvo (por nome ou UUID do serviço). Exibir lista e permitir seleção.
3. Conectar (GATT), descobrir serviços e características.
4. Assinar NOTIFICAÇÕES na característica de telemetria.
5. A cada notificação (payload 9 bytes): chamar `parseHardwareFrame(bytes)` e publicar o JSON para a UI via `HardwareService`.
6. Enviar comandos escrevendo na característica de comando (`writeWithoutResponse` preferencial para baixa latência).
7. Monitorar desconexões, implementar reconexão com backoff.

### Mapeamento GATT (proposto)

- Serviço: `BLE_SERVICE_UUID` (definir com o time de hardware)
- Característica de Telemetria (Notify): `BLE_CHAR_NOTIFY_UUID`
  - Direção: Dispositivo → App
  - Payload: exatamente 9 bytes por notificação, cada notificação é um frame completo.
  - Taxa: definida pelo hardware (ex.: 2 Hz, 5 Hz). Documentar jitter máximo.
- Característica de Comando (Write/Write Without Response): `BLE_CHAR_CMD_UUID`
  - Direção: App → Dispositivo
  - Payload: comandos no protocolo acordado (se diferente do frame de status, definir layout).

Os UUIDs poderão ser definidos em `app.json` → `expo.extra.BLE_UUIDS` e lidos por `config/env.ts`.

### Framing, MTU e confiabilidade

- MTU BLE típico (iOS/Android) é ≥ 20 bytes; nosso frame tem 9 bytes, cabe em uma única notificação.
- Recomendado: cada notificação traga 1 frame completo, sem fragmentação.
- Se houver versão/CRC futuramente, avaliar:
  - Adicionar cabeçalho (ex.: 2 bytes header, 1 byte versão, 1 byte length, 1 byte CRC) mantendo total ≤ MTU.
  - O app deve validar tamanho e opcionalmente CRC antes de chamar `parseHardwareFrame`.

### Conexão, reconexão e estados

- Estados a tratar no app:
  - scanning → connecting → discovering → ready (subscrito) → streaming.
  - onDisconnect: tentar reconectar com backoff (ex.: 1s, 2s, 5s, 10s), limitado.
- Timeouts:
  - Sem notificação por N segundos (ex.: 5s): marcar desconectado/sem dados e tentar recuperar subscrição.
  - Escrita de comando com ACK (se aplicável) deve ter timeout e retry.

### Segurança e emparelhamento

- Se necessário emparelhamento/bonding:
  - iOS: emparelhamento pelo sistema quando requisitado.
  - Android: confirmar se é necessário PIN, Just Works ou outra modalidade.
- Se necessário whitelist/nomes únicos, definir critérios (nome do periférico, manufacturer data, service data).

### O que precisamos do time de hardware

- UUIDs
  - Serviço GATT (ex.: `0000xxxx-0000-1000-8000-00805f9b34fb`).
  - Característica Notify (telemetria) e Write (comando).
- Taxa de notificação
  - Periodicidade alvo (ex.: 500 ms) e jitter esperado.
- Protocolo de payload
  - Confirmar layout do frame de 9 bytes do status (endianness, codificação do byte de temperatura, bit de estado).
  - Se houver versão/CRC agora ou no futuro (especificar algoritmo e posição).
- Comandos
  - Quais comandos existirão (ex.: iniciar análise, parar, setar parâmetros)?
  - Layout do comando (bytes), necessidade de ACK/RESP (e seu formato), codificação, timeouts.
- Identificação do dispositivo
  - Nome de broadcast, filtros de scan, RSSI típico, potência, consumo.
- Estratégia de desconexão
  - Auto-desconexão por inatividade? Como o app deve proceder.

### Como isso se pluga no código atual

- Substituímos o transporte do `HardwareService` por um `BleHardwareTransport` (a implementar) que:
  - `connect()`: realiza scan/conexão/descoberta e subscreve notify.
  - `onData(listener)`: ao receber notificação (ArrayBuffer), converte em `Uint8Array` e encaminha ao listener.
  - `send(bytes)`: escreve na característica de comando (preferir WriteWithoutResponse para baixa latência, se suportado).
  - `disconnect()`: cancela subscrição e encerra a conexão.
- A UI continua usando `useHardwareStatus` sem mudanças.

### Pseudo‐código (BLE → HardwareService)

```
bleTransport.connect()
  scanForDevice(BLE_SERVICE_UUID)
  connect(device)
  chars = discoverCharacteristics(device, BLE_SERVICE_UUID)
  notifyChar = chars[BLE_CHAR_NOTIFY_UUID]
  cmdChar = chars[BLE_CHAR_CMD_UUID]
  subscribe(notifyChar, (data) => hardwareService.handleIncoming(new Uint8Array(data)))

hardwareService.onStatus(json => render(json))

// enviar comando
cmdBytes = buildCommand(...)
bleTransport.send(cmdBytes)
```

### Plano de teste

- Em bancada com simulador:
  - Validar recepção de notificação contínua, sem perdas perceptíveis, em diferentes taxas.
  - Testar limites: bateria 0/100, temperatura negativa/positiva, rollover de minutos/horas.
  - Forçar desconexão e verificar reconexão automática.
- Com hardware real:
  - Confirmar que cada notificação tem 9 bytes e casa com o parser atual.
  - Validar comandos (ACK/RESP, quando definido), timeouts e retries.

### Perguntas rápidas para a reunião

- Quais são os UUIDs do serviço/characterísticas? Frequência de notificação?
- Precisamos de CRC/versão no payload? Há planos de evolução do frame?
- Quais comandos existirão e como será o ACK/RESP?
- Há requisitos de pareamento/segurança específicos?
- Alguma condição que suspenda temporariamente as notificações (ex.: aquecimento)?
