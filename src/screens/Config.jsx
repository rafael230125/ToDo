import React, { useState, useEffect }    from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { BackHandler, Alert } from 'react-native'; 
import { ToastAndroid }       from 'react-native';
import AsyncStorage           from '@react-native-async-storage/async-storage';
import openDB from "../database/db";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para ícones

export default function ConfigScreen({ navigation }) {
  const [isDarkTheme,   setIsDarkTheme]    = useState(false);
  const [notifications, setNotifications]  = useState(false);
  const [logado,        setLogado]         = useState(false);
  const [idUser,        setIdUsuario]   = useState('');
  const [usernane,      setusernane]   = useState('');


  const db = openDB();

  useEffect(() => {
    const fetchIdUser = async () => {
      const idUsuario = await AsyncStorage.getItem('idUser');
      setIdUsuario(idUsuario); 

      const statement = await db.prepareAsync('SELECT nome FROM usuario WHERE id = ?');
      const result    = await statement.executeAsync([idUsuario]);
      const firstRow  = await result.getFirstAsync();
      setusernane(firstRow.nome);
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
        firstInsertConfig();
    } else {
        try {
            await db.runAsync("UPDATE config SET tema = ?, logado = ?, notificacoes = ? WHERE idUser = ?",
                [String(isDarkTheme), String(logado), String(notifications), idUser]); 

            ToastAndroid.show('Configurações editadas com sucesso!', ToastAndroid.SHORT);
        } catch (error) {
            ToastAndroid.show(`Erro: ${error}`, ToastAndroid.SHORT);
        } 
    }
  }

  const sairSistema = () => {
    // Exibe um alerta de confirmação antes de sair
    Alert.alert(
      "Sair do aplicativo",
      "Deseja realmente sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          onPress: () => {
            // Aqui desloga o usuário e navega para a tela de login
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  React.useEffect(() => {
    // Adiciona o listener do botão de "voltar" para Android
    const backHandlerListener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        sairSistema(); // Mostra o alerta
        return true; // Previne a ação padrão (fechar ou ir para a tela anterior)
      }
    );

    return () => backHandlerListener.remove(); // Remove o listener ao desmontar o componente
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      {/* Foto de perfil e ícone de editar */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://placekitten.com/200/200' }} // Substitua pelo caminho da sua imagem
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={() => alert('Editar foto de perfil')} style={styles.editIconContainer}>
          {/* <Icon name="edit" size={30} color={isDarkTheme ? '#fff' : '#000'} /> */}
          <Text style={styles.nomeUsu}>{usernane}</Text>
        </TouchableOpacity>
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

      {/* Salvar configurações */}
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
    justifyContent: 'center'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  editIconContainer: {
    marginLeft: 10,
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
  nomeUsu: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});
