/**
 * EmptyState Component
 * Componente para estados vazios com animações
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeInView } from '../animations/FadeInView';
import { useTheme } from '../../hooks/useTheme';

export const EmptyState = ({ 
  icon = 'inbox', 
  title = 'Nada aqui ainda',
  message = 'Comece adicionando uma nova tarefa',
  actionLabel,
  onAction,
}) => {
  const { colors, spacing, shadows } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  return (
    <FadeInView duration={500}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
      <MaterialIcons name={icon} size={64} color={colors.textSecondary} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={[
            styles.actionButton, 
            { 
              backgroundColor: colors.primary,
              ...shadows.button,
            }
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionText, { color: colors.textInverse }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
      </Animated.View>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

