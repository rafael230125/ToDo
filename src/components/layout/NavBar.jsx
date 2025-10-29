/**
 * NavBar Component
 * Barra de navegação inferior
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export const NavBar = ({ 
  onHome,
  onDelete,
  onAdd,
  onEdit,
  onSettings,
  canDelete = false,
  canEdit = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.navBar, { backgroundColor: colors.primary }]}>
      <TouchableOpacity style={styles.navButton} onPress={onHome}>
        <MaterialIcons name="home" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, { opacity: canDelete ? 1 : 0.5 }]}
        onPress={onDelete}
        disabled={!canDelete}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, styles.navButtonCenter]}
        onPress={onAdd}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, { opacity: canEdit ? 1 : 0.5 }]}
        onPress={onEdit}
        disabled={!canEdit}
      >
        <MaterialIcons name="edit" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={onSettings}>
        <MaterialIcons name="settings" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 4,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
  },
  navButtonCenter: {
    backgroundColor: '#FFC107',
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 0,
  },
});

