/**
 * Card Component
 * Card reutilizável com novo Design System
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const Card = ({
  children,
  variant = 'default',
  style,
  ...props
}) => {
  const { colors, borderRadius, shadows, spacing } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'selected':
        return {
          backgroundColor: colors.selected,
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case 'elevated':
        return {
          backgroundColor: colors.surfaceElevated,
          ...shadows.cardHover,
        };
      default:
        return {
          backgroundColor: colors.card,
          ...shadows.card,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
        },
        getVariantStyles(),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
