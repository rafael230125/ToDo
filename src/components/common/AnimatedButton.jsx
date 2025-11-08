/**
 * AnimatedButton Component
 * Botão com animação de scale e suporte a haptic feedback
 */

import React, { useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

export const AnimatedButton = ({ 
  children, 
  onPress, 
  style, 
  haptic = false,
  hapticType = 'light',
  disabled = false,
  ...props 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { lightImpact, mediumImpact, heavyImpact } = useHapticFeedback();

  const handlePressIn = () => {
    if (disabled) return;

    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();

    if (haptic) {
      if (hapticType === 'light') lightImpact();
      else if (hapticType === 'medium') mediumImpact();
      else if (hapticType === 'heavy') heavyImpact();
    }
  };

  const handlePressOut = () => {
    if (disabled) return;

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePress = () => {
    if (disabled || !onPress) return;
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={style}
        disabled={disabled}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

