import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';  // Usando o CheckBox do react-native-elements
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import openDB from "../database/db";

const LoginScreen = () => {
  const db = openDB();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [manterLogado, setManterLogado] = useState(false); // Estado para o checkbox
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const navigation = useNavigation();

  const validarUsuario = async () => {
    try {
      const statement = await db.prepareAsync('SELECT * FROM usuario WHERE usuario = ?');
      const result = await statement.executeAsync([username]);
      const firstRow = await result.getFirstAsync();

      if (firstRow) {
        if (firstRow.senha === password) {
          if (manterLogado) {
            await AsyncStorage.setItem('manterLogado', 'true'); // Salva a preferência
            await AsyncStorage.setItem('nomeUsuer', firstRow.nome); 
          } else {
            await AsyncStorage.removeItem('manterLogado'); // Remove a preferência
          }
          navigation.navigate('Home');
        } else {
          Alert.alert('Aviso', 'Senha incorreta!');
          passwordRef.current.focus();
        }
      } else {
        Alert.alert('Aviso', 'Usuário não encontrado!');
        usernameRef.current.focus();
      }
    } catch (error) {
      console.error("Erro ao validar o usuário:", error);
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

      <TextInput
        style={styles.input}
        ref={passwordRef}
        placeholder="Senha"
        placeholderTextColor="#333"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.checkboxContainer}>
        <CheckBox style={styles.checkbox}
          checked={manterLogado}
          onPress={() => setManterLogado(!manterLogado)}
        />
        <Text style={styles.textoCheckbox}>Manter conectado?</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={validarUsuario}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Link para Sign Up */}
      <TouchableOpacity onPress={() => navigation.navigate('NewUser')}>
        <Text style={styles.signUpText}>
          Ainda não possui uma conta? <Text style={styles.signUpLink}>Registre-se</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
  textoCheckbox: {
    // marginRight: 100,
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
});

export default LoginScreen;
