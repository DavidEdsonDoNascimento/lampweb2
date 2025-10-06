## Integração de Hardware no App

Este guia cobre como consumir os frames do hardware e publicar os dados em JSON na UI.

Leia primeiro `docs/PROTOCOL_HARDWARE.md` para o layout de bytes e o JSON alvo.

### APIs principais

- `parseHardwareFrame(frame: Uint8Array): HardwareStatusJSON`
- `serializeHardwareFrame(json: HardwareStatusJSON): Uint8Array`
- `HardwareService` (gera status a partir de bytes do transporte e permite envio)
- `HardwareTransport` (interface de transporte)
- `MockHardwareTransport` (desenvolvimento)
- `useHardwareStatus` (hook para UI)

### Exemplo de uso (UI)

```ts
import { useHardwareStatus } from '@services/hardware';

export function StatusWidget() {
  const { status, connected, service } = useHardwareStatus();

  // Renderize dados quando disponíveis
  return (
    <View>
      <Text>Conectado: {connected ? 'Sim' : 'Não'}</Text>
      {!!status && (
        <>
          <Text>Bateria: {status.batteryPercent}%</Text>
          <Text>Temp bloco: {status.blockTemperatureC}°C</Text>
          <Text>Aquecimento: {status.blockHeatingTime.hours}:{status.blockHeatingTime.minutes}</Text>
          <Text>Status: {status.equipmentStatus}</Text>
          <Text>Decorrido: {status.analysisElapsed.hours}:{status.analysisElapsed.minutes}</Text>
        </>
      )}
    </View>
  );
}
```

### Envio de comando (exemplo)

```ts
import { serializeHardwareFrame } from '@services/hardware';

// Exemplo didático: reenviar um frame JSON
const bytes = serializeHardwareFrame({
  batteryPercent: 80,
  blockTemperatureC: 5,
  blockHeatingTime: { hours: 0, minutes: 20 },
  equipmentStatus: 'analysis',
  analysisElapsed: { hours: 0, minutes: 1 },
});
// transporte real: await transport.send(bytes)
```

### Mock de simulação (temperatura crescente)

- `SimulatorHardwareTransport`: emite frames (array de bytes) a cada 500ms com temperatura do bloco subindo de 0 a 100°C, tempos `hh:mm` incrementando e status alternando entre Análise/Standby.
- O simulador usa `serializeHardwareFrame` para garantir que os dados simulados passam pela mesma conversão bytes↔JSON.
- `getHardwareServiceSingleton()` inicializa um serviço único conectado ao simulador, compartilhado por modal e tela.

### Substituindo o transporte mock por real

- Implemente `HardwareTransport` para BLE/Serial/Wi-Fi.
- Use esse transporte ao criar `HardwareService` dentro de um provider da aplicação.

### Telas e componentes

- Admin: botão “Status da máquina” abre modal com os campos do protocolo.
- Nova tela: `MachineStatusScreen` mostra os mesmos campos e usa a mesma fonte (singleton) para dados.

### Próximos passos

- Adicionar framing (ex.: cabeçalho, versão, CRC) se necessário.
- Implementar fila de comandos, timeouts e retries no `HardwareService`.
- Persistir amostras/telemetria conforme necessidades do produto.
