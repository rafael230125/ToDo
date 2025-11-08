/**
 * TaskItem Component
 * Item individual de tarefa com novo Design System
 */

import React, { memo, useRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { FadeInView } from '../animations/FadeInView';
import { SlideInView } from '../animations/SlideInView';
import { useTheme } from '../../hooks/useTheme';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

const TaskItemComponent = ({ 
  task, 
  onPress, 
  isSelected = false,
  onEdit,
  onDelete,
  onComplete,
  index = 0,
}) => {
  const { colors, spacing, borderRadius, shadows, semanticColors } = useTheme();
  const { mediumImpact, success } = useHapticFeedback();
  const swipeableRef = useRef(null);

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

  const handleEdit = (e) => {
    e?.stopPropagation();
    swipeableRef.current?.close();
    if (onEdit) {
      onEdit(task.id);
    }
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    swipeableRef.current?.close();
    mediumImpact(); // Haptic feedback
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const handleComplete = () => {
    swipeableRef.current?.close();
    success(); // Haptic feedback
    if (onComplete) {
      onComplete(task.id);
    }
  };

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteAction}
        activeOpacity={0.9}
      >
        <Animated.View 
          style={[
            styles.swipeButton, 
            styles.deleteButton,
            { 
              backgroundColor: semanticColors.error || '#f44336',
              transform: [{ scale }] 
            }
          ]}
        >
          <MaterialIcons name="delete" size={24} color="#FFF" />
          <Text style={styles.swipeButtonText}>Deletar</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    if (isCompleted) return null; // Não mostrar se já estiver completa

    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        onPress={handleComplete}
        style={styles.completeAction}
        activeOpacity={0.9}
      >
        <Animated.View 
          style={[
            styles.swipeButton, 
            styles.completeButton,
            { 
              backgroundColor: semanticColors.status.completed || '#4caf50',
              transform: [{ scale }] 
            }
          ]}
        >
          <MaterialIcons name="check" size={24} color="#FFF" />
          <Text style={styles.swipeButtonText}>Completar</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const getActionButtonStyle = (type) => {
    if (type === 'edit') {
      return {
        backgroundColor: `${colors.primary}15`,
        borderColor: colors.primary,
      };
    }
    return {
      backgroundColor: `${semanticColors.error || '#f44336'}15`,
      borderColor: semanticColors.error || '#f44336',
    };
  };

  return (
    <FadeInView duration={300} delay={index * 50}>
      <SlideInView direction="up" distance={50} delay={index * 50}>
        <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        overshootRight={false}
        overshootLeft={false}
        friction={2}
      >
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
        {isSelected && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, getActionButtonStyle('edit'), { marginRight: 8 }]}
              onPress={handleEdit}
              activeOpacity={0.7}
            >
              <MaterialIcons name="edit" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, getActionButtonStyle('delete')]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <MaterialIcons name="delete" size={20} color={semanticColors.error || '#f44336'} />
            </TouchableOpacity>
          </View>
        )}
        </Card>
      </TouchableOpacity>
      </Swipeable>
      </SlideInView>
    </FadeInView>
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
  },
  completeAction: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 100,
  },
  swipeButton: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  deleteButton: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  completeButton: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  swipeButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

TaskItemComponent.displayName = 'TaskItem';

export const TaskItem = memo(TaskItemComponent);
