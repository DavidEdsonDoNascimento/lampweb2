// src/screens/CreateAccount.tsx
import DnaHeader from '@/ui/DnaHeader';
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { COLORS, SP } from '@/ui/tokens';
import { BottomBar } from '@/ui/BottomBar';
import { ProgressBar } from '@/presentation/components';

// Ornamento superior (ajuste o caminho se necessário)
import Dna from '@assets/dna.svg';

interface Props {
  onBack?: () => void;
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void> | void;
  onGoToLogin?: () => void;
}

const CreateAccount: React.FC<Props> = ({ onBack, onSubmit, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!onSubmit) return;
    try {
      setLoading(true);
      await onSubmit({ name, email, password: pwd });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Ornamento DNA no topo */}
      <DnaHeader>
        {/* se quiser colocar algo central (ex: logo menor), fica aqui */}
      </DnaHeader>

      <View style={styles.container}>
        {/* Botão Voltar */}
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <AntDesign name="arrowleft" size={25} color={COLORS.gold} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title}>Criar conta</Text>

        {/* Formulário */}
        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui seu nome"
            placeholderTextColor={COLORS.muted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite aqui seu e-mail"
            placeholderTextColor={COLORS.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Senha</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              placeholder="Crie uma senha"
              placeholderTextColor={COLORS.muted}
              value={pwd}
              onChangeText={setPwd}
              secureTextEntry={!showPwd}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPwd(v => !v)}
              accessibilityLabel={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <Feather
                name={showPwd ? 'eye-off' : 'eye'}
                size={18}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cadastrarBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.primaryText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/* Link para login */}
        <Text style={styles.footerText}>
          Já tem uma conta?{' '}
          <Text style={styles.footerLink} onPress={onGoToLogin}>
            Faça login aqui.
          </Text>
        </Text>

        {/* Barra fina de progresso (decorativa) */}
        <ProgressBar width="50%" marginTop={SP.sm} />

        {/* Barra inferior dourada fixa */}
        <BottomBar fixed={true} />
      </View>
    </SafeAreaView>
  );
};

export { CreateAccount };
export default CreateAccount;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: SP.lg, paddingTop: SP.sm },

  // DNA topo
  dnaWrap: {
    position: 'absolute',
    top: 0,
    left: -40,
    right: -40,
    alignItems: 'center',
  },

  // Voltar
  backBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: -150,
    marginBottom: 25,
  },
  backText: { color: COLORS.gold, fontSize: 16, fontWeight: '600' },

  // Título
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.gold,
    marginTop: 85,
  },

  // Form
  form: { marginTop: SP.xl },
  label: { color: COLORS.muted, fontSize: 12, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  inputFlex: { flex: 1 },
  eyeBtn: {
    width: 40,
    height: 40,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // CTA
  cadastrarBtn: {
    marginTop: 70,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // Footer link
  footerText: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 50,
  },

  footerLink: {
    color: COLORS.gold,
    fontWeight: '700',
  },
});
