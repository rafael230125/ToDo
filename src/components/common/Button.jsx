/**
 * Button Component
 * Botão reutilizável com suporte a tema e tamanhos
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getTheme } from '../../theme';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  children,
}) => {
  const { isDarkTheme, fontSize } = useTheme();
  const theme = getTheme(isDarkTheme);

  const buttonStyle = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    { backgroundColor: theme.colors[variant] || theme.colors.primary },
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    textStyle,
    { fontSize: fontSize },
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={buttonTextStyle}>
          {title || children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  button_primary: {
    backgroundColor: '#51c1f5',
  },
  button_secondary: {
    backgroundColor: '#FFC107',
  },
  button_sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 40,
  },
  button_md: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 50,
  },
  button_lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 60,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button_disabled: {
    opacity: 0.5,
  },
});

