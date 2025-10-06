import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useHardwareStatus } from '@services/hardware';

const GOLD = '#b8860b';
const TEXT = '#1f2937';
const MUTED = '#6b7280';

interface Props {
  onBack: () => void;
}

export const MachineStatusScreen: React.FC<Props> = ({ onBack }) => {
  const { status, connected } = useHardwareStatus();

  const formatHm = (hm?: { hours: number; minutes: number }) => {
    if (!hm) return '--:--';
    const h = String(hm.hours ?? 0).padStart(2, '0');
    const m = String(hm.minutes ?? 0).padStart(2, '0');
    return `${h}:${m}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Status da máquina</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Conexão: {connected ? 'Conectado' : 'Desconectado'}
        </Text>

        <View style={styles.card}>
          <Row
            label="Bateria"
            value={status ? `${status.batteryPercent}%` : '--'}
          />
          <Row
            label="Temp. do bloco"
            value={status ? `${status.blockTemperatureC}°C` : '--'}
          />
          <Row
            label="Tempo aquecimento"
            value={status ? formatHm(status.blockHeatingTime) : '--:--'}
          />
          <Row
            label="Status do equipamento"
            value={
              status
                ? status.equipmentStatus === 'analysis'
                  ? 'Em análise'
                  : 'Standby'
                : '--'
            }
          />
          <Row
            label="Decorrido"
            value={status ? formatHm(status.analysisElapsed) : '--:--'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: Platform.OS === 'android' ? 24 + 24 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  backButtonText: {
    color: GOLD,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT,
    flex: 1,
    textAlign: 'center',
    marginRight: 48,
  },
  container: {
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rowLabel: {
    fontSize: 14,
    color: MUTED,
  },
  rowValue: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '600',
  },
});
