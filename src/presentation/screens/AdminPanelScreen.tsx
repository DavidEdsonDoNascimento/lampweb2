import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigationLogger } from '@services/logging';
import { useHardwareStatus } from '@services/hardware';
import { useSimulatorStatus } from '@services/simulator';

// Cores consistentes com as outras páginas
const GOLD = '#b8860b';
const GOLD_BG = '#fcf5e6';
const TEXT = '#1f2937';
const MUTED = '#6b7280';
const ERROR_RED = '#ef4444';
const SUCCESS_GREEN = '#10b981';

const { width } = Dimensions.get('window');

interface AdminPanelScreenProps {
  onNavigateBack: () => void;
  onAccessLogs: () => void;
  onAccessSimulatorControls: () => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  onNavigateBack,
  onAccessLogs,
  onAccessSimulatorControls,
}) => {
  const [password, setPassword] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showMachineStatus, setShowMachineStatus] = useState<boolean>(false);
  const [showSimulatorControls, setShowSimulatorControls] =
    useState<boolean>(false);

  const { logUserAction } = useNavigationLogger({
    screenName: 'AdminPanelScreen',
    additionalContext: { isAdminPanel: true },
  });

  const simulator = useSimulatorStatus();

  const CORRECT_PASSWORD = '1234';
  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) {
      setIsLocked(true);
      logUserAction('admin_panel_locked', {
        attempts,
        maxAttempts: MAX_ATTEMPTS,
      });
      Alert.alert(
        'Painel Bloqueado',
        'Muitas tentativas incorretas. O painel foi bloqueado por segurança.',
        [
          {
            text: 'OK',
            onPress: () => onNavigateBack(),
          },
        ]
      );
    }
  }, [attempts, onNavigateBack, logUserAction]);

  const handleNumberPress = (number: string) => {
    if (isLocked) return;

    if (password.length < 4) {
      const newPassword = password + number;
      setPassword(newPassword);
      logUserAction('number_pressed', {
        number,
        passwordLength: newPassword.length,
      });
    }
  };

  const handleClear = () => {
    if (isLocked) return;

    setPassword('');
    logUserAction('password_cleared', { action: 'clear_password' });
  };

  const handleDelete = () => {
    if (isLocked) return;

    if (password.length > 0) {
      const newPassword = password.slice(0, -1);
      setPassword(newPassword);
      logUserAction('password_deleted', { newLength: newPassword.length });
    }
  };

  const handleAccess = () => {
    if (isLocked) return;

    logUserAction('access_attempt', {
      passwordLength: password.length,
      attempts: attempts + 1,
    });

    if (password === CORRECT_PASSWORD) {
      setIsUnlocked(true);
      setAttempts(0);
      logUserAction('access_granted', { success: true });
      Alert.alert(
        'Acesso Concedido',
        'Senha correta! Painel administrativo desbloqueado.',
        [{ text: 'OK' }]
      );
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword('');

      if (newAttempts >= MAX_ATTEMPTS) {
        logUserAction('access_denied_max_attempts', { attempts: newAttempts });
      } else {
        logUserAction('access_denied', {
          attempts: newAttempts,
          remaining: MAX_ATTEMPTS - newAttempts,
        });
        Alert.alert(
          'Senha Incorreta',
          `Tentativa ${newAttempts} de ${MAX_ATTEMPTS}. Tente novamente.`
        );
      }
    }
  };

  const renderNumberButton = (number: string) => (
    <TouchableOpacity
      key={number}
      style={styles.numberButton}
      onPress={() => handleNumberPress(number)}
      disabled={isLocked}
    >
      <Text style={styles.numberButtonText}>{number}</Text>
    </TouchableOpacity>
  );

  const renderActionButton = (
    text: string,
    onPress: () => void,
    variant: 'primary' | 'secondary' | 'danger' = 'primary'
  ) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        variant === 'secondary' && styles.actionButtonSecondary,
        variant === 'danger' && styles.actionButtonDanger,
      ]}
      onPress={onPress}
      disabled={isLocked}
    >
      <Text
        style={[
          styles.actionButtonText,
          variant === 'secondary' && styles.actionButtonTextSecondary,
          variant === 'danger' && styles.actionButtonTextDanger,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  if (isUnlocked) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* ==== HEADER ==== */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onNavigateBack}
            >
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Painel Administrativo</Text>
          </View>

          {/* ==== CONTEÚDO DESBLOQUEADO ==== */}
          <View style={styles.unlockedContent}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>🔓</Text>
            </View>

            <Text style={styles.unlockedTitle}>Acesso Concedido</Text>
            <Text style={styles.unlockedSubtitle}>
              Bem-vindo ao painel administrativo. Selecione uma opção:
            </Text>

            <View style={styles.adminOptions}>
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => {
                  logUserAction('access_logs_from_admin', {
                    action: 'navigate_to_logs',
                  });
                  onAccessLogs();
                }}
              >
                <Text style={styles.adminButtonText}>
                  📊 Acessar Logs do Sistema
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => {
                  logUserAction('admin_panel_info', { action: 'show_info' });
                  Alert.alert(
                    'Informações do Sistema',
                    'Versão: 1.0.0\nPlataforma: React Native\nModo: Administrativo'
                  );
                }}
              >
                <Text style={styles.adminButtonText}>
                  ℹ️ Informações do Sistema
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => {
                  logUserAction('admin_panel_machine_status_open', {
                    action: 'open_machine_status',
                  });
                  setShowMachineStatus(true);
                }}
              >
                <Text style={styles.adminButtonText}>🧰 Status da máquina</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => {
                  logUserAction('admin_panel_simulator_controls_open', {
                    action: 'open_simulator_controls',
                  });
                  onAccessSimulatorControls();
                }}
              >
                <Text style={styles.adminButtonText}>
                  🎮 Controles do Simulador
                </Text>
              </TouchableOpacity>
            </View>
            <MachineStatusModal
              visible={showMachineStatus}
              onClose={() => setShowMachineStatus(false)}
            />
            <SimulatorControlsModal
              visible={showSimulatorControls}
              onClose={() => setShowSimulatorControls(false)}
              simulator={simulator}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* ==== HEADER ==== */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Painel Administrativo</Text>
        </View>

        {/* ==== DISPLAY DA SENHA ==== */}
        <View style={styles.passwordDisplay}>
          <Text style={styles.passwordLabel}>Senha de Acesso:</Text>
          <View style={styles.passwordInput}>
            {password.split('').map((char, index) => (
              <View key={index} style={styles.passwordDot}>
                <Text style={styles.passwordDotText}>●</Text>
              </View>
            ))}
            {Array.from({ length: 4 - password.length }).map((_, index) => (
              <View key={`empty-${index}`} style={styles.passwordDotEmpty}>
                <Text style={styles.passwordDotEmptyText}>○</Text>
              </View>
            ))}
          </View>

          {attempts > 0 && (
            <Text style={styles.attemptsText}>
              Tentativas: {attempts}/{MAX_ATTEMPTS}
            </Text>
          )}

          {isLocked && (
            <Text style={styles.lockedText}>
              🔒 Painel bloqueado por segurança
            </Text>
          )}
        </View>

        {/* ==== TECLADO NUMÉRICO ==== */}
        <View style={styles.keypad}>
          <View style={styles.keypadRow}>
            {renderNumberButton('1')}
            {renderNumberButton('2')}
            {renderNumberButton('3')}
          </View>
          <View style={styles.keypadRow}>
            {renderNumberButton('4')}
            {renderNumberButton('5')}
            {renderNumberButton('6')}
          </View>
          <View style={styles.keypadRow}>
            {renderNumberButton('7')}
            {renderNumberButton('8')}
            {renderNumberButton('9')}
          </View>
          <View style={styles.keypadRow}>
            {renderActionButton('C', handleClear, 'secondary')}
            {renderNumberButton('0')}
            {renderActionButton('⌫', handleDelete, 'secondary')}
          </View>
        </View>

        {/* ==== BOTÃO DE ACESSO ==== */}
        <View style={styles.accessSection}>
          <TouchableOpacity
            style={[
              styles.accessButton,
              (password.length !== 4 || isLocked) &&
                styles.accessButtonDisabled,
            ]}
            onPress={handleAccess}
            disabled={password.length !== 4 || isLocked}
          >
            <Text style={styles.accessButtonText}>🔓 ACESSAR</Text>
          </TouchableOpacity>
        </View>

        {/* ==== DICA ==== */}
        <View style={styles.hintSection}>
          <Text style={styles.hintText}>
            💡 Dica: A senha é um número de 4 dígitos
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const SimulatorControlsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  simulator: any;
}> = ({ visible, onClose, simulator }) => {
  const { status } = simulator;

  const formatTime = (time?: { hours: number; minutes: number }) => {
    if (!time) return '--:--';
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  };

  const getPreTestStatusText = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Não Iniciado';
      case 'in_progress':
        return 'Em Processo';
      case 'completed':
        return 'Concluído';
      default:
        return 'Desconhecido';
    }
  };

  const getPreTestStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return MUTED;
      case 'in_progress':
        return '#f59e0b';
      case 'completed':
        return SUCCESS_GREEN;
      default:
        return MUTED;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Controles do Simulador</Text>
          <View style={styles.connectionStatus}>
            <Text style={styles.modalSubtitle}>
              Conexão: {status.connected ? '✅ Conectado' : '❌ Desconectado'}
            </Text>
            {!status.connected && (
              <TouchableOpacity
                style={styles.reconnectButton}
                onPress={() => simulator.connect()}
              >
                <Text style={styles.reconnectButtonText}>🔄 Reconectar</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Status da Máquina */}
            <View style={styles.controlSection}>
              <Text style={styles.sectionTitle}>Status da Máquina</Text>

              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => {
                  // Adicionar diretamente aos logs
                  const timestamp = new Date().toLocaleTimeString();
                  status.logs = status.logs || [];
                  status.logs.unshift(
                    `[${timestamp}] 🔋 Obtendo status da bateria...`
                  );
                  if (status.status) {
                    status.logs.unshift(
                      `[${timestamp}] 🔋 Bateria: ${status.status.batteryPercent}%`
                    );
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
                  // Adicionar diretamente aos logs
                  const timestamp = new Date().toLocaleTimeString();
                  status.logs = status.logs || [];
                  status.logs.unshift(
                    `[${timestamp}] 🌡️ Obtendo temperatura do bloco...`
                  );
                  if (status.status) {
                    status.logs.unshift(
                      `[${timestamp}] 🌡️ Temperatura: ${status.status.blockTemperatureC}°C`
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
                  // Adicionar diretamente aos logs
                  const timestamp = new Date().toLocaleTimeString();
                  status.logs = status.logs || [];
                  status.logs.unshift(
                    `[${timestamp}] ⏱️ Obtendo status de aquecimento...`
                  );
                  if (status.status) {
                    const time = status.status.blockHeatingTime;
                    status.logs.unshift(
                      `[${timestamp}] ⏱️ Tempo de Aquecimento: ${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`
                    );
                  }
                }}
              >
                <Text style={styles.statusButtonText}>
                  ⏱️ Obter Status de Aquecimento
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => {
                  // Adicionar diretamente aos logs
                  const timestamp = new Date().toLocaleTimeString();
                  status.logs = status.logs || [];
                  status.logs.unshift(
                    `[${timestamp}] 🔧 Obtendo status do equipamento...`
                  );
                  if (status.status) {
                    const equipStatus =
                      status.status.equipmentStatus === 'analysis'
                        ? 'Em Análise'
                        : 'Standby';
                    status.logs.unshift(
                      `[${timestamp}] 🔧 Status do Equipamento: ${equipStatus}`
                    );
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
                  // Adicionar diretamente aos logs
                  const timestamp = new Date().toLocaleTimeString();
                  status.logs = status.logs || [];
                  status.logs.unshift(
                    `[${timestamp}] 🧪 Obtendo status do pré-teste...`
                  );
                  if (status.status) {
                    const preTestStatus =
                      status.status.preTestStatus === 'not_started'
                        ? 'Não Iniciado'
                        : status.status.preTestStatus === 'in_progress'
                          ? 'Em Processo'
                          : 'Concluído';
                    status.logs.unshift(
                      `[${timestamp}] 🧪 Status do Pré-teste: ${preTestStatus}`
                    );
                  }
                }}
              >
                <Text style={styles.statusButtonText}>
                  🧪 Obter Status do Pré-teste
                </Text>
              </TouchableOpacity>
            </View>

            {/* Controles Principais */}
            <View style={styles.controlSection}>
              <Text style={styles.sectionTitle}>Controles Principais</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    status.isRunning
                      ? styles.controlButtonDanger
                      : styles.controlButtonSuccess,
                  ]}
                  onPress={
                    status.isRunning
                      ? simulator.stopSimulator
                      : simulator.startSimulator
                  }
                >
                  <Text style={styles.controlButtonText}>
                    {status.isRunning ? '⏹️ Parar' : '▶️ Iniciar'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    status.bluetoothConnected
                      ? styles.controlButtonPrimary
                      : styles.controlButtonSecondary,
                  ]}
                  onPress={simulator.toggleBluetooth}
                >
                  <Text style={styles.controlButtonText}>
                    {status.bluetoothConnected ? '📱 BT On' : '📱 BT Off'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Testes Específicos */}
            <View style={styles.controlSection}>
              <Text style={styles.sectionTitle}>Testes Específicos</Text>

              <TouchableOpacity
                style={styles.testButton}
                onPress={() => simulator.setPreset('test_cinomose')}
              >
                <Text style={styles.testButtonText}>
                  🧪 Teste Cinomose (65°C)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.testButton}
                onPress={() => simulator.setPreset('test_ibv_geral')}
              >
                <Text style={styles.testButtonText}>
                  🔬 Teste IBV Geral (80°C)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.testButton}
                onPress={() => simulator.setPreset('test_ibv_especifico')}
              >
                <Text style={styles.testButtonText}>
                  🧬 Teste IBV Específico (90°C)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Status do Hardware */}
            {status.status && (
              <View style={styles.controlSection}>
                <Text style={styles.sectionTitle}>Status do Hardware</Text>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Bateria:</Text>
                  <Text style={styles.statusValue}>
                    {status.status.batteryPercent}%
                  </Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Temperatura:</Text>
                  <Text style={styles.statusValue}>
                    {status.status.blockTemperatureC}°C
                  </Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Tempo Aquecimento:</Text>
                  <Text style={styles.statusValue}>
                    {formatTime(status.status.blockHeatingTime)}
                  </Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status Equipamento:</Text>
                  <Text style={styles.statusValue}>
                    {status.status.equipmentStatus === 'analysis'
                      ? 'Análise'
                      : 'Standby'}
                  </Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Tempo Decorrido:</Text>
                  <Text style={styles.statusValue}>
                    {formatTime(status.status.analysisElapsed)}
                  </Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status Pré-teste:</Text>
                  <Text
                    style={[
                      styles.statusValue,
                      {
                        color: getPreTestStatusColor(
                          status.status.preTestStatus
                        ),
                      },
                    ]}
                  >
                    {getPreTestStatusText(status.status.preTestStatus)}
                  </Text>
                </View>

                {status.status.testType &&
                  status.status.testType !== 'none' && (
                    <View style={styles.statusRow}>
                      <Text style={styles.statusLabel}>Teste Ativo:</Text>
                      <Text style={styles.statusValue}>
                        {status.status.testType === 'cinomose'
                          ? 'Cinomose (65°C)'
                          : status.status.testType === 'ibv_geral'
                            ? 'IBV Geral (80°C)'
                            : status.status.testType === 'ibv_especifico'
                              ? 'IBV Específico (90°C)'
                              : status.status.testType}
                      </Text>
                    </View>
                  )}
              </View>
            )}

            {/* Logs */}
            <View style={styles.controlSection}>
              <Text style={styles.sectionTitle}>Logs do Sistema</Text>
              <ScrollView style={styles.logsContainer}>
                {status.logs && status.logs.length > 0 ? (
                  status.logs.slice(0, 10).map((log: any, index: any) => (
                    <View key={index} style={styles.logRow}>
                      <Text style={styles.logText}>{log}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noLogsText}>Nenhum log disponível</Text>
                )}
              </ScrollView>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const MachineStatusModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { status, connected } = useHardwareStatus();

  const formatHm = (hm?: { hours: number; minutes: number }) => {
    if (!hm) return '--:--';
    const h = String(hm.hours ?? 0).padStart(2, '0');
    const m = String(hm.minutes ?? 0).padStart(2, '0');
    return `${h}:${m}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Status da máquina</Text>
          <Text style={styles.modalSubtitle}>
            Conexão: {connected ? 'Conectado' : 'Desconectado'}
          </Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Bateria</Text>
            <Text style={styles.statusValue}>
              {status ? `${status.batteryPercent}%` : '--'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Temp. do bloco</Text>
            <Text style={styles.statusValue}>
              {status ? `${status.blockTemperatureC}°C` : '--'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Tempo aquecimento</Text>
            <Text style={styles.statusValue}>
              {status ? formatHm(status.blockHeatingTime) : '--:--'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status do equipamento</Text>
            <Text style={styles.statusValue}>
              {status
                ? status.equipmentStatus === 'analysis'
                  ? 'Em análise'
                  : 'Standby'
                : '--'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Decorrido desde início</Text>
            <Text style={styles.statusValue}>
              {status ? formatHm(status.analysisElapsed) : '--:--'}
            </Text>
          </View>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingTop: Platform.OS === 'android' ? 24 + 60 : 24, // Padding muito maior para Android
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingTop: Platform.OS === 'android' ? 20 : 0, // Padding extra maior para Android
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
  passwordDisplay: {
    alignItems: 'center',
    marginBottom: 40,
  },
  passwordLabel: {
    fontSize: 16,
    color: TEXT,
    marginBottom: 16,
    fontWeight: '600',
  },
  passwordInput: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  passwordDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordDotText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordDotEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: MUTED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordDotEmptyText: {
    color: MUTED,
    fontSize: 16,
  },
  attemptsText: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 8,
  },
  lockedText: {
    fontSize: 14,
    color: ERROR_RED,
    fontWeight: '600',
  },
  keypad: {
    marginBottom: 32,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  numberButton: {
    width: (width - 80) / 3,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT,
  },
  actionButton: {
    width: (width - 80) / 3,
    height: 60,
    backgroundColor: GOLD_BG,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GOLD,
  },
  actionButtonSecondary: {
    backgroundColor: '#f3f4f6',
    borderColor: MUTED,
  },
  actionButtonDanger: {
    backgroundColor: '#fef2f2',
    borderColor: ERROR_RED,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: GOLD,
  },
  actionButtonTextSecondary: {
    color: MUTED,
  },
  actionButtonTextDanger: {
    color: ERROR_RED,
  },
  accessSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  accessButton: {
    backgroundColor: SUCCESS_GREEN,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  accessButtonDisabled: {
    backgroundColor: MUTED,
  },
  accessButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintSection: {
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: MUTED,
    fontStyle: 'italic',
  },
  unlockedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SUCCESS_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
  },
  unlockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT,
    marginBottom: 12,
    textAlign: 'center',
  },
  unlockedSubtitle: {
    fontSize: 16,
    color: MUTED,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  adminOptions: {
    width: '100%',
    gap: 16,
  },
  adminButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adminButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 16,
    textAlign: 'center',
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
    fontSize: 14,
    color: MUTED,
  },
  statusValue: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: GOLD_BG,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  modalCloseText: {
    color: GOLD,
    fontWeight: '600',
  },
  // Estilos para o modal do simulador
  scrollView: {
    maxHeight: 400,
    marginBottom: 16,
  },
  controlSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT,
    marginBottom: 12,
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
    fontSize: 14,
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  testButtonText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  logsContainer: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    maxHeight: 120,
  },
  logRow: {
    flexDirection: 'row',
    marginBottom: 2,
    width: '100%',
  },
  logText: {
    color: '#10b981',
    fontSize: 12,
    fontFamily: 'monospace',
    flexWrap: 'wrap',
    flex: 1,
  },
  noLogsText: {
    color: MUTED,
    fontSize: 12,
    fontStyle: 'italic',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
