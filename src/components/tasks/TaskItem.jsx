/**
 * TaskItem Component
 * Item individual de tarefa
 */

import React, { memo } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { useTheme } from '../../hooks/useTheme';

const TaskItemComponent = ({ 
  task, 
  onPress, 
  isSelected = false 
}) => {
  const { colors } = useTheme();

  const getPriorityIcon = (prioridade) => {
    switch (prioridade) {
      case 'Baixa':
        return <FontAwesome name="exclamation" size={24} color="#4CAF50" />;
      case 'Média':
        return <FontAwesome name="exclamation" size={24} color="#FF9800" />;
      case 'Alta':
        return <FontAwesome name="exclamation" size={24} color="#F44336" />;
      default:
        return <FontAwesome name="question-circle" size={24} color="#757575" />;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(task.id)}>
      <Card 
        variant={isSelected ? 'selected' : 'default'}
        style={[
          styles.container,
          isSelected && { backgroundColor: colors.selected },
          task.status === 'Concluida' && styles.concluida
        ]}
      >
        <View style={styles.content}>
          {getPriorityIcon(task.prioridade)}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {task.nome}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {task.descricao}
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>
              {task.dataFinal}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
  concluida: {
    opacity: 0.7,
    backgroundColor: '#d3d3d3',
  },
});

TaskItemComponent.displayName = 'TaskItem';

export const TaskItem = memo(TaskItemComponent);
