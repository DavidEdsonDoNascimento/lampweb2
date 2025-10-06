import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useSimulatorStatus } from '@services/simulator';

// Constantes de cores
const GOLD = '#D4AF37';
const GOLD_BG = '#FFF8E1';
const TEXT = '#1F2937';
const MUTED = '#6B7280';
const SUCCESS_GREEN = '#10B981';
const ERROR_RED = '#EF4444';

interface SimulatorControlsScreenProps {
  onNavigateBack: () => void;
}

export const SimulatorControlsScreen: React.FC<
  SimulatorControlsScreenProps
> = ({ onNavigateBack }) => {
  const {
    service: simulator,
    status,
    status: { connected },
  } = useSimulatorStatus();
  const [logs, setLogs] = useState<string[]>([]);

  // Função para adicionar logs
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [`[${timestamp}] ${message}`, ...prevLogs]);
  };

  // Sincronizar logs do simulador com os logs locais
  useEffect(() => {
    if (status.logs && status.logs.length > 0) {
      setLogs(status.logs);
    }
  }, [status.logs]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Controles do Simulador</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Status de Conexão */}
          <View
            style={[
              styles.connectionStatus,
              connected ? styles.connectedStatus : styles.disconnectedStatus,
            ]}
          >
            <View style={styles.connectionRow}>
              <View
                style={[
                  styles.statusIndicator,
                  connected
                    ? styles.statusConnected
                    : styles.statusDisconnected,
                ]}
              />
              <Text
                style={[
                  styles.connectionText,
                  connected
                    ? styles.connectionTextConnected
                    : styles.connectionTextDisconnected,
                ]}
              >
                {connected ? '🟢 Conectado ao Simulador' : '🔴 Desconectado'}
              </Text>
            </View>
            {!connected && (
              <TouchableOpacity
                style={styles.reconnectButton}
                onPress={() => {
                  simulator.connect().catch(error => {
                    addLog(
                      `❌ Erro ao reconectar: ${error.message || 'Falha na conexão'}`
                    );
                  });
                  addLog('🔄 Tentando reconectar...');
                }}
              >
                <Text style={styles.reconnectButtonText}>🔄 Reconectar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Informações de Status */}
          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>📊 Status do Dispositivo</Text>

            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>🔋 Bateria</Text>
                <View style={styles.statusValueContainer}>
                  <Text
                    style={[
                      styles.statusValue,
                      status.status && status.status.batteryPercent < 20
                        ? styles.statusValueWarning
                        : null,
                    ]}
                  >
                    {status.status ? `${status.status.batteryPercent}%` : '--'}
                  </Text>
                  {status.status && status.status.batteryPercent < 20 && (
                    <Text style={styles.warningText}>⚠️ Baixa</Text>
                  )}
                </View>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>🌡️ Temperatura</Text>
                <View style={styles.statusValueContainer}>
                  <Text
                    style={[
                      styles.statusValue,
                      status.status && status.status.blockTemperatureC > 60
                        ? styles.statusValueHot
                        : null,
                    ]}
                  >
                    {status.status
                      ? `${status.status.blockTemperatureC}°C`
                      : '--'}
                  </Text>
                  {status.status && status.status.blockTemperatureC > 60 && (
                    <Text style={styles.hotText}>🔥 Aquecendo</Text>
                  )}
                </View>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>⚙️ Equipamento</Text>
                <Text
                  style={[
                    styles.statusValue,
                    status.status &&
                    status.status.equipmentStatus === 'analysis'
                      ? styles.statusValueActive
                      : null,
                  ]}
                >
                  {status.status
                    ? status.status.equipmentStatus === 'analysis'
                      ? '🔬 Em análise'
                      : '⏸️ Standby'
                    : '--'}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>🧪 Pré-teste</Text>
                <Text
                  style={[
                    styles.statusValue,
                    status.status && status.status.preTestStatus === 'completed'
                      ? styles.statusValueSuccess
                      : null,
                  ]}
                >
                  {status.status
                    ? status.status.preTestStatus === 'not_started'
                      ? '⏳ Não iniciado'
                      : status.status.preTestStatus === 'in_progress'
                        ? '🔄 Em processo'
                        : '✅ Concluído'
                    : '--'}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>⏱️ Tempo de Aquecimento</Text>
                <Text style={styles.statusValue}>
                  {status.status
                    ? `${status.status.blockHeatingTime.hours.toString().padStart(2, '0')}:${status.status.blockHeatingTime.minutes.toString().padStart(2, '0')}`
                    : '--'}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>⏰ Tempo Decorrido</Text>
                <Text style={styles.statusValue}>
                  {status.status
                    ? `${status.status.analysisElapsed.hours.toString().padStart(2, '0')}:${status.status.analysisElapsed.minutes.toString().padStart(2, '0')}`
                    : '--'}
                </Text>
              </View>
            </View>
          </View>

          {/* Teste Ativo */}
          {status.status &&
            status.status.testType &&
            status.status.testType !== 'none' && (
              <View style={styles.controlSection}>
                <Text style={styles.sectionTitle}>🎯 Teste Ativo</Text>
                <View style={styles.activeTestContainer}>
                  <Text style={styles.activeTestLabel}>Tipo de Teste:</Text>
                  <Text style={styles.activeTestValue}>
                    {status.status.testType === 'cinomose'
                      ? 'Cinomose (65°C)'
                      : status.status.testType === 'ibv_geral'
                        ? 'IBV Geral (80°C)'
                        : status.status.testType === 'ibv_especifico'
                          ? 'IBV Específico (90°C)'
                          : status.status.testType}
                  </Text>
                </View>
              </View>
            )}

          {/* Resultado do Teste */}
          {status.status && status.status.testResult && (
            <View style={styles.controlSection}>
              <Text style={styles.sectionTitle}>🎯 Resultado do Teste</Text>
              <View style={styles.testResultContainer}>
                <Text style={styles.testResultText}>
                  {status.status.testResult}
                </Text>
              </View>
            </View>
          )}

          {/* Botões de Teste */}
          <View style={styles.controlSection}>
            <Text style={styles.sectionTitle}>🧪 Cenários de Teste</Text>

            {/* Linha 1: Teste Cinomose */}
            <TouchableOpacity
              style={[styles.testButton, styles.testButtonCinomose]}
              onPress={async () => {
                try {
                  await simulator.setPreset('test_cinomose');
                  addLog('🧪 Teste Cinomose iniciado (65°C)');
                } catch (error) {
                  addLog(
                    `❌ Erro: ${error instanceof Error ? error.message : 'Falha ao iniciar teste'}`
                  );
                }
              }}
            >
              <Text style={styles.testButtonText}>🧪 Teste Cinomose</Text>
              <Text style={styles.testButtonSubtext}>
                Temperatura alvo: 65°C
              </Text>
            </TouchableOpacity>

            {/* Linha 2: Teste IBV Geral */}
            <TouchableOpacity
              style={[styles.testButton, styles.testButtonIbvGeral]}
              onPress={async () => {
                try {
                  await simulator.setPreset('test_ibv_geral');
                  addLog('🧪 Teste IBV Geral iniciado (80°C)');
                } catch (error) {
                  addLog(
                    `❌ Erro: ${error instanceof Error ? error.message : 'Falha ao iniciar teste'}`
                  );
                }
              }}
            >
              <Text style={styles.testButtonText}>🔬 Teste IBV Geral</Text>
              <Text style={styles.testButtonSubtext}>
                Temperatura alvo: 80°C
              </Text>
            </TouchableOpacity>

            {/* Linha 3: Teste IBV Específico */}
            <TouchableOpacity
              style={[styles.testButton, styles.testButtonIbvEspecifico]}
              onPress={async () => {
                try {
                  await simulator.setPreset('test_ibv_especifico');
                  addLog('🧪 Teste IBV Específico iniciado (90°C)');
                } catch (error) {
                  addLog(
                    `❌ Erro: ${error instanceof Error ? error.message : 'Falha ao iniciar teste'}`
                  );
                }
              }}
            >
              <Text style={styles.testButtonText}>🧬 Teste IBV Específico</Text>
              <Text style={styles.testButtonSubtext}>
                Temperatura alvo: 90°C
              </Text>
            </TouchableOpacity>

            {/* Linha 4: Standby */}
            <TouchableOpacity
              style={[styles.testButton, styles.testButtonStandby]}
              onPress={async () => {
                try {
                  await simulator.setPreset('standby');
                  addLog('⏸️ Modo Standby ativado');
                } catch (error) {
                  addLog(
                    `❌ Erro: ${error instanceof Error ? error.message : 'Falha ao ativar standby'}`
                  );
                }
              }}
            >
              <Text style={styles.testButtonText}>⏸️ Modo Standby</Text>
              <Text style={styles.testButtonSubtext}>
                Temperatura de standby: 50°C
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botões de Status */}
          <View style={styles.controlSection}>
            <Text style={styles.sectionTitle}>Obter Informações</Text>

            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => {
                addLog('🔋 Obtendo status da bateria...');
                if (status.status) {
                  addLog(`🔋 Bateria: ${status.status.batteryPercent}%`);
                }
              }}
            >
              <Text style={styles.statusButtonText}>
                🔋 Obter Status da Bateria
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => {
                addLog('🌡️ Obtendo temperatura do bloco...');
                if (status.status) {
                  addLog(
                    `🌡️ Temperatura do Bloco: ${status.status.blockTemperatureC}°C`
                  );
                }
              }}
            >
              <Text style={styles.statusButtonText}>
                🌡️ Obter Temperatura do Bloco
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => {
                addLog('🔧 Obtendo status do equipamento...');
                if (status.status) {
                  const equipStatus =
                    status.status.equipmentStatus === 'analysis'
                      ? 'Em Análise'
                      : 'Standby';
                  addLog(`🔧 Status do Equipamento: ${equipStatus}`);
                }
              }}
            >
              <Text style={styles.statusButtonText}>
                🔧 Obter Status do Equipamento
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => {
                addLog('🧪 Obtendo status do pré-teste...');
                if (status.status) {
                  const preTestStatus =
                    status.status.preTestStatus === 'not_started'
                      ? 'Não Iniciado'
                      : status.status.preTestStatus === 'in_progress'
                        ? 'Em Processo'
                        : 'Concluído';
                  addLog(`🧪 Status do Pré-teste: ${preTestStatus}`);
                }
              }}
            >
              <Text style={styles.statusButtonText}>
                🧪 Obter Status do Pré-teste
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logs */}
          <View style={styles.controlSection}>
            <Text style={styles.sectionTitle}>📋 Logs do Sistema</Text>
            <View style={styles.logsHeader}>
              <Text style={styles.logsSubtitle}>
                Monitoramento em tempo real
              </Text>
              <Text style={styles.logsCount}>{logs.length} entradas</Text>
            </View>
            <ScrollView style={styles.logsContainer}>
              {logs && logs.length > 0 ? (
                logs.slice(0, 20).map((log, index) => (
                  <View
                    key={index}
                    style={[
                      styles.logRow,
                      index % 2 === 0 ? styles.logRowEven : styles.logRowOdd,
                    ]}
                  >
                    <Text style={styles.logText}>{log}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.noLogsContainer}>
                  <Text style={styles.noLogsText}>
                    📝 Nenhum log disponível
                  </Text>
                  <Text style={styles.noLogsSubtext}>
                    Os logs aparecerão aqui quando o simulador estiver ativo
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 24 + 60 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
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
  },
  scrollView: {
    flex: 1,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  connectionText: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '500',
  },
  reconnectButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reconnectButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statusLabel: {
    fontSize: 16,
    color: MUTED,
  },
  statusValue: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  controlButtonSuccess: {
    backgroundColor: SUCCESS_GREEN,
  },
  controlButtonDanger: {
    backgroundColor: ERROR_RED,
  },
  controlButtonPrimary: {
    backgroundColor: '#3b82f6',
  },
  controlButtonSecondary: {
    backgroundColor: MUTED,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusButtonText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTestContainer: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  activeTestLabel: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 4,
  },
  activeTestValue: {
    fontSize: 18,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  testResultContainer: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  testResultText: {
    fontSize: 14,
    color: '#166534',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  logsContainer: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    maxHeight: 200,
  },
  logRow: {
    flexDirection: 'row',
    marginBottom: 2,
    width: '100%',
  },
  logText: {
    color: '#10b981',
    fontSize: 14,
    fontFamily: 'monospace',
    flexWrap: 'wrap',
    flex: 1,
  },
  noLogsText: {
    color: MUTED,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  // Novos estilos para melhorar a apresentação
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusConnected: {
    backgroundColor: SUCCESS_GREEN,
  },
  statusDisconnected: {
    backgroundColor: ERROR_RED,
  },
  connectedStatus: {
    borderLeftWidth: 4,
    borderLeftColor: SUCCESS_GREEN,
  },
  disconnectedStatus: {
    borderLeftWidth: 4,
    borderLeftColor: ERROR_RED,
  },
  connectionTextConnected: {
    color: SUCCESS_GREEN,
    fontWeight: '600',
  },
  connectionTextDisconnected: {
    color: ERROR_RED,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusValueWarning: {
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  statusValueHot: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  statusValueActive: {
    color: SUCCESS_GREEN,
    fontWeight: 'bold',
  },
  statusValueSuccess: {
    color: SUCCESS_GREEN,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#f59e0b',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '600',
  },
  hotText: {
    color: '#ef4444',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '600',
  },
  // Estilos para logs melhorados
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logsSubtitle: {
    color: MUTED,
    fontSize: 14,
    fontStyle: 'italic',
  },
  logsCount: {
    color: GOLD,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: GOLD_BG,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logRowEven: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  logRowOdd: {
    backgroundColor: 'transparent',
  },
  noLogsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noLogsSubtext: {
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  // Novos estilos para botões de teste
  testButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  testButtonCinomose: {
    backgroundColor: '#E8D5F2', // Roxo claro
    borderWidth: 2,
    borderColor: '#9F7AEA',
  },
  testButtonIbvGeral: {
    backgroundColor: '#DBEAFE', // Azul claro
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  testButtonIbvEspecifico: {
    backgroundColor: '#D1FAE5', // Verde claro
    borderWidth: 2,
    borderColor: '#10B981',
  },
  testButtonStandby: {
    backgroundColor: '#F3F4F6', // Cinza claro
    borderWidth: 2,
    borderColor: '#6B7280',
  },
  testButtonText: {
    color: TEXT,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  testButtonSubtext: {
    color: MUTED,
    fontSize: 14,
    fontWeight: '500',
  },
});
