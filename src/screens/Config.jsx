import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Image, ToastAndroid, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontContext } from '../context/FontContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  getCurrentUser, 
  updateUserPhoto, 
  getUserConfig, 
  saveUserConfig 
} from '../services/firebaseService';

export default function ConfigScreen() {
  const [notifications, setNotifications] = useState(false);
  const [logado, setLogado] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { fontSize, increaseFontSize, decreaseFontSize } = useContext(FontContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  const selectImage = () => {
    navigation.navigate('Galeria');
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUsername(user.nome || '');
          setProfileImage(user.foto || '');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getUserConfig();
        if (config) {
          setNotifications(config.notificacoes === 'true' || config.notificacoes === true);
          setLogado(config.logado === 'true' || config.logado === true);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };

    loadConfig();
  }, []);

  const salvaConfig = async () => {
    try {
      setLoading(true);
      
      const configData = {
        tema: String(isDarkTheme),
        logado: String(logado),
        notificacoes: String(notifications),
        fontSize: fontSize,
      };

      await saveUserConfig(configData);
      ToastAndroid.show('Configurações salvas com sucesso!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      ToastAndroid.show('Erro ao salvar configurações', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = styles(isDarkTheme); // Estilo dinâmico com base no tema

  return (
    <ScrollView
      style={dynamicStyles.container}
      contentContainerStyle={dynamicStyles.scrollContent}>
      <View style={dynamicStyles.profileSection}>
        <TouchableOpacity onPress={selectImage}>
          <Image source={{ uri: `data:image/jpg;base64,${profileImage}` }} style={dynamicStyles.profileImage} />
        </TouchableOpacity>
        <Text style={[dynamicStyles.nomeUsu, { fontSize }]}>{username || 'Usuário'}</Text>
      </View>

      <View style={dynamicStyles.settingsSection}>
        <View style={dynamicStyles.optionContainer}>
          <Text style={dynamicStyles.optionText}>Tema Dark</Text>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleTheme}
            thumbColor={isDarkTheme ? '#1E90FF' : '#ccc'}
            trackColor={{ true: '#87CEEB', false: '#ddd' }}
          />
        </View>

        <View style={dynamicStyles.optionContainer}>
          <Text style={dynamicStyles.optionText}>Permitir Notificações</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? '#1E90FF' : '#ccc'}
            trackColor={{ true: '#87CEEB', false: '#ddd' }}
          />
        </View>

        <View style={dynamicStyles.optionContainer}>
          <Text style={dynamicStyles.optionText}>Continuar Logado</Text>
          <Switch
            value={logado}
            onValueChange={setLogado}
            thumbColor={logado ? '#1E90FF' : '#ccc'}
            trackColor={{ true: '#87CEEB', false: '#ddd' }}
          />
        </View>
      </View>

      <View style={dynamicStyles.fontControlsSection}>
        <Text style={dynamicStyles.sectionTitle}>Ajustar Tamanho da Fonte</Text>
        <View style={dynamicStyles.fontControls}>
          <TouchableOpacity style={dynamicStyles.fontButton} onPress={increaseFontSize}>
            <Text style={dynamicStyles.fontButtonText}>A+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.fontButton} onPress={decreaseFontSize}>
            <Text style={dynamicStyles.fontButtonText}>A-</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[dynamicStyles.saveButton, loading && dynamicStyles.buttonDisabled]} 
        onPress={salvaConfig}
        disabled={loading}
      >
        <Text style={dynamicStyles.saveButtonText}>
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (isDarkTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? '#333' : '#f9f9f9',
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40, // Espaço extra para o botão de salvar no final
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: isDarkTheme ? '#1E90FF' : '#87CEEB',
    },
    nomeUsu: {
      marginTop: 15,
      fontSize: 20,
      fontWeight: '600',
      color: isDarkTheme ? '#fff' : '#000',
    },
    settingsSection: {
      marginBottom: 20,
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      backgroundColor: isDarkTheme ? '#444' : '#fff',
      padding: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    optionText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDarkTheme ? '#fff' : '#000',
    },
    fontControlsSection: {
      marginVertical: 6,
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      color: isDarkTheme ? '#fff' : '#000',
    },
    fontControls: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '60%',
    },
    fontButton: {
      width: 60,
      height: 60,
      backgroundColor: '#4CAF50',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    fontButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 24,
    },
    saveButton: {
      marginTop: 8,
      backgroundColor: '#51c1f5',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  });
