import { StyleSheet, Platform } from 'react-native';

export const createStyles = (colors, shadows) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    logoSection: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: 24,
    },
    logoImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    subtitleText: {
      fontSize: 16,
      fontWeight: '400',
    },
    formSection: {
      width: '100%',
    },
    inputWrapper: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '500', // Usando '500' para melhor compatibilidade
      marginBottom: 8,
      ...Platform.select({
        android: {
          includeFontPadding: false, // Remove padding extra no Android
        },
      }),
    },
    input: {
      width: '100%',
      height: 56,
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      borderWidth: 1.5,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
          includeFontPadding: false,
        },
      }),
    },
    inputFocused: {
      borderWidth: 2,
      ...Platform.select({
        ios: {
          shadowColor: '#6366F1',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 56,
      borderRadius: 12,
      borderWidth: 1.5,
      paddingHorizontal: 4,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    passwordInput: {
      flex: 1,
      height: '100%',
      paddingHorizontal: 16,
      fontSize: 16,
    },
    eyeIcon: {
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      width: '100%',
      height: 56,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    signUpContainer: {
      alignItems: 'center',
      marginTop: 8,
    },
    signUpText: {
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'center',
    },
    signUpLink: {
      fontWeight: '600',
    },
    saveLoginContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 4,
    },
    saveLoginText: {
      fontSize: 16,
      fontWeight: '500',
    },
  });
};

export const createDynamicStyles = (colors, shadows, usernameFocused, passwordFocused) => {
  return {
    container: {
      backgroundColor: colors.background,
    },
    logoContainer: {
      backgroundColor: colors.surface,
      ...shadows.card,
    },
    input: {
      backgroundColor: colors.surface,
      borderColor: usernameFocused ? colors.primary : colors.border,
      color: colors.text,
    },
    passwordContainer: {
      backgroundColor: colors.surface,
      borderColor: passwordFocused ? colors.primary : colors.border,
    },
    passwordInput: {
      color: colors.text,
    },
    eyeIcon: {
      color: colors.textSecondary,
    },
    button: {
      backgroundColor: colors.primary,
      ...shadows.button,
    },
    buttonText: {
      color: colors.textInverse,
    },
    signUpText: {
      color: colors.textSecondary,
    },
    signUpLink: {
      color: colors.primary,
    },
  };
};

