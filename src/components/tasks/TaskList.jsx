/**
 * TaskList Component
 * Lista de tarefas
 */

import React, { memo, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { TaskItem } from './TaskItem';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

const TaskListComponent = ({
  tasks,
  onTaskPress,
  selectedTaskId,
  loading = false,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
  onRefresh,
}) => {
  const { colors } = useTheme();
  const { lightImpact } = useHapticFeedback();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    lightImpact(); // Haptic feedback
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.skeletonContainer}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.skeletonItem}>
            <Skeleton width="100%" height={80} borderRadius={12} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <TaskItem
            task={item}
            onPress={onTaskPress}
            isSelected={item.id === selectedTaskId}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onComplete={onCompleteTask}
            index={index}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          ) : undefined
        }
        ListEmptyComponent={
          <EmptyState
            icon="task-alt"
            title="Nenhuma tarefa encontrada"
            message="Comece criando sua primeira tarefa!"
          />
        }
        contentContainerStyle={[
          styles.list,
          tasks.length === 0 && styles.emptyList
        ]}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
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
  skeletonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  skeletonItem: {
    marginBottom: 12,
  },
});

TaskListComponent.displayName = 'TaskList';

export const TaskList = memo(TaskListComponent);
