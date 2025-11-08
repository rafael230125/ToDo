/**
 * Input Component
 * Input reutilizável com suporte a tema
 */

import React, { useState, useRef, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, Animated } from 'react-native';
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
  const { isDarkTheme, fontSize, colors } = useTheme();
  const theme = getTheme(isDarkTheme);
  const [focused, setFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.02 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(borderColorAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused]);

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? theme.colors.error : theme.colors.border,
      error ? theme.colors.error : colors.primary || theme.colors.primary,
    ],
  });

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.colors.surface,
      borderColor,
      color: theme.colors.text,
      fontSize,
    },
    disabled && styles.input_disabled,
    multiline && styles.input_multiline,
    style,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TextInput
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        disabled={disabled}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && errorMessage && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {errorMessage}
        </Text>
      )}
    </Animated.View>
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

