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
      paddingBottom: 24,
    },
    formContainer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 28,
      marginBottom: 24,
      fontWeight: '700',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    inputWrapper: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      fontWeight: '500', // Usando '500' para melhor compatibilidade
      ...Platform.select({
        android: {
          includeFontPadding: false, // Remove padding extra no Android
        },
      }),
    },
    input: {
      width: '100%',
      minHeight: 56,
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
    textArea: {
      minHeight: 100,
      paddingTop: 16,
      paddingBottom: 16,
    },
    pickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      borderRadius: 12,
      borderWidth: 1.5,
      paddingHorizontal: 16,
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
    pickerButtonText: {
      fontSize: 16,
      fontWeight: '500',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    priorityIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
      gap: 8,
    },
    priorityDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    priorityText: {
      fontSize: 14,
      fontWeight: '600',
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 56,
      borderRadius: 12,
      borderWidth: 1.5,
      paddingHorizontal: 16,
    },
    dateIcon: {
      marginRight: 12,
    },
    dateText: {
      flex: 1,
      fontSize: 16,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: 56,
      borderRadius: 12,
      marginTop: 8,
      marginBottom: 20,
      gap: 8,
    },
    buttonIcon: {
      marginRight: 4,
    },
    saveButtonText: {
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '50%',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    modalCloseButton: {
      padding: 4,
    },
    modalOptions: {
      paddingVertical: 8,
    },
    modalOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
    },
    modalOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    modalOptionText: {
      fontSize: 18,
      fontWeight: '500',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
  });
};

