import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';

// Importar polyfill SQLite para web ANTES de qualquer outro import
if (Platform.OS === 'web') {
  require('@data/storage/sqlite-web-polyfill');
}

/**
 * 🧪 BOTÃO DE DESENVOLVIMENTO - GUIA DE USO
 *
 * O botão "Testes" na tela de login é uma ferramenta de desenvolvimento que permite
 * acesso rápido a telas em desenvolvimento sem precisar navegar pelo fluxo normal.
 *
 * COMO USAR:
 * 1. Para trocar o destino do botão, modifique a função handleNavigateToAvailableTests()
 * 2. Altere o setCurrentState('availabletests') para setCurrentState('suaNovaTela')
 * 3. Adicione o novo estado no tipo: 'splash' | 'login' | ... | 'suaNovaTela'
 * 4. Adicione o caso no switch do renderScreen()
 *
 * EXEMPLO:
 * - setCurrentState('minhaNovaTela');
 * - Adicionar 'minhaNovaTela' no tipo de estado
 * - Adicionar case 'minhaNovaTela': return <MinhaNovaTela />
 */
import {
  testSQLiteCompatibility,
  getSQLiteVersion,
} from '@data/storage/sqlite-test';
import {
  SplashScreen,
  LoginScreenWip,
  HomeScreen,
  HomeWip,
  LogsScreen,
  AvailableTests,
  VideoTutorial,
  AdminPanelScreen,
  MachineStatusScreen,
  SimulatorControlsScreen,
} from '@presentation/screens';
import { CreateAccount } from '@presentation/screens/CreateAccount';
import { logger, sessionContextManager } from '@services/logging';

