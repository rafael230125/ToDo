/**
 * TaskItem Component
 * Item individual de tarefa com novo Design System
 */

import React, { memo } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { useTheme } from '../../hooks/useTheme';

const TaskItemComponent = ({ 
  task, 
  onPress, 
  isSelected = false 
}) => {
  const { colors, spacing, borderRadius, shadows, semanticColors } = useTheme();

  const getPriorityIcon = (prioridade) => {
    const iconConfig = {
      'Baixa': { color: semanticColors.priority.low, name: 'arrow-down' },
      'Média': { color: semanticColors.priority.medium, name: 'minus' },
      'Alta': { color: semanticColors.priority.high, name: 'arrow-up' },
    };

    const config = iconConfig[prioridade] || { 
      color: semanticColors.priority.none, 
      name: 'question-circle' 
    };

    return (
      <View style={[
        styles.iconContainer,
        { 
          backgroundColor: `${config.color}15`, // 15 = ~8% opacity
        }
      ]}>
        <FontAwesome name={config.name} size={20} color={config.color} />
      </View>
    );
  };

  const isCompleted = task.status === 'Concluida';

  return (
    <TouchableOpacity 
      onPress={() => onPress(task.id)}
      activeOpacity={0.7}
    >
      <Card 
        variant={isSelected ? 'selected' : 'default'}
        style={[
          styles.container,
          isSelected && { 
            backgroundColor: colors.selected,
            borderWidth: 2,
            borderColor: colors.primary,
          },
          isCompleted && styles.concluida
        ]}
      >
        <View style={styles.content}>
          {getPriorityIcon(task.prioridade)}
          <View style={styles.textContainer}>
            <Text 
              style={[
                styles.title,
                { 
                  color: isCompleted ? colors.textSecondary : colors.text,
                  textDecorationLine: isCompleted ? 'line-through' : 'none',
                }
              ]}
              numberOfLines={1}
            >
              {task.nome}
            </Text>
            {task.descricao && (
              <Text 
                style={[
                  styles.description,
                  { color: colors.textSecondary }
                ]}
                numberOfLines={2}
              >
                {task.descricao}
              </Text>
            )}
            <View style={styles.footer}>
              <Text style={[styles.date, { color: colors.textTertiary }]}>
                {task.dataFinal}
              </Text>
              {task.status && (
                <View style={[
                  styles.statusBadge,
                  { 
                    backgroundColor: task.status === 'Concluida' 
                      ? semanticColors.status.completed + '20'
                      : semanticColors.status.pending + '20'
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { 
                      color: task.status === 'Concluida'
                        ? semanticColors.status.completed
                        : semanticColors.status.pending
                    }
                  ]}>
                    {task.status}
                  </Text>
                </View>
              )}
            </View>
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
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 14,
    fontWeight: '400',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  concluida: {
    opacity: 0.6,
  },
});

TaskItemComponent.displayName = 'TaskItem';

export const TaskItem = memo(TaskItemComponent);
