/**
 * Card Component
 * Card reutilizável com suporte a tema
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getTheme } from '../../theme';

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
}) => {
  const { isDarkTheme } = useTheme();
  const theme = getTheme(isDarkTheme);

  const cardStyle = [
    styles.card,
    {
      backgroundColor: variant === 'selected' ? theme.colors.selected : theme.colors.card,
      padding: theme.spacing[padding] || theme.spacing.md,
    },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
});