export const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<
    | 'splash'
    | 'login'
    | 'createaccount'
    | 'home'
    | 'homewip'
    | 'logs'
    | 'availabletests'
    | 'videotutorial'
    | 'admin'
    | 'machineStatus'
    | 'simulatorControls'
  >('splash');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const sessionContext = sessionContextManager.getSessionContext();
    logger.info(
      'App iniciado',
      {
        appVersion: sessionContext.appVersion,
        platform: sessionContext.platform,
        sessionId: sessionContext.sessionId,
        deviceId: sessionContext.deviceId,
        timestamp: new Date().toISOString(),
      },
      'app'
    );

    // Testar SQLite após um delay
    setTimeout(async () => {
      logger.info('Iniciando teste SQLite', {}, 'sqlite');
      getSQLiteVersion();
      const result = await testSQLiteCompatibility();
      logger.info('Resultado do teste SQLite', { result }, 'sqlite');
    }, 1000);
  }, []);

  const handleSplashFinish = () => {
    logger.info(
      'Splash finalizada, navegando para login',
      {
        from: 'splash',
        to: 'login',
        duration: '2000ms',
      },
      'navigation'
    );
    setCurrentState('login');
  };

  const handleLogin = async (email: string, password: string) => {
    logger.info(
      'Login realizado',
      {
        email,
        method: 'manual',
        timestamp: new Date().toISOString(),
      },
      'auth'
    );
    // Aqui você pode implementar a lógica real de autenticação
    return Promise.resolve();
  };

  const handleNavigateToHome = () => {
    const newUser = 'Usuário Google';
    setCurrentUser(newUser);

    // Atualiza o contexto da sessão com o usuário
    sessionContextManager.updateContext({ userId: newUser });
    logger.updateSessionContext();

    logger.info(
      'Navegando para HomeWip',
      {
        from: currentState,
        to: 'homewip',
        trigger: 'login_success',
        user: newUser,
      },
      'navigation'
    );
    setCurrentState('homewip');
  };

  const handleLogout = () => {
    const previousUser = currentUser;
    setCurrentUser(null);

    // Gera nova sessão para o logout
    sessionContextManager.refreshSession();
    logger.updateSessionContext();

    logger.info(
      'Logout realizado',
      {
        from: currentState,
        to: 'login',
        trigger: 'user_action',
        previousUser,
      },
      'auth'
    );
    setCurrentState('login');
  };

  const handleNavigateToLogs = () => {
    logger.info(
      'Navegando para logs',
      {
        from: currentState,
        to: 'logs',
        trigger: 'user_action',
        user: currentUser,
      },
      'navigation'
    );
    setCurrentState('logs');
  };

  const handleNavigateBackFromLogs = () => {
    logger.info(
      'Voltando da tela de logs',
      {
        from: 'logs',
        to: 'homewip',
        trigger: 'back_button',
        user: currentUser,
      },
      'navigation'
    );
    setCurrentState('homewip');
  };

  const handleNavigateToHomeWip = () => {
    const newUser = 'Usuário Telefone';
    setCurrentUser(newUser);

    // Atualiza o contexto da sessão com o usuário
    sessionContextManager.updateContext({ userId: newUser });
    logger.updateSessionContext();

    logger.info(
      'Navegando para HomeWip',
      {
        from: currentState,
        to: 'homewip',
        trigger: 'login_phone',
        user: newUser,
      },
      'navigation'
    );
    setCurrentState('homewip');
  };

  const handleNavigateBackFromHomeWip = () => {
    const previousUser = currentUser;
    setCurrentUser(null);

    // Gera nova sessão para o logout
    sessionContextManager.refreshSession();
    logger.updateSessionContext();

    logger.info(
      'Voltando da tela HomeWip',
      {
        from: 'homewip',
        to: 'login',
        trigger: 'back_button',
        previousUser,
      },
      'navigation'
    );
    setCurrentState('login');
  };

  const handleNavigateToCreateAccount = () => {
    logger.info(
      'Navegando para CreateAccount',
      {
        from: currentState,
        to: 'createaccount',
        trigger: 'register_button',
      },
      'navigation'
    );
    setCurrentState('createaccount');
  };

  const handleNavigateBackFromCreateAccount = () => {
    logger.info(
      'Voltando da tela CreateAccount',
      {
        from: 'createaccount',
        to: 'login',
        trigger: 'back_button',
      },
      'navigation'
    );
    setCurrentState('login');
  };

  const handleCreateAccountSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    logger.info(
      'Tentativa de criação de conta',
      {
        email: data.email,
        name: data.name,
        timestamp: new Date().toISOString(),
      },
      'auth'
    );

    // Aqui você pode implementar a lógica real de criação de conta
    // Por enquanto, vamos simular sucesso e navegar para home
    const newUser = data.name;
    setCurrentUser(newUser);
    sessionContextManager.updateContext({ userId: newUser });
    logger.updateSessionContext();

    logger.info(
      'Conta criada com sucesso, navegando para HomeWip',
      {
        from: 'createaccount',
        to: 'homewip',
        trigger: 'account_created',
        user: newUser,
      },
      'navigation'
    );
    setCurrentState('homewip');
  };

  const handleStartTest = () => {
    logger.info(
      'Iniciando teste',
      {
        from: currentState,
        to: 'machineStatus',
        trigger: 'start_test_button',
        user: currentUser,
        timestamp: new Date().toISOString(),
      },
      'test'
    );
    setCurrentState('machineStatus');
  };

  const handleAccessAdminPanel = () => {
    logger.info(
      'Acessando painel administrativo',
      {
        from: currentState,
        to: 'admin',
        trigger: 'secret_sequence',
        user: currentUser,
      },
      'admin'
    );
    setCurrentState('admin');
  };

  const handleNavigateBackFromAdmin = () => {
    logger.info(
      'Voltando do painel administrativo',
      {
        from: 'admin',
        to: 'login',
        trigger: 'back_button',
        user: currentUser,
      },
      'navigation'
    );
    setCurrentState('login');
  };

  const handleAccessLogsFromAdmin = () => {
    logger.info(
      'Acessando logs do painel administrativo',
      {
        from: 'admin',
        to: 'logs',
        trigger: 'admin_panel_access',
        user: currentUser,
      },
      'admin'
    );
    setCurrentState('logs');
  };

  const handleAccessSimulatorControls = () => {
    logger.info(
      'Acessando controles do simulador',
      {
        from: currentState,
        to: 'simulatorControls',
        trigger: 'simulator_controls_button',
        user: currentUser,
      },
      'admin'
    );
    setCurrentState('simulatorControls');
  };

  // 🧪 BOTÃO DE DESENVOLVIMENTO - Função para navegar para tela em desenvolvimento
  // Para trocar o destino: altere o estado 'availabletests' para o estado da sua nova tela
  // Exemplo: setCurrentState('minhaNovaTela');
  const handleNavigateToTests = () => {
    logger.info(
      'Navegando para videotutorial',
      {
        from: currentState,
        to: 'videotutorial',
        trigger: 'test_button',
        user: currentUser,
      },
      'navigation'
    );
    setCurrentState('videotutorial');
  };

  const handleNavigateBackFromAvailableTests = () => {
    logger.info(
      'Voltando da tela AvailableTests',
      {
        from: 'availabletests',
        to: 'login',
        trigger: 'back_button',
        user: currentUser,
      },
      'navigation'
    );
    setCurrentState('login');
  };

  const handleNavigateToHomeFromTests = () => {
    logger.info(
      'Navegando para HomeWip a partir de AvailableTests',
      {
        from: 'availabletests',
        to: 'homewip',
        trigger: 'home_button',
        user: currentUser,
      },
      'navigation'
    );
    setCurrentState('homewip');
  };

  const handleNavigateToHistoryFromTests = () => {
    logger.info(
      'Navegando para Logs a partir de AvailableTests',
      {
        from: 'availabletests',
        to: 'logs',
        trigger: 'history_button',
        user: currentUser,
      },
      'navigation'
    );
    setCurrentState('logs');
  };

  const handleSelectTest = (
    testKey: 'cinomose' | 'ibv_geral' | 'ibv_especifico'
  ) => {
    logger.info(
      'Teste selecionado',
      {
        testKey,
        from: 'availabletests',
        user: currentUser,
        timestamp: new Date().toISOString(),
      },
      'test'
    );
    // Aqui você pode implementar a lógica para iniciar o teste específico
    console.log(`Teste selecionado: ${testKey}`);
  };

  const handleNavigateToVideoTutorial = () => {
    logger.info(
      'Navegando para VideoTutorial',
      {
        from: currentState,
        to: 'videotutorial',
        trigger: 'video_tutorial_button',
        user: currentUser,
      },
      'navigation'
    );
    setCurrentState('videotutorial');
  };

  const handleNavigateBackFromVideoTutorial = () => {
    logger.info(
      'Voltando da tela VideoTutorial',
      {
        from: 'videotutorial',
        to: 'home',
        trigger: 'back_button',
        user: currentUser,
      },
      'navigation'
    );
    setCurrentState('homewip');
  };

  const renderScreen = () => {
    switch (currentState) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;

      case 'login':
        return (
          <LoginScreenWip
            onLoginPhone={async () => handleNavigateToHomeWip()}
            onLoginGoogle={async () => handleNavigateToHome()}
            onRegister={handleNavigateToCreateAccount}
            onNavigateToTests={handleNavigateToTests}
            onAccessAdminPanel={handleAccessAdminPanel}
          />
        );

      case 'createaccount':
        return (
          <CreateAccount
            onBack={handleNavigateBackFromCreateAccount}
            onSubmit={handleCreateAccountSubmit}
            onGoToLogin={handleNavigateBackFromCreateAccount}
          />
        );

      case 'homewip':
        return (
          <HomeWip
            userName={currentUser || 'Usuário'}
            onBack={handleNavigateBackFromHomeWip}
            onSearch={() => {
              logger.info(
                'Busca solicitada',
                {
                  screen: 'homewip',
                  user: currentUser,
                },
                'user_action'
              );
              console.log('Busca não implementada');
            }}
            onShare={() => {
              logger.info(
                'Compartilhar solicitado',
                {
                  screen: 'homewip',
                  user: currentUser,
                },
                'user_action'
              );
              console.log('Compartilhar não implementado');
            }}
            onStartTest={handleStartTest}
          />
        );

      case 'logs':
        return <LogsScreen onNavigateBack={handleNavigateBackFromLogs} />;

      case 'availabletests':
        return (
          <AvailableTests
            onBack={handleNavigateBackFromAvailableTests}
            onGoHome={handleNavigateToHomeFromTests}
            onOpenHistory={handleNavigateToHistoryFromTests}
            onSelectTest={handleSelectTest}
          />
        );

      case 'videotutorial':
        return (
          <VideoTutorial
            onBack={handleNavigateBackFromVideoTutorial}
            onGoHome={handleNavigateToHomeFromTests}
            onOpenHistory={handleNavigateToHistoryFromTests}
          />
        );
      case 'admin':
        return (
          <AdminPanelScreen
            onNavigateBack={handleNavigateBackFromAdmin}
            onAccessLogs={handleAccessLogsFromAdmin}
            onAccessSimulatorControls={handleAccessSimulatorControls}
          />
        );

      case 'machineStatus':
        return (
          <MachineStatusScreen onBack={() => setCurrentState('homewip')} />
        );

      case 'simulatorControls':
        return (
          <SimulatorControlsScreen
            onNavigateBack={() => setCurrentState('admin')}
          />
        );

      default:
        logger.error(
          'Estado de tela desconhecido',
          {
            currentState,
            timestamp: new Date().toISOString(),
          },
          'app'
        );
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Erro</Text>
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
