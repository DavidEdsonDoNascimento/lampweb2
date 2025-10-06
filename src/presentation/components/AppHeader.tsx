// AppHeader.tsx - Componente reutilizável para cabeçalho das telas
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const GOLD = '#b8860b';
const GOLD_BG = '#fcf5e6';

interface Props {
  onBack?: () => void;
  onGoHome?: () => void;
  onOpenHistory?: () => void;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showHistoryButton?: boolean;
  backButtonText?: string;
}

export const AppHeader: React.FC<Props> = ({
  onBack,
  onGoHome,
  onOpenHistory,
  showBackButton = true,
  showHomeButton = true,
  showHistoryButton = true,
  backButtonText = 'Voltar',
}) => {
  return (
    <View style={styles.header}>
      {/* Botão Voltar */}
      {showBackButton && onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backPill}>
          <AntDesign name="left" size={16} color={GOLD} />
          <Text style={styles.backText}>{backButtonText}</Text>
        </TouchableOpacity>
      )}

      {/* Espaçador para centralizar quando não há botão voltar */}
      {!showBackButton && <View style={styles.spacer} />}

      {/* Botões da direita */}
      <View style={styles.headerRight}>
        {showHistoryButton && onOpenHistory && (
          <TouchableOpacity onPress={onOpenHistory} style={styles.iconBtn}>
            <MaterialCommunityIcons name="history" size={18} color={GOLD} />
          </TouchableOpacity>
        )}
        {showHomeButton && onGoHome && (
          <TouchableOpacity onPress={onGoHome} style={styles.iconBtn}>
            <AntDesign name="home" size={18} color={GOLD} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GOLD_BG,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f1e7cf',
  },
  backText: {
    color: GOLD,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f1e7cf',
    backgroundColor: GOLD_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppHeader;
