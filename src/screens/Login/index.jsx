import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, signInWithEmailAndPassword } from "../../services/firebaseConfig";
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { createStyles, createDynamicStyles } from './styles';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [salvarLogin, setSalvarLogin] = useState(false);
  const [mostrarModalSair, setMostrarModalSair] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigation = useNavigation();
  const { colors, shadows } = useTheme();
  const { showError, showWarning } = useToast();
  const { success, error } = useHapticFeedback();

  const styles = createStyles(colors, shadows);
  const dynamicStyles = createDynamicStyles(colors, shadows, usernameFocused, passwordFocused);

  // Carregar usuário salvo se existir
  useEffect(() => {
    const loadSavedUsername = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('savedUsername');
        const shouldSaveLogin = await AsyncStorage.getItem('salvarLogin');
        
        if (savedUsername && shouldSaveLogin === 'true') {
          setUsername(savedUsername);
          setSalvarLogin(true);
        }
      } catch (error) {
        // Erro silencioso ao carregar usuário salvo
      }
    };

    loadSavedUsername();
  }, []);

  // Back Handler - Prevenir navegação sem autenticação
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Mostrar modal de confirmação para sair do app
        setMostrarModalSair(true);
        return true; // Previne o comportamento padrão
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleSairApp = () => {
    BackHandler.exitApp();
  };

  const LoginUser = async () => {
    if (!username || !password) {
      showWarning('Preencha todos os campos!');
      return;
    }

    try {
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      
      // Salvar apenas o usuário se a opção estiver marcada (apenas para preencher campo, não para manter autenticado)
      if (salvarLogin) {
        await AsyncStorage.setItem('savedUsername', username);
        await AsyncStorage.setItem('salvarLogin', 'true');
      } else {
        // Remover usuário salvo
        await AsyncStorage.removeItem('savedUsername');
        await AsyncStorage.removeItem('salvarLogin');
      }
      
      success(); // Haptic feedback
      navigation.replace('MainTabs');
    } catch (err) {
      error(); // Haptic feedback
      showError(err.message || 'Não foi possível fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView 
      style={[styles.container, dynamicStyles.container]}
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
            <View style={[styles.logoContainer, dynamicStyles.logoContainer]}>
              <Image
                source={require('../../images/icones.png')}
                style={styles.logoImage}
              />
            </View>
            <Text style={[styles.welcomeText, { color: colors.text }]}>
              Bem-vindo de volta!
            </Text>
            <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
              Entre para continuar
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                E-mail ou Usuário
              </Text>
              <TextInput
                style={[
                  styles.input,
                  dynamicStyles.input,
                  usernameFocused && styles.inputFocused
                ]}
                ref={usernameRef}
                placeholder="seu@email.com"
                placeholderTextColor={colors.placeholder}
                value={username}
                onChangeText={setUsername}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Senha
              </Text>
              <View style={[
                styles.passwordContainer,
                dynamicStyles.passwordContainer,
                passwordFocused && styles.inputFocused
              ]}>
                <TextInput
                  style={[styles.passwordInput, dynamicStyles.passwordInput]}
                  ref={passwordRef}
                  placeholder="••••••••"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  returnKeyType="done"
                  onSubmitEditing={LoginUser}
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
            </View>

            {/* Salvar Login Option */}
            <View style={styles.saveLoginContainer}>
              <Text style={[styles.saveLoginText, { color: colors.textSecondary }]}>
                Salvar login
              </Text>
              <Switch
                value={salvarLogin}
                onValueChange={setSalvarLogin}
                thumbColor={salvarLogin ? colors.primary : colors.border}
                trackColor={{ 
                  true: colors.primary + '80', 
                  false: colors.border 
                }}
              />
            </View>

            {/* Login Button */}
            <AnimatedButton 
              style={[
                styles.button,
                dynamicStyles.button,
                loading && styles.buttonDisabled
              ]} 
              onPress={LoginUser}
              disabled={loading}
              haptic={true}
              hapticType="medium"
            >
              {loading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
                  Entrar
                </Text>
              )}
            </AnimatedButton>

            {/* Sign Up Link */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('NewUser')}
              style={styles.signUpContainer}
              activeOpacity={0.7}
            >
              <Text style={[styles.signUpText, dynamicStyles.signUpText]}>
                Ainda não possui uma conta?{' '}
                <Text style={[styles.signUpLink, dynamicStyles.signUpLink]}>
                  Registre-se
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={mostrarModalSair}
        onClose={() => setMostrarModalSair(false)}
        onConfirm={handleSairApp}
        title="Sair do Aplicativo"
        message="Deseja realmente sair do aplicativo?"
        confirmText="Sair"
        cancelText="Cancelar"
        type="warning"
      />
    </SafeAreaView>
  );
};

export default LoginScreen;

