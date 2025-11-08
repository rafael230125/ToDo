import { StyleSheet, Platform } from 'react-native';

export const createStyles = (colors, shadows, spacing) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.md,
    },
    loadingText: {
      fontSize: 16,
      fontWeight: '500',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      gap: spacing.md,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    refreshButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: 12,
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    refreshButtonText: {
      fontSize: 16,
      fontWeight: '600',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    albumContainer: {
      marginBottom: spacing.xl,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      ...shadows.sm,
    },
    albumHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    albumTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    albumCount: {
      fontSize: 14,
      fontWeight: '400',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    loadingAssetsContainer: {
      padding: spacing.lg,
      alignItems: 'center',
    },
    albumAssetsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    imageContainer: {
      width: '30%',
      aspectRatio: 1,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    selectedImage: {
      borderWidth: 3,
    },
    selectedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButtonContainer: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 12,
      gap: spacing.sm,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
  });
};

