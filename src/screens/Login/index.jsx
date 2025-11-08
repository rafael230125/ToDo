import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, signInWithEmailAndPassword } from "../../services/firebaseConfig";
import { useTheme } from '../../hooks/useTheme';
import { createStyles, createDynamicStyles } from './styles';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [salvarLogin, setSalvarLogin] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigation = useNavigation();
  const { colors, shadows } = useTheme();

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

  const LoginUser = async () => {
    if (!username || !password) {
      Alert.alert('Aviso', 'Preencha todos os campos!');
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
      
      navigation.navigate('Home', { id: user.uid });
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível fazer login');
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
            <TouchableOpacity 
              style={[
                styles.button,
                dynamicStyles.button,
                loading && styles.buttonDisabled
              ]} 
              onPress={LoginUser}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

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
    </SafeAreaView>
  );
};

export default LoginScreen;

