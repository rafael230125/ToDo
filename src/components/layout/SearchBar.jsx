/**
 * SearchBar Component
 * Barra de busca com filtro
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export const SearchBar = ({
  value,
  onChangeText,
  onFilterPress,
}) => {
  const { colors, fontSize } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            fontSize,
          },
        ]}
        placeholder="Pesquisar tarefas..."
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <MaterialIcons name="filter-list" size={28} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    padding: 2,
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 10,
  },
});

