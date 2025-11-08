import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  getCurrentUser, 
  getUserConfig, 
  saveUserConfig 
} from '../../services/firebaseService';
import { requestNotificationPermission } from '../../services/notificationService';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { createStyles } from './styles';

export default function ConfigScreen() {
  const [notifications, setNotifications] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarModalPermissao, setMostrarModalPermissao] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, spacing, shadows, borderRadius, isDarkTheme, toggleTheme } = useTheme();
  const { showSuccess, showError, showWarning } = useToast();
  const { success, error } = useHapticFeedback();

  const styles = createStyles(colors, spacing, shadows, borderRadius);

  // Verificar se está sendo acessada via tab ou stack
  const isTabNavigator = route.name === 'ConfigTab';
  
  // Configurar header dinamicamente baseado no tema
  useLayoutEffect(() => {
    // Só mostrar header se não estiver no tab navigator
    if (!isTabNavigator) {
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
    } else {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation, colors, isDarkTheme, isTabNavigator]);

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
          setMostrarModalPermissao(true);
          setNotifications(false);
          return;
        }
      }
      
      const configData = {
        tema: String(isDarkTheme),
        notificacoes: String(notifications),
      };

      await saveUserConfig(configData);
      success(); // Haptic feedback
      showSuccess('Configurações salvas com sucesso!');
    } catch (err) {
      error(); // Haptic feedback
      showError('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={isTabNavigator ? ['top', 'bottom'] : ['top', 'bottom']}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          isTabNavigator && { paddingTop: spacing.xl }
        ]}>
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

        <AnimatedButton 
          style={[styles.saveButton, loading && styles.buttonDisabled]} 
          onPress={salvaConfig}
          disabled={loading}
          haptic={true}
          hapticType="medium"
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.saveButtonText}>
              Salvar Configurações
            </Text>
          )}
        </AnimatedButton>

        <ConfirmModal
          visible={mostrarModalPermissao}
          onClose={() => setMostrarModalPermissao(false)}
          onConfirm={() => setMostrarModalPermissao(false)}
          title="Permissão Necessária"
          message="Para receber notificações, é necessário permitir o acesso. Você pode ativar nas configurações do dispositivo."
          confirmText="Entendi"
          cancelText=""
          type="info"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
