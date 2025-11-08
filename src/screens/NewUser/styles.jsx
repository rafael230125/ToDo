import { StyleSheet, Platform } from 'react-native';

export const createStyles = () => {
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
      marginBottom: 32,
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
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    subtitleText: {
      fontSize: 16,
      fontWeight: '400',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
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
      borderWidth: 1.5,
      fontSize: 16,
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
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    eyeIcon: {
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 14,
      marginTop: 4,
      fontWeight: '500',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    button: {
      width: '100%',
      height: 56,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '600',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    buttonDisabled: {
      opacity: 0.6,
    },
  });
};

