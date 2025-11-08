import { StyleSheet, Platform } from 'react-native';

export const createStyles = (colors, spacing, shadows, borderRadius) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: spacing.xl,
      paddingBottom: spacing['2xl'],
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: spacing['2xl'],
    },
    nomeUsu: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    settingsSection: {
      marginBottom: spacing.xl,
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      ...shadows.card,
    },
    optionText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    saveButton: {
      marginTop: spacing.lg,
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      ...shadows.button,
    },
    saveButtonText: {
      color: colors.textInverse,
      fontWeight: '600',
      fontSize: 16,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
  });
};
