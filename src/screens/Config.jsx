import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { ToastAndroid }               from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import openDB from "../database/db";

export default function ConfigScreen() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [logado, setLogado] = useState(false);
  const [idUser, setIdUsuario] = useState('');
  const [usernane, setusernane] = useState('');
  const [profileImage, setProfileImage] = useState('https://placekitten.com/200/200'); // URL inicial
  const navigation = useNavigation();
  const db = openDB();

  // Método para abrir a galeria e selecionar uma imagem
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
            let notifica        = config[0].notificacoes === 'true'? true : false;
            let temas           = config[0].tema === 'true'? true : false;
            let continuarLogado = config[0].logado === 'true'? true : false;
            
            setNotifications(notifica);
            setIsDarkTheme(temas);
            setLogado(continuarLogado);
        };
      }
    };
  
    verifcaConfig();
  }, [idUser]); 


  const firstInsertConfig = async () => {
    const idUser = await AsyncStorage.getItem('idUser'); 

    const statement = await db.prepareAsync(
      `INSERT INTO config (tema, logado, notificacoes,idUser) 
       VALUES ($tema,$logado,$notificacoes,$idUsuario)`
    );
    
    try {
      let result = await statement.executeAsync({
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
      {/* Foto de perfil e botão para editar */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={selectImage}>
          <Image source={{ uri: `data:image/jpg;base64,${profileImage}` }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.nomeUsu}>{usernane}</Text>
      </View>

      {/* Tema Dark/Light */}
      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, { color: isDarkTheme ? '#fff' : '#000' }]}>
          Tema Dark
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={setIsDarkTheme}
          thumbColor={isDarkTheme ? '#1E90FF' : '#000'}
        />
      </View>

      {/* Notificações */}
      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, { color: isDarkTheme ? '#fff' : '#000' }]}>
          Permitir notificações
        </Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          thumbColor={notifications ? '#1E90FF' : '#000'}
        />
      </View>

      <View style={styles.optionContainer}>
        <Text style={[styles.optionText, { color: isDarkTheme ? '#fff' : '#000' }]}>
          Continuar logado
        </Text>
        <Switch
          value={logado}
          onValueChange={setLogado}
          thumbColor={logado ? '#1E90FF' : '#000'}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={salvaConfig}>
        <Text style={styles.logoutButtonText}>Salvar configurações</Text>
      </TouchableOpacity>
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
    fontSize: 18,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});
