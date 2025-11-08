/**
 * Toast Component
 * Componente de notificação toast customizado para iOS e Android
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

const Toast = ({ visible, message, type = 'info', duration = 3000, onHide }) => {
  const { colors, semanticColors } = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animar entrada
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto esconder após duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
    });
  };

  if (!visible) return null;

  // Configurações por tipo
  const typeConfig = {
    success: {
      icon: 'check-circle',
      color: semanticColors.status.completed || '#10B981',
      bg: `${semanticColors.status.completed || '#10B981'}15`,
    },
    error: {
      icon: 'error',
      color: semanticColors.error || '#EF4444',
      bg: `${semanticColors.error || '#EF4444'}15`,
    },
    warning: {
      icon: 'warning',
      color: semanticColors.priority.medium || '#F59E0B',
      bg: `${semanticColors.priority.medium || '#F59E0B'}15`,
    },
    info: {
      icon: 'info',
      color: colors.primary,
      bg: `${colors.primary}15`,
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  // Calcular posição top considerando safe area
  const topPosition = Platform.OS === 'ios' 
    ? Math.max(insets.top + 10, 60) 
    : Math.max(insets.top + 10, 20);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: topPosition,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: colors.surface,
            borderLeftColor: config.color,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              },
              android: {
                elevation: 8,
              },
            }),
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
          <MaterialIcons name={config.icon} size={24} color={config.color} />
        </View>
        <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    minHeight: 56,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
});

export default Toast;

