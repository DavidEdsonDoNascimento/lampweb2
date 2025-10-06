// HomeWip.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigationLogger } from '@services/logging';
import Logo from '@assets/lampinpuntologo.svg';
import { BottomBar } from '@/ui/BottomBar';
import { HomeHeader } from '../components/HomeHeader';

const GOLD = '#b8860b';
const TEXT = '#1f2937';
const MUTED = '#6b7280';

interface Props {
  userName: string;
  onBack?: () => void;
  onSearch?: () => void;
  onShare?: () => void;
  onStartTest: () => void;
}

export const HomeWip: React.FC<Props> = ({
  userName,
  onBack,
  onSearch,
  onShare,
  onStartTest,
}) => {
  const { logUserAction } = useNavigationLogger({
    screenName: 'HomeWip',
    additionalContext: { userName, hasBackAction: !!onBack },
  });

  const handleBack = () => {
    logUserAction('back_button_pressed', { action: 'navigate_back' });
    onBack?.();
  };

  const handleSearch = () => {
    logUserAction('search_button_pressed', { action: 'search' });
    onSearch?.();
  };

  const handleShare = () => {
    logUserAction('share_button_pressed', { action: 'share' });
    onShare?.();
  };

  const handleStartTest = () => {
    logUserAction('start_test_button_pressed', { action: 'start_test' });
    onStartTest();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* ==== HEADER ==== */}
        <HomeHeader
          {...(onBack && { onBack: handleBack })}
          {...(onSearch && { onSearch: handleSearch })}
          {...(onShare && { onShare: handleShare })}
          showBackButton={!!onBack}
          showSearchButton={!!onSearch}
          showShareButton={!!onShare}
        />

        {/* ==== LOGO ==== */}
        <View style={styles.logoWrap}>
          <Logo width={160} height={160} />
        </View>

        {/* ==== TEXTO CENTRAL ==== */}
        <View style={styles.centerText}>
          <Text style={styles.welcome}>
            Bem-vinda, <Text style={styles.welcomeBold}>{userName}!</Text>
          </Text>

          {/* separador */}
          <View style={styles.divider} />

          <Text style={styles.question}>Vamos começar?</Text>
          <Text style={styles.helper}>
            Toque no botão abaixo para{'\n'}iniciar o teste.
          </Text>
        </View>

        {/* ==== BOTÃO PRINCIPAL ==== */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleStartTest}>
          <Text style={styles.primaryBtnText}>Iniciar Teste</Text>
        </TouchableOpacity>

        {/* ==== BARRA INFERIOR ==== */}
        <BottomBar fixed={true} />
      </View>
    </SafeAreaView>
  );
};

/* ================== styles ================== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },
  headerRight: { flexDirection: 'row', gap: 12 },
  headerBtn: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  /* LOGO */
  logoWrap: {
    alignItems: 'center',
    marginTop: 32,
  },
  logoPlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: GOLD,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },

  /* TEXTOS CENTRAIS */
  centerText: {
    alignItems: 'center',
    marginTop: 16,
  },
  welcome: { fontSize: 20, color: MUTED, textAlign: 'center' },
  welcomeBold: { color: GOLD, fontWeight: '700' },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: GOLD,
    marginVertical: 16,
  },
  question: { fontSize: 18, fontWeight: '700', color: GOLD },
  helper: {
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
    marginTop: 4,
  },

  /* BOTÃO */
  primaryBtn: {
    marginTop: 24,
    marginBottom: 70,
    marginHorizontal: 32,
    backgroundColor: GOLD,
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
