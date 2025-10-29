import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, signInWithEmailAndPassword } from "../services/firebaseConfig";

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [manterLogado, setManterLogado] = useState(false); 
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();

  const LoginUser = async () => {
    if (!username || !password) {
      Alert.alert('Aviso', 'Preencha todos os campos!');
      return;
    }

    try {
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      
      // Salvar preferência de manter logado
      if (manterLogado) {
        await AsyncStorage.setItem('manterLogado', 'true');
        await AsyncStorage.setItem('idUser', user.uid);
      } else {
        await AsyncStorage.removeItem('manterLogado');
      }
      
      navigation.navigate('Home', { id: user.uid });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', error.message || 'Não foi possível fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Image
            source={require('../images/icones.png')}
            style={styles.logoImage}
          />
        </View>
      </View>

      <TextInput
        style={styles.input}
        ref={usernameRef}
        placeholder="Usuário"
        placeholderTextColor="#333"
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.passwordInput,
            isFocused && styles.inputFocused,
          ]}
          ref={passwordRef}
          placeholder="Senha"
          placeholderTextColor="#333"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)} 
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons
            name={passwordVisible ? "eye" : "eye-off"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <Switch
          value={manterLogado}
          onValueChange={setManterLogado}
          trackColor={{ false: '#767577', true: '#51c1f5' }}
          thumbColor={manterLogado ? '#fff' : '#f4f3f4'}
        />
        <Text style={styles.textoCheckbox}>Manter conectado?</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={LoginUser}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>

      {/* Link para Sign Up */}
      <TouchableOpacity onPress={() => navigation.navigate('NewUser')}>
        <Text style={styles.signUpText}>
          Ainda não possui uma conta? <Text style={styles.signUpLink}>Registre-se.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#333',
    marginBottom: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    // borderWidth: 0.3,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#51c1f5',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#5f5f5f',
    fontSize: 14,
    marginTop: 20,
  },
  signUpLink: {
    color: '#51c1f5',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default LoginScreen;
