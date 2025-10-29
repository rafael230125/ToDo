/**
 * Modal Component
 * Modal reutilizável
 */

import React from 'react';
import { Modal as RNModal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getTheme } from '../../theme';

export const Modal = ({
  visible,
  onClose,
  title,
  children,
  showClose = true,
}) => {
  const { isDarkTheme, fontSize } = useTheme();
  const theme = getTheme(isDarkTheme);

  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.content,
          {
            backgroundColor: theme.colors.surface,
          }
        ]}>
          {title && (
            <Text style={[
              styles.title,
              {
                color: theme.colors.text,
                fontSize: fontSize * 1.375,
              }
            ]}>
              {title}
            </Text>
          )}
          {children}
          {showClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={{ color: theme.colors.primary }}>Fechar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
});

