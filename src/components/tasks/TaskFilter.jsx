/**
 * TaskFilter Component
 * Modal de filtros de tarefas
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal } from '../common/Modal';
import { useTheme } from '../../hooks/useTheme';

export const TaskFilter = ({
  visible,
  onClose,
  selectedFilter,
  onFilterChange,
  onClearFilters,
}) => {
  const { colors, fontSize } = useTheme();

  const filterOptions = [
    { id: 'prioridade', label: 'Prioridade' },
    { id: 'data', label: 'Data final' },
    { id: 'status', label: 'Concluidas' },
    { id: null, label: 'Sem Filtros' },
  ];

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Filtrar por"
    >
      {filterOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          onPress={() => {
            onClose();
            if (option.id === null) {
              onClearFilters();
            } else {
              onFilterChange(option.id);
            }
          }}
          style={[
            styles.option,
            selectedFilter === option.id && { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.optionText,
              { color: colors.text, fontSize },
              selectedFilter === option.id && { color: '#fff' },
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Modal>
  );
};

const styles = StyleSheet.create({
  option: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

