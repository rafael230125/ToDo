/**
 * FadeInView Component
 * Componente wrapper para animação de fade in (opacidade)
 */

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const FadeInView = ({ 
  children, 
  duration = 300, 
  delay = 0,
  style,
  ...props 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={[
        { opacity: fadeAnim },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

