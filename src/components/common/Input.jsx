/**
 * Input Component
 * Input reutilizável com suporte a tema
 */

import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getTheme } from '../../theme';

export const Input = ({
  value,
  onChangeText,
  placeholder,
  error,
  errorMessage,
  disabled = false,
  multiline = false,
  secureTextEntry = false,
  style,
  ...props
}) => {
  const { isDarkTheme, fontSize } = useTheme();
  const theme = getTheme(isDarkTheme);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.colors.surface,
      borderColor: error ? theme.colors.error : theme.colors.border,
      color: theme.colors.text,
      fontSize,
    },
    disabled && styles.input_disabled,
    multiline && styles.input_multiline,
    style,
  ];

  return (
    <View>
      <TextInput
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        disabled={disabled}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {error && errorMessage && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
  },
  input_multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  input_disabled: {
    opacity: 0.5,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
  },
});

