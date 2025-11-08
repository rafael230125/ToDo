import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, ToastAndroid, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  getCurrentUser, 
  getUserConfig, 
  saveUserConfig 
} from '../../services/firebaseService';
import { requestNotificationPermission } from '../../services/notificationService';
import { useTheme } from '../../hooks/useTheme';
import { createStyles } from './styles';

export default function ConfigScreen() {
  const [notifications, setNotifications] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { colors, spacing, shadows, borderRadius, isDarkTheme, toggleTheme } = useTheme();

  const styles = createStyles(colors, spacing, shadows, borderRadius);

  // Configurar header dinamicamente baseado no tema
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Configurações',
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

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUsername(user.nome || '');
        }
      } catch (error) {
        // Erro silencioso ao buscar dados do usuário
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
        }
      } catch (error) {
        // Erro silencioso ao carregar configurações
      }
    };

    loadConfig();
  }, []);

  const salvaConfig = async () => {
    try {
      setLoading(true);
      
      // Se o usuário está habilitando notificações, solicitar permissão
      if (notifications) {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          Alert.alert(
            'Permissão Necessária',
            'Para receber notificações, é necessário permitir o acesso. Você pode ativar nas configurações do dispositivo.',
            [{ text: 'OK' }]
          );
          setNotifications(false);
          return;
        }
      }
      
      const configData = {
        tema: String(isDarkTheme),
        notificacoes: String(notifications),
      };

      await saveUserConfig(configData);
      ToastAndroid.show('Configurações salvas com sucesso!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Erro ao salvar configurações', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Text style={styles.nomeUsu}>{username || 'Usuário'}</Text>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Tema Dark</Text>
            <Switch
              value={isDarkTheme}
              onValueChange={toggleTheme}
              thumbColor={isDarkTheme ? colors.primary : colors.border}
              trackColor={{ 
                true: colors.primary + '80', 
                false: colors.border 
              }}
            />
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>Permitir Notificações</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              thumbColor={notifications ? colors.primary : colors.border}
              trackColor={{ 
                true: colors.primary + '80', 
                false: colors.border 
              }}
            />
          </View>

        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.buttonDisabled]} 
          onPress={salvaConfig}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.saveButtonText}>
              Salvar Configurações
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
