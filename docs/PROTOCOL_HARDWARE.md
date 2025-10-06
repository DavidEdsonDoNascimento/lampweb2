## Protocolo de integração com hardware (draft)

Este documento descreve o formato de quadro (frame) de dados entre o aplicativo e o hardware (equipamento que realiza aquecimento e mistura de reagentes). O objetivo é padronizar a conversão entre `Uint8Array` (array de bytes) e um objeto JSON usado internamente no app.

Observação importante: as especificações recebidas têm lacunas/ambiguidades. Este draft documenta decisões explícitas para permitir implementação imediata. Pontos ambíguos estão marcados com "[Ambíguo]" e possuem uma decisão temporária. Ajustes futuros serão compatibilizados em versão v2 do protocolo se necessário.

### Endianness

- Todos os campos multi-byte usam big-endian (byte mais significativo primeiro), exceto quando o campo é definido como par de bytes independentes (por exemplo, hora e minuto).

### Layout do frame (v1)

Ordem e tamanhos dos campos, totalizando 9 bytes:

1. Bateria (2 bytes): `0x0000` a `0x0064` (0–100%). Valor inteiro percentual. [Ambíguo] Motivo do uso de 2 bytes para 0–100 não informado; decisão: reservar 2 bytes (uint16) big-endian para futuro headroom.
2. Temperatura do bloco (2 bytes): codificação por bits no primeiro byte; segundo byte reservado (0x00).
   - bit 7 (MSB) do primeiro byte: 1 = positivo, 0 = negativo.
   - bits 0–6 do primeiro byte: magnitude (0–127).
   - Temperatura = sinal × magnitude (°C). [Ambíguo] A especificação menciona "2 bytes" porém define apenas até 8 bits; decisão: usar apenas o primeiro byte para valor e sinal, segundo byte reservado (deve ser 0x00).
3. Tempo de aquecimento do bloco (2 bytes): `hh:mm` (1 byte hora, 1 byte minuto), cada um 0–255. [Ambíguo] Intervalo de hora não especificado; decisão: aceitar 0–255 e validar faixa típica 0–23/0–59 no app, sem restringir no protocolo.
4. Status do equipamento (1 byte): bit 0 (LSB) = 1 (Análise), 0 (Standby). Demais bits reservados (0).
5. Tempo decorrido desde início da análise (2 bytes): `hh:mm` (1 byte hora, 1 byte minuto).

Total: 2 + 2 + 2 + 1 + 2 = 9 bytes.

### Representação JSON

Objeto JSON utilizado no app:

```
{
  "batteryPercent": number,            // 0–100
  "blockTemperatureC": number,         // -127..+127 (inteiro)
  "blockHeatingTime": { "hours": number, "minutes": number },
  "equipmentStatus": "analysis" | "standby",
  "analysisElapsed": { "hours": number, "minutes": number }
}
```

### Regras de codificação (serialize JSON -> bytes)

- Bateria: escrever uint16 big-endian com valor em % (0–100).
- Temperatura: primeiro byte = (signo<<7) | magnitude(0–127). Segundo byte = 0x00.
- `hh:mm`: cada componente em um byte (0–255). Validação sugerida: limitar a 0–23/0–59 no domínio do app; o protocolo não impõe.
- Status: 0x01 para Análise (bit0=1), 0x00 para Standby (bit0=0).

### Regras de decodificação (parse bytes -> JSON)

- Bateria: ler uint16 big-endian e clamped para 0–100.
- Temperatura: ler primeiro byte; bit7 define sinal (1 positivo, 0 negativo), bits0–6 magnitude (0–127). Segundo byte é reservado e pode ser ignorado (validar 0x00 quando aplicável).
- `hh:mm`: dois bytes em sequência.
- Status: avaliar bit0 do byte.

### Exemplo (hex)

```
Input bytes (hex):
  00 64   // 100%
  87 00   // +7 °C (0b1000_0111 -> sign 1, magnitude 7), reservado 0x00
  00 1E   // 00:30 aquecimento
  01      // status: análise
  00 0F   // 00:15 decorrido

JSON:
{
  "batteryPercent": 100,
  "blockTemperatureC": 7,
  "blockHeatingTime": { "hours": 0, "minutes": 30 },
  "equipmentStatus": "analysis",
  "analysisElapsed": { "hours": 0, "minutes": 15 }
}
```

### Validações e erros

- Tamanho do frame deve ser exatamente 9 bytes.
- Bateria fora de 0–100: aceitar mas fazer clamp no app; opcionalmente emitir warning.
- Temperatura: magnitude >127 invalida; segundo byte diferente de 0x00 pode gerar warning (compatibilidade futura).
- Horas/minutos fora de faixa típica: aceitar no protocolo e validar no domínio do app quando necessário.

### Extensões futuras

- Campo de versão (1 byte) no início do frame.
- Checksum CRC-8/CRC-16 ao final do frame.
- Campos adicionais (ex.: erros, firmware, voltagem de bateria, etc.).

### Integração no app

- Utilitário `src/services/hardware/codec.ts` expõe:
  - `parseHardwareFrame(frame: Uint8Array): HardwareStatusJSON`
  - `serializeHardwareFrame(json: HardwareStatusJSON): Uint8Array`
- Testes em `tests/services/hardware/codec.test.ts` com casos felizes e limites.
