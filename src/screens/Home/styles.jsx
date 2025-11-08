import { StyleSheet } from 'react-native';

export const createStyles = (colors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    content: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
};

