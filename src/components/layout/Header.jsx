/**
 * Header Component
 * Cabeçalho moderno do app com novo Design System
 */

import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const Header = ({ 
  userName = 'Usuário',
}) => {
  const { colors, typography, spacing, shadows } = useTheme();

  return (
    <View style={[
      styles.header,
      { 
        backgroundColor: colors.surface,
        paddingTop: spacing.xl,
        ...shadows.header,
      }
    ]}>
      <View style={styles.profileContainer}>
        <View style={styles.leftContainer}>
          <View style={styles.userInfoContainer}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Olá,
            </Text>
            <Text 
              style={[styles.userName, { color: colors.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userName || 'Usuário'}
            </Text>
          </View>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../images/icones.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
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
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 48,
    height: 48,
  },
});
