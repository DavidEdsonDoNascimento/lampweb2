// AvailableTests.tsx
import React, { memo, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { AppHeader } from '@presentation/components';
import { BottomBar } from '@/ui/BottomBar';

export type TestKey = 'cinomose' | 'ibv_geral' | 'ibv_especifico';

interface TestItem {
  key: TestKey;
  label: string;
  temperatureC: number; // 65
  incubation: string; // "30min" | "60min" etc.
}

interface Props {
  onBack?: () => void;
  onGoHome?: () => void;
  onOpenHistory?: () => void;
  onSelectTest?: (key: TestKey) => void; // dispara ao tocar em um card
  onConfirmSelection?: (key: TestKey) => void; // dispara ao tocar em "Selecionar"
  tests?: TestItem[];
}

const GOLD = '#b8860b';
const GOLD_BG = '#fcf5e6';
const GRAY_BG = '#f3f4f6';
const TEXT = '#1f2937';
const MUTED = '#6b7280';
const CARD = '#ffffff';
const BORDER = '#cbd5e1';
const DISABLED = '#e5e7eb';

/** Espaço para não colidir com a BottomBar fixa */
const BOTTOM_GUARD = 120;

const DEFAULT_TESTS: TestItem[] = [
  { key: 'cinomose', label: 'Cinomose', temperatureC: 65, incubation: '30min' },
  {
    key: 'ibv_geral',
    label: 'IBV Geral',
    temperatureC: 65,
    incubation: '60min',
  },
  {
    key: 'ibv_especifico',
    label: 'IBV Específico',
    temperatureC: 65,
    incubation: '60min',
  },
];

const AvailableTests: React.FC<Props> = ({
  onBack,
  onGoHome,
  onOpenHistory,
  onSelectTest,
  onConfirmSelection,
  tests = DEFAULT_TESTS,
}) => {
  const [selected, setSelected] = useState<TestKey | null>(null);

  const handleSelect = (key: TestKey) => {
    setSelected(curr => (curr === key ? null : key)); // toggle
    onSelectTest?.(key);
  };

  const canConfirm = useMemo(() => !!selected, [selected]);

  const confirm = () => {
    if (!selected) return;
    onConfirmSelection?.(selected);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* decorativos */}
      <View pointerEvents="none" style={styles.decoTop} />
      <View pointerEvents="none" style={styles.decoBottom} />

      {/* Header */}
      <AppHeader
        {...(onBack && { onBack })}
        {...(onGoHome && { onGoHome })}
        {...(onOpenHistory && { onOpenHistory })}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <View style={styles.titleWrap}>
          <Text style={styles.titleStrong}>Lista de Testes</Text>
          <Text style={styles.titleLight}>Disponíveis</Text>
        </View>

        {/* Opções com expansão */}
        <View style={styles.options}>
          {tests.map(t => {
            const isSelected = selected === t.key;
            return (
              <ExpandableOption
                key={t.key}
                item={t}
                selected={isSelected}
                onPress={() => handleSelect(t.key)}
                testID={`btn-test-${t.key}`}
              />
            );
          })}
        </View>

        {/* CTA Selecionar */}
        <TouchableOpacity
          style={[styles.cta, !canConfirm && styles.ctaDisabled]}
          activeOpacity={canConfirm ? 0.9 : 1}
          onPress={confirm}
          disabled={!canConfirm}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canConfirm }}
        >
          <Text style={[styles.ctaText, !canConfirm && styles.ctaTextDisabled]}>
            Selecionar
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomBar fixed />
    </SafeAreaView>
  );
};

const ExpandableOption = memo(function ExpandableOption({
  item,
  selected,
  onPress,
  testID,
}: {
  item: TestItem;
  selected: boolean;
  onPress?: () => void;
  testID?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.optionBtn, selected && styles.optionBtnSelected]}
      activeOpacity={0.9}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {item.label}
      </Text>

      {selected && (
        <View style={styles.expandedBox}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              Temperatura: {item.temperatureC}°C
            </Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              Tempo de Incubação: {item.incubation}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // decorativos
  decoTop: {
    position: 'absolute',
    top: -40,
    left: -30,
    width: 220,
    height: 120,
    backgroundColor: GRAY_BG,
    borderRadius: 28,
    transform: [{ rotate: '-8deg' }],
    opacity: 0.55,
  },
  decoBottom: {
    position: 'absolute',
    bottom: -30,
    right: -40,
    width: 240,
    height: 120,
    backgroundColor: GRAY_BG,
    borderRadius: 28,
    transform: [{ rotate: '10deg' }],
    opacity: 0.35,
  },

  scrollContent: {
    paddingBottom: BOTTOM_GUARD,
  },

  // título
  titleWrap: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 36,
  },
  titleStrong: {
    fontSize: 22,
    fontWeight: '800',
    color: GOLD,
  },
  titleLight: {
    marginTop: 2,
    fontSize: 18,
    color: TEXT,
    fontWeight: '400',
  },

  // opções
  options: {
    paddingHorizontal: 20,
    gap: 14,
  },
  optionBtn: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionBtnSelected: {
    backgroundColor: GOLD_BG,
    borderColor: GOLD,
    shadowOpacity: 0.12,
  },
  optionText: {
    color: MUTED,
    fontSize: 15,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: GOLD,
  },

  expandedBox: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginTop: 10,
    gap: 10,
  },
  pill: {
    backgroundColor: '#efe6cf' /* tom mais sólido do GOLD_BG para contraste */,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: GOLD,
    opacity: 0.9,
  },

  // CTA
  cta: {
    alignSelf: 'center',
    marginTop: 100,
    width: '88%',
    borderRadius: 10,
    paddingVertical: 14,
    backgroundColor: GOLD,
    alignItems: 'center',
  },
  ctaDisabled: {
    backgroundColor: DISABLED,
  },
  ctaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  ctaTextDisabled: {
    color: '#9ca3af',
  },
});

export default AvailableTests;
