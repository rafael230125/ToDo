/**
 * Header Component
 * Cabeçalho moderno do app com novo Design System
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const Header = ({ 
  userName = 'Usuário',
  appTitle = 'TO-DO',
  showLogo = false,
}) => {
  const { colors, typography, spacing, shadows } = useTheme();

  return (
    <View style={[
      styles.header,
      { 
        backgroundColor: colors.primary,
        paddingTop: spacing.lg,
        ...shadows.header,
      }
    ]}>
      <View style={styles.profileContainer}>
        <View style={styles.leftContainer}>
          <View style={styles.userInfoContainer}>
            <Text style={[styles.greeting, { color: colors.textInverse }]}>
              Olá,
            </Text>
            <Text 
              style={[styles.userName, { color: colors.textInverse }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userName || 'Usuário'}
            </Text>
          </View>
        </View>
        <Text style={[styles.appTitle, { color: colors.textInverse }]}>
          {appTitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfoContainer: {
    flex: 1,
    maxWidth: '60%', // Limitar largura para forçar truncamento mais cedo
  },
  greeting: {
    fontSize: 14,
    fontWeight: Platform.select({
      ios: '400',
      android: 'normal',
    }),
    opacity: 0.85,
    marginBottom: 2,
    letterSpacing: 0.2,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
  userName: {
    fontSize: 18,
    fontWeight: Platform.select({
      ios: '600',
      android: '600',
    }),
    letterSpacing: -0.2,
    lineHeight: 24,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
  appTitle: {
    fontSize: 24,
    fontWeight: Platform.select({
      ios: '700',
      android: 'bold',
    }),
    letterSpacing: -0.5,
    lineHeight: 30,
    ...Platform.select({
      android: {
        includeFontPadding: false,
      },
    }),
  },
});
