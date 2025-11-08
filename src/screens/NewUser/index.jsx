import React, { useState, useRef, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, createUserWithEmailAndPassword } from "../../services/firebaseConfig";
import { saveUser } from "../../services/firebaseService";
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { createStyles } from './styles';

const NewUsers = () => {
  const navigation = useNavigation();
  const { colors, shadows, typography, isDarkTheme } = useTheme();
  const { showSuccess, showError, showWarning } = useToast();
  const { success, error } = useHapticFeedback();
  const styles = createStyles();

  // Configurar header dinamicamente baseado no tema
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Voltar',
      headerStyle: {
        backgroundColor: colors.surface,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        color: colors.text,
        fontWeight: '600',
      },
    });
  }, [navigation, colors, isDarkTheme]);
  
  const [nome, setNome] = useState(''); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [nameError, setNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [dataNascError, setDataNascError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  // Estados de foco
  const [nomeFocused, setNomeFocused] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [dataNascFocused, setDataNascFocused] = useState(false);
  
  const passwordRef = useRef(null);

  const handleSignIn = async () => {
    setNameError(!nome);
    setUsernameError(!username);
    setPasswordError(!password);
    setConfirmPasswordError(!confirmPassword);
    setDataNascError(!dataNasc);

    if (!nome || !username || !password || !confirmPassword || !dataNasc) {
      showWarning('Campos obrigatórios, favor preencher');
      return;
    }

    if (confirmPassword !== password) {
      showWarning('Senhas não conferem!');
      passwordRef.current?.focus();
      return;
    }

    await registerUser();
  };

  const registerUser = async () => {
    try {
      setLoading(true);
      
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      
      // 2. Salvar dados adicionais do usuário no Firestore
      await saveUser({
        nome,
        email: username,
        dataNasc,
      });

      success(); // Haptic feedback
      showSuccess('Novo usuário registrado com sucesso!');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (err) {
      error(); // Haptic feedback
      showError(err.message || 'Não foi possível registrar o usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: colors.surface, ...shadows.card }]}>
              <Image
                source={require('../../images/icones.png')} 
                style={styles.logoImage}
              />
            </View>
            <Text style={[styles.welcomeText, { color: colors.text }]}>
              Criar Conta
            </Text>
            <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
              Preencha os dados para se cadastrar
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Nome */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Nome Completo *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: nameError 
                      ? colors.error 
                      : nomeFocused 
                        ? colors.primary 
                        : colors.border,
                    color: colors.text,
                    fontSize: 16,
                  },
                  nomeFocused && styles.inputFocused
                ]}
                placeholder="Seu nome completo"
                placeholderTextColor={colors.placeholder}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  if (text) setNameError(false); 
                }}
                onFocus={() => setNomeFocused(true)}
                onBlur={() => setNomeFocused(false)}
              />
              {nameError && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  O campo nome é obrigatório
                </Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                E-mail *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: usernameError 
                      ? colors.error 
                      : usernameFocused 
                        ? colors.primary 
                        : colors.border,
                    color: colors.text,
                    fontSize: 16,
                  },
                  usernameFocused && styles.inputFocused
                ]}
                placeholder="seu@email.com"
                placeholderTextColor={colors.placeholder}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (text) setUsernameError(false); 
                }}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {usernameError && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  O campo e-mail é obrigatório
                </Text>
              )}
            </View>

            {/* Data de Nascimento */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Data de Nascimento *
              </Text>
              <TextInputMask
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY',
                }}
                value={dataNasc}
                onChangeText={(text) => {
                  setDataNasc(text);
                  if (text) setDataNascError(false);
                }}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: dataNascError 
                      ? colors.error 
                      : dataNascFocused 
                        ? colors.primary 
                        : colors.border,
                    color: colors.text,
                    fontSize: 16,
                  },
                  dataNascFocused && styles.inputFocused
                ]}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.placeholder}
                onFocus={() => setDataNascFocused(true)}
                onBlur={() => setDataNascFocused(false)}
              />
              {dataNascError && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  O campo data de nascimento é obrigatório
                </Text>
              )}
            </View>

            {/* Senha */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Senha *
              </Text>
              <View style={[
                styles.passwordContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: passwordError 
                    ? colors.error 
                    : passwordFocused 
                      ? colors.primary 
                      : colors.border,
                },
                passwordFocused && styles.inputFocused
              ]}>
                <TextInput
                  style={[styles.passwordInput, { color: colors.text, fontSize: 16 }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (text) setPasswordError(false);
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons
                    name={passwordVisible ? "visibility" : "visibility-off"}
                    size={22}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  O campo senha é obrigatório
                </Text>
              )}
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Confirmar Senha *
              </Text>
              <View style={[
                styles.passwordContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: confirmPasswordError 
                    ? colors.error 
                    : confirmPasswordFocused 
                      ? colors.primary 
                      : colors.border,
                },
                confirmPasswordFocused && styles.inputFocused
              ]}>
                <TextInput
                  style={[styles.passwordInput, { color: colors.text, fontSize: 16 }]}
                  ref={passwordRef}
                  placeholder="••••••••"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (text) setConfirmPasswordError(false);
                  }}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons
                    name={confirmPasswordVisible ? "visibility" : "visibility-off"}
                    size={22}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  O campo confirmar senha é obrigatório
                </Text>
              )}
            </View>

            {/* Botão Registrar */}
            <AnimatedButton 
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                  ...shadows.button,
                },
                loading && styles.buttonDisabled
              ]} 
              onPress={handleSignIn}
              disabled={loading}
              haptic={true}
              hapticType="medium"
            >
              {loading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.textInverse, fontSize: 18 }]}>
                  Registrar
                </Text>
              )}
            </AnimatedButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewUsers;

