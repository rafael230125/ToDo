/**
 * TaskList Component
 * Lista de tarefas
 */

import React, { memo } from 'react';
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { TaskItem } from './TaskItem';
import { useTheme } from '../../hooks/useTheme';

const TaskListComponent = ({
  tasks,
  onTaskPress,
  selectedTaskId,
  loading = false,
}) => {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onPress={onTaskPress}
          isSelected={item.id === selectedTaskId}
        />
      )}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={{ color: colors.text }}>
            Nenhuma tarefa encontrada
          </Text>
        </View>
      }
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

TaskListComponent.displayName = 'TaskList';

export const TaskList = memo(TaskListComponent);
