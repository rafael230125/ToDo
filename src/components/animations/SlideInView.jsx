/**
 * SlideInView Component
 * Componente wrapper para animação de slide in
 */

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const SlideInView = ({ 
  children, 
  direction = 'up', 
  distance = 50,
  duration = 300,
  delay = 0,
  useSpring = true,
  style,
  ...props 
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    if (useSpring) {
      Animated.spring(slideAnim, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return { translateY: slideAnim };
      case 'down':
        return { 
          translateY: slideAnim.interpolate({
            inputRange: [0, distance],
            outputRange: [0, -distance],
            extrapolate: 'clamp',
          })
        };
      case 'left':
        return { translateX: slideAnim };
      case 'right':
        return { 
          translateX: slideAnim.interpolate({
            inputRange: [0, distance],
            outputRange: [0, -distance],
            extrapolate: 'clamp',
          })
        };
      default:
        return { translateY: slideAnim };
    }
  };

  return (
    <Animated.View 
      style={[
        { transform: [getTransform()] },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

