import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { ToastAndroid } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import openDB from "../database/db" ;

const NewUsers = () => {
  const db  =  openDB();
  const auth = getAuth();
  const [nome, setNome] = useState(''); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [idNovo, setIdNovo] = useState('');
  const [nameError, setNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [dataNascError, setDataNascError] = useState(false);
  const passwordRef = useRef(null);
  const navigation = useNavigation();

  const handleSignIn = () => {
    setNameError(!nome);
    setUsernameError(!username);
    setPasswordError(!password);
    setConfirmPasswordError(!confirmPassword);
    setDataNascError(!dataNasc);

    if (!nome || !username || !password || !confirmPassword || !dataNasc) {
      Alert.alert('Aviso', 'Campos obrigatórios, favor preencher');
      return;
    }else {
        if (confirmPassword === password) {
          addUser();
          navigation.goBack();
        }else {
          Alert.alert('Aviso', 'Senhas não conferem!');
          passwordRef.current.focus();
        }
    }  
  };

  const novoUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      setIdNovo(user.uid);
      return user.uid; 
    } catch (error) {
      const errorMessage = error.message;
      Alert.alert('Erro', errorMessage);
      throw error; 
    }
  };

  const addUser = async () => {
    const userId = await novoUser(); 
    console.log('Novo:', userId);
    const statement = await db.prepareAsync(
      'INSERT INTO usuario (id, nome, usuario, senha, dataNasc) VALUES ($id,$nome,$usuario,$senha,$dataNasc)'
    );
    
    try {
      let result = await statement.executeAsync({$id: userId, $nome: nome ,$usuario: username, $senha: password, $dataNasc: dataNasc});

      Alert.alert('Cadastro', 'Novo usuário registrado com sucesso!');
    }catch (error) {
      Alert.alert('Erro', error);
    }finally {
      await statement.finalizeAsync();
  }};

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
        style={[styles.input, nameError && styles.inputError]}
        placeholder="Nome"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={(text) => {
            setNome(text);
          if (text) setNameError(false); 
        }}
      />
        {nameError && <Text style={styles.errorText}>O campo nome é obrigatório</Text>}

      <TextInput
        style={[styles.input, usernameError && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (text) setUsernameError(false); 
        }}
      />
        {usernameError && <Text style={styles.errorText}>O campo Usuário é obrigatório</Text>}

    
    
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
        style={[styles.input, dataNascError && styles.inputError]}
        placeholder="Data de Nascimento "
        placeholderTextColor="#aaa"
      />
        {dataNascError && <Text style={styles.errorText}>O campo Data de Nascimento é obrigatório</Text>}

        <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (text) setPasswordError(false);
        }}
      />
        {passwordError && <Text style={styles.errorText}>O campo Senha é obrigatório</Text>}
    
      <TextInput
        style={[styles.input, confirmPasswordError && styles.inputError]}
        ref={passwordRef}
        placeholder="Confirmar senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (text) setConfirmPasswordError(false);
        }}
      />
        {confirmPasswordError && <Text style={styles.errorText}>O campo Confirmar senha é obrigatório</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Registrar</Text>
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
  inputError: {
    borderColor: 'red',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#51c1f5',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default NewUsers;
