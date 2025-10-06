// HomeHeader.tsx - Componente de header específico para a tela Home
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

const GOLD = '#b8860b';
const GOLD_BG = '#fcf5e6';

interface Props {
  onBack?: (() => void) | undefined;
  onSearch?: (() => void) | undefined;
  onShare?: (() => void) | undefined;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  showShareButton?: boolean;
  backButtonText?: string;
}

export const HomeHeader: React.FC<Props> = ({
  onBack,
  onSearch,
  onShare,
  showBackButton = true,
  showSearchButton = true,
  showShareButton = true,
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

      {/* Espaçador quando não há botão voltar */}
      {!showBackButton && <View style={styles.spacer} />}

      {/* Botões da direita */}
      <View style={styles.headerRight}>
        {showSearchButton && onSearch && (
          <TouchableOpacity style={styles.headerBtn} onPress={onSearch}>
            <Feather name="search" size={20} color={GOLD} />
          </TouchableOpacity>
        )}
        {showShareButton && onShare && (
          <TouchableOpacity style={styles.headerBtn} onPress={onShare}>
            <Feather name="share-2" size={20} color={GOLD} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 70,
  },
  spacer: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
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
});

export default HomeHeader;
