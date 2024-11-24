import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Image, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import openDB from "../database/db";
import { FontContext } from '../context/FontContext';
import { ThemeContext } from '../context/ThemeContext'; // Importa o contexto de tema

export default function ConfigScreen() {
  const [notifications, setNotifications] = useState(false);
  const [logado, setLogado] = useState(false);
  const [idUser, setIdUsuario] = useState('');
  const [usernane, setusernane] = useState('');
  const [profileImage, setProfileImage] = useState('https://placekitten.com/200/200');
  const navigation = useNavigation();
  const db = openDB();
  const { fontSize, increaseFontSize, decreaseFontSize } = useContext(FontContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext); // Usa o contexto de tema

  const selectImage = async () => {
    navigation.navigate('Galeria');
  };

  useEffect(() => {
    const fetchIdUser = async () => {
      const idUsuario = await AsyncStorage.getItem('idUser');
      setIdUsuario(idUsuario);

      const statement = await db.prepareAsync('SELECT nome,foto FROM usuario WHERE id = ?');
      const result = await statement.executeAsync([idUsuario]);
      const firstRow = await result.getFirstAsync();
      setusernane(firstRow.nome);
      setProfileImage(firstRow.foto);
    };

    fetchIdUser();
  }, []);

  useEffect(() => {
    const verifcaConfig = async () => {
      if (idUser) {
        const config = await db.getAllAsync('SELECT * FROM config WHERE idUser = ?', [idUser]);
        if (config) {
          let notifica = config[0].notificacoes === 'true';
          let continuarLogado = config[0].logado === 'true';
          setNotifications(notifica);
          setLogado(continuarLogado);
        }
      }
    };

    verifcaConfig();
  }, [idUser]);

  const firstInsertConfig = async () => {
    const idUser = await AsyncStorage.getItem('idUser');

    const statement = await db.prepareAsync(
      `INSERT INTO config (tema, logado, notificacoes, idUser) 
       VALUES ($tema, $logado, $notificacoes, $idUsuario)`
    );

    try {
      await statement.executeAsync({
        $tema: String(isDarkTheme),
        $logado: String(logado),
        $notificacoes: String(notifications),
        $idUsuario: idUser
      });

      ToastAndroid.show('Nova configuração salva com sucesso!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Erro:', error, ToastAndroid.SHORT);
    } finally {
      await statement.finalizeAsync();
    }
  };

  const salvaConfig = async () => {
    const idUser = await AsyncStorage.getItem('idUser');
    const results = await db.getAllAsync('SELECT COUNT(*) AS count FROM config');
    const count = results[0].count;

    if (count === 0) {
      await firstInsertConfig();
    } else {
      try {
        await db.runAsync(
          "UPDATE config SET tema = ?, logado = ?, notificacoes = ? WHERE idUser = ?",
          [String(isDarkTheme), String(logado), String(notifications), idUser]
        );

        ToastAndroid.show('Configurações editadas com sucesso!', ToastAndroid.SHORT);
      } catch (error) {
        ToastAndroid.show(`Erro: ${error}`, ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={selectImage}>
          <Image source={{ uri: `data:image/jpg;base64,${profileImage}` }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={[styles.nomeUsu, { fontSize }]}>{usernane}</Text>
      </View>

      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, { color: isDarkTheme ? '#fff' : '#000', fontSize }]}>
          Tema Dark
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme} // Alterna o tema global
          thumbColor={isDarkTheme ? '#1E90FF' : '#000'}
        />
      </View>

      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, { color: isDarkTheme ? '#fff' : '#000', fontSize }]}>
          Permitir notificações
        </Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          thumbColor={notifications ? '#1E90FF' : '#000'}
        />
      </View>

      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, { color: isDarkTheme ? '#fff' : '#000', fontSize }]}>
          Continuar logado
        </Text>
        <Switch
          value={logado}
          onValueChange={setLogado}
          thumbColor={logado ? '#1E90FF' : '#000'}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={salvaConfig}>
        <Text style={[styles.logoutButtonText, { fontSize }]}>Salvar configurações</Text>
      </TouchableOpacity>

      <View style={styles.fontControls}>
        <TouchableOpacity style={styles.fontButton} onPress={increaseFontSize}>
          <Text style={styles.fontButtonText}>Aumentar Tamanho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fontButton} onPress={decreaseFontSize}>
          <Text style={styles.fontButtonText}>Diminuir Tamanho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nomeUsu: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#51c1f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fontControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  fontButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  fontButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
